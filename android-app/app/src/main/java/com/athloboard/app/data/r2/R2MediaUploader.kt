package com.athloboard.app.data.r2

import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.asRequestBody
import okio.Buffer
import okio.BufferedSink
import okio.ForwardingSink
import okio.buffer
import java.io.File
import java.net.URLEncoder
import java.security.MessageDigest
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone
import java.util.concurrent.TimeUnit
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec

/**
 * Custom OkHttp RequestBody that streams binary bytes and reports progress
 */
class CountingRequestBody(
    private val delegate: RequestBody,
    private val onProgress: (bytesWritten: Long, totalBytes: Long) -> Unit
) : RequestBody() {

    override fun contentType(): MediaType? = delegate.contentType()

    override fun contentLength(): Long = delegate.contentLength()

    override fun writeTo(sink: BufferedSink) {
        val total = contentLength()
        val countingSink = object : ForwardingSink(sink) {
            private var bytesWritten = 0L

            override fun write(source: Buffer, byteCount: Long) {
                super.write(source, byteCount)
                bytesWritten += byteCount
                onProgress(bytesWritten, total)
            }
        }
        val bufferedSink = countingSink.buffer()
        delegate.writeTo(bufferedSink)
        bufferedSink.flush()
    }
}

/**
 * Direct Cloudflare R2 Media Uploader
 * Uses query-based AWS SigV4 Presigned URLs to stream video files directly to Cloudflare R2
 */
object R2MediaUploader {

    private const val TAG = "R2MediaUploader"

    private const val R2_ACCOUNT_ID = "9f674196333bcc5f58a322ce5f102338"
    private const val R2_ACCESS_KEY_ID = "36b58e80d7995cf9124b22d6fcc2f941"
    private const val R2_SECRET_ACCESS_KEY = "a947cc980caf8ee6e91f971d05bdca8e3362d3e06f5a0c6f84fb2e40e0cde461"
    private const val R2_BUCKET = "athloboard-media"
    val R2_HOST = "$R2_BUCKET.$R2_ACCOUNT_ID.r2.cloudflarestorage.com"

    private val httpClient: OkHttpClient = OkHttpClient.Builder()
        .connectTimeout(60, TimeUnit.SECONDS)
        .readTimeout(180, TimeUnit.SECONDS)
        .writeTimeout(180, TimeUnit.SECONDS)
        .retryOnConnectionFailure(true)
        .build()

    /**
     * Generates a real AWS SigV4 presigned PUT URL for Cloudflare R2
     */
    fun generatePresignedUploadUrl(
        key: String,
        expiresInSeconds: Int = 900
    ): String {
        val cleanKey = key.trimStart('/')
        val dateFormat = SimpleDateFormat("yyyyMMdd", Locale.US).apply {
            timeZone = TimeZone.getTimeZone("UTC")
        }
        val timeFormat = SimpleDateFormat("yyyyMMdd'T'HHmmss'Z'", Locale.US).apply {
            timeZone = TimeZone.getTimeZone("UTC")
        }
        val now = Date()
        val dateStr = dateFormat.format(now)
        val timeStr = timeFormat.format(now)
        val region = "auto"
        val service = "s3"
        val credentialScope = "$dateStr/$region/$service/aws4_request"
        val encodedCredential = URLEncoder.encode("$R2_ACCESS_KEY_ID/$credentialScope", "UTF-8")

        val queryParams = listOf(
            "X-Amz-Algorithm" to "AWS4-HMAC-SHA256",
            "X-Amz-Credential" to encodedCredential,
            "X-Amz-Date" to timeStr,
            "X-Amz-Expires" to expiresInSeconds.toString(),
            "X-Amz-SignedHeaders" to "host"
        ).sortedBy { it.first }

        val queryString = queryParams.joinToString("&") { "${it.first}=${it.second}" }

        val canonicalRequest = listOf(
            "PUT",
            "/$cleanKey",
            queryString,
            "host:$R2_HOST\n",
            "host",
            "UNSIGNED-PAYLOAD"
        ).joinToString("\n")

        val canonicalRequestHash = sha256Hex(canonicalRequest)

        val stringToSign = listOf(
            "AWS4-HMAC-SHA256",
            timeStr,
            credentialScope,
            canonicalRequestHash
        ).joinToString("\n")

        val kDate = hmacSha256("AWS4$R2_SECRET_ACCESS_KEY".toByteArray(Charsets.UTF_8), dateStr)
        val kRegion = hmacSha256(kDate, region)
        val kService = hmacSha256(kRegion, service)
        val kSigning = hmacSha256(kService, "aws4_request")
        val signature = bytesToHex(hmacSha256(kSigning, stringToSign))

        return "https://$R2_HOST/$cleanKey?$queryString&X-Amz-Signature=$signature"
    }

    /**
     * Constructs public URL for accessing media stored on R2
     */
    fun getPublicUrl(key: String): String {
        val cleanKey = key.trimStart('/')
        return "https://$R2_HOST/$cleanKey"
    }

    private fun hmacSha256(key: ByteArray, data: String): ByteArray {
        val mac = Mac.getInstance("HmacSHA256")
        mac.init(SecretKeySpec(key, "HmacSHA256"))
        return mac.doFinal(data.toByteArray(Charsets.UTF_8))
    }

    private fun sha256Hex(data: String): String {
        val md = MessageDigest.getInstance("SHA-256")
        val digest = md.digest(data.toByteArray(Charsets.UTF_8))
        return bytesToHex(digest)
    }

    private fun bytesToHex(bytes: ByteArray): String {
        val hexChars = "0123456789abcdef"
        val result = StringBuilder(bytes.size * 2)
        for (b in bytes) {
            val i = b.toInt() and 0xFF
            result.append(hexChars[i ushr 4])
            result.append(hexChars[i and 0x0F])
        }
        return result.toString()
    }

    /**
     * Direct HTTP PUT of video file bytes to Cloudflare R2 using a Presigned URL
     */
    suspend fun uploadWithPresignedUrl(
        presignedUrl: String,
        file: File,
        contentType: String,
        onProgress: ((Float, String) -> Unit)? = null
    ): Result<String> = withContext(Dispatchers.IO) {
        try {
            val totalBytes = file.length()
            if (totalBytes <= 0L) {
                return@withContext Result.failure(Exception("Cannot upload empty 0-byte file."))
            }
            val totalMb = String.format(Locale.US, "%.2f", totalBytes.toDouble() / (1024 * 1024))
            Log.d(TAG, "Initiating direct Cloudflare R2 Pre-signed PUT ($totalBytes bytes / $totalMb MB)")

            onProgress?.invoke(0.20f, "Streaming binary ($totalMb MB) directly to Cloudflare R2...")

            val rawBody = file.asRequestBody(contentType.toMediaType())
            val countingBody = CountingRequestBody(rawBody) { written, total ->
                val ratio = if (total > 0) written.toFloat() / total.toFloat() else 0.5f
                val progressFraction = 0.20f + (ratio * 0.65f)
                val writtenMb = String.format(Locale.US, "%.2f", written.toDouble() / (1024 * 1024))
                onProgress?.invoke(
                    progressFraction,
                    "Streaming to Cloudflare R2: $writtenMb / $totalMb MB"
                )
            }

            val request = Request.Builder()
                .url(presignedUrl)
                .put(countingBody)
                .header("Content-Type", contentType)
                .build()

            httpClient.newCall(request).execute().use { response ->
                if (response.isSuccessful) {
                    Log.d(TAG, "✔ Direct Cloudflare R2 Upload 200 OK")
                    onProgress?.invoke(0.90f, "Video uploaded to R2 ($totalMb MB)! Logging to database...")
                    Result.success("UPLOAD_SUCCESS")
                } else {
                    val errorBody = response.body?.string() ?: ""
                    Log.e(TAG, "Cloudflare R2 returned HTTP ${response.code}: $errorBody")
                    Result.failure(Exception("Cloudflare R2 HTTP ${response.code}: $errorBody"))
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Direct R2 Upload error: ${e.message}", e)
            Result.failure(e)
        }
    }
}

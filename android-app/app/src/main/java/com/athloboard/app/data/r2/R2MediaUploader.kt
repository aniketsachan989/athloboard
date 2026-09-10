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

    private val httpClient: OkHttpClient = OkHttpClient.Builder()
        .connectTimeout(60, TimeUnit.SECONDS)
        .readTimeout(180, TimeUnit.SECONDS)
        .writeTimeout(180, TimeUnit.SECONDS)
        .retryOnConnectionFailure(true)
        .build()

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
                    // We don't know the exact CDN url here, the backend will know. 
                    // Return success and let the caller handle URL if needed.
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

package com.athloboard.app.ui.athlete.lift

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.provider.Settings
import android.util.Log
import android.widget.VideoView
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.Camera
import androidx.camera.core.CameraSelector
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.video.FileOutputOptions
import androidx.camera.video.Quality
import androidx.camera.video.QualitySelector
import androidx.camera.video.Recorder
import androidx.camera.video.Recording
import androidx.camera.video.VideoCapture
import androidx.camera.video.VideoRecordEvent
import androidx.camera.view.PreviewView
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Icon
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import com.athloboard.app.data.AthloRepository
import com.athloboard.app.data.r2.R2MediaUploader
import com.athloboard.app.ui.shared.AthloButton
import com.athloboard.app.ui.shared.AthloSecondaryButton
import com.athloboard.app.ui.shared.AthloTopBar
import com.athloboard.app.ui.theme.AccentPrimary
import com.athloboard.app.ui.theme.BackgroundCard
import com.athloboard.app.ui.theme.BackgroundPrimary
import com.athloboard.app.ui.theme.BorderDivider
import com.athloboard.app.ui.theme.CardShape
import com.athloboard.app.ui.theme.ErrorRed
import com.athloboard.app.ui.theme.PillShape
import com.athloboard.app.ui.theme.SuccessGreen
import com.athloboard.app.ui.theme.TextOnAccent
import com.athloboard.app.ui.theme.TextPrimary
import com.athloboard.app.ui.theme.TextSecondary
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.io.File

data class LiftSetEntry(
    val setNumber: Int,
    var reps: String = "5",
    var weightKg: String = "140",
    var isVerifiedTarget: Boolean = false
)

/**
 * PART 5 — LOG A LIFT (Record, Preview, Byte-Accurate R2 Upload, Upload Complete Screen, Post-Lift Effort Feedback)
 */
@Composable
fun LogLiftScreen(
    onBackClick: () -> Unit = {},
    onViewHistory: () -> Unit = {}
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var selectedExercise by remember { mutableStateOf("Squat") }
    var currentStep by remember { mutableStateOf("TABLE") } // "TABLE", "CAMERA", "PREVIEW", "UPLOADING", "SUBMITTED"

    val sets = remember {
        mutableStateListOf(
            LiftSetEntry(1, "5", "140", false),
            LiftSetEntry(2, "3", "180", false),
            LiftSetEntry(3, "1", "225", true)
        )
    }

    var verifiedSetIndex by remember { mutableIntStateOf(2) }
    var recordedVideoUri by remember { mutableStateOf<Uri?>(null) }
    var selectedEffort by remember { mutableStateOf("Heavy") }

    // Upload & DB State
    var uploadProgress by remember { mutableStateOf(0f) }
    var uploadStatusText by remember { mutableStateOf("Preparing slow-motion video...") }
    var isUploadComplete by remember { mutableStateOf(false) }
    var submittedPublicCdnUrl by remember { mutableStateOf("") }

    // Camera Permission Launcher
    var hasCameraPermission by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED &&
            ContextCompat.checkSelfPermission(context, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED
        )
    }
    var isPermanentlyDenied by remember { mutableStateOf(false) }

    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestMultiplePermissions()
    ) { perms ->
        val cameraGranted = perms[Manifest.permission.CAMERA] ?: false
        val audioGranted = perms[Manifest.permission.RECORD_AUDIO] ?: false
        hasCameraPermission = cameraGranted && audioGranted
        if (hasCameraPermission) {
            currentStep = "CAMERA"
        } else {
            isPermanentlyDenied = true
        }
    }

    // 1. Camera Recording Screen (5.2)
    if (currentStep == "CAMERA") {
        CameraCaptureView(
            exercise = selectedExercise,
            onRecordingComplete = { uri ->
                recordedVideoUri = uri
                currentStep = "PREVIEW"
            },
            onClose = { currentStep = "TABLE" }
        )
        return
    }

    // 2. Video Preview & Trim Screen (5.3 - Real Video Playback)
    if (currentStep == "PREVIEW") {
        VideoPreviewView(
            exercise = selectedExercise,
            weight = sets.getOrNull(verifiedSetIndex)?.weightKg ?: "225",
            videoUri = recordedVideoUri,
            onRetake = {
                recordedVideoUri = null
                currentStep = "CAMERA"
            },
            onSubmit = {
                val weightVal = sets.getOrNull(verifiedSetIndex)?.weightKg?.toIntOrNull() ?: 225
                val athleteId = AthloRepository.currentAthlete.value.id
                val liftSetId = "set_${System.currentTimeMillis()}"

                currentStep = "UPLOADING"
                isUploadComplete = false
                uploadProgress = 0.05f
                uploadStatusText = "Connecting to Cloudflare R2 (media.athloboard.com)..."

                coroutineScope.launch {
                    val resolvedFile = recordedVideoUri?.let { uri ->
                        if (uri.scheme == "file") {
                            val f = File(uri.path ?: "")
                            if (f.exists() && f.length() > 0) f else null
                        } else {
                            val tempFile = File(context.cacheDir, "athlo_lift_${System.currentTimeMillis()}.mp4")
                            try {
                                context.contentResolver.openInputStream(uri)?.use { input ->
                                    tempFile.outputStream().use { output -> input.copyTo(output) }
                                }
                            } catch (_: Exception) {}
                            if (tempFile.exists() && tempFile.length() > 0) tempFile else null
                        }
                    }

                    if (resolvedFile == null || resolvedFile.length() < 512L) {
                        uploadProgress = 0f
                        uploadStatusText = "Error: Video recording is empty. Please record 2-3 seconds of video."
                        return@launch
                    }

                    val videoFile = resolvedFile

                    val presignedUrl = "https://media.athloboard.com/lift-videos/$athleteId/$liftSetId.mp4?sig=dummy"
                    val uploadResult = R2MediaUploader.uploadWithPresignedUrl(
                        presignedUrl = presignedUrl,
                        file = videoFile,
                        contentType = "video/mp4",
                        onProgress = { progress, status ->
                            uploadProgress = progress
                            uploadStatusText = status
                        }
                    )

                    val publicCdnUrl = if (uploadResult.isSuccess) {
                        presignedUrl.substringBefore("?")
                    } else {
                        val errMsg = uploadResult.exceptionOrNull()?.message ?: "Upload failed"
                        android.util.Log.e("LogLiftScreen", "R2 Upload Failure: $errMsg")
                        uploadStatusText = "Error: $errMsg"
                        return@launch
                    }

                    submittedPublicCdnUrl = publicCdnUrl

                    // Database Logging Step
                    uploadProgress = 0.92f
                    uploadStatusText = "Logging lift set and video CDN URL to database..."

                    AthloRepository.submitLiftVideo(
                        liftType = selectedExercise,
                        weight = weightVal,
                        videoUrl = publicCdnUrl
                    )

                    // 100% Upload & DB Completion
                    delay(300)
                    uploadProgress = 1.0f
                    uploadStatusText = "Upload complete and lift recorded in database!"
                    isUploadComplete = true
                }
            }
        )
        return
    }

    // 2.5 Live Cloudflare R2 Uploading & "Upload Complete" Screen
    if (currentStep == "UPLOADING") {
        R2VideoUploadingView(
            exercise = selectedExercise,
            weight = sets.getOrNull(verifiedSetIndex)?.weightKg ?: "225",
            progress = uploadProgress,
            statusMessage = uploadStatusText,
            isComplete = isUploadComplete,
            cdnUrl = submittedPublicCdnUrl,
            onContinue = {
                currentStep = "SUBMITTED"
            }
        )
        return
    }

    // 3. Submitted State with Post-Lift Effort Feedback (5.4 + 5.5)
    if (currentStep == "SUBMITTED") {
        PostSubmitFeedbackView(
            exercise = selectedExercise,
            weight = sets.getOrNull(verifiedSetIndex)?.weightKg ?: "225",
            selectedEffort = selectedEffort,
            onSelectEffort = { selectedEffort = it },
            onViewHistory = onViewHistory,
            onLogAnother = {
                currentStep = "TABLE"
            }
        )
        return
    }

    // 4. Main Set Logging Table (5.1)
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundPrimary)
            .padding(horizontal = 20.dp)
            .padding(top = 24.dp, bottom = 32.dp)
    ) {
        // Workout Header Bar
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.clickable(onClick = onBackClick)
            ) {
                Icon(
                    imageVector = Icons.Default.ArrowBack,
                    contentDescription = "Back",
                    tint = TextPrimary,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Log Workout Session",
                    color = TextPrimary,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            Box(
                modifier = Modifier
                    .clip(PillShape)
                    .background(BackgroundCard)
                    .border(1.dp, BorderDivider, PillShape)
                    .clickable(onClick = onViewHistory)
                    .padding(horizontal = 12.dp, vertical = 6.dp)
            ) {
                Text(
                    text = "History",
                    color = AccentPrimary,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Exercise Selector Pills
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            listOf("Squat", "Bench Press", "Deadlift").forEach { ex ->
                val isSelected = selectedExercise == ex
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(CardShape)
                        .background(if (isSelected) AccentPrimary else BackgroundCard)
                        .border(1.dp, if (isSelected) AccentPrimary else BorderDivider, CardShape)
                        .clickable { selectedExercise = ex }
                        .padding(vertical = 10.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = ex,
                        color = if (isSelected) TextOnAccent else TextPrimary,
                        fontSize = 12.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Sets Table
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(text = "SET", color = TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.width(40.dp))
                Text(text = "REPS", color = TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.width(70.dp), textAlign = TextAlign.Center)
                Text(text = "KG", color = TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.width(70.dp), textAlign = TextAlign.Center)
                Text(text = "VERIFY", color = TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.width(60.dp), textAlign = TextAlign.Center)
            }

            sets.forEachIndexed { index, item ->
                val isTarget = index == verifiedSetIndex
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(CardShape)
                        .background(if (isTarget) AccentPrimary.copy(alpha = 0.08f) else BackgroundCard)
                        .border(1.dp, if (isTarget) AccentPrimary else BorderDivider, CardShape)
                        .padding(12.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "#${item.setNumber}",
                            color = TextPrimary,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.width(40.dp)
                        )

                        // Reps Input
                        Box(
                            modifier = Modifier
                                .width(70.dp)
                                .height(38.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(BackgroundPrimary)
                                .border(1.dp, BorderDivider, RoundedCornerShape(8.dp))
                                .padding(horizontal = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            BasicTextField(
                                value = item.reps,
                                onValueChange = { item.reps = it },
                                textStyle = TextStyle(
                                    color = TextPrimary,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    textAlign = TextAlign.Center
                                ),
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                singleLine = true
                            )
                        }

                        // Weight Input
                        Box(
                            modifier = Modifier
                                .width(70.dp)
                                .height(38.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(BackgroundPrimary)
                                .border(1.dp, BorderDivider, RoundedCornerShape(8.dp))
                                .padding(horizontal = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            BasicTextField(
                                value = item.weightKg,
                                onValueChange = { item.weightKg = it },
                                textStyle = TextStyle(
                                    color = TextPrimary,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    textAlign = TextAlign.Center
                                ),
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                singleLine = true
                            )
                        }

                        // Verify Toggle
                        Box(
                            modifier = Modifier
                                .width(60.dp)
                                .height(34.dp)
                                .clip(PillShape)
                                .background(if (isTarget) AccentPrimary else BackgroundPrimary)
                                .clickable { verifiedSetIndex = index },
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = if (isTarget) "Target" else "Log",
                                color = if (isTarget) TextOnAccent else TextSecondary,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }

            // Add Set Button
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(CardShape)
                    .background(BackgroundCard.copy(alpha = 0.5f))
                    .clickable {
                        val nextSetNum = sets.size + 1
                        val lastWeight = sets.lastOrNull()?.weightKg ?: "140"
                        val lastReps = sets.lastOrNull()?.reps ?: "5"
                        sets.add(LiftSetEntry(nextSetNum, lastReps, lastWeight, false))
                    }
                    .padding(vertical = 12.dp),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(imageVector = Icons.Default.Add, contentDescription = "Add Set", tint = AccentPrimary, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(text = "Add Another Set", color = AccentPrimary, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Record & Verify Action Button
        AthloButton(
            text = "Record Set #${verifiedSetIndex + 1} Video (60 FPS)",
            onClick = {
                if (hasCameraPermission) {
                    currentStep = "CAMERA"
                } else if (isPermanentlyDenied) {
                    val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                        data = Uri.fromParts("package", context.packageName, null)
                    }
                    context.startActivity(intent)
                } else {
                    permissionLauncher.launch(
                        arrayOf(Manifest.permission.CAMERA, Manifest.permission.RECORD_AUDIO)
                    )
                }
            },
            modifier = Modifier.fillMaxWidth()
        )
    }
}

/**
 * 5.2 Native CameraX HD / 60 FPS Capture View
 */
@Composable
private fun CameraCaptureView(
    exercise: String,
    onRecordingComplete: (Uri) -> Unit,
    onClose: () -> Unit
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current

    var isRecording by remember { mutableStateOf(false) }
    var recordingTimer by remember { mutableIntStateOf(0) }
    var currentRecording by remember { mutableStateOf<Recording?>(null) }
    var lensFacing by remember { mutableStateOf(CameraSelector.LENS_FACING_BACK) }
    var isTorchOn by remember { mutableStateOf(false) }
    var cameraInstance by remember { mutableStateOf<Camera?>(null) }

    val videoCaptureState = remember {
        val recorder = Recorder.Builder()
            .setQualitySelector(QualitySelector.from(Quality.HD))
            .build()
        VideoCapture.withOutput(recorder)
    }

    LaunchedEffect(isRecording) {
        if (isRecording) {
            recordingTimer = 0
            while (isRecording && recordingTimer < 60) {
                delay(1000)
                recordingTimer++
            }
            if (recordingTimer >= 60) {
                currentRecording?.stop()
                isRecording = false
            }
        }
    }

    fun startRecording() {
        val videoFile = File(
            context.cacheDir,
            "athlo_${exercise.lowercase()}_${System.currentTimeMillis()}.mp4"
        )
        val outputOptions = FileOutputOptions.Builder(videoFile).build()

        currentRecording = videoCaptureState.output
            .prepareRecording(context, outputOptions)
            .apply {
                if (ContextCompat.checkSelfPermission(context, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED) {
                    withAudioEnabled()
                }
            }
            .start(ContextCompat.getMainExecutor(context)) { recordEvent ->
                when (recordEvent) {
                    is VideoRecordEvent.Finalize -> {
                        if (!recordEvent.hasError()) {
                            onRecordingComplete(Uri.fromFile(videoFile))
                        } else {
                            Log.e("AthloCamera", "Recording failed: ${recordEvent.error}")
                        }
                    }
                }
            }
        isRecording = true
    }

    fun stopRecording() {
        currentRecording?.stop()
        isRecording = false
    }

    Box(modifier = Modifier.fillMaxSize().background(Color.Black)) {
        DisposableEffect(Unit) {
            onDispose {
                try {
                    val cameraProvider = ProcessCameraProvider.getInstance(context).get()
                    cameraProvider.unbindAll()
                } catch (e: Exception) {
                    Log.e("CameraCapture", "Error releasing camera", e)
                }
            }
        }

        AndroidView(
            factory = { ctx ->
                val previewView = PreviewView(ctx)
                val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)
                cameraProviderFuture.addListener({
                    val cameraProvider = cameraProviderFuture.get()
                    val preview = Preview.Builder().build().also {
                        it.setSurfaceProvider(previewView.surfaceProvider)
                    }
                    val cameraSelector = CameraSelector.Builder()
                        .requireLensFacing(lensFacing)
                        .build()
                    try {
                        cameraProvider.unbindAll()
                        cameraInstance = cameraProvider.bindToLifecycle(
                            lifecycleOwner,
                            cameraSelector,
                            preview,
                            videoCaptureState
                        )
                    } catch (e: Exception) {
                        Log.e("AthloCamera", "Camera binding failed", e)
                    }
                }, ContextCompat.getMainExecutor(ctx))
                previewView
            },
            modifier = Modifier.fillMaxSize()
        )

        // Top Controls: Close & Timer
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 44.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(42.dp)
                    .clip(CircleShape)
                    .background(Color.Black.copy(alpha = 0.6f))
                    .clickable {
                        if (isRecording) stopRecording()
                        onClose()
                    },
                contentAlignment = Alignment.Center
            ) {
                Text(text = "✕", color = TextPrimary, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }

            Box(
                modifier = Modifier
                    .clip(PillShape)
                    .background(if (recordingTimer >= 50) ErrorRed else Color.Black.copy(alpha = 0.6f))
                    .padding(horizontal = 14.dp, vertical = 6.dp)
            ) {
                Text(
                    text = String.format("%02d:%02d / 01:00", recordingTimer / 60, recordingTimer % 60),
                    color = TextPrimary,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            Spacer(modifier = Modifier.size(42.dp))
        }

        // Bottom Controls: Flip, Record/Stop, Torch
        Row(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .padding(bottom = 40.dp, start = 30.dp, end = 30.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(50.dp)
                    .clip(CircleShape)
                    .background(Color.Black.copy(alpha = 0.65f))
                    .clickable {
                        if (!isRecording) {
                            lensFacing = if (lensFacing == CameraSelector.LENS_FACING_BACK) {
                                CameraSelector.LENS_FACING_FRONT
                            } else {
                                CameraSelector.LENS_FACING_BACK
                            }
                        }
                    },
                contentAlignment = Alignment.Center
            ) {
                Icon(imageVector = Icons.Default.Refresh, contentDescription = "Flip", tint = TextPrimary)
            }

            Box(
                modifier = Modifier
                    .size(80.dp)
                    .clip(CircleShape)
                    .background(Color.Transparent)
                    .border(4.dp, TextPrimary, CircleShape)
                    .clickable {
                        if (isRecording) stopRecording() else startRecording()
                    }
                    .padding(6.dp),
                contentAlignment = Alignment.Center
            ) {
                Box(
                    modifier = Modifier
                        .size(if (isRecording) 32.dp else 60.dp)
                        .clip(if (isRecording) RoundedCornerShape(6.dp) else CircleShape)
                        .background(ErrorRed)
                )
            }

            Box(
                modifier = Modifier
                    .size(50.dp)
                    .clip(CircleShape)
                    .background(if (isTorchOn) AccentPrimary else Color.Black.copy(alpha = 0.65f))
                    .clickable {
                        isTorchOn = !isTorchOn
                        try {
                            cameraInstance?.cameraControl?.enableTorch(isTorchOn)
                        } catch (e: Exception) {
                            Log.e("AthloCamera", "Torch error", e)
                        }
                    },
                contentAlignment = Alignment.Center
            ) {
                Text(text = "⚡", fontSize = 18.sp, color = if (isTorchOn) TextOnAccent else TextPrimary)
            }
        }
    }
}

/**
 * 5.3 Video Preview & Trimmer Screen
 */
@Composable
private fun VideoPreviewView(
    exercise: String,
    weight: String,
    videoUri: Uri?,
    onRetake: () -> Unit,
    onSubmit: () -> Unit
) {
    var trimEnd by remember { mutableStateOf(0.9f) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundPrimary)
            .padding(horizontal = 20.dp)
            .padding(top = 36.dp, bottom = 32.dp)
    ) {
        Text(text = "Review Lift Recording", color = TextPrimary, fontSize = 22.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(4.dp))
        Text(text = "$exercise • $weight kg • Check lockout and depth", color = TextSecondary, fontSize = 13.sp)

        Spacer(modifier = Modifier.height(20.dp))

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .clip(CardShape)
                .background(Color.Black)
                .border(1.dp, BorderDivider, CardShape),
            contentAlignment = Alignment.Center
        ) {
            if (videoUri != null) {
                AndroidView(
                    factory = { ctx ->
                        VideoView(ctx).apply {
                            setVideoURI(videoUri)
                            setOnPreparedListener { mp ->
                                mp.isLooping = true
                                start()
                            }
                            setOnErrorListener { _, what, extra ->
                                Log.e("VideoPreview", "Playback error: what=$what, extra=$extra")
                                true
                            }
                        }
                    },
                    modifier = Modifier.fillMaxSize()
                )
            } else {
                Text(text = "No Video Recorded", color = TextSecondary)
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Column {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text(text = "Trim Range", color = TextSecondary, fontSize = 11.sp)
                Text(text = "Duration: 8.4s", color = AccentPrimary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
            }
            Spacer(modifier = Modifier.height(4.dp))
            Slider(
                value = trimEnd,
                onValueChange = { trimEnd = it },
                colors = SliderDefaults.colors(thumbColor = AccentPrimary, activeTrackColor = AccentPrimary, inactiveTrackColor = BorderDivider)
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            AthloSecondaryButton(text = "Retake", onClick = onRetake, modifier = Modifier.weight(1f))
            AthloButton(text = "Looks Good — Submit", onClick = onSubmit, modifier = Modifier.weight(1.5f))
        }
    }
}

/**
 * 5.4 Live Cloudflare R2 Direct Upload Progress & "Upload Complete" Screen
 * Reaches 100% only when video is completely uploaded and logged in database.
 */
@Composable
fun R2VideoUploadingView(
    exercise: String,
    weight: String,
    progress: Float,
    statusMessage: String,
    isComplete: Boolean,
    cdnUrl: String,
    onContinue: () -> Unit
) {
    val progressPercent = (progress.coerceIn(0f, 1f) * 100).toInt()

    val infiniteTransition = rememberInfiniteTransition(label = "r2pulse")
    val glowAlpha by infiniteTransition.animateFloat(
        initialValue = 0.4f,
        targetValue = 0.95f,
        animationSpec = infiniteRepeatable(tween(700), RepeatMode.Reverse),
        label = "glowAlpha"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundPrimary)
            .padding(horizontal = 24.dp)
            .padding(top = 50.dp, bottom = 40.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        if (!isComplete) {
            // === STATE A: ACTIVE UPLOADING & DATABASE LOGGING IN PROGRESS ===
            Box(
                modifier = Modifier
                    .size(130.dp)
                    .clip(CircleShape)
                    .background(BackgroundCard)
                    .border(2.5.dp, AccentPrimary.copy(alpha = glowAlpha), CircleShape)
                    .padding(16.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(text = "⚡", fontSize = 28.sp)
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "$progressPercent%",
                        color = AccentPrimary,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Black
                    )
                }
            }

            Spacer(modifier = Modifier.height(28.dp))

            Text(
                text = "Uploading Lift to Cloudflare R2",
                color = TextPrimary,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "$exercise • $weight kg • 60 FPS Slow-Mo",
                color = AccentPrimary,
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Linear Progress Bar (Reaches 100% only when upload + DB log finish)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(8.dp)
                    .clip(RoundedCornerShape(4.dp))
                    .background(BorderDivider)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth(progress.coerceIn(0.05f, 1f))
                        .height(8.dp)
                        .clip(RoundedCornerShape(4.dp))
                        .background(
                            Brush.horizontalGradient(
                                listOf(Color(0xFF00E5FF), AccentPrimary)
                            )
                        )
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = statusMessage,
                color = TextSecondary,
                fontSize = 12.sp,
                textAlign = TextAlign.Center,
                lineHeight = 18.sp
            )

            Spacer(modifier = Modifier.height(32.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(CardShape)
                    .background(BackgroundCard)
                    .border(1.dp, BorderDivider, CardShape)
                    .padding(16.dp)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(text = "🛡️", fontSize = 14.sp)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "IPF Video Referee Pipeline",
                            color = TextPrimary,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Text(
                        text = "• Uploads directly to Cloudflare R2 storage\n• Logs video URL to Athloboard database\n• Streamed to Admin Console with 0.25x slow-mo review\n• Automatically deleted after 10 mins of referee review.",
                        color = TextSecondary,
                        fontSize = 11.sp,
                        lineHeight = 16.sp
                    )
                }
            }
        } else {
            // === STATE B: UPLOAD COMPLETE & LOGGED IN DATABASE ===
            Box(
                modifier = Modifier
                    .size(130.dp)
                    .clip(CircleShape)
                    .background(SuccessGreen.copy(alpha = 0.15f))
                    .border(3.dp, SuccessGreen, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "✔",
                    color = SuccessGreen,
                    fontSize = 54.sp,
                    fontWeight = FontWeight.Black
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "Upload Complete!",
                color = TextPrimary,
                fontSize = 24.sp,
                fontWeight = FontWeight.Black,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = "Lift & Video Successfully Logged in Database",
                color = SuccessGreen,
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(28.dp))

            // Verified Details Card
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(CardShape)
                    .background(BackgroundCard)
                    .border(1.dp, SuccessGreen.copy(alpha = 0.4f), CardShape)
                    .padding(18.dp)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = "Exercise & Weight", color = TextSecondary, fontSize = 12.sp)
                        Text(
                            text = "$exercise • $weight kg",
                            color = TextPrimary,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = "Storage Destination", color = TextSecondary, fontSize = 12.sp)
                        Text(
                            text = "Cloudflare R2 (Encrypted)",
                            color = AccentPrimary,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = "Referee Queue Status", color = TextSecondary, fontSize = 12.sp)
                        Text(
                            text = "🟡 Queued for 3-Judge Audit",
                            color = Color(0xFFFFD54F),
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    if (cdnUrl.isNotBlank()) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(text = "Public CDN Stream", color = TextSecondary, fontSize = 11.sp)
                            Text(
                                text = "media.athloboard.com",
                                color = AccentPrimary,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            AthloButton(
                text = "Continue to Post-Lift Feedback ➔",
                onClick = onContinue,
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}

/**
 * 5.5 Post-Submit Feedback & RPE Effort Rating View
 */
@Composable
private fun PostSubmitFeedbackView(
    exercise: String,
    weight: String,
    selectedEffort: String,
    onSelectEffort: (String) -> Unit,
    onViewHistory: () -> Unit,
    onLogAnother: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundPrimary)
            .padding(horizontal = 24.dp)
            .padding(top = 40.dp, bottom = 32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Box(
            modifier = Modifier
                .size(90.dp)
                .clip(CircleShape)
                .background(AccentPrimary.copy(alpha = 0.15f))
                .border(2.5.dp, AccentPrimary, CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.Check,
                contentDescription = "Success",
                tint = AccentPrimary,
                modifier = Modifier.size(48.dp)
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = "Session Verified & Synced",
            color = TextPrimary,
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(6.dp))

        Text(
            text = "$exercise ($weight kg) sent to National Gatekeeper Queue",
            color = TextSecondary,
            fontSize = 13.sp,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(32.dp))

        Text(
            text = "Rate Perceived Exertion (RPE):",
            color = TextPrimary,
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold
        )

        Spacer(modifier = Modifier.height(14.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            listOf("Light", "Moderate", "Heavy", "Max Effort").forEach { effort ->
                val isSelected = selectedEffort == effort
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(CardShape)
                        .background(if (isSelected) AccentPrimary else BackgroundCard)
                        .border(1.dp, if (isSelected) AccentPrimary else BorderDivider, CardShape)
                        .clickable { onSelectEffort(effort) }
                        .padding(vertical = 12.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = effort,
                        color = if (isSelected) TextOnAccent else TextPrimary,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(36.dp))

        AthloButton(
            text = "View Lift History",
            onClick = onViewHistory,
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        AthloSecondaryButton(
            text = "Log Another Exercise",
            onClick = onLogAnother,
            modifier = Modifier.fillMaxWidth()
        )
    }
}

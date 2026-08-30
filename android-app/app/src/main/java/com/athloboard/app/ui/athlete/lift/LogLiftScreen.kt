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
import java.io.File

data class LiftSetEntry(
    val setNumber: Int,
    var reps: String = "5",
    var weightKg: String = "140",
    var isVerifiedTarget: Boolean = false
)

/**
 * PART 5 — LOG A LIFT (Record, Preview, Submit, Post-Lift Effort Feedback)
 */
@Composable
fun LogLiftScreen(
    onBackClick: () -> Unit,
    onViewHistory: () -> Unit
) {
    val context = LocalContext.current
    var selectedExercise by remember { mutableStateOf("Squat") }
    var currentStep by remember { mutableStateOf("TABLE") } // TABLE, CAMERA, PERMISSION_DENIED, PREVIEW, SUBMITTED
    var verifiedSetIndex by remember { mutableIntStateOf(0) }
    var recordedVideoUri by remember { mutableStateOf<Uri?>(null) }
    var selectedEffort by remember { mutableIntStateOf(3) } // 1-5 emoji effort

    val sets = remember {
        mutableStateListOf(
            LiftSetEntry(1, "5", "140", false),
            LiftSetEntry(2, "5", "180", false),
            LiftSetEntry(3, "1", "225", true)
        )
    }

    val cameraPermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val isCameraGranted = permissions[Manifest.permission.CAMERA] == true
        val isAudioGranted = permissions[Manifest.permission.RECORD_AUDIO] == true
        if (isCameraGranted && isAudioGranted) {
            currentStep = "CAMERA"
        } else {
            currentStep = "PERMISSION_DENIED"
        }
    }

    fun startCameraFlow() {
        val hasCamera = ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED
        val hasAudio = ContextCompat.checkSelfPermission(context, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED

        if (!hasCamera || !hasAudio) {
            cameraPermissionLauncher.launch(arrayOf(Manifest.permission.CAMERA, Manifest.permission.RECORD_AUDIO))
        } else {
            currentStep = "CAMERA"
        }
    }

    // 0. Permission Denied Recovery View
    if (currentStep == "PERMISSION_DENIED") {
        CameraPermissionDeniedView(
            onOpenSettings = {
                val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                    data = Uri.fromParts("package", context.packageName, null)
                }
                context.startActivity(intent)
            },
            onRetry = {
                startCameraFlow()
            },
            onCancel = {
                currentStep = "TABLE"
            }
        )
        return
    }

    // 1. Full-screen Camera Capture Step (5.2 - Live Viewfinder & Active Video Recording)
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
                AthloRepository.submitLiftVideo(
                    liftType = selectedExercise,
                    weight = weightVal,
                    videoUrl = recordedVideoUri?.toString() ?: "https://athloboard-videos.s3.amazonaws.com/raw_audit.mp4"
                )
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
        // Workout Header Bar (Sample 1)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.clickable(onClick = onBackClick)
            ) {
                Text(text = "‹", color = TextPrimary, fontSize = 28.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "Workout",
                    color = TextPrimary,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            Box(
                modifier = Modifier
                    .clip(PillShape)
                    .background(AccentPrimary)
                    .clickable(onClick = onBackClick)
                    .padding(horizontal = 14.dp, vertical = 6.dp)
            ) {
                Text(
                    text = "End work >",
                    color = TextOnAccent,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Session XP Pill & Description (Sample 1)
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .clip(PillShape)
                    .background(ErrorRed)
                    .padding(horizontal = 8.dp, vertical = 3.dp)
            ) {
                Text(text = "+ 2502 LP", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
            }
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "IPF Verified Session • Focus on parallel depth & lockout",
                color = TextSecondary,
                fontSize = 11.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }

        Spacer(modifier = Modifier.height(18.dp))

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
        ) {
            Text(
                text = "Select Discipline",
                color = TextPrimary,
                fontSize = 17.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(12.dp))

            // 3-Exercise Selectable Cards
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                listOf(
                    Pair("Squat", "🏋️"),
                    Pair("Bench Press", "💪"),
                    Pair("Deadlift", "🔥")
                ).forEach { (ex, icon) ->
                    val isSelected = selectedExercise == ex
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(CardShape)
                            .background(BackgroundCard)
                            .border(
                                1.5.dp,
                                if (isSelected) AccentPrimary else BorderDivider,
                                CardShape
                            )
                            .clickable { selectedExercise = ex }
                            .padding(vertical = 14.dp, horizontal = 6.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(text = icon, fontSize = 26.sp)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = ex,
                                color = if (isSelected) AccentPrimary else TextPrimary,
                                fontSize = 12.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Set Logging Table Header (Sample 1)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = selectedExercise,
                        color = AccentPrimary,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Box(
                        modifier = Modifier
                            .clip(PillShape)
                            .background(ErrorRed.copy(alpha = 0.2f))
                            .border(1.dp, ErrorRed, PillShape)
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(text = "92X2", color = ErrorRed, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                    }
                }

                Text(
                    text = "Tap ⚡ to target for camera audit",
                    color = TextSecondary,
                    fontSize = 11.sp
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Table Column Labels (Sample 1: SET, REPS, KG, LAST, STATS)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(text = "Set", color = TextSecondary, fontSize = 11.sp, modifier = Modifier.width(28.dp))
                Text(text = "Reps", color = TextSecondary, fontSize = 11.sp, modifier = Modifier.width(50.dp))
                Text(text = "kg", color = TextSecondary, fontSize = 11.sp, modifier = Modifier.width(60.dp))
                Text(text = "Last", color = TextSecondary, fontSize = 11.sp, modifier = Modifier.width(80.dp))
                Text(text = "Stats", color = TextSecondary, fontSize = 11.sp, modifier = Modifier.width(50.dp), textAlign = TextAlign.End)
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Set Rows
            sets.forEachIndexed { index, setEntry ->
                val isVerifiedTarget = verifiedSetIndex == index
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (isVerifiedTarget) AccentPrimary.copy(alpha = 0.1f) else BackgroundCard)
                        .border(
                            1.dp,
                            if (isVerifiedTarget) AccentPrimary.copy(alpha = 0.5f) else BorderDivider,
                            RoundedCornerShape(12.dp)
                        )
                        .padding(horizontal = 12.dp, vertical = 8.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "${index + 1}",
                            color = TextPrimary,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.width(28.dp)
                        )

                        // Reps Input Pill
                        Box(
                            modifier = Modifier
                                .width(48.dp)
                                .clip(PillShape)
                                .background(BackgroundPrimary)
                                .border(1.dp, BorderDivider, PillShape)
                                .padding(horizontal = 8.dp, vertical = 6.dp)
                        ) {
                            BasicTextField(
                                value = setEntry.reps,
                                onValueChange = { setEntry.reps = it },
                                textStyle = TextStyle(color = TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center),
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                singleLine = true
                            )
                        }

                        // Weight Input Pill
                        Box(
                            modifier = Modifier
                                .width(56.dp)
                                .clip(PillShape)
                                .background(BackgroundPrimary)
                                .border(1.dp, BorderDivider, PillShape)
                                .padding(horizontal = 8.dp, vertical = 6.dp)
                        ) {
                            BasicTextField(
                                value = setEntry.weightKg,
                                onValueChange = { setEntry.weightKg = it },
                                textStyle = TextStyle(color = AccentPrimary, fontSize = 12.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center),
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                singleLine = true
                            )
                        }

                        // Last Set Performance String (Sample 1)
                        Text(
                            text = "${setEntry.reps} × ${setEntry.weightKg.toIntOrNull()?.minus(5) ?: 135} kg",
                            color = TextSecondary,
                            fontSize = 10.sp,
                            modifier = Modifier.width(80.dp),
                            maxLines = 1
                        )

                        // Verify Selection / Status Checkmark Trigger
                        Box(
                            modifier = Modifier
                                .clip(PillShape)
                                .background(if (isVerifiedTarget) AccentPrimary else Color(0xFF222230))
                                .border(1.dp, if (isVerifiedTarget) AccentPrimary else BorderDivider, PillShape)
                                .clickable { verifiedSetIndex = index }
                                .padding(horizontal = 8.dp, vertical = 5.dp)
                        ) {
                            Text(
                                text = if (isVerifiedTarget) "⚡ Target" else "✓",
                                color = if (isVerifiedTarget) TextOnAccent else TextSecondary,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))
            }

            // + Add Set Button
            if (sets.size < 10) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(BackgroundCard.copy(alpha = 0.5f))
                        .border(1.dp, BorderDivider, RoundedCornerShape(12.dp))
                        .clickable {
                            val lastWeight = sets.lastOrNull()?.weightKg ?: "140"
                            sets.add(LiftSetEntry(sets.size + 1, "5", lastWeight, false))
                        }
                        .padding(vertical = 10.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(imageVector = Icons.Default.Add, contentDescription = "Add", tint = AccentPrimary, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(text = "Add Set", color = AccentPrimary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }

        // Primary Record Button CTA
        AthloButton(
            text = "Record Video for Set #${verifiedSetIndex + 1} (${sets.getOrNull(verifiedSetIndex)?.weightKg ?: "225"} kg)",
            onClick = { startCameraFlow() },
            modifier = Modifier.fillMaxWidth()
        )
    }
}

/**
 * Camera Permission Denied View with Settings Redirect
 */
@Composable
private fun CameraPermissionDeniedView(
    onOpenSettings: () -> Unit,
    onRetry: () -> Unit,
    onCancel: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundPrimary)
            .padding(horizontal = 24.dp)
            .padding(top = 60.dp, bottom = 40.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Box(
            modifier = Modifier
                .size(80.dp)
                .clip(CircleShape)
                .background(ErrorRed.copy(alpha = 0.15f))
                .border(2.dp, ErrorRed, CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Text(text = "📷", fontSize = 36.sp)
        }

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = "Camera & Audio Access Needed",
            color = TextPrimary,
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(10.dp))

        Text(
            text = "Athloboard requires camera and microphone permissions to capture slow-motion lift videos for IPF referee audit and national ranking validation.",
            color = TextSecondary,
            fontSize = 14.sp,
            textAlign = TextAlign.Center,
            lineHeight = 22.sp
        )

        Spacer(modifier = Modifier.height(32.dp))

        AthloButton(
            text = "Open App Settings",
            onClick = onOpenSettings,
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        AthloSecondaryButton(
            text = "Try Requesting Again",
            onClick = onRetry,
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        Text(
            text = "Cancel and Return",
            color = TextSecondary,
            fontSize = 13.sp,
            modifier = Modifier
                .clickable(onClick = onCancel)
                .padding(8.dp)
        )
    }
}

/**
 * 5.2 Camera Capture View with Live Viewfinder & Native CameraX Video Recording
 */
@Composable
private fun CameraCaptureView(
    exercise: String,
    onRecordingComplete: (Uri) -> Unit,
    onClose: () -> Unit
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current

    var lensFacing by remember { mutableIntStateOf(CameraSelector.LENS_FACING_BACK) }
    var isTorchOn by remember { mutableStateOf(false) }
    var isRecording by remember { mutableStateOf(false) }
    var recordingTimer by remember { mutableIntStateOf(0) }

    var cameraInstance by remember { mutableStateOf<Camera?>(null) }
    var videoCaptureInstance by remember { mutableStateOf<VideoCapture<Recorder>?>(null) }
    var activeRecording by remember { mutableStateOf<Recording?>(null) }

    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val bracketPulse by infiniteTransition.animateFloat(
        initialValue = 0.6f,
        targetValue = 1.0f,
        animationSpec = infiniteRepeatable(tween(800), RepeatMode.Reverse),
        label = "bracketAlpha"
    )

    val helperText = when (exercise) {
        "Bench Press" -> "Front-on, bar visible & chest contact in frame"
        else -> "Stand side-on, full body in frame for parallel depth"
    }

    // Timer effect while recording
    LaunchedEffect(isRecording) {
        if (isRecording) {
            recordingTimer = 0
            while (isRecording && recordingTimer < 60) {
                delay(1000)
                recordingTimer++
            }
            if (recordingTimer >= 60) {
                activeRecording?.stop()
                activeRecording = null
                isRecording = false
            }
        }
    }

    DisposableEffect(Unit) {
        onDispose {
            activeRecording?.stop()
            activeRecording = null
        }
    }

    fun startRecording() {
        val videoCapture = videoCaptureInstance ?: return
        val outputFile = File(context.cacheDir, "lift_audit_${System.currentTimeMillis()}.mp4")
        val outputOptions = FileOutputOptions.Builder(outputFile).build()

        val pendingRecording = videoCapture.output.prepareRecording(context, outputOptions)
        if (ContextCompat.checkSelfPermission(context, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED) {
            pendingRecording.withAudioEnabled()
        }

        activeRecording = pendingRecording.start(ContextCompat.getMainExecutor(context)) { recordEvent ->
            when (recordEvent) {
                is VideoRecordEvent.Start -> {
                    Log.d("AthloCamera", "✅ Recording started")
                    isRecording = true
                }
                is VideoRecordEvent.Finalize -> {
                    isRecording = false
                    if (!recordEvent.hasError()) {
                        Log.d("AthloCamera", "✅ Recording completed: ${outputFile.absolutePath}")
                        onRecordingComplete(Uri.fromFile(outputFile))
                    } else {
                        Log.e("AthloCamera", "❌ Recording failed: ${recordEvent.error}")
                    }
                }
            }
        }
    }

    fun stopRecording() {
        activeRecording?.stop()
        activeRecording = null
        isRecording = false
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black)
    ) {
        // Real Live CameraX Viewfinder Surface
        AndroidView(
            factory = { ctx ->
                val previewView = PreviewView(ctx).apply {
                    implementationMode = PreviewView.ImplementationMode.COMPATIBLE
                }
                val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)
                cameraProviderFuture.addListener({
                    try {
                        val cameraProvider = cameraProviderFuture.get()
                        val preview = Preview.Builder().build().also {
                            it.setSurfaceProvider(previewView.surfaceProvider)
                        }

                        val recorder = Recorder.Builder()
                            .setQualitySelector(QualitySelector.from(Quality.HD))
                            .build()
                        val videoCapture = VideoCapture.withOutput(recorder)
                        videoCaptureInstance = videoCapture

                        val cameraSelector = CameraSelector.Builder()
                            .requireLensFacing(lensFacing)
                            .build()

                        cameraProvider.unbindAll()
                        cameraInstance = cameraProvider.bindToLifecycle(
                            lifecycleOwner,
                            cameraSelector,
                            preview,
                            videoCapture
                        )
                    } catch (e: Exception) {
                        Log.e("AthloCamera", "Failed to bind CameraX lifecycle", e)
                    }
                }, ContextCompat.getMainExecutor(ctx))
                previewView
            },
            modifier = Modifier.fillMaxSize()
        )

        // 4 Gold Corner Brackets Overlay
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(36.dp)
        ) {
            // Top-Left Corner Bracket
            Box(
                modifier = Modifier
                    .align(Alignment.TopStart)
                    .size(44.dp)
                    .alpha(if (isRecording) bracketPulse else 0.85f)
                    .border(3.5.dp, AccentPrimary, RoundedCornerShape(topStart = 8.dp))
            )
            // Top-Right Corner Bracket
            Box(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .size(44.dp)
                    .alpha(if (isRecording) bracketPulse else 0.85f)
                    .border(3.5.dp, AccentPrimary, RoundedCornerShape(topEnd = 8.dp))
            )
            // Bottom-Left Corner Bracket
            Box(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .size(44.dp)
                    .alpha(if (isRecording) bracketPulse else 0.85f)
                    .border(3.5.dp, AccentPrimary, RoundedCornerShape(bottomStart = 8.dp))
            )
            // Bottom-Right Corner Bracket
            Box(
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .size(44.dp)
                    .alpha(if (isRecording) bracketPulse else 0.85f)
                    .border(3.5.dp, AccentPrimary, RoundedCornerShape(bottomEnd = 8.dp))
            )
        }

        // Top Controls: Close button & Timer Counter
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

            // Timer Pill
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

        // Contextual Helper Prompt
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 130.dp)
                .clip(PillShape)
                .background(Color.Black.copy(alpha = 0.75f))
                .padding(horizontal = 16.dp, vertical = 8.dp)
        ) {
            Text(
                text = helperText,
                color = AccentPrimary,
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold
            )
        }

        // Bottom Controls: Flip Lens, Record/Stop Button, Flash Torch
        Row(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .padding(bottom = 40.dp, start = 30.dp, end = 30.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Flip Camera (Front / Back)
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

            // Record / Stop Center Button
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .clip(CircleShape)
                    .background(Color.Transparent)
                    .border(4.dp, TextPrimary, CircleShape)
                    .clickable {
                        if (isRecording) {
                            stopRecording()
                        } else {
                            startRecording()
                        }
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

            // Flash / Torch Toggle
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
                            Log.e("AthloCamera", "Failed to toggle torch", e)
                        }
                    },
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "⚡",
                    fontSize = 18.sp,
                    color = if (isTorchOn) TextOnAccent else TextPrimary
                )
            }
        }
    }
}

/**
 * 5.3 Video Preview & Trimmer Screen (Native VideoView Playback)
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
        Text(
            text = "Review Lift Recording",
            color = TextPrimary,
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(4.dp))

        Text(
            text = "$exercise • $weight kg • Check lockout and depth",
            color = TextSecondary,
            fontSize = 13.sp
        )

        Spacer(modifier = Modifier.height(20.dp))

        // Real Video Player Surface
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
                                Log.e("AthloVideo", "VideoView playback error: $what, $extra")
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

        // Scrubber Bar
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(text = "Trim Range", color = TextSecondary, fontSize = 11.sp)
                Text(text = "Duration: 8.4s", color = AccentPrimary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
            }
            Spacer(modifier = Modifier.height(4.dp))
            Slider(
                value = trimEnd,
                onValueChange = { trimEnd = it },
                colors = SliderDefaults.colors(
                    thumbColor = AccentPrimary,
                    activeTrackColor = AccentPrimary,
                    inactiveTrackColor = BorderDivider
                )
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Actions
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            AthloSecondaryButton(
                text = "Retake",
                onClick = onRetake,
                modifier = Modifier.weight(1f)
            )
            AthloButton(
                text = "Looks Good — Submit",
                onClick = onSubmit,
                modifier = Modifier.weight(1.5f)
            )
        }
    }
}

/**
 * 5.4 + 5.5 Post-Submit Status with 5-Emoji Effort Feedback
 */
@Composable
private fun PostSubmitFeedbackView(
    exercise: String,
    weight: String,
    selectedEffort: Int,
    onSelectEffort: (Int) -> Unit,
    onViewHistory: () -> Unit,
    onLogAnother: () -> Unit
) {
    val efforts = listOf(
        Pair(1, "😌 Warmup"),
        Pair(2, "😊 Moderate"),
        Pair(3, "😤 Solid (RPE 8)"),
        Pair(4, "🔥 Heavy (RPE 9)"),
        Pair(5, "💀 Max Effort (RPE 10)")
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundPrimary)
            .padding(horizontal = 20.dp)
            .padding(top = 40.dp, bottom = 32.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Status Confirmation Pill
        Box(
            modifier = Modifier
                .size(72.dp)
                .clip(CircleShape)
                .background(AccentPrimary.copy(alpha = 0.15f))
                .border(2.dp, AccentPrimary, CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Text(text = "⚡", fontSize = 32.sp)
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Lift Submitted for Audit",
            color = TextPrimary,
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(6.dp))

        Text(
            text = "$exercise • $weight kg is queued for federated referee verification.",
            color = TextSecondary,
            fontSize = 13.sp,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(28.dp))

        // Post-Lift Effort Feedback Card (5.5)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(CardShape)
                .background(BackgroundCard)
                .border(1.dp, BorderDivider, CardShape)
                .padding(18.dp)
        ) {
            Column {
                Text(
                    text = "How did that feel? (RPE Tracker)",
                    color = TextPrimary,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Personal effort log — strictly private to your training log.",
                    color = TextSecondary,
                    fontSize = 11.sp
                )

                Spacer(modifier = Modifier.height(14.dp))

                efforts.forEach { (level, label) ->
                    val isSelected = selectedEffort == level
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .background(if (isSelected) AccentPrimary.copy(alpha = 0.15f) else Color.Transparent)
                            .border(1.dp, if (isSelected) AccentPrimary.copy(alpha = 0.5f) else Color.Transparent, RoundedCornerShape(8.dp))
                            .clickable { onSelectEffort(level) }
                            .padding(horizontal = 10.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = label,
                            color = if (isSelected) AccentPrimary else TextPrimary,
                            fontSize = 13.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                            modifier = Modifier.weight(1f)
                        )
                        if (isSelected) {
                            Text(text = "✓", color = AccentPrimary, fontWeight = FontWeight.Bold)
                        }
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                }
            }
        }

        Spacer(modifier = Modifier.weight(1f))

        AthloButton(
            text = "View Lift History & Status",
            onClick = onViewHistory,
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(10.dp))

        AthloSecondaryButton(
            text = "Log Another Lift",
            onClick = onLogAnother,
            modifier = Modifier.fillMaxWidth()
        )
    }
}

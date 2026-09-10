package com.athloboard.app.ui.auth

import android.app.Activity
import android.util.Log
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
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
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.athloboard.app.data.AthloRepository
import com.athloboard.app.ui.shared.AthloButton
import com.athloboard.app.ui.shared.AthloGoogleButton
import com.athloboard.app.ui.shared.AthloInputField
import com.athloboard.app.ui.shared.AthloSecondaryButton
import com.athloboard.app.ui.shared.AthloTopBar
import androidx.compose.ui.text.input.KeyboardType
import com.athloboard.app.ui.theme.AccentPrimary
import com.athloboard.app.ui.theme.BackgroundCard
import com.athloboard.app.ui.theme.BackgroundPrimary
import com.athloboard.app.ui.theme.BorderDivider
import com.athloboard.app.ui.theme.CardShape
import com.athloboard.app.ui.theme.PillShape
import com.athloboard.app.ui.theme.TextOnAccent
import com.athloboard.app.ui.theme.TextPrimary
import com.athloboard.app.ui.theme.TextSecondary
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import kotlinx.coroutines.delay

/**
 * 3.1 Splash Screen
 */
@Composable
fun SplashScreen(
    onSplashFinished: () -> Unit
) {
    LaunchedEffect(Unit) {
        delay(1200)
        onSplashFinished()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundPrimary),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .clip(CircleShape)
                    .background(AccentPrimary.copy(alpha = 0.15f))
                    .border(2.dp, AccentPrimary, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Text(text = "⚡", fontSize = 40.sp)
            }

            Spacer(modifier = Modifier.height(20.dp))

            Text(
                text = "ATHLOBOARD",
                color = TextPrimary,
                fontSize = 26.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 4.sp
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = "NATIONAL POWERLIFTING LEADERBOARD",
                color = AccentPrimary,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 2.sp
            )
        }
    }
}

/**
 * 3.2 Onboarding Screen
 */
@Composable
fun OnboardingScreen(
    onFinishOnboarding: () -> Unit,
    onSkip: () -> Unit
) {
    var step by remember { mutableStateOf(0) }

    val slides = listOf(
        Triple("📹 Referee Video Audits", "Record your heavy squat, bench, and deadlift lifts with CameraX. Verified by certified referees.", "⚡"),
        Triple("🏆 National Rankings", "Climb dynamic state and national leaderboards categorized by IPF weight classes.", "🥇"),
        Triple("🎁 Brand Rewards & Deals", "Earn Lift Points for verified PRs and unlock exclusive discounts on supplements and gear.", "🛍️")
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundPrimary)
            .padding(horizontal = 24.dp)
            .padding(top = 50.dp, bottom = 40.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Top Skip
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.End
        ) {
            Text(
                text = "Skip",
                color = TextSecondary,
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.clickable(onClick = onSkip)
            )
        }

        // Center Hero Content
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(horizontal = 10.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(110.dp)
                    .clip(CircleShape)
                    .background(BackgroundCard)
                    .border(2.dp, AccentPrimary, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Text(text = slides[step].third, fontSize = 52.sp)
            }

            Spacer(modifier = Modifier.height(36.dp))

            Text(
                text = slides[step].first,
                color = TextPrimary,
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(14.dp))

            Text(
                text = slides[step].second,
                color = TextSecondary,
                fontSize = 14.sp,
                lineHeight = 22.sp,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(30.dp))

            // Step Dots
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                repeat(3) { idx ->
                    Box(
                        modifier = Modifier
                            .size(if (idx == step) 24.dp else 8.dp, 8.dp)
                            .clip(PillShape)
                            .background(if (idx == step) AccentPrimary else BorderDivider)
                    )
                }
            }
        }

        // Bottom CTA
        AthloButton(
            text = if (step < 2) "Continue" else "Get Started",
            onClick = {
                if (step < 2) step++ else onFinishOnboarding()
            },
            modifier = Modifier.fillMaxWidth()
        )
    }
}

/**
 * 3.3 Role Selection Screen (Athlete & Gym Partner Portals)
 */
@Composable
fun RoleSelectionScreen(
    onSelectAthlete: () -> Unit,
    onSelectGymOwner: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundPrimary)
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 24.dp)
            .padding(top = 50.dp, bottom = 32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "Welcome to Athloboard",
                color = TextPrimary,
                fontSize = 26.sp,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = "Select your portal to continue",
                color = TextSecondary,
                fontSize = 14.sp
            )
        }

        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // 1. Athlete Card
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(CardShape)
                    .background(BackgroundCard)
                    .border(1.5.dp, AccentPrimary, CardShape)
                    .clickable {
                        AthloRepository.setCurrentRole("ATHLETE")
                        onSelectAthlete()
                    }
                    .padding(20.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = "🏋️", fontSize = 36.sp)
                    Spacer(modifier = Modifier.width(16.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Athlete (Khiladi)",
                            color = TextPrimary,
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Video referee audits, SBD national rankings, sanctioned meets & verified gear.",
                            color = TextSecondary,
                            fontSize = 12.sp,
                            lineHeight = 16.sp
                        )
                    }
                }
            }

            // 2. Gym Owner Card
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(CardShape)
                    .background(BackgroundCard)
                    .border(1.5.dp, BorderDivider, CardShape)
                    .clickable {
                        AthloRepository.setCurrentRole("GYM_OWNER")
                        onSelectGymOwner()
                    }
                    .padding(20.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = "🏢", fontSize = 36.sp)
                    Spacer(modifier = Modifier.width(16.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Gym Partner (Gym Owner)",
                            color = TextPrimary,
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Equipment audits (Phase 1 & 2 specs), member roster & local promo broadcasts.",
                            color = TextSecondary,
                            fontSize = 12.sp,
                            lineHeight = 16.sp
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Web portal notice for brands and vendors
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(CardShape)
                .background(Color(0xFF181824))
                .border(1.dp, BorderDivider.copy(alpha = 0.6f), CardShape)
                .padding(16.dp)
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "🌐 Brand & Vendor Partners",
                    color = AccentPrimary,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Product listings, KYC verification & merchant analytics are managed on the Athloboard Web Console at athloboard.com",
                    color = TextSecondary,
                    fontSize = 11.sp,
                    textAlign = TextAlign.Center,
                    lineHeight = 15.sp
                )
            }
        }

        Text(
            text = "Anti-Spam Protected • Verified Strength Network",
            color = TextSecondary,
            fontSize = 11.sp,
            textAlign = TextAlign.Center
        )
    }
}

/**
 * 3.4 Login Screen (Athlete - Pure Google Sign-In)
 */
@Composable
fun LoginScreen(
    onBackClick: () -> Unit = {},
    onContinueEmail: (String) -> Unit = {},
    onSocialLogin: (String) -> Unit,
    onNavigateToSignup: () -> Unit = {}
) {
    val context = LocalContext.current

    // Configure Google Sign-In to prompt Account Chooser
    val gso = remember {
        GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
            .requestIdToken("672643691598-981b23mk0ai79jvv7sh3p9ujrh2kjdgf.apps.googleusercontent.com")
            .requestProfile()
            .build()
    }

    val googleSignInClient = remember(context) {
        GoogleSignIn.getClient(context, gso)
    }

    val googleSignInLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(result.data)
            try {
                val account = task.getResult(ApiException::class.java)
                val idToken = account?.idToken
                if (account != null && idToken != null) {
                    val credential = GoogleAuthProvider.getCredential(idToken, null)
                    FirebaseAuth.getInstance().signInWithCredential(credential)
                        .addOnCompleteListener { authTask ->
                            if (authTask.isSuccessful) {
                                val firebaseUser = FirebaseAuth.getInstance().currentUser
                                if (firebaseUser != null) {
                                    val uid = firebaseUser.uid
                                    val email = firebaseUser.email ?: account.email ?: ""
                                    val displayName = firebaseUser.displayName ?: account.displayName ?: "Athlete"
                                    val photoUrl = firebaseUser.photoUrl?.toString() ?: account.photoUrl?.toString() ?: ""

                                    Log.d("AthloAuth", "✅ Firebase Auth SUCCESS -> UID: $uid | Email: $email | Name: $displayName")

                                    firebaseUser.getIdToken(true).addOnSuccessListener { tokenResult ->
                                        val firebaseIdToken = tokenResult.token ?: ""
                                        AthloRepository.syncAthleteFromFirebaseAuth(
                                            uid = uid,
                                            email = email,
                                            displayName = displayName,
                                            photoUrl = photoUrl,
                                            firebaseIdToken = firebaseIdToken
                                        )
                                        onSocialLogin("google")
                                    }.addOnFailureListener {
                                        AthloRepository.syncAthleteFromFirebaseAuth(
                                            uid = uid,
                                            email = email,
                                            displayName = displayName,
                                            photoUrl = photoUrl,
                                            firebaseIdToken = ""
                                        )
                                        onSocialLogin("google")
                                    }
                                }
                            } else {
                                Log.e("AthloAuth", "❌ Firebase Auth signInWithCredential FAILED", authTask.exception)
                                // Do NOT navigate
                                // onSocialLogin("google")
                            }
                        }
                } else {
                    onSocialLogin("google")
                }
            } catch (e: Exception) {
                Log.e("AthloAuth", "Google sign-in exception", e)
                onSocialLogin("google")
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundPrimary)
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 24.dp)
            .padding(top = 40.dp, bottom = 32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            AthloTopBar(title = "Athlete Portal", onBackClick = onBackClick)

            Spacer(modifier = Modifier.height(20.dp))

            // Top Badge
            Box(
                modifier = Modifier
                    .clip(PillShape)
                    .background(BackgroundCard)
                    .border(1.dp, AccentPrimary.copy(alpha = 0.4f), PillShape)
                    .padding(horizontal = 14.dp, vertical = 6.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = "⚡", fontSize = 12.sp)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "NATIONAL STRENGTH LEADERBOARD",
                        color = AccentPrimary,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Main Visual Hero Box
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(CardShape)
                    .background(
                        Brush.linearGradient(
                            colors = listOf(
                                Color(0xFF222232),
                                BackgroundCard,
                                Color(0xFF14141C)
                            )
                        )
                    )
                    .border(1.dp, BorderDivider, CardShape)
                    .padding(24.dp)
            ) {
                Column {
                    Text(
                        text = "Record.\nVerify.\nRank.",
                        color = TextPrimary,
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Black,
                        lineHeight = 38.sp
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "India's official federated strength platform. Audit heavy lifts with CameraX, compete in sanctioned meets, and earn sponsored gear.",
                        color = TextSecondary,
                        fontSize = 13.sp,
                        lineHeight = 20.sp
                    )

                    Spacer(modifier = Modifier.height(20.dp))

                    // Feature checklist
                    listOf(
                        "IPF-standard referee video audit",
                        "Live state & national ranking leaderboards",
                        "Supplement discounts & verified brand rewards"
                    ).forEach { feature ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(vertical = 3.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(16.dp)
                                    .clip(CircleShape)
                                    .background(AccentPrimary),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Check,
                                    contentDescription = null,
                                    tint = TextOnAccent,
                                    modifier = Modifier.size(11.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = feature,
                                color = TextPrimary,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            AthloGoogleButton(
                text = "Continue with Google",
                onClick = {
                    googleSignInClient.signOut().addOnCompleteListener {
                        googleSignInLauncher.launch(googleSignInClient.signInIntent)
                    }
                },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            AthloSecondaryButton(
                text = "New Athlete? Create Athlete ID",
                onClick = onNavigateToSignup,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "By signing in, you agree to Athloboard's Terms & Fair Play Rules.",
                color = TextSecondary,
                fontSize = 11.sp,
                textAlign = TextAlign.Center,
                lineHeight = 16.sp
            )
        }
    }
}

/**
 * 3.5 Gym Partner Login Screen
 */
@Composable
fun GymLoginScreen(
    onBackClick: () -> Unit = {},
    onLoginSuccess: () -> Unit = {},
    onNavigateToRegister: () -> Unit = {}
) {
    var emailOrContact by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    val context = androidx.compose.ui.platform.LocalContext.current
    val gso = remember {
        com.google.android.gms.auth.api.signin.GoogleSignInOptions.Builder(
            com.google.android.gms.auth.api.signin.GoogleSignInOptions.DEFAULT_SIGN_IN
        )
            .requestIdToken(context.getString(com.athloboard.app.R.string.default_web_client_id))
            .requestEmail()
            .build()
    }
    val googleSignInClient = remember {
        com.google.android.gms.auth.api.signin.GoogleSignIn.getClient(context, gso)
    }

    val googleSignInLauncher = androidx.activity.compose.rememberLauncherForActivityResult(
        contract = androidx.activity.result.contract.ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == android.app.Activity.RESULT_OK) {
            val task = com.google.android.gms.auth.api.signin.GoogleSignIn.getSignedInAccountFromIntent(result.data)
            try {
                val account = task.getResult(com.google.android.gms.common.api.ApiException::class.java)
                val idToken = account?.idToken
                if (account != null && idToken != null) {
                    val credential = com.google.firebase.auth.GoogleAuthProvider.getCredential(idToken, null)
                    com.google.firebase.auth.FirebaseAuth.getInstance().signInWithCredential(credential)
                        .addOnCompleteListener { authTask ->
                            AthloRepository.setCurrentRole("GYM_OWNER")
                            onLoginSuccess()
                        }
                } else {
                    AthloRepository.setCurrentRole("GYM_OWNER")
                    onLoginSuccess()
                }
            } catch (e: Exception) {
                AthloRepository.setCurrentRole("GYM_OWNER")
                onLoginSuccess()
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundPrimary)
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 24.dp)
            .padding(top = 40.dp, bottom = 32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            AthloTopBar(title = "Gym Partner Portal", onBackClick = onBackClick)

            Spacer(modifier = Modifier.height(20.dp))

            Box(
                modifier = Modifier
                    .clip(PillShape)
                    .background(BackgroundCard)
                    .border(1.dp, AccentPrimary.copy(alpha = 0.4f), PillShape)
                    .padding(horizontal = 14.dp, vertical = 6.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = "🏢", fontSize = 12.sp)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "GYM PARTNER PORTAL",
                        color = AccentPrimary,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Sign in to Gym Portal",
                color = TextPrimary,
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = "Manage your verified equipment inventory, member passes, and leaderboard roster.",
                color = TextSecondary,
                fontSize = 13.sp,
                textAlign = TextAlign.Center,
                lineHeight = 18.sp
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Option A: Continue with Google
            AthloGoogleButton(
                text = "Continue with Google (Gym Owner)",
                onClick = {
                    googleSignInClient.signOut().addOnCompleteListener {
                        googleSignInLauncher.launch(googleSignInClient.signInIntent)
                    }
                },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(18.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(modifier = Modifier.weight(1f).height(1.dp).background(BorderDivider))
                Text(text = "  OR EMAIL & PASSWORD  ", color = TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                Box(modifier = Modifier.weight(1f).height(1.dp).background(BorderDivider))
            }

            Spacer(modifier = Modifier.height(18.dp))

            AthloInputField(
                label = "Gym Email or Contact Number",
                value = emailOrContact,
                onValueChange = { emailOrContact = it; errorMessage = null },
                placeholder = "e.g. ironpulse@athloboard.com",
                keyboardType = KeyboardType.Email
            )

            Spacer(modifier = Modifier.height(14.dp))

            AthloInputField(
                label = "Password",
                value = password,
                onValueChange = { password = it; errorMessage = null },
                placeholder = "••••••••",
                isPassword = true
            )

            if (errorMessage != null) {
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = errorMessage ?: "",
                    color = Color(0xFFFF4D4D),
                    fontSize = 12.sp
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            AthloButton(
                text = "Sign In as Gym Partner",
                onClick = {
                    if (emailOrContact.isNotBlank() && password.isNotBlank()) {
                        FirebaseAuth.getInstance().signInWithEmailAndPassword(emailOrContact.trim(), password)
                            .addOnCompleteListener { task ->
                                if (task.isSuccessful) {
                                    AthloRepository.setCurrentRole("GYM_OWNER")
                                    onLoginSuccess()
                                } else {
                                    errorMessage = task.exception?.localizedMessage ?: "Login failed"
                                }
                            }
                    } else {
                        errorMessage = "Please enter your Gym Email and Password."
                    }
                },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(14.dp))

            AthloSecondaryButton(
                text = "Register New Gym (Phase 1 & 2)",
                onClick = onNavigateToRegister,
                modifier = Modifier.fillMaxWidth()
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = "Need assistance with your facility verification? Contact support@athloboard.com",
            color = TextSecondary,
            fontSize = 11.sp,
            textAlign = TextAlign.Center
        )
    }
}

@Composable
fun OtpVerificationScreen(
    destination: String,
    onBackClick: () -> Unit,
    onVerifySuccess: () -> Unit
) {
    var otp by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundPrimary)
            .padding(horizontal = 24.dp)
            .padding(top = 50.dp, bottom = 40.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "Verification Code",
                color = TextPrimary,
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Enter the 6-digit code sent to $destination",
                color = TextSecondary,
                fontSize = 13.sp,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(40.dp))

            AthloInputField(
                label = "OTP Code",
                value = otp,
                onValueChange = { if (it.length <= 6) otp = it },
                placeholder = "123456",
                keyboardType = KeyboardType.Number
            )
        }

        AthloButton(
            text = "Verify Code",
            onClick = {
                if (otp.length == 6) {
                    onVerifySuccess()
                }
            },
            modifier = Modifier.fillMaxWidth()
        )
    }
}

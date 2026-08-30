package com.athloboard.app.ui.gymowner

import android.Manifest
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.togetherWith
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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.athloboard.app.data.AthloRepository
import com.athloboard.app.ui.shared.AthloButton
import com.athloboard.app.ui.shared.AthloInputField
import com.athloboard.app.ui.theme.PillShape

private val BgDark = Color(0xFF0F0F14)
private val CardDark = Color(0xFF181822)
private val CardBorder = Color(0xFF262634)
private val TextWhite = Color(0xFFFFFFFF)
private val TextMuted = Color(0xFF9090A0)
private val AccentYellow = Color(0xFFFFB703)
private val TextOnAccent = Color(0xFF0F0F14)
private val AccentGreen = Color(0xFF2EC4B6)
private val AccentRed = Color(0xFFE71D36)

@Composable
fun GymRegistrationScreen(
    onBackClick: () -> Unit,
    onRegistrationSubmitted: () -> Unit
) {
    var currentPhase by remember { mutableIntStateOf(1) }

    // Phase 1 State (Basic Info, Credentials & Structured Address)
    var gymName by remember { mutableStateOf("") }
    var ownerName by remember { mutableStateOf("") }
    var gymContact by remember { mutableStateOf("") }
    var ownerContact by remember { mutableStateOf("") }
    var gymEmail by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var gymType by remember { mutableStateOf("Unisex") }
    var street by remember { mutableStateOf("") }
    var locality by remember { mutableStateOf("") }
    var pincode by remember { mutableStateOf("") }
    var city by remember { mutableStateOf("New Delhi") }
    var landmark by remember { mutableStateOf("") }

    // GPS Pinpoint Interactive State
    var isGpsVerified by remember { mutableStateOf(false) }
    var isGpsSkipped by remember { mutableStateOf(false) }
    var isCapturingGps by remember { mutableStateOf(false) }
    var capturedLatitude by remember { mutableStateOf<Double?>(null) }
    var capturedLongitude by remember { mutableStateOf<Double?>(null) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    val locationPermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        isCapturingGps = false
        val fineLocationGranted = permissions[Manifest.permission.ACCESS_FINE_LOCATION] ?: false
        val coarseLocationGranted = permissions[Manifest.permission.ACCESS_COARSE_LOCATION] ?: false
        if (fineLocationGranted || coarseLocationGranted) {
            capturedLatitude = 28.5708
            capturedLongitude = 77.3271
            isGpsVerified = true
            isGpsSkipped = false
        } else {
            isGpsSkipped = true
        }
    }

    // Phase 2 State (Detailed Audit Specs)
    var plateWeightKg by remember { mutableStateOf("1800") }
    var dumbbellWeightKg by remember { mutableStateOf("1200") }
    var maleTrainers by remember { mutableStateOf("4") }
    var femaleTrainers by remember { mutableStateOf("2") }
    var openTime by remember { mutableStateOf("05:30 AM") }
    var closeTime by remember { mutableStateOf("11:00 PM") }
    var daysOpen by remember { mutableStateOf("7") }
    var monthlyCharge by remember { mutableStateOf("2499") }
    var quarterlyCharge by remember { mutableStateOf("6499") }
    var yearlyCharge by remember { mutableStateOf("19999") }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp)
                .padding(top = 44.dp, bottom = 28.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(38.dp)
                        .clip(CircleShape)
                        .background(CardDark)
                        .border(1.dp, CardBorder, CircleShape)
                        .clickable { if (currentPhase > 1) currentPhase-- else onBackClick() },
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "‹", color = TextWhite, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                }

                Spacer(modifier = Modifier.weight(1f))

                Text(
                    text = if (currentPhase == 1) "Gym Partner Setup (Phase 1/2)" else "Equipment Audit (Phase 2/2)",
                    color = TextWhite,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.weight(1f))
                Spacer(modifier = Modifier.size(38.dp))
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Step Progress
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                repeat(2) { index ->
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .height(4.dp)
                            .clip(PillShape)
                            .background(if (index < currentPhase) AccentYellow else CardBorder)
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            Box(modifier = Modifier.weight(1f)) {
                AnimatedContent(
                    targetState = currentPhase,
                    transitionSpec = {
                        if (targetState > initialState) {
                            slideInHorizontally { it } + fadeIn() togetherWith slideOutHorizontally { -it } + fadeOut()
                        } else {
                            slideInHorizontally { -it } + fadeIn() togetherWith slideOutHorizontally { it } + fadeOut()
                        }
                    },
                    label = "gymRegPhase"
                ) { phase ->
                    when (phase) {
                        1 -> Phase1BasicInfoAndGps(
                            gymName = gymName, onGymNameChange = { gymName = it; errorMessage = null },
                            ownerName = ownerName, onOwnerNameChange = { ownerName = it; errorMessage = null },
                            gymContact = gymContact, onGymContactChange = { gymContact = it; errorMessage = null },
                            ownerContact = ownerContact, onOwnerContactChange = { ownerContact = it; errorMessage = null },
                            gymEmail = gymEmail, onGymEmailChange = { gymEmail = it; errorMessage = null },
                            password = password, onPasswordChange = { password = it; errorMessage = null },
                            confirmPassword = confirmPassword, onConfirmPasswordChange = { confirmPassword = it; errorMessage = null },
                            gymType = gymType, onGymTypeChange = { gymType = it },
                            street = street, onStreetChange = { street = it },
                            locality = locality, onLocalityChange = { locality = it },
                            pincode = pincode, onPincodeChange = { pincode = it },
                            city = city, onCityChange = { city = it },
                            landmark = landmark, onLandmarkChange = { landmark = it },
                            isGpsVerified = isGpsVerified,
                            isGpsSkipped = isGpsSkipped,
                            isCapturing = isCapturingGps,
                            lat = capturedLatitude,
                            lng = capturedLongitude,
                            onRequestGps = {
                                isCapturingGps = true
                                locationPermissionLauncher.launch(
                                    arrayOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION)
                                )
                            },
                            onSkipGps = {
                                isGpsSkipped = true
                                isGpsVerified = false
                            }
                        )
                        2 -> Phase2AuditSpecs(
                            plateWeightKg = plateWeightKg, onPlateChange = { plateWeightKg = it },
                            dumbbellWeightKg = dumbbellWeightKg, onDumbbellChange = { dumbbellWeightKg = it },
                            maleTrainers = maleTrainers, onMaleTrainersChange = { maleTrainers = it },
                            femaleTrainers = femaleTrainers, onFemaleTrainersChange = { femaleTrainers = it },
                            openTime = openTime, onOpenTimeChange = { openTime = it },
                            closeTime = closeTime, onCloseTimeChange = { closeTime = it },
                            daysOpen = daysOpen, onDaysOpenChange = { daysOpen = it },
                            monthlyCharge = monthlyCharge, onMonthlyChange = { monthlyCharge = it },
                            quarterlyCharge = quarterlyCharge, onQuarterlyChange = { quarterlyCharge = it },
                            yearlyCharge = yearlyCharge, onYearlyChange = { yearlyCharge = it }
                        )
                    }
                }
            }

            if (errorMessage != null) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(text = errorMessage ?: "", color = AccentRed, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(14.dp))

            AthloButton(
                text = if (currentPhase == 1) "Next: Equipment Audit (Phase 2) →" else "Submit Gym for Verification",
                onClick = {
                    if (currentPhase == 1) {
                        if (gymName.isBlank() || ownerName.isBlank() || gymEmail.isBlank()) {
                            errorMessage = "Please enter Gym Name, Owner Name, and Email."
                            return@AthloButton
                        }
                        if (password.length < 6) {
                            errorMessage = "Please create a password of at least 6 characters."
                            return@AthloButton
                        }
                        if (password != confirmPassword) {
                            errorMessage = "Passwords do not match."
                            return@AthloButton
                        }
                        currentPhase = 2
                    } else {
                        AthloRepository.registerGym(
                            gymName = gymName.ifBlank { "Strength Hub" },
                            ownerName = ownerName.ifBlank { "Gym Owner" },
                            gymContact = gymContact.ifBlank { "+91 98112 00000" },
                            ownerContact = ownerContact.ifBlank { "+91 98112 00001" },
                            gymEmail = gymEmail.ifBlank { "gym@athloboard.com" },
                            gymType = gymType,
                            street = street,
                            locality = locality,
                            pincode = pincode,
                            city = city,
                            landmark = landmark,
                            latitude = capturedLatitude,
                            longitude = capturedLongitude,
                            isGpsVerified = isGpsVerified,
                            plateWeightKg = plateWeightKg.toIntOrNull() ?: 1800,
                            dumbbellWeightKg = dumbbellWeightKg.toIntOrNull() ?: 1200,
                            trainerMaleCount = maleTrainers.toIntOrNull() ?: 4,
                            trainerFemaleCount = femaleTrainers.toIntOrNull() ?: 2,
                            openTime = openTime,
                            closeTime = closeTime,
                            daysOpenPerWeek = daysOpen.toIntOrNull() ?: 7,
                            chargesMonthly = monthlyCharge.toIntOrNull() ?: 2499,
                            chargesQuarterly = quarterlyCharge.toIntOrNull() ?: 6499,
                            chargesYearly = yearlyCharge.toIntOrNull() ?: 19999
                        )
                        AthloRepository.setCurrentRole("GYM_OWNER")
                        onRegistrationSubmitted()
                    }
                },
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}

@Composable
private fun Phase1BasicInfoAndGps(
    gymName: String, onGymNameChange: (String) -> Unit,
    ownerName: String, onOwnerNameChange: (String) -> Unit,
    gymContact: String, onGymContactChange: (String) -> Unit,
    ownerContact: String, onOwnerContactChange: (String) -> Unit,
    gymEmail: String, onGymEmailChange: (String) -> Unit,
    password: String, onPasswordChange: (String) -> Unit,
    confirmPassword: String, onConfirmPasswordChange: (String) -> Unit,
    gymType: String, onGymTypeChange: (String) -> Unit,
    street: String, onStreetChange: (String) -> Unit,
    locality: String, onLocalityChange: (String) -> Unit,
    pincode: String, onPincodeChange: (String) -> Unit,
    city: String, onCityChange: (String) -> Unit,
    landmark: String, onLandmarkChange: (String) -> Unit,
    isGpsVerified: Boolean,
    isGpsSkipped: Boolean,
    isCapturing: Boolean,
    lat: Double?,
    lng: Double?,
    onRequestGps: () -> Unit,
    onSkipGps: () -> Unit
) {
    val citySuggestions = remember(city) { AthloRepository.searchIndianCities(city) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        AthloInputField(label = "Gym Commercial Name", value = gymName, onValueChange = onGymNameChange, placeholder = "e.g. Iron Pulse Strength Club")
        AthloInputField(label = "Owner / Director Name", value = ownerName, onValueChange = onOwnerNameChange, placeholder = "e.g. Rajesh Sharma")
        AthloInputField(label = "Official Gym Contact Number", value = gymContact, onValueChange = onGymContactChange, placeholder = "+91 98112 33445", keyboardType = KeyboardType.Phone)
        AthloInputField(label = "Owner Direct Mobile", value = ownerContact, onValueChange = onOwnerContactChange, placeholder = "+91 98112 33446", keyboardType = KeyboardType.Phone)
        AthloInputField(label = "Gym Business Email", value = gymEmail, onValueChange = onGymEmailChange, placeholder = "contact@ironpulse.in", keyboardType = KeyboardType.Email)

        // Login Password Setup
        Text(text = "Gym Portal Login Credentials", color = TextWhite, fontSize = 15.sp, fontWeight = FontWeight.Bold)
        AthloInputField(label = "Create Portal Password", value = password, onValueChange = onPasswordChange, placeholder = "Minimum 6 characters", isPassword = true)
        AthloInputField(label = "Confirm Password", value = confirmPassword, onValueChange = onConfirmPasswordChange, placeholder = "Re-enter password", isPassword = true)

        Text(text = "Gym Facility Type", color = TextMuted, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            listOf("Unisex", "Men Only", "Women Only").forEach { type ->
                val isSelected = gymType == type
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(PillShape)
                        .background(if (isSelected) AccentYellow else CardDark)
                        .border(1.dp, if (isSelected) AccentYellow else CardBorder, PillShape)
                        .clickable { onGymTypeChange(type) }
                        .padding(vertical = 10.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = type, color = if (isSelected) TextOnAccent else TextWhite, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        Text(text = "Physical Facility Address", color = TextWhite, fontSize = 15.sp, fontWeight = FontWeight.Bold)
        AthloInputField(label = "Street / Plot No / Building", value = street, onValueChange = onStreetChange, placeholder = "e.g. Plot 42, Block C")
        AthloInputField(label = "Locality / Sector / Area", value = locality, onValueChange = onLocalityChange, placeholder = "e.g. Sector 18")

        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Box(modifier = Modifier.weight(1f)) {
                AthloInputField(label = "Pincode", value = pincode, onValueChange = onPincodeChange, placeholder = "201301", keyboardType = KeyboardType.Number)
            }
            Box(modifier = Modifier.weight(1.5f)) {
                AthloInputField(label = "City (Search India)", value = city, onValueChange = onCityChange, placeholder = "Type city...")
            }
        }

        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(text = "Suggested Cities:", color = TextMuted, fontSize = 11.sp)
            LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                items(citySuggestions) { c ->
                    val isSel = city.equals(c, ignoreCase = true)
                    Box(
                        modifier = Modifier
                            .clip(PillShape)
                            .background(if (isSel) AccentYellow else CardDark)
                            .border(1.dp, if (isSel) AccentYellow else CardBorder, PillShape)
                            .clickable { onCityChange(c) }
                            .padding(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Text(text = c, color = if (isSel) TextOnAccent else TextWhite, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        AthloInputField(label = "Nearest Landmark / Metro Gate", value = landmark, onValueChange = onLandmarkChange, placeholder = "e.g. Opposite Metro Gate 2")

        // EXACT GPS LOCATION SECTION WITH INTERACTIVE FEEDBACK
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(if (isGpsVerified) Color(0xFF132A24) else if (isGpsSkipped) Color(0xFF261F14) else CardDark)
                .border(
                    1.5.dp,
                    if (isGpsVerified) AccentGreen else if (isGpsSkipped) AccentYellow else CardBorder,
                    RoundedCornerShape(16.dp)
                )
                .padding(16.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = if (isGpsVerified) "📍" else if (isGpsSkipped) "⏳" else "📡",
                        fontSize = 22.sp
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = if (isGpsVerified) "Exact Gym GPS Locked" else if (isGpsSkipped) "GPS Pinpoint Skipped for Later" else "Exact Facility GPS Pinpoint",
                            color = if (isGpsVerified) AccentGreen else if (isGpsSkipped) AccentYellow else TextWhite,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = if (isGpsVerified) "Coordinates: ${lat ?: 28.5708}° N, ${lng ?: 77.3271}° E (Accuracy: ±3m)"
                                   else if (isGpsSkipped) "You can lock your coordinates anytime from your dashboard when at the gym."
                                   else "Tap below if you are currently at the gym to record exact GPS coordinates.",
                            color = TextMuted,
                            fontSize = 11.sp,
                            lineHeight = 16.sp
                        )
                    }
                }

                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    // Capture Button
                    Box(
                        modifier = Modifier
                            .weight(1.3f)
                            .clip(PillShape)
                            .background(if (isGpsVerified) AccentGreen else AccentYellow)
                            .clickable(onClick = onRequestGps)
                            .padding(vertical = 11.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        if (isCapturing) {
                            CircularProgressIndicator(modifier = Modifier.size(16.dp), color = TextOnAccent, strokeWidth = 2.dp)
                        } else {
                            Text(
                                text = if (isGpsVerified) "✔ Re-Lock GPS" else "📍 Capture GPS Now",
                                color = TextOnAccent,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Black
                            )
                        }
                    }

                    // Skip Button with visual feedback
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(PillShape)
                            .background(if (isGpsSkipped && !isGpsVerified) AccentYellow.copy(alpha = 0.2f) else CardDark)
                            .border(1.dp, if (isGpsSkipped && !isGpsVerified) AccentYellow else CardBorder, PillShape)
                            .clickable(onClick = onSkipGps)
                            .padding(vertical = 11.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = if (isGpsSkipped && !isGpsVerified) "✔ Skipped" else "Skip for Now",
                            color = if (isGpsSkipped && !isGpsVerified) AccentYellow else TextMuted,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun Phase2AuditSpecs(
    plateWeightKg: String, onPlateChange: (String) -> Unit,
    dumbbellWeightKg: String, onDumbbellChange: (String) -> Unit,
    maleTrainers: String, onMaleTrainersChange: (String) -> Unit,
    femaleTrainers: String, onFemaleTrainersChange: (String) -> Unit,
    openTime: String, onOpenTimeChange: (String) -> Unit,
    closeTime: String, onCloseTimeChange: (String) -> Unit,
    daysOpen: String, onDaysOpenChange: (String) -> Unit,
    monthlyCharge: String, onMonthlyChange: (String) -> Unit,
    quarterlyCharge: String, onQuarterlyChange: (String) -> Unit,
    yearlyCharge: String, onYearlyChange: (String) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        AthloInputField(label = "Total Certified Plate Weight (KG)", value = plateWeightKg, onValueChange = onPlateChange, placeholder = "1800", keyboardType = KeyboardType.Number)
        AthloInputField(label = "Max Dumbbell Set Weight (KG)", value = dumbbellWeightKg, onValueChange = onDumbbellChange, placeholder = "1200", keyboardType = KeyboardType.Number)

        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Box(modifier = Modifier.weight(1f)) {
                AthloInputField(label = "Male Trainers", value = maleTrainers, onValueChange = onMaleTrainersChange, placeholder = "4", keyboardType = KeyboardType.Number)
            }
            Box(modifier = Modifier.weight(1f)) {
                AthloInputField(label = "Female Trainers", value = femaleTrainers, onValueChange = onFemaleTrainersChange, placeholder = "2", keyboardType = KeyboardType.Number)
            }
        }

        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Box(modifier = Modifier.weight(1f)) {
                AthloInputField(label = "Opening Time", value = openTime, onValueChange = onOpenTimeChange, placeholder = "05:30 AM")
            }
            Box(modifier = Modifier.weight(1f)) {
                AthloInputField(label = "Closing Time", value = closeTime, onValueChange = onCloseTimeChange, placeholder = "11:00 PM")
            }
        }

        AthloInputField(label = "Days Open Per Week", value = daysOpen, onValueChange = onDaysOpenChange, placeholder = "7", keyboardType = KeyboardType.Number)
        AthloInputField(label = "Monthly Membership Fee (₹)", value = monthlyCharge, onValueChange = onMonthlyChange, placeholder = "2499", keyboardType = KeyboardType.Number)
        AthloInputField(label = "Quarterly Membership Fee (₹)", value = quarterlyCharge, onValueChange = onQuarterlyChange, placeholder = "6499", keyboardType = KeyboardType.Number)
        AthloInputField(label = "Yearly Membership Fee (₹)", value = yearlyCharge, onValueChange = onYearlyChange, placeholder = "19999", keyboardType = KeyboardType.Number)
    }
}

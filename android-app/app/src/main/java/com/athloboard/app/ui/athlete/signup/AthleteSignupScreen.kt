package com.athloboard.app.ui.athlete.signup

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
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
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
fun AthleteSignupScreen(
    onBackClick: () -> Unit,
    onSignupComplete: () -> Unit
) {
    val currentAthlete by AthloRepository.currentAthlete.collectAsState()
    var step by remember { mutableIntStateOf(1) }

    // Step 1: Username & Name
    var username by remember(currentAthlete.name) {
        val initial = currentAthlete.email.substringBefore("@").replace(".", "_").ifBlank { "lifter_${(100..999).random()}" }
        mutableStateOf(initial)
    }
    var fullName by remember(currentAthlete.name) { mutableStateOf(currentAthlete.name.ifBlank { "Athlete" }) }
    var email by remember(currentAthlete.email) { mutableStateOf(currentAthlete.email.ifBlank { "athlete@athloboard.com" }) }
    var phone by remember(currentAthlete.phone) { mutableStateOf(currentAthlete.phone.ifBlank { "+91 98765 43210" }) }

    // Step 2: DOB & Gender
    var selectedYear by remember { mutableIntStateOf(2000) }
    var selectedMonth by remember { mutableIntStateOf(5) } // 1-12
    var selectedDay by remember { mutableIntStateOf(14) }
    var showDatePickerDialog by remember { mutableStateOf(false) }
    var gender by remember { mutableStateOf("Male") }

    // Step 3: Structured Address & Gym Experience
    var street by remember { mutableStateOf("Flat 402, Royal Residency") }
    var locality by remember { mutableStateOf("South Extension Part 2") }
    var pincode by remember { mutableStateOf("110049") }
    var city by remember { mutableStateOf("New Delhi") }
    var hasGymExperience by remember { mutableStateOf(true) }
    var gymName by remember { mutableStateOf("Iron Pulse Strength Club") }
    var gymDuration by remember { mutableStateOf("2 years") }
    var preferredGym by remember { mutableStateOf("Olympus Barbell Club") }

    // Step 4: IPF Weight Class
    var weightClass by remember { mutableStateOf("-83kg") }

    val formattedDob = "$selectedYear-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}"
    val calculatedAge = 2026 - selectedYear

    // Handle Uniqueness Validation
    val isUsernameAvailable = remember(username) {
        AthloRepository.checkUsernameAvailability(username)
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 24.dp)
                .padding(top = 48.dp, bottom = 32.dp)
        ) {
            // 1. Top Instagram-Style Bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(CardDark)
                        .border(1.dp, CardBorder, CircleShape)
                        .clickable { if (step > 1) step-- else onBackClick() },
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "‹", color = TextWhite, fontSize = 26.sp, fontWeight = FontWeight.Bold)
                }

                Spacer(modifier = Modifier.weight(1f))

                Text(
                    text = "Step $step of 4",
                    color = TextMuted,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                )

                Spacer(modifier = Modifier.weight(1f))
                Spacer(modifier = Modifier.size(40.dp))
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Step Progress Line
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                repeat(4) { index ->
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .height(4.dp)
                            .clip(PillShape)
                            .background(if (index < step) AccentYellow else CardBorder)
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // 2. Animated Multi-Step Body
            Box(modifier = Modifier.weight(1f)) {
                AnimatedContent(
                    targetState = step,
                    transitionSpec = {
                        if (targetState > initialState) {
                            slideInHorizontally { it } + fadeIn() togetherWith slideOutHorizontally { -it } + fadeOut()
                        } else {
                            slideInHorizontally { -it } + fadeIn() togetherWith slideOutHorizontally { it } + fadeOut()
                        }
                    },
                    label = "instaSignupStep"
                ) { targetStep ->
                    when (targetStep) {
                        1 -> Step1UsernameAndName(
                            username = username,
                            onUsernameChange = { username = it },
                            isAvailable = isUsernameAvailable,
                            fullName = fullName,
                            onFullNameChange = { fullName = it },
                            email = email
                        )
                        2 -> Step2BirthdayAndGender(
                            dob = formattedDob,
                            age = calculatedAge,
                            onOpenDatePicker = { showDatePickerDialog = true },
                            gender = gender,
                            onGenderChange = { gender = it }
                        )
                        3 -> Step3StructuredAddressAndGym(
                            street = street,
                            onStreetChange = { street = it },
                            locality = locality,
                            onLocalityChange = { locality = it },
                            pincode = pincode,
                            onPincodeChange = { pincode = it },
                            city = city,
                            onCityChange = { city = it },
                            hasGymExperience = hasGymExperience,
                            onToggleExp = { hasGymExperience = it },
                            gymName = gymName,
                            onGymNameChange = { gymName = it },
                            gymDuration = gymDuration,
                            onDurationChange = { gymDuration = it },
                            preferredGym = preferredGym,
                            onPreferredGymChange = { preferredGym = it }
                        )
                        4 -> Step4WeightClass(
                            weightClass = weightClass,
                            onWeightClassChange = { weightClass = it }
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // 3. Next / Finish Primary Action Button
            AthloButton(
                text = if (step < 4) "Continue →" else "Complete Profile & Enter Athloboard",
                onClick = {
                    if (step == 1 && !isUsernameAvailable) {
                        return@AthloButton
                    }

                    if (step < 4) {
                        step++
                    } else {
                        AthloRepository.registerAthlete(
                            username = "@${username.trim().removePrefix("@")}",
                            name = fullName.ifBlank { "Athlete" },
                            email = email.ifBlank { "athlete@athloboard.com" },
                            phone = phone.ifBlank { "+91 98765 43210" },
                            dob = formattedDob,
                            gender = gender,
                            street = street,
                            locality = locality,
                            pincode = pincode,
                            city = city,
                            hasGymExperience = hasGymExperience,
                            gymExperienceDetails = if (hasGymExperience) "$gymDuration at $gymName" else "Beginner",
                            preferredGym = if (hasGymExperience) gymName else preferredGym,
                            weightClass = weightClass
                        )
                        AthloRepository.setCurrentRole("ATHLETE")
                        onSignupComplete()
                    }
                },
                modifier = Modifier.fillMaxWidth()
            )
        }

        // GUI-BASED DATE PICKER DIALOG
        if (showDatePickerDialog) {
            GuiDatePickerDialog(
                initialYear = selectedYear,
                initialMonth = selectedMonth,
                initialDay = selectedDay,
                onDismiss = { showDatePickerDialog = false },
                onDateSelected = { y, m, d ->
                    selectedYear = y
                    selectedMonth = m
                    selectedDay = d
                    showDatePickerDialog = false
                }
            )
        }
    }
}

@Composable
private fun Step1UsernameAndName(
    username: String,
    onUsernameChange: (String) -> Unit,
    isAvailable: Boolean,
    fullName: String,
    onFullNameChange: (String) -> Unit,
    email: String
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(text = "Create your Athlo handle", color = TextWhite, fontSize = 24.sp, fontWeight = FontWeight.Black)
        Text(text = "Choose a unique handle for leaderboards, PR verification, and athlete rankings.", color = TextMuted, fontSize = 13.sp, lineHeight = 20.sp)

        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(text = "Unique Athlo ID", color = TextMuted, fontSize = 12.sp, fontWeight = FontWeight.Bold)

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(CardDark)
                    .border(
                        1.5.dp,
                        if (username.length >= 3 && isAvailable) AccentGreen else if (username.length >= 3) AccentRed else CardBorder,
                        RoundedCornerShape(14.dp)
                    )
                    .padding(horizontal = 16.dp, vertical = 14.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = "@", color = AccentYellow, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.width(6.dp))

                    androidx.compose.foundation.text.BasicTextField(
                        value = username,
                        onValueChange = onUsernameChange,
                        textStyle = androidx.compose.ui.text.TextStyle(
                            color = TextWhite,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.SemiBold
                        ),
                        singleLine = true,
                        modifier = Modifier.weight(1f)
                    )

                    if (username.length >= 3) {
                        Text(
                            text = if (isAvailable) "✔ Available" else "✖ Taken",
                            color = if (isAvailable) AccentGreen else AccentRed,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            if (username.length >= 3 && !isAvailable) {
                Text(text = "This handle is already taken. Try adding numbers or underscores.", color = AccentRed, fontSize = 11.sp)
            }
        }

        val suggestions = remember(username) {
            listOf("${username}_power", "${username}_lifts", "${username}_ipf", "${username}_26")
        }
        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(text = "Suggested Handles:", color = TextMuted, fontSize = 11.sp)
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(suggestions) { sug ->
                    Box(
                        modifier = Modifier
                            .clip(PillShape)
                            .background(CardDark)
                            .border(1.dp, CardBorder, PillShape)
                            .clickable { onUsernameChange(sug) }
                            .padding(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Text(text = "@$sug", color = AccentYellow, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(4.dp))
        AthloInputField(label = "Full Name", value = fullName, onValueChange = onFullNameChange, placeholder = "e.g. Kabir Rawat")
        AthloInputField(label = "Connected Gmail Account", value = email, onValueChange = {}, readOnly = true)
    }
}

@Composable
private fun Step2BirthdayAndGender(
    dob: String,
    age: Int,
    onOpenDatePicker: () -> Unit,
    gender: String,
    onGenderChange: (String) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(18.dp)
    ) {
        Text(text = "What's your birthday & gender?", color = TextWhite, fontSize = 24.sp, fontWeight = FontWeight.Black)
        Text(text = "Your birthday determines your official IPF competition age division (Junior, Open, Master).", color = TextMuted, fontSize = 13.sp, lineHeight = 20.sp)

        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(text = "Date of Birth (GUI Selector)", color = TextMuted, fontSize = 12.sp, fontWeight = FontWeight.Bold)

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(CardDark)
                    .border(1.5.dp, AccentYellow.copy(alpha = 0.5f), RoundedCornerShape(16.dp))
                    .clickable(onClick = onOpenDatePicker)
                    .padding(18.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(text = "📅", fontSize = 26.sp)
                        Spacer(modifier = Modifier.width(14.dp))
                        Column {
                            Text(text = dob, color = TextWhite, fontSize = 17.sp, fontWeight = FontWeight.Bold)
                            Text(
                                text = "$age years old • ${if (age <= 23) "Junior Division" else if (age < 40) "Open Division" else "Master Division"}",
                                color = AccentYellow,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }

                    Box(
                        modifier = Modifier
                            .clip(PillShape)
                            .background(AccentYellow)
                            .padding(horizontal = 14.dp, vertical = 8.dp)
                    ) {
                        Text(text = "Change", color = TextOnAccent, fontSize = 12.sp, fontWeight = FontWeight.Black)
                    }
                }
            }
        }

        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Text(text = "Select Gender", color = TextMuted, fontSize = 12.sp, fontWeight = FontWeight.Bold)

            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                listOf("Male", "Female", "Other").forEach { g ->
                    val isSelected = gender == g
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(14.dp))
                            .background(if (isSelected) AccentYellow else CardDark)
                            .border(1.dp, if (isSelected) AccentYellow else CardBorder, RoundedCornerShape(14.dp))
                            .clickable { onGenderChange(g) }
                            .padding(vertical = 16.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = g, color = if (isSelected) TextOnAccent else TextWhite, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
private fun Step3StructuredAddressAndGym(
    street: String,
    onStreetChange: (String) -> Unit,
    locality: String,
    onLocalityChange: (String) -> Unit,
    pincode: String,
    onPincodeChange: (String) -> Unit,
    city: String,
    onCityChange: (String) -> Unit,
    hasGymExperience: Boolean,
    onToggleExp: (Boolean) -> Unit,
    gymName: String,
    onGymNameChange: (String) -> Unit,
    gymDuration: String,
    onDurationChange: (String) -> Unit,
    preferredGym: String,
    onPreferredGymChange: (String) -> Unit
) {
    val citySuggestions = remember(city) {
        AthloRepository.searchIndianCities(city)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Text(text = "Your Address & Training Hub", color = TextWhite, fontSize = 24.sp, fontWeight = FontWeight.Black)
        Text(text = "Set your city and locality for regional rankings and nearby gym leaderboards.", color = TextMuted, fontSize = 13.sp)

        AthloInputField(label = "Street / Building / Flat No.", value = street, onValueChange = onStreetChange, placeholder = "e.g. Flat 402, Block B")
        AthloInputField(label = "Locality / Sector / Area", value = locality, onValueChange = onLocalityChange, placeholder = "e.g. South Extension Part 2")

        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Box(modifier = Modifier.weight(1f)) {
                AthloInputField(label = "Pincode", value = pincode, onValueChange = onPincodeChange, placeholder = "110049", keyboardType = KeyboardType.Number)
            }
            Box(modifier = Modifier.weight(1.5f)) {
                AthloInputField(label = "City (Search India)", value = city, onValueChange = onCityChange, placeholder = "Type city...")
            }
        }

        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(text = "Suggested Indian Cities:", color = TextMuted, fontSize = 11.sp)
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

        Spacer(modifier = Modifier.height(6.dp))
        Text(text = "Training Facility & Experience", color = TextWhite, fontSize = 15.sp, fontWeight = FontWeight.Bold)

        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(PillShape)
                    .background(if (hasGymExperience) AccentYellow else CardDark)
                    .border(1.dp, if (hasGymExperience) AccentYellow else CardBorder, PillShape)
                    .clickable { onToggleExp(true) }
                    .padding(vertical = 12.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(text = "I train at a gym", color = if (hasGymExperience) TextOnAccent else TextWhite, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            }

            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(PillShape)
                    .background(if (!hasGymExperience) AccentYellow else CardDark)
                    .border(1.dp, if (!hasGymExperience) AccentYellow else CardBorder, PillShape)
                    .clickable { onToggleExp(false) }
                    .padding(vertical = 12.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(text = "No / Beginner", color = if (!hasGymExperience) TextOnAccent else TextWhite, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            }
        }

        if (hasGymExperience) {
            AthloInputField(label = "Current Training Gym", value = gymName, onValueChange = onGymNameChange, placeholder = "e.g. Iron Pulse Strength Club")
            AthloInputField(label = "Experience Duration", value = gymDuration, onValueChange = onDurationChange, placeholder = "e.g. 2 years")
        } else {
            AthloInputField(label = "Preferred Gym (if any)", value = preferredGym, onValueChange = onPreferredGymChange, placeholder = "e.g. Olympus Barbell Club")
        }
    }
}

@Composable
private fun Step4WeightClass(
    weightClass: String,
    onWeightClassChange: (String) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(text = "Select your weight division", color = TextWhite, fontSize = 24.sp, fontWeight = FontWeight.Black)
        Text(text = "Your division sets your official ranking on state & national leaderboards.", color = TextMuted, fontSize = 13.sp)

        val classes = listOf("-59kg", "-66kg", "-74kg", "-83kg", "-93kg", "-105kg", "-120kg", "120kg+")
        classes.chunked(2).forEach { row ->
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                row.forEach { wc ->
                    val isSelected = weightClass == wc
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(16.dp))
                            .background(if (isSelected) AccentYellow else CardDark)
                            .border(1.dp, if (isSelected) AccentYellow else CardBorder, RoundedCornerShape(16.dp))
                            .clickable { onWeightClassChange(wc) }
                            .padding(vertical = 18.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = wc,
                            color = if (isSelected) TextOnAccent else TextWhite,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Black
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun GuiDatePickerDialog(
    initialYear: Int,
    initialMonth: Int,
    initialDay: Int,
    onDismiss: () -> Unit,
    onDateSelected: (year: Int, month: Int, day: Int) -> Unit
) {
    var tempYear by remember { mutableIntStateOf(initialYear) }
    var tempMonth by remember { mutableIntStateOf(initialMonth) }
    var tempDay by remember { mutableIntStateOf(initialDay) }

    val months = listOf("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")
    val years = (1960..2015).toList().reversed()
    val days = (1..31).toList()

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = Color(0xFF161622),
        title = {
            Text(text = "Select Date of Birth", color = TextWhite, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Column {
                    Text(text = "Year: $tempYear", color = AccentYellow, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    LazyRow(modifier = Modifier.padding(top = 6.dp), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        items(years) { y ->
                            val isSel = tempYear == y
                            Box(
                                modifier = Modifier
                                    .clip(PillShape)
                                    .background(if (isSel) AccentYellow else CardDark)
                                    .border(1.dp, CardBorder, PillShape)
                                    .clickable { tempYear = y }
                                    .padding(horizontal = 12.dp, vertical = 6.dp)
                            ) {
                                Text(text = "$y", color = if (isSel) TextOnAccent else TextWhite, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }

                Column {
                    Text(text = "Month: ${months[tempMonth - 1]}", color = AccentYellow, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    LazyRow(modifier = Modifier.padding(top = 6.dp), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        items(months.indices.toList()) { idx ->
                            val isSel = tempMonth == idx + 1
                            Box(
                                modifier = Modifier
                                    .clip(PillShape)
                                    .background(if (isSel) AccentYellow else CardDark)
                                    .border(1.dp, CardBorder, PillShape)
                                    .clickable { tempMonth = idx + 1 }
                                    .padding(horizontal = 12.dp, vertical = 6.dp)
                            ) {
                                Text(text = months[idx], color = if (isSel) TextOnAccent else TextWhite, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }

                Column {
                    Text(text = "Day: $tempDay", color = AccentYellow, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    LazyRow(modifier = Modifier.padding(top = 6.dp), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        items(days) { d ->
                            val isSel = tempDay == d
                            Box(
                                modifier = Modifier
                                    .clip(CircleShape)
                                    .size(36.dp)
                                    .background(if (isSel) AccentYellow else CardDark)
                                    .border(1.dp, CardBorder, CircleShape)
                                    .clickable { tempDay = d },
                                contentAlignment = Alignment.Center
                            ) {
                                Text(text = "$d", color = if (isSel) TextOnAccent else TextWhite, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        },
        confirmButton = {
            TextButton(onClick = { onDateSelected(tempYear, tempMonth, tempDay) }) {
                Text(text = "Set Birthday", color = AccentYellow, fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text(text = "Cancel", color = TextMuted)
            }
        }
    )
}

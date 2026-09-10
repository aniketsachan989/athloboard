package com.athloboard.app.ui.athlete.profile

import android.widget.Toast
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
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.athloboard.app.data.AthloRepository
import com.athloboard.app.ui.shared.AthloButton
import com.athloboard.app.ui.shared.AthloTopBar
import com.athloboard.app.ui.theme.AccentPrimary
import com.athloboard.app.ui.theme.BackgroundCard
import com.athloboard.app.ui.theme.BackgroundPrimary
import com.athloboard.app.ui.theme.BorderDivider
import com.athloboard.app.ui.theme.CardShape
import com.athloboard.app.ui.theme.PillShape
import com.athloboard.app.ui.theme.TextOnAccent
import com.athloboard.app.ui.theme.TextPrimary
import com.athloboard.app.ui.theme.TextSecondary

/**
 * PART 12.2 — EDIT PROFILE SCREEN
 * Pre-filled from Google, completion %, gender, weight class, gym experience, bio, social handle.
 */
@Composable
fun EditProfileScreen(
    onBackClick: () -> Unit,
    onSaveSuccess: () -> Unit
) {
    val context = LocalContext.current
    val currentAthlete by AthloRepository.currentAthlete.collectAsState()

    var name by remember(currentAthlete.name) { mutableStateOf(currentAthlete.name) }
    val email = currentAthlete.email.ifBlank { "No email associated" }
    var phone by remember(currentAthlete.phone) { mutableStateOf(currentAthlete.phone) }
    var dob by remember { mutableStateOf("1998-04-14") }
    var gender by remember(currentAthlete.gender) { mutableStateOf(currentAthlete.gender) }
    var weightClass by remember(currentAthlete.weightClass) { mutableStateOf(currentAthlete.weightClass) }
    var goesToGym by remember(currentAthlete.gymName) { mutableStateOf(currentAthlete.gymName.isNotBlank()) }
    var gymName by remember(currentAthlete.gymName) { mutableStateOf(currentAthlete.gymName) }
    var bio by remember(currentAthlete.bio) { mutableStateOf(currentAthlete.bio) }
    var instagram by remember(currentAthlete.instagram) { mutableStateOf(currentAthlete.instagram) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundPrimary)
            .padding(top = 24.dp)
    ) {
        Box(modifier = Modifier.padding(horizontal = 20.dp)) {
            AthloTopBar(
                title = "Edit Profile",
                onBackClick = onBackClick
            )
        }

        Spacer(modifier = Modifier.height(14.dp))

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp)
        ) {
            // Profile Completion Header Card
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(CardShape)
                    .background(BackgroundCard)
                    .border(1.dp, AccentPrimary.copy(alpha = 0.3f), CardShape)
                    .padding(14.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Profile Strength: 85%",
                            color = AccentPrimary,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Verified Rank Ready",
                            color = TextSecondary,
                            fontSize = 11.sp
                        )
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(5.dp)
                            .clip(PillShape)
                            .background(BorderDivider)
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth(0.85f)
                                .height(5.dp)
                                .background(AccentPrimary)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Profile Photo with Gold Ring
            Box(
                modifier = Modifier.fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Box(
                        modifier = Modifier
                            .size(86.dp)
                            .clip(CircleShape)
                            .background(BackgroundCard)
                            .border(2.dp, AccentPrimary, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = "🏋️", fontSize = 40.sp)
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Change Photo",
                        color = AccentPrimary,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Form Fields
            EditFormField(label = "Full Name", value = name, onValueChange = { name = it })
            EditFormField(label = "Email (Google Verified)", value = email, onValueChange = { }, isReadOnly = true)
            EditFormField(label = "Phone Number", value = phone, onValueChange = { phone = it }, keyboardType = KeyboardType.Phone)
            EditFormField(label = "Date of Birth", value = dob, onValueChange = { dob = it })

            // Gender Segmented Control
            Text(text = "Gender", color = TextSecondary, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
            Spacer(modifier = Modifier.height(6.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("Male", "Female", "Other").forEach { g ->
                    val isSelected = gender.equals(g, ignoreCase = true)
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(PillShape)
                            .background(if (isSelected) AccentPrimary else BackgroundCard)
                            .border(1.dp, if (isSelected) AccentPrimary else BorderDivider, PillShape)
                            .clickable { gender = g }
                            .padding(vertical = 8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = g, color = if (isSelected) BackgroundPrimary else TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Weight Class Selector
            Text(text = "Weight Class", color = TextSecondary, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
            Spacer(modifier = Modifier.height(6.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("74kg", "83kg", "93kg", "105kg").forEach { wc ->
                    val isSelected = weightClass.contains(wc, ignoreCase = true)
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(PillShape)
                            .background(if (isSelected) AccentPrimary else BackgroundCard)
                            .border(1.dp, if (isSelected) AccentPrimary else BorderDivider, PillShape)
                            .clickable { weightClass = wc }
                            .padding(vertical = 8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = wc, color = if (isSelected) BackgroundPrimary else TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Gym Name
            EditFormField(label = "Primary Training Gym", value = gymName, onValueChange = { gymName = it })
            EditFormField(label = "Athlete Bio", value = bio, onValueChange = { bio = it })
            EditFormField(label = "Instagram Handle", value = instagram, onValueChange = { instagram = it })

            Spacer(modifier = Modifier.height(24.dp))
        }

        // Sticky Bottom Save Bar
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(BackgroundCard)
                .border(1.dp, BorderDivider)
                .padding(horizontal = 20.dp, vertical = 14.dp)
        ) {
            AthloButton(
                text = "Save Profile Changes",
                onClick = {
                    AthloRepository.updateAthleteProfile(
                        name = name,
                        email = currentAthlete.email,
                        phone = phone,
                        dob = dob,
                        gender = gender,
                        gymExperience = currentAthlete.gymExperienceDetails,
                        preferredGym = if (goesToGym) gymName else "",
                        area = currentAthlete.area,
                        weightClass = weightClass,
                        prSquat = currentAthlete.prSquat,
                        prBench = currentAthlete.prBench,
                        prDeadlift = currentAthlete.prDeadlift,
                        bio = bio,
                        instagram = instagram
                    )
                    Toast.makeText(context, "Profile updated successfully!", Toast.LENGTH_SHORT).show()
                    onSaveSuccess()
                },
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}

@Composable
private fun EditFormField(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    keyboardType: KeyboardType = KeyboardType.Text,
    isReadOnly: Boolean = false
) {
    Column(modifier = Modifier.padding(bottom = 14.dp)) {
        Text(
            text = label,
            color = TextSecondary,
            fontSize = 12.sp,
            fontWeight = FontWeight.SemiBold
        )
        Spacer(modifier = Modifier.height(6.dp))
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(PillShape)
                .background(if (isReadOnly) Color(0xFF101018) else BackgroundCard)
                .border(1.dp, BorderDivider, PillShape)
                .padding(horizontal = 16.dp, vertical = 10.dp)
        ) {
            BasicTextField(
                value = value,
                onValueChange = onValueChange,
                readOnly = isReadOnly,
                textStyle = TextStyle(
                    color = if (isReadOnly) TextSecondary else TextPrimary,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium
                ),
                keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}

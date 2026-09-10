package com.athloboard.app.ui.athlete.gym

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
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.athloboard.app.data.models.Gym
import com.athloboard.app.ui.shared.AthloButton
import com.athloboard.app.ui.shared.AthloTopBar
import com.athloboard.app.ui.theme.PillShape

private val BgDark = Color(0xFF0F0F14)
private val CardDark = Color(0xFF181822)
private val CardBorder = Color(0xFF262634)
private val TextWhite = Color(0xFFFFFFFF)
private val TextMuted = Color(0xFF9090A0)
private val AccentYellow = Color(0xFFFFB703)
private val TextOnAccent = Color(0xFF0F0F14)
private val AccentGreen = Color(0xFF2EC4B6)

@Composable
fun GymDetailScreen(
    gym: Gym?,
    onBackClick: () -> Unit,
    onBookPlan: (String) -> Unit = {}
) {
    val currentGym = gym ?: Gym()
    var selectedPlan by remember { mutableStateOf("Monthly") }
    var showBookingSuccess by remember { mutableStateOf(false) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(bottom = 20.dp)
        ) {
            AthloTopBar(
                title = currentGym.gymName,
                subtitle = "${currentGym.locality}, ${currentGym.city}",
                onBackClick = onBackClick
            )

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = 20.dp),
                verticalArrangement = Arrangement.spacedBy(18.dp)
            ) {
                // Audited Gold Banner
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(18.dp))
                        .background(Color(0xFF161E1C))
                        .border(1.5.dp, AccentGreen, RoundedCornerShape(18.dp))
                        .padding(16.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(text = "🏆", fontSize = 28.sp)
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(text = "Official Audited Strength Facility", color = AccentGreen, fontSize = 14.sp, fontWeight = FontWeight.Black)
                            Text(text = "Calibrated Olympic plates, IPF spec power cages & certified coaches verified.", color = TextMuted, fontSize = 11.sp)
                        }
                    }
                }

                // Equipment Breakdown
                Text(text = "Certified Equipment Inventory", color = TextWhite, fontSize = 16.sp, fontWeight = FontWeight.Bold)

                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    SpecRow(label = "Calibrated Plate Stock", value = "${currentGym.plateWeightKg} kg (Eleiko & Bullrock)")
                    SpecRow(label = "Dumbbell Rack Range", value = "${currentGym.dumbbellWeightKg} kg (Up to 70kg pairs)")
                    SpecRow(label = "Certified Coaching Roster", value = "${currentGym.trainerMaleCount} Male, ${currentGym.trainerFemaleCount} Female")
                    SpecRow(label = "Facility Operating Hours", value = "${currentGym.openTime} - ${currentGym.closeTime} (${currentGym.daysOpenPerWeek} Days/Wk)")
                    SpecRow(label = "Physical Landmark", value = currentGym.landmark)
                }

                // Membership Plans Selection
                Text(text = "Membership Access Plans", color = TextWhite, fontSize = 16.sp, fontWeight = FontWeight.Bold)

                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    PlanCard(modifier = Modifier.weight(1f), title = "Monthly", price = "₹ ${currentGym.chargesMonthly}", isSelected = selectedPlan == "Monthly", onClick = { selectedPlan = "Monthly" })
                    PlanCard(modifier = Modifier.weight(1f), title = "Quarterly", price = "₹ ${currentGym.chargesQuarterly}", isSelected = selectedPlan == "Quarterly", onClick = { selectedPlan = "Quarterly" })
                    PlanCard(modifier = Modifier.weight(1f), title = "Yearly", price = "₹ ${currentGym.chargesYearly}", isSelected = selectedPlan == "Yearly", onClick = { selectedPlan = "Yearly" })
                }

                Spacer(modifier = Modifier.height(10.dp))

                AthloButton(
                    text = "Book $selectedPlan Membership Pass",
                    onClick = { showBookingSuccess = true },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }

        if (showBookingSuccess) {
            AlertDialog(
                onDismissRequest = { showBookingSuccess = false },
                containerColor = CardDark,
                title = { Text(text = "Pass Confirmed! 🎟️", color = TextWhite, fontWeight = FontWeight.Bold) },
                text = { Text(text = "Your $selectedPlan pass for ${currentGym.gymName} is active. Show your pass QR at reception to start training.", color = TextMuted) },
                confirmButton = {
                    TextButton(onClick = {
                        showBookingSuccess = false
                        onBookPlan(selectedPlan)
                    }) {
                        Text(text = "Done", color = AccentYellow, fontWeight = FontWeight.Bold)
                    }
                }
            )
        }
    }
}

@Composable
private fun SpecRow(label: String, value: String) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(CardDark)
            .border(1.dp, CardBorder, RoundedCornerShape(12.dp))
            .padding(14.dp)
    ) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(text = label, color = TextMuted, fontSize = 12.sp)
            Text(text = value, color = TextWhite, fontSize = 12.sp, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
private fun PlanCard(modifier: Modifier, title: String, price: String, isSelected: Boolean, onClick: () -> Unit) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(14.dp))
            .background(if (isSelected) AccentYellow else CardDark)
            .border(1.dp, if (isSelected) AccentYellow else CardBorder, RoundedCornerShape(14.dp))
            .clickable(onClick = onClick)
            .padding(14.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(text = title, color = if (isSelected) TextOnAccent else TextMuted, fontSize = 11.sp, fontWeight = FontWeight.Bold)
            Text(text = price, color = if (isSelected) TextOnAccent else TextWhite, fontSize = 14.sp, fontWeight = FontWeight.Black)
        }
    }
}

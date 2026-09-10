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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.Icon
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.athloboard.app.data.AthloRepository
import com.athloboard.app.data.models.Gym
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
fun GymDiscoveryScreen(
    onBackClick: () -> Unit,
    onGymClick: (Gym) -> Unit
) {
    val gyms by AthloRepository.gyms.collectAsState()
    var selectedFilter by remember { mutableStateOf("All Gyms") }
    var searchQuery by remember { mutableStateOf("") }

    val filters = listOf("All Gyms", "Audited Gold 🏆", "Calibrated Plates (KG)", "IPF Combo Racks", "Near Me (GPS)")

    val filteredGyms = remember(gyms, selectedFilter, searchQuery) {
        gyms.filter { g ->
            val matchesSearch = g.gymName.contains(searchQuery, ignoreCase = true) || g.city.contains(searchQuery, ignoreCase = true)
            val matchesFilter = when (selectedFilter) {
                "Audited Gold 🏆" -> g.isGpsVerified || g.plateWeightKg > 2500
                "Calibrated Plates (KG)" -> g.plateWeightKg >= 1800
                "IPF Combo Racks" -> true
                else -> true
            }
            matchesSearch && matchesFilter
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(bottom = 24.dp)
        ) {
            AthloTopBar(
                title = "Audited Gyms Directory",
                subtitle = "Calibrated plate inventories & certified powerlifting clubs",
                onBackClick = onBackClick
            )

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = 20.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Search Input
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(CardDark)
                        .border(1.dp, CardBorder, RoundedCornerShape(14.dp))
                        .padding(horizontal = 16.dp, vertical = 12.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(text = "🔍", fontSize = 16.sp)
                        Spacer(modifier = Modifier.width(10.dp))
                        androidx.compose.foundation.text.BasicTextField(
                            value = searchQuery,
                            onValueChange = { searchQuery = it },
                            textStyle = androidx.compose.ui.text.TextStyle(color = TextWhite, fontSize = 14.sp),
                            singleLine = true,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }

                // Interactive Filters
                LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(filters) { f ->
                        val isSel = selectedFilter == f
                        Box(
                            modifier = Modifier
                                .clip(PillShape)
                                .background(if (isSel) AccentYellow else CardDark)
                                .border(1.dp, if (isSel) AccentYellow else CardBorder, PillShape)
                                .clickable { selectedFilter = f }
                                .padding(horizontal = 14.dp, vertical = 8.dp)
                        ) {
                            Text(text = f, color = if (isSel) TextOnAccent else TextWhite, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                Text(text = "Showing ${filteredGyms.size} Verified Strength Gyms", color = TextMuted, fontSize = 12.sp, fontWeight = FontWeight.Bold)

                // Gym Cards
                filteredGyms.forEach { gym ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(20.dp))
                            .background(CardDark)
                            .border(1.dp, CardBorder, RoundedCornerShape(20.dp))
                            .clickable { onGymClick(gym) }
                            .padding(18.dp)
                    ) {
                        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(text = gym.gymName, color = TextWhite, fontSize = 17.sp, fontWeight = FontWeight.Black)
                                    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(top = 2.dp)) {
                                        Icon(imageVector = Icons.Default.LocationOn, contentDescription = null, tint = AccentYellow, modifier = Modifier.size(14.dp))
                                        Text(text = "${gym.locality}, ${gym.city}", color = TextMuted, fontSize = 12.sp)
                                    }
                                }

                                Box(
                                    modifier = Modifier
                                        .clip(PillShape)
                                        .background(AccentGreen.copy(alpha = 0.15f))
                                        .border(1.dp, AccentGreen.copy(alpha = 0.5f), PillShape)
                                        .padding(horizontal = 10.dp, vertical = 4.dp)
                                ) {
                                    Text(text = "AUDITED GOLD", color = AccentGreen, fontSize = 10.sp, fontWeight = FontWeight.Black)
                                }
                            }

                            // High-Density Metric Badges
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                GymMetricChip(modifier = Modifier.weight(1f), icon = "🏋️", label = "Plates", value = "${gym.plateWeightKg} kg")
                                GymMetricChip(modifier = Modifier.weight(1f), icon = "💪", label = "Dumbbells", value = "${gym.dumbbellWeightKg} kg")
                                GymMetricChip(modifier = Modifier.weight(1f), icon = "⭐", label = "Rating", value = "${gym.rating} (${gym.reviewsCount})")
                            }

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(text = "Monthly Pass", color = TextMuted, fontSize = 10.sp)
                                    Text(text = "₹ ${gym.chargesMonthly} / mo", color = AccentYellow, fontSize = 15.sp, fontWeight = FontWeight.Black)
                                }

                                Box(
                                    modifier = Modifier
                                        .clip(PillShape)
                                        .background(AccentYellow)
                                        .padding(horizontal = 16.dp, vertical = 8.dp)
                                ) {
                                    Text(text = "View Facility Specs →", color = TextOnAccent, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun GymMetricChip(modifier: Modifier, icon: String, label: String, value: String) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(10.dp))
            .background(Color(0xFF0F0F14))
            .border(1.dp, CardBorder, RoundedCornerShape(10.dp))
            .padding(8.dp)
    ) {
        Column {
            Text(text = "$icon $label", color = TextMuted, fontSize = 10.sp)
            Text(text = value, color = TextWhite, fontSize = 12.sp, fontWeight = FontWeight.Bold)
        }
    }
}

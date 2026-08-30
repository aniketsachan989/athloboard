package com.athloboard.app.ui.athlete.competitions

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
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.athloboard.app.data.models.Competition
import com.athloboard.app.ui.shared.AthloButton
import com.athloboard.app.ui.theme.AccentPrimary
import com.athloboard.app.ui.theme.BackgroundCard
import com.athloboard.app.ui.theme.BackgroundPrimary
import com.athloboard.app.ui.theme.BorderDivider
import com.athloboard.app.ui.theme.CardShape
import com.athloboard.app.ui.theme.PillShape
import com.athloboard.app.ui.theme.SuccessGreen
import com.athloboard.app.ui.theme.TextOnAccent
import com.athloboard.app.ui.theme.TextPrimary
import com.athloboard.app.ui.theme.TextSecondary

/**
 * 3.14 Competition Detail Screen (Banner, Venue, Rules, Prize Pool, 1-Tap Registration)
 */
@Composable
fun CompetitionDetailScreen(
    competition: Competition,
    onBackClick: () -> Unit,
    onRegisterSuccess: () -> Unit
) {
    var isRegistered by remember { mutableStateOf(competition.isRegistered) }
    var selectedTab by remember { mutableStateOf("Details") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundPrimary)
    ) {
        // 1. Top Banner with Back Arrow
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(200.dp)
                .background(BackgroundCard)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(
                                Color(0xFF252118),
                                BackgroundCard,
                                BackgroundPrimary
                            )
                        )
                    )
            )

            IconButton(
                onClick = onBackClick,
                modifier = Modifier
                    .padding(start = 16.dp, top = 40.dp)
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(BackgroundPrimary.copy(alpha = 0.7f))
            ) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = "Back",
                    tint = TextPrimary
                )
            }

            Box(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .padding(20.dp)
                    .clip(PillShape)
                    .background(AccentPrimary)
                    .padding(horizontal = 12.dp, vertical = 5.dp)
            ) {
                Text(
                    text = "${competition.prizePool} TOTAL PRIZE POOL",
                    color = TextOnAccent,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        // 2. Body Details
        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp)
                .padding(top = 16.dp, bottom = 32.dp)
        ) {
            Text(
                text = competition.title,
                color = TextPrimary,
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = "${competition.date} • ${competition.venue}, ${competition.city}",
                color = TextSecondary,
                fontSize = 13.sp
            )

            Spacer(modifier = Modifier.height(20.dp))

            // Navigation Tabs (Details vs Live Bracket)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf("Details", "Brackets & Results", "Rules").forEach { tab ->
                    val isSelected = selectedTab == tab
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .height(40.dp)
                            .clip(PillShape)
                            .background(if (isSelected) AccentPrimary else BackgroundCard)
                            .border(1.dp, if (isSelected) AccentPrimary else BorderDivider, PillShape)
                            .clickable { selectedTab = tab },
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = tab,
                            color = if (isSelected) TextOnAccent else TextSecondary,
                            fontSize = 12.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            when (selectedTab) {
                "Details" -> {
                    // Capacity & Registration Stats Card
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(CardShape)
                            .background(BackgroundCard)
                            .border(1.dp, BorderDivider, CardShape)
                            .padding(18.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(text = "PARTICIPATION SLOTS", color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(text = "${competition.registeredCount} / 100 Filled", color = AccentPrimary, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                            }

                            Column(horizontalAlignment = Alignment.End) {
                                Text(text = "ENTRY FEE", color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(text = "₹ ${competition.entryFee}", color = TextPrimary, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Sanctioning Federation Note
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(CardShape)
                            .background(BackgroundCard)
                            .border(1.dp, BorderDivider, CardShape)
                            .padding(16.dp)
                    ) {
                        Column {
                            Text(text = "FEDERATION SANCTION", color = AccentPrimary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "Sanctioned by Indian Powerlifting Committee. Top 3 athletes qualify for National Asian Championship Trials.",
                                color = TextSecondary,
                                fontSize = 12.sp,
                                lineHeight = 16.sp
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(24.dp))

                    AthloButton(
                        text = if (isRegistered) "Registered ✓ (Download Entry Card)" else "Register & Pay (₹ ${competition.entryFee}) →",
                        onClick = {
                            isRegistered = true
                            onRegisterSuccess()
                        },
                        modifier = Modifier.fillMaxWidth()
                    )
                }

                "Brackets & Results" -> {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(CardShape)
                            .background(BackgroundCard)
                            .border(1.dp, BorderDivider, CardShape)
                            .padding(18.dp)
                    ) {
                        Column {
                            Text(text = "CURRENT FLIGHT LEADERS (83KG)", color = AccentPrimary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(10.dp))
                            Text(text = "1. Kabir Rawat — 640.0 kg Total", color = TextPrimary, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(text = "2. Ankit Verma — 615.0 kg Total", color = TextSecondary, fontSize = 13.sp)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(text = "3. Rohan Deshmukh — 595.0 kg Total", color = TextSecondary, fontSize = 13.sp)
                        }
                    }
                }

                "Rules" -> {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(CardShape)
                            .background(BackgroundCard)
                            .border(1.dp, BorderDivider, CardShape)
                            .padding(18.dp)
                    ) {
                        Column {
                            Text(text = "OFFICIAL MEET GUIDELINES", color = AccentPrimary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(text = "• IPF-approved singlets and wrist wraps only.", color = TextSecondary, fontSize = 12.sp)
                            Text(text = "• Squat depth must clearly break hip crease parallel.", color = TextSecondary, fontSize = 12.sp)
                            Text(text = "• Head, shoulders, and glutes must remain on bench during press.", color = TextSecondary, fontSize = 12.sp)
                        }
                    }
                }
            }
        }
    }
}

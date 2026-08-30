package com.athloboard.app.ui.athlete.community

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
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.athloboard.app.ui.athlete.home.Athlo5TabBottomNav
import com.athloboard.app.ui.theme.PillShape

private val BgDark = Color(0xFF0F0F14)
private val CardDark = Color(0xFF181822)
private val CardBorder = Color(0xFF262634)
private val TextWhite = Color(0xFFFFFFFF)
private val TextMuted = Color(0xFF9090A0)
private val AccentYellow = Color(0xFFFFB703)
private val AccentGreen = Color(0xFF2EC4B6)

/**
 * EXACT 1:1 REPRODUCTION OF REFERENCE SAMPLE 2 (Center Phone - "My Plan")
 */
@Composable
fun CommunityScreen(
    onBackClick: () -> Unit,
    onOpenChat: () -> Unit = {},
    onOpenLeaderboard: () -> Unit = {},
    onOpenProfile: () -> Unit = {},
    onOpenHome: () -> Unit = {}
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp)
                .padding(top = 44.dp, bottom = 100.dp)
        ) {
            // 1. TOP HEADER: Back Arrow + "My Plan"
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
                        .clickable(onClick = onBackClick),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "‹", color = TextWhite, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                }

                Spacer(modifier = Modifier.weight(1f))

                Text(
                    text = "My Plan",
                    color = TextWhite,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.weight(1f))
                Spacer(modifier = Modifier.size(38.dp))
            }

            Spacer(modifier = Modifier.height(24.dp))

            // 2. "Daily Plan" + "Statics" Button
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Daily Plan",
                    color = TextWhite,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )

                Box(
                    modifier = Modifier
                        .clip(PillShape)
                        .background(CardDark)
                        .border(1.dp, CardBorder, PillShape)
                        .clickable(onClick = onOpenLeaderboard)
                        .padding(horizontal = 12.dp, vertical = 5.dp)
                ) {
                    Text(
                        text = "Statics",
                        color = TextMuted,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // 3. 2x2 Metric Grid (Calories, Steps, Sleep, Water)
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    MetricPlanCard(
                        title = "Calories",
                        value = "720",
                        unit = "Kcal",
                        icon = "🔥",
                        iconBg = Color(0xFF2A1C16),
                        modifier = Modifier.weight(1f)
                    )
                    MetricPlanCard(
                        title = "Steps",
                        value = "2,000",
                        unit = "Steps",
                        icon = "👣",
                        iconBg = Color(0xFF241A30),
                        modifier = Modifier.weight(1f)
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    MetricPlanCard(
                        title = "Sleep",
                        value = "6",
                        unit = "Hours",
                        icon = "🌙",
                        iconBg = Color(0xFF16251E),
                        modifier = Modifier.weight(1f)
                    )
                    MetricPlanCard(
                        title = "Water",
                        value = "10",
                        unit = "Cups",
                        icon = "💧",
                        iconBg = Color(0xFF14202E),
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            Spacer(modifier = Modifier.height(28.dp))

            // 4. "Goal in progress" + "See all"
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Goal in progress",
                    color = TextWhite,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "See all",
                    color = TextMuted,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                GoalProgressRow(title = "Lat Pulldown", time = "5 min", calories = "120 cal")
                GoalProgressRow(title = "Lat Pulldown", time = "5 min", calories = "120 cal")
                GoalProgressRow(title = "Lat Pulldown", time = "5 min", calories = "120 cal")
                GoalProgressRow(title = "Lat Pulldown", time = "5 min", calories = "120 cal")
            }
        }

        // Bottom Navigation Bar
        Athlo5TabBottomNav(
            selectedTab = 1,
            onTabSelected = { tab ->
                when (tab) {
                    0 -> onOpenHome()
                    1 -> onOpenLeaderboard()
                    2 -> onOpenHome()
                    3 -> onOpenHome()
                    4 -> onOpenProfile()
                }
            },
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
        )
    }
}

@Composable
private fun MetricPlanCard(
    title: String,
    value: String,
    unit: String,
    icon: String,
    iconBg: Color,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(18.dp))
            .background(CardDark)
            .border(1.dp, CardBorder, RoundedCornerShape(18.dp))
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = title,
                    color = TextMuted,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Medium
                )
                Spacer(modifier = Modifier.height(6.dp))
                Row(verticalAlignment = Alignment.Bottom) {
                    Text(
                        text = value,
                        color = TextWhite,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = unit,
                        color = TextMuted,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Medium,
                        modifier = Modifier.padding(bottom = 2.dp)
                    )
                }
            }

            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(iconBg),
                contentAlignment = Alignment.Center
            ) {
                Text(text = icon, fontSize = 18.sp)
            }
        }
    }
}

@Composable
private fun GoalProgressRow(
    title: String,
    time: String,
    calories: String
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(CardDark)
            .border(1.dp, CardBorder, RoundedCornerShape(16.dp))
            .padding(12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.weight(1f)
            ) {
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(Color(0xFF252535)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "💪", fontSize = 20.sp)
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column {
                    Text(
                        text = title,
                        color = TextWhite,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(3.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(text = "⏱", fontSize = 9.sp)
                            Spacer(modifier = Modifier.width(2.dp))
                            Text(text = time, color = AccentGreen, fontSize = 10.sp, fontWeight = FontWeight.SemiBold)
                        }
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(text = "🔥", fontSize = 9.sp)
                            Spacer(modifier = Modifier.width(2.dp))
                            Text(text = calories, color = AccentYellow, fontSize = 10.sp, fontWeight = FontWeight.SemiBold)
                        }
                    }
                }
            }

            Box(
                modifier = Modifier
                    .size(34.dp)
                    .clip(CircleShape)
                    .background(Color.White.copy(alpha = 0.08f))
                    .border(1.dp, Color.White.copy(alpha = 0.2f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.PlayArrow,
                    contentDescription = "Start",
                    tint = Color.White,
                    modifier = Modifier.size(16.dp)
                )
            }
        }
    }
}

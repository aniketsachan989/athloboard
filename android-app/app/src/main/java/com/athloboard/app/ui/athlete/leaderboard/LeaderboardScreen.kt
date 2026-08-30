package com.athloboard.app.ui.athlete.leaderboard

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
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
import com.athloboard.app.data.models.Athlete
import com.athloboard.app.ui.athlete.home.Athlo5TabBottomNav
import com.athloboard.app.ui.theme.PillShape

private val BgDark = Color(0xFF0F0F14)
private val CardDark = Color(0xFF181822)
private val CardBorder = Color(0xFF262634)
private val TextWhite = Color(0xFFFFFFFF)
private val TextMuted = Color(0xFF9090A0)
private val AccentYellow = Color(0xFFFFB703)
private val TextOnAccent = Color(0xFF0F0F14)

/**
 * ATHLOBOARD NATIONAL LEADERBOARD — Styled with Modern Dark Theme
 */
@Composable
fun LeaderboardScreen(
    onBackClick: () -> Unit,
    onAthleteClick: (Athlete) -> Unit = {},
    onOpenHome: () -> Unit = {},
    onOpenProfile: () -> Unit = {},
    onLogLiftClick: () -> Unit = {},
    onOpenStore: () -> Unit = {}
) {
    val athletes by AthloRepository.leaderboard.collectAsState()
    val currentAthlete by AthloRepository.currentAthlete.collectAsState()

    var selectedScope by remember { mutableStateOf("National") }
    var selectedExercise by remember { mutableStateOf("Combined") }
    var selectedWeightClass by remember { mutableStateOf("ALL") }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp)
                .padding(top = 44.dp, bottom = 80.dp)
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
                        .clickable(onClick = onBackClick),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "‹", color = TextWhite, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                }

                Spacer(modifier = Modifier.weight(1f))

                Text(
                    text = "National Leaderboard",
                    color = TextWhite,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.weight(1f))
                Spacer(modifier = Modifier.size(38.dp))
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Filter Scope Pills (City, State, National)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf("National", "State", "City", "-83 kg", "-93 kg", "-105 kg").forEach { filter ->
                    val isSelected = selectedScope == filter || selectedWeightClass == filter
                    Box(
                        modifier = Modifier
                            .clip(PillShape)
                            .background(if (isSelected) AccentYellow else CardDark)
                            .border(1.dp, if (isSelected) AccentYellow else CardBorder, PillShape)
                            .clickable {
                                if (filter.contains("kg")) selectedWeightClass = filter else selectedScope = filter
                            }
                            .padding(horizontal = 14.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = filter,
                            color = if (isSelected) TextOnAccent else TextWhite,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Ranked List
            LazyColumn(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                itemsIndexed(athletes) { index, athlete ->
                    val rank = index + 1
                    val total = athlete.prSquat + athlete.prBench + athlete.prDeadlift
                    val isTop3 = rank <= 3

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .background(CardDark)
                            .border(1.dp, if (isTop3) AccentYellow.copy(alpha = 0.5f) else CardBorder, RoundedCornerShape(16.dp))
                            .clickable { onAthleteClick(athlete) }
                            .padding(14.dp)
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
                                // Rank Badge
                                Box(
                                    modifier = Modifier
                                        .size(32.dp)
                                        .clip(CircleShape)
                                        .background(
                                            when (rank) {
                                                1 -> AccentYellow
                                                2 -> Color(0xFFC0C0C0)
                                                3 -> Color(0xFFCD7F32)
                                                else -> Color(0xFF252535)
                                            }
                                        ),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = "$rank",
                                        color = if (isTop3) TextOnAccent else TextWhite,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }

                                Spacer(modifier = Modifier.width(12.dp))

                                Column {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(
                                            text = athlete.name,
                                            color = TextWhite,
                                            fontSize = 14.sp,
                                            fontWeight = FontWeight.Bold
                                        )
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text(text = "✓", color = AccentYellow, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    }
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Text(
                                        text = "${athlete.gymName} • ${athlete.weightClass}",
                                        color = TextMuted,
                                        fontSize = 11.sp
                                    )
                                }
                            }

                            Column(horizontalAlignment = Alignment.End) {
                                Text(
                                    text = "$total kg",
                                    color = AccentYellow,
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Black
                                )
                                Text(
                                    text = "S: ${athlete.prSquat} | B: ${athlete.prBench} | D: ${athlete.prDeadlift}",
                                    color = TextMuted,
                                    fontSize = 9.sp
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Sticky Your Rank Banner
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(Color(0xFF222232))
                    .border(1.dp, AccentYellow, RoundedCornerShape(16.dp))
                    .padding(14.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(text = "🥇", fontSize = 20.sp)
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(text = "Your National Rank: #${currentAthlete.rank}", color = TextWhite, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                            Text(text = "Total: ${currentAthlete.prSquat + currentAthlete.prBench + currentAthlete.prDeadlift} kg", color = TextMuted, fontSize = 11.sp)
                        }
                    }

                    Box(
                        modifier = Modifier
                            .clip(PillShape)
                            .background(AccentYellow)
                            .clickable(onClick = onLogLiftClick)
                            .padding(horizontal = 10.dp, vertical = 5.dp)
                    ) {
                        Text(text = "+ Log Lift", color = TextOnAccent, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        // Bottom Navigation Bar
        Athlo5TabBottomNav(
            selectedTab = 1,
            onTabSelected = { tab ->
                when (tab) {
                    0 -> onOpenHome()
                    1 -> { /* Leaderboard */ }
                    2 -> onLogLiftClick()
                    3 -> onOpenStore()
                    4 -> onOpenProfile()
                }
            },
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
        )
    }
}

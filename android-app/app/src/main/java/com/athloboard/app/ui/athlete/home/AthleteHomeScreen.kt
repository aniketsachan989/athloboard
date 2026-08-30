package com.athloboard.app.ui.athlete.home

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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.athloboard.app.data.AthloRepository
import com.athloboard.app.data.models.Competition
import com.athloboard.app.ui.theme.PillShape
import java.util.Calendar

private val BgDark = Color(0xFF0F0F14)
private val CardDark = Color(0xFF181822)
private val CardBorder = Color(0xFF262634)
private val PurpleGradientStart = Color(0xFF8A2BE2)
private val PurpleGradientEnd = Color(0xFF5B1BB8)
private val TextWhite = Color(0xFFFFFFFF)
private val TextMuted = Color(0xFF9090A0)
private val AccentYellow = Color(0xFFFFB703)
private val AccentGreen = Color(0xFF2EC4B6)
private val TextOnAccent = Color(0xFF0F0F14)

@Composable
fun AthleteHomeScreen(
    athleteName: String = "Athlete",
    onLogLiftClick: () -> Unit,
    onViewAllUpcoming: () -> Unit,
    onOpenLeaderboard: () -> Unit,
    onOpenCompetitions: () -> Unit,
    onOpenProfile: () -> Unit,
    onOpenGymHub: () -> Unit,
    onOpenRewards: () -> Unit = {},
    onOpenCommunity: () -> Unit = {},
    onOpenStore: () -> Unit = {},
    onOpenNotifications: () -> Unit = {}
) {
    val currentAthlete by AthloRepository.currentAthlete.collectAsState()
    val leaderboard by AthloRepository.leaderboard.collectAsState()
    val competitions by AthloRepository.competitions.collectAsState()
    val currentGym by AthloRepository.currentGym.collectAsState()

    val hour = remember { Calendar.getInstance().get(Calendar.HOUR_OF_DAY) }
    val greeting = when {
        hour in 4..11 -> "Good Morning"
        hour in 12..16 -> "Good Afternoon"
        else -> "Good Evening"
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(top = 44.dp, bottom = 90.dp)
        ) {
            // 1. TOP HEADER (Avatar, Name, Handle, Streak & Notifications)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.weight(1f)
                ) {
                    Box(
                        modifier = Modifier
                            .size(46.dp)
                            .clip(CircleShape)
                            .background(Color(0xFF8338EC))
                            .clickable(onClick = onOpenProfile),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = "🏋️", fontSize = 22.sp)
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Column {
                        Text(
                            text = "$greeting 👋",
                            color = TextMuted,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium
                        )
                        Text(
                            text = currentAthlete.name.ifBlank { athleteName },
                            color = TextWhite,
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Bold,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    // Streak Pill
                    Box(
                        modifier = Modifier
                            .clip(PillShape)
                            .background(CardDark)
                            .border(1.dp, CardBorder, PillShape)
                            .padding(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(text = "🔥", fontSize = 12.sp)
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "${currentAthlete.streakDays}d",
                                color = AccentYellow,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    // Notification Bell
                    Box(
                        modifier = Modifier
                            .size(38.dp)
                            .clip(CircleShape)
                            .background(CardDark)
                            .border(1.dp, CardBorder, CircleShape)
                            .clickable(onClick = onOpenNotifications),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Notifications,
                            contentDescription = "Notifications",
                            tint = TextWhite,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // 2. HERO SBD POWER CARD
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp)
                    .clip(RoundedCornerShape(22.dp))
                    .background(
                        Brush.linearGradient(
                            colors = listOf(PurpleGradientStart, PurpleGradientEnd)
                        )
                    )
                    .clickable(onClick = onLogLiftClick)
                    .padding(20.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Verified Competition Total",
                            color = Color(0xFFE2D4FF),
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "${currentAthlete.prSquat + currentAthlete.prBench + currentAthlete.prDeadlift} KG",
                            color = TextWhite,
                            fontSize = 28.sp,
                            fontWeight = FontWeight.Black
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "⚡ Division ${currentAthlete.weightClass.ifBlank { "-83kg" }} • Rank #${currentAthlete.rank}",
                            color = AccentYellow,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Box(
                        modifier = Modifier.size(64.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator(
                            progress = { 0.75f },
                            modifier = Modifier.fillMaxSize(),
                            color = AccentYellow,
                            trackColor = Color.White.copy(alpha = 0.25f),
                            strokeWidth = 6.dp
                        )
                        Text(
                            text = "75%",
                            color = TextWhite,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // 3. SBD PR METERS (Squat, Bench, Deadlift)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = "Powerlifting Disciplines", color = TextWhite, fontSize = 17.sp, fontWeight = FontWeight.Bold)
                Text(text = "+ Log Lift", color = AccentYellow, fontSize = 12.sp, fontWeight = FontWeight.Bold, modifier = Modifier.clickable(onClick = onLogLiftClick))
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
                    .padding(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                DisciplineCard(title = "Raw Squat", prValue = "PR: ${currentAthlete.prSquat} kg", targetMuscles = "Quads & Glutes", time = "45 min", calories = "340 kcal", onClick = onLogLiftClick)
                DisciplineCard(title = "Bench Press", prValue = "PR: ${currentAthlete.prBench} kg", targetMuscles = "Chest & Triceps", time = "35 min", calories = "220 kcal", onClick = onLogLiftClick)
                DisciplineCard(title = "Deadlift", prValue = "PR: ${currentAthlete.prDeadlift} kg", targetMuscles = "Posterior Chain", time = "40 min", calories = "410 kcal", onClick = onLogLiftClick)
            }

            Spacer(modifier = Modifier.height(24.dp))

            // 4. QUICK ACTIONS
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Text(text = "Quick Actions", color = TextWhite, fontSize = 17.sp, fontWeight = FontWeight.Bold)
                ActionRowItem(icon = "⚡", title = "Record Verified Lift", subtitle = "CameraX referee video audit for national ranking", onClick = onLogLiftClick)
                ActionRowItem(icon = "📈", title = "National Leaderboards", subtitle = "Explore top IPF lifters across weight classes", onClick = onOpenLeaderboard)
                ActionRowItem(icon = "🏆", title = "Sanctioned Meets & Competitions", subtitle = "Register for upcoming state & national events", onClick = onOpenCompetitions)
                ActionRowItem(icon = "🛍️", title = "Supplements & Brand Store", subtitle = "Redeem coupons and shop verified lifting gear", onClick = onOpenStore)
            }

            Spacer(modifier = Modifier.height(24.dp))

            // 5. TOP RANKED LIFTERS
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = "Top Ranked Lifters", color = TextWhite, fontSize = 17.sp, fontWeight = FontWeight.Bold)
                Text(text = "See all", color = AccentYellow, fontSize = 12.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.clickable(onClick = onOpenLeaderboard))
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
                    .padding(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                leaderboard.take(6).forEachIndexed { idx, athlete ->
                    AthleteAvatarPill(
                        rank = idx + 1,
                        name = athlete.name,
                        totalKg = "${athlete.prSquat + athlete.prBench + athlete.prDeadlift} kg",
                        onClick = onOpenLeaderboard
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // 6. NEARBY AUDITED GYMS
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = "Nearby Audited Strength Gyms", color = TextWhite, fontSize = 17.sp, fontWeight = FontWeight.Bold)
                Text(text = "Explore", color = AccentYellow, fontSize = 12.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.clickable(onClick = onOpenGymHub))
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
                    .padding(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                GymCard(title = currentGym.gymName, location = currentGym.location, rating = "${currentGym.rating} ★", distance = "1.2 km", onClick = onOpenGymHub)
                GymCard(title = "Olympus Strength Club", location = "Bandra West, Mumbai", rating = "4.8 ★", distance = "2.8 km", onClick = onOpenGymHub)
            }

            Spacer(modifier = Modifier.height(24.dp))

            // 7. UPCOMING MEETS
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = "Upcoming Powerlifting Meets", color = TextWhite, fontSize = 17.sp, fontWeight = FontWeight.Bold)
                Text(text = "See all", color = AccentYellow, fontSize = 12.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.clickable(onClick = onViewAllUpcoming))
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
                    .padding(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                competitions.forEach { comp ->
                    CompetitionCard(competition = comp, onClick = onOpenCompetitions)
                }
            }
        }

        // 8. DOCKED FLOATING NAVIGATION BAR
        Athlo5TabBottomNav(
            selectedTab = 0,
            onTabSelected = { tab ->
                when (tab) {
                    0 -> {}
                    1 -> onOpenLeaderboard()
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

@Composable
private fun DisciplineCard(
    title: String,
    prValue: String,
    targetMuscles: String,
    time: String,
    calories: String,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .width(180.dp)
            .clip(RoundedCornerShape(18.dp))
            .background(CardDark)
            .border(1.dp, CardBorder, RoundedCornerShape(18.dp))
            .clickable(onClick = onClick)
    ) {
        Column {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(95.dp)
                    .background(Color(0xFF22222E)),
                contentAlignment = Alignment.Center
            ) {
                Text(text = "🏋️", fontSize = 32.sp)
                Box(
                    modifier = Modifier
                        .size(34.dp)
                        .clip(CircleShape)
                        .background(AccentYellow),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(imageVector = Icons.Default.PlayArrow, contentDescription = null, tint = TextOnAccent, modifier = Modifier.size(18.dp))
                }
            }

            Column(modifier = Modifier.padding(12.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = title, color = TextWhite, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    Text(text = prValue, color = AccentYellow, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
                Spacer(modifier = Modifier.height(2.dp))
                Text(text = targetMuscles, color = TextMuted, fontSize = 10.sp, maxLines = 1, overflow = TextOverflow.Ellipsis)
                Spacer(modifier = Modifier.height(6.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(text = "⏱ $time", color = AccentGreen, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    Text(text = "🔥 $calories", color = AccentYellow, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
private fun ActionRowItem(
    icon: String,
    title: String,
    subtitle: String,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(CardDark)
            .border(1.dp, CardBorder, RoundedCornerShape(16.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 14.dp, vertical = 12.dp)
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
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(Color(0xFF252535)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = icon, fontSize = 18.sp)
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column {
                    Text(text = title, color = TextWhite, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    Text(text = subtitle, color = TextMuted, fontSize = 11.sp, maxLines = 1, overflow = TextOverflow.Ellipsis)
                }
            }

            Box(
                modifier = Modifier
                    .clip(PillShape)
                    .background(AccentYellow)
                    .padding(horizontal = 10.dp, vertical = 4.dp)
            ) {
                Text(text = "Start →", color = TextOnAccent, fontSize = 10.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
private fun AthleteAvatarPill(
    rank: Int,
    name: String,
    totalKg: String,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .width(100.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(CardDark)
            .border(1.dp, CardBorder, RoundedCornerShape(16.dp))
            .clickable(onClick = onClick)
            .padding(10.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Box(
                modifier = Modifier
                    .size(38.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF8338EC)),
                contentAlignment = Alignment.Center
            ) {
                Text(text = "🏋️", fontSize = 18.sp)
            }
            Spacer(modifier = Modifier.height(6.dp))
            Text(text = name, color = TextWhite, fontSize = 11.sp, fontWeight = FontWeight.Bold, maxLines = 1, overflow = TextOverflow.Ellipsis)
            Text(text = totalKg, color = AccentYellow, fontSize = 10.sp, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
private fun GymCard(
    title: String,
    location: String,
    rating: String,
    distance: String,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .width(210.dp)
            .clip(RoundedCornerShape(18.dp))
            .background(CardDark)
            .border(1.dp, CardBorder, RoundedCornerShape(18.dp))
            .clickable(onClick = onClick)
    ) {
        Column {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(90.dp)
                    .background(Color(0xFF22222E)),
                contentAlignment = Alignment.Center
            ) {
                Text(text = "🏢", fontSize = 30.sp)
                Box(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(8.dp)
                        .clip(PillShape)
                        .background(BgDark.copy(alpha = 0.8f))
                        .padding(horizontal = 7.dp, vertical = 3.dp)
                ) {
                    Text(text = rating, color = AccentYellow, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                }
            }

            Column(modifier = Modifier.padding(12.dp)) {
                Text(text = title, color = TextWhite, fontSize = 13.sp, fontWeight = FontWeight.Bold, maxLines = 1)
                Spacer(modifier = Modifier.height(2.dp))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text(text = location, color = TextMuted, fontSize = 10.sp, maxLines = 1, modifier = Modifier.weight(1f))
                    Text(text = distance, color = AccentGreen, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun Athlo5TabBottomNav(
    selectedTab: Int,
    onTabSelected: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .background(BgDark)
            .border(1.dp, CardBorder, RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp))
            .padding(horizontal = 16.dp, vertical = 8.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            NavItem(label = "Home", icon = "🏠", isSelected = selectedTab == 0, onClick = { onTabSelected(0) })
            NavItem(label = "Rank", icon = "📈", isSelected = selectedTab == 1, onClick = { onTabSelected(1) })

            Box(
                modifier = Modifier
                    .size(46.dp)
                    .clip(CircleShape)
                    .background(AccentYellow)
                    .clickable { onTabSelected(2) },
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Add,
                    contentDescription = "Log Lift",
                    tint = TextOnAccent,
                    modifier = Modifier.size(24.dp)
                )
            }

            NavItem(label = "Store", icon = "🛍️", isSelected = selectedTab == 3, onClick = { onTabSelected(3) })
            NavItem(label = "Profile", icon = "👤", isSelected = selectedTab == 4, onClick = { onTabSelected(4) })
        }
    }
}

@Composable
private fun NavItem(
    label: String,
    icon: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .clickable(onClick = onClick)
            .padding(horizontal = 8.dp)
    ) {
        Text(text = icon, fontSize = 17.sp)
        Spacer(modifier = Modifier.height(2.dp))
        Text(
            text = label,
            color = if (isSelected) AccentYellow else TextMuted,
            fontSize = 9.sp,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
        )
    }
}

@Composable
private fun CompetitionCard(
    competition: Competition,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .width(220.dp)
            .clip(RoundedCornerShape(18.dp))
            .background(CardDark)
            .border(1.dp, CardBorder, RoundedCornerShape(18.dp))
            .clickable(onClick = onClick)
            .padding(14.dp)
    ) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .clip(PillShape)
                        .background(Color(0xFF241A30))
                        .padding(horizontal = 8.dp, vertical = 3.dp)
                ) {
                    Text(text = competition.category, color = Color(0xFFC77DFF), fontSize = 9.sp, fontWeight = FontWeight.Bold)
                }
                Text(text = competition.date, color = TextMuted, fontSize = 10.sp)
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = competition.title,
                color = TextWhite,
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(modifier = Modifier.height(2.dp))

            Text(
                text = "${competition.venue}, ${competition.city}",
                color = TextMuted,
                fontSize = 10.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = "Prize: ${competition.prizePool}", color = AccentYellow, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                Box(
                    modifier = Modifier
                        .clip(PillShape)
                        .background(AccentYellow)
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Text(text = "Register", color = TextOnAccent, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

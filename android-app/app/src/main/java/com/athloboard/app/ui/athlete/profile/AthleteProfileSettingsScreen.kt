package com.athloboard.app.ui.athlete.profile

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
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.athloboard.app.data.AthloRepository
import com.athloboard.app.ui.athlete.home.Athlo5TabBottomNav
import com.athloboard.app.ui.theme.PillShape

private val BgDark = Color(0xFF0F0F14)
private val CardDark = Color(0xFF181822)
private val CardBorder = Color(0xFF262634)
private val TextWhite = Color(0xFFFFFFFF)
private val TextMuted = Color(0xFF9090A0)
private val AccentYellow = Color(0xFFFFB703)
private val AccentPurple = Color(0xFF8338EC)

/**
 * EXACT 1:1 REPRODUCTION OF SETTINGS / PROFILE SCREEN
 */
@Composable
fun AthleteProfileSettingsScreen(
    onBackClick: () -> Unit,
    onOpenNotifications: () -> Unit,
    onOpenRewards: () -> Unit,
    onEditProfile: () -> Unit = {},
    onLogout: () -> Unit,
    onOpenHome: () -> Unit = {},
    onOpenDiscover: () -> Unit = {},
    onOpenActivity: () -> Unit = {}
) {
    val currentAthlete by AthloRepository.currentAthlete.collectAsState()

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
                .padding(top = 44.dp, bottom = 100.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Header Bar
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
                    text = "Settings & Profile",
                    color = TextWhite,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.weight(1f))
                Spacer(modifier = Modifier.size(38.dp))
            }

            Spacer(modifier = Modifier.height(28.dp))

            // Profile Photo with Purple/Gold Ring
            Box(
                modifier = Modifier
                    .size(86.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF8338EC)),
                contentAlignment = Alignment.Center
            ) {
                Text(text = "🏋️", fontSize = 40.sp)
            }

            Spacer(modifier = Modifier.height(14.dp))

            Text(
                text = currentAthlete.name.ifBlank { "Athlete" },
                color = TextWhite,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = currentAthlete.email.ifBlank { "athlete@athloboard.com" },
                color = TextMuted,
                fontSize = 13.sp
            )

            Spacer(modifier = Modifier.height(24.dp))

            // 3-Stat Tile Grid (Total SBD, Rank, Lift Points)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                ProfileStatPill(title = "Total SBD", value = "${currentAthlete.prSquat + currentAthlete.prBench + currentAthlete.prDeadlift} kg", modifier = Modifier.weight(1f))
                ProfileStatPill(title = "Rank", value = "#${currentAthlete.rank}", modifier = Modifier.weight(1f))
                ProfileStatPill(title = "Weight Class", value = currentAthlete.weightClass, modifier = Modifier.weight(1f))
            }

            Spacer(modifier = Modifier.height(28.dp))

            // Menu Items List
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                SettingsMenuRow(icon = Icons.Default.Person, title = "Edit Profile & Info", onClick = onEditProfile)
                SettingsMenuRow(icon = Icons.Default.Notifications, title = "Push Notifications", onClick = onOpenNotifications)
                SettingsMenuRow(icon = Icons.Default.Info, title = "Rewards & Coupons", onClick = onOpenRewards)
                SettingsMenuRow(icon = Icons.Default.Lock, title = "Log Out", isDestructive = true, onClick = onLogout)
            }
        }

        // Bottom Navigation Bar
        Athlo5TabBottomNav(
            selectedTab = 4,
            onTabSelected = { tab ->
                when (tab) {
                    0 -> onOpenHome()
                    1 -> onOpenActivity()
                    2 -> onOpenHome()
                    3 -> onOpenDiscover()
                    4 -> { /* Profile */ }
                }
            },
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
        )
    }
}

@Composable
private fun ProfileStatPill(
    title: String,
    value: String,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .background(CardDark)
            .border(1.dp, CardBorder, RoundedCornerShape(16.dp))
            .padding(vertical = 14.dp, horizontal = 8.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(text = value, color = AccentYellow, fontSize = 15.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(3.dp))
            Text(text = title, color = TextMuted, fontSize = 10.sp, fontWeight = FontWeight.Medium)
        }
    }
}

@Composable
private fun SettingsMenuRow(
    icon: ImageVector,
    title: String,
    isDestructive: Boolean = false,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(CardDark)
            .border(1.dp, CardBorder, RoundedCornerShape(16.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 14.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = icon,
                    contentDescription = title,
                    tint = if (isDestructive) Color(0xFFFF5964) else AccentPurple,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(14.dp))
                Text(
                    text = title,
                    color = if (isDestructive) Color(0xFFFF5964) else TextWhite,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium
                )
            }

            Icon(
                imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                contentDescription = null,
                tint = TextMuted,
                modifier = Modifier.size(16.dp)
            )
        }
    }
}

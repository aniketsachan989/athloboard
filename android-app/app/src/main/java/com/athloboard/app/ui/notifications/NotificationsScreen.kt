package com.athloboard.app.ui.notifications

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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.athloboard.app.ui.shared.AthloTopBar
import com.athloboard.app.ui.theme.AccentPrimary
import com.athloboard.app.ui.theme.BackgroundCard
import com.athloboard.app.ui.theme.BackgroundPrimary
import com.athloboard.app.ui.theme.BorderDivider
import com.athloboard.app.ui.theme.CardShape
import com.athloboard.app.ui.theme.ErrorRed
import com.athloboard.app.ui.theme.SuccessGreen
import com.athloboard.app.ui.theme.TextPrimary
import com.athloboard.app.ui.theme.TextSecondary

data class NotificationItem(
    val id: String,
    val title: String,
    val message: String,
    val time: String,
    val isUnread: Boolean,
    val type: String, // VERIFIED, PROMO, MEET, ALERT
    val section: String // Today, Earlier
)

/**
 * 3.20 Notifications Screen (Grouped by Today/Earlier, Unread Yellow Dots)
 */
@Composable
fun NotificationsScreen(
    onBackClick: () -> Unit
) {
    val notifications = remember {
        listOf(
            NotificationItem(
                id = "N1",
                title = "225 KG Squat Verified ✓",
                message = "Super Admin approved your lift with 3 white lights. National rank updated to #1.",
                time = "15m ago",
                isUnread = true,
                type = "VERIFIED",
                section = "Today"
            ),
            NotificationItem(
                id = "N2",
                title = "Meet Flight Registration Confirmed",
                message = "You are assigned to Flight A in National Raw Powerlifting Cup 2026.",
                time = "2h ago",
                isUnread = true,
                type = "MEET",
                section = "Today"
            ),
            NotificationItem(
                id = "N3",
                title = "New Promo from Titan Iron Club",
                message = "20% discount on Annual Pass is active until end of month.",
                time = "2 days ago",
                isUnread = false,
                type = "PROMO",
                section = "Earlier"
            ),
            NotificationItem(
                id = "N4",
                title = "230 KG Squat Attempt Feedback",
                message = "Depth was slightly above parallel. Review referee angle notes.",
                time = "5 days ago",
                isUnread = false,
                type = "ALERT",
                section = "Earlier"
            )
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundPrimary)
            .padding(horizontal = 20.dp)
            .padding(top = 24.dp, bottom = 16.dp)
    ) {
        AthloTopBar(
            title = "Notifications",
            onBackClick = onBackClick
        )

        Spacer(modifier = Modifier.height(14.dp))

        LazyColumn(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            val grouped = notifications.groupBy { it.section }

            grouped.forEach { (section, items) ->
                item {
                    Text(
                        text = section,
                        color = TextSecondary,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.5.sp,
                        modifier = Modifier.padding(top = 10.dp, bottom = 4.dp)
                    )
                }

                items(items) { notif ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(CardShape)
                            .background(BackgroundCard)
                            .border(1.dp, BorderDivider, CardShape)
                            .padding(14.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            // Icon Container
                            val (icon, tint) = when (notif.type) {
                                "VERIFIED" -> "✓" to SuccessGreen
                                "MEET" -> "🏆" to AccentPrimary
                                "PROMO" -> "🔥" to AccentPrimary
                                else -> "⚠️" to ErrorRed
                            }

                            Box(
                                modifier = Modifier
                                    .size(40.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(BackgroundPrimary)
                                    .border(1.dp, tint.copy(alpha = 0.4f), RoundedCornerShape(12.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(text = icon, color = tint, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            // Message Text
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = notif.title,
                                    color = TextPrimary,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold
                                )

                                Spacer(modifier = Modifier.height(2.dp))

                                Text(
                                    text = notif.message,
                                    color = TextSecondary,
                                    fontSize = 12.sp,
                                    lineHeight = 16.sp
                                )

                                Spacer(modifier = Modifier.height(4.dp))

                                Text(
                                    text = notif.time,
                                    color = TextSecondary.copy(alpha = 0.7f),
                                    fontSize = 10.sp
                                )
                            }

                            // Unread Yellow Dot Indicator
                            if (notif.isUnread) {
                                Spacer(modifier = Modifier.width(8.dp))
                                Box(
                                    modifier = Modifier
                                        .size(8.dp)
                                        .clip(CircleShape)
                                        .background(AccentPrimary)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

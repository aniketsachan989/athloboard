package com.athloboard.app.ui.athlete.lift

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
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.athloboard.app.ui.shared.AthloTopBar
import com.athloboard.app.ui.theme.AccentPrimary
import com.athloboard.app.ui.theme.BackgroundCard
import com.athloboard.app.ui.theme.BackgroundPrimary
import com.athloboard.app.ui.theme.BorderDivider
import com.athloboard.app.ui.theme.CardShape
import com.athloboard.app.ui.theme.ErrorRed
import com.athloboard.app.ui.theme.PillShape
import com.athloboard.app.ui.theme.SuccessGreen
import com.athloboard.app.ui.theme.TextOnAccent
import com.athloboard.app.ui.theme.TextPrimary
import com.athloboard.app.ui.theme.TextSecondary

data class LiftRecordItem(
    val id: String,
    val exercise: String,
    val weightKg: Int,
    val reps: Int,
    val date: String,
    val status: String, // PENDING, VERIFIED, REJECTED
    val refereeNotes: String,
    val icon: String
)

/**
 * 3.9 Lift Status & Submission History Screen
 */
@Composable
fun LiftHistoryScreen(
    onBackClick: () -> Unit,
    onLogNewLift: () -> Unit
) {
    var selectedFilter by remember { mutableStateOf("ALL") }
    var expandedRecordId by remember { mutableStateOf<String?>(null) }

    val allRecords = remember {
        listOf(
            LiftRecordItem(
                id = "LFT-901",
                exercise = "Raw Squat",
                weightKg = 225,
                reps = 1,
                date = "Aug 28, 2026",
                status = "VERIFIED",
                refereeNotes = "3 White Lights ✓ Hip crease cleanly broke parallel. Valid lift.",
                icon = "🏋️"
            ),
            LiftRecordItem(
                id = "LFT-902",
                exercise = "Paused Bench Press",
                weightKg = 155,
                reps = 1,
                date = "Aug 27, 2026",
                status = "VERIFIED",
                refereeNotes = "3 White Lights ✓ Head and glutes remained on bench during 2-second chest pause.",
                icon = "💪"
            ),
            LiftRecordItem(
                id = "LFT-903",
                exercise = "Conventional Deadlift",
                weightKg = 265,
                reps = 1,
                date = "Today",
                status = "PENDING",
                refereeNotes = "Queued in Super Admin video analysis pool. Estimated verification: 2 hours.",
                icon = "🔥"
            ),
            LiftRecordItem(
                id = "LFT-904",
                exercise = "Raw Squat",
                weightKg = 230,
                reps = 1,
                date = "Aug 15, 2026",
                status = "REJECTED",
                refereeNotes = "Red Light ✗ Hip crease remained slightly above parallel. Depth not broken.",
                icon = "🏋️"
            )
        )
    }

    val filteredRecords = remember(selectedFilter) {
        if (selectedFilter == "ALL") allRecords else allRecords.filter { it.status == selectedFilter }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundPrimary)
            .padding(horizontal = 20.dp)
            .padding(top = 24.dp, bottom = 16.dp)
    ) {
        AthloTopBar(
            title = "Lift History & Status",
            onBackClick = onBackClick
        )

        Spacer(modifier = Modifier.height(14.dp))

        // Filter Chips Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            listOf("ALL" to "All", "VERIFIED" to "Verified", "PENDING" to "Pending", "REJECTED" to "Rejected").forEach { (key, label) ->
                val isSelected = selectedFilter == key
                Box(
                    modifier = Modifier
                        .clip(PillShape)
                        .background(if (isSelected) AccentPrimary else BackgroundCard)
                        .border(1.dp, if (isSelected) AccentPrimary else BorderDivider, PillShape)
                        .clickable { selectedFilter = key }
                        .padding(horizontal = 14.dp, vertical = 7.dp)
                ) {
                    Text(
                        text = label,
                        color = if (isSelected) TextOnAccent else TextSecondary,
                        fontSize = 12.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // Records List
        LazyColumn(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(filteredRecords) { item ->
                val isExpanded = expandedRecordId == item.id

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(CardShape)
                        .background(BackgroundCard)
                        .border(
                            1.dp,
                            when (item.status) {
                                "VERIFIED" -> SuccessGreen.copy(alpha = 0.5f)
                                "PENDING" -> AccentPrimary.copy(alpha = 0.5f)
                                else -> ErrorRed.copy(alpha = 0.5f)
                            },
                            CardShape
                        )
                        .clickable {
                            expandedRecordId = if (isExpanded) null else item.id
                        }
                        .padding(16.dp)
                ) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            // Exercise Icon
                            Box(
                                modifier = Modifier
                                    .size(44.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(BackgroundPrimary)
                                    .border(1.dp, BorderDivider, RoundedCornerShape(12.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(text = item.icon, fontSize = 20.sp)
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            // Name + Date
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "${item.weightKg} KG ${item.exercise}",
                                    color = TextPrimary,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )

                                Spacer(modifier = Modifier.height(2.dp))

                                Text(
                                    text = "${item.date} • ${item.reps} Rep",
                                    color = TextSecondary,
                                    fontSize = 12.sp
                                )
                            }

                            Spacer(modifier = Modifier.width(8.dp))

                            // Status Badge
                            val (badgeBg, badgeText, badgeColor) = when (item.status) {
                                "VERIFIED" -> Triple(SuccessGreen.copy(alpha = 0.15f), "VERIFIED ✓", SuccessGreen)
                                "PENDING" -> Triple(AccentPrimary.copy(alpha = 0.15f), "PENDING •", AccentPrimary)
                                else -> Triple(ErrorRed.copy(alpha = 0.15f), "REJECTED ✗", ErrorRed)
                            }

                            Box(
                                modifier = Modifier
                                    .clip(PillShape)
                                    .background(badgeBg)
                                    .padding(horizontal = 10.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    text = badgeText,
                                    color = badgeColor,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        // Expandable Referee Notes & Reasons
                        if (isExpanded) {
                            Spacer(modifier = Modifier.height(12.dp))

                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(BackgroundPrimary)
                                    .padding(12.dp)
                            ) {
                                Column {
                                    Text(
                                        text = "SUPER ADMIN REFEREE FEEDBACK",
                                        color = AccentPrimary,
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold,
                                        letterSpacing = 0.5.sp
                                    )
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = item.refereeNotes,
                                        color = TextPrimary,
                                        fontSize = 12.sp,
                                        lineHeight = 16.sp
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

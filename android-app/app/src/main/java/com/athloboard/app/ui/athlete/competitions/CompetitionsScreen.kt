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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.athloboard.app.data.AthloRepository
import com.athloboard.app.data.models.Competition
import com.athloboard.app.ui.shared.AthloTopBar
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
 * 3.13 Sanctioned Competitions Screen (Filter chips, competition cards, 1-tap detail)
 */
@Composable
fun CompetitionsScreen(
    onBackClick: () -> Unit,
    onCompetitionClick: (Competition) -> Unit
) {
    val competitions by AthloRepository.competitions.collectAsState()
    var selectedFilter by remember { mutableStateOf("ALL") }

    val filteredComps = remember(competitions, selectedFilter) {
        when (selectedFilter) {
            "SBD" -> competitions.filter { it.category.contains("Powerlifting", ignoreCase = true) }
            "BENCH" -> competitions.filter { it.category.contains("Bench", ignoreCase = true) }
            else -> competitions
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundPrimary)
            .padding(horizontal = 20.dp)
            .padding(top = 24.dp, bottom = 16.dp)
    ) {
        AthloTopBar(
            title = "Sanctioned Meets",
            onBackClick = onBackClick
        )

        Spacer(modifier = Modifier.height(14.dp))

        // Filter Chips Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            listOf("ALL" to "All Meets", "SBD" to "Full SBD", "BENCH" to "Bench Only").forEach { (key, label) ->
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

        // Competitions List
        LazyColumn(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            items(filteredComps) { comp ->
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(CardShape)
                        .background(BackgroundCard)
                        .border(1.dp, BorderDivider, CardShape)
                        .clickable { onCompetitionClick(comp) }
                        .padding(18.dp)
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
                                    .background(AccentPrimary.copy(alpha = 0.15f))
                                    .padding(horizontal = 10.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    text = "${comp.prizePool} PRIZE POOL",
                                    color = AccentPrimary,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }

                            if (comp.isRegistered) {
                                Box(
                                    modifier = Modifier
                                        .clip(PillShape)
                                        .background(SuccessGreen.copy(alpha = 0.15f))
                                        .padding(horizontal = 8.dp, vertical = 3.dp)
                                ) {
                                    Text(text = "REGISTERED ✓", color = SuccessGreen, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        Text(
                            text = comp.title,
                            color = TextPrimary,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )

                        Spacer(modifier = Modifier.height(4.dp))

                        Text(
                            text = "${comp.date} • ${comp.venue}, ${comp.city}",
                            color = TextSecondary,
                            fontSize = 12.sp,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )

                        Spacer(modifier = Modifier.height(14.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Entry Fee: ₹ ${comp.entryFee}",
                                color = TextPrimary,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold
                            )

                            Box(
                                modifier = Modifier
                                    .clip(PillShape)
                                    .background(if (comp.isRegistered) BackgroundPrimary else AccentPrimary)
                                    .padding(horizontal = 14.dp, vertical = 6.dp)
                            ) {
                                Text(
                                    text = if (comp.isRegistered) "View Bracket →" else "Register & Pay →",
                                    color = if (comp.isRegistered) TextPrimary else TextOnAccent,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

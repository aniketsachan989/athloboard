package com.athloboard.app.ui.athlete.rewards

import androidx.compose.animation.core.animateIntAsState
import androidx.compose.animation.core.tween
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
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
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
import com.athloboard.app.ui.shared.AthloButton
import com.athloboard.app.ui.shared.AthloTopBar
import com.athloboard.app.ui.theme.AccentPrimary
import com.athloboard.app.ui.theme.BackgroundCard
import com.athloboard.app.ui.theme.BackgroundPrimary
import com.athloboard.app.ui.theme.BorderDivider
import com.athloboard.app.ui.theme.CardShape
import com.athloboard.app.ui.theme.PillShape
import com.athloboard.app.ui.theme.TextOnAccent
import com.athloboard.app.ui.theme.TextPrimary
import com.athloboard.app.ui.theme.TextSecondary

data class RewardItem(
    val id: String,
    val title: String,
    val brand: String,
    val pointsCost: Int,
    val icon: String,
    val description: String
)

/**
 * 3.15 Rewards Screen (Animated Points Counter, How to Earn, Redeem Catalog)
 */
@Composable
fun RewardsScreen(
    onBackClick: () -> Unit
) {
    var pointsTarget by remember { mutableIntStateOf(0) }
    val animatedPoints by animateIntAsState(
        targetValue = pointsTarget,
        animationSpec = tween(1200),
        label = "pointsCounter"
    )

    var isHowToEarnExpanded by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        pointsTarget = 2450
    }

    val rewards = remember {
        listOf(
            RewardItem("RWD-01", "₹ 1,000 Gym Pass Discount", "Titan Iron Club", 1200, "🎟️", "Valid on all 1-month and 3-month passes."),
            RewardItem("RWD-02", "Athloboard Official Lifting Belt", "SBD India", 3000, "🥋", "10mm IPF approved lever belt in matte black."),
            RewardItem("RWD-03", "20% Whey Isolate Coupon", "GNC India", 800, "🥤", "Exclusive coupon code for 2kg tub."),
            RewardItem("RWD-04", "Free Sanctioned Meet Entry", "IPC Federation", 2000, "🏆", "Covers registration fee for any 2026 meet.")
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
            title = "Lift Points & Rewards",
            onBackClick = onBackClick
        )

        Spacer(modifier = Modifier.height(12.dp))

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
        ) {
            // 1. Large Top Points Card (Animated Counter)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(CardShape)
                    .background(BackgroundCard)
                    .border(1.5.dp, AccentPrimary, CardShape)
                    .padding(22.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "YOUR REWARDS BALANCE",
                            color = TextSecondary,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 1.sp
                        )

                        Spacer(modifier = Modifier.height(6.dp))

                        Text(
                            text = "${String.format("%,d", animatedPoints)} PTS",
                            color = AccentPrimary,
                            fontSize = 32.sp,
                            fontWeight = FontWeight.Bold
                        )

                        Spacer(modifier = Modifier.height(4.dp))

                        Text(
                            text = "≈ ₹ ${(animatedPoints / 2)} value in equipment & passes",
                            color = TextSecondary,
                            fontSize = 12.sp
                        )
                    }

                    Box(
                        modifier = Modifier
                            .size(56.dp)
                            .clip(CircleShape)
                            .background(AccentPrimary.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = "🪙", fontSize = 28.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // 2. "How to Earn" Expandable Section
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(CardShape)
                    .background(BackgroundCard)
                    .border(1.dp, BorderDivider, CardShape)
                    .clickable { isHowToEarnExpanded = !isHowToEarnExpanded }
                    .padding(16.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "How to earn Lift Points?",
                            color = TextPrimary,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold
                        )

                        Text(
                            text = if (isHowToEarnExpanded) "▲" else "▼",
                            color = AccentPrimary,
                            fontSize = 12.sp
                        )
                    }

                    if (isHowToEarnExpanded) {
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(text = "• Verified PR Submission: +150 PTS", color = TextSecondary, fontSize = 12.sp, modifier = Modifier.padding(vertical = 2.dp))
                        Text(text = "• Sanctioned Meet Participation: +500 PTS", color = TextSecondary, fontSize = 12.sp, modifier = Modifier.padding(vertical = 2.dp))
                        Text(text = "• 7-Day Training Consistency: +100 PTS", color = TextSecondary, fontSize = 12.sp, modifier = Modifier.padding(vertical = 2.dp))
                        Text(text = "• Verified Athlete Referral: +250 PTS", color = TextSecondary, fontSize = 12.sp, modifier = Modifier.padding(vertical = 2.dp))
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // 3. Redeem Catalog Header
            Text(
                text = "Redeem Catalog",
                color = TextPrimary,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(14.dp))

            // Grid of Reward Cards
            rewards.forEach { item ->
                val canRedeem = animatedPoints >= item.pointsCost

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(CardShape)
                        .background(BackgroundCard)
                        .border(1.dp, BorderDivider, CardShape)
                        .padding(16.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .clip(RoundedCornerShape(14.dp))
                                .background(BackgroundPrimary)
                                .border(1.dp, BorderDivider, RoundedCornerShape(14.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = item.icon, fontSize = 22.sp)
                        }

                        Spacer(modifier = Modifier.width(14.dp))

                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = item.title,
                                color = TextPrimary,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )

                            Spacer(modifier = Modifier.height(2.dp))

                            Text(
                                text = item.brand,
                                color = TextSecondary,
                                fontSize = 12.sp
                            )

                            Spacer(modifier = Modifier.height(4.dp))

                            Text(
                                text = "${String.format("%,d", item.pointsCost)} PTS",
                                color = AccentPrimary,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }

                        Spacer(modifier = Modifier.width(10.dp))

                        Box(
                            modifier = Modifier
                                .clip(PillShape)
                                .background(if (canRedeem) AccentPrimary else BorderDivider)
                                .clickable(enabled = canRedeem) { }
                                .padding(horizontal = 14.dp, vertical = 8.dp)
                        ) {
                            Text(
                                text = if (canRedeem) "Redeem" else "Locked",
                                color = if (canRedeem) TextOnAccent else TextSecondary,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))
            }
        }
    }
}

package com.athloboard.app.ui.athlete.store

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.widget.Toast
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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.athloboard.app.data.AthloRepository
import com.athloboard.app.data.models.Coupon
import com.athloboard.app.ui.shared.AthloButton
import com.athloboard.app.ui.shared.AthloTopBar
import com.athloboard.app.ui.theme.AccentPrimary
import com.athloboard.app.ui.theme.BackgroundCard
import com.athloboard.app.ui.theme.BackgroundPrimary
import com.athloboard.app.ui.theme.BorderDivider
import com.athloboard.app.ui.theme.CardShape
import com.athloboard.app.ui.theme.PillShape
import com.athloboard.app.ui.theme.SuccessGreen
import com.athloboard.app.ui.theme.TextPrimary
import com.athloboard.app.ui.theme.TextSecondary

/**
 * 3.15 Coupons/Deals Wallet Screen
 * Saved coupon codes, copy-to-clipboard, min order values, store link CTA
 */
@Composable
fun CouponsWalletScreen(
    onBackClick: () -> Unit,
    onBrowseStore: () -> Unit
) {
    val context = LocalContext.current
    val coupons by AthloRepository.coupons.collectAsState()

    fun copyCouponToClipboard(code: String) {
        val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        val clip = ClipData.newPlainText("Athloboard Coupon", code)
        clipboard.setPrimaryClip(clip)
        Toast.makeText(context, "Copied $code to clipboard!", Toast.LENGTH_SHORT).show()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundPrimary)
            .padding(horizontal = 20.dp)
            .padding(top = 24.dp)
    ) {
        AthloTopBar(
            title = "Coupons Wallet",
            onBackClick = onBackClick
        )

        Spacer(modifier = Modifier.height(16.dp))

        if (coupons.isEmpty()) {
            // Empty State
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(bottom = 60.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Box(
                    modifier = Modifier
                        .size(80.dp)
                        .clip(CircleShape)
                        .background(BackgroundCard)
                        .border(1.dp, BorderDivider, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "🎟️", fontSize = 36.sp)
                }

                Spacer(modifier = Modifier.height(16.dp))

                Text(
                    text = "No coupons yet",
                    color = TextPrimary,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(6.dp))

                Text(
                    text = "Browse the store and unlock discount coupons for top supplements & gear.",
                    color = TextSecondary,
                    fontSize = 13.sp,
                    textAlign = TextAlign.Center,
                    lineHeight = 19.sp,
                    modifier = Modifier.padding(horizontal = 20.dp)
                )

                Spacer(modifier = Modifier.height(24.dp))

                AthloButton(
                    text = "Explore Athlo Store",
                    onClick = onBrowseStore
                )
            }
        } else {
            // Coupons List
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(14.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(coupons, key = { it.id }) { coupon ->
                    CouponCard(
                        coupon = coupon,
                        onCopy = { copyCouponToClipboard(coupon.code) }
                    )
                }
            }
        }
    }
}

@Composable
private fun CouponCard(
    coupon: Coupon,
    onCopy: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(CardShape)
            .background(BackgroundCard)
            .border(1.dp, BorderDivider, CardShape)
            .padding(16.dp)
    ) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = coupon.vendorName,
                    color = AccentPrimary,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )

                Box(
                    modifier = Modifier
                        .clip(PillShape)
                        .background(SuccessGreen.copy(alpha = 0.15f))
                        .padding(horizontal = 8.dp, vertical = 3.dp)
                ) {
                    Text(
                        text = "VERIFIED DEAL",
                        color = SuccessGreen,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = coupon.discountDescription,
                color = TextPrimary,
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "Min order: ₹ ${coupon.minOrderAmount} • ${coupon.expiryDate}",
                color = TextSecondary,
                fontSize = 11.sp
            )

            Spacer(modifier = Modifier.height(14.dp))

            // Dotted Separator
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(1.dp)
                    .background(BorderDivider)
            )

            Spacer(modifier = Modifier.height(14.dp))

            // Coupon Code & Copy Action
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(Color(0xFF14141C))
                        .border(1.dp, AccentPrimary.copy(alpha = 0.5f), RoundedCornerShape(8.dp))
                        .padding(horizontal = 14.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = coupon.code,
                        color = AccentPrimary,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    )
                }

                Box(
                    modifier = Modifier
                        .clip(PillShape)
                        .background(AccentPrimary)
                        .clickable(onClick = onCopy)
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = "Copy Code",
                        color = BackgroundPrimary,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

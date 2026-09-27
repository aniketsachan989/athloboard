package com.athloboard.app.ui.athlete.store

import android.content.Intent
import android.net.Uri
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
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.athloboard.app.data.AthloRepository
import com.athloboard.app.ui.shared.AthloButton
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

/**
 * 3.14 Product Detail Screen
 * Photo carousel, Brand verification, Stock status, Coupon banner, Vendor purchase CTA
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProductDetailScreen(
    productId: String,
    onBackClick: () -> Unit,
    onOpenWallet: () -> Unit
) {
    val context = LocalContext.current
    val products by AthloRepository.products.collectAsState()
    val product = products.find { it.id == productId } ?: products.firstOrNull()
    if (product == null) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("Product not found", color = Color.White)
        }
        return
    }
    var selectedPhotoIndex by remember { mutableIntStateOf(0) }
    var showCheckoutSheet by remember { mutableStateOf(false) }
    var orderPlaced by remember { mutableStateOf(false) }
    var quantity by remember { mutableIntStateOf(1) }
    var selectedPaymentMethod by remember { mutableStateOf("UPI (GPay / PhonePe / Paytm)") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundPrimary)
    ) {
        // Scrollable Body
        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
        ) {
            // Photo Header Box
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(280.dp)
                    .background(Color(0xFF252533))
            ) {
                // Large Product Visual
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = if (selectedPhotoIndex == 0) "🥛" else "🧪",
                        fontSize = 80.sp
                    )
                }

                // Dark Bottom Gradient Overlay
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.verticalGradient(
                                colors = listOf(Color.Transparent, BackgroundPrimary),
                                startY = 180f
                            )
                        )
                )

                // Top Bar overlay
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp, vertical = 24.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(42.dp)
                            .clip(CircleShape)
                            .background(BackgroundCard.copy(alpha = 0.85f))
                            .border(1.dp, BorderDivider, CircleShape)
                            .clickable(onClick = onBackClick),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back",
                            tint = TextPrimary,
                            modifier = Modifier.size(20.dp)
                        )
                    }

                    Box(
                        modifier = Modifier
                            .clip(PillShape)
                            .background(AccentPrimary.copy(alpha = 0.2f))
                            .padding(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = product.category.uppercase(),
                            color = AccentPrimary,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                // Carousel Dots at bottom
                Row(
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .padding(bottom = 12.dp),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    repeat(2) { index ->
                        Box(
                            modifier = Modifier
                                .size(if (selectedPhotoIndex == index) 16.dp else 6.dp, 6.dp)
                                .clip(PillShape)
                                .background(if (selectedPhotoIndex == index) AccentPrimary else BorderDivider)
                                .clickable { selectedPhotoIndex = index }
                        )
                    }
                }
            }

            // Product Details Content
            Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 12.dp)) {
                // Brand & Verified badge
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = product.brandName,
                        color = TextSecondary,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium
                    )
                    if (product.isVerifiedBrand) {
                        Spacer(modifier = Modifier.width(6.dp))
                        Box(
                            modifier = Modifier
                                .clip(PillShape)
                                .background(SuccessGreen.copy(alpha = 0.15f))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = "✓ Verified Brand",
                                color = SuccessGreen,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(6.dp))

                // Product Title
                Text(
                    text = product.name,
                    color = TextPrimary,
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    lineHeight = 28.sp
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Pricing Row
                Row(verticalAlignment = Alignment.Bottom) {
                    Text(
                        text = "₹ ${product.price}",
                        color = AccentPrimary,
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(
                        text = "₹ ${product.originalPrice}",
                        color = TextSecondary,
                        fontSize = 15.sp,
                        textDecoration = TextDecoration.LineThrough
                    )
                    Spacer(modifier = Modifier.weight(1f))
                    // Stock Status
                    Text(
                        text = if (product.inStock) "● In Stock" else "● Out of Stock",
                        color = if (product.inStock) SuccessGreen else ErrorRed,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                Spacer(modifier = Modifier.height(20.dp))

                // Stat Cards (Weight, Servings, Stock, Lab Verified)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    DetailStatBox(title = "Weight", value = product.weight, modifier = Modifier.weight(1f))
                    DetailStatBox(title = "Servings", value = "${product.servings}", modifier = Modifier.weight(1f))
                    DetailStatBox(title = "In Stock", value = "${product.stockNumber} units", modifier = Modifier.weight(1f))
                    DetailStatBox(title = "Lab Tested", value = "100% Pure", modifier = Modifier.weight(1f))
                }

                Spacer(modifier = Modifier.height(20.dp))

                // Active Coupon Banner (if present)
                if (product.activeCouponCode != null) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(CardShape)
                            .background(AccentPrimary.copy(alpha = 0.12f))
                            .border(1.dp, AccentPrimary.copy(alpha = 0.4f), CardShape)
                            .clickable(onClick = onOpenWallet)
                            .padding(14.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(text = "🏷️", fontSize = 20.sp)
                            Spacer(modifier = Modifier.width(12.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "Use Code: ${product.activeCouponCode}",
                                    color = AccentPrimary,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = "Tap to view coupons in your wallet",
                                    color = TextSecondary,
                                    fontSize = 11.sp
                                )
                            }
                            Text(text = "Apply >", color = AccentPrimary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    Spacer(modifier = Modifier.height(20.dp))
                }

                // Description
                Text(
                    text = "Description",
                    color = TextPrimary,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = product.description,
                    color = TextSecondary,
                    fontSize = 13.sp,
                    lineHeight = 20.sp
                )

                Spacer(modifier = Modifier.height(24.dp))

                // Report Listing Link
                Text(
                    text = "🚩 Report this listing or suspect counterfeit",
                    color = TextSecondary.copy(alpha = 0.6f),
                    fontSize = 11.sp,
                    textAlign = TextAlign.Center,
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { }
                )

                Spacer(modifier = Modifier.height(24.dp))
            }
        }

        // Bottom CTA Sticky Bar
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(BackgroundCard)
                .border(1.dp, BorderDivider)
                .padding(horizontal = 20.dp, vertical = 14.dp)
        ) {
            AthloButton(
                text = if (product.inStock) "Buy Now • ₹ ${product.price}" else "Out of Stock",
                onClick = { showCheckoutSheet = true },
                enabled = product.inStock,
                modifier = Modifier.fillMaxWidth()
            )
        }

        if (showCheckoutSheet) {
            ModalBottomSheet(
                onDismissRequest = {
                    showCheckoutSheet = false
                    orderPlaced = false
                },
                containerColor = BackgroundCard,
                dragHandle = null
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(24.dp)
                ) {
                    if (!orderPlaced) {
                        // Header
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "Amazon Pay • Instant Checkout",
                                    color = TextPrimary,
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = "100% Lab Verified & Sealed Product",
                                    color = AccentPrimary,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.SemiBold
                                )
                            }
                            Box(
                                modifier = Modifier
                                    .clip(PillShape)
                                    .background(SuccessGreen.copy(alpha = 0.15f))
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(text = "✓ Prime Delivery", color = SuccessGreen, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // Delivery Address Box
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(CardShape)
                                .background(BackgroundPrimary)
                                .border(1.dp, BorderDivider, CardShape)
                                .padding(12.dp)
                        ) {
                            Column {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(text = "📍", fontSize = 14.sp)
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "Deliver to Athlete, Powai, Mumbai - 400076",
                                        color = TextPrimary,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Medium
                                    )
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "FREE Prime Express: Delivery Tomorrow by 2:00 PM",
                                    color = SuccessGreen,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // Product Item Summary & Quantity Stepper
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.weight(1f)
                            ) {
                                Text(text = "🥛", fontSize = 28.sp)
                                Spacer(modifier = Modifier.width(10.dp))
                                Column {
                                    Text(
                                        text = product.name,
                                        color = TextPrimary,
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold,
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                    Text(
                                        text = "₹ ${product.price} each",
                                        color = AccentPrimary,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }

                            // Stepper (- Qty +)
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier
                                    .clip(PillShape)
                                    .background(BackgroundPrimary)
                                    .border(1.dp, BorderDivider, PillShape)
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    text = "−",
                                    color = if (quantity > 1) TextPrimary else TextSecondary,
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier
                                        .clickable { if (quantity > 1) quantity-- }
                                        .padding(horizontal = 6.dp)
                                )
                                Text(
                                    text = "$quantity",
                                    color = TextPrimary,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 6.dp)
                                )
                                Text(
                                    text = "+",
                                    color = TextPrimary,
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier
                                        .clickable { quantity++ }
                                        .padding(horizontal = 6.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // Payment Methods
                        Text(text = "Payment Method", color = TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(8.dp))

                        listOf("UPI (GPay / PhonePe / Paytm)", "Cash on Delivery (COD)", "Athloboard Points / Wallet").forEach { method ->
                            val isSelected = selectedPaymentMethod == method
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 3.dp)
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(if (isSelected) AccentPrimary.copy(alpha = 0.12f) else BackgroundPrimary)
                                    .border(1.dp, if (isSelected) AccentPrimary else BorderDivider, RoundedCornerShape(10.dp))
                                    .clickable { selectedPaymentMethod = method }
                                    .padding(horizontal = 12.dp, vertical = 10.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = method,
                                        color = if (isSelected) TextPrimary else TextSecondary,
                                        fontSize = 12.sp,
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                                    )
                                    if (isSelected) {
                                        Text(text = "●", color = AccentPrimary, fontSize = 12.sp)
                                    }
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(18.dp))

                        val totalAmount = product.price * quantity
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(text = "Total Order Amount:", color = TextSecondary, fontSize = 13.sp)
                            Text(text = "₹ $totalAmount", color = TextPrimary, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        AthloButton(
                            text = "Place Your Order • ₹ $totalAmount",
                            onClick = { orderPlaced = true },
                            modifier = Modifier.fillMaxWidth()
                        )
                    } else {
                        // Order Confirmation Screen
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 20.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(70.dp)
                                    .clip(CircleShape)
                                    .background(SuccessGreen.copy(alpha = 0.15f))
                                    .border(2.dp, SuccessGreen, CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(text = "✓", color = SuccessGreen, fontSize = 34.sp, fontWeight = FontWeight.Black)
                            }

                            Spacer(modifier = Modifier.height(16.dp))

                            Text(
                                text = "Order Placed Successfully!",
                                color = TextPrimary,
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Bold
                            )

                            Spacer(modifier = Modifier.height(6.dp))

                            Text(
                                text = "Order #ATHLO-${(100000..999999).random()} confirmed with brand warehouse.",
                                color = TextSecondary,
                                fontSize = 12.sp
                            )

                            Spacer(modifier = Modifier.height(4.dp))

                            Text(
                                text = "Arriving Tomorrow by 2:00 PM (FREE Express Delivery)",
                                color = SuccessGreen,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold
                            )

                            Spacer(modifier = Modifier.height(24.dp))

                            AthloButton(
                                text = "Done • Continue Shopping",
                                onClick = {
                                    showCheckoutSheet = false
                                    orderPlaced = false
                                },
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun DetailStatBox(
    title: String,
    value: String,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(CardShape)
            .background(BackgroundCard)
            .border(1.dp, BorderDivider, CardShape)
            .padding(vertical = 12.dp, horizontal = 8.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = title,
                color = TextSecondary,
                fontSize = 10.sp
            )
            Spacer(modifier = Modifier.height(3.dp))
            Text(
                text = value,
                color = TextPrimary,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

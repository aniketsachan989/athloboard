package com.athloboard.app.ui.athlete.store

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.athloboard.app.data.AthloRepository
import com.athloboard.app.data.models.Product
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
 * 3.13 Product / Supplement Store Screen (Athlete-facing)
 * 2-column grid, category chips, sort/filter bottom sheet, sponsored tags
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StoreScreen(
    onBackClick: () -> Unit,
    onProductClick: (String) -> Unit,
    onOpenWallet: () -> Unit
) {
    val products by AthloRepository.products.collectAsState()
    var selectedCategory by remember { mutableStateOf("All") }
    var sortBy by remember { mutableStateOf("Popular") }
    var showFilterSheet by remember { mutableStateOf(false) }

    val categories = listOf("All", "Protein", "Creatine", "Pre-workout", "Gear", "Vitamins")

    val filteredProducts = remember(products, selectedCategory, sortBy) {
        val list = if (selectedCategory == "All") {
            products
        } else {
            products.filter { it.category.equals(selectedCategory, ignoreCase = true) }
        }

        when (sortBy) {
            "Price: Low to High" -> list.sortedBy { it.price }
            "Price: High to Low" -> list.sortedByDescending { it.price }
            else -> list
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundPrimary)
            .padding(top = 24.dp)
    ) {
        // Top Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Athlo Store",
                    color = TextPrimary,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "100% Lab-Verified Supplements & Gear",
                    color = TextSecondary,
                    fontSize = 12.sp
                )
            }

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                // Coupons Wallet Button
                Box(
                    modifier = Modifier
                        .size(42.dp)
                        .clip(CircleShape)
                        .background(BackgroundCard)
                        .border(1.dp, BorderDivider, CircleShape)
                        .clickable(onClick = onOpenWallet),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "🎟️", fontSize = 18.sp)
                }

                // Filter / Sort Button
                Box(
                    modifier = Modifier
                        .size(42.dp)
                        .clip(CircleShape)
                        .background(BackgroundCard)
                        .border(1.dp, BorderDivider, CircleShape)
                        .clickable { showFilterSheet = true },
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "⚙️", fontSize = 18.sp)
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Category Filter Chips
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(horizontal = 20.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            categories.forEach { category ->
                val isSelected = selectedCategory == category
                Box(
                    modifier = Modifier
                        .clip(PillShape)
                        .background(if (isSelected) AccentPrimary else BackgroundCard)
                        .border(1.dp, if (isSelected) AccentPrimary else BorderDivider, PillShape)
                        .clickable { selectedCategory = category }
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = category,
                        color = if (isSelected) BackgroundPrimary else TextPrimary,
                        fontSize = 13.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // 2-Column Product Grid
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            contentPadding = PaddingValues(start = 20.dp, end = 20.dp, bottom = 96.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            items(filteredProducts, key = { it.id }) { product ->
                ProductGridCard(
                    product = product,
                    onClick = { onProductClick(product.id) }
                )
            }
        }
    }

    // Filter / Sort Bottom Sheet
    if (showFilterSheet) {
        ModalBottomSheet(
            onDismissRequest = { showFilterSheet = false },
            sheetState = rememberModalBottomSheetState(),
            containerColor = BackgroundCard
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 16.dp)
            ) {
                Text(
                    text = "Sort & Filter Store",
                    color = TextPrimary,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(16.dp))

                Text(
                    text = "Sort By",
                    color = TextSecondary,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold
                )

                Spacer(modifier = Modifier.height(8.dp))

                listOf("Popular", "Price: Low to High", "Price: High to Low").forEach { sortOption ->
                    val isSelected = sortBy == sortOption
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(if (isSelected) AccentPrimary.copy(alpha = 0.15f) else Color.Transparent)
                            .clickable {
                                sortBy = sortOption
                                showFilterSheet = false
                            }
                            .padding(horizontal = 12.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = sortOption,
                            color = if (isSelected) AccentPrimary else TextPrimary,
                            fontSize = 14.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                            modifier = Modifier.weight(1f)
                        )
                        if (isSelected) {
                            Text(text = "✓", color = AccentPrimary, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}

@Composable
private fun ProductGridCard(
    product: Product,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(CardShape)
            .background(BackgroundCard)
            .border(1.dp, BorderDivider, CardShape)
            .clickable(onClick = onClick)
    ) {
        Column {
            // Photography header with gradient
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(130.dp)
                    .background(Color(0xFF252533)),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = when (product.category) {
                        "Protein" -> "🥛"
                        "Creatine" -> "⚡"
                        "Pre-workout" -> "🔥"
                        else -> "🏋️"
                    },
                    fontSize = 44.sp
                )

                // Dark gradient overlay bottom
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.verticalGradient(
                                colors = listOf(Color.Transparent, BackgroundCard.copy(alpha = 0.85f)),
                                startY = 60f
                            )
                        )
                )

                // Sponsored / Verified Tag Top Left
                if (product.isSponsored) {
                    Box(
                        modifier = Modifier
                            .align(Alignment.TopStart)
                            .padding(8.dp)
                            .clip(PillShape)
                            .background(AccentPrimary)
                            .padding(horizontal = 8.dp, vertical = 3.dp)
                    ) {
                        Text(
                            text = "SPONSORED",
                            color = BackgroundPrimary,
                            fontSize = 8.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            // Info Content
            Column(modifier = Modifier.padding(12.dp)) {
                // Brand name with verified check
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = product.brandName,
                        color = TextSecondary,
                        fontSize = 11.sp,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        modifier = Modifier.weight(1f)
                    )
                    if (product.isVerifiedBrand) {
                        Text(text = " ✓", color = SuccessGreen, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    }
                }

                Spacer(modifier = Modifier.height(4.dp))

                // Product title
                Text(
                    text = product.name,
                    color = TextPrimary,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    lineHeight = 17.sp
                )

                Spacer(modifier = Modifier.height(6.dp))

                // Weight / Servings
                Text(
                    text = "${product.weight} • ${product.servings} serv",
                    color = TextSecondary,
                    fontSize = 11.sp
                )

                Spacer(modifier = Modifier.height(8.dp))

                // Pricing
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "₹ ${product.price}",
                        color = AccentPrimary,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "₹ ${product.originalPrice}",
                        color = TextSecondary,
                        fontSize = 11.sp,
                        textDecoration = TextDecoration.LineThrough
                    )
                }
            }
        }
    }
}

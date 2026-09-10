package com.athloboard.app.ui.store

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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.athloboard.app.data.AthloRepository
import com.athloboard.app.ui.shared.AthloButton
import com.athloboard.app.ui.shared.AthloInputField
import com.athloboard.app.ui.theme.PillShape

private val BgDark = Color(0xFF0F0F14)
private val CardDark = Color(0xFF181822)
private val CardBorder = Color(0xFF262634)
private val TextWhite = Color(0xFFFFFFFF)
private val TextMuted = Color(0xFF9090A0)
private val AccentYellow = Color(0xFFFFB703)
private val TextOnAccent = Color(0xFF0F0F14)

/**
 * 5. PRODUCT LISTING FORM (For Brand / Local Vendor)
 * Category, 2 photos, Product name, Weight, Servings, Price, Stock number.
 */
@Composable
fun AddProductScreen(
    onBackClick: () -> Unit,
    onProductSubmitted: () -> Unit
) {
    var category by remember { mutableStateOf("Protein") }
    var productName by remember { mutableStateOf("") }
    var brandName by remember { mutableStateOf("") }
    var flavor by remember { mutableStateOf("Chocolate Fudge") }
    var weight by remember { mutableStateOf("2.27 kg (5 lbs)") }
    var servings by remember { mutableStateOf("74") }
    var price by remember { mutableStateOf("6899") }
    var stockNumber by remember { mutableStateOf("50") }
    var description by remember { mutableStateOf("") }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp)
                .padding(top = 44.dp, bottom = 28.dp)
        ) {
            // Top Bar
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
                    text = "Add New Product Listing",
                    color = TextWhite,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.weight(1f))
                Spacer(modifier = Modifier.size(38.dp))
            }

            Spacer(modifier = Modifier.height(16.dp))

            Column(
                modifier = Modifier
                    .weight(1f)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text(text = "1. Select Product Category", color = TextWhite, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                val categories = listOf("Protein", "Creatine", "Pre-workout", "Belts", "Straps", "Gear")
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    categories.take(3).forEach { cat ->
                        val isSelected = category == cat
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(PillShape)
                                .background(if (isSelected) AccentYellow else CardDark)
                                .border(1.dp, if (isSelected) AccentYellow else CardBorder, PillShape)
                                .clickable { category = cat }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = cat, color = if (isSelected) TextOnAccent else TextWhite, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    categories.drop(3).forEach { cat ->
                        val isSelected = category == cat
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(PillShape)
                                .background(if (isSelected) AccentYellow else CardDark)
                                .border(1.dp, if (isSelected) AccentYellow else CardBorder, PillShape)
                                .clickable { category = cat }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = cat, color = if (isSelected) TextOnAccent else TextWhite, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(4.dp))
                Text(text = "2. Product Photos (2 Required)", color = TextWhite, fontSize = 13.sp, fontWeight = FontWeight.Bold)

                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .height(90.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(CardDark)
                            .border(1.dp, CardBorder, RoundedCornerShape(12.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(text = "📸 Photo 1 (Front)", color = AccentYellow, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            Text(text = "Label & Specs", color = TextMuted, fontSize = 9.sp)
                        }
                    }

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .height(90.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(CardDark)
                            .border(1.dp, CardBorder, RoundedCornerShape(12.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(text = "📸 Photo 2 (Nutrition)", color = AccentYellow, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            Text(text = "Ingredients & Seal", color = TextMuted, fontSize = 9.sp)
                        }
                    }
                }

                AthloInputField(label = "Product Name", value = productName, onValueChange = { productName = it }, placeholder = "e.g. 100% Gold Whey Isolate")
                AthloInputField(label = "Brand / Manufacturer Name", value = brandName, onValueChange = { brandName = it }, placeholder = "e.g. Optimum Nutrition")

                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    AthloInputField(label = "Net Weight", value = weight, onValueChange = { weight = it }, modifier = Modifier.weight(1f), placeholder = "2.27 kg")
                    AthloInputField(label = "Servings Count", value = servings, onValueChange = { servings = it }, modifier = Modifier.weight(1f), keyboardType = KeyboardType.Number)
                }

                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    AthloInputField(label = "Price (₹)", value = price, onValueChange = { price = it }, modifier = Modifier.weight(1f), keyboardType = KeyboardType.Number)
                    AthloInputField(label = "Stock Units in Hand", value = stockNumber, onValueChange = { stockNumber = it }, modifier = Modifier.weight(1f), keyboardType = KeyboardType.Number)
                }

                AthloInputField(label = "Product Description & Lab Specs", value = description, onValueChange = { description = it }, placeholder = "e.g. 25g Whey Isolate, 5.5g BCAAs, dope-free tested.")
            }

            Spacer(modifier = Modifier.height(14.dp))

            AthloButton(
                text = "Submit Product to Admin Review Queue",
                onClick = {
                    AthloRepository.addProduct(
                        name = productName.ifBlank { "Hydrolyzed Whey Matrix" },
                        brandName = brandName.ifBlank { "Athlo Nutrition" },
                        vendorId = "VND-101",
                        category = category,
                        flavor = flavor,
                        weight = weight,
                        servings = servings.toIntOrNull() ?: 60,
                        price = price.toIntOrNull() ?: 4999,
                        stockNumber = stockNumber.toIntOrNull() ?: 25,
                        photoUrl1 = "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500&q=80",
                        photoUrl2 = "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&q=80",
                        description = description.ifBlank { "Lab certified performance supplement." }
                    )
                    onProductSubmitted()
                },
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}

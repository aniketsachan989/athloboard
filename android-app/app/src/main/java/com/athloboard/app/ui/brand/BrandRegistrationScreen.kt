package com.athloboard.app.ui.brand

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

private val BgDark = Color(0xFF0F0F14)
private val CardDark = Color(0xFF181822)
private val CardBorder = Color(0xFF262634)
private val TextWhite = Color(0xFFFFFFFF)
private val TextMuted = Color(0xFF9090A0)
private val AccentYellow = Color(0xFFFFB703)

/**
 * 4. BRAND SIGNUP FORM
 * Brand name, Website URL, Connected gym / category, Email, GSTIN.
 * (ID and password provided after Admin approval).
 */
@Composable
fun BrandRegistrationScreen(
    onBackClick: () -> Unit,
    onRegistrationSubmitted: () -> Unit
) {
    var brandName by remember { mutableStateOf("") }
    var websiteUrl by remember { mutableStateOf("") }
    var connectedCategory by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var gstin by remember { mutableStateOf("") }

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
            // Header
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
                    text = "Brand Partner Registration",
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
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Text(
                    text = "🏷️ Official Manufacturer & Nutrition Brand Registration",
                    color = AccentYellow,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold
                )

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(CardDark)
                        .border(1.dp, CardBorder, RoundedCornerShape(12.dp))
                        .padding(12.dp)
                ) {
                    Text(
                        text = "🔒 Note: To ensure 100% authentic supplements and prevent counterfeits, Brand ID & Login credentials will be issued directly to your official email after Admin Verification of your GSTIN.",
                        color = TextMuted,
                        fontSize = 11.sp,
                        lineHeight = 16.sp
                    )
                }

                AthloInputField(label = "Official Brand Name", value = brandName, onValueChange = { brandName = it }, placeholder = "e.g. Optimum Nutrition India")
                AthloInputField(label = "Official Website URL", value = websiteUrl, onValueChange = { websiteUrl = it }, placeholder = "https://www.optimumnutrition.co.in", keyboardType = KeyboardType.Uri)
                AthloInputField(label = "Product Category / Connected Gym Partner", value = connectedCategory, onValueChange = { connectedCategory = it }, placeholder = "e.g. Whey Protein / Powerlifting Belts")
                AthloInputField(label = "Corporate / Partner Email", value = email, onValueChange = { email = it }, placeholder = "partner@optimumnutrition.in", keyboardType = KeyboardType.Email)
                AthloInputField(label = "Brand GSTIN Number", value = gstin, onValueChange = { gstin = it }, placeholder = "07AAACR1234F1Z8")
            }

            Spacer(modifier = Modifier.height(14.dp))

            AthloButton(
                text = "Submit Brand for Admin Approval",
                onClick = {
                    AthloRepository.registerBrand(
                        name = brandName.ifBlank { "Optimum Nutrition" },
                        websiteUrl = websiteUrl.ifBlank { "https://optimumnutrition.in" },
                        categoryOrGym = connectedCategory.ifBlank { "Supplements & Nutrition" },
                        email = email.ifBlank { "brand@athloboard.com" },
                        gstin = gstin.ifBlank { "07AAACR1234F1Z8" }
                    )
                    AthloRepository.setCurrentRole("BRAND")
                    onRegistrationSubmitted()
                },
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}

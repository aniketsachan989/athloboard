package com.athloboard.app.ui.vendor

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
 * 3. LOCAL VENDOR (DUKAAN WAALA) SIGNUP FORM
 * Shop name, Owner name, Website (optional), Owner contact number, Email, GSTIN, Shop location, Landmark, ID & Password.
 */
@Composable
fun VendorRegistrationScreen(
    onBackClick: () -> Unit,
    onRegistrationSubmitted: () -> Unit
) {
    val vendorId = remember { "VND-${(100..999).random()}" }
    var password by remember { mutableStateOf("") }
    var shopName by remember { mutableStateOf("") }
    var ownerName by remember { mutableStateOf("") }
    var websiteUrl by remember { mutableStateOf("") }
    var ownerPhone by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var gstin by remember { mutableStateOf("") }
    var location by remember { mutableStateOf("") }
    var landmark by remember { mutableStateOf("") }

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
                    text = "Local Vendor Registration",
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
                Text(
                    text = "🏪 Partner as a Verified Local Supplement & Gear Shop",
                    color = AccentYellow,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "Your shop profile and listed products will be submitted to the Admin Panel for verification before appearing live on the Athloboard store.",
                    color = TextMuted,
                    fontSize = 11.sp
                )

                AthloInputField(label = "Assigned Vendor ID", value = vendorId, onValueChange = {}, readOnly = true)
                AthloInputField(label = "Create Account Password", value = password, onValueChange = { password = it }, placeholder = "••••••••", isPassword = true)
                AthloInputField(label = "Shop / Store Name", value = shopName, onValueChange = { shopName = it }, placeholder = "e.g. Muscle Armour Nutrition")
                AthloInputField(label = "Owner Full Name", value = ownerName, onValueChange = { ownerName = it }, placeholder = "e.g. Amit Singhal")
                AthloInputField(label = "Website URL (Optional)", value = websiteUrl, onValueChange = { websiteUrl = it }, placeholder = "https://musclearmour.in", keyboardType = KeyboardType.Uri)
                AthloInputField(label = "Owner Contact Number", value = ownerPhone, onValueChange = { ownerPhone = it }, placeholder = "+91 98100 11223", keyboardType = KeyboardType.Phone)
                AthloInputField(label = "Official Email", value = email, onValueChange = { email = it }, placeholder = "contact@musclearmour.in", keyboardType = KeyboardType.Email)
                AthloInputField(label = "GSTIN Number", value = gstin, onValueChange = { gstin = it }, placeholder = "07AAAAA0000A1Z5")
                AthloInputField(label = "Shop Address / Location", value = location, onValueChange = { location = it }, placeholder = "Shop 14, Main Market, Lajpat Nagar")
                AthloInputField(label = "Nearby Landmark", value = landmark, onValueChange = { landmark = it }, placeholder = "Near Central Market Fountain")
            }

            Spacer(modifier = Modifier.height(14.dp))

            AthloButton(
                text = "Submit Vendor Application for Admin Review",
                onClick = {
                    AthloRepository.registerVendor(
                        shopName = shopName.ifBlank { "Muscle Armour Nutrition" },
                        ownerName = ownerName.ifBlank { "Amit Singhal" },
                        websiteUrl = websiteUrl,
                        ownerContactNumber = ownerPhone.ifBlank { "+91 98100 11223" },
                        email = email.ifBlank { "vendor@athloboard.com" },
                        gstin = gstin.ifBlank { "07AAAAA0000A1Z5" },
                        location = location.ifBlank { "Lajpat Nagar, New Delhi" },
                        landmark = landmark.ifBlank { "Near Central Fountain" }
                    )
                    AthloRepository.setCurrentRole("VENDOR")
                    onRegistrationSubmitted()
                },
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}

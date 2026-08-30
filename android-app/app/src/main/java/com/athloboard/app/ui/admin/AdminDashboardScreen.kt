package com.athloboard.app.ui.admin

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
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.athloboard.app.data.AthloRepository
import com.athloboard.app.ui.theme.PillShape

private val BgDark = Color(0xFF0F0F14)
private val CardDark = Color(0xFF181822)
private val CardBorder = Color(0xFF262634)
private val TextWhite = Color(0xFFFFFFFF)
private val TextMuted = Color(0xFF9090A0)
private val AccentYellow = Color(0xFFFFB703)
private val AccentGreen = Color(0xFF2EC4B6)
private val AccentRed = Color(0xFFE63946)
private val TextOnAccent = Color(0xFF0F0F14)

/**
 * 2. ADMIN VERIFICATION PANEL & AUDIT CONSOLE
 * - Video Verification (Lift audit queue)
 * - Gym Listing Approval / Rejection
 * - Brand & Vendor KYC Approvals
 * - Product Listing Approvals
 * - Revenue & Analytics
 */
@Composable
fun AdminDashboardScreen(
    onBackClick: () -> Unit
) {
    var selectedTab by remember { mutableIntStateOf(0) }
    val tabs = listOf("🏋️ Lifts Queue", "🏢 Gyms Audit", "💊 Products", "🏷️ Brands/KYC", "📊 Revenue")

    val lifts by AthloRepository.liftSubmissions.collectAsState()
    val gyms by AthloRepository.gyms.collectAsState()
    val products by AthloRepository.products.collectAsState()
    val brands by AthloRepository.brands.collectAsState()
    val vendors by AthloRepository.vendors.collectAsState()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp)
                .padding(top = 44.dp, bottom = 24.dp)
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

                Spacer(modifier = Modifier.width(12.dp))

                Column {
                    Text(text = "Admin Verification Console", color = TextWhite, fontSize = 17.sp, fontWeight = FontWeight.Bold)
                    Text(text = "Anti-spam & Public Gatekeeper", color = AccentYellow, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Tabs Selector
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                tabs.take(3).forEachIndexed { index, title ->
                    val isSelected = selectedTab == index
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(PillShape)
                            .background(if (isSelected) AccentYellow else CardDark)
                            .border(1.dp, if (isSelected) AccentYellow else CardBorder, PillShape)
                            .clickable { selectedTab = index }
                            .padding(vertical = 8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = title, color = if (isSelected) TextOnAccent else TextWhite, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
            Spacer(modifier = Modifier.height(6.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                tabs.drop(3).forEachIndexed { index, title ->
                    val realIndex = index + 3
                    val isSelected = selectedTab == realIndex
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(PillShape)
                            .background(if (isSelected) AccentYellow else CardDark)
                            .border(1.dp, if (isSelected) AccentYellow else CardBorder, PillShape)
                            .clickable { selectedTab = realIndex }
                            .padding(vertical = 8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = title, color = if (isSelected) TextOnAccent else TextWhite, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Tab Content
            Box(modifier = Modifier.weight(1f)) {
                when (selectedTab) {
                    0 -> LiftVerificationQueue(lifts = lifts)
                    1 -> GymApprovalQueue(gyms = gyms)
                    2 -> ProductApprovalQueue(products = products)
                    3 -> BrandAndVendorKycQueue(brands = brands, vendors = vendors)
                    4 -> RevenueAndStatsView()
                }
            }
        }
    }
}

@Composable
private fun LiftVerificationQueue(lifts: List<com.athloboard.app.data.models.LiftSubmission>) {
    LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        items(lifts) { sub ->
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(CardDark)
                    .border(1.dp, CardBorder, RoundedCornerShape(16.dp))
                    .padding(14.dp)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(text = "${sub.liftType} — ${sub.claimedWeight} kg", color = TextWhite, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                            Text(text = "Athlete: ${sub.athleteName} (${sub.athleteId})", color = TextMuted, fontSize = 11.sp)
                        }

                        Box(
                            modifier = Modifier
                                .clip(PillShape)
                                .background(if (sub.status == "VERIFIED") AccentGreen.copy(alpha = 0.2f) else AccentYellow.copy(alpha = 0.2f))
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = sub.status,
                                color = if (sub.status == "VERIFIED") AccentGreen else AccentYellow,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Text(text = "Referee Verdict: ${sub.refereeScore}", color = AccentYellow, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                    Text(text = sub.feedback ?: "Awaiting referee inspection", color = TextMuted, fontSize = 11.sp)

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(PillShape)
                                .background(AccentGreen)
                                .clickable {
                                    AthloRepository.verifyLiftSubmission(sub.id, true, "3/3 White Lights", "Approved by IPF Certified AI Referee.")
                                }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = "✓ Approve (3 White Lights)", color = TextOnAccent, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }

                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(PillShape)
                                .background(AccentRed)
                                .clickable {
                                    AthloRepository.verifyLiftSubmission(sub.id, false, "Red Light", "Depth not reached below parallel.")
                                }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = "✕ Reject (Red Light)", color = TextWhite, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun GymApprovalQueue(gyms: List<com.athloboard.app.data.models.Gym>) {
    LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        items(gyms) { gym ->
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(CardDark)
                    .border(1.dp, CardBorder, RoundedCornerShape(16.dp))
                    .padding(14.dp)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = gym.gymName, color = TextWhite, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                        Box(
                            modifier = Modifier
                                .clip(PillShape)
                                .background(if (gym.isApprovedByAdmin) AccentGreen.copy(alpha = 0.2f) else AccentYellow.copy(alpha = 0.2f))
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = if (gym.isApprovedByAdmin) "LIVE ON APP" else "PENDING APPROVAL",
                                color = if (gym.isApprovedByAdmin) AccentGreen else AccentYellow,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Text(text = "Owner: ${gym.ownerName} | ${gym.gymContact}", color = TextMuted, fontSize = 11.sp)
                    Text(text = "Location: ${gym.location}", color = TextMuted, fontSize = 11.sp)
                    Text(text = "Equipment: ${gym.plateWeightKg}kg Plates | ${gym.dumbbellWeightKg}kg Dumbbells | ${gym.trainerMaleCount}M/${gym.trainerFemaleCount}F Trainers", color = AccentYellow, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                    Text(text = "Charges: ₹${gym.chargesMonthly}/mo | ₹${gym.chargesQuarterly}/qtr | ₹${gym.chargesYearly}/yr", color = TextWhite, fontSize = 11.sp)

                    Spacer(modifier = Modifier.height(4.dp))

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(PillShape)
                                .background(if (gym.isApprovedByAdmin) CardBorder else AccentGreen)
                                .clickable { AthloRepository.setGymApproval(gym.id, !gym.isApprovedByAdmin) }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = if (gym.isApprovedByAdmin) "Revoke Approval" else "✓ Approve Gym Listing",
                                color = if (gym.isApprovedByAdmin) TextWhite else TextOnAccent,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ProductApprovalQueue(products: List<com.athloboard.app.data.models.Product>) {
    LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        items(products) { prod ->
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(CardDark)
                    .border(1.dp, CardBorder, RoundedCornerShape(16.dp))
                    .padding(14.dp)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(text = prod.name, color = TextWhite, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                            Text(text = "Category: ${prod.category} | ${prod.brandName}", color = TextMuted, fontSize = 11.sp)
                        }
                        Box(
                            modifier = Modifier
                                .clip(PillShape)
                                .background(if (prod.isApprovedByAdmin) AccentGreen.copy(alpha = 0.2f) else AccentYellow.copy(alpha = 0.2f))
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = if (prod.isApprovedByAdmin) "LIVE ON STORE" else "PENDING REVIEW",
                                color = if (prod.isApprovedByAdmin) AccentGreen else AccentYellow,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Text(text = "Specs: ${prod.weight} | ${prod.servings} Servings | ₹${prod.price} | Stock: ${prod.stockNumber} units", color = AccentYellow, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(PillShape)
                                .background(if (prod.isApprovedByAdmin) CardBorder else AccentGreen)
                                .clickable { AthloRepository.setProductApproval(prod.id, !prod.isApprovedByAdmin) }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = if (prod.isApprovedByAdmin) "Delist from Public" else "✓ Approve Product Listing",
                                color = if (prod.isApprovedByAdmin) TextWhite else TextOnAccent,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun BrandAndVendorKycQueue(
    brands: List<com.athloboard.app.data.models.Brand>,
    vendors: List<com.athloboard.app.data.models.Vendor>
) {
    LazyColumn(verticalArrangement = Arrangement.spacedBy(14.dp)) {
        item {
            Text(text = "🏷️ Brands Pending KYC Verification", color = AccentYellow, fontSize = 13.sp, fontWeight = FontWeight.Bold)
        }
        items(brands) { brand ->
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(CardDark)
                    .border(1.dp, CardBorder, RoundedCornerShape(14.dp))
                    .padding(12.dp)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(text = brand.name, color = TextWhite, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        Text(text = if (brand.isApprovedByAdmin) "VERIFIED" else "PENDING", color = if (brand.isApprovedByAdmin) AccentGreen else AccentYellow, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    }
                    Text(text = "GSTIN: ${brand.gstin} | ${brand.email}", color = TextMuted, fontSize = 11.sp)
                    Text(text = "Website: ${brand.websiteUrl}", color = TextMuted, fontSize = 10.sp)

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(PillShape)
                            .background(if (brand.isApprovedByAdmin) CardBorder else AccentGreen)
                            .clickable { AthloRepository.setBrandApproval(brand.id, !brand.isApprovedByAdmin) }
                            .padding(vertical = 6.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = if (brand.isApprovedByAdmin) "Revoke KYC" else "✓ Verify GSTIN & Issue Credentials", color = if (brand.isApprovedByAdmin) TextWhite else TextOnAccent, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(8.dp))
            Text(text = "🏪 Local Vendors Verification", color = AccentYellow, fontSize = 13.sp, fontWeight = FontWeight.Bold)
        }
        items(vendors) { vendor ->
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(CardDark)
                    .border(1.dp, CardBorder, RoundedCornerShape(14.dp))
                    .padding(12.dp)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(text = vendor.shopName, color = TextWhite, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        Text(text = if (vendor.isApprovedByAdmin) "VERIFIED" else "PENDING", color = if (vendor.isApprovedByAdmin) AccentGreen else AccentYellow, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    }
                    Text(text = "Owner: ${vendor.ownerName} | ${vendor.ownerContactNumber}", color = TextMuted, fontSize = 11.sp)
                    Text(text = "GSTIN: ${vendor.gstin} | ${vendor.location}", color = TextMuted, fontSize = 10.sp)

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(PillShape)
                            .background(if (vendor.isApprovedByAdmin) CardBorder else AccentGreen)
                            .clickable { AthloRepository.setVendorApproval(vendor.id, !vendor.isApprovedByAdmin) }
                            .padding(vertical = 6.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = if (vendor.isApprovedByAdmin) "Revoke Vendor KYC" else "✓ Verify & Approve Shop Listing", color = if (vendor.isApprovedByAdmin) TextWhite else TextOnAccent, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
private fun RevenueAndStatsView() {
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(CardDark)
                .border(1.dp, CardBorder, RoundedCornerShape(16.dp))
                .padding(16.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text(text = "Platform Monthly Revenue (GMV)", color = TextMuted, fontSize = 12.sp)
                Text(text = "₹ 18,45,200", color = TextWhite, fontSize = 26.sp, fontWeight = FontWeight.Bold)
                Text(text = "▲ +24.8% from verified gym memberships & store orders", color = AccentGreen, fontSize = 11.sp)
            }
        }

        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(14.dp))
                    .background(CardDark)
                    .border(1.dp, CardBorder, RoundedCornerShape(14.dp))
                    .padding(14.dp)
            ) {
                Column {
                    Text(text = "Verified Gyms", color = TextMuted, fontSize = 11.sp)
                    Text(text = "128 Live", color = TextWhite, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                }
            }

            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(14.dp))
                    .background(CardDark)
                    .border(1.dp, CardBorder, RoundedCornerShape(14.dp))
                    .padding(14.dp)
            ) {
                Column {
                    Text(text = "Audited Lifts", color = TextMuted, fontSize = 11.sp)
                    Text(text = "1,420 Lifts", color = TextWhite, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

package com.athloboard.app.data

import com.athloboard.app.data.models.Athlete
import com.athloboard.app.data.models.Brand
import com.athloboard.app.data.models.Competition
import com.athloboard.app.data.models.Coupon
import com.athloboard.app.data.models.Gym
import com.athloboard.app.data.models.GymMember
import com.athloboard.app.data.models.LiftSubmission
import com.athloboard.app.data.models.Product
import com.athloboard.app.data.models.Promotion
import com.athloboard.app.data.models.Vendor
import com.athloboard.app.data.supabase.SupabaseClient
import com.google.firebase.auth.FirebaseAuth
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

object AthloRepository {

    private val repositoryScope = CoroutineScope(Dispatchers.IO)

    // Current Session Active Role ("ATHLETE", "GYM_OWNER", "VENDOR", "BRAND", "ADMIN")
    private val _currentRole = MutableStateFlow("ATHLETE")
    val currentRole: StateFlow<String> = _currentRole

    fun setCurrentRole(role: String) {
        _currentRole.value = role
    }

    // 1. Current Athlete Session
    private val _currentAthlete = MutableStateFlow(
        FirebaseAuth.getInstance().currentUser?.let { user ->
            Athlete(
                id = user.uid,
                name = user.displayName ?: user.email?.substringBefore("@") ?: "Athlete",
                email = user.email ?: "",
                phone = user.phoneNumber ?: "",
                dob = "",
                gender = "",
                hasGymExperience = false,
                gymExperienceDetails = "",
                preferredGym = "",
                area = "",
                weightClass = "",
                rank = 1,
                badge = "NEW ATHLETE",
                gymName = "",
                prSquat = 0,
                prBench = 0,
                prDeadlift = 0,
                total = 0,
                streakDays = 0,
                liftPoints = 0,
                kycStatus = "PENDING_ONBOARDING",
                avatarUrl = user.photoUrl?.toString() ?: ""
            )
        } ?: Athlete()
    )
    val currentAthlete: StateFlow<Athlete> = _currentAthlete

    fun isProfileComplete(): Boolean {
        val athlete = _currentAthlete.value
        return athlete.isProfileCompleted && athlete.weightClass.isNotBlank() && athlete.gender.isNotBlank()
    }

    val indianCities = listOf(
        "New Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad",
        "Jaipur", "Lucknow", "Chandigarh", "Surat", "Indore", "Noida", "Gurugram", "Faridabad",
        "Ghaziabad", "Dehradun", "Kochi", "Coimbatore", "Patna", "Bhopal", "Ludhiana", "Agra",
        "Varanasi", "Nagpur", "Kanpur", "Visakhapatnam", "Meerut", "Rajkot", "Amritsar", "Prayagraj",
        "Ranchi", "Guwahati", "Gwalior", "Jabalpur", "Vijayawada", "Jodhpur", "Raipur", "Kota"
    )

    fun searchIndianCities(query: String): List<String> {
        if (query.isBlank()) return indianCities.take(6)
        val q = query.trim().lowercase()
        return indianCities.filter { it.lowercase().contains(q) }
    }

    private val existingUsernames = setOf("admin", "athloboard", "karan_sharma", "rohan_verma", "aditya_mehta", "aanya_sen", "kabir_lifts")

    fun checkUsernameAvailability(handle: String): Boolean {
        val clean = handle.trim().lowercase().removePrefix("@")
        if (clean.length < 3) return false
        if (!clean.matches(Regex("^[a-zA-Z0-9_.]+$"))) return false
        return !existingUsernames.contains(clean)
    }

    // 2. Leaderboard Lifters (Approved only)
    private val _leaderboard = MutableStateFlow(
        listOf(
            Athlete(id = "L1", name = "Aanya Sharma", weightClass = "-63kg", rank = 1, gymName = "Iron Pulse Club", prSquat = 160, prBench = 95, prDeadlift = 190, total = 445),
            Athlete(id = "L2", name = "Rohan Verma", weightClass = "-83kg", rank = 2, gymName = "Olympus Strength", prSquat = 240, prBench = 175, prDeadlift = 275, total = 690),
            Athlete(id = "L3", name = "Vikram Malhotra", weightClass = "-93kg", rank = 3, gymName = "Titan Barbell", prSquat = 250, prBench = 180, prDeadlift = 285, total = 715),
            Athlete(id = "L4", name = "Dianne Russell", weightClass = "-74kg", rank = 4, gymName = "Alpha Gym", prSquat = 210, prBench = 150, prDeadlift = 240, total = 600),
            Athlete(id = "L5", name = "Mitchell Marsh", weightClass = "-105kg", rank = 5, gymName = "Grit Athletic", prSquat = 270, prBench = 190, prDeadlift = 300, total = 760)
        )
    )
    val leaderboard: StateFlow<List<Athlete>> = _leaderboard

    // 3. Gyms Directory (Both Approved for public and Pending for Admin)
    private val _gyms = MutableStateFlow(
        listOf(
            Gym(
                id = "GYM-101",
                gymName = "Iron Pulse Strength Club",
                ownerName = "Rajesh Sharma",
                gymContact = "+91 98112 33445",
                ownerContact = "+91 98112 33446",
                gymEmail = "ironpulse@athloboard.com",
                gymType = "Unisex",
                location = "Plot 42, Sector 18, Noida, Uttar Pradesh",
                landmark = "Opposite Metro Gate 2",
                plateWeightKg = 1850,
                dumbbellWeightKg = 1200,
                trainerMaleCount = 5,
                trainerFemaleCount = 3,
                openTime = "05:30 AM",
                closeTime = "11:00 PM",
                daysOpenPerWeek = 7,
                chargesMonthly = 2499,
                chargesQuarterly = 6499,
                chargesYearly = 19999,
                rating = 4.9,
                reviewsCount = 142,
                isAudited = true,
                isApprovedByAdmin = true
            ),
            Gym(
                id = "GYM-102",
                gymName = "Olympus Barbell Club",
                ownerName = "Vikram Rathore",
                gymContact = "+91 98223 44556",
                ownerContact = "+91 98223 44557",
                gymEmail = "olympus@athloboard.com",
                gymType = "Unisex",
                location = "Linking Road, Bandra West, Mumbai",
                landmark = "Near Bandra Police Station",
                plateWeightKg = 2400,
                dumbbellWeightKg = 1600,
                trainerMaleCount = 6,
                trainerFemaleCount = 4,
                openTime = "06:00 AM",
                closeTime = "10:30 PM",
                daysOpenPerWeek = 7,
                chargesMonthly = 3499,
                chargesQuarterly = 8999,
                chargesYearly = 26999,
                rating = 4.8,
                reviewsCount = 98,
                isAudited = true,
                isApprovedByAdmin = true
            ),
            Gym(
                id = "GYM-103",
                gymName = "Grit Athletic Performance (Pending Review)",
                ownerName = "Deepak Hooda",
                gymContact = "+91 98334 55667",
                ownerContact = "+91 98334 55668",
                gymEmail = "grit@performance.in",
                gymType = "Unisex",
                location = "Indiranagar 100ft Road, Bangalore",
                landmark = "Above Starbucks",
                plateWeightKg = 1500,
                dumbbellWeightKg = 900,
                trainerMaleCount = 4,
                trainerFemaleCount = 2,
                openTime = "06:00 AM",
                closeTime = "10:00 PM",
                daysOpenPerWeek = 6,
                chargesMonthly = 2999,
                chargesQuarterly = 7999,
                chargesYearly = 23999,
                rating = 0.0,
                reviewsCount = 0,
                isAudited = false,
                isApprovedByAdmin = false
            )
        )
    )
    val gyms: StateFlow<List<Gym>> = _gyms

    val currentGym = MutableStateFlow(
        _gyms.value.first()
    )

    // 4. Local Vendors
    private val _vendors = MutableStateFlow(
        listOf(
            Vendor(
                id = "VND-101",
                shopName = "Muscle Armour Nutrition",
                ownerName = "Amit Singhal",
                websiteUrl = "https://musclearmour.in",
                ownerContactNumber = "+91 98100 11223",
                email = "contact@musclearmour.in",
                gstin = "07AAAAA0000A1Z5",
                location = "Shop 14, Main Market, Lajpat Nagar, New Delhi",
                landmark = "Near Central Market Fountain",
                isApprovedByAdmin = true
            ),
            Vendor(
                id = "VND-102",
                shopName = "Powerhouse Supplements (Pending Approval)",
                ownerName = "Sanjay Patel",
                websiteUrl = "",
                ownerContactNumber = "+91 98200 22334",
                email = "powerhouse@gmail.com",
                gstin = "27BBBBB1111B2Z6",
                location = "Shop 5, Borivali West, Mumbai",
                landmark = "Near Station Road",
                isApprovedByAdmin = false
            )
        )
    )
    val vendors: StateFlow<List<Vendor>> = _vendors

    // 5. Brands
    private val _brands = MutableStateFlow(
        listOf(
            Brand(
                id = "BRD-101",
                name = "Optimum Nutrition India",
                websiteUrl = "https://www.optimumnutrition.co.in",
                categoryOrGym = "Supplements & Performance Nutrition",
                email = "partner@optimumnutrition.in",
                gstin = "07AAACR1234F1Z8",
                isApprovedByAdmin = true
            ),
            Brand(
                id = "BRD-102",
                name = "SBD Apparel Official",
                websiteUrl = "https://sbdapparel.com",
                categoryOrGym = "Powerlifting Equipment & Belts",
                email = "support@sbdindia.com",
                gstin = "07SBDAP9988D1Z2",
                isApprovedByAdmin = true
            ),
            Brand(
                id = "BRD-103",
                name = "Apex Biotics (Pending Review)",
                websiteUrl = "https://apexbiotics.in",
                categoryOrGym = "Creatine & Pre-workout",
                email = "contact@apexbiotics.in",
                gstin = "29APEXB4433E1Z1",
                isApprovedByAdmin = false
            )
        )
    )
    val brands: StateFlow<List<Brand>> = _brands

    // 6. Products Catalog (Only admin-approved shown to public, all shown in admin panel)
    private val _products = MutableStateFlow(
        listOf(
            Product(
                id = "PRD-1",
                name = "Gold Standard 100% Whey Isolate",
                brandName = "Optimum Nutrition",
                vendorId = "BRD-101",
                category = "Protein",
                flavor = "Double Rich Chocolate",
                weight = "2.27 kg (5 lbs)",
                servings = 74,
                price = 6899,
                originalPrice = 8299,
                stockNumber = 35,
                inStock = true,
                isSponsored = true,
                isVerifiedBrand = true,
                isApprovedByAdmin = true,
                photoUrl1 = "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500&q=80",
                photoUrl2 = "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&q=80",
                description = "Ultra-pure whey protein isolate for rapid muscle recovery. 25g protein, 5.5g BCAAs, lab tested for banned substances.",
                activeCouponCode = "ATHLO10"
            ),
            Product(
                id = "PRD-2",
                name = "Creapure 100% Micronized Creatine",
                brandName = "MuscleTech",
                vendorId = "VND-101",
                category = "Creatine",
                flavor = "Unflavored",
                weight = "300 g",
                servings = 60,
                price = 1299,
                originalPrice = 1699,
                stockNumber = 50,
                inStock = true,
                isSponsored = false,
                isVerifiedBrand = true,
                isApprovedByAdmin = true,
                photoUrl1 = "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&q=80",
                photoUrl2 = "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500&q=80",
                description = "99.9% pure Creapure creatine monohydrate to fuel ATP energy production, explosive power, and lean muscle volume.",
                activeCouponCode = "CREA15"
            ),
            Product(
                id = "PRD-3",
                name = "13mm Lever Powerlifting Belt (IPF Approved)",
                brandName = "SBD Apparel",
                vendorId = "BRD-102",
                category = "Belts",
                flavor = "Standard Black",
                weight = "1.8 kg",
                servings = 1,
                price = 18499,
                originalPrice = 21999,
                stockNumber = 12,
                inStock = true,
                isSponsored = true,
                isVerifiedBrand = true,
                isApprovedByAdmin = true,
                photoUrl1 = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&q=80",
                photoUrl2 = "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&q=80",
                description = "English oiled leather powerlifting belt with patent-pending gliding lever buckle. Hand-crafted in Great Britain.",
                activeCouponCode = "SBD1000"
            ),
            Product(
                id = "PRD-4",
                name = "Heavy Duty Figure-8 Deadlift Straps",
                brandName = "Cerberus Strength",
                vendorId = "VND-101",
                category = "Straps",
                flavor = "Dual Stitch",
                weight = "250 g",
                servings = 1,
                price = 1899,
                originalPrice = 2499,
                stockNumber = 28,
                inStock = true,
                isSponsored = false,
                isVerifiedBrand = true,
                isApprovedByAdmin = true,
                photoUrl1 = "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&q=80",
                photoUrl2 = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80",
                description = "Extra-thick cotton canvas figure-8 lifting straps rated for over 400kg. Ultimate grip security for heavy pulls.",
                activeCouponCode = "GRIP200"
            ),
            Product(
                id = "PRD-5",
                name = "HydroBCAA Performance Matrix (Pending Review)",
                brandName = "Apex Biotics",
                vendorId = "BRD-103",
                category = "Pre-workout",
                flavor = "Blue Raspberry",
                weight = "450 g",
                servings = 30,
                price = 2199,
                originalPrice = 2799,
                stockNumber = 20,
                inStock = true,
                isSponsored = false,
                isVerifiedBrand = false,
                isApprovedByAdmin = false,
                photoUrl1 = "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500&q=80",
                photoUrl2 = "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&q=80",
                description = "7g fermented BCAAs + Electrolyte blend for intraworkout hydration and anti-catabolic endurance."
            )
        )
    )
    val products: StateFlow<List<Product>> = _products

    // 7. Gym Members
    private val _gymMembers = MutableStateFlow(
        listOf(
            GymMember(id = "MBR-1", gymId = "GYM-101", athleteId = "ATH-1", athleteName = "Aanya Sharma", phone = "+91 98123 45678", email = "aanya@gmail.com", joinDate = "12 Jan 2026", planType = "Yearly (₹19,999)", status = "ACTIVE", lastCheckIn = "Today, 06:30 AM", sbdTotalKg = 445),
            GymMember(id = "MBR-2", gymId = "GYM-101", athleteId = "ATH-2", athleteName = "Rohan Verma", phone = "+91 98234 56789", email = "rohan@gmail.com", joinDate = "05 Feb 2026", planType = "Quarterly (₹6,499)", status = "ACTIVE", lastCheckIn = "Today, 07:15 AM", sbdTotalKg = 690),
            GymMember(id = "MBR-3", gymId = "GYM-101", athleteId = "ATH-3", athleteName = "Karan Gill", phone = "+91 98345 67890", email = "karan@gmail.com", joinDate = "20 Feb 2026", planType = "Monthly (₹2,499)", status = "ACTIVE", lastCheckIn = "Yesterday, 06:45 PM", sbdTotalKg = 510)
        )
    )
    val gymMembers: StateFlow<List<GymMember>> = _gymMembers

    // 8. Promotions
    private val _promotions = MutableStateFlow(
        listOf(
            Promotion(id = "PRM-1", gymId = "GYM-101", title = "Monsoon Strength Pass", description = "Flat 25% off on Annual Membership + Free 1kg Whey Protein", discountPercent = 25, validUntil = "15 Sep 2026"),
            Promotion(id = "PRM-2", gymId = "GYM-101", title = "Student Powerlifting Discount", description = "Valid College ID gets 20% off on all quarterly passes", discountPercent = 20, validUntil = "30 Sep 2026")
        )
    )
    val promotions: StateFlow<List<Promotion>> = _promotions

    // 9. Competitions & Meets
    private val _competitions = MutableStateFlow(
        listOf(
            Competition(
                id = "COMP-001",
                title = "National Raw Powerlifting Cup 2026",
                category = "Powerlifting (SBD)",
                date = "Oct 18, 2026",
                time = "08:00 AM IST",
                venue = "Thyagaraj Indoor Sports Complex",
                city = "New Delhi",
                prizePool = "₹ 5,00,000",
                entryFee = 1500,
                rules = "Raw without wraps, IPF Technical Rulebook",
                registeredCount = 48,
                isRegistered = true,
                isApprovedByAdmin = true
            ),
            Competition(
                id = "COMP-002",
                title = "West Zone Bench Press Showdown",
                category = "Bench Press Only",
                date = "Nov 12, 2026",
                time = "10:00 AM IST",
                venue = "Andheri Sports Complex",
                city = "Mumbai",
                prizePool = "₹ 2,50,000",
                entryFee = 1000,
                rules = "IPF Bench Press Standard, Paused on chest",
                registeredCount = 32,
                isRegistered = false,
                isApprovedByAdmin = true
            )
        )
    )
    val competitions: StateFlow<List<Competition>> = _competitions

    // 10. Coupons
    private val _coupons = MutableStateFlow(
        listOf(
            Coupon(id = "C-1", vendorName = "Optimum Nutrition Official", discountDescription = "10% OFF on all ON Protein Powders", code = "ATHLO10", expiryDate = "30 Sep 2026", minOrderAmount = 3000),
            Coupon(id = "C-2", vendorName = "MuscleTech India", discountDescription = "Flat ₹300 OFF on Creatine & Pre-workouts", code = "CREA300", expiryDate = "15 Oct 2026", minOrderAmount = 1500),
            Coupon(id = "C-3", vendorName = "SBD Apparel Official", discountDescription = "₹1,000 OFF on 13mm IPF Approved Belts", code = "SBD1000", expiryDate = "31 Dec 2026", minOrderAmount = 15000)
        )
    )
    val coupons: StateFlow<List<Coupon>> = _coupons

    // 11. Lift Submissions (Video Referee Queue)
    private val _liftSubmissions = MutableStateFlow(
        listOf(
            LiftSubmission(
                id = "SUB-001",
                athleteId = "ATH-9081",
                athleteName = "Athlete",
                liftType = "Squat",
                claimedWeight = 225,
                reps = 1,
                submissionDate = "28 Aug 2026",
                status = "VERIFIED",
                videoUrl = "https://athloboard-videos.s3.amazonaws.com/raw_audit.mp4",
                refereeScore = "3/3 White Lights",
                feedback = "Hip crease depth verified below top of knee. Strong lockout."
            ),
            LiftSubmission(
                id = "SUB-002",
                athleteId = "ATH-104",
                athleteName = "Devendra Pal",
                liftType = "Bench Press",
                claimedWeight = 180,
                reps = 1,
                submissionDate = "Today",
                status = "PENDING",
                videoUrl = "https://athloboard-videos.s3.amazonaws.com/raw_bench.mp4",
                refereeScore = "Awaiting Referee",
                feedback = "Awaiting video review in Admin Panel."
            )
        )
    )
    val liftSubmissions: StateFlow<List<LiftSubmission>> = _liftSubmissions

    init {
        fetchRemoteData()
    }

    private fun fetchRemoteData() {
        repositoryScope.launch {
            try {
                val res = SupabaseClient.getNationalLeaderboard()
                val athletes = res.getOrNull()
                if (!athletes.isNullOrEmpty()) {
                    _leaderboard.value = athletes
                }
            } catch (_: Exception) { }
        }
    }

    // --- FORM 1: ATHLETE REGISTRATION ---
    fun registerAthlete(
        username: String = "",
        name: String,
        email: String,
        phone: String,
        dob: String,
        gender: String,
        street: String = "",
        locality: String = "",
        pincode: String = "",
        city: String = "",
        hasGymExperience: Boolean,
        gymExperienceDetails: String,
        preferredGym: String,
        weightClass: String
    ) {
        val formattedArea = listOf(street, locality, city, pincode).filter { it.isNotBlank() }.joinToString(", ")
        val newAthlete = Athlete(
            id = if (username.isNotBlank()) username else "ATH-${System.currentTimeMillis() % 10000}",
            name = name,
            email = email,
            phone = phone,
            dob = dob,
            gender = gender,
            street = street,
            locality = locality,
            pincode = pincode,
            city = city,
            area = formattedArea.ifBlank { "Delhi NCR" },
            hasGymExperience = hasGymExperience,
            gymExperienceDetails = gymExperienceDetails,
            preferredGym = preferredGym,
            gymName = if (hasGymExperience && preferredGym.isNotBlank()) preferredGym else "Iron Pulse Strength Club",
            weightClass = weightClass,
            rank = 1,
            badge = "VERIFIED ATHLETE",
            prSquat = 0,
            prBench = 0,
            prDeadlift = 0,
            total = 0,
            streakDays = 1,
            liftPoints = 100,
            kycStatus = "VERIFIED",
            isProfileCompleted = true
        )
        _currentAthlete.value = newAthlete
    }

    // --- FORM 2: GYM REGISTRATION (PHASE 1 + PHASE 2) ---
    fun registerGym(
        gymName: String,
        ownerName: String,
        gymContact: String,
        ownerContact: String,
        gymEmail: String,
        gymType: String,
        street: String = "",
        locality: String = "",
        pincode: String = "",
        city: String = "",
        landmark: String = "",
        latitude: Double? = null,
        longitude: Double? = null,
        isGpsVerified: Boolean = false,
        plateWeightKg: Int,
        dumbbellWeightKg: Int,
        trainerMaleCount: Int,
        trainerFemaleCount: Int,
        openTime: String,
        closeTime: String,
        daysOpenPerWeek: Int,
        chargesMonthly: Int,
        chargesQuarterly: Int,
        chargesYearly: Int
    ) {
        val fullLocation = listOf(street, locality, city, pincode).filter { it.isNotBlank() }.joinToString(", ")
        val newGym = Gym(
            id = "GYM-${System.currentTimeMillis() % 10000}",
            gymName = gymName,
            ownerName = ownerName,
            gymContact = gymContact,
            ownerContact = ownerContact,
            gymEmail = gymEmail,
            gymType = gymType,
            street = street,
            locality = locality,
            pincode = pincode,
            city = city,
            location = fullLocation.ifBlank { "Delhi NCR" },
            landmark = landmark,
            latitude = latitude,
            longitude = longitude,
            isGpsVerified = isGpsVerified,
            plateWeightKg = plateWeightKg,
            dumbbellWeightKg = dumbbellWeightKg,
            trainerMaleCount = trainerMaleCount,
            trainerFemaleCount = trainerFemaleCount,
            openTime = openTime,
            closeTime = closeTime,
            daysOpenPerWeek = daysOpenPerWeek,
            chargesMonthly = chargesMonthly,
            chargesQuarterly = chargesQuarterly,
            chargesYearly = chargesYearly,
            rating = 5.0,
            reviewsCount = 1,
            isAudited = true,
            isApprovedByAdmin = false // Goes to Admin Queue first!
        )
        _gyms.value = listOf(newGym) + _gyms.value
        currentGym.value = newGym
        repositoryScope.launch {
            SupabaseClient.registerGymToSupabase(newGym)
        }
    }

    fun updateGymGpsLocation(gymId: String, lat: Double, lng: Double) {
        _gyms.value = _gyms.value.map { g ->
            if (g.id == gymId) {
                g.copy(latitude = lat, longitude = lng, isGpsVerified = true)
            } else g
        }
        currentGym.value?.let { cg ->
            if (cg.id == gymId) {
                currentGym.value = cg.copy(latitude = lat, longitude = lng, isGpsVerified = true)
            }
        }
    }

    // --- FORM 3: LOCAL VENDOR REGISTRATION ---
    fun registerVendor(
        shopName: String,
        ownerName: String,
        websiteUrl: String,
        ownerContactNumber: String,
        email: String,
        gstin: String,
        location: String,
        landmark: String
    ) {
        val newVendor = Vendor(
            id = "VND-${System.currentTimeMillis() % 10000}",
            shopName = shopName,
            ownerName = ownerName,
            websiteUrl = websiteUrl,
            ownerContactNumber = ownerContactNumber,
            email = email,
            gstin = gstin,
            location = location,
            landmark = landmark,
            isApprovedByAdmin = false // Goes to Admin Queue first!
        )
        _vendors.value = listOf(newVendor) + _vendors.value
        repositoryScope.launch {
            SupabaseClient.registerVendorToSupabase(newVendor)
        }
    }

    // --- FORM 4: BRAND REGISTRATION ---
    fun registerBrand(
        name: String,
        websiteUrl: String,
        categoryOrGym: String,
        email: String,
        gstin: String
    ) {
        val newBrand = Brand(
            id = "BRD-${System.currentTimeMillis() % 10000}",
            name = name,
            websiteUrl = websiteUrl,
            categoryOrGym = categoryOrGym,
            email = email,
            gstin = gstin,
            isApprovedByAdmin = false // Goes to Admin Queue first!
        )
        _brands.value = listOf(newBrand) + _brands.value
        repositoryScope.launch {
            SupabaseClient.registerBrandToSupabase(newBrand)
        }
    }

    // --- FORM 5: PRODUCT LISTING CREATION ---
    fun addProduct(
        name: String,
        brandName: String,
        vendorId: String,
        category: String,
        flavor: String,
        weight: String,
        servings: Int,
        price: Int,
        stockNumber: Int,
        photoUrl1: String,
        photoUrl2: String,
        description: String
    ) {
        val newProduct = Product(
            id = "PRD-${System.currentTimeMillis() % 10000}",
            name = name,
            brandName = brandName,
            vendorId = vendorId,
            category = category,
            flavor = flavor,
            weight = weight,
            servings = servings,
            price = price,
            originalPrice = (price * 1.2).toInt(),
            stockNumber = stockNumber,
            inStock = stockNumber > 0,
            photoUrl1 = photoUrl1,
            photoUrl2 = photoUrl2,
            description = description,
            isApprovedByAdmin = false // Goes to Admin Queue first!
        )
        _products.value = listOf(newProduct) + _products.value
        repositoryScope.launch {
            SupabaseClient.addProductToSupabase(newProduct)
        }
    }

    // --- ADMIN ACTIONS: APPROVE / REJECT ITEMS ---
    fun setGymApproval(gymId: String, isApproved: Boolean) {
        _gyms.value = _gyms.value.map { if (it.id == gymId) it.copy(isApprovedByAdmin = isApproved) else it }
        val status = if (isApproved) "verified" else "rejected"
        repositoryScope.launch { SupabaseClient.updateVerificationStatus("gyms", gymId, status) }
    }

    fun setVendorApproval(vendorId: String, isApproved: Boolean) {
        _vendors.value = _vendors.value.map { if (it.id == vendorId) it.copy(isApprovedByAdmin = isApproved) else it }
        val status = if (isApproved) "verified" else "rejected"
        repositoryScope.launch { SupabaseClient.updateVerificationStatus("vendors", vendorId, status) }
    }

    fun setBrandApproval(brandId: String, isApproved: Boolean) {
        _brands.value = _brands.value.map { if (it.id == brandId) it.copy(isApprovedByAdmin = isApproved) else it }
        val status = if (isApproved) "verified" else "rejected"
        repositoryScope.launch { SupabaseClient.updateVerificationStatus("brands", brandId, status) }
    }

    fun setProductApproval(productId: String, isApproved: Boolean) {
        _products.value = _products.value.map { if (it.id == productId) it.copy(isApprovedByAdmin = isApproved) else it }
        val status = if (isApproved) "verified" else "rejected"
        repositoryScope.launch { SupabaseClient.updateVerificationStatus("products", productId, status) }
    }

    fun verifyLiftSubmission(submissionId: String, isApproved: Boolean, score: String, feedback: String) {
        _liftSubmissions.value = _liftSubmissions.value.map {
            if (it.id == submissionId) {
                it.copy(
                    status = if (isApproved) "VERIFIED" else "REJECTED",
                    refereeScore = score,
                    feedback = feedback
                )
            } else it
        }
    }

    // Lift Submissions
    fun submitLiftVideo(
        liftType: String,
        weight: Int,
        videoUrl: String = "https://athloboard-videos.s3.amazonaws.com/raw_audit.mp4"
    ): LiftSubmission {
        val newSub = LiftSubmission(
            id = "SUB-${System.currentTimeMillis() % 10000}",
            athleteId = _currentAthlete.value.id,
            athleteName = _currentAthlete.value.name,
            liftType = liftType,
            claimedWeight = weight,
            reps = 1,
            submissionDate = "Today",
            status = "PENDING", // Sent to Admin Review Queue!
            videoUrl = videoUrl,
            refereeScore = "Awaiting Referee",
            feedback = "Video submitted. Automated plate audit & admin verification pending."
        )
        _liftSubmissions.value = listOf(newSub) + _liftSubmissions.value
        return newSub
    }

    // Auth Sync
    fun syncAthleteFromFirebaseAuth(
        uid: String,
        email: String,
        displayName: String,
        photoUrl: String,
        firebaseIdToken: String
    ) {
        _currentAthlete.value = _currentAthlete.value.copy(
            id = uid,
            name = displayName.ifBlank { email.substringBefore("@") },
            email = email,
            avatarUrl = photoUrl
        )
        repositoryScope.launch {
            try {
                SupabaseClient.syncAthleteFromFirebase(
                    firebaseUid = uid,
                    email = email,
                    displayName = displayName,
                    photoUrl = photoUrl,
                    firebaseIdToken = firebaseIdToken
                )
            } catch (_: Exception) { }
        }
    }

    // Athlete Profile Update
    fun updateAthleteProfile(
        name: String,
        email: String,
        phone: String,
        dob: String,
        gender: String,
        gymExperience: String,
        preferredGym: String,
        area: String,
        weightClass: String,
        prSquat: Int,
        prBench: Int,
        prDeadlift: Int,
        bio: String,
        instagram: String
    ) {
        val total = prSquat + prBench + prDeadlift
        _currentAthlete.value = _currentAthlete.value.copy(
            name = name,
            email = email,
            phone = phone,
            dob = dob,
            gender = gender,
            gymExperienceDetails = gymExperience,
            preferredGym = preferredGym,
            area = area,
            weightClass = weightClass,
            prSquat = prSquat,
            prBench = prBench,
            prDeadlift = prDeadlift,
            total = total,
            bio = bio,
            instagram = instagram
        )
    }

    fun toggleCompetitionRegistration(competitionId: String) {
        _competitions.value = _competitions.value.map { comp ->
            if (comp.id == competitionId) {
                val newStatus = !comp.isRegistered
                comp.copy(
                    isRegistered = newStatus,
                    registeredCount = if (newStatus) comp.registeredCount + 1 else comp.registeredCount - 1
                )
            } else comp
        }
    }
}

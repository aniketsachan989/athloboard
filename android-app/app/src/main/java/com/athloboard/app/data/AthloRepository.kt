package com.athloboard.app.data

import android.util.Log
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
import com.google.gson.Gson
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.util.concurrent.TimeUnit

object AthloRepository {

    private const val TAG = "AthloRepository"
    
    companion object {
        val BASE_API_URL = com.athloboard.app.BuildConfig.BASE_API_URL ?: "http://10.0.2.2:4000"
    }

    private val repositoryScope = CoroutineScope(Dispatchers.IO)
    private val gson = Gson()
    private val jsonMediaType = "application/json; charset=utf-8".toMediaType()

    private val httpClient: OkHttpClient = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .writeTimeout(15, TimeUnit.SECONDS)
        .readTimeout(15, TimeUnit.SECONDS)
        .build()

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
                gender = "Male",
                weightClass = "83kg",
                rank = 1,
                badge = "VERIFIED ATHLETE",
                gymName = "Athloboard Club",
                prSquat = 0,
                prBench = 0,
                prDeadlift = 0,
                total = 0,
                streakDays = 0,
                liftPoints = 0,
                kycStatus = "VERIFIED",
                isProfileCompleted = true,
                avatarUrl = user.photoUrl?.toString() ?: ""
            )
        } ?: Athlete(isProfileCompleted = true)
    )
    val currentAthlete: StateFlow<Athlete> = _currentAthlete

    fun isProfileComplete(): Boolean {
        return FirebaseAuth.getInstance().currentUser != null
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

    fun checkUsernameAvailability(handle: String): Boolean {
        val clean = handle.trim().lowercase().removePrefix("@")
        if (clean.length < 3) return false
        if (!clean.matches(Regex("^[a-zA-Z0-9_.]+$"))) return false
        return true
    }

    // 2. Leaderboard Lifters (From Database Only)
    private val _leaderboard = MutableStateFlow<List<Athlete>>(emptyList())
    val leaderboard: StateFlow<List<Athlete>> = _leaderboard

    // 3. Gyms Directory (From Database Only)
    private val _gyms = MutableStateFlow<List<Gym>>(emptyList())
    val gyms: StateFlow<List<Gym>> = _gyms

    val currentGym = MutableStateFlow(
        Gym(
            id = "GYM-EMPTY",
            gymName = "Discover Certified Gyms",
            ownerName = "Athloboard Network",
            location = "Select a verified gym from the directory",
            isAudited = true,
            isApprovedByAdmin = true
        )
    )

    // 4. Local Vendors (From Database Only)
    private val _vendors = MutableStateFlow<List<Vendor>>(emptyList())
    val vendors: StateFlow<List<Vendor>> = _vendors

    // 5. Brands (From Database Only)
    private val _brands = MutableStateFlow<List<Brand>>(emptyList())
    val brands: StateFlow<List<Brand>> = _brands

    // 6. Marketplace Products (From Database Only)
    private val _products = MutableStateFlow<List<Product>>(emptyList())
    val products: StateFlow<List<Product>> = _products

    // 7. Gym Members (From Database Only)
    private val _gymMembers = MutableStateFlow<List<GymMember>>(emptyList())
    val gymMembers: StateFlow<List<GymMember>> = _gymMembers

    // 8. Promotions (From Database Only)
    private val _promotions = MutableStateFlow<List<Promotion>>(emptyList())
    val promotions: StateFlow<List<Promotion>> = _promotions

    // 9. Competitions & Meets (From Database Only)
    private val _competitions = MutableStateFlow<List<Competition>>(emptyList())
    val competitions: StateFlow<List<Competition>> = _competitions

    // 10. Coupons (From Database Only)
    private val _coupons = MutableStateFlow<List<Coupon>>(emptyList())
    val coupons: StateFlow<List<Coupon>> = _coupons

    // 11. Lift Submissions (From Database Only)
    private val _liftSubmissions = MutableStateFlow<List<LiftSubmission>>(emptyList())
    val liftSubmissions: StateFlow<List<LiftSubmission>> = _liftSubmissions

    init {
        fetchRemoteData()
    }

    fun fetchRemoteData() {
        repositoryScope.launch {
            try {
                // 1. Leaderboard from Supabase
                val lbRes = SupabaseClient.getNationalLeaderboard()
                lbRes.getOrNull()?.let { if (it.isNotEmpty()) _leaderboard.value = it }

                // 2. Verified Gyms from Supabase
                val gymRes = SupabaseClient.getVerifiedGyms()
                gymRes.getOrNull()?.let {
                    if (it.isNotEmpty()) {
                        _gyms.value = it
                        currentGym.value = it.first()
                    }
                }

                // 3. Competitions from Supabase
                val compRes = SupabaseClient.getSanctionedCompetitions()
                compRes.getOrNull()?.let { if (it.isNotEmpty()) _competitions.value = it }

                // 4. Current Athlete Profile from Supabase
                val uid = FirebaseAuth.getInstance().currentUser?.uid
                if (!uid.isNullOrBlank()) {
                    val profileRes = SupabaseClient.getAthleteProfile(uid)
                    profileRes.getOrNull()?.let { prof ->
                        _currentAthlete.value = prof
                    }
                }

                // 5. Query live lift submissions from backend
                try {
                    val req = Request.Builder().url("${BASE_API_URL}/api/lifts/submissions").get().build()
                    httpClient.newCall(req).execute().use { response ->
                        if (response.isSuccessful) {
                            val body = response.body?.string() ?: ""
                            val listType = object : com.google.gson.reflect.TypeToken<List<Map<String, Any>>>() {}.type
                            val list: List<Map<String, Any>> = gson.fromJson(body, listType)
                            _liftSubmissions.value = list.map { map ->
                                LiftSubmission(
                                    id = map["id"]?.toString() ?: "LFT-001",
                                    athleteId = map["athlete_id"]?.toString() ?: "",
                                    athleteName = map["athlete_name"]?.toString() ?: "Athlete",
                                    liftType = map["exercise_name"]?.toString() ?: "Squat",
                                    claimedWeight = (map["claimed_weight_kg"] as? Number)?.toInt() ?: 225,
                                    reps = (map["reps"] as? Number)?.toInt() ?: 1,
                                    submissionDate = "Today",
                                    status = map["status"]?.toString()?.uppercase() ?: "PENDING",
                                    videoUrl = map["video_url"]?.toString() ?: "",
                                    refereeScore = map["angle_score"]?.toString() ?: "Awaiting Referee",
                                    feedback = map["pause_duration"]?.toString() ?: "Logged in database."
                                )
                            }
                        }
                    }
                } catch (_: Exception) {}
            } catch (e: Exception) {
                Log.w(TAG, "Error fetching remote database records: ${e.message}")
            }
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
            id = if (username.isNotBlank()) username else (_currentAthlete.value.id.ifBlank { "ATH-${System.currentTimeMillis() % 10000}" }),
            name = name,
            email = email,
            phone = phone,
            dob = dob,
            gender = gender,
            street = street,
            locality = locality,
            pincode = pincode,
            city = city,
            area = formattedArea.ifBlank { "India" },
            hasGymExperience = hasGymExperience,
            gymExperienceDetails = gymExperienceDetails,
            preferredGym = preferredGym,
            gymName = if (hasGymExperience && preferredGym.isNotBlank()) preferredGym else "Athloboard Club",
            weightClass = weightClass,
            rank = 1,
            badge = "VERIFIED ATHLETE",
            prSquat = 0,
            prBench = 0,
            prDeadlift = 0,
            total = 0,
            streakDays = 1,
            liftPoints = 0,
            kycStatus = "VERIFIED",
            isProfileCompleted = true,
            avatarUrl = _currentAthlete.value.avatarUrl
        )

        _currentAthlete.value = newAthlete

        repositoryScope.launch {
            try {
                SupabaseClient.updateAthleteProfile(newAthlete)
            } catch (_: Exception) {}
        }
    }

    // --- FORM 2: GYM REGISTRATION OVERLOADS ---
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
        latitude: Double = 0.0,
        longitude: Double = 0.0,
        isGpsVerified: Boolean = false,
        plateWeightKg: Int = 1800,
        dumbbellWeightKg: Int = 1200,
        trainerMaleCount: Int = 4,
        trainerFemaleCount: Int = 2,
        openTime: String = "05:30 AM",
        closeTime: String = "11:00 PM",
        daysOpenPerWeek: Int = 7,
        chargesMonthly: Int = 2499,
        chargesQuarterly: Int = 6499,
        chargesYearly: Int = 19999
    ) {
        val location = listOf(street, locality, city, pincode).filter { it.isNotBlank() }.joinToString(", ").ifBlank { "India" }
        val gym = Gym(
            id = "GYM-${System.currentTimeMillis() % 10000}",
            gymName = gymName,
            ownerName = ownerName,
            gymContact = gymContact,
            ownerContact = ownerContact,
            gymEmail = gymEmail,
            gymType = gymType,
            location = location,
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
            rating = 0.0,
            reviewsCount = 0,
            isAudited = false,
            isApprovedByAdmin = false
        )
        registerGym(gym)
    }

    fun registerGym(gym: Gym) {
        _gyms.value = listOf(gym) + _gyms.value
        currentGym.value = gym
        repositoryScope.launch {
            try {
                SupabaseClient.registerGymToSupabase(gym)
            } catch (_: Exception) {}
        }
    }

    fun updateGymGpsLocation(gymId: String, lat: Double, lng: Double) {
        _gyms.value = _gyms.value.map {
            if (it.id == gymId) it.copy(latitude = lat, longitude = lng, isGpsVerified = true) else it
        }
        if (currentGym.value.id == gymId) {
            currentGym.value = currentGym.value.copy(latitude = lat, longitude = lng, isGpsVerified = true)
        }
    }

    // --- FORM 3: LOCAL VENDOR REGISTRATION OVERLOADS ---
    fun registerVendor(
        shopName: String,
        ownerName: String,
        websiteUrl: String = "",
        ownerContactNumber: String,
        email: String,
        gstin: String,
        location: String,
        landmark: String = ""
    ) {
        val vendor = Vendor(
            id = "VND-${System.currentTimeMillis() % 10000}",
            shopName = shopName,
            ownerName = ownerName,
            websiteUrl = websiteUrl,
            ownerContactNumber = ownerContactNumber,
            email = email,
            gstin = gstin,
            location = location,
            landmark = landmark,
            isApprovedByAdmin = false
        )
        registerVendor(vendor)
    }

    fun registerVendor(vendor: Vendor) {
        _vendors.value = listOf(vendor) + _vendors.value
        repositoryScope.launch {
            try {
                SupabaseClient.registerVendorToSupabase(vendor)
            } catch (_: Exception) {}
        }
    }

    // --- FORM 4: BRAND REGISTRATION OVERLOADS ---
    fun registerBrand(
        name: String,
        websiteUrl: String,
        categoryOrGym: String,
        email: String,
        gstin: String
    ) {
        val brand = Brand(
            id = "BRD-${System.currentTimeMillis() % 10000}",
            name = name,
            websiteUrl = websiteUrl,
            categoryOrGym = categoryOrGym,
            email = email,
            gstin = gstin,
            isApprovedByAdmin = false
        )
        registerBrand(brand)
    }

    fun registerBrand(brand: Brand) {
        _brands.value = listOf(brand) + _brands.value
        repositoryScope.launch {
            try {
                SupabaseClient.registerBrandToSupabase(brand)
            } catch (_: Exception) {}
        }
    }

    // --- FORM 5: PRODUCT LISTING OVERLOADS ---
    fun addProduct(
        name: String,
        brandName: String,
        vendorId: String = "VND-101",
        category: String,
        flavor: String = "",
        weight: String = "",
        servings: Int = 30,
        price: Int = 1999,
        stockNumber: Int = 20,
        photoUrl1: String = "",
        photoUrl2: String = "",
        description: String = ""
    ) {
        val product = Product(
            id = "PRD-${System.currentTimeMillis() % 10000}",
            name = name,
            brandName = brandName,
            vendorId = vendorId,
            category = category,
            flavor = flavor,
            weight = weight,
            servings = servings,
            price = price,
            stockNumber = stockNumber,
            photoUrl1 = photoUrl1,
            photoUrl2 = photoUrl2,
            description = description,
            isApprovedByAdmin = false
        )
        addProduct(product)
    }

    fun addProduct(product: Product) {
        _products.value = listOf(product) + _products.value
        repositoryScope.launch {
            try {
                SupabaseClient.addProductToSupabase(product)
            } catch (_: Exception) {}
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

    // Lift Submissions (Direct DB Submission)
    fun submitLiftVideo(
        liftType: String,
        weight: Int,
        videoUrl: String = "https://media.athloboard.com/lift-videos/ath_test/lift.mp4"
    ): LiftSubmission {
        val subId = "SUB-${System.currentTimeMillis() % 10000}"
        val newSub = LiftSubmission(
            id = subId,
            athleteId = _currentAthlete.value.id,
            athleteName = _currentAthlete.value.name,
            liftType = liftType,
            claimedWeight = weight,
            reps = 1,
            submissionDate = "Today",
            status = "PENDING",
            videoUrl = videoUrl,
            refereeScore = "Awaiting Referee",
            feedback = "Video submitted to Cloudflare R2 & logged in database."
        )
        _liftSubmissions.value = listOf(newSub) + _liftSubmissions.value

        // Direct HTTP POST to Backend Database API (persists in PostgreSQL & Admin Queue)
        repositoryScope.launch {
            try {
                val payload = mapOf(
                    "athleteId" to _currentAthlete.value.id,
                    "athleteName" to _currentAthlete.value.name,
                    "exercise" to liftType,
                    "weightKg" to weight,
                    "reps" to 1,
                    "videoUrl" to videoUrl
                )
                val request = Request.Builder()
                    .url("${BASE_API_URL}/api/lifts/submit-video")
                    .post(gson.toJson(payload).toRequestBody(jsonMediaType))
                    .build()

                httpClient.newCall(request).execute().use { response -> 
                    // process if needed
                }
            } catch (_: Exception) {}
        }

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
            avatarUrl = photoUrl,
            isProfileCompleted = true
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
            } catch (_: Exception) {}
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
            instagram = instagram,
            isProfileCompleted = true
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

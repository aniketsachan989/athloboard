package com.athloboard.app.data.supabase

import com.google.gson.annotations.SerializedName

/**
 * Data Transfer Objects for Supabase PostgreSQL Tables
 */

data class SupabaseAthleteDto(
    @SerializedName("id") val id: String? = null,
    @SerializedName("unique_athlete_id") val uniqueAthleteId: String? = null,
    @SerializedName("full_name") val fullName: String? = null,
    @SerializedName("gender") val gender: String? = null,
    @SerializedName("weight_class") val weightClass: String? = null,
    @SerializedName("national_rank") val nationalRank: Int? = null,
    @SerializedName("badge_title") val badgeTitle: String? = null,
    @SerializedName("gym_name") val gymName: String? = null,
    @SerializedName("avatar_url") val avatarUrl: String? = null,
    @SerializedName("pr_squat_kg") val prSquatKg: Double? = null,
    @SerializedName("pr_bench_kg") val prBenchKg: Double? = null,
    @SerializedName("pr_deadlift_kg") val prDeadliftKg: Double? = null,
    @SerializedName("total_sbd_kg") val totalSbdKg: Double? = null
)

data class SupabaseGymDto(
    @SerializedName("id") val id: String? = null,
    @SerializedName("gym_name") val gymName: String? = null,
    @SerializedName("owner_name") val ownerName: String? = null,
    @SerializedName("gym_contact") val gymContact: String? = null,
    @SerializedName("gym_email") val gymEmail: String? = null,
    @SerializedName("gym_type") val gymType: String? = null,
    @SerializedName("location_address") val locationAddress: String? = null,
    @SerializedName("landmark") val landmark: String? = null,
    @SerializedName("total_plate_weight_kg") val totalPlateWeightKg: Double? = null,
    @SerializedName("total_dumbbell_weight_kg") val totalDumbbellWeightKg: Double? = null,
    @SerializedName("trainer_count_male") val trainerCountMale: Int? = null,
    @SerializedName("trainer_count_female") val trainerCountFemale: Int? = null,
    @SerializedName("open_time") val openTime: String? = null,
    @SerializedName("close_time") val closeTime: String? = null,
    @SerializedName("operational_days") val operationalDays: String? = null,
    @SerializedName("monthly_charge") val monthlyCharge: Double? = null,
    @SerializedName("verification_status") val verificationStatus: String? = null
)

data class SupabaseCompetitionDto(
    @SerializedName("id") val id: String? = null,
    @SerializedName("title") val title: String? = null,
    @SerializedName("city") val city: String? = null,
    @SerializedName("venue_name") val venueName: String? = null,
    @SerializedName("competition_date") val competitionDate: String? = null,
    @SerializedName("entry_fee") val entryFee: Double? = null,
    @SerializedName("prize_pool") val prizePool: Double? = null,
    @SerializedName("banner_url") val bannerUrl: String? = null
)

data class SupabaseLiftSubmissionRequest(
    @SerializedName("athlete_id") val athleteId: String,
    @SerializedName("exercise") val exercise: String,
    @SerializedName("claimed_weight_kg") val claimedWeightKg: Double,
    @SerializedName("video_url") val videoUrl: String,
    @SerializedName("reps_detected") val repsDetected: Int = 1,
    @SerializedName("valid_reps") val validReps: Int = 1,
    @SerializedName("form_status") val formStatus: String = "pending_referee",
    @SerializedName("status") val status: String = "unverified"
)

data class SupabaseVendorDto(
    @SerializedName("id") val id: String? = null,
    @SerializedName("shop_name") val shopName: String? = null,
    @SerializedName("owner_name") val ownerName: String? = null,
    @SerializedName("website_url") val websiteUrl: String? = null,
    @SerializedName("contact_number") val contactNumber: String? = null,
    @SerializedName("email") val email: String? = null,
    @SerializedName("gstin") val gstin: String? = null,
    @SerializedName("address") val address: String? = null,
    @SerializedName("landmark") val landmark: String? = null,
    @SerializedName("verification_status") val verificationStatus: String? = null
)

data class SupabaseBrandDto(
    @SerializedName("id") val id: String? = null,
    @SerializedName("brand_name") val brandName: String? = null,
    @SerializedName("website_url") val websiteUrl: String? = null,
    @SerializedName("email") val email: String? = null,
    @SerializedName("gstin") val gstin: String? = null,
    @SerializedName("verification_status") val verificationStatus: String? = null
)

data class SupabaseProductDto(
    @SerializedName("id") val id: String? = null,
    @SerializedName("product_name") val productName: String? = null,
    @SerializedName("category") val category: String? = null,
    @SerializedName("weight") val weight: String? = null,
    @SerializedName("servings") val servings: Int? = null,
    @SerializedName("price") val price: Double? = null,
    @SerializedName("stock_number") val stockNumber: Int? = null,
    @SerializedName("photo_url_1") val photoUrl1: String? = null,
    @SerializedName("photo_url_2") val photoUrl2: String? = null,
    @SerializedName("listing_status") val listingStatus: String? = null
)

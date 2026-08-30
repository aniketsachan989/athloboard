package com.athloboard.app.data.models

data class Athlete(
    val id: String = "",
    val name: String = "",
    val email: String = "",
    val phone: String = "",
    val dob: String = "",
    val gender: String = "",
    val hasGymExperience: Boolean = false,
    val gymExperienceDetails: String = "",
    val preferredGym: String = "",
    val area: String = "",
    val street: String = "",
    val locality: String = "",
    val pincode: String = "",
    val city: String = "",
    val weightClass: String = "",
    val rank: Int = 1,
    val badge: String = "NEW ATHLETE",
    val gymName: String = "",
    val prSquat: Int = 0,
    val prBench: Int = 0,
    val prDeadlift: Int = 0,
    val total: Int = 0,
    val streakDays: Int = 0,
    val liftPoints: Int = 0,
    val kycStatus: String = "PENDING_ONBOARDING",
    val isApproved: Boolean = true,
    val isProfileCompleted: Boolean = false,
    val avatarUrl: String = "",
    val bio: String = "",
    val instagram: String = ""
)

data class Gym(
    val id: String = "GYM-101",
    // Phase 1 (Basic Info)
    val gymName: String = "Iron Pulse Strength Club",
    val ownerName: String = "Rajesh Sharma",
    val gymContact: String = "+91 98112 33445",
    val ownerContact: String = "+91 98112 33446",
    val gymEmail: String = "ironpulse@athloboard.com",
    val gymType: String = "Unisex", // Unisex / Men Only / Women Only / Other
    val location: String = "Plot 42, Sector 18, Noida, Uttar Pradesh",
    val landmark: String = "Opposite Metro Gate 2",
    val street: String = "Plot 42",
    val locality: String = "Sector 18",
    val pincode: String = "201301",
    val city: String = "Noida",
    val latitude: Double? = 28.5708,
    val longitude: Double? = 77.3271,
    val isGpsVerified: Boolean = true,
    // Phase 2 (Detailed Info)
    val plateWeightKg: Int = 1850,
    val dumbbellWeightKg: Int = 1200,
    val trainerMaleCount: Int = 5,
    val trainerFemaleCount: Int = 3,
    val openTime: String = "05:30 AM",
    val closeTime: String = "11:00 PM",
    val daysOpenPerWeek: Int = 7,
    val chargesMonthly: Int = 2499,
    val chargesQuarterly: Int = 6499,
    val chargesYearly: Int = 19999,
    val interiorPhoto1: String = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80",
    val interiorPhoto2: String = "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&q=80",
    val exteriorPhoto: String = "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&q=80",
    val rating: Double = 4.9,
    val reviewsCount: Int = 142,
    val isAudited: Boolean = true,
    val isApprovedByAdmin: Boolean = true
)

data class Vendor(
    val id: String = "VND-101",
    val shopName: String = "Muscle Armour Nutrition",
    val ownerName: String = "Amit Singhal",
    val websiteUrl: String = "https://musclearmour.in",
    val ownerContactNumber: String = "+91 98100 11223",
    val email: String = "contact@musclearmour.in",
    val gstin: String = "07AAAAA0000A1Z5",
    val location: String = "Shop 14, Main Market, Lajpat Nagar, New Delhi",
    val landmark: String = "Near Central Market Fountain",
    val isApprovedByAdmin: Boolean = true
)

data class Brand(
    val id: String = "BRD-101",
    val name: String = "Optimum Nutrition India",
    val websiteUrl: String = "https://www.optimumnutrition.co.in",
    val categoryOrGym: String = "Supplements & Performance Nutrition",
    val email: String = "partner@optimumnutrition.in",
    val gstin: String = "07AAACR1234F1Z8",
    val isApprovedByAdmin: Boolean = true
)

data class Product(
    val id: String = "PRD-1",
    val name: String = "Gold Standard 100% Whey Isolate",
    val brandName: String = "Optimum Nutrition",
    val vendorId: String = "BRD-101",
    val category: String = "Protein", // Protein / Creatine / Pre-workout / Belts / Straps / Accessories
    val flavor: String = "Double Rich Chocolate",
    val weight: String = "2.27 kg (5 lbs)",
    val servings: Int = 74,
    val price: Int = 6899,
    val originalPrice: Int = 8299,
    val stockNumber: Int = 35,
    val inStock: Boolean = true,
    val isSponsored: Boolean = true,
    val isVerifiedBrand: Boolean = true,
    val isApprovedByAdmin: Boolean = true,
    val photoUrl1: String = "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500&q=80",
    val photoUrl2: String = "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&q=80",
    val description: String = "Ultra-pure whey protein isolate for rapid muscle recovery. 25g protein, 5.5g BCAAs, lab tested for banned substances.",
    val vendorContact: String = "https://athloboard.com/store/checkout",
    val activeCouponCode: String? = "ATHLO10"
)

data class GymMember(
    val id: String,
    val gymId: String,
    val athleteId: String,
    val athleteName: String,
    val phone: String,
    val email: String,
    val joinDate: String,
    val planType: String = "Monthly (₹2,499)",
    val status: String = "ACTIVE",
    val lastCheckIn: String = "Today, 07:15 AM",
    val sbdTotalKg: Int = 540
)

data class LiftSubmission(
    val id: String,
    val athleteId: String,
    val athleteName: String,
    val liftType: String,
    val claimedWeight: Int,
    val reps: Int,
    val submissionDate: String,
    var status: String = "VERIFIED", // VERIFIED / PENDING / REJECTED
    val videoUrl: String? = null,
    val refereeScore: String = "3/3 White Lights",
    val feedback: String? = null
)

data class Competition(
    val id: String,
    val title: String,
    val category: String,
    val date: String,
    val time: String,
    val venue: String,
    val city: String,
    val prizePool: String,
    val entryFee: Int,
    val rules: String,
    val registeredCount: Int,
    val isRegistered: Boolean = false,
    val isApprovedByAdmin: Boolean = true,
    val sport: String = "Powerlifting (SBD)"
)

data class Promotion(
    val id: String,
    val gymId: String,
    val title: String,
    val description: String,
    val discountPercent: Int,
    val validUntil: String,
    val isBroadcasted: Boolean = true
)

data class Coupon(
    val id: String,
    val vendorName: String,
    val discountDescription: String,
    val code: String,
    val expiryDate: String,
    val minOrderAmount: Int = 1999
)

package com.athloboard.app.data.models

data class Gym(
    val id: String,
    val gymName: String,
    val ownerName: String,
    val gymContact: String,
    val gymEmail: String,
    val gymType: String,
    val location: String,
    val landmark: String,
    val plateWeightKg: Int,
    val dumbbellWeightKg: Int,
    val trainerMaleCount: Int,
    val trainerFemaleCount: Int,
    val openTime: String,
    val closeTime: String,
    val daysOpenPerWeek: Int,
    val chargesMonthly: Int,
    val rating: Double,
    val reviewsCount: Int
)

data class LiftSubmission(
    val id: String,
    val athleteId: String,
    val athleteName: String,
    val liftType: String,
    val claimedWeight: Int,
    val reps: Int,
    val submissionDate: String,
    var status: String,
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
    val registeredCount: Int
)

data class Product(
    val id: String,
    val name: String,
    val category: String,
    val weight: String,
    val servings: Int,
    val price: Int,
    val stock: Int,
    val ownerName: String
)

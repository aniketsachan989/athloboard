package com.athloboard.app.data

import com.athloboard.app.data.models.Athlete
import com.athloboard.app.data.models.Competition
import com.athloboard.app.data.models.Gym
import com.athloboard.app.data.models.LiftSubmission
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

object AthloRepository {

    private val _currentAthlete = MutableStateFlow(
        Athlete(
            id = "ATH-9081",
            name = "Kabir Rawat",
            gender = "Male",
            weightClass = "83kg",
            rank = 1,
            badge = "ELITE PRO",
            gymName = "Titan Iron & Fitness Club",
            prSquat = 225,
            prBench = 155,
            prDeadlift = 260,
            total = 640,
            kycStatus = "VERIFIED",
            avatarUrl = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&q=80"
        )
    )
    val currentAthlete: StateFlow<Athlete> = _currentAthlete

    private val _leaderboard = MutableStateFlow(
        listOf(
            Athlete("ATH-9081", "Kabir Rawat", "Male", "83kg", 1, "ELITE PRO", "Titan Iron Club", 225, 155, 260, 640, "VERIFIED", ""),
            Athlete("ATH-7724", "Aanya Sharma", "Female", "63kg", 2, "CHAMPION", "Olympus Strength", 160, 95, 190, 445, "VERIFIED", ""),
            Athlete("ATH-3392", "Rohan Deshmukh", "Male", "74kg", 3, "RISING STAR", "Iron Haven", 180, 130, 210, 520, "VERIFIED", ""),
            Athlete("ATH-1102", "Vikram Rathore", "Male", "93kg", 4, "MASTER", "Spartan Gym", 240, 160, 275, 675, "VERIFIED", "")
        )
    )
    val leaderboard: StateFlow<List<Athlete>> = _leaderboard

    private val _competitions = MutableStateFlow(
        listOf(
            Competition(
                id = "CMP-201",
                title = "National Raw Powerlifting Cup 2026",
                category = "Powerlifting (SBD)",
                date = "2026-10-18",
                time = "08:00 AM IST",
                venue = "Thyagaraj Sports Complex",
                city = "New Delhi",
                prizePool = "₹ 5,00,000",
                entryFee = 1500,
                rules = "Raw without wraps, IPF Technical Rulebook",
                registeredCount = 148
            ),
            Competition(
                id = "CMP-202",
                title = "Mumbai Iron Bench Press Championship",
                category = "Single Lift (Bench Only)",
                date = "2026-11-05",
                time = "10:00 AM IST",
                venue = "Titan Iron Arena",
                city = "Mumbai",
                prizePool = "₹ 2,00,000",
                entryFee = 999,
                rules = "Head down, 2-sec chest pause mandatory",
                registeredCount = 84
            )
        )
    )
    val competitions: StateFlow<List<Competition>> = _competitions

    private val _currentGym = MutableStateFlow(
        Gym(
            id = "GYM-101",
            gymName = "Titan Iron & Fitness Club",
            ownerName = "Vikramaditya Rathore",
            gymContact = "+91 22 2847 9901",
            gymEmail = "contact@titanironfitness.in",
            gymType = "unisex",
            location = "Level 3, Infinity Tech Park, Andheri West, Mumbai",
            landmark = "Near Metro Pillar 142",
            plateWeightKg = 4500,
            dumbbellWeightKg = 1800,
            trainerMaleCount = 6,
            trainerFemaleCount = 4,
            openTime = "05:30 AM",
            closeTime = "11:00 PM",
            daysOpenPerWeek = 7,
            chargesMonthly = 3500,
            rating = 4.9,
            reviewsCount = 142
        )
    )
    val currentGym: StateFlow<Gym> = _currentGym

    fun submitLiftVideo(liftType: String, weight: Int): LiftSubmission {
        val sub = LiftSubmission(
            id = "LFT-" + (1000..9999).random(),
            athleteId = _currentAthlete.value.id,
            athleteName = _currentAthlete.value.name,
            liftType = liftType,
            claimedWeight = weight,
            reps = 1,
            submissionDate = "2026-08-27",
            status = "PENDING",
            feedback = "Submitted to Super Admin queue for depth & lockout verification."
        )
        return sub
    }
}

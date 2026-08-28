package com.athloboard.app.data.models

data class Athlete(
    val id: String,
    val name: String,
    val gender: String,
    val weightClass: String,
    val rank: Int,
    val badge: String,
    val gymName: String,
    val prSquat: Int,
    val prBench: Int,
    val prDeadlift: Int,
    val total: Int,
    val kycStatus: String,
    val avatarUrl: String
)

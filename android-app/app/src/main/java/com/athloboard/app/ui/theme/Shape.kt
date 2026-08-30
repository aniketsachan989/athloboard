package com.athloboard.app.ui.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Shapes
import androidx.compose.ui.unit.dp

val Shapes = Shapes(
    small = RoundedCornerShape(12.dp),
    medium = RoundedCornerShape(20.dp),  // Cards ~20dp radius
    large = RoundedCornerShape(28.dp),   // Buttons & Inputs ~28dp pill radius
    extraLarge = RoundedCornerShape(32.dp)
)

val PillShape = RoundedCornerShape(100.dp)
val CardShape = RoundedCornerShape(20.dp)
val ButtonShape = RoundedCornerShape(28.dp)
val InputShape = RoundedCornerShape(28.dp)

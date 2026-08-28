# Athloboard Android App (Native Kotlin Project)

This is the native Android application for **Athloboard**, built using **Kotlin**, **Android Jetpack**, **CameraX**, and **Material 3** dark athletic design tokens.

---

## 📱 Features Included

1. **Athlete Profile & Digital PR Card**:
   - Displays real-time Squat, Bench Press, Deadlift, and Total (SBD) numbers.
   - National rank badge (#1) and verified competition status.
2. **Camera Lift Recording Studio (`LiftRecorderFragment`)**:
   - Parallel Squat Depth threshold guide overlay.
   - Live 3-2-1 countdown timer and live recording clock.
   - Direct submission trigger into the Super Admin verification queue.
3. **Official National Leaderboard (`LeaderboardFragment`)**:
   - Verified ranking breakdown with category classifications.
4. **Sanctioned Competitions Hub (`CompetitionsFragment`)**:
   - Browse upcoming national and city-level meets, prize pools, and 1-tap entry.
5. **Gym Portal View (`GymPortalFragment`)**:
   - Live verified gym equipment specs: **4,500 KG Plates**, **1,800 KG Dumbbells**, **6 Male / 4 Female trainer counts** (informational only), and member promotions.

---

## 🛠️ How to Import and Run in Android Studio

1. Open **Android Studio** (Hedgehog / Iguana / Jellyfish / Koala or newer).
2. Click **File > Open** (or **Open an Existing Project** on the Welcome screen).
3. Browse to:
   ```
   c:\Users\ANIKET SACHAN\Codes\Athloboard\android-app
   ```
4. Click **OK**. Android Studio will automatically resolve Gradle dependencies (`gradle/libs.versions.toml`).
5. Select your target Android Emulator or physical device (Android 7.0+ / API 24+).
6. Click the green **Run (▶)** button or press `Shift + F10`.

---

## 📦 Package Hierarchy

```
com.athloboard.app/
├── MainActivity.kt
├── data/
│   ├── models/
│   │   ├── Athlete.kt
│   │   └── Models.kt (Gym, LiftSubmission, Competition, Product)
│   └── AthloRepository.kt
├── ui/
│   ├── adapters/
│   │   ├── LeaderboardAdapter.kt
│   │   └── CompetitionsAdapter.kt
│   ├── profile/AthleteProfileFragment.kt
│   ├── recorder/LiftRecorderFragment.kt
│   ├── leaderboard/LeaderboardFragment.kt
│   ├── competitions/CompetitionsFragment.kt
│   └── gym/GymPortalFragment.kt
```

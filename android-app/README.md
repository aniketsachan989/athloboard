# Athloboard Android App (Native Kotlin Project)

This is the native Android application for **Athloboard**, built using **Kotlin**, **Android Jetpack**, **CameraX**, and **Supabase Cloud PostgreSQL** connection.

---

## 📱 Features Included

1. **Athlete Profile & Digital PR Card**:
   - Displays real-time Squat, Bench Press, Deadlift, and Total (SBD) numbers.
   - National rank badge (#1) and verified competition status synced from Supabase table `athlete_profiles`.
2. **Camera Lift Recording Studio (`LiftRecorderFragment`)**:
   - Parallel Squat Depth threshold guide overlay.
   - Live 3-2-1 countdown timer and live recording clock.
   - Direct submission trigger into Supabase table `lift_submissions` for Super Admin verification.
3. **Official National Leaderboard (`LeaderboardFragment`)**:
   - Live rankings query from Supabase PostgREST endpoint with weight class filters.
4. **Sanctioned Competitions Hub (`CompetitionsFragment`)**:
   - Browse upcoming national and city-level meets, prize pools, and 1-tap entry synced with table `competitions`.
5. **Gym Portal View (`GymPortalFragment`)**:
   - Live verified gym equipment specs: **4,500 KG Plates**, **1,800 KG Dumbbells**, **6 Male / 4 Female trainer counts** (informational only), and member promotions.

---

## ⚡ Supabase Cloud Integration

The Android app communicates with your Supabase backend using the `com.athloboard.app.data.supabase` package:
- **Supabase Host**: `https://xonuqhgxiswmwllqnpdx.supabase.co`
- **PostgreSQL Database**: `db.xonuqhgxiswmwllqnpdx.supabase.co:5432/postgres`
- **PostgREST REST API**: `https://xonuqhgxiswmwllqnpdx.supabase.co/rest/v1`
- **Endpoints Connected**:
  - `GET /rest/v1/athlete_profiles` (Athlete SBD numbers & rankings)
  - `GET /rest/v1/gyms` (Audited equipment specs)
  - `GET /rest/v1/competitions` (Sanctioned meets)
  - `POST /rest/v1/lift_submissions` (CameraX lift video submissions)

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
│   ├── supabase/
│   │   ├── SupabaseConfig.kt
│   │   ├── SupabaseModels.kt
│   │   └── SupabaseClient.kt
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

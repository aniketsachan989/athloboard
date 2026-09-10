# ⚡ ATHLOBOARD — Unified Athletic Strength Ecosystem
### Smart India Hackathon (SIH) — Verified Powerlifting, Facility Auditing, AI Refereeing & Multi-Surface Platform

[![Next.js 14](https://img.shields.io/badge/Next.js-14.1-black?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.3-E0234E?logo=nestjs)](https://nestjs.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Android](https://img.shields.io/badge/Android-Jetpack%20Compose-3DDC84?logo=android)](https://developer.android.com/jetpack/compose)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Cloudflare R2](https://img.shields.io/badge/Cloudflare-R2%20Storage-F38020?logo=cloudflare)](https://developers.cloudflare.com/r2/)

Athloboard is India’s federated athletic strength and fitness ecosystem. It bridges athletes, gym facilities, fitness brands, and sanctioned competition meets into a unified, tamper-proof network powered by **AI Biomechanical Computer Vision**, **IPF 3-Judge Referee Verification**, and **Dual-Trust Marketplace Filtering**.

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph ClientSurfaces ["Client Surfaces"]
        App["📱 Athlete Mobile App<br/>(Android / Kotlin / Jetpack Compose)"]
        Web["💻 Platform Website<br/>(Next.js 14 / Three.js 3D Barbell)"]
        Admin["🛡️ Admin Console<br/>(Next.js 14 / 3-Judge Referee Studio)"]
    end

    subgraph CoreServices ["Backend & Intelligence Layer"]
        Gateway["⚡ Central Gateway (:4000)<br/>(NestJS / AuthGuards / Points Ledger)"]
        AIService["🤖 AI Vision Microservice (:8000)<br/>(FastAPI / OpenCV Kinematics / Motion Energy)"]
        R2["☁️ Cloudflare R2 Storage<br/>(Direct Presigned SigV4 Streaming)"]
        DB[("🗄️ PostgreSQL Master DB<br/>(19 Relational Tables / UUIDs)")]
    end

    App -->|Streaming PUT (Zero OOM)| R2
    Web -->|Streaming PUT| R2
    App -->|Submit Lift Set / PR| Gateway
    Web -->|Explore Gyms & Marketplace| Gateway
    Admin -->|Referee Rulings / KYC Verifications| Gateway

    Gateway -->|Invoke Kinematic Verification| AIService
    AIService -->|Frame Analysis & Thresholds| R2
    Gateway -->|Append-Only Points Ledger (+100)| DB
    Gateway -->|Enforce Dual-Trust Verification| DB
```

---

## 🌟 The 5 Pillars of Athloboard

### 1. 🤖 AI Biomechanical Computer Vision (`ai-service/`)
- **Microservice**: FastAPI + OpenCV running on port `8000`.
- **IPF Rule Kinematics**:
  - **Squat**: Audits hip crease sub-parallel to top of knee ($\ge 90^\circ$).
  - **Bench Press**: Detects motionless bar pause on chest.
  - **Deadlift**: Verifies complete hip extension and knee lockout.
- **Cheating & Corruption Prevention**: Rejects corrupted, static, or truncated video streams rather than false-passing.
- **Dynamic Scoring**: Emits real confidence, duration, and rep counts.

### 2. ⚡ Central API Gateway & Points Ledger (`backend/`)
- **Backend Framework**: NestJS 10 running on port `4000`.
- **Append-Only Points Ledger**: Verified PR lifts automatically credit $+100$ Lift Points to `lift_points_ledger`, syncing `athlete_profiles.total_lift_points`.
- **Resilient Offline Demo Engine**: When cloud database connections are unavailable during live demonstrations, the gateway serves offline fallback seed data to prevent 500 errors.
- **Security**: Strict `FirebaseAuthGuard` protecting R2 media endpoints, lift submissions, and administrative actions.

### 3. 🛡️ Admin Verification Cockpit & Referee Studio (`admin/`)
- **Portal**: Next.js 14 running on port `3001`.
- **3-Judge Referee Studio**:
  - Independent clickable lights for Head Judge, Left Judge, and Right Judge.
  - Ratify National Records (+100 Pts) or issue Red Light disqualifications with specific technical violation reasons.
  - HTML5 video playback rate synchronizer (0.25x slow-mo analysis).
- **Queues**: Real-time queues for Lift Videos, Facility Audits, Brand KYC, Product Lab Reviews, Athletes Directory, and Revenue Analytics.

### 4. 💻 Athlete & Business Web Portal (`src/`)
- **Website**: Next.js 14 running on port `3000`.
- **3D Hero Experience**: Interactive procedural Olympic Barbell with 450 GPU-instanced chalk particles and cursor parallax.
- **Audited Gym Radar (`/gyms`)**: Searchable directory of IPF-certified gyms with verified calibrated plate breakdowns (Bullrock/Eleiko) and dumbbell ranges.
- **Lab-Tested Marketplace (`/marketplace`)**: 100% HPLC verified sports nutrition and powerlifting equipment.
- **Brand & Gym Onboarding (`/for-brands`, `/for-gyms`)**: Facility audit specifications and corporate partnership inquiry portals.

### 5. 📱 Athlete Mobile Application (`android-app/`)
- **Native Android**: Kotlin + Jetpack Compose with Material 3 Dark Theme.
- **Zero-OOM Video Streaming**: Direct disk-to-cloud streaming (`RequestBody.asRequestBody()`) using presigned R2 URLs.
- **CameraX Lifecycle Safety**: Automatic unbinding and resource disposal upon navigation.
- **Robust Auth**: Complete integration with Firebase Authentication and strict error handling.

---

## 🗄️ Database Schema (`athloboard_schema.sql`)

Athloboard follows a single, normalized relational architecture across **19 tables**:
- `users`: Core identity anchor linking Firebase UIDs.
- `athlete_profiles`: Weight class, PR total, current streak, lift points balance.
- `gyms`: Certified facility specifications (calibrated plate weight, dumbbells, platforms, racks).
- `membership_plans`, `promotions`, `leads`, `gym_reviews`: Gym operations & discovery.
- `vendors`, `brands`, `products`: Dual-verification trust marketplace.
- `lift_sessions`, `lift_sets`: Complete exercise telemetry, video URLs, and AI confidence.
- `lift_points_ledger`: Immutable append-only earn/spend transaction ledger.
- `competitions`, `competition_registrations`, `competition_results`: Sanctioned powerlifting meets.
- `posts`, `notifications`, `admin_audit_log`: Community engagement and administrative audit trail.

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js**: v18.17+ or v20+
- **Python**: 3.10+
- **Android Studio**: Iguana (2023.2.1+) or newer (for mobile app)

---

### 1. Start the NestJS Backend Gateway
```bash
cd backend
npm install
npm run start:prod
# API running on http://localhost:4000
# Swagger Docs available at http://localhost:4000/api/docs
```

---

### 2. Start the AI Computer Vision Microservice
```bash
cd ai-service
pip install -r requirements.txt
python main.py
# AI Microservice running on http://localhost:8000
# Health check: http://localhost:8000/health
```

---

### 3. Start the Admin Console
```bash
cd admin
npm install
npm run dev
# Admin Console live at http://localhost:3001
```

---

### 4. Start the Main Web Portal
```bash
# In repository root
npm install
npm run dev
# Platform Website live at http://localhost:3000
```

---

### 5. Run the Android Mobile App
1. Open the `android-app/` directory in **Android Studio**.
2. Sync Gradle dependencies.
3. Select an emulator or physical Android device.
4. Click **Run** (`Shift + F10`).

---

## 🔐 Environment Variables

Templates with placeholder variables are provided across all services:
- **Backend**: `backend/.env.example`
- **Admin**: `admin/.env.example`
- **AI Service**: `ai-service/.env.example`
- **Website**: `.env.example`

---

## 📄 License
Developed for the **Smart India Hackathon (SIH)**. All rights reserved by Athloboard Team.

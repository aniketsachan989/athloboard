# ⚡ ATHLOBOARD — Verified Fitness & Strength Ecosystem

Athloboard is India's verified-identity powerlifting, gym facility auditing, and sports nutrition ecosystem.

---

## 🏛️ Ecosystem Architecture

### 1. 🌐 Modern Web Platform (`/website`)
- **Framework**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons
- **3D Hero Scene**: Procedural 3D Olympic Barbell with 450 GPU chalk particles & mouse parallax (Three.js / React Three Fiber)
- **Pages**:
  - `/` — Full-Screen 3D Hero, Ecosystem Metrics & 4-Pillar Overview
  - `/gyms` — Audited Gym Directory with calibrated plate specs
  - `/marketplace` — Lab-Tested Supplements & Verified Brands
  - `/for-gyms` — Gym Partner Onboarding & Guidelines
  - `/for-brands` — Sponsor Portal & Product Listings
  - `/dashboard/gym` — Partner Cockpit with equipment inventory & member passes

### 2. 👑 Super Admin HQ Console (`/admin`)
- **Framework**: Next.js 14, Recharts Analytics, Tailwind CSS
- **Workspaces**:
  1. Verification Cockpit (Lifts, Gyms Phase 1 & 2, Brands KYC, Products)
  2. 3-Judge Video Referee Studio (3-light system, slow-mo review, points award)
  3. Athletes Roster (IPF division breakdown, verified totals)
  4. Moderation & Dispute Queue
  5. Revenue & GMV Analytics (Interactive area & bar charts)
  6. Audit Trail Logs
  7. Platform Governance & Anti-Cheating Settings

### 3. 📱 Native Android App (`/android-app`)
- **Framework**: Jetpack Compose, Kotlin, CameraX, Firebase Auth, Material 3
- **Features**:
  - Instagram-style 4-step athlete onboarding wizard with live `@handle` uniqueness check
  - GUI DatePicker for Date of Birth with automated IPF category calculation
  - Structured address breakdown with searchable Indian city autocomplete
  - CameraX video audit recording for lifts
  - Gym GPS exact location capture with fallback skip flow & persistent dashboard reminders
  - SBD Total tracking and IPF competition weight classes

### 4. ⚙️ Backend API & Database (`/backend` & `athloboard_schema.sql`)
- **Backend**: NestJS, TypeScript, Swagger API Docs (`/api/docs`), Firebase Admin SDK
- **Database**: PostgreSQL / Supabase schema for athletes, gyms, lifts, products, orders, and audit logs.

---

## 🚀 Quickstart

### Main Website:
```bash
cd website
npm install
npm run dev
# Open http://localhost:3000
```

### Admin Console:
```bash
cd admin
npm install
npm run dev -- -p 3001
# Open http://localhost:3001
```

### Backend API:
```bash
cd backend
npm install
npm run start:dev
# API: http://localhost:4000 | Swagger Docs: http://localhost:4000/api/docs
```

### Android App:
Open the `android-app` folder in Android Studio and run on emulator or physical device.


# ⚡ Athloboard — Athletic Tech & Strength Ecosystem

Official web and mobile platform for verified gym facility audits, laboratory-tested sports nutrition, national powerlifting rankings, and sanctioned championships.

---

## 🏛️ Ecosystem Surfaces

1. **🌐 Common Web Portal (`website-common/`)**:
   - **Verified Gyms Directory**: Audited Phase 1 & 2 equipment capacities (total plate kg, dumbbell kg, trainer counts, certified photos).
   - **Lab-Tested Marketplace**: 100% HPLC verified supplement store.
   - **National SBD Leaderboards**: Video-refereed Squat, Bench Press, and Deadlift rankings.
   - **Championships & Meets**: Sanctioned powerlifting and strength competition registration.
   - **GPS City Radar Map**: Interactive geolocation map of verified gyms and local supplement shops.
   - **Partner Dashboards**: Dedicated management consoles for Gym Owners, Brands, and Local Vendors.

2. **🛡️ Super Admin Gatekeeper HQ (`website-admin/`)**:
   - Slow-motion video lift refereeing studio.
   - Gym Phase 1 & 2 KYC and equipment audits.
   - Brand & Vendor unique GSTIN validation and credential dispatch.
   - Per-product SKU lab testing and 2-strike repeat-offender ban engine.
   - Revenue analytics and commercial escrow settlement ledger.

3. **📱 Standalone Native Android App (`android-app/`)**:
   - Native Kotlin + Jetpack Compose app for athletes.
   - CameraX Parallel Squat Depth Recording HUD with live referee overlay.
   - Digital Verified SBD PR Card with dynamic sharing.

---

## 🚀 Quickstart

Run a local server from the root directory:
```bash
python -m http.server 8080
```

- **Master Gateway**: `http://localhost:8080/index.html`
- **Common Portal**: `http://localhost:8080/website-common/index.html`
- **Super Admin HQ**: `http://localhost:8080/website-admin/index.html`

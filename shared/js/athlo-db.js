/**
 * ATHLOBOARD / ATHLOBOARD MASTER REACTIVE DATABASE ENGINE
 * Unified Backend Client & State Store for:
 *   1. Athloboard (Native Android App for Athletes & Gym Owners)
 *   2. Athloboard Business Website (Gym, Brand & Vendor Enrollment/Portal)
 *   3. Athloboard Admin Website (KYC, Product Review, Video Referee, Moderation)
 *
 * Implements Master Specification Rules:
 *   - Rule 1: No Trainer role (trainer count is descriptive male/female split in Gym Phase 2)
 *   - Rule 2: Athlete registration happens ONLY inside Athloboard App
 *   - Rule 3: Role locked per session (active_role in session token)
 *   - Rule 4: Two-step approval for products (business approval & per-product approval)
 *   - Rule 5: GSTIN mandatory & UNIQUE for Vendor/Brand (prevents banned re-registration)
 *   - Rule 6: Rejection flow with email reason + resubmit prompt
 *   - Rule 7: Product edits reset listing status to pending
 *   - Rule 8: Athlete signups are read-only in Admin (phone OTP verified in app)
 *   - Rule 9: Repeat offender ban rule (2 product rejections = business banned)
 *   - Rule 10: Duplicate prevention via UNIQUE constraints on phone, email, and GSTIN
 */

(function(window) {
  const DB_KEY = 'ATHLOBOARD_MASTER_DB_V2';

  // Master Initial Seed Data
  const INITIAL_DB = {
    // 1. Athletes (Registered strictly in Athloboard App with lightweight Phone-OTP)
    athletes: [
      {
        id: 'ATH-9081',
        uniqueAthleteId: 'ATH9081IN',
        name: 'Kabir Rawat',
        email: 'kabir.rawat@fitmail.com',
        phone: '+91 98765 43210',
        dob: '1998-04-15',
        gender: 'Male',
        hasGymExp: true,
        gymName: 'Titan Iron & Fitness Club',
        expYears: '4 Years',
        preferredGym: '',
        preferredArea: 'South City, Mumbai',
        avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&q=80',
        otpVerified: true,
        prSquat: 225,
        prBench: 155,
        prDeadlift: 260,
        total: 640,
        rank: 1,
        weightClass: '83kg',
        badge: 'ELITE PRO'
      },
      {
        id: 'ATH-7724',
        uniqueAthleteId: 'ATH7724IN',
        name: 'Aanya Sharma',
        email: 'aanya.power@athletemail.com',
        phone: '+91 98112 34567',
        dob: '2000-08-22',
        gender: 'Female',
        hasGymExp: true,
        gymName: 'Olympus Strength Arena',
        expYears: '3 Years',
        preferredGym: '',
        preferredArea: 'Sector 29, Gurugram',
        avatar: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&q=80',
        otpVerified: true,
        prSquat: 160,
        prBench: 95,
        prDeadlift: 190,
        total: 445,
        rank: 2,
        weightClass: '63kg',
        badge: 'CHAMPION'
      },
      {
        id: 'ATH-3392',
        uniqueAthleteId: 'ATH3392IN',
        name: 'Rohan Deshmukh',
        email: 'rohan.d@gmail.com',
        phone: '+91 97654 32198',
        dob: '1999-11-05',
        gender: 'Male',
        hasGymExp: false,
        gymName: '',
        expYears: '',
        preferredGym: 'Iron Haven Gym',
        preferredArea: 'Koregaon Park, Pune',
        avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=300&q=80',
        otpVerified: true,
        prSquat: 180,
        prBench: 130,
        prDeadlift: 210,
        total: 520,
        rank: 5,
        weightClass: '74kg',
        badge: 'RISING STAR'
      }
    ],

    // 2. Gyms (Phase 1 Basic & Phase 2 Equipment Audits)
    gyms: [
      {
        id: 'GYM-101',
        gymName: 'Titan Iron & Fitness Club',
        ownerName: 'Vikramaditya Rathore',
        gymContact: '+91 22 2847 9901',
        ownerContact: '+91 99201 88442',
        gymEmail: 'contact@titanironfitness.in',
        gymType: 'unisex',
        location: 'Level 3, Infinity Tech Park, Andheri West, Mumbai',
        landmark: 'Near Metro Pillar 142',
        lat: 19.1363,
        lng: 72.8277,
        plateWeightKg: 4500,
        dumbbellWeightKg: 1800,
        trainerMaleCount: 6,
        trainerFemaleCount: 4,
        openTime: '05:30 AM',
        closeTime: '11:00 PM',
        operationalDays: 'Monday - Sunday',
        chargesMonthly: 3500,
        chargesQuarterly: 9000,
        chargesYearly: 28000,
        pricingPeriod: 'monthly',
        photos: [
          'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80',
          'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
          'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80'
        ],
        status: 'APPROVED', // APPROVED, PENDING, REJECTED
        rejectionCount: 0,
        rejectionReason: null,
        isBanned: false,
        submittedAt: '2026-08-10',
        verifiedAt: '2026-08-11',
        adminNote: 'Top-tier IPF certified calibrated steel plates and competition power cages approved.',
        rating: 4.9,
        reviewsCount: 142,
        promotions: [
          { title: 'Monsoon Strength Challenge Pass', discount: '20% OFF', validTill: '2026-09-30' }
        ],
        membersCount: 380
      },
      {
        id: 'GYM-102',
        gymName: 'Olympus Strength Arena',
        ownerName: 'Devender Rawal',
        gymContact: '+91 124 4059 881',
        ownerContact: '+91 98110 55221',
        gymEmail: 'info@olympusarena.com',
        gymType: 'unisex',
        location: 'Plot 45, Sector 29 Commercial Hub, Gurugram',
        landmark: 'Opposite Leisure Valley Gate 2',
        lat: 28.4682,
        lng: 77.0632,
        plateWeightKg: 6200,
        dumbbellWeightKg: 2400,
        trainerMaleCount: 8,
        trainerFemaleCount: 5,
        openTime: '05:00 AM',
        closeTime: '11:30 PM',
        operationalDays: 'Monday - Sunday',
        chargesMonthly: 4200,
        chargesQuarterly: 11000,
        chargesYearly: 34000,
        pricingPeriod: 'monthly',
        photos: [
          'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80',
          'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600&q=80'
        ],
        status: 'APPROVED',
        rejectionCount: 0,
        rejectionReason: null,
        isBanned: false,
        submittedAt: '2026-08-14',
        verifiedAt: '2026-08-15',
        adminNote: 'Calibrated steel plates and competition power cages approved.',
        rating: 4.8,
        reviewsCount: 98,
        promotions: [
          { title: 'Annual Athlete Sponsorship Tier', discount: 'Flat 5000 Cashback', validTill: '2026-10-15' }
        ],
        membersCount: 420
      },
      {
        id: 'GYM-103',
        gymName: 'Spartan Underground Gym',
        ownerName: 'Jaspreet Sandhu',
        gymContact: '+91 172 2601 229',
        ownerContact: '+91 98722 10099',
        gymEmail: 'spartan.chd@powergym.com',
        gymType: 'separate',
        location: 'SCO 112-113, Sector 34A, Chandigarh',
        landmark: 'Near Piccadily Square',
        lat: 30.7225,
        lng: 76.7684,
        plateWeightKg: 3800,
        dumbbellWeightKg: 1500,
        trainerMaleCount: 4,
        trainerFemaleCount: 3,
        openTime: '06:00 AM',
        closeTime: '10:30 PM',
        operationalDays: 'Monday - Saturday',
        chargesMonthly: 2800,
        chargesQuarterly: 7500,
        chargesYearly: 22000,
        pricingPeriod: 'monthly',
        photos: [
          'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80'
        ],
        status: 'PENDING',
        rejectionCount: 0,
        rejectionReason: null,
        isBanned: false,
        submittedAt: '2026-08-25',
        verifiedAt: null,
        adminNote: 'Awaiting GST invoice verification for calibrated plates.',
        rating: 4.6,
        reviewsCount: 34,
        promotions: [],
        membersCount: 190
      }
    ],

    // 3. Local Vendors (GSTIN Mandatory & Unique)
    vendors: [
      {
        id: 'VND-501',
        shopName: 'Apex Sports Nutrition & Supplements',
        ownerName: 'Gaurav Kulkarni',
        website: 'https://apexnutrition.in',
        ownerPhone: '+91 98220 99441',
        email: 'sales@apexnutrition.in',
        gstin: '27AAECG8891P1ZX',
        shopLocation: 'Shop 12, Phoenix Marketcity Arcade, Kurla, Mumbai',
        landmark: 'Lower Ground Level, Near Central Atrium',
        status: 'APPROVED',
        rejectionCount: 0,
        rejectionReason: null,
        isBanned: false,
        inventoryCount: 45
      },
      {
        id: 'VND-502',
        shopName: 'PureFuel Nutrition Store',
        ownerName: 'Sunil Aggarwal',
        website: 'https://purefueldelhi.com',
        ownerPhone: '+91 98101 22998',
        email: 'purefuel.delhi@gmail.com',
        gstin: '07AAKCS4420M1ZY',
        shopLocation: 'Main Market, Block C, Preet Vihar, Delhi',
        landmark: 'Opposite Pillar 104',
        status: 'PENDING',
        rejectionCount: 0,
        rejectionReason: null,
        isBanned: false,
        inventoryCount: 18
      }
    ],

    // 4. Brands (GSTIN Mandatory & Unique)
    brands: [
      {
        id: 'BRD-301',
        brandName: 'VORTEX NUTRITION LABS',
        websiteUrl: 'https://vortexnutrition.com',
        connectedGym: 'Titan Iron & Fitness Club (Mumbai)',
        email: 'partnerships@vortexnutrition.com',
        gstin: '29ABCDE1234F1Z5',
        status: 'APPROVED',
        rejectionCount: 0,
        rejectionReason: null,
        isBanned: false,
        submittedAt: '2026-08-01',
        verifiedAt: '2026-08-03',
        generatedCredentials: {
          username: 'brand_vortex',
          password: 'Athlo#Secure890'
        },
        productsCount: 6
      },
      {
        id: 'BRD-302',
        brandName: 'KINETIC PERFORMANCE GEAR',
        websiteUrl: 'https://kineticgear.fit',
        connectedGym: 'Olympus Strength Arena (Gurugram)',
        email: 'supply@kineticgear.fit',
        gstin: '06XYZAB9876G2Z9',
        status: 'APPROVED',
        rejectionCount: 0,
        rejectionReason: null,
        isBanned: false,
        submittedAt: '2026-08-12',
        verifiedAt: '2026-08-14',
        generatedCredentials: {
          username: 'brand_kinetic',
          password: 'Athlo#Power321'
        },
        productsCount: 4
      },
      {
        id: 'BRD-303',
        brandName: 'RAW FORGE APPAREL & LABS',
        websiteUrl: 'https://rawforgelabs.in',
        connectedGym: 'None (Direct Online)',
        email: 'contact@rawforgelabs.in',
        gstin: '03KLMNO5432H1Z1',
        status: 'PENDING',
        rejectionCount: 0,
        rejectionReason: null,
        isBanned: false,
        submittedAt: '2026-08-26',
        verifiedAt: null,
        generatedCredentials: null,
        productsCount: 1
      }
    ],

    // 5. Products (Two-Step Gate: Per-Product Admin Approval & Repeat-Offender Ban Rule)
    products: [
      {
        id: 'PRD-1001',
        ownerType: 'brand',
        ownerId: 'BRD-301',
        ownerName: 'VORTEX NUTRITION LABS',
        category: 'Protein',
        name: 'Vortex ISO-Pure 100% Whey Isolate',
        weight: '2.0 kg',
        servings: 66,
        price: 5499,
        stock: 140,
        photos: [
          'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&q=80',
          'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500&q=80'
        ],
        status: 'APPROVED', // APPROVED, PENDING, REJECTED
        labTested: true,
        rejectionReason: null,
        lastEditedAt: null,
        rating: 4.9,
        description: 'Ultra-filtered cold-processed whey isolate. HPLC lab certified with 27g protein per scoop and zero amino spiking.'
      },
      {
        id: 'PRD-1002',
        ownerType: 'brand',
        ownerId: 'BRD-301',
        ownerName: 'VORTEX NUTRITION LABS',
        category: 'Creatine',
        name: 'Vortex Creapure Micronized Creatine Monohydrate',
        weight: '300 g',
        servings: 100,
        price: 1199,
        stock: 220,
        photos: [
          'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&q=80'
        ],
        status: 'APPROVED',
        labTested: true,
        rejectionReason: null,
        lastEditedAt: null,
        rating: 4.85,
        description: '100% German Creapure pharmaceutical grade creatine. HPLC certified 99.9% purity.'
      },
      {
        id: 'PRD-1003',
        ownerType: 'vendor',
        ownerId: 'VND-501',
        ownerName: 'Apex Sports Nutrition',
        category: 'Pre-Workout',
        name: 'HyperDrive Explosive Pre-Workout Matrix',
        weight: '400 g',
        servings: 40,
        price: 2499,
        stock: 45,
        photos: [
          'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=500&q=80'
        ],
        status: 'APPROVED',
        labTested: true,
        rejectionReason: null,
        lastEditedAt: null,
        rating: 4.7,
        description: 'High-stimulant pre-workout formula with 6g L-Citrulline, 3.2g Beta-Alanine, and 350mg Caffeine Anhydrous.'
      },
      {
        id: 'PRD-1004',
        ownerType: 'brand',
        ownerId: 'BRD-302',
        ownerName: 'KINETIC PERFORMANCE GEAR',
        category: 'Gear',
        name: 'Kinetic Heavy-Duty 13mm Lever Powerlifting Belt',
        weight: '1.4 kg',
        servings: 1,
        price: 4999,
        stock: 80,
        photos: [
          'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?w=500&q=80',
          'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=500&q=80'
        ],
        status: 'APPROVED',
        labTested: true,
        rejectionReason: null,
        lastEditedAt: null,
        rating: 4.95,
        description: 'Genuine vegetable tanned leather with alloy steel precision lever mechanism. IPF technical specs compliant.'
      },
      {
        id: 'PRD-1005',
        ownerType: 'brand',
        ownerId: 'BRD-303',
        ownerName: 'RAW FORGE APPAREL & LABS',
        category: 'Protein',
        name: 'Raw Forge Hydro Whey Hydrolyzed Protein',
        weight: '1.8 kg',
        servings: 55,
        price: 4799,
        stock: 60,
        photos: [
          'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500&q=80'
        ],
        status: 'PENDING',
        labTested: false,
        rejectionReason: null,
        lastEditedAt: null,
        rating: 0,
        description: 'Hydrolyzed whey formulation submitted for Admin Certificate check.'
      }
    ],

    // 6. Lift Submissions (MediaPipe Video Refereeing)
    lifts: [
      {
        id: 'LFT-8801',
        athleteId: 'ATH-9081',
        athleteName: 'Kabir Rawat',
        liftType: 'Deadlift',
        claimedWeight: 260,
        reps: 1,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        videoThumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80',
        submissionDate: '2026-08-20',
        status: 'APPROVED',
        depthValid: true,
        lockoutValid: true,
        adminFeedback: 'Clean conventional lockout, no hitching detected. Approved for official leaderboard.',
        reviewerName: 'Admin Supreme (IPC Judge)',
        verifiedDate: '2026-08-21'
      },
      {
        id: 'LFT-8802',
        athleteId: 'ATH-7724',
        athleteName: 'Aanya Sharma',
        liftType: 'Squat',
        claimedWeight: 160,
        reps: 1,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        videoThumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&q=80',
        submissionDate: '2026-08-22',
        status: 'APPROVED',
        depthValid: true,
        lockoutValid: true,
        adminFeedback: 'Hip crease clearly below top of knee. Flawless depth and control.',
        reviewerName: 'Admin Supreme (IPC Judge)',
        verifiedDate: '2026-08-23'
      },
      {
        id: 'LFT-8803',
        athleteId: 'ATH-3392',
        athleteName: 'Rohan Deshmukh',
        liftType: 'Bench Press',
        claimedWeight: 130,
        reps: 1,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        videoThumbnail: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&q=80',
        submissionDate: '2026-08-27',
        status: 'PENDING',
        depthValid: null,
        lockoutValid: null,
        adminFeedback: 'In queue for pause verification on chest.',
        reviewerName: null,
        verifiedDate: null
      }
    ],

    // 7. Sanctioned Competitions
    competitions: [
      {
        id: 'CMP-201',
        title: 'Athloboard National Raw Powerlifting Cup 2026',
        category: 'Powerlifting (SBD)',
        date: '2026-10-18',
        time: '08:00 AM IST',
        venue: 'Thyagaraj Indoor Sports Complex, New Delhi',
        city: 'New Delhi',
        prizePool: '₹ 5,00,000',
        entryFee: 1500,
        verifiedRules: 'Raw without knee wraps, IPF Technical Rulebook',
        status: 'UPCOMING',
        registeredAthletesCount: 148,
        banner: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80'
      },
      {
        id: 'CMP-202',
        title: 'Maharashtra State Bench Press Championship',
        category: 'Bench Press Only',
        date: '2026-11-05',
        time: '09:30 AM IST',
        venue: 'Balewadi Sports Complex, Pune',
        city: 'Pune',
        prizePool: '₹ 2,50,000',
        entryFee: 1000,
        verifiedRules: 'IPF rules, 1-second pause on chest mandatory',
        status: 'UPCOMING',
        registeredAthletesCount: 92,
        banner: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80'
      }
    ],

    // 8. Gym Review Reports (Moderation Queue)
    reviewReports: [
      {
        id: 'REP-701',
        reviewId: 'REV-902',
        gymId: 'GYM-101',
        gymName: 'Titan Iron & Fitness Club',
        reportedBy: 'user_devender@gmail.com',
        reason: 'Competitor gym spamming false claims about equipment availability.',
        status: 'PENDING',
        submittedAt: '2026-08-26'
      }
    ],

    // 9. Auth Session Token State (Rule 3: Role-Locked Session)
    currentSession: null,

    // 10. Audit Email Dispatches (Rule 6: Email with rejection reason + resubmit prompt)
    emailDispatches: []
  };

  class AthloboardDB {
    constructor() {
      this.init();
    }

    init() {
      if (!localStorage.getItem(DB_KEY)) {
        localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_DB));
      }
    }

    get() {
      try {
        const raw = localStorage.getItem(DB_KEY);
        return raw ? JSON.parse(raw) : INITIAL_DB;
      } catch (e) {
        console.error('Error parsing Athloboard DB from localStorage', e);
        return INITIAL_DB;
      }
    }

    save(data) {
      try {
        localStorage.setItem(DB_KEY, JSON.stringify(data));
        window.dispatchEvent(new CustomEvent('athloboard-db-updated', { detail: data }));
        window.dispatchEvent(new CustomEvent('athlo-db-updated', { detail: data }));
      } catch (e) {
        console.error('Error saving Athloboard DB to localStorage', e);
      }
    }

    // ==================== AUTH & SESSION (RULE 3: ROLE LOCKED) ====================
    login(email, password, role) {
      const db = this.get();
      // Find business or admin user
      let matchedEntity = null;

      if (role === 'gym_owner') {
        matchedEntity = db.gyms.find(g => g.gymEmail.toLowerCase() === email.toLowerCase());
      } else if (role === 'brand_owner') {
        matchedEntity = db.brands.find(b => b.email.toLowerCase() === email.toLowerCase());
      } else if (role === 'vendor_owner') {
        matchedEntity = db.vendors.find(v => v.email.toLowerCase() === email.toLowerCase());
      } else if (role === 'super_admin') {
        if (email === 'admin@athloboard.internal' || email === 'admin@athloboard.com') {
          matchedEntity = { id: 'ADMIN-001', name: 'Super Admin Gatekeeper', role: 'super_admin' };
        }
      }

      if (!matchedEntity) {
        return { success: false, message: `No registered account found for role [${role}].` };
      }

      if (matchedEntity.isBanned) {
        return { success: false, message: 'This business account has been permanently banned due to repeat product rejections (GSTIN locked).' };
      }

      // Create role-locked session
      const session = {
        userId: matchedEntity.id,
        entityName: matchedEntity.gymName || matchedEntity.brandName || matchedEntity.shopName || matchedEntity.name,
        activeRole: role,
        token: 'JWT_' + Math.random().toString(36).substring(2) + '_' + Date.now(),
        loginTime: new Date().toISOString()
      };

      db.currentSession = session;
      this.save(db);
      return { success: true, session };
    }

    logout() {
      const db = this.get();
      db.currentSession = null;
      this.save(db);
      return true;
    }

    getCurrentSession() {
      return this.get().currentSession;
    }

    // ==================== GYM ENROLLMENT (2 PHASES) ====================
    registerGym(phase1, phase2) {
      const db = this.get();

      // Check unique constraints (Rule 10)
      if (db.gyms.some(g => g.gymEmail.toLowerCase() === phase1.gymEmail.toLowerCase())) {
        return { success: false, message: 'Gym email is already registered.' };
      }

      const newId = 'GYM-' + Math.floor(100 + Math.random() * 900);
      const gym = {
        id: newId,
        gymName: phase1.gymName,
        ownerName: phase1.ownerName,
        gymContact: phase1.gymContact,
        ownerContact: phase1.ownerContact,
        gymEmail: phase1.gymEmail,
        gymType: phase1.gymType || 'unisex',
        location: phase1.location,
        landmark: phase1.landmark,
        lat: parseFloat(phase1.lat) || 19.0760,
        lng: parseFloat(phase1.lng) || 72.8777,
        // Phase 2 Details
        plateWeightKg: parseFloat(phase2.plateWeightKg) || 0,
        dumbbellWeightKg: parseFloat(phase2.dumbbellWeightKg) || 0,
        trainerMaleCount: parseInt(phase2.trainerMaleCount) || 0, // Info only (Rule 1)
        trainerFemaleCount: parseInt(phase2.trainerFemaleCount) || 0, // Info only (Rule 1)
        openTime: phase2.openTime || '06:00 AM',
        closeTime: phase2.closeTime || '10:00 PM',
        operationalDays: phase2.operationalDays || 'Monday - Saturday',
        chargesMonthly: parseFloat(phase2.chargesMonthly) || 0,
        chargesQuarterly: parseFloat(phase2.chargesQuarterly) || 0,
        chargesYearly: parseFloat(phase2.chargesYearly) || 0,
        pricingPeriod: phase2.pricingPeriod || 'monthly',
        photos: phase2.photos && phase2.photos.length > 0 ? phase2.photos : [
          'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80'
        ],
        status: 'PENDING',
        rejectionCount: 0,
        rejectionReason: null,
        isBanned: false,
        submittedAt: new Date().toISOString().split('T')[0],
        verifiedAt: null,
        adminNote: 'Facility enrollment submitted. Pending Admin verification of equipment & KYC.',
        rating: 5.0,
        reviewsCount: 0,
        promotions: [],
        membersCount: 0
      };

      db.gyms.push(gym);
      this.save(db);
      return { success: true, gym };
    }

    // ==================== VENDOR ENROLLMENT (RULE 5: GSTIN UNIQUE) ====================
    registerVendor(data) {
      const db = this.get();

      // GSTIN Unique check
      const normalizedGstin = (data.gstin || '').trim().toUpperCase();
      if (db.vendors.some(v => v.gstin === normalizedGstin)) {
        return { success: false, message: 'This GSTIN is already registered. Duplicate or banned business registration is blocked.' };
      }

      if (db.vendors.some(v => v.email.toLowerCase() === data.email.toLowerCase())) {
        return { success: false, message: 'Email address is already registered.' };
      }

      const newId = 'VND-' + Math.floor(100 + Math.random() * 900);
      const vendor = {
        id: newId,
        shopName: data.shopName,
        ownerName: data.ownerName,
        website: data.website || '',
        ownerPhone: data.ownerPhone,
        email: data.email,
        gstin: normalizedGstin,
        shopLocation: data.shopLocation,
        landmark: data.landmark || '',
        status: 'PENDING',
        rejectionCount: 0,
        rejectionReason: null,
        isBanned: false,
        inventoryCount: 0,
        submittedAt: new Date().toISOString().split('T')[0]
      };

      db.vendors.push(vendor);
      this.save(db);
      return { success: true, vendor };
    }

    // ==================== BRAND ENROLLMENT (RULE 5: GSTIN UNIQUE) ====================
    registerBrand(data) {
      const db = this.get();

      // GSTIN Unique check
      const normalizedGstin = (data.gstin || '').trim().toUpperCase();
      if (db.brands.some(b => b.gstin === normalizedGstin)) {
        return { success: false, message: 'This GSTIN is already registered. Duplicate or banned brand registration is blocked.' };
      }

      if (db.brands.some(b => b.email.toLowerCase() === data.email.toLowerCase())) {
        return { success: false, message: 'Email address is already registered.' };
      }

      const newId = 'BRD-' + Math.floor(100 + Math.random() * 900);
      const brand = {
        id: newId,
        brandName: data.brandName,
        websiteUrl: data.websiteUrl,
        connectedGym: data.connectedGym || 'Direct Online',
        email: data.email,
        gstin: normalizedGstin,
        status: 'PENDING',
        rejectionCount: 0,
        rejectionReason: null,
        isBanned: false,
        submittedAt: new Date().toISOString().split('T')[0],
        verifiedAt: null,
        generatedCredentials: null,
        productsCount: 0
      };

      db.brands.push(brand);
      this.save(db);
      return { success: true, brand };
    }

    // ==================== PRODUCT MANAGEMENT (RULE 4 & RULE 7) ====================
    addProduct(data) {
      const db = this.get();
      
      // Verify owner is approved and not banned
      let owner = null;
      if (data.ownerType === 'brand') {
        owner = db.brands.find(b => b.id === data.ownerId);
      } else {
        owner = db.vendors.find(v => v.id === data.ownerId);
      }

      if (!owner || owner.status !== 'APPROVED') {
        return { success: false, message: 'Only verified and approved businesses can submit product listings.' };
      }

      if (owner.isBanned) {
        return { success: false, message: 'This business is banned from adding products.' };
      }

      const newId = 'PRD-' + Math.floor(1000 + Math.random() * 9000);
      const product = {
        id: newId,
        ownerType: data.ownerType,
        ownerId: data.ownerId,
        ownerName: owner.brandName || owner.shopName,
        category: data.category,
        name: data.name,
        weight: data.weight,
        servings: parseInt(data.servings) || 1,
        price: parseFloat(data.price) || 0,
        stock: parseInt(data.stock) || 0,
        photos: data.photos && data.photos.length > 0 ? data.photos : [
          'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500&q=80'
        ],
        status: 'PENDING', // Rule 4: Requires individual Admin review
        labTested: false,
        rejectionReason: null,
        lastEditedAt: null,
        rating: 0,
        description: data.description || 'Pending Admin Quality and Certificate check.',
        submittedAt: new Date().toISOString().split('T')[0]
      };

      db.products.push(product);
      this.save(db);
      return { success: true, product };
    }

    editProduct(productId, updatedFields) {
      const db = this.get();
      const product = db.products.find(p => p.id === productId);
      if (!product) return { success: false, message: 'Product not found.' };

      // Apply updates
      Object.assign(product, updatedFields);
      
      // Rule 7: Product edits reset status to PENDING / re-approval required
      product.status = 'PENDING';
      product.labTested = false;
      product.lastEditedAt = new Date().toISOString();

      this.save(db);
      return { success: true, product, message: 'Product updated. Sent to Admin Review queue for re-approval.' };
    }

    // ==================== ADMIN VERIFICATION & BAN LOGIC (RULES 6, 8, 9) ====================
    verifyGym(gymId, isApproved, adminNote) {
      const db = this.get();
      const gym = db.gyms.find(g => g.id === gymId);
      if (!gym) return null;

      gym.status = isApproved ? 'APPROVED' : 'REJECTED';
      if (!isApproved) {
        gym.rejectionCount = (gym.rejectionCount || 0) + 1;
        gym.rejectionReason = adminNote || 'Documentation and equipment specs did not meet standards.';
        // Rule 6: Dispatch rejection email with reason and resubmit prompt
        db.emailDispatches.push({
          recipient: gym.gymEmail,
          subject: 'Athloboard Facility Application Status: Action Required',
          body: `Your facility registration was rejected: ${gym.rejectionReason}. Please log in to edit and resubmit your details.`,
          date: new Date().toISOString()
        });
      } else {
        gym.verifiedAt = new Date().toISOString().split('T')[0];
        gym.adminNote = adminNote || 'Gym KYC & Equipment Weight Verified.';
      }

      this.save(db);
      return gym;
    }

    verifyBrand(brandId, isApproved, adminNote) {
      const db = this.get();
      const brand = db.brands.find(b => b.id === brandId);
      if (!brand) return null;

      brand.status = isApproved ? 'APPROVED' : 'REJECTED';
      if (!isApproved) {
        brand.rejectionCount = (brand.rejectionCount || 0) + 1;
        brand.rejectionReason = adminNote || 'GSTIN verification failed or website unreachable.';
        db.emailDispatches.push({
          recipient: brand.email,
          subject: 'Athloboard Brand Application Status: Action Required',
          body: `Your brand application was rejected: ${brand.rejectionReason}. Please edit and resubmit.`,
          date: new Date().toISOString()
        });
      } else {
        brand.verifiedAt = new Date().toISOString().split('T')[0];
        if (!brand.generatedCredentials) {
          const cleanName = brand.brandName.toLowerCase().replace(/[^a-z0-9]/g, '_');
          brand.generatedCredentials = {
            username: `brand_${cleanName}`,
            password: `Athlo#${Math.floor(100000 + Math.random() * 900000)}`,
            generatedAt: new Date().toISOString()
          };
        }
      }

      this.save(db);
      return brand;
    }

    verifyVendor(vendorId, isApproved, adminNote) {
      const db = this.get();
      const vendor = db.vendors.find(v => v.id === vendorId);
      if (!vendor) return null;

      vendor.status = isApproved ? 'APPROVED' : 'REJECTED';
      if (!isApproved) {
        vendor.rejectionCount = (vendor.rejectionCount || 0) + 1;
        vendor.rejectionReason = adminNote || 'GSTIN or shop location verification failed.';
        db.emailDispatches.push({
          recipient: vendor.email,
          subject: 'Athloboard Vendor Application Status: Action Required',
          body: `Your vendor application was rejected: ${vendor.rejectionReason}. Please edit and resubmit.`,
          date: new Date().toISOString()
        });
      }

      this.save(db);
      return vendor;
    }

    // Rule 9: Product Approval & Repeat-Offender Ban Rule (2 strikes -> ban)
    verifyProduct(productId, isApproved, rejectionReason) {
      const db = this.get();
      const product = db.products.find(p => p.id === productId);
      if (!product) return null;

      product.status = isApproved ? 'APPROVED' : 'REJECTED';
      product.labTested = isApproved;

      if (!isApproved) {
        product.rejectionReason = rejectionReason || 'Failed nitrogen purity test or certificate mismatch.';

        // Increment rejection count on owner business
        let owner = null;
        if (product.ownerType === 'brand') {
          owner = db.brands.find(b => b.id === product.ownerId);
        } else {
          owner = db.vendors.find(v => v.id === product.ownerId);
        }

        if (owner) {
          owner.rejectionCount = (owner.rejectionCount || 0) + 1;
          
          // Rule 6: Dispatch rejection email
          db.emailDispatches.push({
            recipient: owner.email,
            subject: `Product Listing Rejected: ${product.name}`,
            body: `Product "${product.name}" was rejected: ${product.rejectionReason}. Rejection strike: ${owner.rejectionCount}/2.`,
            date: new Date().toISOString()
          });

          // Rule 9: If 2 product rejections -> BAN BUSINESS
          if (owner.rejectionCount >= 2) {
            owner.isBanned = true;
            // Reject all their other active products
            db.products.forEach(p => {
              if (p.ownerId === owner.id) p.status = 'REJECTED';
            });
            db.emailDispatches.push({
              recipient: owner.email,
              subject: 'URGENT: Business Account Permanently Banned',
              body: `Your business (${owner.brandName || owner.shopName}) has been permanently banned after 2 product rejections. GSTIN (${owner.gstin}) has been locked.`,
              date: new Date().toISOString()
            });
          }
        }
      }

      this.save(db);
      return product;
    }

    // ==================== LIFT VIDEO REFEREEING ====================
    verifyLift(liftId, isApproved, depthValid, lockoutValid, feedbackNote, reviewer = 'Admin Supreme (IPC Judge)') {
      const db = this.get();
      const lift = db.lifts.find(l => l.id === liftId);
      if (!lift) return null;

      lift.status = isApproved ? 'APPROVED' : 'REJECTED';
      lift.depthValid = depthValid;
      lift.lockoutValid = lockoutValid;
      lift.adminFeedback = feedbackNote;
      lift.reviewerName = reviewer;
      lift.verifiedDate = new Date().toISOString().split('T')[0];

      if (isApproved) {
        const athlete = db.athletes.find(a => a.id === lift.athleteId);
        if (athlete) {
          if (lift.liftType === 'Squat' && lift.claimedWeight > athlete.prSquat) athlete.prSquat = lift.claimedWeight;
          if (lift.liftType === 'Bench Press' && lift.claimedWeight > athlete.prBench) athlete.prBench = lift.claimedWeight;
          if (lift.liftType === 'Deadlift' && lift.claimedWeight > athlete.prDeadlift) athlete.prDeadlift = lift.claimedWeight;
          athlete.total = athlete.prSquat + athlete.prBench + athlete.prDeadlift;
          db.athletes.sort((a, b) => b.total - a.total);
          db.athletes.forEach((ath, idx) => ath.rank = idx + 1);
        }
      }

      this.save(db);
      return lift;
    }

    // ==================== PUBLIC DIRECTORY FILTERS ====================
    getPublicVerifiedGyms() {
      return this.get().gyms.filter(g => g.status === 'APPROVED' && !g.isBanned);
    }

    getPublicVerifiedProducts() {
      return this.get().products.filter(p => p.status === 'APPROVED');
    }

    getPublicLeaderboard() {
      return this.get().athletes.filter(a => a.total > 0).sort((a, b) => b.total - a.total);
    }

    // Rule 8: Athletes are read-only for admin visibility
    getAthletesList() {
      return this.get().athletes;
    }
  }

  const dbInstance = new AthloboardDB();
  window.AthloboardDB = dbInstance;
  window.GritloopDB = dbInstance; // Backward compatibility alias
})(window);

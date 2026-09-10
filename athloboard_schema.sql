-- ============================================================================
-- ATHLOBOARD MASTER DATABASE SCHEMA (PostgreSQL 15 / Supabase)
-- Single Source of Truth for Athloboard Ecosystem
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUM Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('athlete', 'gym_owner', 'brand', 'vendor', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE lift_status AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE competition_status AS ENUM ('draft', 'published', 'ongoing', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. USERS TABLE
-- CRITICAL: firebase_uid is the ONLY source of truth for identity.
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'athlete',
    display_name VARCHAR(120),
    profile_photo_url TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(20),
    bio TEXT,
    instagram_handle VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. ATHLETE PROFILES TABLE
CREATE TABLE IF NOT EXISTS athlete_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    weight_class_kg NUMERIC(5,2),
    primary_gym_id UUID,
    gym_experience_duration VARCHAR(50),
    preferred_gym_name VARCHAR(150),
    preferred_area VARCHAR(150),
    total_lift_points INTEGER DEFAULT 0,
    current_streak_days INTEGER DEFAULT 0,
    longest_streak_days INTEGER DEFAULT 0,
    last_activity_date DATE,
    profile_completion_pct INTEGER DEFAULT 0,
    is_public_profile BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. EXERCISES TABLE
CREATE TABLE IF NOT EXISTS exercises (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) DEFAULT 'strength'
);

INSERT INTO exercises (name, category) VALUES
    ('Squat', 'strength'),
    ('Deadlift', 'strength'),
    ('Bench Press', 'strength')
ON CONFLICT (name) DO NOTHING;

-- 4. LIFT SESSIONS & SETS TABLE
CREATE TABLE IF NOT EXISTS lift_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athlete_profiles(user_id) ON DELETE CASCADE,
    exercise_id INTEGER NOT NULL REFERENCES exercises(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lift_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES lift_sessions(id) ON DELETE CASCADE,
    set_number INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    weight_kg NUMERIC(6,2) NOT NULL,
    is_verification_target BOOLEAN DEFAULT FALSE,
    video_url TEXT,
    ai_confidence NUMERIC(4,3),
    status lift_status DEFAULT 'pending',
    rejection_reason TEXT,
    effort_rating SMALLINT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. BADGES & ATHLETE BADGES TABLE
CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    criteria JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS athlete_badges (
    athlete_id UUID REFERENCES athlete_profiles(user_id) ON DELETE CASCADE,
    badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (athlete_id, badge_id)
);

-- 6. GYMS TABLE
CREATE TABLE IF NOT EXISTS gyms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    landmark VARCHAR(150),
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    gym_type VARCHAR(30),
    amenities JSONB DEFAULT '[]',
    equipment_tags JSONB DEFAULT '[]',
    operating_hours JSONB DEFAULT '{}',
    operational_days VARCHAR(100),
    pricing_period VARCHAR(20),
    total_plate_weight_kg NUMERIC(8,2) DEFAULT 0,
    total_dumbbell_weight_kg NUMERIC(8,2) DEFAULT 0,
    trainer_count_male INTEGER DEFAULT 0,
    trainer_count_female INTEGER DEFAULT 0,
    cover_photo_url TEXT,
    gallery_urls JSONB DEFAULT '[]',
    verification_status verification_status DEFAULT 'unverified',
    verification_docs_url TEXT,
    rejection_count INTEGER DEFAULT 0,
    rejection_reason TEXT,
    avg_rating NUMERIC(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Link athlete primary gym FK
DO $$ BEGIN
    ALTER TABLE athlete_profiles ADD CONSTRAINT fk_athlete_gym
        FOREIGN KEY (primary_gym_id) REFERENCES gyms(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 7. MEMBERSHIP PLANS TABLE
CREATE TABLE IF NOT EXISTS membership_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    duration_days INTEGER NOT NULL,
    inclusions JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE
);

-- 8. GYM REVIEWS & REPORTS TABLE
CREATE TABLE IF NOT EXISTS gym_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    athlete_id UUID NOT NULL REFERENCES athlete_profiles(user_id) ON DELETE CASCADE,
    rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    owner_reply TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (gym_id, athlete_id)
);

CREATE TABLE IF NOT EXISTS review_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID NOT NULL REFERENCES gym_reviews(id) ON DELETE CASCADE,
    reported_by UUID NOT NULL REFERENCES users(id),
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. PROMOTIONS & LEADS TABLE
CREATE TABLE IF NOT EXISTS promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    discount_pct NUMERIC(5,2),
    valid_from DATE,
    valid_to DATE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    athlete_id UUID NOT NULL REFERENCES athlete_profiles(user_id) ON DELETE CASCADE,
    stage VARCHAR(30) DEFAULT 'new',
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. VENDORS & BRANDS TABLE
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    shop_name VARCHAR(150) NOT NULL,
    owner_name VARCHAR(120) NOT NULL,
    website_url TEXT,
    contact_number VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL,
    gstin VARCHAR(15) NOT NULL UNIQUE,
    address TEXT,
    landmark VARCHAR(150),
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    verification_status verification_status DEFAULT 'unverified',
    rejection_count INTEGER DEFAULT 0,
    rejection_reason TEXT,
    is_banned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    brand_name VARCHAR(150) NOT NULL,
    website_url TEXT NOT NULL,
    linked_gym_id UUID REFERENCES gyms(id),
    email VARCHAR(255) NOT NULL,
    gstin VARCHAR(15) NOT NULL UNIQUE,
    verification_status verification_status DEFAULT 'unverified',
    rejection_count INTEGER DEFAULT 0,
    rejection_reason TEXT,
    is_banned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. PRODUCTS & COUPONS TABLE
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    weight VARCHAR(50),
    servings INTEGER,
    price NUMERIC(10,2) NOT NULL,
    stock_number INTEGER DEFAULT 0,
    photo_url_1 TEXT,
    photo_url_2 TEXT,
    is_sponsored BOOLEAN DEFAULT FALSE,
    listing_status verification_status DEFAULT 'unverified',
    rejection_reason TEXT,
    last_edited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    CHECK (vendor_id IS NOT NULL OR brand_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    code VARCHAR(30) NOT NULL,
    discount_pct NUMERIC(5,2),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS saved_coupons (
    athlete_id UUID REFERENCES athlete_profiles(user_id) ON DELETE CASCADE,
    coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (athlete_id, coupon_id)
);

-- 12. LIFT POINTS & REWARDS TABLE
CREATE TABLE IF NOT EXISTS lift_points_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athlete_profiles(user_id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    source_id UUID,
    description TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rewards_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    reward_type VARCHAR(50) NOT NULL,
    points_cost INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS reward_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athlete_profiles(user_id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES rewards_catalog(id),
    ledger_entry_id UUID REFERENCES lift_points_ledger(id),
    redeemed_at TIMESTAMPTZ DEFAULT now()
);

-- 13. COMPETITIONS & RESULTS TABLE
CREATE TABLE IF NOT EXISTS competitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizer_gym_id UUID REFERENCES gyms(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    sport VARCHAR(100) DEFAULT 'Powerlifting',
    city VARCHAR(100),
    venue_address TEXT,
    event_date DATE NOT NULL,
    entry_fee NUMERIC(10,2) DEFAULT 0,
    capacity INTEGER DEFAULT 100,
    status competition_status DEFAULT 'draft',
    description TEXT,
    banner_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS competition_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    athlete_id UUID NOT NULL REFERENCES athlete_profiles(user_id) ON DELETE CASCADE,
    category VARCHAR(100),
    payment_status VARCHAR(20) DEFAULT 'pending',
    registered_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (competition_id, athlete_id)
);

CREATE TABLE IF NOT EXISTS competition_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    athlete_id UUID NOT NULL REFERENCES athlete_profiles(user_id) ON DELETE CASCADE,
    rank INTEGER,
    score NUMERIC(10,2),
    certificate_url TEXT,
    UNIQUE (competition_id, athlete_id)
);

-- 14. COMMUNITY & SOCIAL TABLE
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT,
    media_urls JSONB DEFAULT '[]',
    lift_set_id UUID REFERENCES lift_sets(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS follows (
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE IF NOT EXISTS post_likes (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS post_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 15. NOTIFICATIONS & AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(150),
    body TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id UUID,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- AUTOMATED TRIGGERS & BUSINESS LOGIC
-- ============================================================================

-- 1. TWO-STRIKE BAN TRIGGER: Auto-ban vendor/brand after 2 lifetime product rejections
CREATE OR REPLACE FUNCTION check_repeat_offender_ban()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.listing_status = 'rejected' AND OLD.listing_status != 'rejected' THEN
        -- Handle Vendor strike
        IF NEW.vendor_id IS NOT NULL THEN
            UPDATE vendors
            SET rejection_count = rejection_count + 1,
                is_banned = CASE WHEN rejection_count + 1 >= 2 THEN TRUE ELSE is_banned END,
                rejection_reason = COALESCE(NEW.rejection_reason, 'Multiple product listing rejections')
            WHERE id = NEW.vendor_id;
        END IF;

        -- Handle Brand strike
        IF NEW.brand_id IS NOT NULL THEN
            UPDATE brands
            SET rejection_count = rejection_count + 1,
                is_banned = CASE WHEN rejection_count + 1 >= 2 THEN TRUE ELSE is_banned END,
                rejection_reason = COALESCE(NEW.rejection_reason, 'Multiple product listing rejections')
            WHERE id = NEW.brand_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_product_rejection_strike ON products;
CREATE TRIGGER trigger_product_rejection_strike
    AFTER UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION check_repeat_offender_ban();

-- 2. PRODUCT EDIT RESET TRIGGER: Editing product resets listing_status to unverified
CREATE OR REPLACE FUNCTION reset_product_status_on_edit()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.listing_status = 'verified' AND (
        OLD.product_name != NEW.product_name OR
        OLD.price != NEW.price OR
        OLD.weight != NEW.weight OR
        OLD.servings != NEW.servings OR
        OLD.category != NEW.category
    ) THEN
        NEW.listing_status := 'unverified';
        NEW.last_edited_at := now();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_product_edit_reset ON products;
CREATE TRIGGER trigger_product_edit_reset
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION reset_product_status_on_edit();

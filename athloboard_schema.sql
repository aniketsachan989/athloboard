-- ============================================================================
-- ATHLOBOARD / ATHLOBOARD MASTER POSTGRESQL DATABASE SCHEMA
-- Shared Backend & Single Source of Truth for:
--   1. Athloboard (Native Android App for Athletes & Gym Owners)
--   2. Athloboard Business Website (Gym, Brand & Vendor Enrollment/Portal)
--   3. Athloboard Admin Website (KYC, Product Review, Video Referee, Moderation)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Safe Enum Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('athlete', 'gym_owner', 'brand_owner', 'vendor_owner', 'super_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lift_type AS ENUM ('squat', 'bench', 'deadlift');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('pending', 'investigating', 'resolved', 'dismissed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. USERS TABLE (Central Auth & Session Token Management)
CREATE TABLE IF NOT EXISTS users (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone                VARCHAR(15) NOT NULL UNIQUE,
    email                VARCHAR(255) NOT NULL UNIQUE,
    password_hash        VARCHAR(255) NOT NULL,
    active_role          user_role NOT NULL DEFAULT 'athlete',
    otp_verified         BOOLEAN DEFAULT FALSE,
    is_active            BOOLEAN DEFAULT TRUE,
    created_at           TIMESTAMPTZ DEFAULT now(),
    updated_at           TIMESTAMPTZ DEFAULT now()
);

-- Ensure active_role and otp_verified exist if table was previously created with older schema
DO $$ BEGIN
    ALTER TABLE users ADD COLUMN active_role user_role NOT NULL DEFAULT 'athlete';
EXCEPTION WHEN duplicate_column THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE users ADD COLUMN otp_verified BOOLEAN DEFAULT FALSE;
EXCEPTION WHEN duplicate_column THEN null; END $$;

-- 2. ATHLETES TABLE (Registered strictly in Athloboard App)
CREATE TABLE IF NOT EXISTS athlete_profiles (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id              UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    unique_athlete_id    VARCHAR(20) NOT NULL UNIQUE,
    full_name            VARCHAR(120) NOT NULL,
    dob                  DATE NOT NULL,
    gender               VARCHAR(10) NOT NULL,
    has_gym_exp          BOOLEAN DEFAULT FALSE,
    gym_name             VARCHAR(150),
    exp_years            VARCHAR(30),
    preferred_gym        VARCHAR(150),
    preferred_area       VARCHAR(150),
    avatar_url           TEXT,
    pr_squat_kg          NUMERIC(6,2) DEFAULT 0,
    pr_bench_kg          NUMERIC(6,2) DEFAULT 0,
    pr_deadlift_kg       NUMERIC(6,2) DEFAULT 0,
    total_sbd_kg         NUMERIC(7,2) GENERATED ALWAYS AS (pr_squat_kg + pr_bench_kg + pr_deadlift_kg) STORED,
    national_rank        INTEGER,
    weight_class         VARCHAR(20),
    badge_title          VARCHAR(50) DEFAULT 'NOVICE LIFTER',
    created_at           TIMESTAMPTZ DEFAULT now(),
    updated_at           TIMESTAMPTZ DEFAULT now()
);

-- 3. GYMS TABLE (Phase 1 Basic & Phase 2 Equipment Audits)
CREATE TABLE IF NOT EXISTS gyms (
    id                         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gym_name                   VARCHAR(150) NOT NULL,
    owner_name                 VARCHAR(120) NOT NULL,
    gym_contact                VARCHAR(15) NOT NULL,
    owner_contact              VARCHAR(15) NOT NULL,
    gym_email                  VARCHAR(255) NOT NULL,
    gym_type                   VARCHAR(30) DEFAULT 'unisex',
    location_address           TEXT NOT NULL,
    landmark                   VARCHAR(150),
    latitude                   NUMERIC(9,6),
    longitude                  NUMERIC(9,6),
    total_plate_weight_kg      NUMERIC(8,2) DEFAULT 0,
    total_dumbbell_weight_kg   NUMERIC(8,2) DEFAULT 0,
    trainer_count_male         INTEGER DEFAULT 0,
    trainer_count_female       INTEGER DEFAULT 0,
    operational_days           VARCHAR(100) DEFAULT 'Monday - Saturday',
    open_time                  TIME NOT NULL DEFAULT '06:00',
    close_time                 TIME NOT NULL DEFAULT '22:00',
    monthly_charge             NUMERIC(10,2),
    quarterly_charge           NUMERIC(10,2),
    yearly_charge              NUMERIC(10,2),
    pricing_period             VARCHAR(20) DEFAULT 'monthly',
    photo_urls                 TEXT[] DEFAULT '{}',
    verification_status        verification_status DEFAULT 'unverified',
    rejection_count            INTEGER DEFAULT 0,
    rejection_reason           TEXT,
    is_banned                  BOOLEAN DEFAULT FALSE,
    created_at                 TIMESTAMPTZ DEFAULT now(),
    updated_at                 TIMESTAMPTZ DEFAULT now()
);

-- 4. VENDORS TABLE (Local Supplement & Gear Retailers - GSTIN Mandatory & Unique)
CREATE TABLE IF NOT EXISTS vendors (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    shop_name            VARCHAR(150) NOT NULL,
    owner_name           VARCHAR(120) NOT NULL,
    website_url          TEXT,
    contact_number       VARCHAR(15) NOT NULL,
    email                VARCHAR(255) NOT NULL,
    gstin                VARCHAR(15) NOT NULL UNIQUE,
    address              TEXT NOT NULL,
    landmark             VARCHAR(150),
    latitude             NUMERIC(9,6),
    longitude            NUMERIC(9,6),
    verification_status  verification_status DEFAULT 'unverified',
    rejection_count      INTEGER DEFAULT 0,
    rejection_reason     TEXT,
    is_banned            BOOLEAN DEFAULT FALSE,
    created_at           TIMESTAMPTZ DEFAULT now(),
    updated_at           TIMESTAMPTZ DEFAULT now()
);

-- 5. BRANDS TABLE (Direct Manufacturers - GSTIN Mandatory & Unique)
CREATE TABLE IF NOT EXISTS brands (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    brand_name           VARCHAR(150) NOT NULL,
    website_url          TEXT NOT NULL,
    linked_gym_id        UUID REFERENCES gyms(id) ON DELETE SET NULL,
    email                VARCHAR(255) NOT NULL,
    gstin                VARCHAR(15) NOT NULL UNIQUE,
    verification_status  verification_status DEFAULT 'unverified',
    rejection_count      INTEGER DEFAULT 0,
    rejection_reason     TEXT,
    is_banned            BOOLEAN DEFAULT FALSE,
    created_at           TIMESTAMPTZ DEFAULT now(),
    updated_at           TIMESTAMPTZ DEFAULT now()
);

-- 6. PRODUCTS TABLE (Two-Step Gate: Every Product requires individual Admin Review)
CREATE TABLE IF NOT EXISTS products (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id            UUID REFERENCES vendors(id) ON DELETE CASCADE,
    brand_id             UUID REFERENCES brands(id) ON DELETE CASCADE,
    category             VARCHAR(50) NOT NULL,
    product_name         VARCHAR(150) NOT NULL,
    weight               VARCHAR(50),
    servings             INTEGER,
    price                NUMERIC(10,2) NOT NULL,
    stock_number         INTEGER DEFAULT 0,
    photo_url_1          TEXT NOT NULL,
    photo_url_2          TEXT,
    lab_certificate_url  TEXT,
    listing_status       verification_status DEFAULT 'unverified',
    rejection_reason     TEXT,
    last_edited_at       TIMESTAMPTZ,
    created_at           TIMESTAMPTZ DEFAULT now(),
    updated_at           TIMESTAMPTZ DEFAULT now(),
    CHECK (vendor_id IS NOT NULL OR brand_id IS NOT NULL)
);

-- 7. LIFT SUBMISSIONS TABLE (Video Refereeing with AI + Human Gatekeeper)
CREATE TABLE IF NOT EXISTS lift_submissions (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id           UUID NOT NULL REFERENCES athlete_profiles(id) ON DELETE CASCADE,
    exercise             lift_type NOT NULL,
    claimed_weight_kg    NUMERIC(6,2) NOT NULL,
    video_url            TEXT NOT NULL,
    reps_detected        INTEGER DEFAULT 0,
    valid_reps           INTEGER DEFAULT 0,
    form_status          VARCHAR(50) DEFAULT 'pending_analysis',
    ai_confidence        NUMERIC(5,2),
    status               verification_status DEFAULT 'unverified',
    referee_notes        TEXT,
    refereed_by          UUID REFERENCES users(id),
    refereed_at          TIMESTAMPTZ,
    created_at           TIMESTAMPTZ DEFAULT now()
);

-- 8. SANCTIONED COMPETITIONS TABLE
CREATE TABLE IF NOT EXISTS competitions (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title                VARCHAR(150) NOT NULL,
    city                 VARCHAR(80) NOT NULL,
    venue_name           VARCHAR(150) NOT NULL,
    competition_date     DATE NOT NULL,
    entry_fee            NUMERIC(10,2) DEFAULT 0,
    prize_pool           NUMERIC(10,2) DEFAULT 0,
    organizer_gym_id     UUID REFERENCES gyms(id) ON DELETE SET NULL,
    banner_url           TEXT,
    created_at           TIMESTAMPTZ DEFAULT now()
);

-- 9. GYM REVIEWS TABLE
CREATE TABLE IF NOT EXISTS gym_reviews (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id               UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    athlete_id           UUID NOT NULL REFERENCES athlete_profiles(id) ON DELETE CASCADE,
    rating               INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment              TEXT,
    created_at           TIMESTAMPTZ DEFAULT now()
);

-- 10. REVIEW REPORTS TABLE (Moderation Queue)
CREATE TABLE IF NOT EXISTS review_reports (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id            UUID NOT NULL REFERENCES gym_reviews(id) ON DELETE CASCADE,
    reported_by          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason               TEXT NOT NULL,
    status               report_status DEFAULT 'pending',
    resolution_notes     TEXT,
    created_at           TIMESTAMPTZ DEFAULT now(),
    resolved_at          TIMESTAMPTZ
);

-- 11. SPONSORED ADVERTISEMENTS TABLE
CREATE TABLE IF NOT EXISTS advertisements (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_type        VARCHAR(20) NOT NULL,
    business_id          UUID NOT NULL,
    banner_url           TEXT NOT NULL,
    target_url           TEXT NOT NULL,
    placement            VARCHAR(50) DEFAULT 'homepage_hero',
    status               verification_status DEFAULT 'unverified',
    impressions_count    INTEGER DEFAULT 0,
    clicks_count         INTEGER DEFAULT 0,
    starts_at            TIMESTAMPTZ,
    expires_at           TIMESTAMPTZ,
    created_at           TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- AUTOMATIC BUSINESS BAN TRIGGER (Rule 9: Repeat-offender ban after 2 rejections)
-- ============================================================================
CREATE OR REPLACE FUNCTION check_repeat_offender_ban()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.brand_id IS NOT NULL AND NEW.listing_status = 'rejected' THEN
        UPDATE brands 
        SET rejection_count = rejection_count + 1
        WHERE id = NEW.brand_id;

        UPDATE brands
        SET is_banned = TRUE
        WHERE id = NEW.brand_id AND rejection_count >= 2;
    END IF;

    IF NEW.vendor_id IS NOT NULL AND NEW.listing_status = 'rejected' THEN
        UPDATE vendors 
        SET rejection_count = rejection_count + 1
        WHERE id = NEW.vendor_id;

        UPDATE vendors
        SET is_banned = TRUE
        WHERE id = NEW.vendor_id AND rejection_count >= 2;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_product_rejection_strike ON products;
CREATE TRIGGER trigger_product_rejection_strike
AFTER UPDATE OF listing_status ON products
FOR EACH ROW
WHEN (OLD.listing_status IS DISTINCT FROM NEW.listing_status AND NEW.listing_status = 'rejected')
EXECUTE FUNCTION check_repeat_offender_ban();

-- ============================================================================
-- PRODUCT EDIT RESET TRIGGER (Rule 7: Edits to approved product reset to pending)
-- ============================================================================
CREATE OR REPLACE FUNCTION reset_product_status_on_edit()
RETURNS TRIGGER AS $$
BEGIN
    NEW.listing_status := 'unverified';
    NEW.last_edited_at := now();
    NEW.updated_at := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_product_edit_reset ON products;
CREATE TRIGGER trigger_product_edit_reset
BEFORE UPDATE OF price, stock_number, product_name, weight, servings, photo_url_1, photo_url_2, category ON products
FOR EACH ROW
EXECUTE FUNCTION reset_product_status_on_edit();

-- ============================================================================
-- ATHLOBOARD DEMO SEED DATA
-- Top Verified Strength Gyms and Lab-Tested Products
-- ============================================================================

-- Ensure Admin / Demo User exists
INSERT INTO users (id, firebase_uid, email, display_name, role)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', 'demo_admin_uid', 'admin@athloboard.com', 'Athloboard Admin', 'admin'),
  ('a0000000-0000-0000-0000-000000000002', 'demo_owner_delhi', 'owner.delhi@athloboard.com', 'Rajesh Sharma', 'gym_owner'),
  ('a0000000-0000-0000-0000-000000000003', 'demo_owner_mumbai', 'owner.mumbai@athloboard.com', 'Vikram Menon', 'gym_owner'),
  ('a0000000-0000-0000-0000-000000000004', 'demo_owner_blr', 'owner.blr@athloboard.com', 'Anand Kulkarni', 'gym_owner'),
  ('a0000000-0000-0000-0000-000000000005', 'demo_brand_titan', 'titan.brand@athloboard.com', 'Titan Nutrition Official', 'brand')
ON CONFLICT (email) DO NOTHING;

-- 1. SEED GYMS
INSERT INTO gyms (
  id, owner_user_id, name, description, address, city, state, landmark,
  total_plate_weight_kg, total_dumbbell_weight_kg, trainer_count_male, trainer_count_female,
  cover_photo_url, verification_status, avg_rating, review_count, is_featured
) VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002',
    'Iron Pulse Strength & Conditioning',
    'Audited gold standard powerlifting facility with Eleiko calibrated plates, 4 ER combo racks, and certified strength coaches.',
    'E-42, Ring Road, South Extension II',
    'New Delhi',
    'Delhi',
    'Near South Extension Metro Station',
    3200, 1400, 4, 2,
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200',
    'verified', 4.90, 128, TRUE
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000003',
    'Barbell Club India',
    'Premier competitive strength gym in Bandra West featuring Eleiko competition power bars, deadlift platforms, and recovery zones.',
    'Hill Road, Bandra West',
    'Mumbai',
    'Maharashtra',
    'Opposite Mehboob Studios',
    2800, 1300, 3, 1,
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200',
    'verified', 4.80, 94, TRUE
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000004',
    'Spartan Strength Lab',
    'Bengalurus largest audited barbell facility boasting 4,100kg Bullrock calibrated steel plates, 8 Sabertooth bars, and on-site sauna.',
    '100ft Road, Indiranagar',
    'Bengaluru',
    'Karnataka',
    'Near 12th Main Junction',
    4100, 1800, 5, 3,
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200',
    'verified', 4.90, 156, TRUE
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000002',
    'Titan Athletic Performance',
    'Elite strength and conditioning center in Jubilee Hills equipped with IPF combo racks, Olympic lifting platforms, and cold plunges.',
    'Road No. 36, Jubilee Hills',
    'Hyderabad',
    'Telangana',
    'Near Peddamma Temple Metro',
    3500, 1500, 4, 2,
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200',
    'verified', 4.90, 112, FALSE
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    'a0000000-0000-0000-0000-000000000003',
    'Apex Power & Barbell Lab',
    'Dedicated powerlifting center in Koregaon Park with calibrated plates, competition benches, and sports recovery therapy.',
    'North Main Road, Koregaon Park',
    'Pune',
    'Maharashtra',
    'Lane 5 Junction',
    2900, 1350, 3, 2,
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200',
    'verified', 4.80, 86, FALSE
  ),
  (
    '00000000-0000-0000-0000-000000000006',
    'a0000000-0000-0000-0000-000000000004',
    'Olympus Strength Sanctuary',
    'Salt Lake Sector V powerlifting haven with solid wood platforms, Eleiko calibrated plates, and contrast therapy baths.',
    'Block EP & GP, Sector V, Salt Lake',
    'Kolkata',
    'West Bengal',
    'Near College More',
    3100, 1450, 4, 2,
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200',
    'verified', 4.90, 104, FALSE
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  verification_status = EXCLUDED.verification_status;

-- 2. SEED BRANDS
INSERT INTO brands (id, owner_user_id, brand_name, website_url, email, gstin, verification_status)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005', 'Titan Nutrition India', 'https://titannutrition.in', 'contact@titannutrition.in', '07AAAAA0000A1Z5', 'verified'),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000005', 'IronForge Lab', 'https://ironforgelab.com', 'lab@ironforgelab.com', '27BBBBB1111B1Z2', 'verified'),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000005', 'GritGear Athletic', 'https://gritgear.in', 'support@gritgear.in', '29CCCCC2222C1Z9', 'verified')
ON CONFLICT (gstin) DO UPDATE SET
  brand_name = EXCLUDED.brand_name,
  verification_status = EXCLUDED.verification_status;

-- 3. SEED PRODUCTS
INSERT INTO products (
  id, brand_id, category, product_name, weight, servings, price, stock_number,
  photo_url_1, photo_url_2, is_sponsored, listing_status
) VALUES
  (
    'c0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'Proteins',
    'Pure Whey Isolate 100% Ultra-Filtered (2.0kg)',
    '2.0 kg',
    '66 Servings',
    4499.00,
    14,
    'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800',
    'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800',
    TRUE,
    'verified'
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000002',
    'Performance',
    'Creapure® Micronized Creatine Monohydrate (300g)',
    '300 g',
    '100 Servings',
    1199.00,
    28,
    'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800',
    'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800',
    FALSE,
    'verified'
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'b0000000-0000-0000-0000-000000000003',
    'Lifting Gear',
    'IPF Approved 13mm Heavy-Duty Lever Lifting Belt',
    '1.45 kg',
    'Lifetime Warranty',
    6899.00,
    9,
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800',
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800',
    TRUE,
    'verified'
  ),
  (
    'c0000000-0000-0000-0000-000000000004',
    'b0000000-0000-0000-0000-000000000003',
    'Weights',
    'Cast Iron Calibrated Olympic Competition Plates (150kg Set)',
    '150 kg',
    'IPF ±10g Calibrated',
    24999.00,
    5,
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800',
    FALSE,
    'verified'
  ),
  (
    'c0000000-0000-0000-0000-000000000005',
    'b0000000-0000-0000-0000-000000000003',
    'Barbells',
    'Cerakote 20kg Olympic Barbell (216,000 PSI / Needle Bearing)',
    '20.0 kg',
    'Lifetime Shaft Warranty',
    16499.00,
    8,
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    TRUE,
    'verified'
  ),
  (
    'c0000000-0000-0000-0000-000000000006',
    'b0000000-0000-0000-0000-000000000001',
    'Recovery',
    'Electrolyte + Essential Amino Acids EAA Matrix (450g)',
    '450 g',
    '30 Servings',
    1649.00,
    32,
    'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800',
    'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800',
    FALSE,
    'verified'
  ),
  (
    'c0000000-0000-0000-0000-000000000007',
    'b0000000-0000-0000-0000-000000000003',
    'Lifting Gear',
    'IPF Approved 7mm Neoprene Heavy-Duty Knee Sleeves',
    '0.48 kg',
    'Pair (Left & Right)',
    3499.00,
    15,
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800',
    FALSE,
    'verified'
  ),
  (
    'c0000000-0000-0000-0000-000000000008',
    'b0000000-0000-0000-0000-000000000002',
    'Performance',
    'Ultra-Grip Magnesium Carbonate Liquid Chalk (250ml)',
    '250 ml',
    '100+ Applications',
    699.00,
    45,
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    FALSE,
    'verified'
  )
ON CONFLICT (id) DO UPDATE SET
  product_name = EXCLUDED.product_name,
  price = EXCLUDED.price,
  listing_status = EXCLUDED.listing_status;

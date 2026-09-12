export interface ProductVariant {
  id: string;
  name: string;
  priceModifier?: number;
  inStock: boolean;
}

export interface Product {
  _id: string;
  id?: string;
  name: string;
  brand: string;
  brandStoreUrl?: string;
  category: string;
  price: string;
  priceAmount: number;
  mrp: string;
  mrpAmount: number;
  discountPercent: number;
  rating: number;
  ratingCount: number;
  boughtPastMonth: string;
  servings: string;
  weight: string;
  hplcTested: string;
  coaCertificateId: string;
  fssaiNumber: string;
  isSponsored: boolean;
  isBestSeller?: boolean;
  isAthloboardChoice?: boolean;
  stockNumber: number;
  images: string[];
  features: string[];
  flavors?: string[];
  sizes?: string[];
  soldBy: string;
  fulfilledBy: string;
  description: string;
}

export const ALL_PRODUCTS: Product[] = [
  {
    _id: '1',
    name: 'Pure Whey Isolate 100% Ultra-Filtered (2.0kg)',
    brand: 'Titan Nutrition India',
    brandStoreUrl: '/for-brands',
    category: 'Proteins',
    price: '₹ 4,499',
    priceAmount: 4499,
    mrp: '₹ 6,299',
    mrpAmount: 6299,
    discountPercent: 28,
    rating: 4.9,
    ratingCount: 3842,
    boughtPastMonth: '1.2K+ bought in past month',
    servings: '66 Servings (30g scoop)',
    weight: '2.0 kg (4.4 lbs)',
    hplcTested: '94.2% Pure HPLC Tested',
    coaCertificateId: 'ATH-LAB-2026-9821',
    fssaiNumber: '10020011000842',
    isSponsored: true,
    isBestSeller: true,
    isAthloboardChoice: true,
    stockNumber: 14,
    images: [
      'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&auto=format&fit=crop&q=80',
    ],
    features: [
      '27g Pure Whey Isolate per serving with zero amino spiking or fillers',
      'Third-party Eurofins HPLC tested: 94.2% true protein concentration',
      'Cross-flow microfiltered cold-pressed whey with <0.5g lactose',
      'Includes 6.4g naturally occurring BCAAs and 4.8g Glutamine',
      'Scratch-and-scan QR code on neck seal for instant lab report verification',
    ],
    flavors: ['Double Rich Chocolate', 'Cafe Mocha Cold Brew', 'Madagascar Vanilla', 'Raw Unflavored'],
    sizes: ['1.0 kg (33 Servings)', '2.0 kg (66 Servings)', '4.0 kg Bucket (132 Servings)'],
    soldBy: 'Titan Nutrition India Official (GSTIN Verified)',
    fulfilledBy: 'Athloboard Express Delivery',
    description: 'Titan Pure Whey Isolate is engineered for competitive powerlifters and strength athletes requiring the fastest amino acid absorption without digestive stress. Every single batch is quarantined and tested via High-Performance Liquid Chromatography (HPLC) to guarantee zero adulteration.',
  },
  {
    _id: '2',
    name: 'Creapure® Micronized Creatine Monohydrate (300g)',
    brand: 'IronForge Lab',
    brandStoreUrl: '/for-brands',
    category: 'Performance',
    price: '₹ 1,199',
    priceAmount: 1199,
    mrp: '₹ 1,599',
    mrpAmount: 1599,
    discountPercent: 25,
    rating: 4.8,
    ratingCount: 1920,
    boughtPastMonth: '800+ bought in past month',
    servings: '100 Servings (3g scoop)',
    weight: '300 g',
    hplcTested: '99.9% Creapure Certified',
    coaCertificateId: 'ATH-LAB-2026-4412',
    fssaiNumber: '10019022000511',
    isSponsored: false,
    isBestSeller: true,
    isAthloboardChoice: true,
    stockNumber: 28,
    images: [
      'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&auto=format&fit=crop&q=80',
    ],
    features: [
      'Genuine Creapure® synthesized in Trostberg, Germany',
      '200 Mesh micronized powder dissolves instantly in cold water',
      'Zero DCD (Dicyandiamide) and zero Dihydrotriazine chemical impurities',
      'Proven to enhance ATP synthesis and peak rate of force development (RFD)',
      '100% Vegan, non-GMO, Halal & Kosher certified raw materials',
    ],
    flavors: ['Unflavored Micronized', 'Blueberry Surge', 'Tangy Orange Splash'],
    sizes: ['150 g (50 Servings)', '300 g (100 Servings)', '600 g (200 Servings)'],
    soldBy: 'IronForge Labs Pvt Ltd (Authorized Distributor)',
    fulfilledBy: 'Athloboard Express Delivery',
    description: 'The global gold standard in creatine monohydrate. Creapure® is produced under strict GMP conditions using the highest purity raw materials to maximize intramyocellular phosphocreatine reserves for explosive powerlifting lifts.',
  },
  {
    _id: '3',
    name: 'IPF Approved 13mm Heavy-Duty Lever Lifting Belt',
    brand: 'GritGear Athletic',
    brandStoreUrl: '/for-brands',
    category: 'Lifting Gear',
    price: '₹ 6,899',
    priceAmount: 6899,
    mrp: '₹ 8,999',
    mrpAmount: 8999,
    discountPercent: 23,
    rating: 4.9,
    ratingCount: 1140,
    boughtPastMonth: '450+ bought in past month',
    servings: 'Lifetime Hardware Warranty',
    weight: '1.45 kg',
    hplcTested: 'IPF Sanctioned & Calibrated',
    coaCertificateId: 'ATH-GEAR-2026-1102',
    fssaiNumber: 'N/A (Lifting Equipment)',
    isSponsored: true,
    isBestSeller: true,
    isAthloboardChoice: false,
    stockNumber: 9,
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
    ],
    features: [
      'Fully compliant with International Powerlifting Federation (IPF) specifications',
      '13mm solid vegetable-tanned top-grain saddle leather with bevelled edges',
      'Indestructible zinc alloy quick-release lever mechanism tested to 1,200kg load',
      'Non-slip red suede leather inner lining prevents slippage against singlets',
      'Backed by an unconditional lifetime replacement warranty on lever buckle',
    ],
    flavors: ['Matte Black / Red Suede', 'Stealth Grey / Black Suede', 'Oxblood / Tan Suede'],
    sizes: ['Small (26-32 inch waist)', 'Medium (30-36 inch waist)', 'Large (34-40 inch waist)', 'XL (38-44 inch waist)'],
    soldBy: 'GritGear Athletic Co (Official IPF Partner)',
    fulfilledBy: 'Athloboard Express Delivery',
    description: 'Crafted for maximum intra-abdominal pressure during heavy competition squats and deadlifts. Built with genuine 13mm layered hide and a precision laser-engraved lever clamp that locks shut with zero deflection.',
  },
  {
    _id: '4',
    name: 'Cast Iron Calibrated Olympic Competition Plates (150kg Set)',
    brand: 'BullStrength Equipment',
    brandStoreUrl: '/for-brands',
    category: 'Weights',
    price: '₹ 24,999',
    priceAmount: 24999,
    mrp: '₹ 32,500',
    mrpAmount: 32500,
    discountPercent: 23,
    rating: 4.8,
    ratingCount: 420,
    boughtPastMonth: '80+ bought in past month',
    servings: '150kg Calibration Tested',
    weight: '150.0 kg Total',
    hplcTested: 'IPF Precision Weight ±10g',
    coaCertificateId: 'ATH-GEAR-2026-7782',
    fssaiNumber: 'N/A (Calibrated Metal)',
    isSponsored: false,
    isBestSeller: false,
    isAthloboardChoice: true,
    stockNumber: 5,
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    ],
    features: [
      'Precision machined cast iron with calibrated weight tolerance within ±10 grams',
      'Ultra-thin profile allows loading up to 700kg on a standard 2200mm Olympic barbell',
      'Color-coded per international IPF guidelines (Red 25kg, Blue 20kg, Yellow 15kg, Green 10kg)',
      '50.4mm precision center bore hole fits tight to minimize barbell vibration',
      'Scratch-resistant electro-static powder coat with raised silver lettering',
    ],
    flavors: ['Standard Competition Set (2x25kg, 2x20kg, 2x15kg, 2x10kg, 2x5kg)'],
    sizes: ['150kg Starter Competition Set', '250kg Heavy Meet Set (+₹14,999)'],
    soldBy: 'BullStrength Manufacturing Works (Pan-India Logistics)',
    fulfilledBy: 'Athloboard Heavy Freight',
    description: 'Engineered for sanction-grade powerlifting meets and elite strength gyms. These ultra-slim cast iron calibrated plates undergo CNC perimeter machining and counter-bored weight calibration plug tuning to deliver strict accuracy.',
  },
  {
    _id: '5',
    name: 'Cerakote 20kg Olympic Barbell (216,000 PSI / Needle Bearing)',
    brand: 'IronViper Athletics',
    brandStoreUrl: '/for-brands',
    category: 'Barbells',
    price: '₹ 16,499',
    priceAmount: 16499,
    mrp: '₹ 22,999',
    mrpAmount: 22999,
    discountPercent: 28,
    rating: 4.9,
    ratingCount: 680,
    boughtPastMonth: '190+ bought in past month',
    servings: 'Lifetime Shaft Warranty',
    weight: '20.0 kg (44.1 lbs)',
    hplcTested: '216,000 PSI Tensile Certified',
    coaCertificateId: 'ATH-GEAR-2026-3021',
    fssaiNumber: 'N/A (Steel Barbell)',
    isSponsored: true,
    isBestSeller: false,
    isAthloboardChoice: true,
    stockNumber: 8,
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    ],
    features: [
      '216,000 PSI heat-treated alloy steel shaft with consistent moderate whip',
      'Cerakote polymer ceramic composite coating for superior corrosion resistance',
      'Dual knurl marks with aggressive volcano knurling for no-chalk grip lock',
      '8 precision needle bearings + 2 bronze bushings for buttery smooth sleeve spin',
      'Hard chrome sleeves with fine grooved ribbed surface to retain collars',
    ],
    flavors: ['Cerakote Gunmetal Grey', 'Cerakote Tactical Olive Green', 'Cerakote Crimson Red'],
    sizes: ['20kg Mens 28.5mm Shaft (2200mm)', '15kg Womens 25mm Shaft (2010mm)'],
    soldBy: 'IronViper Athletics Pvt Ltd',
    fulfilledBy: 'Athloboard Express Delivery',
    description: 'The ultimate do-it-all Olympic and power bar. Featuring an exceptionally rigid 216k PSI tensile shaft that resists permanent bending even when loaded past 650kg in heavy power racks.',
  },
  {
    _id: '6',
    name: 'Electrolyte + Essential Amino Acids EAA Matrix (450g)',
    brand: 'ApexBio Formulations',
    brandStoreUrl: '/for-brands',
    category: 'Recovery',
    price: '₹ 1,649',
    priceAmount: 1649,
    mrp: '₹ 2,299',
    mrpAmount: 2299,
    discountPercent: 28,
    rating: 4.7,
    ratingCount: 890,
    boughtPastMonth: '500+ bought in past month',
    servings: '30 Servings (15g scoop)',
    weight: '450 g',
    hplcTested: 'Clinical Ratio 9 EAAs',
    coaCertificateId: 'ATH-LAB-2026-6629',
    fssaiNumber: '10018042000299',
    isSponsored: false,
    isBestSeller: false,
    isAthloboardChoice: false,
    stockNumber: 32,
    images: [
      'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&auto=format&fit=crop&q=80',
    ],
    features: [
      'Full spectrum 9 Essential Amino Acids delivering 10g EAAs per scoop',
      'Pink Himalayan rock salt and coconut water powder for cellular hydration',
      'Zero artificial dyes, zero sugar, and naturally sweetened with Stevia rebaudiana',
      'Accelerates muscular protein synthesis during high-volume training blocks',
      'Third-party tested for WADA banned substances (Clean Sport Certified)',
    ],
    flavors: ['Watermelon Limeade', 'Green Apple Blast', 'Tropical Mango Guava'],
    sizes: ['450 g (30 Servings)', '900 g Tub (60 Servings)'],
    soldBy: 'ApexBio Health Innovations Pvt Ltd',
    fulfilledBy: 'Athloboard Express Delivery',
    description: 'Formulated to replenish vital plasma electrolytes and stimulate mTOR signaling between exhausting lifting sets. Prevents cramping and sustains neuromuscular contractile force during heavy squatting sessions.',
  },
];

export function getProductById(id: string): Product | undefined {
  return ALL_PRODUCTS.find(p => p._id === id);
}

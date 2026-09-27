'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Dumbbell, MapPin, Star, ShieldCheck, CheckCircle2, 
  Calendar, Phone, Navigation as NavigationIcon, Users, 
  Clock, ArrowLeft, Award, Check, MessageSquare 
} from 'lucide-react';

interface GymDetail {
  id: string;
  name: string;
  status: string;
  rating: number;
  reviewsCount: number;
  address: string;
  city: string;
  phone: string;
  hours: string;
  pricing: string;
  totalPlatesKg: number;
  maxDumbbellKg: number;
  trainersMale: number;
  trainersFemale: number;
  coverImage: string;
  gallery: string[];
  platesBreakdown: { weight: string; count: number; brand: string; color: string }[];
  barbells: { name: string; spec: string; count: number }[];
  racksAndPlatforms: { name: string; count: number }[];
  amenities: string[];
  memberships: { title: string; price: string; duration: string; features: string[] }[];
}

const FALLBACK_GYMS: Record<string, GymDetail> = {
  '1': {
    id: '1',
    name: 'Iron Pulse Strength & Conditioning',
    status: 'Audited Gold',
    rating: 4.9,
    reviewsCount: 128,
    address: 'E-42, Ring Road, South Extension II',
    city: 'New Delhi, Delhi 110049',
    phone: '+91 98110 42890',
    hours: '05:30 AM – 10:30 PM (Mon-Sat)',
    pricing: '₹ 2,499 / mo',
    totalPlatesKg: 3200,
    maxDumbbellKg: 65,
    trainersMale: 4,
    trainersFemale: 2,
    coverImage: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
    ],
    platesBreakdown: [
      { weight: '25 kg (Red)', count: 48, brand: 'Bullrock Calibrated Steel', color: 'bg-red-600' },
      { weight: '20 kg (Blue)', count: 32, brand: 'Eleiko IPF Competition', color: 'bg-blue-600' },
      { weight: '15 kg (Yellow)', count: 24, brand: 'Bullrock Calibrated Steel', color: 'bg-yellow-500 text-black' },
      { weight: '10 kg (Green)', count: 24, brand: 'Bullrock Calibrated Steel', color: 'bg-emerald-600' },
      { weight: '5 kg (White)', count: 16, brand: 'Eleiko Calibrated Change', color: 'bg-slate-200 text-black' },
      { weight: '2.5 / 1.25 / 0.5 kg (Micro)', count: 24, brand: 'IPF Calibrated Metal', color: 'bg-zinc-700' },
    ],
    barbells: [
      { name: 'Eleiko IPF Powerlifting Competition Bar', spec: '29mm, 20kg, 215,000 PSI, Aggressive Knurling', count: 4 },
      { name: 'Bullrock Sabertooth Power Bar', spec: '29mm, 20kg, 210,000 PSI, Center Knurl', count: 6 },
      { name: 'Kabuki Trap Bar HD & Safety Squat Bar', spec: 'Specialty powerlifting overload equipment', count: 2 },
    ],
    racksAndPlatforms: [
      { name: 'IPF-Standard Combo Racks with Lever Jacks', count: 4 },
      { name: 'Competition Solid Wood / High-Density Rubber Deadlift Platforms', count: 3 },
      { name: 'Full Power Cages with Westside Hole Spacing & Safety Straps', count: 6 },
      { name: 'Dedicated Competition Chalk Buckets & Magnesium Carbonate Stock', count: 5 },
    ],
    amenities: [
      'Calibrated Steel Plates', 'Competition Combo Racks', 'Chalk Allowed', 
      'Steam & Sauna', 'Sports Physiotherapy Room', 'Cold Plunge Bath', 'Olympic Lifting Platforms'
    ],
    memberships: [
      { title: 'Day Training Pass', price: '₹ 399', duration: '1 Day', features: ['Full facility access', 'Calibrated plates access', 'Chalk & platform use'] },
      { title: 'Strength Monthly', price: '₹ 2,499', duration: 'Monthly', features: ['Unlimited gym access', '1x Coaching form audit', 'Locker access', '100 Lift Points/mo'] },
      { title: 'Annual Power Athlete', price: '₹ 22,999', duration: '12 Months', features: ['All-inclusive access', 'Competition prep programming', 'Physio screening', 'Free Athloboard Jersey'] },
    ],
  },
  '2': {
    id: '2',
    name: 'Barbell Club India',
    status: 'Audited Gold',
    rating: 4.8,
    reviewsCount: 94,
    address: 'Hill Road, Bandra West',
    city: 'Mumbai, Maharashtra 400050',
    phone: '+91 98200 55412',
    hours: '06:00 AM – 11:00 PM (Everyday)',
    pricing: '₹ 3,200 / mo',
    totalPlatesKg: 2800,
    maxDumbbellKg: 60,
    trainersMale: 3,
    trainersFemale: 1,
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
    ],
    platesBreakdown: [
      { weight: '25 kg (Red)', count: 40, brand: 'Eleiko Competition', color: 'bg-red-600' },
      { weight: '20 kg (Blue)', count: 28, brand: 'Bullrock Calibrated', color: 'bg-blue-600' },
      { weight: '10 kg (Green)', count: 20, brand: 'Eleiko Calibrated', color: 'bg-emerald-600' },
    ],
    barbells: [
      { name: 'Eleiko 29mm Power Bar', spec: 'IPF Approved 20kg', count: 4 },
      { name: 'Rogue Ohio Power Bar', spec: 'Bare Steel 29mm', count: 3 },
    ],
    racksAndPlatforms: [
      { name: 'Competition ER Combo Racks', count: 3 },
      { name: 'Deadlift Lifting Platforms', count: 3 },
    ],
    amenities: ['Calibrated Plates', 'Chalk Buckets', 'Ice Bath', 'Free Wi-Fi', 'Juice Bar'],
    memberships: [
      { title: 'Day Pass', price: '₹ 499', duration: '1 Day', features: ['All equipment access'] },
      { title: 'Monthly Pass', price: '₹ 3,200', duration: 'Monthly', features: ['Unlimited access'] },
    ],
  },
  '3': {
    id: '3',
    name: 'Spartan Strength Lab',
    status: 'Audited Gold',
    rating: 4.9,
    reviewsCount: 156,
    address: '100ft Road, Indiranagar',
    city: 'Bengaluru, Karnataka 560038',
    phone: '+91 99000 81234',
    hours: '05:00 AM – 11:00 PM (Mon-Sat)',
    pricing: '₹ 2,800 / mo',
    totalPlatesKg: 4100,
    maxDumbbellKg: 70,
    trainersMale: 5,
    trainersFemale: 3,
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600',
    ],
    platesBreakdown: [
      { weight: '25 kg (Red)', count: 64, brand: 'Bullrock Calibrated Steel', color: 'bg-red-600' },
      { weight: '20 kg (Blue)', count: 40, brand: 'Bullrock Calibrated Steel', color: 'bg-blue-600' },
      { weight: '10 kg (Green)', count: 30, brand: 'Bullrock Calibrated Steel', color: 'bg-emerald-600' },
    ],
    barbells: [
      { name: 'Bullrock Sabertooth 29mm', spec: '20kg Power Bar', count: 8 },
      { name: 'Eleiko Olympic Weightlifting Bar', spec: '28mm Needle Bearing', count: 4 },
    ],
    racksAndPlatforms: [
      { name: 'ER Style Combo Racks', count: 5 },
      { name: 'Acoustic Deadlift Drop Platforms', count: 4 },
    ],
    amenities: ['Calibrated Weights', 'Olympic Platforms', 'Sauna', 'Physio on site', 'Supplement Bar'],
    memberships: [
      { title: 'Day Pass', price: '₹ 450', duration: '1 Day', features: ['Full access'] },
      { title: 'Monthly Strength', price: '₹ 2,800', duration: 'Monthly', features: ['Full access'] },
    ],
  },
  '4': {
    id: '4',
    name: 'Titan Athletic Performance',
    status: 'Audited Gold',
    rating: 4.9,
    reviewsCount: 112,
    address: 'Road No. 36, Jubilee Hills',
    city: 'Hyderabad, Telangana 500033',
    phone: '+91 98490 12345',
    hours: '05:30 AM – 10:30 PM (Mon-Sat)',
    pricing: '₹ 2,750 / mo',
    totalPlatesKg: 3500,
    maxDumbbellKg: 65,
    trainersMale: 4,
    trainersFemale: 2,
    coverImage: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600',
    ],
    platesBreakdown: [
      { weight: '25 kg (Red)', count: 52, brand: 'Eleiko IPF Calibrated', color: 'bg-red-600' },
      { weight: '20 kg (Blue)', count: 36, brand: 'Eleiko IPF Calibrated', color: 'bg-blue-600' },
      { weight: '10 kg (Green)', count: 24, brand: 'Eleiko IPF Calibrated', color: 'bg-emerald-600' },
    ],
    barbells: [
      { name: 'Eleiko IPF Competition Power Bar', spec: '29mm, 20kg, 215k PSI', count: 6 },
      { name: 'Texas Deadlift Bar', spec: '27mm, 20kg, Flexible Whip', count: 3 },
    ],
    racksAndPlatforms: [
      { name: 'ER Equipment Competition Combo Racks', count: 4 },
      { name: 'Oak Lifting Platforms with Band Pegs', count: 4 },
    ],
    amenities: ['Eleiko Calibrated Plates', 'Deadlift Jacks', 'Chalk Allowed', 'Recovery Cold Plunge', 'Physiotherapy'],
    memberships: [
      { title: 'Day Pass', price: '₹ 450', duration: '1 Day', features: ['Full gym & platform access'] },
      { title: 'Monthly Pass', price: '₹ 2,750', duration: 'Monthly', features: ['Unlimited access', 'Free Locker'] },
    ],
  },
  '5': {
    id: '5',
    name: 'Apex Power & Barbell Lab',
    status: 'Audited Gold',
    rating: 4.8,
    reviewsCount: 86,
    address: 'North Main Road, Koregaon Park',
    city: 'Pune, Maharashtra 411001',
    phone: '+91 98230 98765',
    hours: '06:00 AM – 10:00 PM (Mon-Sat)',
    pricing: '₹ 2,399 / mo',
    totalPlatesKg: 2900,
    maxDumbbellKg: 60,
    trainersMale: 3,
    trainersFemale: 2,
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
    ],
    platesBreakdown: [
      { weight: '25 kg (Red)', count: 44, brand: 'Bullrock Calibrated Steel', color: 'bg-red-600' },
      { weight: '20 kg (Blue)', count: 30, brand: 'Bullrock Calibrated Steel', color: 'bg-blue-600' },
      { weight: '10 kg (Green)', count: 20, brand: 'Bullrock Calibrated Steel', color: 'bg-emerald-600' },
    ],
    barbells: [
      { name: 'Bullrock Sabertooth 29mm', spec: '20kg Power Bar', count: 6 },
      { name: 'Rogue Ohio Power Bar', spec: '29mm Black Zinc', count: 4 },
    ],
    racksAndPlatforms: [
      { name: 'Competition Combo Racks', count: 4 },
      { name: 'Silencer Deadlift Platforms', count: 3 },
    ],
    amenities: ['Calibrated Weights', 'Steam & Sauna', 'Sports Massage', 'Free Wi-Fi'],
    memberships: [
      { title: 'Day Pass', price: '₹ 399', duration: '1 Day', features: ['Full access'] },
      { title: 'Monthly Pass', price: '₹ 2,399', duration: 'Monthly', features: ['Unlimited access'] },
    ],
  },
  '6': {
    id: '6',
    name: 'Olympus Strength Sanctuary',
    status: 'Audited Gold',
    rating: 4.9,
    reviewsCount: 104,
    address: 'Block EP & GP, Sector V, Salt Lake',
    city: 'Kolkata, West Bengal 700091',
    phone: '+91 98300 45678',
    hours: '05:30 AM – 10:30 PM (Mon-Sat)',
    pricing: '₹ 2,299 / mo',
    totalPlatesKg: 3100,
    maxDumbbellKg: 65,
    trainersMale: 4,
    trainersFemale: 2,
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600',
    ],
    platesBreakdown: [
      { weight: '25 kg (Red)', count: 46, brand: 'Eleiko IPF Competition', color: 'bg-red-600' },
      { weight: '20 kg (Blue)', count: 32, brand: 'Eleiko IPF Competition', color: 'bg-blue-600' },
      { weight: '10 kg (Green)', count: 24, brand: 'Bullrock Calibrated', color: 'bg-emerald-600' },
    ],
    barbells: [
      { name: 'Eleiko 29mm Competition Bar', spec: 'IPF Approved 20kg', count: 5 },
      { name: 'Bullrock Sabertooth Power Bar', spec: '29mm, 20kg', count: 5 },
    ],
    racksAndPlatforms: [
      { name: 'IPF Spec Combo Racks', count: 4 },
      { name: 'Solid Wood Deadlift Platforms', count: 4 },
    ],
    amenities: ['Calibrated Plates', 'Ice Bath Recovery', 'Chalk Stations', 'Sports Cafe'],
    memberships: [
      { title: 'Day Pass', price: '₹ 399', duration: '1 Day', features: ['Full access'] },
      { title: 'Monthly Pass', price: '₹ 2,299', duration: 'Monthly', features: ['Unlimited access'] },
    ],
  },
};

export default function GymDetailPage() {
  const params = useParams();
  const gymId = (params?.id as string) || '1';
  const gym: GymDetail = FALLBACK_GYMS[gymId] || FALLBACK_GYMS['1'];

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(gym.memberships[0]?.title || '');
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');

  const handleBookPass = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 5000);
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-10 text-white">
      
      {/* Toast Notification */}
      {bookingSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-black px-6 py-4 rounded-2xl font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-black" />
          <span>Pass reserved at {gym.name}! Verification code sent to {leadPhone || 'your phone'}.</span>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-muted flex-wrap">
        <Link href="/gyms" className="hover:text-gold flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Audited Gyms Radar
        </Link>
        <span>/</span>
        <span className="text-slate-400">{gym.city}</span>
        <span>/</span>
        <span className="text-slate-300 font-semibold">{gym.name}</span>
      </nav>

      {/* Gym Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 h-72 sm:h-96">
        <img src={gym.coverImage} alt={gym.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-gold text-black font-black text-xs uppercase tracking-wider shadow-gold-glow flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-black" /> {gym.status}
            </span>
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-black/60 backdrop-blur text-xs font-bold text-gold">
              <Star className="w-3.5 h-3.5 fill-gold" /> {gym.rating} ({gym.reviewsCount} verified lifter reviews)
            </div>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white">{gym.name}</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gold flex-shrink-0" /> {gym.address}, {gym.city}
          </p>
        </div>
      </div>

      {/* Quick Specs Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Calibrated Plates', value: `${gym.totalPlatesKg.toLocaleString()} kg`, icon: Dumbbell },
          { label: 'Max Dumbbells', value: `${gym.maxDumbbellKg} kg pairs`, icon: Award },
          { label: 'Certified Coaches', value: `${gym.trainersMale}M / ${gym.trainersFemale}F Staff`, icon: Users },
          { label: 'Operating Hours', value: gym.hours, icon: Clock },
        ].map((item, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-2xl border border-white/5">
            <item.icon className="w-5 h-5 text-gold mb-2" />
            <div className="text-lg font-black text-white">{item.value}</div>
            <div className="text-[11px] text-muted uppercase font-bold mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Equipment Audit Dossier */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Calibrated Plate Stock */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gold/30 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-gold" /> Calibrated Plate Stock (IPF Inspected)
                </h2>
                <p className="text-xs text-muted mt-1">Every plate in this inventory is verified within ±10g tolerance.</p>
              </div>
              <span className="font-mono font-bold text-gold text-sm">{gym.totalPlatesKg.toLocaleString()} kg Total</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {gym.platesBreakdown.map((plate, pIdx) => (
                <div key={pIdx} className="p-3.5 rounded-2xl bg-surface border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-4 h-4 rounded-full ${plate.color} shadow-sm`} />
                    <div>
                      <div className="font-bold text-sm text-white">{plate.weight}</div>
                      <div className="text-[10px] text-muted">{plate.brand}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-base text-gold">{plate.count}x</span>
                    <span className="block text-[9px] text-muted uppercase font-bold">In Stock</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Barbells & Racks */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-gold" /> Competition Barbells & Combo Racks
            </h2>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gold uppercase tracking-wider">Barbell Arsenal</h3>
              <div className="space-y-2">
                {gym.barbells.map((bb, bIdx) => (
                  <div key={bIdx} className="p-4 rounded-xl bg-surface border border-white/5 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-sm text-white">{bb.name}</div>
                      <div className="text-xs text-muted mt-0.5">{bb.spec}</div>
                    </div>
                    <span className="font-mono font-bold text-sm text-white bg-black/40 px-3 py-1 rounded-lg border border-white/10">
                      {bb.count} Bars
                    </span>
                  </div>
                ))}
              </div>

              <h3 className="text-xs font-bold text-gold uppercase tracking-wider pt-2">Platforms & Racks</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {gym.racksAndPlatforms.map((rack, rIdx) => (
                  <div key={rIdx} className="p-3.5 rounded-xl bg-surface border border-white/5 flex justify-between items-center">
                    <span className="text-xs text-slate-200 font-medium">{rack.name}</span>
                    <span className="font-mono font-bold text-xs text-gold ml-2">{rack.count}x</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
            <h2 className="text-lg font-black text-white">Facility Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {gym.amenities.map((amenity, aIdx) => (
                <span key={aIdx} className="px-3.5 py-1.5 rounded-xl bg-surface border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-gold" /> {amenity}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Book Pass & Membership Plans */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          
          {/* Booking Card */}
          <div className="glass-panel p-6 rounded-3xl border border-gold/40 shadow-card-dark space-y-6">
            <div>
              <span className="text-[10px] font-mono text-gold uppercase font-black tracking-wider">Instant Access</span>
              <h3 className="text-2xl font-black text-white mt-1">Book Training Pass</h3>
              <p className="text-xs text-muted mt-1">Direct check-in with Athloboard Verified Badge.</p>
            </div>

            <form onSubmit={handleBookPass} className="space-y-4">
              <div>
                <label className="block text-[11px] text-muted uppercase font-bold mb-1.5">Select Pass</label>
                <div className="space-y-2">
                  {gym.memberships.map((plan, plIdx) => (
                    <div
                      key={plIdx}
                      onClick={() => setSelectedPlan(plan.title)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                        selectedPlan === plan.title 
                          ? 'border-gold bg-gold/10' 
                          : 'border-white/10 bg-surface hover:bg-surfaceHover'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-white">{plan.title}</div>
                        <div className="text-[10px] text-muted">{plan.duration}</div>
                      </div>
                      <div className="font-mono font-black text-sm text-gold">{plan.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-muted uppercase font-bold mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Singh"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-xs outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] text-muted uppercase font-bold mb-1">Mobile Number (WhatsApp)</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-xs outline-none focus:border-gold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gold hover:bg-gold-glow text-black font-black text-xs shadow-gold-glow transition-all hover:scale-105"
              >
                Reserve Training Pass Now
              </button>
            </form>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
              <a
                href={`tel:${gym.phone}`}
                className="w-full py-2.5 rounded-xl bg-surface hover:bg-surfaceHover border border-white/10 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-gold" /> Call Front Desk ({gym.phone})
              </a>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(gym.name + ' ' + gym.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-surface hover:bg-surfaceHover border border-white/10 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <NavigationIcon className="w-3.5 h-3.5 text-gold" /> Get GPS Directions
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

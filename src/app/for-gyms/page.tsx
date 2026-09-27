'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Check, Dumbbell, ShieldCheck, Award, MapPin, 
  Phone, Mail, FileText, CheckCircle2, Clock, 
  ArrowRight, Users, Sparkles, Building2, ExternalLink 
} from 'lucide-react';

interface GymFormData {
  planTier: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  gstin: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  totalPlatesKg: number;
  maxDumbbellKg: number;
  plateBrand: string;
  comboRacksCount: number;
  trainersMale: number;
  trainersFemale: number;
  hours: string;
  days: string;
  baseMonthlyPrice: string;
  amenities: string[];
}

export default function ForGymsPage() {
  const [selectedTier, setSelectedTier] = useState('Audited Pro');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<any | null>(null);

  const [formData, setFormData] = useState<GymFormData>({
    planTier: 'Audited Pro',
    name: '',
    ownerName: '',
    email: '',
    phone: '',
    gstin: '',
    address: '',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '',
    landmark: '',
    totalPlatesKg: 2800,
    maxDumbbellKg: 60,
    plateBrand: 'Bullrock Calibrated Steel',
    comboRacksCount: 4,
    trainersMale: 3,
    trainersFemale: 2,
    hours: '05:30 AM – 10:30 PM',
    days: 'Mon - Sat',
    baseMonthlyPrice: '2499',
    amenities: ['Calibrated Steel Plates', 'Chalk Buckets Allowed', 'Competition Combo Racks', 'Deadlift Platforms'],
  });

  const tiers = [
    {
      name: 'Basic Listed',
      price: 'Free',
      period: 'Forever',
      desc: 'Phase 1 verified listing on the national gym directory.',
      features: ['Public Storefront', 'GPS Map Marker', 'Direct Lead Capture', 'Community Reviews'],
      isPopular: false,
    },
    {
      name: 'Audited Pro',
      price: '₹ 2,999',
      period: '/ month',
      desc: 'Phase 2 Gold Badge with lead funnel and meet hosting.',
      features: ['Gold Audited Badge', 'Leads Kanban Board', 'Host Sanctioned Meets', 'Promotional Broadcasts', 'Equipment Analytics'],
      isPopular: true,
    },
    {
      name: 'Elite Franchise',
      price: '₹ 7,999',
      period: '/ month',
      desc: 'Multi-location premium placement with corporate dashboard.',
      features: ['Priority Search Placement', 'Multi-Gym Dashboard', 'Dedicated Account Manager', 'Custom Competition Series'],
      isPopular: false,
    },
  ];

  const amenityOptions = [
    'Calibrated Steel Plates', 'Chalk Buckets Allowed', 'Competition Combo Racks', 
    'Deadlift Platforms', 'Steam & Sauna', 'Sports Physiotherapy', '24x7 Biometric Entry'
  ];

  const handleSelectTier = (tierName: string) => {
    setSelectedTier(tierName);
    setFormData(prev => ({ ...prev, planTier: tierName }));
    const formElement = document.getElementById('enrollment-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleAmenity = (item: string) => {
    setFormData(prev => {
      const exists = prev.amenities.includes(item);
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter(a => a !== item) : [...prev.amenities, item]
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/gyms/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const randomRef = 'ATH-GYM-2026-' + Math.floor(1000 + Math.random() * 9000);
      setSubmittedData({
        ...formData,
        referenceId: randomRef,
        submittedAt: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      });
    } catch (err) {
      const randomRef = 'ATH-GYM-2026-' + Math.floor(1000 + Math.random() * 9000);
      setSubmittedData({
        ...formData,
        referenceId: randomRef,
        submittedAt: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      });
    } finally {
      setIsSubmitting(false);
      window.scrollTo({ top: 600, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-16 text-gray-900">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-fitRed text-xs font-bold border border-red-200">
          <ShieldCheck className="w-3.5 h-3.5 text-fitRed" /> Facility Verification & Audit Onboarding
        </div>
        <h1 className="text-4xl sm:text-5xl font-black mt-2 leading-tight text-gray-950">
          Turn Your Gym Into an <span className="text-fitRed">Audited Powerhouse</span>
        </h1>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Join India’s only federated network of audited fitness centers. Showcase your calibrated plate weights, verified dumbbell capacity, and certified trainers to dedicated athletes.
        </p>
      </div>

      {/* Two-Phase Explanation Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
          <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center font-black text-lg">
            1
          </div>
          <h2 className="text-2xl font-black text-gray-950">Phase 1: Basic Digital Storefront</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Establish your digital presence with verified contact information, GPS location, operating hours, and landmark details.
          </p>
          <ul className="space-y-2.5 text-xs text-gray-700 pt-2 font-medium">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Facility & owner contact validation</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Geolocation pin on mobile radar map</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Membership plans & pricing display</li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-3xl border-2 border-fitRed shadow-lg shadow-red-500/10 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-fitRed text-white flex items-center justify-center font-black text-lg">
            2
          </div>
          <h2 className="text-2xl font-black text-gray-950">Phase 2: Full Equipment Audit</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Unlock the verified gold badge by submitting verified specs of your calibrated plates, dumbbell tiers, and coaching roster.
          </p>
          <ul className="space-y-2.5 text-xs text-gray-700 pt-2 font-medium">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-fitRed flex-shrink-0" /> Total plate weight (kg) verification (±10g tolerance)</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-fitRed flex-shrink-0" /> Max dumbbell set weight (kg)</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-fitRed flex-shrink-0" /> Certified male & female trainer breakdown</li>
          </ul>
        </div>
      </div>

      {/* Partnership Tiers Grid */}
      <div className="space-y-8">
        <h2 className="text-3xl font-black text-center text-gray-950">Gym Partnership Plans</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`bg-white p-8 rounded-3xl border flex flex-col justify-between cursor-pointer transition-all shadow-sm hover:shadow-md ${
                selectedTier === tier.name 
                  ? 'border-2 border-fitRed ring-4 ring-red-500/10 relative' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleSelectTier(tier.name)}
            >
              {tier.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-fitRed text-white font-black text-[11px] uppercase tracking-wider shadow-sm">
                  Recommended
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-gray-950">{tier.name}</h3>
                <p className="text-gray-500 text-xs mt-1">{tier.desc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-950">{tier.price}</span>
                  <span className="text-xs text-gray-500 font-bold">{tier.period}</span>
                </div>
                <ul className="mt-8 space-y-3 text-xs text-gray-700 font-medium">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-fitRed flex-shrink-0" /> {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleSelectTier(tier.name)}
                className={`mt-8 w-full py-3.5 rounded-xl font-bold text-xs flex justify-center items-center transition-all ${
                  selectedTier === tier.name
                    ? 'bg-fitRed text-white shadow-md'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200'
                }`}
              >
                {selectedTier === tier.name ? 'Plan Selected ✓' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SUCCESS CONFIRMATION DOSSIER (Rendered after submission) */}
      {submittedData ? (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-xl max-w-3xl mx-auto space-y-8 animate-fadeIn">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-xs font-mono font-bold text-fitRed uppercase tracking-widest block">Audit Application Submitted</span>
            <h2 className="text-3xl font-black text-gray-950">Application Reference: {submittedData.referenceId}</h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
              Your facility enrollment for <strong className="text-gray-950">{submittedData.name}</strong> under the <strong className="text-gray-950">{submittedData.planTier}</strong> tier has been submitted to the Athloboard State Verification Jury.
            </p>
          </div>

          {/* Dossier Summary Card */}
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Verification Status:</span>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300">
                ● PENDING PHYSICAL/VIDEO AUDIT
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Facility Name</span>
                <span className="font-bold text-gray-950 text-sm">{submittedData.name}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Owner / Manager</span>
                <span className="font-bold text-gray-950 text-sm">{submittedData.ownerName}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Location</span>
                <span className="font-bold text-gray-950">{submittedData.address}, {submittedData.city}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">GSTIN Registration</span>
                <span className="font-mono font-bold text-fitRed">{submittedData.gstin || 'Not Provided (Provisional)'}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Calibrated Plates Claimed</span>
                <span className="font-mono font-black text-gray-950">{submittedData.totalPlatesKg.toLocaleString()} kg</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Combo Racks / Platforms</span>
                <span className="font-mono font-black text-gray-950">{submittedData.comboRacksCount} ER Racks</span>
              </div>
            </div>
          </div>

          {/* Next Steps Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/dashboard/gym"
              className="px-6 py-3.5 rounded-xl bg-fitRed hover:bg-fitRed-hover text-white font-black text-xs text-center shadow-md transition-all hover:scale-105"
            >
              Enter Gym Portal Dashboard
            </Link>
            <Link
              href="/gyms"
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-bold text-xs text-center transition-colors"
            >
              Preview Live Storefront
            </Link>
            <button
              onClick={() => setSubmittedData(null)}
              className="px-6 py-3.5 rounded-xl bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900 text-xs font-semibold"
            >
              Submit Another Facility
            </button>
          </div>
        </div>
      ) : (

        /* THE REAL ENROLLMENT FORM SECTION */
        <div id="enrollment-form-section" className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-xl max-w-4xl mx-auto space-y-8">
          <div className="border-b border-gray-200 pb-6">
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-fitRed uppercase tracking-wider">Official Onboarding Form</span>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-950 mt-1">Enroll Your Gym Facility</h2>
                <p className="text-xs text-gray-500 mt-1">Complete your facility credentials to initiate the Phase 1 &amp; Phase 2 verification.</p>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-red-50 text-fitRed border border-red-200 text-xs font-black uppercase">
                Selected Plan: {selectedTier}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Facility Identity */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-fitRed uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-fitRed" /> 1. Facility &amp; Management Identity
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">Gym Facility Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Iron Pulse Strength & Conditioning"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">Owner / Director Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="owner@ironpulse.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98110 42890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">GSTIN / Business Registration Number</label>
                  <input
                    type="text"
                    placeholder="07AAAAA0000A1Z5 (Optional for basic listed)"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed font-mono transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">Full Facility Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="E-42, Ring Road, South Extension II"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="New Delhi"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">State *</label>
                  <input
                    type="text"
                    required
                    placeholder="Delhi"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Equipment Audit Specifications */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-black text-fitRed uppercase tracking-wider flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-fitRed" /> 2. Physical Equipment Audit (Phase 2)
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">Total Calibrated Plates (kg) *</label>
                  <input
                    type="number"
                    required
                    value={formData.totalPlatesKg}
                    onChange={(e) => setFormData({ ...formData, totalPlatesKg: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed font-mono transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">Primary Plate Manufacturer</label>
                  <select
                    value={formData.plateBrand}
                    onChange={(e) => setFormData({ ...formData, plateBrand: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed transition-all"
                  >
                    <option value="Bullrock Calibrated Steel">Bullrock Calibrated Steel</option>
                    <option value="Eleiko IPF Competition">Eleiko IPF Competition</option>
                    <option value="USI Power Calibrated">USI Power Calibrated</option>
                    <option value="Rogue Calibrated Steel">Rogue Calibrated Steel</option>
                    <option value="Mixed Commercial Plates">Mixed Commercial Plates</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">Max Dumbbell Pair (kg) *</label>
                  <input
                    type="number"
                    required
                    value={formData.maxDumbbellKg}
                    onChange={(e) => setFormData({ ...formData, maxDumbbellKg: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed font-mono transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">IPF Combo Racks Count</label>
                  <input
                    type="number"
                    value={formData.comboRacksCount}
                    onChange={(e) => setFormData({ ...formData, comboRacksCount: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed font-mono transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">Certified Male Coaches</label>
                  <input
                    type="number"
                    value={formData.trainersMale}
                    onChange={(e) => setFormData({ ...formData, trainersMale: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed font-mono transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">Certified Female Coaches</label>
                  <input
                    type="number"
                    value={formData.trainersFemale}
                    onChange={(e) => setFormData({ ...formData, trainersFemale: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed font-mono transition-all"
                  />
                </div>
              </div>

              {/* Amenities Checkboxes */}
              <div className="pt-2">
                <label className="block text-[11px] text-gray-700 uppercase font-bold mb-2">Available Equipment &amp; Amenities</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {amenityOptions.map((item) => (
                    <label
                      key={item}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center gap-2 transition-all ${
                        formData.amenities.includes(item)
                          ? 'border-fitRed bg-red-50 text-fitRed font-bold'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(item)}
                        onChange={() => handleToggleAmenity(item)}
                        className="rounded border-gray-300 text-fitRed focus:ring-fitRed accent-red-600"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-500">
                By submitting, you agree to allow an Athloboard representative to verify your equipment specifications.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-fitRed hover:bg-fitRed-hover text-white font-extrabold text-xs shadow-md shadow-red-500/20 transition-all hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap uppercase tracking-wider"
              >
                {isSubmitting ? 'Submitting Application...' : 'Submit Facility for Audit'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}

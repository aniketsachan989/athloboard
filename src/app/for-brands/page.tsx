'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, ArrowRight, Zap, Target, Search, 
  CheckCircle2, FileText, Building, Award, Check 
} from 'lucide-react';

interface BrandFormData {
  companyName: string;
  repName: string;
  email: string;
  phone: string;
  gstin: string;
  fssaiNumber: string;
  category: string;
  labPartner: string;
  coaBatchId: string;
  message: string;
}

export default function ForBrandsPage() {
  const [formData, setFormData] = useState<BrandFormData>({
    companyName: '',
    repName: '',
    email: '',
    phone: '',
    gstin: '',
    fssaiNumber: '',
    category: 'Proteins & Whey Isolates',
    labPartner: 'Eurofins Analytical Laboratories',
    coaBatchId: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<any | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const refId = 'BRAND-KYC-2026-' + Math.floor(1000 + Math.random() * 9000);
      setSubmittedData({
        ...formData,
        referenceId: refId,
        date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      });
      setIsSubmitting(false);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }, 600);
  };

  return (
    <div className="py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-20 text-gray-900">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-fitRed text-xs font-bold border border-red-200">
          <ShieldCheck className="w-3.5 h-3.5 text-fitRed" /> Anti-Counterfeit Brand Verification Network
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mt-2 leading-tight text-gray-950">
          Connect With Real, <span className="text-fitRed">Verified Athletes</span>
        </h1>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Eliminate influencer fraud and counterfeit contamination. List 100% HPLC lab-tested supplements, powerlifting gear, and authenticated nutrition products directly to athletes with verified PRs.
        </p>
      </div>

      {/* Why Partner Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-950">Why Partner With Athloboard?</h2>
          <p className="text-gray-500 text-xs mt-1">Transform your sports nutrition trust in the Indian athletic community.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Zero Influencer Fraud', icon: ShieldCheck, desc: 'Market directly to athletes who have proven their lifts with our AI video referee. No fake PRs.' },
            { title: 'Hyper-Targeted Marketing', icon: Target, desc: 'Sponsor athletes based on weight class, age division, and verified total instead of vanity metrics.' },
            { title: 'Premium Brand Positioning', icon: Zap, desc: 'Being an authenticated vendor on our network signals ultimate trust and quality to the community.' }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-gray-200 text-center flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <feature.icon className="w-8 h-8 text-fitRed mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-950 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Verification Tiers */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-950">Rigorous Verification Standards</h2>
          <p className="text-gray-500 text-xs mt-1">Our three-step audit ensures only tested, authentic nutrition reaches Indian lifters.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200 text-gray-900 flex items-center justify-center font-black">1</div>
              <h3 className="text-xl font-black text-gray-950">GSTIN &amp; FSSAI KYC</h3>
            </div>
            <p className="text-gray-600 text-xs leading-relaxed">
              Every vendor and brand undergoes mandatory GSTIN verification and corporate KYC to ensure legal business operation.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200 text-gray-900 flex items-center justify-center font-black">2</div>
              <h3 className="text-xl font-black text-gray-950">Product Audit</h3>
            </div>
            <p className="text-gray-600 text-xs leading-relaxed">
              Each product line is reviewed. Two lifetime rejected products result in an automatic, permanent merchant ban.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border-2 border-fitRed shadow-lg shadow-red-500/10 space-y-4 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-fitRed text-white flex items-center justify-center font-black">3</div>
              <h3 className="text-xl font-black text-gray-950">Independent Lab Testing</h3>
            </div>
            <p className="text-gray-600 text-xs leading-relaxed">
              Supplements require independent laboratory HPLC certificates. Gear must meet IPF technical specifications to be listed as "Competition Approved".
            </p>
          </div>
        </div>
      </section>

      {/* Brand Submission Success Dossier */}
      {submittedData ? (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-xl max-w-3xl mx-auto space-y-8 animate-fadeIn">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-xs font-mono font-bold text-fitRed uppercase tracking-widest block">Brand Onboarding Registered</span>
            <h2 className="text-3xl font-black text-gray-950">Application ID: {submittedData.referenceId}</h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
              Compliance dossier for <strong className="text-gray-950">{submittedData.companyName}</strong> has been logged. Our lab audit team will inspect your FSSAI license and HPLC certificates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-500 font-medium">KYC Compliance Tier:</span>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300">
                ● LEVEL 2: LAB COA AUDIT UNDERWAY
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Brand Entity</span>
                <span className="font-bold text-gray-950 text-sm">{submittedData.companyName}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Director / Rep</span>
                <span className="font-bold text-gray-950 text-sm">{submittedData.repName}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">FSSAI License No.</span>
                <span className="font-mono font-bold text-fitRed">{submittedData.fssaiNumber || 'Pending Document'}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">GSTIN Verified</span>
                <span className="font-mono font-bold text-emerald-600">{submittedData.gstin || '07AAAAA0000A1Z5'}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Category</span>
                <span className="font-bold text-gray-950">{submittedData.category}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Accredited Testing Partner</span>
                <span className="font-bold text-gray-950">{submittedData.labPartner}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/marketplace"
              className="px-6 py-3.5 rounded-xl bg-fitRed hover:bg-fitRed-hover text-white font-extrabold text-xs text-center shadow-md transition-all hover:scale-105 uppercase tracking-wider"
            >
              Explore Verified Marketplace
            </Link>
            <button
              onClick={() => setSubmittedData(null)}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-bold text-xs text-center transition-colors"
            >
              Submit Another Brand Application
            </button>
          </div>
        </div>
      ) : (

        /* THE REAL BRAND APPLICATION FORM */
        <section id="inquiry-form-section" className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-xl space-y-8">
          <div>
            <span className="text-xs font-mono font-bold text-fitRed uppercase tracking-wider">Official Merchant Application</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 mt-1">Apply for Brand Partnership</h2>
            <p className="text-xs text-gray-500 mt-1">Submit your corporate &amp; lab credentials to begin the listing audit.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">Company / Brand Name *</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed transition-all"
                  placeholder="e.g. Apex Nutrition Labs Pvt Ltd"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">Authorized Representative Name *</label>
                <input
                  type="text"
                  required
                  value={formData.repName}
                  onChange={(e) => setFormData({ ...formData, repName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed transition-all"
                  placeholder="e.g. Dr. Sameer Verma"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">Corporate Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed transition-all"
                  placeholder="compliance@apexlabs.in"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">Official Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed transition-all"
                  placeholder="+91 98200 44510"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">GSTIN Number *</label>
                <input
                  type="text"
                  required
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed font-mono transition-all"
                  placeholder="27AABCA1234F1Z9"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">FSSAI 14-Digit License (Nutrition)</label>
                <input
                  type="text"
                  value={formData.fssaiNumber}
                  onChange={(e) => setFormData({ ...formData, fssaiNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed font-mono transition-all"
                  placeholder="10020021000142"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">Product Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed transition-all"
                >
                  <option value="Proteins &amp; Whey Isolates">Proteins &amp; Whey Isolates</option>
                  <option value="Creatine &amp; Strength Compounds">Creatine &amp; Strength Compounds</option>
                  <option value="Powerlifting Belts &amp; Knee Sleeves">Powerlifting Belts &amp; Knee Sleeves</option>
                  <option value="Calibrated Steel Plates &amp; Barbells">Calibrated Steel Plates &amp; Barbells</option>
                  <option value="Athletic Apparel">Athletic Apparel</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">Accredited Testing Laboratory</label>
                <select
                  value={formData.labPartner}
                  onChange={(e) => setFormData({ ...formData, labPartner: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed transition-all"
                >
                  <option value="Eurofins Analytical Laboratories">Eurofins Analytical Laboratories</option>
                  <option value="TÜV SÜD South Asia">TÜV SÜD South Asia</option>
                  <option value="NABL Certified Independent Lab">NABL Certified Independent Lab</option>
                  <option value="In-House HPLC Certified Laboratory">In-House HPLC Certified Laboratory</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">COA Certificate Number / Batch Report</label>
                <input
                  type="text"
                  value={formData.coaBatchId}
                  onChange={(e) => setFormData({ ...formData, coaBatchId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed font-mono transition-all"
                  placeholder="e.g. EF-IND-2026-WHEY-0982"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">Brand Statement / Catalog Notes</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed resize-none transition-all placeholder:text-gray-400"
                  placeholder="Details regarding your manufacturing facility, heavy metal testing, and certified protein content..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-fitRed hover:bg-fitRed-hover text-white font-extrabold text-xs shadow-md shadow-red-500/20 transition-all hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit Brand KYC & Lab Dossier'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </section>
      )}

    </div>
  );
}

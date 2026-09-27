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
    <div className="py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-20 text-white">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-bold border border-gold/30">
          <ShieldCheck className="w-3.5 h-3.5 text-gold" /> Anti-Counterfeit Brand Verification Network
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mt-2 leading-tight">
          Connect With Real, <span className="text-gold">Verified Athletes</span>
        </h1>
        <p className="text-muted text-sm sm:text-base leading-relaxed">
          Eliminate influencer fraud and counterfeit contamination. List 100% HPLC lab-tested supplements, powerlifting gear, and authenticated nutrition products directly to athletes with verified PRs.
        </p>
      </div>

      {/* Why Partner Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-black">Why Partner With Athloboard?</h2>
          <p className="text-muted text-xs mt-1">Transform your sports nutrition trust in the Indian athletic community.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Zero Influencer Fraud', icon: ShieldCheck, desc: 'Market directly to athletes who have proven their lifts with our AI video referee. No fake PRs.' },
            { title: 'Hyper-Targeted Marketing', icon: Target, desc: 'Sponsor athletes based on weight class, age division, and verified total instead of vanity metrics.' },
            { title: 'Premium Brand Positioning', icon: Zap, desc: 'Being an authenticated vendor on our network signals ultimate trust and quality to the community.' }
          ].map((feature, i) => (
            <div key={i} className="glass-panel p-8 rounded-3xl border border-white/5 text-center flex flex-col justify-between">
              <div>
                <feature.icon className="w-8 h-8 text-gold mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Verification Tiers */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-black">Rigorous Verification Standards</h2>
          <p className="text-muted text-xs mt-1">Our three-step audit ensures only tested, authentic nutrition reaches Indian lifters.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface border border-white/20 flex items-center justify-center font-black">1</div>
              <h3 className="text-xl font-black">GSTIN & FSSAI KYC</h3>
            </div>
            <p className="text-muted text-xs leading-relaxed">
              Every vendor and brand undergoes mandatory GSTIN verification and corporate KYC to ensure legal business operation.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface border border-white/20 flex items-center justify-center font-black">2</div>
              <h3 className="text-xl font-black">Product Audit</h3>
            </div>
            <p className="text-muted text-xs leading-relaxed">
              Each product line is reviewed. Two lifetime rejected products result in an automatic, permanent merchant ban.
            </p>
          </div>
          
          <div className="glass-panel p-8 rounded-3xl border border-gold/30 shadow-gold-glow space-y-4 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold text-black flex items-center justify-center font-black">3</div>
              <h3 className="text-xl font-black text-gold">Independent Lab Testing</h3>
            </div>
            <p className="text-muted text-xs leading-relaxed">
              Supplements require independent laboratory HPLC certificates. Gear must meet IPF technical specifications to be listed as "Competition Approved".
            </p>
          </div>
        </div>
      </section>

      {/* Brand Submission Success Dossier */}
      {submittedData ? (
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-gold/40 shadow-2xl max-w-3xl mx-auto space-y-8 animate-fadeIn">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-xs font-mono font-bold text-gold uppercase tracking-widest block">Brand Onboarding Registered</span>
            <h2 className="text-3xl font-black text-white">Application ID: {submittedData.referenceId}</h2>
            <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto">
              Compliance dossier for <strong>{submittedData.companyName}</strong> has been logged. Our lab audit team will inspect your FSSAI license and HPLC certificates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-white/10 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="text-muted">KYC Compliance Tier:</span>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                ● LEVEL 2: LAB COA AUDIT UNDERWAY
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted block text-[10px] uppercase font-bold">Brand Entity</span>
                <span className="font-bold text-white text-sm">{submittedData.companyName}</span>
              </div>
              <div>
                <span className="text-muted block text-[10px] uppercase font-bold">Director / Rep</span>
                <span className="font-bold text-white text-sm">{submittedData.repName}</span>
              </div>
              <div>
                <span className="text-muted block text-[10px] uppercase font-bold">FSSAI License No.</span>
                <span className="font-mono font-bold text-gold">{submittedData.fssaiNumber || 'Pending Document'}</span>
              </div>
              <div>
                <span className="text-muted block text-[10px] uppercase font-bold">GSTIN Verified</span>
                <span className="font-mono font-bold text-emerald-400">{submittedData.gstin || '07AAAAA0000A1Z5'}</span>
              </div>
              <div>
                <span className="text-muted block text-[10px] uppercase font-bold">Category</span>
                <span className="font-bold text-white">{submittedData.category}</span>
              </div>
              <div>
                <span className="text-muted block text-[10px] uppercase font-bold">Accredited Testing Partner</span>
                <span className="font-bold text-white">{submittedData.labPartner}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/marketplace"
              className="px-6 py-3.5 rounded-xl bg-gold hover:bg-gold-glow text-black font-black text-xs text-center shadow-gold-glow transition-all"
            >
              Explore Verified Marketplace
            </Link>
            <button
              onClick={() => setSubmittedData(null)}
              className="px-6 py-3.5 rounded-xl bg-surface hover:bg-surfaceHover border border-white/10 text-white font-bold text-xs text-center transition-colors"
            >
              Submit Another Brand Application
            </button>
          </div>
        </div>
      ) : (

        /* THE REAL BRAND APPLICATION FORM */
        <section className="max-w-3xl mx-auto glass-panel p-8 sm:p-12 rounded-3xl border border-gold/30 bg-gradient-to-b from-surface to-background space-y-8">
          <div>
            <span className="text-xs font-mono font-bold text-gold uppercase tracking-wider">Official Merchant Application</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Apply for Brand Partnership</h2>
            <p className="text-xs text-muted mt-1">Submit your corporate & lab credentials to begin the listing audit.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-muted uppercase font-bold mb-1">Company / Brand Name *</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-white/10 text-white text-xs outline-none focus:border-gold"
                  placeholder="e.g. Apex Nutrition Labs Pvt Ltd"
                />
              </div>

              <div>
                <label className="block text-[11px] text-muted uppercase font-bold mb-1">Authorized Representative Name *</label>
                <input
                  type="text"
                  required
                  value={formData.repName}
                  onChange={(e) => setFormData({ ...formData, repName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-white/10 text-white text-xs outline-none focus:border-gold"
                  placeholder="e.g. Dr. Sameer Verma"
                />
              </div>

              <div>
                <label className="block text-[11px] text-muted uppercase font-bold mb-1">Corporate Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-white/10 text-white text-xs outline-none focus:border-gold"
                  placeholder="compliance@apexlabs.in"
                />
              </div>

              <div>
                <label className="block text-[11px] text-muted uppercase font-bold mb-1">Official Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-white/10 text-white text-xs outline-none focus:border-gold"
                  placeholder="+91 98200 44510"
                />
              </div>

              <div>
                <label className="block text-[11px] text-muted uppercase font-bold mb-1">GSTIN Number *</label>
                <input
                  type="text"
                  required
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-white/10 text-white text-xs outline-none focus:border-gold font-mono"
                  placeholder="27AABCA1234F1Z9"
                />
              </div>

              <div>
                <label className="block text-[11px] text-muted uppercase font-bold mb-1">FSSAI 14-Digit License (Nutrition)</label>
                <input
                  type="text"
                  value={formData.fssaiNumber}
                  onChange={(e) => setFormData({ ...formData, fssaiNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-white/10 text-white text-xs outline-none focus:border-gold font-mono"
                  placeholder="10020021000142"
                />
              </div>

              <div>
                <label className="block text-[11px] text-muted uppercase font-bold mb-1">Product Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-white/10 text-white text-xs outline-none focus:border-gold"
                >
                  <option value="Proteins & Whey Isolates">Proteins & Whey Isolates</option>
                  <option value="Creatine & Strength Compounds">Creatine & Strength Compounds</option>
                  <option value="Powerlifting Belts & Knee Sleeves">Powerlifting Belts & Knee Sleeves</option>
                  <option value="Calibrated Steel Plates & Barbells">Calibrated Steel Plates & Barbells</option>
                  <option value="Athletic Apparel">Athletic Apparel</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-muted uppercase font-bold mb-1">Accredited Testing Laboratory</label>
                <select
                  value={formData.labPartner}
                  onChange={(e) => setFormData({ ...formData, labPartner: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-white/10 text-white text-xs outline-none focus:border-gold"
                >
                  <option value="Eurofins Analytical Laboratories">Eurofins Analytical Laboratories</option>
                  <option value="TÜV SÜD South Asia">TÜV SÜD South Asia</option>
                  <option value="NABL Certified Independent Lab">NABL Certified Independent Lab</option>
                  <option value="In-House HPLC Certified Laboratory">In-House HPLC Certified Laboratory</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] text-muted uppercase font-bold mb-1">COA Certificate Number / Batch Report</label>
                <input
                  type="text"
                  value={formData.coaBatchId}
                  onChange={(e) => setFormData({ ...formData, coaBatchId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-white/10 text-white text-xs outline-none focus:border-gold font-mono"
                  placeholder="e.g. EF-IND-2026-WHEY-0982"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] text-muted uppercase font-bold mb-1">Brand Statement / Catalog Notes</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-white/10 text-white text-xs outline-none focus:border-gold resize-none"
                  placeholder="Details regarding your manufacturing facility, heavy metal testing, and certified protein content..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gold hover:bg-gold-glow text-black font-black text-xs shadow-gold-glow transition-all hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
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

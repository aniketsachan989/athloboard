'use client';

import { ShieldCheck, ArrowRight, Zap, Target, Search } from 'lucide-react';
import { useState } from 'react';

export default function ForBrandsPage() {
  const [formData, setFormData] = useState({ name: '', brand: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your interest! Our team will contact you shortly.');
    setFormData({ name: '', brand: '', email: '', message: '' });
  };

  return (
    <div className="py-16 px-6 max-w-7xl mx-auto space-y-24">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-black text-gold uppercase tracking-widest">Brand & Vendor Network</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mt-2 leading-tight">
          Connect With Real, <span className="text-gold">Verified Athletes</span>
        </h1>
        <p className="text-muted mt-6 text-sm sm:text-base leading-relaxed">
          Eliminate influencer fraud. List lab-tested supplements, powerlifting gear, and authenticated nutrition products directly to athletes with verified PRs. Target marketing based on real performance data, not follower counts.
        </p>
      </div>

      {/* Why Partner Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black">Why Partner With Athloboard?</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Zero Influencer Fraud', icon: ShieldCheck, desc: 'Market directly to athletes who have proven their lifts with our AI video referee. No fake PRs.' },
            { title: 'Hyper-Targeted Marketing', icon: Target, desc: 'Sponsor athletes based on weight class, age division, and verified total instead of vanity metrics.' },
            { title: 'Premium Brand Positioning', icon: Zap, desc: 'Being an authenticated vendor on our network signals ultimate trust and quality to the community.' }
          ].map((feature, i) => (
            <div key={i} className="glass-panel p-8 rounded-3xl border border-white/5 text-center">
              <feature.icon className="w-8 h-8 text-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Verification Tiers */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black">Rigorous Verification Standards</h2>
          <p className="text-muted mt-2">Our three-step audit ensures only the best reach our athletes.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-3xl border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-surface border border-white/20 flex items-center justify-center font-black">1</div>
              <h2 className="text-xl font-black">GSTIN & KYC</h2>
            </div>
            <p className="text-muted text-sm">
              Every vendor and brand undergoes mandatory GSTIN verification and corporate KYC to ensure legal business operation.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-surface border border-white/20 flex items-center justify-center font-black">2</div>
              <h2 className="text-xl font-black">Product Audit</h2>
            </div>
            <p className="text-muted text-sm">
              Each product line is reviewed. Two lifetime rejected products result in an automatic, permanent merchant ban.
            </p>
          </div>
          
          <div className="glass-panel p-8 rounded-3xl border border-gold/30 shadow-gold-glow relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Search className="w-24 h-24" />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gold text-black flex items-center justify-center font-black">3</div>
              <h2 className="text-xl font-black text-gold">Lab Testing</h2>
            </div>
            <p className="text-muted text-sm relative z-10">
              Supplements require independent laboratory HPLC certificates. Gear must meet IPF technical specifications to be listed as "Competition Approved".
            </p>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="max-w-2xl mx-auto glass-panel p-8 sm:p-12 rounded-3xl border-t border-white/10 bg-gradient-to-b from-surface to-background">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black">Apply for Partnership</h2>
          <p className="text-muted text-sm mt-2">Submit your brand details to begin the verification process.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted mb-1.5 uppercase">Full Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 text-sm focus:border-gold outline-none" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted mb-1.5 uppercase">Brand Name</label>
              <input type="text" required value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 text-sm focus:border-gold outline-none" placeholder="Titan Nutrition" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-muted mb-1.5 uppercase">Business Email</label>
            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 text-sm focus:border-gold outline-none" placeholder="contact@brand.com" />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted mb-1.5 uppercase">Message (Optional)</label>
            <textarea rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 text-sm focus:border-gold outline-none" placeholder="Tell us about your products..." />
          </div>
          <button type="submit" className="w-full py-4 mt-2 rounded-xl bg-gold text-black font-black text-sm hover:bg-gold-glow shadow-gold-glow transition-all flex items-center justify-center gap-2">
            Submit Application <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </section>
    </div>
  );
}

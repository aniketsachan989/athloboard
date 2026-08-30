import { Check, ShieldCheck, Tag, Award, Users, ArrowRight } from 'lucide-react';

export default function ForBrandsPage() {
  return (
    <div className="py-16 px-6 max-w-7xl mx-auto space-y-16">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-black text-gold uppercase tracking-widest">Brand & Vendor Network</span>
        <h1 className="text-4xl sm:text-5xl font-black mt-2 leading-tight">
          Connect With Real, <span className="text-gold">Verified Athletes</span>
        </h1>
        <p className="text-muted mt-4 text-sm sm:text-base leading-relaxed">
          Eliminate influencer fraud. List lab-tested supplements, powerlifting gear, and authenticated nutrition products directly to athletes with verified PRs.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-3xl border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-black">1</div>
            <h2 className="text-xl font-black">GSTIN & Corporate KYC</h2>
          </div>
          <p className="text-muted text-sm">
            Every vendor and brand undergoes mandatory GSTIN verification. GSTIN numbers are globally unique across all businesses.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-gold/30 shadow-gold-glow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gold text-black flex items-center justify-center font-black">2</div>
            <h2 className="text-xl font-black">Product-by-Product Audit</h2>
          </div>
          <p className="text-muted text-sm">
            Each product requires independent laboratory review before going live. Two lifetime rejected products result in an automatic, permanent merchant ban.
          </p>
        </div>
      </div>
    </div>
  );
}

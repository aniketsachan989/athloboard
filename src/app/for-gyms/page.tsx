import { Check } from 'lucide-react';
import Link from 'next/link';

export default function ForGymsPage() {
  return (
    <div className="py-16 px-6 max-w-7xl mx-auto space-y-16">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-black text-gold uppercase tracking-widest">Facility Partnerships</span>
        <h1 className="text-4xl sm:text-5xl font-black mt-2 leading-tight">
          Turn Your Gym Into an <span className="text-gold">Audited Powerhouse</span>
        </h1>
        <p className="text-muted mt-4 text-sm sm:text-base leading-relaxed">
          Join India’s only federated network of audited fitness centers. Showcase your calibrated plate weights, verified dumbbell capacity, and certified trainers to dedicated athletes.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-3xl border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 text-gold flex items-center justify-center font-black text-lg mb-4">
            1
          </div>
          <h2 className="text-2xl font-black">Phase 1: Basic Digital Storefront</h2>
          <p className="text-muted text-sm mt-2">
            Establish your digital presence with verified contact information, GPS location, operating hours, and landmark details.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-white/80">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold" /> Facility & owner contact validation</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold" /> Geolocation pin on mobile radar map</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold" /> Membership plans & pricing display</li>
          </ul>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-gold/30 shadow-gold-glow">
          <div className="w-10 h-10 rounded-xl bg-gold text-black flex items-center justify-center font-black text-lg mb-4">
            2
          </div>
          <h2 className="text-2xl font-black">Phase 2: Full Equipment Audit</h2>
          <p className="text-muted text-sm mt-2">
            Unlock the verified gold badge by submitting photos and verified specs of your calibrated plates, dumbbell tiers, and coaching roster.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-white/80">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold" /> Total plate weight (kg) verification</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold" /> Max dumbbell set weight (kg)</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold" /> Certified male & female trainer breakdown</li>
          </ul>
        </div>
      </div>

      <div className="pt-8">
        <h2 className="text-3xl font-black text-center mb-8">Gym Partnership Plans</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
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
          ].map((tier, idx) => (
            <div
              key={idx}
              className={`glass-panel p-8 rounded-3xl flex flex-col justify-between ${
                tier.isPopular ? 'border-gold shadow-gold-glow relative' : 'border-white/10'
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gold text-black font-black text-[11px] uppercase tracking-wider">
                  Recommended
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold">{tier.name}</h3>
                <p className="text-muted text-xs mt-1">{tier.desc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">{tier.price}</span>
                  <span className="text-xs text-muted font-bold">{tier.period}</span>
                </div>
                <ul className="mt-8 space-y-3 text-xs text-white/80">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold flex-shrink-0" /> {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/dashboard/gym"
                className={`mt-8 w-full py-3.5 rounded-xl font-bold text-xs flex justify-center items-center transition-all ${
                  tier.isPopular
                    ? 'bg-gold text-black hover:bg-gold-glow shadow-gold-glow'
                    : 'bg-surface hover:bg-surfaceHover text-white border border-white/10'
                }`}
              >
                Enroll Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

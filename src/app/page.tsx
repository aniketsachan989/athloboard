import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Trophy, Dumbbell, Award, Flame } from 'lucide-react';

const BarbellHeroScene = dynamic(() => import('@/components/3d/BarbellHeroScene'), { ssr: false });

export default function HomePage() {
  return (
    <div className="relative w-full overflow-hidden">
      {/* 1. HERO SECTION WITH 3D FULL-SCREEN BACKGROUND */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Full-Screen 3D Barbell Background Scene */}
        <BarbellHeroScene />

        {/* Foreground Content floating above 3D Scene */}
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center pt-8 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-gold/40 text-gold text-xs font-black tracking-widest uppercase mb-6 shadow-gold-glow animate-pulse">
            <Flame className="w-3.5 h-3.5" /> India’s Federated Strength Ecosystem
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white max-w-5xl leading-[1.05] drop-shadow-2xl">
            RECORD. VERIFY. <span className="text-gold">DOMINATE.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-200 max-w-2xl leading-relaxed font-medium drop-shadow">
            The verified-identity strength network. Prove your lifts with IPF-refereed video, discover audited powerlifting gyms, and compete on national leaderboards.
          </p>

          {/* CTA Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
            <Link
              href="/gyms"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-black text-black bg-gold hover:bg-gold-glow shadow-gold-glow text-base flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              Explore Verified Gyms <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/for-gyms"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-surface/90 hover:bg-surfaceHover border border-white/20 text-base backdrop-blur-md transition-colors"
            >
              Enroll Your Gym
            </Link>
          </div>
        </div>
      </section>

      {/* 2. STATS PLATE COUNTER (Physical Metal Plate Aesthetic) */}
      <section className="border-y border-white/5 bg-elevated py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Verified Lifts Audited', value: '14,850+', icon: ShieldCheck },
            { label: 'Audited Gyms Active', value: '450+', icon: Dumbbell },
            { label: 'National Meets Hosted', value: '85+', icon: Trophy },
            { label: 'Lift Points Rewarded', value: '1.2M+', icon: Award },
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl">
              <stat.icon className="w-6 h-6 text-gold mx-auto mb-2" />
              <div className="text-3xl sm:text-4xl font-black text-white">{stat.value}</div>
              <div className="text-xs font-semibold text-muted mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FOUR PILLARS STORYTELLING */}
      <section className="py-24 px-6 max-w-7xl mx-auto space-y-24">
        {/* Pillar 1: Athletes */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-black text-gold uppercase tracking-widest">For Serious Lifters</span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2 leading-tight">
              AI-Powered CameraX Video Refereeing
            </h2>
            <p className="text-muted mt-4 text-sm sm:text-base leading-relaxed">
              No fake PRs or unvalidated claims. Record Squat, Bench Press, and Deadlift sets inside the mobile app. AI angle verification audits depth, lockout, and bar path under IPF powerlifting rules.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/90">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold" /> Automatic depth angle & pause verification
              </li>
              <li className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-gold" /> Live national & state ranking leaderboards
              </li>
              <li className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gold" /> Earn Lift Points redeemable for authenticated gear
              </li>
            </ul>
          </div>
          <div className="glass-panel p-8 rounded-3xl border border-gold/20 shadow-card-dark">
            <div className="bg-background rounded-2xl p-6 border border-white/5">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="font-black text-sm text-gold">CURRENT SBD RECORD</span>
                <span className="text-xs font-bold text-green-400">● 3 WHITE LIGHTS</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center mt-6">
                <div className="p-3 rounded-lg bg-surface">
                  <div className="text-xs text-muted uppercase">Squat</div>
                  <div className="text-2xl font-black text-white mt-1">260 <span className="text-xs text-gold">kg</span></div>
                </div>
                <div className="p-3 rounded-lg bg-surface">
                  <div className="text-xs text-muted uppercase">Bench</div>
                  <div className="text-2xl font-black text-white mt-1">180 <span className="text-xs text-gold">kg</span></div>
                </div>
                <div className="p-3 rounded-lg bg-surface">
                  <div className="text-xs text-muted uppercase">Deadlift</div>
                  <div className="text-2xl font-black text-white mt-1">310 <span className="text-xs text-gold">kg</span></div>
                </div>
              </div>
              <div className="mt-6 p-3 rounded-xl bg-gold/10 border border-gold/30 text-center text-xs font-bold text-gold">
                TOTAL SBD: 750 KG • 93KG CLASS RANK #1
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 2: Gyms */}
        <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-card-dark order-2 md:order-1">
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-surface border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Iron Pulse Strength Gym</div>
                  <div className="text-xs text-muted">South Extension II, New Delhi</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-green-500/20 text-green-400 font-bold text-xs">AUDITED</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-muted">
                <div className="p-3 rounded-lg bg-background">Plate Capacity: <strong className="text-white">2,800 kg</strong></div>
                <div className="p-3 rounded-lg bg-background">Dumbbell Max: <strong className="text-white">65 kg</strong></div>
                <div className="p-3 rounded-lg bg-background">Trainers: <strong className="text-white">4 Male, 2 Female</strong></div>
                <div className="p-3 rounded-lg bg-background">IPF Combo Racks: <strong className="text-white">4 Racks</strong></div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <span className="text-xs font-black text-gold uppercase tracking-widest">For Facility Owners</span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2 leading-tight">
              Two-Phase Digital Storefronts & Lead Funnel
            </h2>
            <p className="text-muted mt-4 text-sm sm:text-base leading-relaxed">
              Showcase verified plate weights, dumbbell tiers, and certified coaching rosters. Capture targeted lifter leads with real-time Kanban management and broadcast flash memberships.
            </p>
            <div className="mt-6">
              <Link href="/for-gyms" className="inline-flex items-center gap-2 text-gold font-bold hover:underline">
                Explore Gym Partner Enrollment <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FINAL JOIN CTA */}
      <section className="bg-gradient-to-b from-elevated to-background py-20 px-6 border-t border-white/5 text-center">
        <div className="max-w-4xl mx-auto glass-panel p-12 rounded-3xl border-gold/30 shadow-gold-glow">
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Ready to Join India's Strongest Network?
          </h2>
          <p className="text-muted mt-4 text-sm sm:text-base max-w-xl mx-auto">
            Whether you are an athlete seeking verified rankings, a gym owner wanting verified members, or a brand seeking real strength ambassadors.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/for-gyms" className="px-8 py-4 rounded-xl font-black text-black bg-gold hover:bg-gold-glow shadow-gold-glow text-sm">
              Enroll as Gym Partner
            </Link>
            <Link href="/for-brands" className="px-8 py-4 rounded-xl font-bold text-white bg-surface hover:bg-surfaceHover border border-white/10 text-sm">
              Register Brand / Vendor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

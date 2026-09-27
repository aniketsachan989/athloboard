import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Trophy, Dumbbell, Award, Flame, Download, Smartphone } from 'lucide-react';

const BarbellHeroScene = dynamic(() => import('@/components/3d/BarbellHeroScene'), { ssr: false });

export default function HomePage() {
  return (
    <div className="relative w-full overflow-hidden">
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <BarbellHeroScene />

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

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 flex-wrap justify-center">
            <a
              href="/downloads/athloboard-app.apk"
              download="Athloboard-v1.0.apk"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-black text-black bg-emerald-400 hover:bg-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.35)] text-base flex items-center justify-center gap-2.5 transition-all hover:scale-105"
            >
              <Smartphone className="w-5 h-5 text-black" />
              Download Android App
              <span className="text-[11px] bg-black/15 text-black font-extrabold px-2 py-0.5 rounded-full uppercase">APK</span>
            </a>
            <Link
              href="/gyms"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-black text-black bg-gold hover:bg-gold-glow shadow-gold-glow text-base flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              Explore Verified Gyms <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/for-gyms#enrollment-form-section"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-surface/90 hover:bg-surfaceHover border border-white/20 text-base backdrop-blur-md transition-colors"
            >
              Enroll Your Gym
            </Link>
          </div>
        </div>
      </section>

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

      <section className="py-24 px-6 max-w-7xl mx-auto space-y-24">
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

            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a
                href="/downloads/athloboard-app.apk"
                download="Athloboard-v1.0.apk"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-black bg-emerald-400 hover:bg-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-sm transition-all hover:scale-105"
              >
                <Download className="w-4 h-4" /> Download Athlete App (APK)
              </a>
              <span className="text-xs text-muted font-mono">v1.0 • 16 MB • Android 8.0+</span>
            </div>
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

        {/* 6-Pillar Core Features Grid */}
        <div className="pt-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-black text-gold uppercase tracking-widest">Platform Core Modules</span>
            <h2 className="text-3xl sm:text-5xl font-black mt-2 leading-tight">
              Explore the <span className="text-gold">Full Ecosystem</span>
            </h2>
            <p className="text-muted text-sm sm:text-base mt-2">
              Every feature of Athloboard is interconnected across mobile, computer vision, web, and decentralized ledger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Leaderboard */}
            <Link href="/leaderboard" className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-gold/50 transition-all group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 text-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Trophy className="w-5 h-5 text-gold" />
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-gold transition-colors">National Leaderboard</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Official IPF dynamic rankings. Track SBD totals, Wilks/DOTS points, weight classes, and inspect video proof.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/5 flex items-center text-xs font-bold text-gold gap-1">
                <span>View All Rankings</span> <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: AI Referee Studio */}
            <Link href="/verify" className="glass-panel p-6 rounded-3xl border border-gold/30 bg-gold/5 hover:border-gold transition-all group flex flex-col justify-between shadow-gold-glow">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-gold text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5 text-black" />
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-gold transition-colors">AI Biomechanical Referee</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Live computer vision testing. Evaluates hip crease depth ($\ge 90^\circ$), motionless chest pause, and lockout.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/5 flex items-center text-xs font-bold text-gold gap-1">
                <span>Launch AI Studio</span> <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Audited Gym Radar */}
            <Link href="/gyms" className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-gold/50 transition-all group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-surface border border-white/10 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Dumbbell className="w-5 h-5 text-gold" />
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-gold transition-colors">Audited Gym Radar</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Search certified gyms with calibrated plate inventories (Bullrock/Eleiko), ER combo racks, and book day passes.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/5 flex items-center text-xs font-bold text-gold gap-1">
                <span>Inspect Facilities</span> <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4: Lab-Tested Store */}
            <Link href="/marketplace" className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-gold/50 transition-all group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-surface border border-white/10 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-gold transition-colors">Verified Marketplace</h3>
                <p className="text-xs text-muted leading-relaxed">
                  100% HPLC lab tested supplements and certified lifting gear. Amazon-style 1-click buy box and points redemption.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/5 flex items-center text-xs font-bold text-gold gap-1">
                <span>Shop Verified</span> <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 5: Sanctioned Meets */}
            <Link href="/competitions" className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-gold/50 transition-all group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-surface border border-white/10 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Flame className="w-5 h-5 text-gold" />
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-gold transition-colors">State & National Meets</h3>
                <p className="text-xs text-muted leading-relaxed">
                  View upcoming sanctioned powerlifting meets, register your weight class, and track real-time meet results.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/5 flex items-center text-xs font-bold text-gold gap-1">
                <span>Explore Meets</span> <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 6: Ecosystem Architecture */}
            <Link href="/ecosystem" className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-gold/50 transition-all group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-surface border border-white/10 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-gold transition-colors">Ecosystem & Swagger API</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Inspect the 5 decoupled layers: NestJS Gateway (:4000), FastAPI (:8000), 3-Judge Cockpit (:3001), and DB Ledger.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/5 flex items-center text-xs font-bold text-gold gap-1">
                <span>Inspect Architecture</span> <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-elevated to-background py-20 px-6 border-t border-white/5 text-center">
        <div className="max-w-4xl mx-auto glass-panel p-12 rounded-3xl border-gold/30 shadow-gold-glow">
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Ready to Join India's Strongest Network?
          </h2>
          <p className="text-muted mt-4 text-sm sm:text-base max-w-xl mx-auto">
            Whether you are an athlete seeking verified rankings, a gym owner wanting verified members, or a brand seeking real strength ambassadors.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/downloads/athloboard-app.apk"
              download="Athloboard-v1.0.apk"
              className="px-8 py-4 rounded-xl font-black text-black bg-emerald-400 hover:bg-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-sm flex items-center gap-2 transition-all hover:scale-105"
            >
              <Smartphone className="w-4 h-4" /> Download Athlete App (APK)
            </a>
            <Link href="/for-gyms#enrollment-form-section" className="px-8 py-4 rounded-xl font-black text-black bg-gold hover:bg-gold-glow shadow-gold-glow text-sm">
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

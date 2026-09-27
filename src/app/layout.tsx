import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://athloboard.com'),
  title: { default: 'Athloboard | India\'s Verified Athletic Strength Ecosystem', template: '%s | Athloboard' },
  description: "India's federated strength ecosystem. AI-verified lift videos, audited gym storefronts, and lab-tested nutrition brands.",
  keywords: ['powerlifting', 'verified gyms India', 'IPF powerlifting', 'strength training', 'lab tested supplements'],
  openGraph: { type: 'website', locale: 'en_IN', url: 'https://athloboard.com', siteName: 'Athloboard', title: 'Athloboard | Verified Athletic Strength Ecosystem', description: "AI-verified lift videos, audited gym storefronts, and lab-tested nutrition brands.", images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Athloboard' }] },
  twitter: { card: 'summary_large_image', title: 'Athloboard | Verified Strength Ecosystem', description: 'AI-verified lifts, audited gyms, and lab-tested brands.', images: ['/og-image.jpg'] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#f8f9fa] text-gray-900 min-h-screen flex flex-col selection:bg-fitRed selection:text-white">
        <Navigation />

        <main className="flex-1">{children}</main>

        {/* Fitpass-Style Comprehensive Multi-Column Footer */}
        <footer className="bg-[#121217] text-white border-t border-white/10 pt-16 pb-12 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
            
            {/* Top Bar: Brand, Value Proposition & Direct CTAs */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-10 border-b border-white/10">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-fitRed flex items-center justify-center p-1 overflow-hidden shadow-sm">
                    <img src="/logo.png" alt="Athloboard" className="w-full h-full object-contain brightness-0 invert" />
                  </div>
                  <span className="text-xl font-black tracking-tight text-white uppercase">
                    ATHLO<span className="text-fitRed">BOARD</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300 font-bold uppercase tracking-wider">
                    SIH Grand Finale
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  India’s #1 federated athletic strength ecosystem. Access 450+ audited powerlifting facilities, prove competition-valid lifts with automated AI video refereeing, and shop 100% HPLC lab-certified nutrition.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/downloads/athloboard-app.apk"
                  download="Athloboard-v1.0.apk"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-gray-950 font-bold text-xs hover:bg-gray-100 transition-all shadow-md hover:scale-105"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Download Android APK (16MB)
                </a>
                <Link
                  href="/for-gyms#enrollment-form-section"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-fitRed text-white font-extrabold text-xs hover:bg-fitRed-hover transition-all shadow-md uppercase tracking-wider hover:scale-105"
                >
                  Get Pass / Partner
                </Link>
              </div>
            </div>

            {/* 5-Column Navigation Grid (Exact Fitpass Information Architecture) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 text-slate-400">
              
              {/* Col 1: About */}
              <div className="space-y-3">
                <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">ATHLOBOARD</h4>
                <ul className="space-y-2 text-xs">
                  <li><Link href="/" className="hover:text-fitRed transition-colors">Home Page</Link></li>
                  <li><Link href="/ecosystem" className="hover:text-fitRed transition-colors">Ecosystem Architecture</Link></li>
                  <li><Link href="/for-gyms" className="hover:text-fitRed transition-colors">IPF Facility Standard</Link></li>
                  <li><Link href="/for-brands" className="hover:text-fitRed transition-colors">Eurofins Lab Protocol</Link></li>
                  <li><a href="http://localhost:4000/api/docs" target="_blank" rel="noopener noreferrer" className="hover:text-fitRed transition-colors">Swagger OpenAPI</a></li>
                  <li><Link href="/download" className="hover:text-fitRed transition-colors">Mobile App APK</Link></li>
                </ul>
              </div>

              {/* Col 2: Products & Features */}
              <div className="space-y-3">
                <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">PRODUCTS</h4>
                <ul className="space-y-2 text-xs">
                  <li><Link href="/gyms" className="hover:text-fitRed transition-colors">Athloboard OnePass</Link></li>
                  <li><Link href="/verify" className="hover:text-fitRed transition-colors">AI Referee Studio</Link></li>
                  <li><Link href="/marketplace" className="hover:text-fitRed transition-colors">AthloStore Verified</Link></li>
                  <li><Link href="/leaderboard" className="hover:text-fitRed transition-colors">National Leaderboard</Link></li>
                  <li><Link href="/competitions" className="hover:text-fitRed transition-colors">Sanctioned Meets</Link></li>
                  <li><Link href="/dashboard/gym" className="hover:text-fitRed transition-colors">Gym Dashboard</Link></li>
                </ul>
              </div>

              {/* Col 3: For Partners */}
              <div className="space-y-3">
                <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">FOR PARTNERS</h4>
                <ul className="space-y-2 text-xs">
                  <li><Link href="/for-gyms#enrollment-form-section" className="hover:text-fitRed transition-colors">Enroll Your Gym</Link></li>
                  <li><Link href="/for-brands#inquiry-form-section" className="hover:text-fitRed transition-colors">Brand KYC Verification</Link></li>
                  <li><Link href="/dashboard/gym" className="hover:text-fitRed transition-colors">Gym Owner Portal</Link></li>
                  <li><Link href="/for-gyms" className="hover:text-fitRed transition-colors">Audit Scorecard (100 Pts)</Link></li>
                  <li><Link href="/for-brands" className="hover:text-fitRed transition-colors">Supplement Lab Testing</Link></li>
                </ul>
              </div>

              {/* Col 4: Top Strength Hubs */}
              <div className="space-y-3">
                <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">STRENGTH HUBS</h4>
                <ul className="space-y-2 text-xs">
                  <li><Link href="/gyms?city=delhi" className="hover:text-fitRed transition-colors">Gyms in Delhi NCR</Link></li>
                  <li><Link href="/gyms?city=bengaluru" className="hover:text-fitRed transition-colors">Gyms in Bengaluru</Link></li>
                  <li><Link href="/gyms?city=mumbai" className="hover:text-fitRed transition-colors">Gyms in Mumbai</Link></li>
                  <li><Link href="/gyms?city=chandigarh" className="hover:text-fitRed transition-colors">Gyms in Chandigarh</Link></li>
                  <li><Link href="/gyms?city=pune" className="hover:text-fitRed transition-colors">Gyms in Pune</Link></li>
                  <li><Link href="/gyms?city=hyderabad" className="hover:text-fitRed transition-colors">Gyms in Hyderabad</Link></li>
                </ul>
              </div>

              {/* Col 5: Lifting Disciplines */}
              <div className="space-y-3">
                <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">DISCIPLINES</h4>
                <ul className="space-y-2 text-xs">
                  <li><Link href="/verify" className="hover:text-fitRed transition-colors">IPF Powerlifting (SBD)</Link></li>
                  <li><Link href="/gyms" className="hover:text-fitRed transition-colors">Calibrated Barbell Clubs</Link></li>
                  <li><Link href="/verify" className="hover:text-fitRed transition-colors">Motionless Chest Pause</Link></li>
                  <li><Link href="/verify" className="hover:text-fitRed transition-colors">Hip Crease Depth (≥90°)</Link></li>
                  <li><Link href="/marketplace" className="hover:text-fitRed transition-colors">HPLC Whey & Creatine</Link></li>
                  <li><Link href="/competitions" className="hover:text-fitRed transition-colors">State Championships</Link></li>
                </ul>
              </div>

            </div>

            {/* Bottom Bar: Copyright & Socials */}
            <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
              <p>© 2026 Athloboard Technologies India Pvt Ltd. All rights reserved.</p>
              <div className="flex items-center gap-6 text-slate-400">
                <Link href="/for-gyms" className="hover:text-white transition-colors">Audit Terms</Link>
                <Link href="/for-brands" className="hover:text-white transition-colors">KYC Policy</Link>
                <span className="text-fitRed font-bold">#YourStrengthYourWay</span>
              </div>
            </div>

          </div>
        </footer>
      </body>
    </html>
  );
}

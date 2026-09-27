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
      <body className="bg-background text-white min-h-screen flex flex-col selection:bg-gold selection:text-black">
        <Navigation />

        <main className="flex-1">{children}</main>

        {/* Global Footer */}
        <footer className="bg-elevated border-t border-white/5 px-6 py-12 text-sm text-muted">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold p-1 flex items-center justify-center overflow-hidden shadow-gold-glow">
                  <img src="/logo.png" alt="Athloboard" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="font-black text-white tracking-wider block">ATHLOBOARD ECOSYSTEM</span>
                  <span className="text-[10px] text-gold font-bold uppercase tracking-widest">SIH National Grand Finale Submission</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-xs font-bold text-slate-300">
                <Link href="/leaderboard" className="hover:text-gold transition-colors">National Leaderboard</Link>
                <Link href="/verify" className="hover:text-gold transition-colors">AI Referee Studio</Link>
                <Link href="/competitions" className="hover:text-gold transition-colors">Competitions</Link>
                <Link href="/gyms" className="hover:text-gold transition-colors">Audited Gyms</Link>
                <Link href="/marketplace" className="hover:text-gold transition-colors">Verified Store</Link>
                <Link href="/ecosystem" className="hover:text-gold transition-colors">Ecosystem Hub</Link>
                <a href="http://localhost:4000/api/docs" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">Swagger API</a>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted">
              <p>© 2026 Athloboard Technologies India Pvt Ltd. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a
                  href="/downloads/athloboard-app.apk"
                  download="Athloboard-v1.0.apk"
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Download Android APK (16MB)
                </a>
                <Link href="/for-gyms" className="hover:text-white">Facility Audit</Link>
                <Link href="/for-brands" className="hover:text-white">Brand KYC</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

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
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded bg-gold flex items-center justify-center font-black text-black text-sm">A</div>
              <span className="font-bold text-white tracking-wider">ATHLOBOARD ECOSYSTEM</span>
            </div>
            <p className="text-xs">© 2026 Athloboard Technologies India Pvt Ltd. All rights reserved.</p>
            <div className="flex gap-6 text-xs font-semibold">
              <Link href="/for-gyms" className="hover:text-gold">Gym Partners</Link>
              <Link href="/for-brands" className="hover:text-gold">Brand Partners</Link>
              <a href={process.env.NEXT_PUBLIC_API_DOCS_URL || '#'} target="_blank" rel="noopener noreferrer" className="hover:text-gold">API Docs</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

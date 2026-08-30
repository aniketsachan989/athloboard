import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Athloboard | Verified Athletic Strength & Fitness Ecosystem',
  description: "India's federated strength ecosystem. AI-verified lift videos, verified gym storefronts, and authenticated nutrition brands.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-white min-h-screen flex flex-col selection:bg-gold selection:text-black">
        {/* Global Navigation Header */}
        <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center font-black text-black text-xl shadow-gold-glow group-hover:scale-105 transition-transform">
              A
            </div>
            <div>
              <span className="font-black text-lg tracking-wider text-white">ATHLOBOARD</span>
              <span className="block text-[10px] text-gold font-bold tracking-widest uppercase">Federated Strength</span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
            <a href="/gyms" className="hover:text-gold transition-colors">Find Gyms</a>
            <a href="/marketplace" className="hover:text-gold transition-colors">Verified Gear</a>
            <a href="/for-gyms" className="hover:text-gold transition-colors">For Gym Owners</a>
            <a href="/for-brands" className="hover:text-gold transition-colors">For Brands</a>
          </nav>

          <div className="flex items-center gap-4">
            <a href="/dashboard/gym" className="hidden sm:inline-flex px-4 py-2 rounded-lg text-xs font-bold text-white bg-surface hover:bg-surfaceHover border border-white/10 transition-colors">
              Gym Portal
            </a>
            <a href="/for-gyms" className="px-4 py-2 rounded-lg text-xs font-black text-black bg-gold hover:bg-gold-glow shadow-gold-glow transition-all hover:scale-105">
              Enroll Business
            </a>
          </div>
        </header>

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
              <a href="/for-gyms" className="hover:text-gold">Gym Partners</a>
              <a href="/for-brands" className="hover:text-gold">Brand Partners</a>
              <a href="http://localhost:4000/api/docs" target="_blank" className="hover:text-gold">API Docs</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

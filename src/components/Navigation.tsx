'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 flex flex-col">
      <div className="px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center font-black text-black text-xl shadow-gold-glow group-hover:scale-105 transition-transform">
            A
          </div>
          <div>
            <span className="font-black text-lg tracking-wider text-white">ATHLOBOARD</span>
            <span className="block text-[10px] text-gold font-bold tracking-widest uppercase">Federated Strength</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
          <Link href="/gyms" className="hover:text-gold transition-colors">Find Gyms</Link>
          <Link href="/marketplace" className="hover:text-gold transition-colors">Verified Gear</Link>
          <Link href="/for-gyms" className="hover:text-gold transition-colors">For Gym Owners</Link>
          <Link href="/for-brands" className="hover:text-gold transition-colors">For Brands</Link>
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="/downloads/athloboard-app.apk"
            download="Athloboard-v1.0.apk"
            className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/60 transition-all shadow-sm hover:scale-105"
            title="Download Android APK (16MB)"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            <span>Download App</span>
            <span className="text-[10px] bg-emerald-500/20 px-1 py-0.5 rounded text-emerald-300 font-mono font-bold">APK</span>
          </a>
          <Link href="/dashboard/gym" className="hidden sm:inline-flex px-4 py-2 rounded-lg text-xs font-bold text-white bg-surface hover:bg-surfaceHover border border-white/10 transition-colors">
            Gym Portal
          </Link>
          <Link href="/for-gyms" className="hidden sm:inline-flex px-4 py-2 rounded-lg text-xs font-black text-black bg-gold hover:bg-gold-glow shadow-gold-glow transition-all hover:scale-105">
            Enroll Business
          </Link>
          <button 
            className="md:hidden flex flex-col justify-center gap-1.5 w-6 h-6"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className={`w-full h-0.5 bg-white transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-full h-0.5 bg-white transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-full h-0.5 bg-white transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden flex flex-col px-6 py-4 gap-4 bg-elevated border-t border-white/5">
          <Link href="/gyms" className="text-white hover:text-gold transition-colors" onClick={() => setMobileMenuOpen(false)}>Find Gyms</Link>
          <Link href="/marketplace" className="text-white hover:text-gold transition-colors" onClick={() => setMobileMenuOpen(false)}>Verified Gear</Link>
          <Link href="/for-gyms" className="text-white hover:text-gold transition-colors" onClick={() => setMobileMenuOpen(false)}>For Gym Owners</Link>
          <Link href="/for-brands" className="text-white hover:text-gold transition-colors" onClick={() => setMobileMenuOpen(false)}>For Brands</Link>
          <a
            href="/downloads/athloboard-app.apk"
            download="Athloboard-v1.0.apk"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 text-center w-full"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download Android App (APK 16MB)
          </a>
          <Link href="/for-gyms" className="inline-flex px-4 py-2 rounded-lg text-xs font-black text-black bg-gold text-center w-full justify-center mt-1" onClick={() => setMobileMenuOpen(false)}>
            Enroll Business
          </Link>
        </nav>
      )}
    </header>
  );
}

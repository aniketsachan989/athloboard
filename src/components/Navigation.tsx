'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Trophy, ShieldCheck, Dumbbell, ShoppingCart, 
  Calendar, Layers, Smartphone, Menu, X, ArrowUpRight 
} from 'lucide-react';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 flex flex-col">
      <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gold p-1 flex items-center justify-center shadow-gold-glow group-hover:scale-105 transition-transform overflow-hidden">
            <img src="/logo.png" alt="Athloboard" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-black text-base sm:text-lg tracking-wider text-white">ATHLOBOARD</span>
            <span className="block text-[9px] text-gold font-bold tracking-widest uppercase">Federated Strength</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-bold text-muted uppercase tracking-wider">
          <Link href="/gyms" className="hover:text-gold transition-colors flex items-center gap-1.5">
            <Dumbbell className="w-3.5 h-3.5 text-gold" /> Gym Radar
          </Link>
          <Link href="/marketplace" className="hover:text-gold transition-colors flex items-center gap-1.5">
            <ShoppingCart className="w-3.5 h-3.5 text-gold" /> Verified Store
          </Link>
          <Link href="/leaderboard" className="hover:text-gold transition-colors flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-gold" /> Leaderboard
          </Link>
          <Link href="/verify" className="hover:text-gold transition-colors flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" /> AI Referee
          </Link>
          <Link href="/competitions" className="hover:text-gold transition-colors flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gold" /> Meets
          </Link>
          <Link href="/ecosystem" className="hover:text-gold transition-colors flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-gold" /> Ecosystem
          </Link>
        </nav>

        {/* Medium Screen Nav (More compact) */}
        <nav className="hidden md:flex xl:hidden items-center gap-4 text-xs font-bold text-muted">
          <Link href="/gyms" className="hover:text-gold transition-colors">Gyms</Link>
          <Link href="/marketplace" className="hover:text-gold transition-colors">Store</Link>
          <Link href="/leaderboard" className="hover:text-gold transition-colors text-gold">Rankings</Link>
          <Link href="/verify" className="hover:text-gold transition-colors">AI Studio</Link>
          <Link href="/competitions" className="hover:text-gold transition-colors">Meets</Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="/downloads/athloboard-app.apk"
            download="Athloboard-v1.0.apk"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/60 transition-all shadow-sm hover:scale-105"
            title="Download Android APK (16MB)"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>App</span>
            <span className="text-[10px] bg-emerald-500/20 px-1 py-0.2 rounded text-emerald-300 font-mono font-bold">APK</span>
          </a>

          <Link 
            href="/dashboard/gym" 
            className="hidden lg:inline-flex px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-surface hover:bg-surfaceHover border border-white/10 transition-colors"
          >
            Gym Portal
          </Link>

          <Link 
            href="/for-gyms#enrollment-form-section" 
            className="hidden sm:inline-flex px-3.5 py-1.5 rounded-lg text-xs font-black text-black bg-gold hover:bg-gold-glow shadow-gold-glow transition-all hover:scale-105"
          >
            Enroll Business
          </Link>

          {/* Mobile Hamburger Button */}
          <button 
            className="xl:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-surface border border-white/10 text-white hover:text-gold"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav className="xl:hidden flex flex-col px-6 py-5 gap-3 bg-[#0c0d14] border-t border-white/10 text-sm">
          <Link 
            href="/gyms" 
            className="text-white hover:text-gold py-2 border-b border-white/5 flex items-center justify-between" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="flex items-center gap-2"><Dumbbell className="w-4 h-4 text-gold" /> Find Audited Gyms</span>
            <ArrowUpRight className="w-4 h-4 text-muted" />
          </Link>

          <Link 
            href="/marketplace" 
            className="text-white hover:text-gold py-2 border-b border-white/5 flex items-center justify-between" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="flex items-center gap-2"><ShoppingCart className="w-4 h-4 text-gold" /> Verified Store (HPLC Lab Tested)</span>
            <ArrowUpRight className="w-4 h-4 text-muted" />
          </Link>

          <Link 
            href="/leaderboard" 
            className="text-white hover:text-gold py-2 border-b border-white/5 flex items-center justify-between font-bold text-gold" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="flex items-center gap-2"><Trophy className="w-4 h-4 text-gold" /> National Leaderboard & Records</span>
            <ArrowUpRight className="w-4 h-4 text-gold" />
          </Link>

          <Link 
            href="/verify" 
            className="text-white hover:text-gold py-2 border-b border-white/5 flex items-center justify-between" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-gold" /> AI Biomechanical Referee Studio</span>
            <ArrowUpRight className="w-4 h-4 text-muted" />
          </Link>

          <Link 
            href="/competitions" 
            className="text-white hover:text-gold py-2 border-b border-white/5 flex items-center justify-between" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gold" /> Sanctioned Competitions</span>
            <ArrowUpRight className="w-4 h-4 text-muted" />
          </Link>

          <Link 
            href="/ecosystem" 
            className="text-white hover:text-gold py-2 border-b border-white/5 flex items-center justify-between" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-gold" /> Full Ecosystem Hub</span>
            <ArrowUpRight className="w-4 h-4 text-muted" />
          </Link>

          <Link 
            href="/dashboard/gym" 
            className="text-white hover:text-gold py-2 border-b border-white/5 flex items-center justify-between" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Gym Owner Dashboard</span>
            <ArrowUpRight className="w-4 h-4 text-muted" />
          </Link>

          <div className="pt-2 flex flex-col gap-2">
            <a
              href="/downloads/athloboard-app.apk"
              download="Athloboard-v1.0.apk"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 text-center w-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Smartphone className="w-4 h-4" />
              Download Android App (APK 16MB)
            </a>
            <Link 
              href="/for-gyms#enrollment-form-section" 
              className="inline-flex px-4 py-3 rounded-xl text-xs font-black text-black bg-gold text-center w-full justify-center shadow-gold-glow" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Enroll Gym Business
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

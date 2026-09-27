'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Dumbbell, ShieldCheck, ShoppingCart, Trophy, 
  Calendar, Layers, Smartphone, MapPin, ChevronDown, 
  Menu, X, ArrowUpRight, Flame, Search 
} from 'lucide-react';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Delhi NCR');
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const cities = ['Delhi NCR', 'Bengaluru', 'Mumbai', 'Chandigarh', 'Hyderabad', 'Pune', 'Chennai'];

  return (
    <header className="sticky top-0 z-[9999] w-full bg-white border-b border-gray-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        
        {/* Brand Logo & City Selector */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-fitRed flex items-center justify-center p-1 text-white shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
              <img src="/logo.png" alt="Athloboard" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-gray-950 uppercase flex items-center gap-1">
                ATHLO<span className="text-fitRed">BOARD</span>
              </span>
              <span className="block text-[8px] text-gray-500 font-bold tracking-widest uppercase -mt-1">
                Federated Strength Pass
              </span>
            </div>
          </Link>

          {/* Fitpass-Style City Location Selector */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-fitRed" />
              <span>{selectedCity}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {cityDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 text-xs animate-fadeIn">
                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Hub</div>
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setCityDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center justify-between ${
                      selectedCity === city ? 'font-bold text-fitRed bg-red-50/50' : 'text-gray-700'
                    }`}
                  >
                    <span>{city}</span>
                    {selectedCity === city && <span className="w-1.5 h-1.5 rounded-full bg-fitRed"></span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fitpass-Style Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-7 text-xs font-bold text-gray-700 uppercase tracking-wider">
          <Link href="/gyms" className="hover:text-fitRed transition-colors flex items-center gap-1">
            <Dumbbell className="w-3.5 h-3.5 text-fitRed" /> OnePass Gyms
          </Link>
          <Link href="/verify" className="hover:text-fitRed transition-colors flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-fitRed" /> AI Coach
          </Link>
          <Link href="/marketplace" className="hover:text-fitRed transition-colors flex items-center gap-1">
            <ShoppingCart className="w-3.5 h-3.5 text-fitRed" /> Store
          </Link>
          <Link href="/leaderboard" className="hover:text-fitRed transition-colors flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-fitRed" /> Leaderboard
          </Link>
          <Link href="/competitions" className="hover:text-fitRed transition-colors flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-fitRed" /> Meets
          </Link>
          <Link href="/ecosystem" className="hover:text-fitRed transition-colors flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-fitRed" /> Ecosystem
          </Link>
        </nav>

        {/* Fitpass-Style Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="/downloads/athloboard-app.apk"
            download="Athloboard-v1.0.apk"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all shadow-sm hover:scale-105"
            title="Download Android APK (16MB)"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>App</span>
            <span className="text-[10px] bg-emerald-100 px-1 py-0.2 rounded text-emerald-800 font-mono font-bold">APK</span>
          </a>

          <Link 
            href="/for-gyms#enrollment-form-section" 
            className="hidden md:inline-flex px-3.5 py-2 rounded-lg text-xs font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 transition-colors"
          >
            For Gyms
          </Link>

          <Link 
            href="/for-gyms#enrollment-form-section" 
            className="px-4 py-2 rounded-lg text-xs font-extrabold text-white bg-fitRed hover:bg-fitRed-hover shadow-sm transition-all hover:scale-105 uppercase tracking-wider"
          >
            Get Pass
          </Link>

          {/* Mobile Hamburger Button */}
          <button 
            className="xl:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 hover:text-fitRed"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav className="xl:hidden flex flex-col px-6 py-5 gap-3 bg-white border-t border-gray-200 text-sm shadow-xl">
          
          <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Current City Hub</span>
            <div className="flex items-center gap-1 font-bold text-xs text-fitRed bg-red-50 px-2.5 py-1 rounded-lg">
              <MapPin className="w-3.5 h-3.5" /> {selectedCity}
            </div>
          </div>

          <Link 
            href="/gyms" 
            className="text-gray-800 hover:text-fitRed py-2 border-b border-gray-50 flex items-center justify-between font-medium" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="flex items-center gap-2.5"><Dumbbell className="w-4 h-4 text-fitRed" /> OnePass Gyms & Studios</span>
            <ArrowUpRight className="w-4 h-4 text-gray-400" />
          </Link>

          <Link 
            href="/verify" 
            className="text-gray-800 hover:text-fitRed py-2 border-b border-gray-50 flex items-center justify-between font-medium" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="flex items-center gap-2.5"><ShieldCheck className="w-4 h-4 text-fitRed" /> AI Biomechanical Coach</span>
            <ArrowUpRight className="w-4 h-4 text-gray-400" />
          </Link>

          <Link 
            href="/marketplace" 
            className="text-gray-800 hover:text-fitRed py-2 border-b border-gray-50 flex items-center justify-between font-medium" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="flex items-center gap-2.5"><ShoppingCart className="w-4 h-4 text-fitRed" /> AthloStore (Lab-Tested Nutrition)</span>
            <ArrowUpRight className="w-4 h-4 text-gray-400" />
          </Link>

          <Link 
            href="/leaderboard" 
            className="text-gray-800 hover:text-fitRed py-2 border-b border-gray-50 flex items-center justify-between font-bold text-fitRed" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="flex items-center gap-2.5"><Trophy className="w-4 h-4 text-fitRed" /> National Leaderboard & Records</span>
            <ArrowUpRight className="w-4 h-4 text-fitRed" />
          </Link>

          <Link 
            href="/competitions" 
            className="text-gray-800 hover:text-fitRed py-2 border-b border-gray-50 flex items-center justify-between font-medium" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="flex items-center gap-2.5"><Calendar className="w-4 h-4 text-fitRed" /> Sanctioned Competitions</span>
            <ArrowUpRight className="w-4 h-4 text-gray-400" />
          </Link>

          <Link 
            href="/ecosystem" 
            className="text-gray-800 hover:text-fitRed py-2 border-b border-gray-50 flex items-center justify-between font-medium" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="flex items-center gap-2.5"><Layers className="w-4 h-4 text-fitRed" /> Ecosystem & API Hub</span>
            <ArrowUpRight className="w-4 h-4 text-gray-400" />
          </Link>

          <Link 
            href="/dashboard/gym" 
            className="text-gray-800 hover:text-fitRed py-2 border-b border-gray-50 flex items-center justify-between font-medium" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Gym Management Portal</span>
            <ArrowUpRight className="w-4 h-4 text-gray-400" />
          </Link>

          <div className="pt-3 flex flex-col gap-2.5">
            <a
              href="/downloads/athloboard-app.apk"
              download="Athloboard-v1.0.apk"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 text-center w-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Smartphone className="w-4 h-4 text-emerald-600" />
              Download Android App (APK 16MB)
            </a>
            <Link 
              href="/for-gyms#enrollment-form-section" 
              className="inline-flex px-4 py-3 rounded-xl text-xs font-black text-white bg-fitRed text-center w-full justify-center shadow-md uppercase tracking-wider" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Enroll Your Facility
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

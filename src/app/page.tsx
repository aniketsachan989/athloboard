'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Dumbbell, ShieldCheck, ShoppingCart, Trophy, 
  Calendar, Layers, Smartphone, MapPin, ChevronRight, 
  Star, Award, CheckCircle2, QrCode, ArrowRight, 
  Activity, Users, Sparkles, Send 
} from 'lucide-react';

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [mobileNumber, setMobileNumber] = useState('');
  const [sendLinkSuccess, setSendLinkSuccess] = useState(false);

  const slides = [
    {
      id: 0,
      badge: 'ATHLOBOARD ONEPASS',
      icon: Dumbbell,
      bgColor: 'bg-fitBurgundy',
      title: "One Membership to India's Largest Strength Network",
      description: "Access 450+ audited powerlifting gyms & strength centers across 50+ major cities of India with 3,200kg+ calibrated plates, ER combo racks, and certified coaches.",
      ctaText: 'BROWSE AUDITED GYMS',
      ctaLink: '/gyms',
      image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800',
    },
    {
      id: 1,
      badge: 'AI BIOMECHANICAL REFEREE',
      icon: ShieldCheck,
      bgColor: 'bg-fitAmber',
      title: "Experience the Most Advanced A.I. Video Referee",
      description: "Meet KINEMA – Your personal automated computer vision referee that audits hip crease depth (≥90°), motionless chest pause, and knee lockout under IPF technical rules.",
      ctaText: 'TEST AI REFEREE STUDIO',
      ctaLink: '/verify',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800',
    },
    {
      id: 2,
      badge: 'FITSHOP LAB-TESTED STORE',
      icon: ShoppingCart,
      bgColor: 'bg-fitTeal',
      title: "Connect with 100% Lab-Tested Sports Nutrition",
      description: "End the 70% counterfeit supplement epidemic in India. Every whey protein, creatine, and lifting belt has mandatory GSTIN KYC and verified Eurofins HPLC laboratory test reports.",
      ctaText: 'SHOP VERIFIED STORE',
      ctaLink: '/marketplace',
      image: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=800',
    },
    {
      id: 3,
      badge: 'SANCTIONED MEETS & LEADERBOARDS',
      icon: Trophy,
      bgColor: 'bg-fitNavy',
      title: "Compete in Sanctioned State & National Championships",
      description: "Official powerlifting meets with 3-judge Olympic refereeing, calibrated plate loading, electronic scoring, and instant +100 Lift Points credited to your profile.",
      ctaText: 'EXPLORE SANCTIONED MEETS',
      ctaLink: '/competitions',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    },
  ];

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length >= 10) {
      setSendLinkSuccess(true);
      setTimeout(() => setSendLinkSuccess(false), 5000);
      setMobileNumber('');
    }
  };

  return (
    <div className="w-full bg-white text-gray-900 font-sans">
      
      {/* 1. HERO TOP BANNER (Exact Fitpass Aspect Ratio & Banner) */}
      <div className="w-full bg-[#f2f2f2] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-fitRed text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> India’s #1 Strength & Fitness Ecosystem
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-950 leading-[1.1] tracking-tight">
              Personalise Your <br className="hidden sm:block"/>
              <span className="text-fitRed">Strength Your Way with ATHLOBOARD</span>
            </h1>
            <p className="text-sm sm:text-lg text-gray-700 leading-relaxed font-normal pt-1">
              Access 450+ audited powerlifting gyms with calibrated plates, prove your lifts with our automated AI biomechanical referee, and shop 100% HPLC lab-tested nutrition.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
              <Link
                href="/gyms"
                className="px-8 py-4 rounded-xl font-black text-white bg-fitRed hover:bg-fitRed-hover shadow-lg shadow-red-500/20 text-sm transition-all hover:scale-105 uppercase tracking-wider"
              >
                Explore Gym Radar
              </Link>
              <Link
                href="/for-gyms#enrollment-form-section"
                className="px-8 py-4 rounded-xl font-bold text-gray-800 bg-white hover:bg-gray-50 border border-gray-300 text-sm transition-colors shadow-sm"
              >
                Enroll Your Gym Facility
              </Link>
            </div>
          </div>

          <div className="w-full md:w-5/12 flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800"
                alt="Athloboard Gym Network"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-bold text-gold uppercase tracking-wider">IPF Calibrated Facility</span>
                <h3 className="text-xl font-black">Iron Pulse Strength Gym</h3>
                <p className="text-xs text-slate-300">3,200kg Calibrated Eleiko Plates • South Extension II, Delhi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE 4 ICONIC FITPASS PRODUCT CARDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-950">
            One Membership for <span className="text-fitRed">Lifting, Audits & Verified Nutrition</span>
          </h2>
          <p className="text-xs sm:text-base text-gray-600 font-medium">
            Elevate your athletic journey with calibrated competition infrastructure, automated computer vision refereeing, and zero-counterfeit certified sports supplements.
          </p>
        </div>

        {/* 4 Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1: Athloboard Pass */}
          <Link href="/gyms" className="group flex flex-col items-center text-center p-3 rounded-2xl hover:bg-gray-50 transition-all">
            <div className="w-full aspect-[260/306] rounded-2xl overflow-hidden relative shadow-sm group-hover:shadow-md group-hover:scale-[1.02] transition-all">
              <img
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600"
                alt="Athloboard OnePass"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-fitRed text-white text-[10px] font-black uppercase tracking-wider">
                Audited Gyms
              </span>
            </div>
            <div className="text-base sm:text-lg font-bold text-gray-950 mt-3 group-hover:text-fitRed transition-colors">
              ATHLOBOARD PASS
            </div>
            <div className="text-xs text-gray-600 mt-1 line-clamp-2">
              Access 450+ audited strength gyms with calibrated plates and ER racks across India.
            </div>
          </Link>

          {/* Card 2: AI Referee Coach */}
          <Link href="/verify" className="group flex flex-col items-center text-center p-3 rounded-2xl hover:bg-gray-50 transition-all">
            <div className="w-full aspect-[260/306] rounded-2xl overflow-hidden relative shadow-sm group-hover:shadow-md group-hover:scale-[1.02] transition-all">
              <img
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600"
                alt="AI Kinematics Referee"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider">
                Computer Vision
              </span>
            </div>
            <div className="text-base sm:text-lg font-bold text-gray-950 mt-3 group-hover:text-fitRed transition-colors">
              AI REFEREE (KINEMA)
            </div>
            <div className="text-xs text-gray-600 mt-1 line-clamp-2">
              A.I. enabled joint kinematic referee auditing depth (≥90°) and chest pause under IPF rules.
            </div>
          </Link>

          {/* Card 3: FitShop Marketplace */}
          <Link href="/marketplace" className="group flex flex-col items-center text-center p-3 rounded-2xl hover:bg-gray-50 transition-all">
            <div className="w-full aspect-[260/306] rounded-2xl overflow-hidden relative shadow-sm group-hover:shadow-md group-hover:scale-[1.02] transition-all">
              <img
                src="https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=600"
                alt="FitShop Lab Tested Nutrition"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider">
                100% HPLC Tested
              </span>
            </div>
            <div className="text-base sm:text-lg font-bold text-gray-950 mt-3 group-hover:text-fitRed transition-colors">
              VERIFIED FITSHOP
            </div>
            <div className="text-xs text-gray-600 mt-1 line-clamp-2">
              Eurofins lab-tested proteins, creatine, and powerlifting belts with zero counterfeit risk.
            </div>
          </Link>

          {/* Card 4: Leaderboard & Meets */}
          <Link href="/leaderboard" className="group flex flex-col items-center text-center p-3 rounded-2xl hover:bg-gray-50 transition-all">
            <div className="w-full aspect-[260/306] rounded-2xl overflow-hidden relative shadow-sm group-hover:shadow-md group-hover:scale-[1.02] transition-all">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600"
                alt="National Meets & Rankings"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider">
                National Records
              </span>
            </div>
            <div className="text-base sm:text-lg font-bold text-gray-950 mt-3 group-hover:text-fitRed transition-colors">
              DYNAMIC RANKINGS
            </div>
            <div className="text-xs text-gray-600 mt-1 line-clamp-2">
              Official Indian SBD leaderboards, Wilks points, and sanctioned championship registration.
            </div>
          </Link>

        </div>
      </div>

      {/* 3. THE FULL-WIDTH COLORED SERVICE SLIDERS (Exact Fitpass Swiper Style) */}
      <div className="w-full">
        {/* Navigation Tabs for Sliders */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto pb-4">
          {slides.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`px-4 sm:px-6 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider whitespace-nowrap ${
                activeSlide === idx
                  ? 'bg-gray-950 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s.badge}
            </button>
          ))}
        </div>

        {/* Active Full-Width Slider */}
        <div className={`w-full text-white transition-all duration-500 ${slides[activeSlide].bgColor}`}>
          <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between min-h-[460px] md:min-h-[520px]">
            
            {/* Left Content */}
            <div className="p-8 sm:p-12 md:max-w-[50%] space-y-5">
              <div className="inline-flex items-center gap-2">
                <span className="text-2xl sm:text-3xl text-white">🏋️‍♂️</span>
                <span className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
                  {slides[activeSlide].badge}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black leading-[1.15]">
                {slides[activeSlide].title}
              </h2>

              <p className="text-sm sm:text-lg text-slate-200 leading-relaxed font-normal">
                {slides[activeSlide].description}
              </p>

              <div className="pt-2">
                <Link
                  href={slides[activeSlide].ctaLink}
                  className="inline-flex items-center gap-2 px-6 sm:px-10 py-3.5 sm:py-4 rounded-lg border-2 border-white text-white font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-white hover:text-black transition-all shadow-md"
                >
                  {slides[activeSlide].ctaText}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="w-full md:w-[50%] h-[300px] md:h-[520px] overflow-hidden">
              <img
                src={slides[activeSlide].image}
                alt={slides[activeSlide].title}
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        </div>
      </div>

      {/* 4. JOIN OUR COMMUNITY BANNER (Exact Fitpass Style) */}
      <div 
        className="w-full py-20 sm:py-28 px-4 text-center relative bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1600')` }}
      >
        <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 text-white">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Join Our Strength Community
          </h2>
          <p className="text-base sm:text-2xl text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed">
            Experience <strong className="text-fitRed font-black">#YourStrengthYourWay</strong> with 150,000+ dedicated Indian lifters. Join the Athloboard tribe & feel the heavy barbell vibe.
          </p>
          <div className="pt-2">
            <Link
              href="/gyms"
              className="inline-flex px-10 py-4 rounded-lg border-2 border-white text-white font-black text-sm tracking-wider uppercase hover:bg-white hover:text-black transition-all shadow-lg hover:scale-105"
            >
              Explore Memberships
            </Link>
          </div>
        </div>
      </div>

      {/* 5. FROM OUR STRENGTH JOURNAL (Exact Fitpass Style with Red Line) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 space-y-8">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black text-gray-950">
            From our <span className="text-fitRed">Strength Journal</span>
          </h2>
          <p className="text-xs sm:text-base text-gray-600 mt-2 font-medium">
            Evidence-based powerlifting science, biomechanics breakdowns, and lab testing insights to support your strength journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'IPF Rule 3.2.1: The Biomechanics of Breaking Parallel Squat Depth',
              desc: 'Why hip crease alignment relative to the knee joint protects ligaments while creating valid world records.',
              image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
              link: '/verify',
            },
            {
              title: '70% Counterfeit Supplements in India: How to Audit HPLC Lab Reports',
              desc: 'Understanding nitrogen spiking, heavy metal contamination, and third-party Eurofins verification.',
              image: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=600',
              link: '/marketplace',
            },
            {
              title: 'Calibrated Steel Plates vs Cast Iron: Why the ±10g Tolerance Matters',
              desc: 'How uncalibrated gym weights can introduce a 15kg error margin during maximum effort attempts.',
              image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600',
              link: '/gyms',
            },
            {
              title: 'Motionless Chest Pause: Why Computer Vision Eliminates Referee Bias',
              desc: 'How motion energy stabilization verifies motionless contact during bench press competitions.',
              image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600',
              link: '/verify',
            },
          ].map((article, aIdx) => (
            <Link key={aIdx} href={article.link} className="group space-y-3">
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm font-bold text-gray-950 group-hover:text-fitRed transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-2">
                {article.desc}
              </p>
            </Link>
          ))}
        </div>

        {/* Fitpass Red Indicator Line */}
        <div className="w-full h-1 bg-gray-200 relative rounded-full overflow-hidden mt-6">
          <div className="w-36 h-full bg-fitRed rounded-full"></div>
        </div>
      </div>

      {/* 6. AS COVERED IN MEDIA & FEDERATIONS (Exact Fitpass Media Strip) */}
      <div className="w-full bg-black py-12 px-4 sm:px-6 text-center text-white space-y-8">
        <h2 className="text-xl sm:text-3xl font-extrabold uppercase tracking-wide">
          Recognized by National Media & Federations
        </h2>
        
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-6 sm:gap-12 flex-wrap opacity-80">
          {['Times of India', 'The Economic Times', 'Hindustan Times', 'YourStory', 'Financial Express', 'Business World'].map((outlet, oIdx) => (
            <div key={oIdx} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 font-bold text-xs sm:text-sm tracking-wider text-slate-300">
              {outlet}
            </div>
          ))}
        </div>
      </div>

      {/* 7. RATINGS & SOCIAL PROOF STRIP (Exact Fitpass Banner) */}
      <div 
        className="w-full py-12 px-6 sm:px-12 bg-cover bg-center text-white relative"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1600')` }}
      >
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="text-xs font-bold text-fitRed uppercase tracking-widest mb-1">National Athletic Trust</div>
            <h3 className="text-xl sm:text-3xl font-black">Trusted by over 150,000+ strength lifters across India</h3>
            <p className="text-xs text-slate-300 mt-1">Certified by state powerlifting associations and accredited testing laboratories.</p>
          </div>

          <div className="flex items-center gap-8 sm:gap-16">
            <div className="text-center">
              <div className="text-3xl sm:text-5xl font-black text-white tracking-tight">4.8 ★</div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-1">25K+ Ratings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-5xl font-black text-white tracking-tight">150K+</div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-1">Athletes Enrolled</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-5xl font-black text-white tracking-tight">450+</div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-1">Audited Gyms</div>
            </div>
          </div>
        </div>
      </div>

      {/* 8. GET ATHLOBOARD & GET LIFTING! APP DOWNLOAD (Exact Fitpass Style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="glass-panel bg-white border border-gray-200 rounded-3xl p-6 sm:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-10">
          
          {/* Left Form */}
          <div className="max-w-xl space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-950 leading-tight">
              Get ATHLOBOARD <br/>
              <span className="text-fitRed">&amp; get lifting!</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              Log CameraX verified lifts, redeem Lift Points for authenticated nutrition, and search IPF audited facilities in your city.
            </p>

            <form onSubmit={handleSendLink} className="space-y-4">
              <div className="flex items-center gap-4 text-xs font-bold text-gray-700">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="comm" defaultChecked className="accent-red-600" />
                  <span>Mobile WhatsApp Link</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="comm" className="accent-red-600" />
                  <span>Direct APK Download</span>
                </label>
              </div>

              <div className="flex gap-2">
                <input
                  type="tel"
                  required
                  placeholder="Enter Mobile No. (+91)"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-xs sm:text-sm text-gray-900 outline-none focus:border-fitRed"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-fitRed hover:bg-fitRed-hover text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all hover:scale-105"
                >
                  Send Link
                </button>
              </div>

              {sendLinkSuccess && (
                <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Download link sent to your mobile device!
                </div>
              )}
            </form>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="/downloads/athloboard-app.apk"
                download="Athloboard-v1.0.apk"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black text-white font-bold text-xs hover:bg-gray-800 transition-colors shadow-sm"
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <div className="text-[9px] uppercase text-gray-400">Download for Android</div>
                  <div className="text-xs font-bold">Native APK (16MB)</div>
                </div>
              </a>

              <Link
                href="/for-gyms#enrollment-form-section"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs transition-colors"
              >
                Enroll as Gym Partner
              </Link>
            </div>
          </div>

          {/* Right QR Code & App Visual */}
          <div className="flex items-center gap-8 bg-gray-50 p-6 sm:p-8 rounded-3xl border border-gray-200">
            <div className="text-center space-y-2">
              <div className="w-32 h-32 rounded-2xl bg-white p-3 border border-gray-200 flex items-center justify-center shadow-sm">
                <QrCode className="w-full h-full text-gray-900" />
              </div>
              <span className="text-[11px] font-bold text-gray-700 block">Scan to Install APK</span>
            </div>

            <div className="w-32 h-44 rounded-2xl bg-black p-2 border-2 border-gray-300 shadow-xl hidden sm:flex flex-col justify-between text-white text-[9px]">
              <div className="flex justify-between items-center text-[7px] text-gray-400">
                <span>ATHLOBOARD</span>
                <span>● 4G</span>
              </div>
              <div className="text-center py-4">
                <div className="font-black text-gold text-xs">285 KG</div>
                <div className="text-[7px] text-emerald-400">● 3 WHITE LIGHTS</div>
              </div>
              <div className="p-1 rounded bg-fitRed text-center text-[8px] font-bold">
                PR VERIFIED
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

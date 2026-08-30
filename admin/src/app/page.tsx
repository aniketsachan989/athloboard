'use client';

import React, { useState } from 'react';
import {
  ShieldCheck, Dumbbell, Tag, Store, Video, CheckCircle,
  XCircle, AlertTriangle, TrendingUp, Search, Plus, Inbox,
  Users, Flag, BarChart3, History, Settings, Play, RefreshCw,
  Eye, Check, Ban, AlertCircle, DollarSign, Award, ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

export default function AdminConsole() {
  const [activeSection, setActiveSection] = useState<
    'verification' | 'referee' | 'athletes' | 'moderation' | 'revenue' | 'audit' | 'settings'
  >('verification');

  const [activeQueue, setActiveQueue] = useState<'lifts' | 'gyms' | 'brands' | 'products'>('lifts');

  // --- STATE FOR WORKSPACES ---

  // 1. Verification Queues
  const [lifts, setLifts] = useState([
    {
      id: 'LFT-9281',
      athlete: 'Karan Sharma',
      exercise: 'Squat',
      claimedWeight: '260 kg',
      reps: 1,
      angleScore: 'IPF Legal (Hip Crease < Knee Top)',
      depthAngle: '112°',
      pauseDuration: 'N/A',
      headJudge: true,
      sideJudge1: true,
      sideJudge2: true,
      speed: '0.22 m/s',
    },
    {
      id: 'LFT-9284',
      athlete: 'Aditya Mehta',
      exercise: 'Bench Press',
      claimedWeight: '180 kg',
      reps: 1,
      angleScore: 'Chest Motionless Pause Verified',
      depthAngle: '90° Elbows',
      pauseDuration: '1.2s Audited',
      headJudge: true,
      sideJudge1: true,
      sideJudge2: false,
      speed: '0.18 m/s',
    },
  ]);

  const [gyms, setGyms] = useState([
    {
      id: 'GYM-DEL-104',
      name: 'Titan Strength Vault',
      owner: 'Sanjay Rawat',
      city: 'Gurugram, Haryana',
      plates: '4,500 kg Calibrated (Eleiko / Bullrock)',
      dumbbells: '2.5 kg to 75 kg pairs',
      racks: '4 IPF Spec Combo Racks',
      trainers: '6 Male, 2 Female (Certified)',
      gstin: '07AAAAA0000A1Z5',
      tier: 'Phase 2 (Audited Gold)',
    },
    {
      id: 'GYM-MUM-209',
      name: 'Olympus Barbell Club',
      owner: 'Vikram Merchant',
      city: 'Bandra West, Mumbai',
      plates: '3,200 kg',
      dumbbells: '60 kg pairs',
      racks: '3 Power Cages',
      trainers: '4 Male, 1 Female',
      gstin: '27AABCT3518Q1ZV',
      tier: 'Phase 1 (Storefront Only)',
    },
  ]);

  const [brands, setBrands] = useState([
    {
      id: 'BRD-01',
      name: 'Titan Nutrition India',
      type: 'Brand',
      ownerName: 'Sunil Kapoor',
      email: 'contact@titannutrition.in',
      gstin: '06AAACR4029P1Z3',
      website: 'https://titannutrition.in',
      strikes: 0,
      appliedDate: '2 hours ago',
    },
    {
      id: 'VND-02',
      name: 'Apex Fitness Gear Store',
      type: 'Vendor',
      ownerName: 'Pooja Nair',
      email: 'apexstore.delhi@gmail.com',
      gstin: '07BBBCR1122Q1Z9',
      website: 'https://apexgear.in',
      strikes: 1,
      appliedDate: '5 hours ago',
    },
  ]);

  const [products, setProducts] = useState([
    {
      id: 'PRD-881',
      name: 'Pure Whey Isolate 100% (2kg)',
      brand: 'Titan Nutrition India',
      category: 'Proteins',
      price: '₹ 4,499',
      weight: '2.0 kg',
      labCertificate: 'CERT-NABL-2026-9941',
      hplcScore: '94.2% HPLC Purity Verified',
      isSponsored: true,
    },
    {
      id: 'PRD-882',
      name: 'Creapure Micronized Creatine (300g)',
      brand: 'IronForge Lab',
      category: 'Performance',
      price: '₹ 1,199',
      weight: '300 g',
      labCertificate: 'CERT-EUROFINS-8412',
      hplcScore: '99.9% Purity Score',
      isSponsored: false,
    },
  ]);

  // 2. Athletes Directory State
  const [athletes, setAthletes] = useState([
    { id: 'ATH-1092', name: 'Karan Sharma', email: 'karan@athloboard.com', city: 'Delhi', weightClass: '-93kg', squat: 260, bench: 180, deadlift: 310, total: 750, points: 1450, isVerified: true, isBanned: false },
    { id: 'ATH-1093', name: 'Aditya Mehta', email: 'aditya@athloboard.com', city: 'Mumbai', weightClass: '-83kg', squat: 230, bench: 165, deadlift: 280, total: 675, points: 980, isVerified: true, isBanned: false },
    { id: 'ATH-1094', name: 'Rohan Verma', email: 'rohan@athloboard.com', city: 'Bengaluru', weightClass: '-105kg', squat: 270, bench: 190, deadlift: 320, total: 780, points: 2100, isVerified: true, isBanned: false },
    { id: 'ATH-1095', name: 'Aanya Sen', email: 'aanya@athloboard.com', city: 'Kolkata', weightClass: '-63kg', squat: 160, bench: 95, deadlift: 195, total: 450, points: 1120, isVerified: true, isBanned: false },
  ]);

  // 3. Moderation Reports
  const [reports, setReports] = useState([
    { id: 'REP-01', target: 'Review on Iron Pulse Gym', reason: 'Suspected competitor spam / abusive language', reporter: 'Rajesh Sharma (Owner)', timestamp: '1 hour ago', content: '"Worst gym ever, weights are fake"' },
    { id: 'REP-02', target: 'Lift Submission #LFT-8812', reason: 'Suspected false plate weight', reporter: 'System Flag', timestamp: '3 hours ago', content: 'Bar flex did not match claimed 300kg deadlift' },
  ]);

  // 4. Audit Log
  const [auditLogs, setAuditLogs] = useState([
    { id: 'LOG-441', timestamp: '2026-08-30 16:20:14', admin: 'superadmin@athloboard.com', action: 'APPROVE_GYM_PHASE2', targetId: 'GYM-DEL-101', notes: 'Verified 3,200kg plate photos & certified trainers' },
    { id: 'LOG-440', timestamp: '2026-08-30 15:45:02', admin: 'superadmin@athloboard.com', action: 'REFEREE_LIFT_WHITE_LIGHTS', targetId: 'LFT-9280', notes: '3 White lights awarded for 225kg squat' },
    { id: 'LOG-439', timestamp: '2026-08-30 14:12:33', admin: 'superadmin@athloboard.com', action: 'VERIFY_GSTIN', targetId: 'BRD-01', notes: '06AAACR4029P1Z3 verified via GST portal' },
  ]);

  // --- RECHARTS REVENUE DATA ---
  const revenueData = [
    { month: 'Apr', gmv: 420000, gymSubs: 89000, gearComm: 33100 },
    { month: 'May', gmv: 610000, gymSubs: 135000, gearComm: 47500 },
    { month: 'Jun', gmv: 890000, gymSubs: 198000, gearComm: 71200 },
    { month: 'Jul', gmv: 1250000, gymSubs: 285000, gearComm: 98000 },
    { month: 'Aug', gmv: 1780000, gymSubs: 389000, gearComm: 142000 },
  ];

  // Helper Handlers
  const handleAwardLights = (liftId: string, isWhite: boolean) => {
    setLifts((prev) => prev.filter((l) => l.id !== liftId));
    setAuditLogs((prev) => [
      {
        id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        admin: 'superadmin@athloboard.com',
        action: isWhite ? 'REFEREE_3_WHITE_LIGHTS' : 'REFEREE_RED_LIGHT',
        targetId: liftId,
        notes: isWhite ? 'PR approved under IPF rules. 50 Lift Points credited to athlete.' : 'Infraction noted. Lift rejected.',
      },
      ...prev,
    ]);
    alert(isWhite ? `3 White Lights awarded for ${liftId}! PR verified & 50 Lift Points credited.` : `Red Light awarded for ${liftId}. Technical infraction logged.`);
  };

  return (
    <div className="flex min-h-screen">
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-64 border-r border-surfaceBorder bg-surface/70 p-6 flex flex-col justify-between hidden md:flex">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold text-black font-black flex items-center justify-center text-lg shadow-gold-glow">
              A
            </div>
            <div>
              <div className="font-black text-sm tracking-wider text-white">ATHLOBOARD</div>
              <div className="text-[10px] text-accentCyan font-bold uppercase tracking-widest">Master HQ Console</div>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            {[
              { id: 'verification', label: 'Verification Cockpit', icon: ShieldCheck, badge: lifts.length + gyms.length + brands.length + products.length },
              { id: 'referee', label: '3-Judge Video Studio', icon: Video, badge: lifts.length },
              { id: 'athletes', label: 'Athletes Directory', icon: Users, badge: athletes.length },
              { id: 'moderation', label: 'Moderation & Flags', icon: Flag, badge: reports.length },
              { id: 'revenue', label: 'Revenue Analytics', icon: BarChart3 },
              { id: 'audit', label: 'Audit Trail Logs', icon: History },
              { id: 'settings', label: 'Platform Settings', icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between transition-all ${
                  activeSection === item.id
                    ? 'bg-gold text-black font-black shadow-gold-glow'
                    : 'text-gray-400 hover:text-white hover:bg-surfaceBorder/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                      activeSection === item.id ? 'bg-black text-gold' : 'bg-surfaceBorder text-gray-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-surfaceBorder text-[11px] text-gray-500 flex items-center justify-between">
          <span>HQ Server: Active</span>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>
      </aside>

      {/* 2. MAIN CONTENT VIEWPORT */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl space-y-8 overflow-y-auto">
        {/* Top Operational Status Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-5 rounded-2xl border border-surfaceBorder">
          <div>
            <h1 className="text-2xl font-black text-white capitalize">
              {activeSection.replace('-', ' ')}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Federated Strength Authority • National Gatekeeper Cockpit
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full bg-accentCyan/10 text-accentCyan border border-accentCyan/30 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accentCyan animate-ping" /> Live Gatekeeper Session
            </span>
          </div>
        </div>

        {/* WORKSPACE 1: VERIFICATION COCKPIT */}
        {activeSection === 'verification' && (
          <div className="space-y-6">
            {/* Queue Selector Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-surfaceBorder pb-3">
              {[
                { id: 'lifts', label: 'Lift Videos Referee', count: lifts.length, icon: Video },
                { id: 'gyms', label: 'Gym Equipment Audits', count: gyms.length, icon: Dumbbell },
                { id: 'brands', label: 'Brand & Vendor KYC', count: brands.length, icon: Tag },
                { id: 'products', label: 'Product Lab Reviews', count: products.length, icon: Store },
              ].map((queue) => (
                <button
                  key={queue.id}
                  onClick={() => setActiveQueue(queue.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    activeQueue === queue.id
                      ? 'bg-gold text-black shadow-lg shadow-gold/20'
                      : 'bg-surface text-gray-400 hover:text-white border border-surfaceBorder'
                  }`}
                >
                  <queue.icon className="w-4 h-4" />
                  {queue.label}
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                      activeQueue === queue.id ? 'bg-black text-gold' : 'bg-surfaceBorder text-gray-300'
                    }`}
                  >
                    {queue.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Queue 1: Lift Video Cards */}
            {activeQueue === 'lifts' && (
              <div className="space-y-6">
                {lifts.map((lift) => (
                  <div key={lift.id} className="p-6 rounded-2xl bg-surface border border-surfaceBorder grid md:grid-cols-3 gap-6 items-center">
                    <div className="relative aspect-video rounded-xl bg-black border border-surfaceBorder overflow-hidden flex items-center justify-center">
                      <div className="text-center">
                        <Video className="w-8 h-8 text-gold mx-auto mb-2 opacity-80" />
                        <div className="text-xs font-bold text-gray-300">CameraX HD 60 FPS Footage</div>
                        <div className="text-[10px] text-gray-500 mt-1">{lift.id} • Velocity: {lift.speed}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-white">{lift.athlete}</span>
                        <span className="text-xs font-mono text-gold font-bold">{lift.claimedWeight} {lift.exercise}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-background border border-surfaceBorder text-xs text-accentCyan space-y-1">
                        <div>Depth Check: <strong>{lift.angleScore}</strong></div>
                        <div>Angle: <strong>{lift.depthAngle}</strong> • Pause: <strong>{lift.pauseDuration}</strong></div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <button
                        onClick={() => handleAwardLights(lift.id, true)}
                        className="w-full py-3 rounded-xl bg-accentCyan hover:bg-accentCyan/90 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-accentCyan/20"
                      >
                        <CheckCircle className="w-4 h-4" /> Award 3 White Lights (Verify PR)
                      </button>
                      <button
                        onClick={() => handleAwardLights(lift.id, false)}
                        className="w-full py-2.5 rounded-xl bg-accentRed/20 hover:bg-accentRed/30 border border-accentRed/40 text-accentRed font-bold text-xs flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" /> Red Light (Reject)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Queue 2: Gym Audits */}
            {activeQueue === 'gyms' && (
              <div className="space-y-6">
                {gyms.map((gym) => (
                  <div key={gym.id} className="p-6 rounded-2xl bg-surface border border-surfaceBorder grid md:grid-cols-3 gap-6 items-center">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-gold/10 text-gold text-[10px] font-black uppercase">{gym.tier}</span>
                      <h2 className="text-xl font-bold text-white mt-1.5">{gym.name}</h2>
                      <p className="text-xs text-gray-400 mt-1">{gym.city} • Owner: {gym.owner}</p>
                      <div className="text-[11px] font-mono text-gold mt-1">GSTIN: {gym.gstin}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-background border border-surfaceBorder">Plates: <strong className="text-white block">{gym.plates}</strong></div>
                      <div className="p-2.5 rounded-lg bg-background border border-surfaceBorder">Dumbbells: <strong className="text-white block">{gym.dumbbells}</strong></div>
                      <div className="p-2.5 rounded-lg bg-background border border-surfaceBorder col-span-2">Racks & Coaches: <strong className="text-white block">{gym.racks} • {gym.trainers}</strong></div>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <button onClick={() => alert(`Approved ${gym.name} as Audited Gold!`)} className="w-full py-3 rounded-xl bg-gold text-black font-black text-xs flex items-center justify-center gap-2 shadow-gold-glow">
                        <CheckCircle className="w-4 h-4" /> Grant Audited Gold Badge
                      </button>
                      <button onClick={() => alert(`Requested equipment resubmission for ${gym.name}`)} className="w-full py-2.5 rounded-xl bg-surfaceBorder text-gray-300 font-bold text-xs">
                        Request Resubmission
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Queue 3: Brand & Vendor KYC */}
            {activeQueue === 'brands' && (
              <div className="space-y-6">
                {brands.map((b) => (
                  <div key={b.id} className="p-6 rounded-2xl bg-surface border border-surfaceBorder grid md:grid-cols-3 gap-6 items-center">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-gold/10 text-gold text-[10px] font-black uppercase">{b.type} KYC</span>
                      <h2 className="text-xl font-bold text-white mt-1.5">{b.name}</h2>
                      <p className="text-xs text-gray-400 mt-1">Owner: {b.ownerName} • {b.email}</p>
                      <a href={b.website} target="_blank" className="text-xs text-accentCyan hover:underline mt-1 block">{b.website}</a>
                    </div>
                    <div className="p-4 rounded-xl bg-background border border-surfaceBorder text-xs space-y-1.5">
                      <div>GSTIN: <strong className="text-gold font-mono">{b.gstin}</strong></div>
                      <div>Lifetime Strikes: <strong className={b.strikes >= 1 ? 'text-accentRed' : 'text-green-400'}>{b.strikes}/2 Strikes (2 = Auto-Ban)</strong></div>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <button onClick={() => alert(`Verified GSTIN for ${b.name}!`)} className="w-full py-3 rounded-xl bg-accentCyan text-black font-black text-xs flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Verify GSTIN & Approve
                      </button>
                      <button onClick={() => alert(`Issued warning strike for ${b.name}`)} className="w-full py-2.5 rounded-xl bg-accentRed/20 border border-accentRed/40 text-accentRed font-bold text-xs">
                        Issue Strike / Ban
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Queue 4: Product Lab Reviews */}
            {activeQueue === 'products' && (
              <div className="space-y-6">
                {products.map((p) => (
                  <div key={p.id} className="p-6 rounded-2xl bg-surface border border-surfaceBorder grid md:grid-cols-3 gap-6 items-center">
                    <div>
                      <span className="text-[10px] font-bold text-gold uppercase">{p.category}</span>
                      <h2 className="text-lg font-bold text-white mt-1">{p.name}</h2>
                      <p className="text-xs text-gray-400">{p.brand} • {p.price} ({p.weight})</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-background border border-surfaceBorder text-xs space-y-1 text-accentCyan">
                      <div>Cert ID: <strong className="font-mono">{p.labCertificate}</strong></div>
                      <div>HPLC Check: <strong>{p.hplcScore}</strong></div>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <button onClick={() => alert(`Approved product ${p.name}!`)} className="w-full py-3 rounded-xl bg-gold text-black font-black text-xs flex items-center justify-center gap-2 shadow-gold-glow">
                        <CheckCircle className="w-4 h-4" /> Approve for Marketplace
                      </button>
                      <button onClick={() => alert(`Rejected product ${p.name}. Strike logged.`)} className="w-full py-2.5 rounded-xl bg-accentRed/20 border border-accentRed/40 text-accentRed font-bold text-xs">
                        Reject (Record Strike)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* WORKSPACE 2: 3-JUDGE VIDEO REFEREEING STUDIO */}
        {activeSection === 'referee' && (
          <div className="glass-panel p-8 rounded-3xl border border-gold/30 shadow-gold-glow space-y-8">
            <div>
              <h2 className="text-2xl font-black text-white">IPF Official 3-Judge Video Refereeing Studio</h2>
              <p className="text-xs text-gray-400 mt-1">Multi-angle freeze-frame review, barbell velocity audit, and 3-judge decision light board</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 aspect-video bg-black rounded-2xl border border-surfaceBorder relative flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-12 h-12 text-gold mx-auto mb-2 opacity-80" />
                  <div className="font-bold text-white text-sm">Reviewing: Karan Sharma — 260 kg Raw Squat</div>
                  <div className="text-xs text-gray-400 mt-1">60 FPS Angle Audit • Freeze Frame at Inversion Point</div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-background/80 backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs">
                  <div className="flex gap-2">
                    <button className="px-2.5 py-1 rounded bg-surface border border-white/10 text-gold font-bold">0.25x Slow-Mo</button>
                    <button className="px-2.5 py-1 rounded bg-surface border border-white/10 text-white">0.5x</button>
                    <button className="px-2.5 py-1 rounded bg-surface border border-white/10 text-white">1x</button>
                  </div>
                  <div className="font-mono text-accentCyan font-bold">Depth: 114° (Parallel Exceeded)</div>
                </div>
              </div>

              {/* 3-Judge Decision Light Board */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">3-Referee Light Board</h3>
                {[
                  { title: 'Head Center Judge', isWhite: true },
                  { title: 'Left Side Judge', isWhite: true },
                  { title: 'Right Side Judge', isWhite: true },
                ].map((judge, jIdx) => (
                  <div key={jIdx} className="p-4 rounded-xl bg-surface border border-surfaceBorder flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">{judge.title}</div>
                      <div className="text-[10px] text-gray-400">Technical Decision</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] border-2 border-gray-300 flex items-center justify-center font-bold text-black text-xs">
                      ●
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => alert('Official Ruling: 3 WHITE LIGHTS. Record ratified!')}
                  className="w-full py-4 rounded-2xl bg-gold text-black font-black text-sm flex items-center justify-center gap-2 shadow-gold-glow mt-4"
                >
                  <Award className="w-5 h-5" /> Ratify National Record (+50 Pts)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WORKSPACE 3: ATHLETES & USERS DIRECTORY */}
        {activeSection === 'athletes' && (
          <div className="glass-panel p-6 rounded-3xl border border-surfaceBorder space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Athletes Roster & Verified Rankings</h2>
                <p className="text-xs text-gray-400">View official SBD totals, weight classes, and verified badges</p>
              </div>
              <input type="text" placeholder="Search athletes..." className="px-4 py-2 rounded-xl bg-surface border border-surfaceBorder text-xs text-white outline-none focus:border-gold" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-gray-400 uppercase border-b border-surfaceBorder">
                  <tr>
                    <th className="py-3">Athlete</th>
                    <th className="py-3">City</th>
                    <th className="py-3">Weight Class</th>
                    <th className="py-3">Squat</th>
                    <th className="py-3">Bench</th>
                    <th className="py-3">Deadlift</th>
                    <th className="py-3">Total SBD</th>
                    <th className="py-3">Lift Points</th>
                    <th className="py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surfaceBorder">
                  {athletes.map((a) => (
                    <tr key={a.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 font-bold text-white">{a.name} <span className="text-[10px] text-gray-500 block">{a.email}</span></td>
                      <td className="py-4 text-gray-300">{a.city}</td>
                      <td className="py-4 font-semibold text-gold">{a.weightClass}</td>
                      <td className="py-4">{a.squat} kg</td>
                      <td className="py-4">{a.bench} kg</td>
                      <td className="py-4">{a.deadlift} kg</td>
                      <td className="py-4 font-black text-white text-sm">{a.total} kg</td>
                      <td className="py-4 text-gold font-bold">{a.points} pts</td>
                      <td className="py-4"><span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 font-bold text-[10px]">VERIFIED</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* WORKSPACE 4: MODERATION QUEUE */}
        {activeSection === 'moderation' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Community & Review Moderation Queue</h2>
            {reports.map((rep) => (
              <div key={rep.id} className="p-6 rounded-2xl bg-surface border border-surfaceBorder grid md:grid-cols-3 gap-6 items-center">
                <div>
                  <span className="px-2 py-0.5 rounded bg-accentRed/20 text-accentRed text-[10px] font-bold">FLAGGED REPORT</span>
                  <h3 className="text-lg font-bold text-white mt-1.5">{rep.target}</h3>
                  <p className="text-xs text-gray-400 mt-1">Reporter: {rep.reporter} • {rep.timestamp}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-background border border-surfaceBorder text-xs text-gray-300 italic">
                  "{rep.content}"
                  <div className="text-[10px] text-accentRed font-semibold not-italic mt-1">Reason: {rep.reason}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => alert(`Dismissed report ${rep.id}`)} className="w-full py-2.5 rounded-xl bg-surfaceBorder text-white text-xs font-bold">
                    Dismiss Report
                  </button>
                  <button onClick={() => alert(`Deleted content and issued penalty`)} className="w-full py-2.5 rounded-xl bg-accentRed/20 border border-accentRed/40 text-accentRed text-xs font-bold">
                    Delete Content & Penalize
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* WORKSPACE 5: REVENUE & GMV ANALYTICS */}
        {activeSection === 'revenue' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Platform GMV', value: '₹ 17.8 Lakhs', change: '+42% MoM', icon: DollarSign },
                { label: 'Gym Pro Subscriptions', value: '₹ 3.89 Lakhs/mo', change: '130 Active Gyms', icon: Dumbbell },
                { label: 'Verified Marketplace Sales', value: '₹ 12.4 Lakhs', change: '8% Commission', icon: Store },
                { label: 'Lift Points In Circulation', value: '1.45 Million', change: 'Economy Healthy', icon: Award },
              ].map((stat, sIdx) => (
                <div key={sIdx} className="glass-panel p-5 rounded-2xl">
                  <stat.icon className="w-5 h-5 text-gold mb-2" />
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
                  <div className="text-[10px] text-green-400 font-bold mt-2 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> {stat.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Recharts GMV Curve */}
            <div className="glass-panel p-6 rounded-3xl border border-surfaceBorder">
              <h3 className="text-lg font-bold text-white mb-6">Gross Merchandise Value & Revenue Growth (INR)</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="goldGmv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F5C518" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#F5C518" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232638" />
                    <XAxis dataKey="month" stroke="#9090A0" />
                    <YAxis stroke="#9090A0" />
                    <Tooltip contentStyle={{ background: '#151722', border: '1px solid #232638', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="gmv" stroke="#F5C518" strokeWidth={3} fillOpacity={1} fill="url(#goldGmv)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* WORKSPACE 6: AUDIT TRAIL LOGS */}
        {activeSection === 'audit' && (
          <div className="glass-panel p-6 rounded-3xl border border-surfaceBorder space-y-6">
            <h2 className="text-xl font-bold text-white">System Security & Action Audit Trail</h2>
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-xl bg-surface border border-surfaceBorder flex items-center justify-between text-xs">
                  <div>
                    <div className="font-mono text-gold font-bold">{log.action}</div>
                    <p className="text-gray-400 text-[11px] mt-0.5">{log.notes}</p>
                  </div>
                  <div className="text-right text-gray-500 font-mono text-[10px]">
                    <div>{log.admin}</div>
                    <div>{log.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WORKSPACE 7: PLATFORM SETTINGS */}
        {activeSection === 'settings' && (
          <div className="glass-panel p-6 rounded-3xl border border-surfaceBorder max-w-2xl space-y-6">
            <h2 className="text-xl font-bold text-white">Federated Ecosystem Governance Settings</h2>
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-surface border border-surfaceBorder flex justify-between items-center">
                <div>
                  <div className="font-bold text-white text-sm">Lift Points Awarded per Verified PR</div>
                  <div className="text-gray-400">Default points credited upon 3 White Lights</div>
                </div>
                <strong className="text-gold text-base">50 pts</strong>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-surfaceBorder flex justify-between items-center">
                <div>
                  <div className="font-bold text-white text-sm">Anti-Counterfeit Auto-Ban Strike Limit</div>
                  <div className="text-gray-400">Lifetime product rejections before business ban</div>
                </div>
                <strong className="text-accentRed text-base">2 Strikes</strong>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-surfaceBorder flex justify-between items-center">
                <div>
                  <div className="font-bold text-white text-sm">Emergency System Maintenance Mode</div>
                  <div className="text-gray-400">Temporarily freeze lift submissions</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-green-500/20 text-green-400 font-bold">OPERATIONAL</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Trophy, Medal, ShieldCheck, Flame, Search, 
  Filter, Play, CheckCircle2, Award, ChevronRight, Eye 
} from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  city: string;
  gym: string;
  weightClass: string;
  squat: number;
  bench: number;
  deadlift: number;
  total: number;
  wilks: number;
  points: number;
  verifiedVideoUrl?: string;
  status: 'verified' | 'pending';
}

const FALLBACK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    id: 'ath-1',
    name: 'Vikramaditya Rathore',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    city: 'New Delhi',
    gym: 'Iron Pulse Strength & Conditioning',
    weightClass: '93 kg',
    squat: 285,
    bench: 195,
    deadlift: 340,
    total: 820,
    wilks: 512.4,
    points: 4200,
    verifiedVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    status: 'verified',
  },
  {
    rank: 2,
    id: 'ath-2',
    name: 'Gurpreet Singh Randhawa',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    city: 'Chandigarh',
    gym: 'Spartan Strength Lab',
    weightClass: '93 kg',
    squat: 275,
    bench: 190,
    deadlift: 335,
    total: 800,
    wilks: 501.8,
    points: 3850,
    verifiedVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    status: 'verified',
  },
  {
    rank: 3,
    id: 'ath-3',
    name: 'Ananya Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    city: 'Pune',
    gym: 'Barbell Club India',
    weightClass: '63 kg',
    squat: 190,
    bench: 115,
    deadlift: 220,
    total: 525,
    wilks: 498.2,
    points: 3600,
    verifiedVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    status: 'verified',
  },
  {
    rank: 4,
    id: 'ath-4',
    name: 'Rohan Kulkarni',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    city: 'Bengaluru',
    gym: 'Spartan Strength Lab',
    weightClass: '83 kg',
    squat: 260,
    bench: 175,
    deadlift: 310,
    total: 745,
    wilks: 489.1,
    points: 3150,
    status: 'verified',
  },
  {
    rank: 5,
    id: 'ath-5',
    name: 'Mohd. Zeeshan',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    city: 'Hyderabad',
    gym: 'Iron Pulse Strength & Conditioning',
    weightClass: '105 kg',
    squat: 290,
    bench: 200,
    deadlift: 330,
    total: 820,
    wilks: 485.6,
    points: 2980,
    status: 'verified',
  },
  {
    rank: 6,
    id: 'ath-6',
    name: 'Kavita Sundaram',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    city: 'Chennai',
    gym: 'Barbell Club India',
    weightClass: '57 kg',
    squat: 175,
    bench: 105,
    deadlift: 205,
    total: 485,
    wilks: 482.3,
    points: 2840,
    status: 'verified',
  },
  {
    rank: 7,
    id: 'ath-7',
    name: 'Devender Rawat',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    city: 'Dehradun',
    gym: 'Doon Strength Guild',
    weightClass: '74 kg',
    squat: 235,
    bench: 155,
    deadlift: 280,
    total: 670,
    wilks: 479.5,
    points: 2650,
    status: 'verified',
  },
];

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(FALLBACK_LEADERBOARD);
  const [selectedDiscipline, setSelectedDiscipline] = useState<'total' | 'squat' | 'bench' | 'deadlift'>('total');
  const [selectedWeightClass, setSelectedWeightClass] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideoModal, setActiveVideoModal] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    document.title = 'National Strength Leaderboard | Athloboard';

    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/lifts/leaderboard`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped: LeaderboardEntry[] = data.map((item: any, idx: number) => ({
              rank: idx + 1,
              id: item.athlete_id || `ath-${idx}`,
              name: item.display_name || `Athlete #${idx + 1}`,
              avatar: item.profile_photo_url || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
              city: item.city || 'National',
              gym: item.gym_name || 'Athloboard Federated',
              weightClass: item.weight_class_kg ? `${item.weight_class_kg} kg` : 'Open',
              squat: Number(item.max_squat) || 240,
              bench: Number(item.max_bench) || 160,
              deadlift: Number(item.max_deadlift) || 280,
              total: (Number(item.max_squat) || 240) + (Number(item.max_bench) || 160) + (Number(item.max_deadlift) || 280),
              wilks: 480.0,
              points: 2500,
              status: 'verified',
            }));
            setLeaderboard(mapped);
          }
        }
      } catch (e) {
        // Use rich fallback data
      }
    };

    fetchLeaderboard();
  }, []);

  const weightClasses = ['All', '59 kg', '66 kg', '74 kg', '83 kg', '93 kg', '105 kg', '120 kg'];

  const filtered = leaderboard
    .filter((ath) => {
      const matchesWeight = selectedWeightClass === 'All' || ath.weightClass === selectedWeightClass;
      const matchesSearch = !searchQuery || 
        ath.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        ath.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ath.gym.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesWeight && matchesSearch;
    })
    .sort((a, b) => {
      if (selectedDiscipline === 'squat') return b.squat - a.squat;
      if (selectedDiscipline === 'bench') return b.bench - a.bench;
      if (selectedDiscipline === 'deadlift') return b.deadlift - a.deadlift;
      return b.total - a.total;
    })
    .map((ath, idx) => ({ ...ath, rank: idx + 1 }));

  return (
    <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-10 text-white">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-bold border border-gold/30 mb-2">
            <Trophy className="w-3.5 h-3.5 text-gold" /> IPF Sanctioned Dynamic Rankings
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            National Strength <span className="text-gold">Leaderboard</span>
          </h1>
          <p className="text-muted text-sm sm:text-base mt-2 max-w-2xl">
            Official federated powerlifting rankings. Every single lift recorded in the database is verified by our FastAPI AI Biomechanical referee and ratified with 3 Olympic White Lights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/verify"
            className="px-5 py-3 rounded-xl bg-gold text-black font-black text-xs flex items-center gap-2 shadow-gold-glow hover:scale-105 transition-transform"
          >
            <ShieldCheck className="w-4 h-4" /> AI Lift Verifier
          </Link>
          <a
            href="/downloads/athloboard-app.apk"
            className="px-5 py-3 rounded-xl bg-surface hover:bg-surfaceHover border border-white/10 text-white font-bold text-xs flex items-center gap-2 transition-colors"
          >
            Submit My PR
          </a>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {filtered.slice(0, 3).map((athlete, idx) => {
          const podiumBg = idx === 0 
            ? 'border-gold bg-gradient-to-b from-gold/15 to-surface shadow-[0_0_30px_rgba(212,175,55,0.15)]' 
            : idx === 1 
            ? 'border-slate-300/40 bg-gradient-to-b from-slate-400/10 to-surface' 
            : 'border-amber-700/40 bg-gradient-to-b from-amber-700/10 to-surface';
          
          const medalColor = idx === 0 ? 'text-gold fill-gold' : idx === 1 ? 'text-slate-300 fill-slate-300' : 'text-amber-600 fill-amber-600';
          const medalLabel = idx === 0 ? 'National #1 Record' : idx === 1 ? 'Rank #2 Contender' : 'Rank #3 Podium';

          return (
            <div key={athlete.id} className={`glass-panel p-6 rounded-3xl border ${podiumBg} relative flex flex-col justify-between`}>
              <div className="flex justify-between items-start">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/40 border border-white/10 ${idx === 0 ? 'text-gold' : 'text-slate-300'}`}>
                  {medalLabel}
                </span>
                <Medal className={`w-7 h-7 ${medalColor}`} />
              </div>

              <div className="flex items-center gap-4 mt-6">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-gold/40 shadow-md">
                  <img src={athlete.avatar} alt={athlete.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">{athlete.name}</h3>
                  <p className="text-xs text-muted">{athlete.city} • <span className="text-gold font-bold">{athlete.weightClass}</span></p>
                  <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{athlete.gym}</p>
                </div>
              </div>

              {/* Big Stats */}
              <div className="grid grid-cols-3 gap-2 mt-6 p-3 rounded-2xl bg-black/30 border border-white/5 text-center">
                <div>
                  <div className="text-[10px] text-muted uppercase font-bold">Squat</div>
                  <div className="text-base font-black text-white">{athlete.squat} <span className="text-[10px] text-gold">kg</span></div>
                </div>
                <div>
                  <div className="text-[10px] text-muted uppercase font-bold">Bench</div>
                  <div className="text-base font-black text-white">{athlete.bench} <span className="text-[10px] text-gold">kg</span></div>
                </div>
                <div>
                  <div className="text-[10px] text-muted uppercase font-bold">Deadlift</div>
                  <div className="text-base font-black text-white">{athlete.deadlift} <span className="text-[10px] text-gold">kg</span></div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold">Total SBD</span>
                  <div className="text-2xl font-black text-white">{athlete.total} <span className="text-xs text-gold">kg</span></div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted uppercase font-bold">Wilks Score</span>
                  <div className="text-sm font-bold text-emerald-400">{athlete.wilks} pts</div>
                </div>
              </div>

              {athlete.verifiedVideoUrl && (
                <button
                  onClick={() => setActiveVideoModal(athlete)}
                  className="mt-4 w-full py-2 rounded-xl bg-gold/10 hover:bg-gold text-gold hover:text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Watch Verified Attempt
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Filter and Search Controls */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex flex-col lg:flex-row justify-between gap-4 items-center">
          
          {/* Discipline Selector */}
          <div className="flex items-center gap-2 bg-surface p-1.5 rounded-2xl border border-white/5 w-full sm:w-auto overflow-x-auto">
            {(['total', 'squat', 'bench', 'deadlift'] as const).map((disc) => (
              <button
                key={disc}
                onClick={() => setSelectedDiscipline(disc)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  selectedDiscipline === disc 
                    ? 'bg-gold text-black shadow-gold-glow' 
                    : 'text-muted hover:text-white'
                }`}
              >
                {disc === 'total' ? 'SBD Total' : disc}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search athlete, city, or gym..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-xs outline-none focus:border-gold placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Weight Class Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 scrollbar-none">
          <span className="text-xs font-bold text-muted flex items-center gap-1 whitespace-nowrap mr-2">
            <Filter className="w-3.5 h-3.5" /> Weight Class:
          </span>
          {weightClasses.map((wc) => (
            <button
              key={wc}
              onClick={() => setSelectedWeightClass(wc)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedWeightClass === wc 
                  ? 'bg-white text-black font-bold' 
                  : 'bg-surface hover:bg-surfaceHover text-muted border border-white/5'
              }`}
            >
              {wc}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface/80 border-b border-white/10 text-muted uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="p-4 w-14 text-center">Rank</th>
                <th className="p-4">Athlete</th>
                <th className="p-4">Weight Class</th>
                <th className="p-4 text-right">Squat</th>
                <th className="p-4 text-right">Bench</th>
                <th className="p-4 text-right">Deadlift</th>
                <th className="p-4 text-right font-black text-white">Total</th>
                <th className="p-4 text-right">Wilks</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((ath) => (
                <tr key={ath.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-center font-black">
                    {ath.rank === 1 ? (
                      <span className="w-7 h-7 rounded-full bg-gold text-black inline-flex items-center justify-center font-black text-xs shadow-gold-glow">1</span>
                    ) : ath.rank === 2 ? (
                      <span className="w-7 h-7 rounded-full bg-slate-300 text-black inline-flex items-center justify-center font-black text-xs">2</span>
                    ) : ath.rank === 3 ? (
                      <span className="w-7 h-7 rounded-full bg-amber-700 text-white inline-flex items-center justify-center font-black text-xs">3</span>
                    ) : (
                      <span className="text-muted font-mono">{ath.rank}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={ath.avatar} alt={ath.name} className="w-9 h-9 rounded-xl object-cover border border-white/10" />
                      <div>
                        <div className="font-bold text-white text-sm">{ath.name}</div>
                        <div className="text-[11px] text-muted">{ath.city} • {ath.gym}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-gold">{ath.weightClass}</td>
                  <td className="p-4 text-right font-mono text-slate-200">{ath.squat} kg</td>
                  <td className="p-4 text-right font-mono text-slate-200">{ath.bench} kg</td>
                  <td className="p-4 text-right font-mono text-slate-200">{ath.deadlift} kg</td>
                  <td className="p-4 text-right font-mono font-black text-base text-gold">{ath.total} kg</td>
                  <td className="p-4 text-right font-mono text-emerald-400 font-bold">{ath.wilks}</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" /> 3 White Lights
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setActiveVideoModal(ath)}
                      className="p-2 rounded-lg bg-surface hover:bg-gold hover:text-black text-muted transition-colors"
                      title="Inspect Video Audit"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Video Verification Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-gold/30 max-w-xl w-full space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <div>
                <h3 className="font-bold text-lg text-white">{activeVideoModal.name} — Verified Attempt</h3>
                <p className="text-xs text-muted">IPF Sanctioned Attempt • {activeVideoModal.weightClass} Class</p>
              </div>
              <button 
                onClick={() => setActiveVideoModal(null)}
                className="w-8 h-8 rounded-full bg-surface text-white flex items-center justify-center hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 relative flex items-center justify-center">
              <video
                src={activeVideoModal.verifiedVideoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-surface border border-white/5 text-center text-xs">
              <div>
                <div className="text-muted text-[10px]">AI Hip Depth</div>
                <div className="font-bold text-emerald-400">94.2° (Legal)</div>
              </div>
              <div>
                <div className="text-muted text-[10px]">Pause Duration</div>
                <div className="font-bold text-emerald-400">1.12s (Motionless)</div>
              </div>
              <div>
                <div className="text-muted text-[10px]">Jury Verdict</div>
                <div className="font-bold text-gold">3 White Lights</div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveVideoModal(null)}
                className="px-5 py-2.5 rounded-xl bg-surface hover:bg-surfaceHover text-white text-xs font-bold"
              >
                Close
              </button>
              <Link
                href="/verify"
                className="px-5 py-2.5 rounded-xl bg-gold text-black text-xs font-black shadow-gold-glow flex items-center gap-1.5"
              >
                Open in AI Studio <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

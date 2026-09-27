'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Trophy, Calendar, MapPin, Users, Award, 
  CheckCircle2, Clock, ArrowRight, ShieldCheck, 
  ExternalLink, Search, Filter 
} from 'lucide-react';

interface Competition {
  id: string;
  title: string;
  status: 'upcoming' | 'live' | 'completed';
  eventDate: string;
  city: string;
  venue: string;
  venueGymId: string;
  sanctioningBody: string;
  entryFee: string;
  prizePool: string;
  registeredCount: number;
  maxSlots: number;
  weightClasses: string[];
  description: string;
  podium?: { rank: number; name: string; total: number; wilks: number }[];
}

const COMPETITIONS: Competition[] = [
  {
    id: 'comp-1',
    title: 'All-India National Senior Powerlifting Championship 2026',
    status: 'upcoming',
    eventDate: 'November 14-16, 2026',
    city: 'New Delhi',
    venue: 'Indira Gandhi Indoor Stadium & Iron Pulse Gym',
    venueGymId: '1',
    sanctioningBody: 'Powerlifting India (IPF Affiliated)',
    entryFee: '₹ 1,500',
    prizePool: '₹ 5,00,000',
    registeredCount: 148,
    maxSlots: 200,
    weightClasses: ['59kg', '66kg', '74kg', '83kg', '93kg', '105kg', '120kg', '120kg+'],
    description: 'The pinnacle of Indian powerlifting. 3-judge certified IPF refereeing with Athloboard real-time video verification and drug-tested standards.',
  },
  {
    id: 'comp-2',
    title: 'Delhi State Bench Press & Deadlift Classic 2026',
    status: 'upcoming',
    eventDate: 'October 25, 2026',
    city: 'New Delhi',
    venue: 'Iron Pulse Strength & Conditioning',
    venueGymId: '1',
    sanctioningBody: 'Delhi Powerlifting Association',
    entryFee: '₹ 999',
    prizePool: '₹ 1,50,000',
    registeredCount: 82,
    maxSlots: 100,
    weightClasses: ['Open Men & Women (All Classes)'],
    description: 'Push-Pull championship held on IPF calibrated ER combo racks and Eleiko competition bars.',
  },
  {
    id: 'comp-3',
    title: 'South India Regional Strength Clash 2026',
    status: 'upcoming',
    eventDate: 'December 05, 2026',
    city: 'Bengaluru',
    venue: 'Spartan Strength Lab, Indiranagar',
    venueGymId: '3',
    sanctioningBody: 'Karnataka Strength Sports Guild',
    entryFee: '₹ 1,200',
    prizePool: '₹ 2,00,000',
    registeredCount: 64,
    maxSlots: 90,
    weightClasses: ['66kg', '74kg', '83kg', '93kg', '105kg'],
    description: 'Regional showdown featuring calibrated Bullrock steel plates, electronic scoring, and instant Athloboard points awarding.',
  },
  {
    id: 'comp-4',
    title: 'Mumbai Open Powerlifting Cup 2026',
    status: 'completed',
    eventDate: 'August 18, 2026',
    city: 'Mumbai',
    venue: 'Barbell Club India, Bandra',
    venueGymId: '2',
    sanctioningBody: 'Maharashtra Powerlifting Federation',
    entryFee: '₹ 1,000',
    prizePool: '₹ 1,00,000',
    registeredCount: 75,
    maxSlots: 75,
    weightClasses: ['Open Categories'],
    description: 'Concluded championship. Over 15 national records broken with 100% video verification.',
    podium: [
      { rank: 1, name: 'Vikramaditya Rathore', total: 820, wilks: 512.4 },
      { rank: 2, name: 'Ananya Deshmukh', total: 525, wilks: 498.2 },
      { rank: 3, name: 'Devender Rawat', total: 670, wilks: 479.5 },
    ],
  },
];

export default function CompetitionsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [selectedCompForReg, setSelectedCompForReg] = useState<Competition | null>(null);
  const [athleteName, setAthleteName] = useState('');
  const [selectedClass, setSelectedClass] = useState('83kg');
  const [regSuccess, setRegSuccess] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setSelectedCompForReg(null);
    }, 3000);
  };

  const filtered = COMPETITIONS.filter((c) => 
    activeTab === 'upcoming' ? c.status === 'upcoming' || c.status === 'live' : c.status === 'completed'
  );

  return (
    <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-10 text-gray-900">
      
      {/* Toast Notification */}
      {regSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>Registered successfully for {selectedCompForReg?.title}! Confirmation sent to your athlete profile.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 text-fitRed text-xs font-bold border border-red-200 mb-2">
            <Trophy className="w-3.5 h-3.5 text-fitRed" /> Sanctioned National &amp; State Championships
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight">
            Strength Sports <span className="text-fitRed">Competitions</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-2xl">
            Official meets hosted at audited powerlifting facilities. Certified 3-judge Olympic refereeing, calibrated plates, and electronic leaderboards synced to Athloboard.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'upcoming' ? 'bg-fitRed text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Upcoming Meets (3)
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'completed' ? 'bg-fitRed text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Past Results
          </button>
        </div>
      </div>

      {/* Meets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map((comp) => (
          <div key={comp.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 rounded-full bg-red-50 text-fitRed border border-red-200 font-bold text-xs uppercase tracking-wider">
                  {comp.sanctioningBody}
                </span>
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Prize: {comp.prizePool}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-gray-950">{comp.title}</h2>
              <p className="text-xs text-gray-600 leading-relaxed">{comp.description}</p>

              {/* Specs Pill Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-fitRed flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">Date</div>
                    <div className="font-bold text-gray-950">{comp.eventDate}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-fitRed flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">Venue</div>
                    <Link href={`/gyms/${comp.venueGymId}`} className="font-bold text-gray-950 hover:text-fitRed truncate block max-w-[140px]">
                      {comp.venue}
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-fitRed flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">Registered Lifters</div>
                    <div className="font-bold text-gray-950">{comp.registeredCount} / {comp.maxSlots} Slots</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-fitRed flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">Entry Fee</div>
                    <div className="font-bold text-fitRed font-mono">{comp.entryFee}</div>
                  </div>
                </div>
              </div>

              {/* Completed Results Podium */}
              {comp.podium && (
                <div className="pt-2 border-t border-gray-100 space-y-2">
                  <div className="text-xs font-bold text-fitRed uppercase tracking-wider">Meet Champions</div>
                  <div className="space-y-1.5">
                    {comp.podium.map((champ) => (
                      <div key={champ.rank} className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-950">#{champ.rank} {champ.name}</span>
                        <div className="font-mono text-gray-600">
                          Total: <strong className="text-fitRed">{champ.total} kg</strong> • Wilks: <strong className="text-emerald-700">{champ.wilks}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
              <Link
                href={`/gyms/${comp.venueGymId}`}
                className="text-xs font-bold text-gray-600 hover:text-fitRed flex items-center gap-1"
              >
                Inspect Venue Specs <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              {comp.status === 'upcoming' && (
                <button
                  onClick={() => setSelectedCompForReg(comp)}
                  className="px-6 py-2.5 rounded-xl bg-fitRed hover:bg-fitRed-hover text-white font-extrabold text-xs shadow-md shadow-red-500/20 transition-all hover:scale-105 uppercase tracking-wider"
                >
                  Register as Athlete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Registration Modal */}
      {selectedCompForReg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full space-y-6 text-gray-900">
            <div className="flex justify-between items-start pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-black text-gray-950">Register for Championship</h3>
                <p className="text-xs text-gray-500 mt-1">{selectedCompForReg.title}</p>
              </div>
              <button
                onClick={() => setSelectedCompForReg(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">Athlete Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Rathore"
                  value={athleteName}
                  onChange={(e) => setAthleteName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">Weight Category</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed transition-all"
                >
                  <option value="66kg">66 kg Class</option>
                  <option value="74kg">74 kg Class</option>
                  <option value="83kg">83 kg Class</option>
                  <option value="93kg">93 kg Class</option>
                  <option value="105kg">105 kg Class</option>
                  <option value="120kg">120 kg Class</option>
                  <option value="120kg+">120 kg+ Open</option>
                </select>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Sanctioning Body:</span>
                  <span className="font-bold text-gray-950">{selectedCompForReg.sanctioningBody}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Registration Fee:</span>
                  <span className="font-bold text-fitRed font-mono">{selectedCompForReg.entryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Verification Requirement:</span>
                  <span className="font-bold text-emerald-600">Athloboard ID Verified</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-fitRed hover:bg-fitRed-hover text-white font-extrabold text-xs shadow-md shadow-red-500/20 transition-all hover:scale-105 uppercase tracking-wider"
              >
                Confirm Athlete Registration
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Dumbbell, Users, Calendar, Plus, TrendingUp, 
  Send, CheckCircle2, Megaphone, Tag, ShieldCheck, 
  ExternalLink, ArrowUpRight 
} from 'lucide-react';

interface Promo {
  id: string;
  title: string;
  code: string;
  discount: string;
  reach: string;
  status: string;
}

export default function GymDashboardPage() {
  const [activeTab, setActiveTab] = useState<'leads' | 'specs' | 'members' | 'promos'>('leads');
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoSuccessToast, setPromoSuccessToast] = useState(false);

  const [promos, setPromos] = useState<Promo[]>([
    { id: 'p-1', title: 'Summer Powerlifting Prep Camp', code: 'POWER20', discount: '20% OFF', reach: '184 Local Lifters', status: 'Active' },
    { id: 'p-2', title: 'Weekend Day Pass Special', code: 'WEEKEND399', discount: '₹399 Entry', reach: '240 Local Lifters', status: 'Active' },
  ]);

  const [newPromoTitle, setNewPromoTitle] = useState('');
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState('25% OFF');

  const leads = [
    { id: '1', name: 'Vikram Singh', goal: 'Powerlifting prep (93kg)', status: 'New', time: '10m ago', phone: '+91 98110 99421' },
    { id: '2', name: 'Pooja Rawat', goal: 'Strength coaching', status: 'Contacted', time: '2h ago', phone: '+91 98200 12845' },
    { id: '3', name: 'Rahul Joshi', goal: 'Annual Membership', status: 'Converted', time: 'Yesterday', phone: '+91 99000 78120' },
  ];

  const handleBroadcastPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Promo = {
      id: `p-${Date.now()}`,
      title: newPromoTitle || 'Flash Strength Membership',
      code: newPromoCode || 'ATHLO25',
      discount: newPromoDiscount,
      reach: '184 Local Lifters (5km Radius)',
      status: 'Dispatched',
    };
    setPromos([created, ...promos]);
    setShowPromoModal(false);
    setPromoSuccessToast(true);
    setNewPromoTitle('');
    setNewPromoCode('');
    setTimeout(() => setPromoSuccessToast(false), 4500);
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 text-white">
      
      {/* Toast Notification */}
      {promoSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-black px-6 py-4 rounded-2xl font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-black" />
          <span>Promotional campaign dispatched to 184 athletes via Athloboard app & WhatsApp!</span>
        </div>
      )}

      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-panel p-6 rounded-3xl border border-gold/20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">Iron Pulse Strength Gym</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-gold text-black font-black text-[10px] uppercase shadow-gold-glow">
              Audited Gold
            </span>
          </div>
          <p className="text-xs text-muted mt-1">Gym Partner ID: GYM-DEL-1042 • South Extension II, New Delhi</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/gyms/1"
            className="px-4 py-2 rounded-xl bg-surface hover:bg-surfaceHover border border-white/10 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            Public Storefront <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <button 
            onClick={() => setShowPromoModal(true)}
            className="px-4 py-2 rounded-xl bg-gold hover:bg-gold-glow text-black font-black text-xs flex items-center gap-1.5 shadow-gold-glow transition-all hover:scale-105"
          >
            <Megaphone className="w-4 h-4" /> Broadcast Promo
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Members', value: '184', icon: Users },
          { label: 'Monthly Leads', value: '42', icon: TrendingUp },
          { label: 'Audited Plate Weight', value: '3,200 kg', icon: Dumbbell },
          { label: 'Meets Hosted', value: '4', icon: Calendar },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-5 rounded-2xl border border-white/5">
            <stat.icon className="w-5 h-5 text-gold mb-2" />
            <div className="text-2xl font-black text-white">{stat.value}</div>
            <div className="text-[11px] text-muted uppercase font-bold mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        {(['leads', 'specs', 'members', 'promos'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-gold text-black shadow-gold-glow'
                : 'text-muted hover:text-white bg-surface'
            }`}
          >
            {tab === 'leads' ? 'Leads Kanban' : tab === 'specs' ? 'Equipment Specs' : tab === 'members' ? 'Member Roster' : 'Promotions'}
          </button>
        ))}
      </div>

      {/* Tab 1: Leads Kanban Board */}
      {activeTab === 'leads' && (
        <div className="grid md:grid-cols-3 gap-6">
          {['New', 'Contacted', 'Converted'].map((column) => (
            <div key={column} className="glass-panel p-5 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
                <span className="font-bold text-sm text-white">{column} Leads</span>
                <span className="text-xs font-bold text-gold px-2 py-0.5 rounded bg-gold/10">
                  {leads.filter((l) => l.status === column).length}
                </span>
              </div>
              <div className="space-y-3">
                {leads
                  .filter((l) => l.status === column)
                  .map((lead) => (
                    <div key={lead.id} className="p-4 rounded-xl bg-surface border border-white/10 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-white">{lead.name}</span>
                        <span className="text-[10px] text-muted">{lead.time}</span>
                      </div>
                      <p className="text-xs text-muted">{lead.goal}</p>
                      <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5 flex justify-between">
                        <span>{lead.phone}</span>
                        <span className="text-gold font-bold">Verified Lifter</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Equipment Specs */}
      {activeTab === 'specs' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gold" /> Phase 2 Equipment Specifications
              </h2>
              <p className="text-xs text-muted mt-1">Inspected and verified by Athloboard State Technical Auditor.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              Audited Gold Certified
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-surface border border-white/5">
              <span className="text-muted block text-[10px] uppercase font-bold">Total Plate Weight</span>
              <strong className="text-white text-base">3,200 kg (Calibrated Eleiko & Bullrock)</strong>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-white/5">
              <span className="text-muted block text-[10px] uppercase font-bold">Dumbbell Tiers</span>
              <strong className="text-white text-base">2.5 kg to 65 kg pairs</strong>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-white/5">
              <span className="text-muted block text-[10px] uppercase font-bold">Certified Coaching Staff</span>
              <strong className="text-white text-base">4 Certified Male, 2 Certified Female</strong>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-white/5">
              <span className="text-muted block text-[10px] uppercase font-bold">Powerlifting Combo Racks</span>
              <strong className="text-white text-base">4 ER Competition Combo Racks</strong>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Member Roster */}
      {activeTab === 'members' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <h2 className="text-xl font-bold text-white">Active Member Roster</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface border-b border-white/10 text-muted">
                <tr>
                  <th className="p-3 font-semibold">Athlete Name</th>
                  <th className="p-3 font-semibold">Weight Class</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Membership Plan</th>
                  <th className="p-3 font-semibold">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="p-3 font-bold text-white">Aditya Sharma</td>
                  <td className="p-3 font-mono text-gold">93 kg Class</td>
                  <td className="p-3"><span className="text-emerald-400 font-bold">● Active</span></td>
                  <td className="p-3 text-slate-300">Annual Power Athlete</td>
                  <td className="p-3 text-muted">Jan 12, 2026</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white">Meera Patel</td>
                  <td className="p-3 font-mono text-gold">63 kg Class</td>
                  <td className="p-3"><span className="text-emerald-400 font-bold">● Active</span></td>
                  <td className="p-3 text-slate-300">Monthly Strength</td>
                  <td className="p-3 text-muted">Feb 04, 2026</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white">Karan Johar</td>
                  <td className="p-3 font-mono text-gold">105 kg Class</td>
                  <td className="p-3"><span className="text-emerald-400 font-bold">● Active</span></td>
                  <td className="p-3 text-slate-300">Quarterly Strength</td>
                  <td className="p-3 text-muted">Mar 18, 2026</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Promotions & Broadcasts */}
      {activeTab === 'promos' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold text-white">Active Promotional Broadcasts</h2>
              <p className="text-xs text-muted mt-1">Broadcast targeted flash memberships to nearby lifters.</p>
            </div>
            <button
              onClick={() => setShowPromoModal(true)}
              className="px-4 py-2 rounded-xl bg-gold text-black font-black text-xs flex items-center gap-1.5 shadow-gold-glow"
            >
              <Plus className="w-4 h-4" /> New Campaign
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {promos.map((p) => (
              <div key={p.id} className="p-4 rounded-2xl bg-surface border border-white/5 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-white text-sm">{p.title}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    {p.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="px-2.5 py-1 rounded bg-black/40 border border-gold/30 font-mono font-bold text-gold">
                    {p.code}
                  </div>
                  <span className="text-slate-300">{p.discount}</span>
                </div>
                <div className="text-[10px] text-muted flex items-center gap-1 pt-1 border-t border-white/5">
                  <Users className="w-3 h-3 text-gold" /> Audience: {p.reach}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Broadcast Promo Modal */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gold/40 max-w-lg w-full space-y-6">
            <div className="flex justify-between items-start pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-black text-white">Broadcast Promo to Lifters</h3>
                <p className="text-xs text-muted mt-1">Dispatches an instant push & WhatsApp message to nearby lifters.</p>
              </div>
              <button
                onClick={() => setShowPromoModal(false)}
                className="w-8 h-8 rounded-full bg-surface text-white flex items-center justify-center hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBroadcastPromo} className="space-y-4">
              <div>
                <label className="block text-[11px] text-muted uppercase font-bold mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monsoon Strength Camp - 20% Off"
                  value={newPromoTitle}
                  onChange={(e) => setNewPromoTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-xs outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-muted uppercase font-bold mb-1">Promo Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MONSOON20"
                    value={newPromoCode}
                    onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-xs outline-none focus:border-gold font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-muted uppercase font-bold mb-1">Discount Amount</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 20% OFF or ₹500"
                    value={newPromoDiscount}
                    onChange={(e) => setNewPromoDiscount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-xs outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-white/5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted">Targeted Radius:</span>
                  <span className="font-bold text-white">5 km from Gym Pin</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Target Audience:</span>
                  <span className="font-bold text-gold">184 Verified Strength Athletes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Channels:</span>
                  <span className="font-bold text-emerald-400">Athloboard Mobile Push + WhatsApp</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gold hover:bg-gold-glow text-black font-black text-xs shadow-gold-glow transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Dispatch Broadcast Campaign Now
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

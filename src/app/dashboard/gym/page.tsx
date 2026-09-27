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
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 text-gray-900">
      
      {/* Toast Notification */}
      {promoSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>Promotional campaign dispatched to 184 athletes via Athloboard app & WhatsApp!</span>
        </div>
      )}

      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-gray-950">Iron Pulse Strength Gym</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-fitRed border border-red-200 font-black text-[10px] uppercase">
              Audited Gold
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Gym Partner ID: GYM-DEL-1042 • South Extension II, New Delhi</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/gyms/1"
            className="px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-900 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            Public Storefront <ArrowUpRight className="w-3.5 h-3.5 text-gray-500" />
          </Link>
          <button 
            onClick={() => setShowPromoModal(true)}
            className="px-4 py-2.5 rounded-xl bg-fitRed hover:bg-fitRed-hover text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-red-500/20 transition-all hover:scale-105"
          >
            <Megaphone className="w-4 h-4" /> Broadcast Promo
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Members', value: '184', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Monthly Leads', value: '42', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Audited Plate Weight', value: '3,200 kg', icon: Dumbbell, color: 'text-fitRed', bg: 'bg-red-50' },
          { label: 'Meets Hosted', value: '4', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-950">{stat.value}</div>
              <div className="text-[11px] text-gray-500 uppercase font-bold mt-0.5">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-3 overflow-x-auto">
        {(['leads', 'specs', 'members', 'promos'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-gray-950 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200'
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
            <div key={column} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
                <span className="font-bold text-sm text-gray-950">{column} Leads</span>
                <span className="text-xs font-bold text-fitRed px-2 py-0.5 rounded-full bg-red-50 border border-red-200">
                  {leads.filter((l) => l.status === column).length}
                </span>
              </div>
              <div className="space-y-3">
                {leads
                  .filter((l) => l.status === column)
                  .map((lead) => (
                    <div key={lead.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2 hover:border-gray-300 transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-gray-950">{lead.name}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{lead.time}</span>
                      </div>
                      <p className="text-xs text-gray-600">{lead.goal}</p>
                      <div className="text-[10px] font-mono text-gray-500 pt-2 border-t border-gray-200 flex justify-between items-center">
                        <span>{lead.phone}</span>
                        <span className="text-fitRed font-bold">Verified Lifter</span>
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
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-fitRed" /> Phase 2 Equipment Specifications
              </h2>
              <p className="text-xs text-gray-500 mt-1">Inspected and verified by Athloboard State Technical Auditor.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              Audited Gold Certified
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <span className="text-gray-500 block text-[10px] uppercase font-bold">Total Plate Weight</span>
              <strong className="text-gray-950 text-base">3,200 kg (Calibrated Eleiko &amp; Bullrock)</strong>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <span className="text-gray-500 block text-[10px] uppercase font-bold">Dumbbell Tiers</span>
              <strong className="text-gray-950 text-base">2.5 kg to 65 kg pairs</strong>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <span className="text-gray-500 block text-[10px] uppercase font-bold">Certified Coaching Staff</span>
              <strong className="text-gray-950 text-base">4 Certified Male, 2 Certified Female</strong>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <span className="text-gray-500 block text-[10px] uppercase font-bold">Powerlifting Combo Racks</span>
              <strong className="text-gray-950 text-base">4 ER Competition Combo Racks</strong>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Member Roster */}
      {activeTab === 'members' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-950">Active Member Roster</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                <tr>
                  <th className="p-3 font-bold">Athlete Name</th>
                  <th className="p-3 font-bold">Weight Class</th>
                  <th className="p-3 font-bold">Status</th>
                  <th className="p-3 font-bold">Membership Plan</th>
                  <th className="p-3 font-bold">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                  <td className="p-3 font-bold text-gray-950">Aditya Sharma</td>
                  <td className="p-3 font-mono text-fitRed font-bold">93 kg Class</td>
                  <td className="p-3"><span className="text-emerald-700 font-bold">● Active</span></td>
                  <td className="p-3 text-gray-700 font-medium">Annual Power Athlete</td>
                  <td className="p-3 text-gray-500">Jan 12, 2026</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 font-bold text-gray-950">Meera Patel</td>
                  <td className="p-3 font-mono text-fitRed font-bold">63 kg Class</td>
                  <td className="p-3"><span className="text-emerald-700 font-bold">● Active</span></td>
                  <td className="p-3 text-gray-700 font-medium">Monthly Strength</td>
                  <td className="p-3 text-gray-500">Feb 04, 2026</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 font-bold text-gray-950">Karan Johar</td>
                  <td className="p-3 font-mono text-fitRed font-bold">105 kg Class</td>
                  <td className="p-3"><span className="text-emerald-700 font-bold">● Active</span></td>
                  <td className="p-3 text-gray-700 font-medium">Quarterly Strength</td>
                  <td className="p-3 text-gray-500">Mar 18, 2026</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Promotions & Broadcasts */}
      {activeTab === 'promos' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-950">Active Promotional Broadcasts</h2>
              <p className="text-xs text-gray-500 mt-1">Broadcast targeted flash memberships to nearby lifters.</p>
            </div>
            <button
              onClick={() => setShowPromoModal(true)}
              className="px-4 py-2.5 rounded-xl bg-fitRed hover:bg-fitRed-hover text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-red-500/20"
            >
              <Plus className="w-4 h-4" /> New Campaign
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {promos.map((p) => (
              <div key={p.id} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-gray-950 text-sm">{p.title}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    {p.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="px-2.5 py-1 rounded-lg bg-white border border-gray-300 font-mono font-bold text-fitRed shadow-sm">
                    {p.code}
                  </div>
                  <span className="text-gray-700 font-bold">{p.discount}</span>
                </div>
                <div className="text-[11px] text-gray-500 flex items-center gap-1.5 pt-2 border-t border-gray-200">
                  <Users className="w-3.5 h-3.5 text-fitRed" /> Audience: {p.reach}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Broadcast Promo Modal */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full space-y-6 text-gray-900">
            <div className="flex justify-between items-start pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-black text-gray-950">Broadcast Promo to Lifters</h3>
                <p className="text-xs text-gray-500 mt-1">Dispatches an instant push &amp; WhatsApp message to nearby lifters.</p>
              </div>
              <button
                onClick={() => setShowPromoModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBroadcastPromo} className="space-y-4">
              <div>
                <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monsoon Strength Camp - 20% Off"
                  value={newPromoTitle}
                  onChange={(e) => setNewPromoTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">Promo Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MONSOON20"
                    value={newPromoCode}
                    onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed font-mono uppercase transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-700 uppercase font-bold mb-1">Discount Amount</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 20% OFF or ₹500"
                    value={newPromoDiscount}
                    onChange={(e) => setNewPromoDiscount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none focus:bg-white focus:border-fitRed transition-all"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Targeted Radius:</span>
                  <span className="font-bold text-gray-950">5 km from Gym Pin</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Target Audience:</span>
                  <span className="font-bold text-fitRed">184 Verified Strength Athletes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Channels:</span>
                  <span className="font-bold text-emerald-700">Athloboard Mobile Push + WhatsApp</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-fitRed hover:bg-fitRed-hover text-white font-black text-xs shadow-md shadow-red-500/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
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

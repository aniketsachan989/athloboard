'use client';

import React, { useState } from 'react';
import { Dumbbell, Users, Calendar, Award, Plus, CheckCircle, TrendingUp } from 'lucide-react';

export default function GymDashboardPage() {
  const [activeTab, setActiveTab] = useState<'leads' | 'specs' | 'members'>('leads');

  const leads = [
    { id: '1', name: 'Vikram Singh', goal: 'Powerlifting prep (93kg)', status: 'New', time: '10m ago' },
    { id: '2', name: 'Pooja Rawat', goal: 'Strength coaching', status: 'Contacted', time: '2h ago' },
    { id: '3', name: 'Rahul Joshi', goal: 'Annual Membership', status: 'Converted', time: 'Yesterday' },
  ];

  return (
    <div className="py-8 px-6 max-w-7xl mx-auto space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-panel p-6 rounded-3xl border border-gold/20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">Iron Pulse Strength Gym</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-gold text-black font-black text-[10px] uppercase">
              Audited Gold
            </span>
          </div>
          <p className="text-xs text-muted mt-1">Gym Partner ID: GYM-DEL-1042 • South Extension II, New Delhi</p>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl bg-gold text-black font-black text-xs flex items-center gap-1.5 shadow-gold-glow">
            <Plus className="w-4 h-4" /> Broadcast Promo
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
          <div key={i} className="glass-panel p-5 rounded-2xl">
            <stat.icon className="w-5 h-5 text-gold mb-2" />
            <div className="text-2xl font-black text-white">{stat.value}</div>
            <div className="text-[11px] text-muted uppercase font-bold mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-white/10 pb-3">
        {(['leads', 'specs', 'members'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              activeTab === tab
                ? 'bg-gold text-black shadow-gold-glow'
                : 'text-muted hover:text-white bg-surface'
            }`}
          >
            {tab === 'leads' ? 'Leads Kanban' : tab === 'specs' ? 'Equipment Specs' : 'Member Roster'}
          </button>
        ))}
      </div>

      {/* Tab 1: Leads Kanban Board */}
      {activeTab === 'leads' && (
        <div className="grid md:grid-cols-3 gap-6">
          {['New', 'Contacted', 'Converted'].map((column) => (
            <div key={column} className="glass-panel p-5 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
                <span className="font-bold text-sm text-white">{column}</span>
                <span className="text-xs font-bold text-gold">
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
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Equipment Specs */}
      {activeTab === 'specs' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
          <h2 className="text-xl font-bold text-white">Phase 2 Equipment Specifications</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-surface">Total Plate Weight: <strong className="text-white">3,200 kg (Calibrated Eleiko/Bullrock)</strong></div>
            <div className="p-4 rounded-xl bg-surface">Dumbbell Range: <strong className="text-white">2.5 kg to 65 kg pairs</strong></div>
            <div className="p-4 rounded-xl bg-surface">Trainers: <strong className="text-white">4 Certified Male, 2 Certified Female</strong></div>
            <div className="p-4 rounded-xl bg-surface">Powerlifting Combo Racks: <strong className="text-white">4 ER Combo Racks</strong></div>
          </div>
        </div>
      )}
    </div>
  );
}

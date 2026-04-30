'use client';
import React, { useState } from 'react';
import { Home, Users, FileText, TrendingUp, Settings, HelpCircle } from 'lucide-react';

// Die 5 Haupt-Sidebar-Punkte
export const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard',    icon: Home,        description: 'Übersicht & heutige Aufgaben' },
  { id: 'patients',  label: 'Patienten',    icon: Users,       description: 'Patientenakte & Suche' },
  { id: 'forms',     label: 'Befundbögen',  icon: FileText,    description: 'Bibliothek aller Bögen' },
  { id: 'history',   label: 'Verlauf',      icon: TrendingUp,  description: 'Verlaufsvergleich & Trends' },
  { id: 'settings',  label: 'Einstellungen',icon: Settings,    description: 'Praxis & Konto' },
];

export function AppSidebar({ currentRoute, onNavigate }) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-16 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-3 z-50">
      {/* Logo */}
      <button
        onClick={() => onNavigate('dashboard')}
        className="mb-4 group relative"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center shadow-lg">
          <FileText className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
      </button>

      <div className="w-8 border-t border-slate-700 mb-3" />

      {/* Hauptmenü */}
      <div className="flex flex-col gap-1.5 flex-1">
        {SIDEBAR_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = item.id === currentRoute;
          return (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <button
                onClick={() => onNavigate(item.id)}
                className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-cyan-600 shadow-lg shadow-cyan-900/50'
                    : 'bg-slate-800 hover:bg-slate-700 hover:scale-105'
                }`}
                aria-label={item.label}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-300'}`} strokeWidth={2} />
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-300 rounded-r-full" />
                )}
              </button>

              {hoveredId === item.id && (
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
                  <div className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl whitespace-nowrap">
                    <div className="text-sm font-bold text-white">{item.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.description}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hilfe unten */}
      <div className="relative" onMouseEnter={() => setHoveredId('help')} onMouseLeave={() => setHoveredId(null)}>
        <button
          onClick={() => onNavigate('help')}
          className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-800 hover:bg-slate-700 transition-all"
          aria-label="Hilfe"
        >
          <HelpCircle className="w-5 h-5 text-slate-300" strokeWidth={2} />
        </button>
        {hoveredId === 'help' && (
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
            <div className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl whitespace-nowrap">
              <div className="text-sm font-bold text-white">Hilfe & Support</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Dokumentation und Sprach-Tipps</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

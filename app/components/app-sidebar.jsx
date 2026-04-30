'use client';
import React, { useState } from 'react';
import {
  Activity, Brain, Sparkles, Construction, Stethoscope,
  ScanLine, FileText
} from 'lucide-react';
import { listForms } from '../forms/registry';

// Icon-Map pro Formular-ID
const FORM_ICONS = {
  'cmd-screening': Stethoscope,
  'bsi': Sparkles,
  'zahnverschleiss-screening': ScanLine,
  'funktionsstatus': Brain,
  'zahnverschleiss-status': ScanLine,
  'manuelle-strukturanalyse': Activity,
};

export function AppSidebar({ currentFormId, onChange }) {
  const forms = listForms();
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-16 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-3 z-50">
      {/* Logo */}
      <div className="mb-4 group relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center shadow-lg">
          <FileText className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 text-white text-xs font-mono font-bold rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
          VoxDent
        </div>
      </div>

      <div className="w-8 border-t border-slate-700 mb-3" />

      {/* Form-Icons */}
      <div className="flex flex-col gap-1.5 flex-1">
        {forms.map(f => {
          const Icon = FORM_ICONS[f.id] || FileText;
          const isActive = f.id === currentFormId;
          const isWip = f.status === 'wip';
          return (
            <div
              key={f.id}
              className="relative"
              onMouseEnter={() => setHoveredId(f.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <button
                onClick={() => { if (!isWip) onChange(f.id); }}
                disabled={isWip}
                className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-cyan-600 shadow-lg shadow-cyan-900/50'
                    : isWip
                      ? 'bg-slate-800/50 cursor-not-allowed opacity-40'
                      : 'bg-slate-800 hover:bg-slate-700 hover:scale-105'
                }`}
                aria-label={f.label}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-300'}`} strokeWidth={2} />
                {isWip && (
                  <Construction className="absolute -top-1 -right-1 w-3.5 h-3.5 text-amber-500 bg-slate-900 rounded-full p-0.5" />
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-300 rounded-r-full" />
                )}
              </button>

              {/* Tooltip */}
              {hoveredId === f.id && (
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
                  <div className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl whitespace-nowrap">
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      {f.label}
                      {isWip && (
                        <span className="text-[9px] font-mono font-bold tracking-widest text-amber-400 bg-amber-900/40 px-1.5 py-0.5 rounded">WIP</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{f.description}</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-1">{f.fieldCount} Felder · {f.duration || '—'}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

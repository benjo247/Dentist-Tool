'use client';
// ═══════════════════════════════════════════════════════════════════
// Manuelle Strukturanalyse — VIEW
// ═══════════════════════════════════════════════════════════════════

import React from 'react';

// ─── UI HELPERS ─────────────────────────────────────────────────
function Pill({ value, mini = false }) {
  const colors = {
    0: 'bg-emerald-100 text-emerald-800 border-emerald-400',
    1: 'bg-amber-100 text-amber-900 border-amber-400',
    2: 'bg-rose-100 text-rose-800 border-rose-400',
  };
  const empty = 'bg-slate-50 text-slate-400 border-slate-300 border-dashed';
  const cls = value === null || value === undefined ? empty : colors[value];
  return (
    <div className={`${mini ? 'h-7 px-2 text-xs' : 'h-9 px-3 text-sm'} flex items-center justify-center rounded-md border-2 font-mono font-bold ${cls} transition-all duration-300`}>
      {value === null || value === undefined ? '–' : value}
    </div>
  );
}

function ForcePill({ value }) {
  // Muskelkraft 0-5 — andere Farbskala (höher = besser)
  const empty = value === null || value === undefined;
  let cls = 'bg-slate-50 text-slate-400 border-slate-300 border-dashed';
  if (!empty) {
    if (value <= 2) cls = 'bg-rose-100 text-rose-800 border-rose-400';
    else if (value <= 3) cls = 'bg-amber-100 text-amber-900 border-amber-400';
    else cls = 'bg-emerald-100 text-emerald-800 border-emerald-400';
  }
  return (
    <div className={`h-9 px-3 text-sm flex items-center justify-center rounded-md border-2 font-mono font-bold ${cls} transition-all duration-300`}>
      {empty ? '–' : `${value}/5`}
    </div>
  );
}

function StringPill({ value, options }) {
  const empty = value === null || value === undefined;
  const label = empty ? '–' : (options?.[value] || value);
  return (
    <div className={`h-9 px-3 text-sm flex items-center justify-center rounded-md border-2 font-mono font-bold transition-all duration-300 ${
      empty ? 'bg-slate-50 text-slate-400 border-slate-300 border-dashed' : 'bg-cyan-50 text-cyan-900 border-cyan-300'
    }`}>
      {label}
    </div>
  );
}

function DynamicPill({ value }) {
  // "+", "0", "-" — eigene Farbskala
  const empty = value === null || value === undefined;
  const colors = {
    '+': 'bg-rose-100 text-rose-800 border-rose-400',
    '0': 'bg-slate-100 text-slate-700 border-slate-400',
    '-': 'bg-emerald-100 text-emerald-800 border-emerald-400',
  };
  const cls = empty ? 'bg-slate-50 text-slate-400 border-slate-300 border-dashed' : (colors[value] || 'bg-slate-100 text-slate-800 border-slate-300');
  return (
    <div className={`h-9 px-3 text-sm flex items-center justify-center rounded-md border-2 font-mono font-bold ${cls} transition-all duration-300`}>
      {empty ? '–' : value}
    </div>
  );
}

function SectionCard({ num, title, subtitle, children, recentField, fields }) {
  const isHot = fields?.some(f => recentField?.startsWith(f));
  return (
    <div className={`bg-white border-2 rounded-xl p-5 shadow-sm transition-all ${isHot ? 'border-cyan-400 ring-2 ring-cyan-100' : 'border-slate-200'}`}>
      <div className="flex items-baseline gap-3 mb-4 pb-3 border-b border-slate-200">
        <span className="text-[10px] tracking-widest text-cyan-700 font-mono font-bold">SEKTION {num}</span>
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        {subtitle && <span className="text-xs text-slate-500">{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}

function ColumnHeaders({ cols }) {
  return (
    <div className="grid items-center gap-2 mb-2" style={{ gridTemplateColumns: cols }}>
      {[].map.call(arguments, () => null)}
    </div>
  );
}

// ─── HAUPTKOMPONENTE ───────────────────────────────────────────
export function View({ state, recentField }) {
  const form = state || {};
  const isHot = (field) => recentField === field;

  const ENDFEEL_LABELS = { weich: 'weich', fest: 'fest', hart: 'hart' };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-white border-2 border-slate-200 rounded-xl p-5">
        <div className="text-[10px] tracking-widest text-cyan-700 font-mono font-bold mb-1">DGFDT BEFUNDBOGEN</div>
        <h1 className="text-xl font-bold text-slate-900">Manuelle Strukturanalyse</h1>
        <p className="text-sm text-slate-600 mt-1">
          Weiterführende manuelle Funktionsprüfung der Kiefergelenke unter Belastung
        </p>
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-600 mt-3">
          <span className="px-2 py-1 bg-emerald-50 border border-emerald-200 rounded text-emerald-800">0 unauffällig</span>
          <span className="px-2 py-1 bg-amber-50 border border-amber-200 rounded text-amber-800">1 Missempfindung</span>
          <span className="px-2 py-1 bg-rose-50 border border-rose-200 rounded text-rose-800">2 Schmerz</span>
        </div>
      </div>

      {/* ═══════════ 1. KOMPRESSION IN DER STATIK ═══════════ */}
      <SectionCard num="1" title="Kompression in der Statik" subtitle="Passive Kompression — ZKP = Zentrische Kondylenposition"
        recentField={recentField} fields={['static_']}>
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-3 items-center pb-2 border-b border-slate-200">
            <div className="text-xs font-bold text-slate-700">KOMPRESSION</div>
            <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold text-center w-24">SCHMERZ RE</div>
            <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold text-center w-24">SCHMERZ LI</div>
          </div>
          {[
            ['1. kranial', 'static_kranial'],
            ['2.1 dorsokranial (ZKP)', 'static_dorsokranial_zkp'],
            ['2.2 dorsokranial (Laterotrusion)', 'static_dorsokranial_lat'],
            ['3.1 dorsal (ZKP)', 'static_dorsal_zkp'],
            ['3.2 dorsal (Laterotrusion)', 'static_dorsal_lat'],
          ].map(([label, prefix]) => (
            <div key={prefix} className="grid grid-cols-[1fr_auto_auto] gap-3 items-center">
              <div className={`text-sm text-slate-800 ${(isHot(`${prefix}_left`) || isHot(`${prefix}_right`)) ? 'animate-flash' : ''}`}>{label}</div>
              <div className="w-24"><Pill value={form[`${prefix}_right`]} /></div>
              <div className="w-24"><Pill value={form[`${prefix}_left`]} /></div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ═══════════ 2. TRAKTION / TRANSLATION ═══════════ */}
      <SectionCard num="2" title="Traktion / Translation" subtitle="Schmerz und Endgefühl je Seite"
        recentField={recentField} fields={['traction_', 'ventrokaudal_', 'lateral_', 'medial_']}>
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 items-center pb-2 border-b border-slate-200">
            <div className="text-xs font-bold text-slate-700">TEST</div>
            <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold text-center w-20">SCHMERZ RE</div>
            <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold text-center w-20">ENDGEF. RE</div>
            <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold text-center w-20">SCHMERZ LI</div>
            <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold text-center w-20">ENDGEF. LI</div>
          </div>
          {[
            ['1. Kaudaltraktion', 'traction'],
            ['2. Ventrokaudale Translation', 'ventrokaudal'],
            ['3. Laterale Translation', 'lateral'],
            ['4. Mediale Translation', 'medial'],
          ].map(([label, prefix]) => {
            const hot = isHot(`${prefix}_pain_left`) || isHot(`${prefix}_pain_right`)
                     || isHot(`${prefix}_endfeel_left`) || isHot(`${prefix}_endfeel_right`);
            return (
              <div key={prefix} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 items-center">
                <div className={`text-sm text-slate-800 ${hot ? 'animate-flash' : ''}`}>{label}</div>
                <div className="w-20"><Pill value={form[`${prefix}_pain_right`]} mini /></div>
                <div className="w-20"><StringPill value={form[`${prefix}_endfeel_right`]} options={ENDFEEL_LABELS} /></div>
                <div className="w-20"><Pill value={form[`${prefix}_pain_left`]} mini /></div>
                <div className="w-20"><StringPill value={form[`${prefix}_endfeel_left`]} options={ENDFEEL_LABELS} /></div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* ═══════════ 3. KOMPRESSION IN DER DYNAMIK ═══════════ */}
      <SectionCard num="3" title="Kompression in der Dynamik" subtitle='+ stärker/später · 0 unverändert · − schwächer/früher'
        recentField={recentField} fields={['dynamic_']}>
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_auto_auto] gap-3 items-center pb-2 border-b border-slate-200">
            <div className="text-xs font-bold text-slate-700"></div>
            <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold text-center w-24">RECHTS</div>
            <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold text-center w-24">LINKS</div>
          </div>
          <div className="grid grid-cols-[1fr_auto_auto] gap-3 items-center">
            <div className={`text-sm text-slate-800 ${(isHot('dynamic_sound_intensity_left') || isHot('dynamic_sound_intensity_right')) ? 'animate-flash' : ''}`}>
              Geräuschintensität
            </div>
            <div className="w-24"><DynamicPill value={form.dynamic_sound_intensity_right} /></div>
            <div className="w-24"><DynamicPill value={form.dynamic_sound_intensity_left} /></div>
          </div>
          <div className="grid grid-cols-[1fr_auto_auto] gap-3 items-center">
            <div className={`text-sm text-slate-800 ${(isHot('dynamic_sound_timing_left') || isHot('dynamic_sound_timing_right')) ? 'animate-flash' : ''}`}>
              Geräuschzeitpunkt
            </div>
            <div className="w-24"><DynamicPill value={form.dynamic_sound_timing_right} /></div>
            <div className="w-24"><DynamicPill value={form.dynamic_sound_timing_left} /></div>
          </div>
        </div>
      </SectionCard>

      {/* ═══════════ 4. ISOMETRIE ═══════════ */}
      <SectionCard num="4" title="Isometrie" subtitle="Schmerz und Muskelkraft (0–5) je Seite · RL = Rechtslateralbewegung, LL = Linkslateralbewegung"
        recentField={recentField} fields={['iso_']}>
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 items-center pb-2 border-b border-slate-200">
            <div className="text-xs font-bold text-slate-700"></div>
            <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold text-center w-20">SCHMERZ RE</div>
            <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold text-center w-20">KRAFT RE</div>
            <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold text-center w-20">SCHMERZ LI</div>
            <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold text-center w-20">KRAFT LI</div>
          </div>
          {[
            ['Kieferöffnung', 'iso_opening'],
            ['Kieferschluss', 'iso_closing'],
            ['RL — Rechtslateralbewegung', 'iso_rl'],
            ['LL — Linkslateralbewegung', 'iso_ll'],
          ].map(([label, prefix]) => {
            const hot = isHot(`${prefix}_pain_left`) || isHot(`${prefix}_pain_right`)
                     || isHot(`${prefix}_force_left`) || isHot(`${prefix}_force_right`);
            return (
              <div key={prefix} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 items-center">
                <div className={`text-sm text-slate-800 ${hot ? 'animate-flash' : ''}`}>{label}</div>
                <div className="w-20"><Pill value={form[`${prefix}_pain_right`]} mini /></div>
                <div className="w-20"><ForcePill value={form[`${prefix}_force_right`]} /></div>
                <div className="w-20"><Pill value={form[`${prefix}_pain_left`]} mini /></div>
                <div className="w-20"><ForcePill value={form[`${prefix}_force_left`]} /></div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* ═══════════ 5. INITIALDIAGNOSE ═══════════ */}
      <SectionCard num="5" title="Initialdiagnose(n)" recentField={recentField} fields={['initial_diagnosis']}>
        <div className={`min-h-[80px] p-3 rounded-md border-2 ${isHot('initial_diagnosis') ? 'border-cyan-400 bg-cyan-50 animate-flash' : 'border-slate-200 bg-slate-50'}`}>
          {form.initial_diagnosis ? (
            <p className="text-sm text-slate-900 whitespace-pre-wrap">{form.initial_diagnosis}</p>
          ) : (
            <p className="text-sm text-slate-400 italic">Noch keine Diagnose erfasst</p>
          )}
        </div>
      </SectionCard>

      {/* Footer */}
      <div className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-200 pt-4 mt-6 text-center">
        <p>
          Befundbogen <strong>"Manuelle Strukturanalyse"</strong> der Deutschen Gesellschaft
          für Funktionsdiagnostik und -therapie (DGFDT).
        </p>
        <p className="mt-1">© Ottl, Ahlers, Lange, Utz 2011 · DGFDT/DGZMK</p>
      </div>
    </div>
  );
}

'use client';
// ═══════════════════════════════════════════════════════════════════
// Anatomie-View für Klinischen Funktionsstatus
// Live-Visualisierung der Befunde auf einem stilisierten Schädel.
// ═══════════════════════════════════════════════════════════════════

import React from 'react';

// ─── Mapping: Form-Felder → Anatomie-Punkte ───────────────────────
// Pro Punkt: id, label, x/y für links und rechts, Form-Feld
const ANATOMY_POINTS = [
  // Muskulatur
  { id: 'temp_ant',  label: 'Temporalis ant.',   field: 'muscle_temp_ant',   group: 'muscle', x: 70,  y: 65 },
  { id: 'temp_med',  label: 'Temporalis med.',   field: 'muscle_temp_med',   group: 'muscle', x: 90,  y: 55 },
  { id: 'temp_post', label: 'Temporalis post.',  field: 'muscle_temp_post',  group: 'muscle', x: 115, y: 60 },
  { id: 'temp_tendon', label: 'Sehne Temporalis', field: 'muscle_temp_tendon', group: 'muscle', x: 78, y: 90 },
  { id: 'mass_origin', label: 'Masseter Ursprung', field: 'muscle_mass_origin', group: 'muscle', x: 88, y: 120 },
  { id: 'mass_belly', label: 'Masseter Bauch',   field: 'muscle_mass_belly', group: 'muscle', x: 95, y: 145 },
  { id: 'mass_insert', label: 'Masseter Ansatz', field: 'muscle_mass_insert', group: 'muscle', x: 100, y: 175 },
  { id: 'pterygoid', label: 'Pterygoideus lat.', field: 'muscle_pterygoid',  group: 'muscle', x: 105, y: 105 },
  { id: 'submand',   label: 'Submandibulär',     field: 'muscle_submand',    group: 'muscle', x: 110, y: 200 },
  { id: 'postmand',  label: 'Postmandibulär',    field: 'muscle_postmand',   group: 'muscle', x: 130, y: 175 },
  { id: 'subocc',    label: 'Subokzipital',      field: 'muscle_subocc',     group: 'muscle', x: 150, y: 110 },
];

// Schmerz-Regionen (ohne Seitenangabe — nutzen pain_*_left/_right)
const PAIN_POINTS = [
  { id: 'head',    label: 'Kopf',              field: 'pain_head',    x: 70,  y: 35 },
  { id: 'temples', label: 'Schläfen',          field: 'pain_temples', x: 80,  y: 70 },
  { id: 'ear_jaw', label: 'Ohr/Kiefergelenk',  field: 'pain_ear_jaw', x: 125, y: 95 },
  { id: 'neck',    label: 'Nacken',            field: 'pain_neck',    x: 165, y: 175 },
  { id: 'shoulder',label: 'Schulter',          field: 'pain_shoulder',x: 190, y: 215 },
];

// Kiefergelenk-Punkte (für Auskultation/Palpation)
const JOINT_POINTS = [
  { id: 'joint',     label: 'Kiefergelenk',    field: 'joint_palp_lateral', x: 120, y: 95 },
];

// ─── Farbgebung ───────────────────────────────────────────────────
function getColorForValue(value) {
  if (value === 0) return { fill: '#10b981', stroke: '#047857', label: 'unauffällig' };  // grün
  if (value === 1) return { fill: '#f59e0b', stroke: '#b45309', label: 'Missempfindung' };  // amber
  if (value === 2) return { fill: '#ef4444', stroke: '#b91c1c', label: 'Schmerz' };  // rot
  return { fill: '#cbd5e1', stroke: '#94a3b8', label: 'nicht erhoben' };  // grau
}

function getColorForBool(value) {
  if (value === true) return { fill: '#ef4444', stroke: '#b91c1c', label: 'Schmerz' };
  if (value === false) return { fill: '#10b981', stroke: '#047857', label: 'unauffällig' };
  return { fill: '#cbd5e1', stroke: '#94a3b8', label: '–' };
}

// ─── Einzelner Anatomie-Punkt ─────────────────────────────────────
function AnatomyDot({ cx, cy, value, isPain, isRecent, label }) {
  const color = isPain ? getColorForBool(value) : getColorForValue(value);
  const isHighlight = value !== null && value !== undefined && value !== 0 && value !== false;

  return (
    <g className={isRecent ? 'recent-pulse' : ''}>
      {/* Glow-Aura wenn aktiv */}
      {isHighlight && (
        <circle
          cx={cx} cy={cy} r="9"
          fill={color.fill}
          opacity="0.25"
          className="anatomy-glow"
        />
      )}
      {/* Hauptpunkt */}
      <circle
        cx={cx} cy={cy} r="5"
        fill={color.fill}
        stroke={color.stroke}
        strokeWidth="1.5"
        className={`transition-all duration-300 ${isRecent ? 'anatomy-flash' : ''}`}
      />
      {/* Label nur bei Hover */}
      <title>{label}: {color.label}</title>
    </g>
  );
}

// ─── Schädel-Halbseite (links oder rechts) ────────────────────────
function SkullSide({ side, state, recentField }) {
  const sideKey = side === 'left' ? 'left' : 'right';

  return (
    <svg viewBox="0 0 240 270" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {/* Schädel-Outline (stilisiert, Seitenansicht) */}
      <g>
        {/* Hauptkontur Schädel */}
        <path
          d="M 60 50
             Q 50 30 80 22
             Q 120 12 155 25
             Q 175 35 175 65
             Q 178 90 170 110
             L 165 130
             Q 165 145 155 155
             L 145 165
             L 145 200
             Q 145 215 130 220
             L 110 222
             Q 95 225 90 215
             L 85 200
             L 80 195
             Q 65 175 60 150
             Q 55 110 60 50 Z"
          fill="#f8fafc"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
        {/* Auge (Orientierung) */}
        <circle cx="100" cy="80" r="6" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
        {/* Ohrposition */}
        <ellipse cx="135" cy="100" rx="6" ry="9" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
        {/* Mund-Linie */}
        <path d="M 75 165 Q 95 170 115 167" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
        {/* Kiefer-Andeutung */}
        <path d="M 80 175 Q 110 195 145 165" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,2" />
        {/* Hals/Schulter-Andeutung */}
        <path d="M 120 220 Q 130 240 160 245 L 220 255"
              fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4,3" />

        {/* Side-Indicator */}
        <text x="20" y="30" className="anatomy-label" fontSize="11" fontWeight="bold" fill="#64748b" fontFamily="monospace">
          {side === 'left' ? 'LINKS' : 'RECHTS'}
        </text>
      </g>

      {/* Muskel-Punkte */}
      {ANATOMY_POINTS.map(pt => {
        const fieldKey = `${pt.field}_${sideKey}`;
        const value = state[fieldKey];
        const isRecent = recentField === fieldKey;
        return (
          <AnatomyDot
            key={pt.id}
            cx={pt.x} cy={pt.y}
            value={value}
            isPain={false}
            isRecent={isRecent}
            label={`${pt.label} (${side === 'left' ? 'L' : 'R'})`}
          />
        );
      })}

      {/* Schmerz-Regionen */}
      {PAIN_POINTS.map(pt => {
        const fieldKey = `${pt.field}_${sideKey}`;
        const value = state[fieldKey];
        const isRecent = recentField === fieldKey;
        return (
          <g key={`pain-${pt.id}`}>
            <circle
              cx={pt.x} cy={pt.y} r="8"
              fill="none"
              stroke={value === true ? '#ef4444' : value === false ? '#10b981' : '#cbd5e1'}
              strokeWidth="1.5"
              strokeDasharray="2,2"
              opacity="0.6"
              className={isRecent ? 'anatomy-flash' : ''}
            />
            <title>Schmerz {pt.label} ({side === 'left' ? 'L' : 'R'}): {value === true ? 'JA' : value === false ? 'NEIN' : '–'}</title>
          </g>
        );
      })}

      {/* Kiefergelenk-Indikator (Auskultation) */}
      {(() => {
        const palpField = `joint_palp_lateral_${sideKey}`;
        const dorsalField = `joint_palp_dorsal_${sideKey}`;
        const palpValue = state[palpField];
        const dorsalValue = state[dorsalField];
        const events = state.auscultation_events || [];
        const sideEvents = events.filter(e => e.side === sideKey || e.side === side);
        const hasEvents = sideEvents.length > 0;
        const isRecent = recentField === palpField || recentField === dorsalField || recentField === 'auscultation_event';
        return (
          <g>
            {/* Großer Kreis um Kiefergelenk-Bereich */}
            <circle
              cx="125" cy="98" r="14"
              fill="none"
              stroke={hasEvents ? '#dc2626' : palpValue === 2 ? '#ef4444' : palpValue === 1 ? '#f59e0b' : palpValue === 0 ? '#10b981' : '#cbd5e1'}
              strokeWidth="2"
              opacity="0.7"
              className={isRecent || hasEvents ? 'anatomy-pulse' : ''}
            />
            {/* Knack-Symbol wenn Auskultation positiv */}
            {hasEvents && (
              <g>
                <text x="125" y="103" fontSize="14" textAnchor="middle" fontWeight="bold" fill="#dc2626" className="anatomy-flash">
                  ⚡
                </text>
              </g>
            )}
            <title>Kiefergelenk ({side === 'left' ? 'L' : 'R'}): Palpation lateral={palpValue}, dorsal={dorsalValue}, Geräusche={sideEvents.length}</title>
          </g>
        );
      })()}
    </svg>
  );
}

// ─── Mundöffnungs-Anzeige ─────────────────────────────────────────
function MouthOpeningGauge({ active, passive }) {
  const max = 60;
  const activePercent = active != null ? Math.min(100, (active / max) * 100) : 0;
  const passivePercent = passive != null ? Math.min(100, (passive / max) * 100) : 0;

  // Normwerte: aktive Öffnung > 40 mm normal
  const activeColor = active == null ? '#cbd5e1' : active < 35 ? '#ef4444' : active < 40 ? '#f59e0b' : '#10b981';
  const passiveColor = passive == null ? '#cbd5e1' : passive < 40 ? '#ef4444' : passive < 45 ? '#f59e0b' : '#10b981';

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
      <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold uppercase mb-2">
        Mundöffnung
      </div>
      <div className="space-y-2">
        {/* Aktiv */}
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-[10px] text-slate-600 font-medium">aktiv</span>
            <span className="font-mono font-bold text-sm" style={{ color: activeColor }}>
              {active != null ? `${active} mm` : '–'}
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${activePercent}%`, backgroundColor: activeColor }}
            />
          </div>
        </div>
        {/* Passiv */}
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-[10px] text-slate-600 font-medium">passiv</span>
            <span className="font-mono font-bold text-sm" style={{ color: passiveColor }}>
              {passive != null ? `${passive} mm` : '–'}
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${passivePercent}%`, backgroundColor: passiveColor }}
            />
          </div>
        </div>
      </div>
      <div className="mt-2 text-[9px] text-slate-500 leading-tight">
        Norm: aktiv ≥ 40 mm, passiv ≥ 45 mm
      </div>
    </div>
  );
}

// ─── Laterotrusion / Protrusion Anzeige ───────────────────────────
function MovementGauge({ label, value, max = 12, unit = 'mm', norm = 7 }) {
  const percent = value != null ? Math.min(100, (value / max) * 100) : 0;
  const color = value == null ? '#cbd5e1' : value < norm * 0.7 ? '#ef4444' : value < norm ? '#f59e0b' : '#10b981';
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-[10px] text-slate-600 font-medium">{label}</span>
        <span className="font-mono font-bold text-xs" style={{ color }}>
          {value != null ? `${value} ${unit}` : '–'}
        </span>
      </div>
      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ─── Hauptkomponente ──────────────────────────────────────────────
export function AnatomyView({ state, recentField }) {
  return (
    <div className="space-y-4">
      {/* Schädel-Darstellung beidseitig */}
      <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold uppercase">
            Anatomie · Live
          </div>
          <div className="flex items-center gap-2 text-[9px] font-mono">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>frei</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Missempf.</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Schmerz</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1 p-2 bg-slate-50">
          <div className="bg-white rounded-md p-1">
            <SkullSide side="left" state={state} recentField={recentField} />
          </div>
          <div className="bg-white rounded-md p-1">
            <SkullSide side="right" state={state} recentField={recentField} />
          </div>
        </div>
      </div>

      {/* Mundöffnung */}
      <MouthOpeningGauge
        active={state.mouth_opening_active_mm}
        passive={state.mouth_opening_passive_mm}
      />

      {/* Bewegungen */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
        <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold uppercase">
          Bewegungen
        </div>
        <MovementGauge label="Laterotrusion L" value={state.laterotrusion_left_mm} norm={7} />
        <MovementGauge label="Laterotrusion R" value={state.laterotrusion_right_mm} norm={7} />
        <MovementGauge label="Protrusion" value={state.protrusion_mm} norm={6} />
        <MovementGauge label="Retrusion" value={state.retrusion_mm} max={3} norm={1} />
      </div>

      {/* Schmerz-Skalen VAS */}
      {(state.pain_vas != null || state.pain_impact_vas != null) && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
          <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold uppercase">
            Schmerz-Skalen (VAS)
          </div>
          {state.pain_vas != null && (
            <MovementGauge label="Schmerzstärke" value={state.pain_vas} max={10} unit="/10" norm={3} />
          )}
          {state.pain_impact_vas != null && (
            <MovementGauge label="Beeinträchtigung" value={state.pain_impact_vas} max={10} unit="/10" norm={3} />
          )}
        </div>
      )}
    </div>
  );
}

'use client';
// ═══════════════════════════════════════════════════════════════════
// Anatomie-View für Klinischen Funktionsstatus
// Nutzt die original DGFDT-Grafik (Schemakopf) als Hintergrund.
// Schmerz-Regionen leuchten in VAS-Farbverlauf (0-10).
// Muskel-Punkte nutzen DGFDT-Palpations-Skala (0/1/2).
// ═══════════════════════════════════════════════════════════════════

import React from 'react';

// ═══════════════════════════════════════════════════════════════════
// VAS-Farbskala (0-10) — von grün über amber/orange zu rot
// ═══════════════════════════════════════════════════════════════════
function vasColor(value) {
  if (value === null || value === undefined) return null;
  if (value === 0) return { fill: '#10b981', label: 'kein Schmerz' };
  if (value <= 1) return { fill: '#22c55e', label: 'sehr leicht' };
  if (value <= 3) return { fill: '#84cc16', label: 'leicht' };
  if (value <= 5) return { fill: '#f59e0b', label: 'moderat' };
  if (value <= 7) return { fill: '#f97316', label: 'stark' };
  if (value <= 9) return { fill: '#ef4444', label: 'sehr stark' };
  return { fill: '#991b1b', label: 'unerträglich' };
}

// Boolean-Schmerz ohne VAS (heller Indikator)
function painBoolColor(value) {
  if (value === true) return { fill: '#fb923c', stroke: '#c2410c', label: 'Schmerz ja' };
  if (value === false) return { fill: '#10b981', stroke: '#047857', label: 'unauffällig' };
  return null;
}

// Palpations-Farben (Muskeln, Skala 0/1/2)
function palpColor(value) {
  if (value === 0) return { fill: '#10b981', stroke: '#047857', label: 'unauffällig' };
  if (value === 1) return { fill: '#f59e0b', stroke: '#b45309', label: 'Missempfindung' };
  if (value === 2) return { fill: '#ef4444', stroke: '#b91c1c', label: 'Schmerz' };
  return null;
}

// ═══════════════════════════════════════════════════════════════════
// SCHMERZ-REGIONEN — relative Koordinaten auf der DGFDT-Grafik
// Bild ist 1000 × 430 Pixel (siehe public/anatomy/dgfdt-heads.png)
// Linker Kopf: ca. 80-470 (Mitte ~270)
// Rechter Kopf: ca. 530-920 (Mitte ~720)
// ═══════════════════════════════════════════════════════════════════

// Format: { id, baseField, vasField, side, x, y, r }
const PAIN_REGIONS = [
  // KOPF (allgemein) — oberer Kopfbereich
  { id: 'head_left',     baseField: 'pain_head_left',     vasField: 'pain_head_vas_left',     side: 'L', x: 270, y: 90, r: 35, label: 'Kopf links' },
  { id: 'head_right',    baseField: 'pain_head_right',    vasField: 'pain_head_vas_right',    side: 'R', x: 720, y: 90, r: 35, label: 'Kopf rechts' },

  // SCHLÄFEN — über/vor dem Ohr
  { id: 'temples_left',  baseField: 'pain_temples_left',  vasField: 'pain_temples_vas_left',  side: 'L', x: 240, y: 175, r: 26, label: 'Schläfen links' },
  { id: 'temples_right', baseField: 'pain_temples_right', vasField: 'pain_temples_vas_right', side: 'R', x: 760, y: 175, r: 26, label: 'Schläfen rechts' },

  // OHR / KIEFERGELENK — auf Höhe Ohr
  { id: 'ear_jaw_left',  baseField: 'pain_ear_jaw_left',  vasField: 'pain_ear_jaw_vas_left',  side: 'L', x: 195, y: 230, r: 22, label: 'Ohr/Kiefergelenk links' },
  { id: 'ear_jaw_right', baseField: 'pain_ear_jaw_right', vasField: 'pain_ear_jaw_vas_right', side: 'R', x: 805, y: 230, r: 22, label: 'Ohr/Kiefergelenk rechts' },

  // NACKEN — hinten unten
  { id: 'neck_left',     baseField: 'pain_neck_left',     vasField: 'pain_neck_vas_left',     side: 'L', x: 130, y: 340, r: 26, label: 'Nacken links' },
  { id: 'neck_right',    baseField: 'pain_neck_right',    vasField: 'pain_neck_vas_right',    side: 'R', x: 870, y: 340, r: 26, label: 'Nacken rechts' },

  // SCHULTER — unten
  { id: 'shoulder_left', baseField: 'pain_shoulder_left', vasField: 'pain_shoulder_vas_left', side: 'L', x: 95, y: 415, r: 28, label: 'Schulter links' },
  { id: 'shoulder_right',baseField: 'pain_shoulder_right',vasField: 'pain_shoulder_vas_right',side: 'R', x: 905, y: 415, r: 28, label: 'Schulter rechts' },
];

// MUSKEL-PUNKTE — Palpation, Skala 0/1/2
const MUSCLE_POINTS = [
  // LINKS (linker Kopf in Grafik, Patient-rechte Seite — DGFDT-Konvention!)
  { id: 'temp_ant_L',    field: 'muscle_temp_ant_left',    side: 'L', x: 260, y: 130, label: 'Temporalis ant.' },
  { id: 'temp_med_L',    field: 'muscle_temp_med_left',    side: 'L', x: 215, y: 145, label: 'Temporalis med.' },
  { id: 'temp_post_L',   field: 'muscle_temp_post_left',   side: 'L', x: 175, y: 165, label: 'Temporalis post.' },
  { id: 'mass_origin_L', field: 'muscle_mass_origin_left', side: 'L', x: 295, y: 240, label: 'Masseter Urspr.' },
  { id: 'mass_belly_L',  field: 'muscle_mass_belly_left',  side: 'L', x: 280, y: 280, label: 'Masseter Bauch' },
  { id: 'mass_insert_L', field: 'muscle_mass_insert_left', side: 'L', x: 270, y: 320, label: 'Masseter Ans.' },
  { id: 'submand_L',     field: 'muscle_submand_left',     side: 'L', x: 320, y: 360, label: 'Submand.' },
  { id: 'subocc_L',      field: 'muscle_subocc_left',      side: 'L', x: 165, y: 270, label: 'Subokzipital' },
  // RECHTS
  { id: 'temp_ant_R',    field: 'muscle_temp_ant_right',   side: 'R', x: 740, y: 130, label: 'Temporalis ant.' },
  { id: 'temp_med_R',    field: 'muscle_temp_med_right',   side: 'R', x: 785, y: 145, label: 'Temporalis med.' },
  { id: 'temp_post_R',   field: 'muscle_temp_post_right',  side: 'R', x: 825, y: 165, label: 'Temporalis post.' },
  { id: 'mass_origin_R', field: 'muscle_mass_origin_right',side: 'R', x: 705, y: 240, label: 'Masseter Urspr.' },
  { id: 'mass_belly_R',  field: 'muscle_mass_belly_right', side: 'R', x: 720, y: 280, label: 'Masseter Bauch' },
  { id: 'mass_insert_R', field: 'muscle_mass_insert_right',side: 'R', x: 730, y: 320, label: 'Masseter Ans.' },
  { id: 'submand_R',     field: 'muscle_submand_right',    side: 'R', x: 680, y: 360, label: 'Submand.' },
  { id: 'subocc_R',      field: 'muscle_subocc_right',     side: 'R', x: 835, y: 270, label: 'Subokzipital' },
];

// ═══════════════════════════════════════════════════════════════════
// EINZELNE OVERLAY-PUNKTE
// ═══════════════════════════════════════════════════════════════════

// Schmerz-Region (großer farbiger Kreis mit Transparenz, je nach VAS)
function PainRegion({ region, state, recentField }) {
  const boolValue = state[region.baseField];
  const vasValue = state[region.vasField];
  const isRecent = recentField === region.baseField || recentField === region.vasField;

  // Wenn weder boolean noch VAS gesetzt → unsichtbar
  if (boolValue === null && vasValue === null) return null;

  // Wenn explizit "kein Schmerz" → kleiner grüner Punkt
  if (boolValue === false && (vasValue === null || vasValue === 0)) {
    return (
      <g>
        <circle cx={region.x} cy={region.y} r={6} fill="#10b981" opacity="0.7" />
        <title>{region.label}: ohne Befund</title>
      </g>
    );
  }

  // VAS-basierte Färbung wenn vorhanden
  let color = null;
  let displayValue = null;
  if (vasValue !== null && vasValue !== undefined) {
    color = vasColor(vasValue);
    displayValue = vasValue;
  } else if (boolValue === true) {
    color = painBoolColor(true);
    displayValue = '!';
  }

  if (!color) return null;

  return (
    <g className={isRecent ? 'anatomy-flash' : ''}>
      {/* Pulsierende Aura */}
      <circle
        cx={region.x} cy={region.y} r={region.r + 4}
        fill={color.fill}
        opacity="0.18"
        className="anatomy-glow"
      />
      {/* Hauptkreis */}
      <circle
        cx={region.x} cy={region.y} r={region.r}
        fill={color.fill}
        opacity="0.55"
        stroke={color.fill}
        strokeWidth="2"
      />
      {/* VAS-Wert in der Mitte */}
      {displayValue !== null && (
        <text
          x={region.x}
          y={region.y + 5}
          textAnchor="middle"
          fontSize="16"
          fontWeight="800"
          fill="#ffffff"
          stroke="rgba(0,0,0,0.4)"
          strokeWidth="0.5"
          paintOrder="stroke"
          fontFamily="monospace"
        >
          {displayValue}
        </text>
      )}
      <title>{region.label}: {color.label}{vasValue !== null ? ` (VAS ${vasValue})` : ''}</title>
    </g>
  );
}

// Muskel-Punkt (kleiner gefärbter Kreis)
function MusclePoint({ point, state, recentField }) {
  const value = state[point.field];
  const isRecent = recentField === point.field;
  const color = palpColor(value);
  if (!color) return null;

  return (
    <g className={isRecent ? 'anatomy-flash' : ''}>
      {value !== 0 && (
        <circle cx={point.x} cy={point.y} r="9" fill={color.fill} opacity="0.3" className="anatomy-glow" />
      )}
      <circle
        cx={point.x} cy={point.y} r="6"
        fill={color.fill}
        stroke={color.stroke}
        strokeWidth="1.5"
      />
      <title>{point.label} ({point.side}): {color.label}</title>
    </g>
  );
}

// ═══════════════════════════════════════════════════════════════════
// VAS-FARBSKALA (Legende)
// ═══════════════════════════════════════════════════════════════════
function VASLegend() {
  const stops = [
    { v: 0,  c: '#10b981' },
    { v: 1,  c: '#22c55e' },
    { v: 3,  c: '#84cc16' },
    { v: 5,  c: '#f59e0b' },
    { v: 7,  c: '#f97316' },
    { v: 9,  c: '#ef4444' },
    { v: 10, c: '#991b1b' },
  ];
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-md p-2">
      <div className="text-[9px] tracking-widest text-slate-700 font-mono font-bold uppercase mb-1">
        VAS-Skala 0–10
      </div>
      <div className="flex h-3 rounded overflow-hidden">
        {stops.map((s, i) => (
          <div
            key={i}
            className="flex-1"
            style={{ backgroundColor: s.c }}
            title={`VAS ${s.v}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-[9px] text-slate-600 font-mono mt-0.5">
        <span>0 kein</span>
        <span>5 mod.</span>
        <span>10 max.</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DEBUG-PANEL — zeigt welche relevanten Felder gefüllt sind
// ═══════════════════════════════════════════════════════════════════
function DebugPanel({ state }) {
  const allFields = [
    ...PAIN_REGIONS.flatMap(r => [r.baseField, r.vasField]),
    ...MUSCLE_POINTS.map(p => p.field),
  ];
  const filledFields = allFields.filter(f => state[f] !== null && state[f] !== undefined);

  if (filledFields.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-300 rounded-md p-2 text-[11px] text-amber-900">
        <div className="font-bold mb-1">Debug · Anatomy-State</div>
        <div>Noch keine relevanten Felder gefüllt. Sage etwas wie:</div>
        <div className="font-mono mt-1 italic">"Schläfen links Stärke 7"</div>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50 border border-emerald-300 rounded-md p-2 text-[11px] text-emerald-900">
      <div className="font-bold mb-1">Debug · {filledFields.length} Feld(er) gefüllt:</div>
      <div className="space-y-0.5 font-mono max-h-32 overflow-y-auto">
        {filledFields.map(f => (
          <div key={f} className="flex justify-between gap-2">
            <span className="truncate">{f}</span>
            <span className="font-bold">{JSON.stringify(state[f])}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// HEAD GRAFIK MIT OVERLAYS
// ═══════════════════════════════════════════════════════════════════
function AnatomyHeads({ state, recentField }) {
  return (
    <div className="relative bg-white rounded-lg overflow-hidden">
      {/* DGFDT-Grafik als Hintergrund-Bild */}
      <img
        src="/anatomy/dgfdt-heads.png"
        alt="DGFDT Schema-Köpfe"
        className="block w-full h-auto"
        style={{ aspectRatio: '1000/430' }}
      />
      {/* SVG-Overlay mit absoluten Koordinaten passend zum Bild */}
      <svg
        viewBox="0 0 1000 430"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Schmerz-Regionen (groß, halbtransparent) */}
        {PAIN_REGIONS.map(r => (
          <PainRegion key={r.id} region={r} state={state} recentField={recentField} />
        ))}
        {/* Muskel-Palpations-Punkte (klein, oben drüber) */}
        {MUSCLE_POINTS.map(p => (
          <MusclePoint key={p.id} point={p} state={state} recentField={recentField} />
        ))}

        {/* Seiten-Indikator (LINKS / RECHTS Patient — DGFDT-Konvention) */}
        <text x="270" y="15" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#64748b" fontFamily="monospace">
          Patient · LINKS
        </text>
        <text x="720" y="15" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#64748b" fontFamily="monospace">
          Patient · RECHTS
        </text>
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MUNDÖFFNUNGS-ANZEIGE
// ═══════════════════════════════════════════════════════════════════
function MouthOpeningGauge({ active, passive }) {
  const max = 60;
  const activePercent = active != null ? Math.min(100, (active / max) * 100) : 0;
  const passivePercent = passive != null ? Math.min(100, (passive / max) * 100) : 0;
  const activeColor = active == null ? '#cbd5e1' : active < 35 ? '#ef4444' : active < 40 ? '#f59e0b' : '#10b981';
  const passiveColor = passive == null ? '#cbd5e1' : passive < 40 ? '#ef4444' : passive < 45 ? '#f59e0b' : '#10b981';

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
      <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold uppercase mb-2">
        Mundöffnung
      </div>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-[10px] text-slate-600 font-medium">aktiv</span>
            <span className="font-mono font-bold text-sm" style={{ color: activeColor }}>
              {active != null ? `${active} mm` : '–'}
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${activePercent}%`, backgroundColor: activeColor }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-[10px] text-slate-600 font-medium">passiv</span>
            <span className="font-mono font-bold text-sm" style={{ color: passiveColor }}>
              {passive != null ? `${passive} mm` : '–'}
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${passivePercent}%`, backgroundColor: passiveColor }} />
          </div>
        </div>
      </div>
      <div className="mt-2 text-[9px] text-slate-500 leading-tight">
        Norm: aktiv ≥ 40 mm, passiv ≥ 45 mm
      </div>
    </div>
  );
}

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
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percent}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// HAUPTKOMPONENTE
// ═══════════════════════════════════════════════════════════════════
export function AnatomyView({ state, recentField }) {
  return (
    <div className="space-y-3">
      {/* Anatomie-Grafik */}
      <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold uppercase">
            Schmerz-Lokalisation · Live
          </div>
          <div className="text-[9px] text-slate-500">
            Schemagrafik DGFDT
          </div>
        </div>
        <div className="p-2">
          <AnatomyHeads state={state} recentField={recentField} />
        </div>
        <div className="px-3 pb-3 space-y-2">
          <VASLegend />
          <DebugPanel state={state} />
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

      {/* Globale VAS aus Anamnese */}
      {(state.pain_vas != null || state.pain_impact_vas != null) && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
          <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold uppercase">
            Schmerz-Anamnese (VAS)
          </div>
          {state.pain_vas != null && (
            <MovementGauge label="Schmerzstärke gesamt" value={state.pain_vas} max={10} unit="/10" norm={3} />
          )}
          {state.pain_impact_vas != null && (
            <MovementGauge label="Beeinträchtigung" value={state.pain_impact_vas} max={10} unit="/10" norm={3} />
          )}
        </div>
      )}
    </div>
  );
}

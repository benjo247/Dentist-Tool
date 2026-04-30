'use client';
// ═══════════════════════════════════════════════════════════════════
// Zahnverschleiß-Screening — UI Component
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { AlertTriangle, Info, CheckCircle2, Activity } from 'lucide-react';
import { SEXTANTS, OCCLUSAL_SCALE, PALATAL_SCALE, FIELDS, evaluate } from './form';

const COLOR_CLASSES = {
  emerald: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  sky:     'bg-sky-100 text-sky-800 border-sky-300',
  amber:   'bg-amber-100 text-amber-800 border-amber-300',
  orange:  'bg-orange-100 text-orange-800 border-orange-300',
  rose:    'bg-rose-100 text-rose-800 border-rose-300',
  pending: 'bg-slate-50 text-slate-400 border-slate-300 border-dashed',
};

function ScaleBadge({ value, scale, recent }) {
  if (value === null || value === undefined) {
    return <span className={`inline-flex items-center justify-center w-10 h-10 rounded-md text-sm font-bold border-2 ${COLOR_CLASSES.pending}`}>—</span>;
  }
  const item = scale.find(s => s.value === value);
  const colorClass = item ? COLOR_CLASSES[item.color] : COLOR_CLASSES.pending;
  return (
    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-md text-sm font-bold border-2 transition-all ${colorClass} ${recent ? 'ring-2 ring-cyan-400 ring-offset-2' : ''}`}>
      {value}
    </span>
  );
}

function SextantCell({ sextant, value, recentField }) {
  const fieldKey = `occlusal_${sextant.id}`;
  const isRecent = recentField === fieldKey;
  return (
    <div className={`p-3 rounded-lg border transition-colors ${isRecent ? 'bg-cyan-50 border-cyan-200' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-mono font-bold text-slate-700">{sextant.id}</div>
          <div className="text-[11px] text-slate-500 truncate">{sextant.label}</div>
        </div>
        <ScaleBadge value={value} scale={OCCLUSAL_SCALE} recent={isRecent} />
      </div>
    </div>
  );
}

function ResultBanner({ result }) {
  if (result.result === 'incomplete') {
    return (
      <div className="rounded-lg border-2 border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-slate-800">{result.label}</div>
          <div className="text-sm text-slate-600 mt-0.5">{result.detail}</div>
        </div>
      </div>
    );
  }
  const styles = {
    high:   'border-rose-300 bg-rose-50 text-rose-900',
    medium: 'border-amber-300 bg-amber-50 text-amber-900',
    low:    'border-emerald-300 bg-emerald-50 text-emerald-900',
  };
  const Icons = { high: AlertTriangle, medium: Activity, low: CheckCircle2 };
  const Icon = Icons[result.severity] || Info;
  return (
    <div className={`rounded-lg border-2 p-4 ${styles[result.severity]}`}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-bold">{result.label}</div>
          <div className="text-sm opacity-90 mt-0.5">{result.detail}</div>
        </div>
        <div className="flex gap-3 text-right">
          <div>
            <div className="text-[10px] opacity-70 font-mono">okkl. max</div>
            <div className="text-2xl font-bold">{result.maxOcclusal ?? '—'}</div>
          </div>
          <div>
            <div className="text-[10px] opacity-70 font-mono">palat.</div>
            <div className="text-2xl font-bold">{result.palatal ?? '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function YesNoChip({ value, recent }) {
  if (value === true) return <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 ${recent ? 'ring-2 ring-cyan-400' : ''}`}>JA</span>;
  if (value === false) return <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 ${recent ? 'ring-2 ring-cyan-400' : ''}`}>NEIN</span>;
  return <span className="inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold bg-slate-50 text-slate-400 border border-dashed border-slate-300">—</span>;
}

export function View({ state, recentField }) {
  const result = evaluate(state);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <ResultBanner result={result} />

      {/* Sextanten-Befund */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-cyan-700 text-white flex items-center justify-center font-bold text-sm">S</div>
          <div className="font-semibold text-slate-800">Sextanten-Befund (TWES 2.0)</div>
          <div className="ml-auto text-xs text-slate-500 font-mono">
            okklusal/inzisal · Worst-Score
          </div>
        </div>
        {/* Schema-Layout: Oberkiefer oben, Unterkiefer unten */}
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {[SEXTANTS[0], SEXTANTS[1], SEXTANTS[2]].map(s => (
              <SextantCell key={s.id} sextant={s} value={state[`occlusal_${s.id}`]} recentField={recentField} />
            ))}
          </div>
          <div className="border-t border-dashed border-slate-200" />
          <div className="grid grid-cols-3 gap-2">
            {[SEXTANTS[5], SEXTANTS[4], SEXTANTS[3]].map(s => (
              <SextantCell key={s.id} sextant={s} value={state[`occlusal_${s.id}`]} recentField={recentField} />
            ))}
          </div>
        </div>

        {/* Skalen-Legende */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50">
          <div className="text-[10px] font-mono font-bold text-slate-600 mb-2 tracking-wider">SKALA OKKLUSAL/INZISAL</div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            {OCCLUSAL_SCALE.map(s => (
              <div key={s.value} className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border ${COLOR_CLASSES[s.color]}`}>
                <span className="font-bold">{s.value}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Palatinal Sextant 2 */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-cyan-700 text-white flex items-center justify-center font-bold text-sm">P</div>
          <div className="font-semibold text-slate-800">Palatinale Flächen Sextant 2 (typisch Erosion)</div>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div className="text-sm text-slate-700">OK anterior 13-23 — palatinaler Verschleiß</div>
          <ScaleBadge value={state.palatal_S2} scale={PALATAL_SCALE} recent={recentField === 'palatal_S2'} />
        </div>
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50">
          <div className="text-[10px] font-mono font-bold text-slate-600 mb-2 tracking-wider">SKALA PALATINAL/ORAL/VESTIBULÄR</div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            {PALATAL_SCALE.map(s => (
              <div key={s.value} className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border ${COLOR_CLASSES[s.color]}`}>
                <span className="font-bold">{s.value}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pathologie & Ätiologie */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-cyan-700 text-white flex items-center justify-center font-bold text-sm">P</div>
            <div className="font-semibold text-slate-800">Pathologie-Anzeichen</div>
          </div>
          <div className="space-y-2">
            {FIELDS.filter(f => f.section === 'pathology').map(f => (
              <div key={f.key} className={`flex items-start gap-3 p-2 rounded ${recentField === f.key ? 'bg-cyan-50' : ''}`}>
                <YesNoChip value={state[f.key]} recent={recentField === f.key} />
                <div className="flex-1 text-xs text-slate-700">{f.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-cyan-700 text-white flex items-center justify-center font-bold text-sm">Ä</div>
            <div className="font-semibold text-slate-800">Ätiologie-Verdacht</div>
          </div>
          <div className="space-y-2">
            {FIELDS.filter(f => f.section === 'etiology').map(f => (
              <div key={f.key} className={`flex items-start gap-3 p-2 rounded ${recentField === f.key ? 'bg-cyan-50' : ''}`}>
                <YesNoChip value={state[f.key]} recent={recentField === f.key} />
                <div className="flex-1 text-xs text-slate-700">{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-200 pt-4">
        <p className="mb-1">
          <strong>Konzept:</strong> Tooth Wear Evaluation System 2.0 (TWES 2.0) — gemeinsame Entwicklung einer
          internationalen Arbeitsgruppe aus Amsterdam (Wetselaar/Lobbezoo) und Hamburg (Ahlers).
        </p>
        <p>
          <strong>Indikation:</strong> Identifikation von Patienten mit moderatem/schwerem Zahnverschleiß
          zur weiterführenden Diagnostik (Zahnverschleiß-Status). Pathologisch wenn moderater bis extremer
          Verschleiß in Kombination mit Anzeichen/Symptomen vorliegt.
        </p>
      </div>
    </div>
  );
}

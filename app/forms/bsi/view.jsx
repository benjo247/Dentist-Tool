'use client';
// ═══════════════════════════════════════════════════════════════════
// BSI — UI Component
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { AlertTriangle, Info, CheckCircle2, Activity } from 'lucide-react';
import { FIELDS, SECTIONS, evaluate } from './form';

function TripleState({ value, recent }) {
  const base = 'inline-flex items-center justify-center w-8 h-8 rounded-md text-xs font-bold transition-all';
  if (value === true) {
    return <span className={`${base} bg-amber-100 text-amber-800 border-2 border-amber-300 ${recent ? 'ring-2 ring-amber-400 ring-offset-2' : ''}`}>JA</span>;
  }
  if (value === false) {
    return <span className={`${base} bg-emerald-100 text-emerald-800 border-2 border-emerald-300 ${recent ? 'ring-2 ring-emerald-400 ring-offset-2' : ''}`}>NEIN</span>;
  }
  return <span className={`${base} bg-slate-50 text-slate-400 border-2 border-dashed border-slate-300`}>—</span>;
}

function PointsBadge({ points, active }) {
  return (
    <span className={`inline-flex items-center justify-center text-[10px] font-mono font-bold rounded px-1.5 py-0.5 ${
      active
        ? 'bg-rose-600 text-white'
        : 'bg-slate-100 text-slate-500 border border-slate-200'
    }`}>
      {points} P
    </span>
  );
}

function FieldRow({ field, value, recentField }) {
  const isRecent = recentField === field.key;
  const isPositive = value === true;
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${isRecent ? 'bg-cyan-50' : 'hover:bg-slate-50'}`}>
      <div className="flex-shrink-0 mt-0.5">
        <TripleState value={value} recent={isRecent} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <div className="text-sm text-slate-800 leading-snug flex-1">{field.label}</div>
          <PointsBadge points={field.points} active={isPositive} />
        </div>
        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{field.key}</div>
        {field.note && (
          <div className="text-[11px] text-slate-600 mt-1 italic">
            {field.note}
          </div>
        )}
      </div>
    </div>
  );
}

function ResultBanner({ result }) {
  if (result.result === 'incomplete') {
    return (
      <div className="rounded-lg border-2 border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-slate-800">{result.label}</div>
            <div className="text-sm text-slate-600 mt-0.5">{result.detail}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 font-mono">aktuell</div>
            <div className="text-2xl font-bold text-slate-700">{result.maxPoints} P</div>
          </div>
        </div>
      </div>
    );
  }
  const styles = {
    high: 'border-rose-300 bg-rose-50 text-rose-900',
    medium: 'border-amber-300 bg-amber-50 text-amber-900',
    low: 'border-emerald-300 bg-emerald-50 text-emerald-900',
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
        <div className="text-right">
          <div className="text-xs opacity-70 font-mono">höchster Wert</div>
          <div className="text-3xl font-bold">{result.maxPoints} P</div>
        </div>
      </div>
    </div>
  );
}

export function View({ state, recentField }) {
  const result = evaluate(state);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <ResultBanner result={result} />

      {SECTIONS.map(section => {
        const sectionFields = FIELDS.filter(f => f.section === section.id);
        return (
          <div key={section.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-cyan-700 text-white flex items-center justify-center font-bold text-sm">
                {section.icon}
              </div>
              <div className="font-semibold text-slate-800">{section.title}</div>
              <div className="ml-auto text-xs text-slate-500 font-mono">
                {sectionFields.filter(f => state[f.key] !== null).length} / {sectionFields.length}
              </div>
            </div>
            <div className="p-2 space-y-1">
              {sectionFields.map(f => (
                <FieldRow key={f.key} field={f} value={state[f.key]} recentField={recentField} />
              ))}
            </div>
          </div>
        );
      })}

      <div className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-200 pt-4 space-y-1">
        <p>
          <strong>Bewertung:</strong> Der höchste Einzelwert bestimmt das Gesamtergebnis.
          Eine positive Antwort auf A1 = 1 Punkt; A2-U3 = je 2 Punkte. Der Gesamtwert sagt nichts über die Intensität des Bruxismus aus.
        </p>
        <p>
          <strong>Indikation:</strong> Zur Abschätzung des Bruxismusrisikos im Rahmen der zahnärztlichen Behandlungsplanung.
        </p>
      </div>
    </div>
  );
}

'use client';
// ═══════════════════════════════════════════════════════════════════
// Zahnverschleiß-Status — VIEW
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { TEETH_UPPER, TEETH_LOWER, PATHOLOGY_ITEMS, CHEMICAL_ITEMS, MECHANICAL_ITEMS } from './form';

// ─── HELPER: Zelle für einen Wert (0-4) ────────────────────────
function GradeCell({ value, hot, missing }) {
  if (missing) {
    return (
      <div className="h-7 flex items-center justify-center rounded text-xs font-mono font-bold bg-slate-200 text-slate-600 border-2 border-slate-300">
        ✕
      </div>
    );
  }
  const colors = {
    0: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    1: 'bg-lime-100 text-lime-800 border-lime-400',
    2: 'bg-amber-100 text-amber-900 border-amber-400',
    3: 'bg-orange-100 text-orange-900 border-orange-400',
    4: 'bg-rose-100 text-rose-800 border-rose-400',
  };
  const empty = 'bg-slate-50 text-slate-400 border-slate-200 border-dashed';
  const cls = value === null || value === undefined ? empty : colors[value];
  return (
    <div className={`h-7 flex items-center justify-center rounded text-xs font-mono font-bold border-2 transition-all duration-300 ${cls} ${hot ? 'animate-flash ring-2 ring-cyan-400' : ''}`}>
      {value === null || value === undefined ? '–' : value}
    </div>
  );
}

function YesNoIndicator({ value }) {
  if (value === null || value === undefined) return <span className="text-slate-400 font-mono text-xs">–</span>;
  return (
    <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${value ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
      {value ? 'ja' : 'nein'}
    </span>
  );
}

function SymptomRow({ item, value, hot, summary }) {
  return (
    <div className={`flex items-center justify-between gap-2 py-1.5 px-2 rounded ${hot ? 'animate-flash bg-cyan-50' : ''}`}>
      <span className="text-xs text-slate-700 flex-1">{item.label}</span>
      <YesNoIndicator value={value} />
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

// ─── ZAHN-TABELLE (FDI-Schema) ─────────────────────────────────
function ToothTable({ form, recentField }) {
  const isHot = (field) => recentField === field;

  const renderRow = (teeth, surface) => (
    <div className="flex gap-0.5">
      {teeth.map(t => {
        const missing = form[`tooth_${t}_missing`] === true;
        return (
          <div key={t} className="flex-1 min-w-[28px]">
            <GradeCell
              value={form[`tooth_${t}_${surface}`]}
              hot={isHot(`tooth_${t}_${surface}`) || isHot(`tooth_${t}_missing`)}
              missing={missing}
            />
          </div>
        );
      })}
    </div>
  );

  const renderToothNumbers = (teeth) => (
    <div className="flex gap-0.5">
      {teeth.map(t => (
        <div key={t} className="flex-1 min-w-[28px] text-center">
          <span className="text-[10px] font-mono font-bold text-slate-700">{t}</span>
        </div>
      ))}
    </div>
  );

  const SurfaceLabel = ({ children }) => (
    <div className="text-[10px] tracking-widest text-slate-600 font-mono font-bold w-20 text-right pr-2">{children}</div>
  );

  return (
    <div className="space-y-3">
      {/* Sextanten-Header oben */}
      <div className="flex gap-0.5 text-[10px] font-mono font-bold text-slate-500">
        <div className="w-20"></div>
        <div className="flex-1 min-w-[140px] text-center bg-slate-50 py-1 rounded">SEXTANT 1</div>
        <div className="flex-1 min-w-[170px] text-center bg-slate-50 py-1 rounded">SEXTANT 2</div>
        <div className="flex-1 min-w-[140px] text-center bg-slate-50 py-1 rounded">SEXTANT 3</div>
      </div>

      {/* OBERKIEFER */}
      <div className="space-y-1.5">
        <div className="flex gap-2 items-center">
          <SurfaceLabel>bukkal</SurfaceLabel>
          {renderRow(TEETH_UPPER, 'buccal')}
        </div>
        <div className="flex gap-2 items-center">
          <SurfaceLabel>okkl./inz.</SurfaceLabel>
          {renderRow(TEETH_UPPER, 'occlusal')}
        </div>
        <div className="flex gap-2 items-center">
          <SurfaceLabel>palatinal</SurfaceLabel>
          {renderRow(TEETH_UPPER, 'palatal')}
        </div>
        <div className="flex gap-2 items-center pt-1">
          <div className="w-20 text-right pr-2 text-[10px] tracking-widest text-cyan-700 font-mono font-bold">OK</div>
          {renderToothNumbers(TEETH_UPPER)}
        </div>
      </div>

      {/* Trennstrich */}
      <div className="border-t-2 border-dashed border-slate-300"></div>

      {/* UNTERKIEFER */}
      <div className="space-y-1.5">
        <div className="flex gap-2 items-center">
          <div className="w-20 text-right pr-2 text-[10px] tracking-widest text-cyan-700 font-mono font-bold">UK</div>
          {renderToothNumbers(TEETH_LOWER)}
        </div>
        <div className="flex gap-2 items-center">
          <SurfaceLabel>lingual</SurfaceLabel>
          {renderRow(TEETH_LOWER, 'palatal')}
        </div>
        <div className="flex gap-2 items-center">
          <SurfaceLabel>okkl./inz.</SurfaceLabel>
          {renderRow(TEETH_LOWER, 'occlusal')}
        </div>
        <div className="flex gap-2 items-center">
          <SurfaceLabel>bukkal</SurfaceLabel>
          {renderRow(TEETH_LOWER, 'buccal')}
        </div>
      </div>

      {/* Sextanten-Header unten */}
      <div className="flex gap-0.5 text-[10px] font-mono font-bold text-slate-500">
        <div className="w-20"></div>
        <div className="flex-1 min-w-[140px] text-center bg-slate-50 py-1 rounded">SEXTANT 6</div>
        <div className="flex-1 min-w-[170px] text-center bg-slate-50 py-1 rounded">SEXTANT 5</div>
        <div className="flex-1 min-w-[140px] text-center bg-slate-50 py-1 rounded">SEXTANT 4</div>
      </div>
    </div>
  );
}

// ─── SYMPTOM-LISTE ─────────────────────────────────────────────
function SymptomList({ items, form, recentField, title, summary }) {
  const filledCount = items.filter(i => form[i.key] === true).length;
  const totalAnswered = items.filter(i => form[i.key] !== null && form[i.key] !== undefined).length;
  return (
    <div>
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200">
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        <span className="text-[10px] font-mono text-slate-600">
          {filledCount}/{items.length} positiv · {totalAnswered}/{items.length} erfasst
        </span>
      </div>
      <div className="space-y-0.5">
        {items.map(item => (
          <SymptomRow
            key={item.key}
            item={item}
            value={form[item.key]}
            hot={recentField === item.key}
          />
        ))}
      </div>
    </div>
  );
}

// ─── HAUPT-VIEW ────────────────────────────────────────────────
export function View({ state, recentField }) {
  const form = state || {};

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-white border-2 border-slate-200 rounded-xl p-5">
        <div className="text-[10px] tracking-widest text-cyan-700 font-mono font-bold mb-1">DGFDT BEFUNDBOGEN · TWES 2.0</div>
        <h1 className="text-xl font-bold text-slate-900">Zahnverschleiß-Status</h1>
        <p className="text-sm text-slate-600 mt-1">
          Vollständige TWES-2.0-Erfassung pro Zahn und Fläche, Pathologie- und Ätiologie-Bewertung
        </p>
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-600 mt-3">
          <span className="px-2 py-1 bg-emerald-100 border border-emerald-300 rounded text-emerald-800">0 kein</span>
          <span className="px-2 py-1 bg-lime-100 border border-lime-400 rounded text-lime-800">1 mild</span>
          <span className="px-2 py-1 bg-amber-100 border border-amber-400 rounded text-amber-800">2 moderat</span>
          <span className="px-2 py-1 bg-orange-100 border border-orange-400 rounded text-orange-900">3 erheblich</span>
          <span className="px-2 py-1 bg-rose-100 border border-rose-400 rounded text-rose-800">4 extrem</span>
          <span className="px-2 py-1 bg-slate-200 border border-slate-300 rounded text-slate-700">✕ fehlt</span>
        </div>
      </div>

      {/* SEKTION 1: VERSCHLEISSGRADE PRO ZAHN */}
      <SectionCard num="1" title="Verschleißgrade" subtitle="Pro Zahn und Fläche · TWES 2.0 Skala 0–4"
        recentField={recentField} fields={['tooth_']}>
        <ToothTable form={form} recentField={recentField} />
      </SectionCard>

      {/* SEKTION 2: PATHOLOGIE-ITEMS */}
      <SectionCard num="2" title="Anzeichen pathologischen Zahnverschleiß"
        subtitle="10 Indikatoren — bestimmt die Pathologie-Bewertung"
        recentField={recentField} fields={['pat_']}>
        <SymptomList items={PATHOLOGY_ITEMS} form={form} recentField={recentField}
          title="Pathologie-Indikatoren" />
      </SectionCard>

      {/* SEKTION 3 + 4: ÄTIOLOGIE — zwei Spalten */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard num="3" title="Chemische Faktoren"
          subtitle="≥ 50% positiv = chemisch überwiegend"
          recentField={recentField} fields={['chem_']}>
          <SymptomList items={CHEMICAL_ITEMS} form={form} recentField={recentField}
            title="Chemie-Indikatoren" />
        </SectionCard>

        <SectionCard num="4" title="Mechanische Faktoren"
          subtitle="≥ 50% positiv = mechanisch überwiegend"
          recentField={recentField} fields={['mech_']}>
          <SymptomList items={MECHANICAL_ITEMS} form={form} recentField={recentField}
            title="Mechanik-Indikatoren" />
        </SectionCard>
      </div>

      {/* SEKTION 5: DIAGNOSE */}
      <SectionCard num="5" title="Diagnose"
        subtitle="Vier Bausteine: generalisierter Grad · lokalisierter Grad · Pathologie · Ätiologie"
        recentField={recentField} fields={['diagnosis']}>
        <div className={`min-h-[80px] p-3 rounded-md border-2 ${recentField === 'diagnosis' ? 'border-cyan-400 bg-cyan-50 animate-flash' : 'border-slate-200 bg-slate-50'}`}>
          {form.diagnosis ? (
            <p className="text-sm text-slate-900 whitespace-pre-wrap">{form.diagnosis}</p>
          ) : (
            <p className="text-sm text-slate-400 italic">
              Beispiel: "Generalisierter milder Zahnverschleiß und lokalisiert erheblicher pathologischer Zahnverschleiß, überwiegend mechanisch und teilweise chemisch verursacht"
            </p>
          )}
        </div>
      </SectionCard>

      {/* Footer */}
      <div className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-200 pt-4 mt-6 text-center">
        <p>
          Befundbogen <strong>"Zahnverschleiß-Status"</strong> der Deutschen Gesellschaft
          für Funktionsdiagnostik und -therapie (DGFDT) · TWES 2.0
        </p>
        <p className="mt-1">© Wetselaar / Wetselaar-Glas / Katzer / Ahlers · DGFDT/DGZMK</p>
      </div>
    </div>
  );
}

'use client';
// ═══════════════════════════════════════════════════════════════════
// Zahnverschleiß-Status — VIEW
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { TEETH_UPPER, TEETH_LOWER, PATHOLOGY_ITEMS, CHEMICAL_ITEMS, MECHANICAL_ITEMS } from './form';

// ─── Zelle für Verschleißgrad (0-4) ────────────────────────────
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

// ─── Symptom-Zeile mit Checkbox-Optik ──────────────────────────
function SymptomRow({ item, value, hot }) {
  const filled = value === true;
  const explicitNo = value === false;
  return (
    <div className={`flex items-start gap-2 py-1 px-1.5 rounded transition-colors ${hot ? 'animate-flash bg-cyan-50' : ''}`}>
      <span className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
        filled ? 'bg-cyan-600 border-cyan-700' :
        explicitNo ? 'bg-slate-200 border-slate-400' :
        'bg-white border-slate-300'
      }`}>
        {filled && <span className="text-white text-[10px] font-bold leading-none">✓</span>}
        {explicitNo && <span className="text-slate-500 text-[10px] font-bold leading-none">–</span>}
      </span>
      <span className={`text-xs leading-snug ${filled ? 'text-slate-900 font-medium' : 'text-slate-700'}`}>
        {item.label}
      </span>
    </div>
  );
}

// ─── Summen-Box "X / 10" ───────────────────────────────────────
function SummaryBox({ count, total, recentlyChanged }) {
  return (
    <div className={`mt-3 ml-auto inline-flex items-center gap-2 ${recentlyChanged ? 'animate-flash' : ''}`}>
      <span className="text-[10px] tracking-widest text-slate-700 font-mono font-bold">SUMME</span>
      <div className="flex items-baseline gap-0.5 px-3 py-1.5 bg-slate-900 text-white rounded-md font-mono font-bold">
        <span className="text-base">{count}</span>
        <span className="text-xs text-slate-400">/ {total}</span>
      </div>
    </div>
  );
}

// ─── SectionCard ───────────────────────────────────────────────
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

// ─── ZAHN-TABELLE (FDI) ────────────────────────────────────────
// Sextanten-Definition (DGFDT Original):
// S1: 18,17,16,15,14 (5 Zähne)
// S2: 13,12,11,21,22,23 (6 Zähne — gesamte OK-Front)
// S3: 24,25,26,27,28 (5 Zähne)
// S4: 34,35,36,37,38 (5 Zähne)
// S5: 43,42,41,31,32,33 (6 Zähne — gesamte UK-Front, im PDF ist 44 mit drin)
// S6: 48,47,46,45,44 (5 Zähne)
const SEXTANT_UPPER = {
  S1: [18, 17, 16, 15, 14],
  S2: [13, 12, 11, 21, 22, 23],
  S3: [24, 25, 26, 27, 28],
};
const SEXTANT_LOWER = {
  S6: [48, 47, 46, 45, 44],
  S5: [43, 42, 41, 31, 32, 33],
  S4: [34, 35, 36, 37, 38],
};

function ToothTable({ form, recentField }) {
  const isHot = (field) => recentField === field;

  // Zelle pro Zahn/Fläche
  const Cell = ({ tooth, surface }) => {
    const missing = form[`tooth_${tooth}_missing`] === true;
    return (
      <GradeCell
        value={form[`tooth_${tooth}_${surface}`]}
        hot={isHot(`tooth_${tooth}_${surface}`) || isHot(`tooth_${tooth}_missing`)}
        missing={missing}
      />
    );
  };

  // Eine Zeile (Fläche) für einen Kiefer, gegliedert in 3 Sextanten
  const renderSurfaceRow = (sextants, surface) => (
    <div className="flex items-center gap-1">
      {Object.entries(sextants).map(([sextKey, teeth], idx) => (
        <React.Fragment key={sextKey}>
          {idx > 0 && <div className="w-0.5 h-7 bg-slate-300 self-stretch" />}
          <div className="flex gap-0.5 flex-1">
            {teeth.map(t => (
              <div key={t} className="flex-1 min-w-[26px]">
                <Cell tooth={t} surface={surface} />
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );

  // Zahn-Nummern-Reihe
  const renderToothNumbers = (sextants) => (
    <div className="flex items-center gap-1">
      {Object.entries(sextants).map(([sextKey, teeth], idx) => (
        <React.Fragment key={sextKey}>
          {idx > 0 && <div className="w-0.5 h-5 bg-slate-300 self-stretch" />}
          <div className="flex gap-0.5 flex-1">
            {teeth.map(t => (
              <div key={t} className="flex-1 min-w-[26px] text-center">
                <span className="text-[10px] font-mono font-bold text-slate-700">{t}</span>
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );

  // Sextanten-Header (proportional zu den Zahnzahlen)
  const renderSextantHeader = (sextants, labels) => (
    <div className="flex items-center gap-1">
      {Object.entries(sextants).map(([sextKey, teeth], idx) => (
        <React.Fragment key={sextKey}>
          {idx > 0 && <div className="w-0.5" />}
          <div className="flex-1 text-center bg-slate-100 border border-slate-300 py-1 rounded"
               style={{ flex: teeth.length }}>
            <span className="text-[10px] font-mono font-bold text-slate-700 tracking-wide">
              {labels[sextKey]}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );

  const SurfaceLabel = ({ children }) => (
    <div className="text-[10px] tracking-widest text-slate-600 font-mono font-bold w-24 text-right pr-2">
      {children}
    </div>
  );

  const KieferLabel = ({ children }) => (
    <div className="w-24 text-right pr-2">
      <span className="text-[11px] font-bold text-cyan-700">{children}</span>
    </div>
  );

  return (
    <div className="space-y-1.5">
      {/* === OBERKIEFER === */}

      {/* Sextanten-Header oben */}
      <div className="flex items-center gap-1">
        <div className="w-24"></div>
        <div className="flex-1">
          {renderSextantHeader(SEXTANT_UPPER, { S1: 'Sextant 1', S2: 'Sextant 2', S3: 'Sextant 3' })}
        </div>
      </div>

      {/* OK Flächen-Zeilen */}
      <div className="flex items-center gap-1">
        <SurfaceLabel>bukkal</SurfaceLabel>
        <div className="flex-1">{renderSurfaceRow(SEXTANT_UPPER, 'buccal')}</div>
      </div>
      <div className="flex items-center gap-1">
        <SurfaceLabel>okklusal/inzisal</SurfaceLabel>
        <div className="flex-1">{renderSurfaceRow(SEXTANT_UPPER, 'occlusal')}</div>
      </div>
      <div className="flex items-center gap-1">
        <SurfaceLabel>palatinal</SurfaceLabel>
        <div className="flex-1">{renderSurfaceRow(SEXTANT_UPPER, 'palatal')}</div>
      </div>

      {/* OK Zahnnummern */}
      <div className="flex items-center gap-1 pt-1">
        <KieferLabel>Oberkiefer</KieferLabel>
        <div className="flex-1">{renderToothNumbers(SEXTANT_UPPER)}</div>
      </div>

      {/* Trennlinie zwischen OK und UK */}
      <div className="border-t-2 border-slate-400 my-2"></div>

      {/* UK Zahnnummern */}
      <div className="flex items-center gap-1">
        <KieferLabel>Unterkiefer</KieferLabel>
        <div className="flex-1">{renderToothNumbers(SEXTANT_LOWER)}</div>
      </div>

      {/* UK Flächen-Zeilen */}
      <div className="flex items-center gap-1">
        <SurfaceLabel>lingual</SurfaceLabel>
        <div className="flex-1">{renderSurfaceRow(SEXTANT_LOWER, 'palatal')}</div>
      </div>
      <div className="flex items-center gap-1">
        <SurfaceLabel>okklusal/inzisal</SurfaceLabel>
        <div className="flex-1">{renderSurfaceRow(SEXTANT_LOWER, 'occlusal')}</div>
      </div>
      <div className="flex items-center gap-1">
        <SurfaceLabel>bukkal</SurfaceLabel>
        <div className="flex-1">{renderSurfaceRow(SEXTANT_LOWER, 'buccal')}</div>
      </div>

      {/* Sextanten-Header unten */}
      <div className="flex items-center gap-1 pt-1">
        <div className="w-24"></div>
        <div className="flex-1">
          {renderSextantHeader(SEXTANT_LOWER, { S6: 'Sextant 6', S5: 'Sextant 5', S4: 'Sextant 4' })}
        </div>
      </div>
    </div>
  );
}

// ─── SYMPTOM-LISTE mit Summen-Box ──────────────────────────────
function SymptomContainer({ items, form, recentField }) {
  const positiveCount = items.filter(i => form[i.key] === true).length;
  const recentInThis = items.some(i => i.key === recentField);

  return (
    <div>
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
      <div className="flex justify-end">
        <SummaryBox count={positiveCount} total={items.length} recentlyChanged={recentInThis} />
      </div>
    </div>
  );
}

// ─── Patientenkopf-Feld ────────────────────────────────────────
function PatientField({ label, value, hot }) {
  return (
    <div className={`bg-slate-50 rounded-md p-2 border ${hot ? 'border-cyan-400 animate-flash' : 'border-slate-200'}`}>
      <div className="text-[9px] tracking-widest text-slate-600 font-mono font-bold uppercase mb-0.5">{label}</div>
      <div className={`text-sm font-medium ${value ? 'text-slate-900' : 'text-slate-400 italic'}`}>
        {value || 'noch nicht erfasst'}
      </div>
    </div>
  );
}

// ─── Auto-Auswertung (TWES 2.0 Logik) ──────────────────────────
function evaluateStatus(form) {
  // Höchster Verschleiß-Grad pro Zahn
  const allTeeth = [...TEETH_UPPER, ...TEETH_LOWER];
  const toothMaxGrade = {};
  let highestGrade = 0;
  allTeeth.forEach(t => {
    if (form[`tooth_${t}_missing`] === true) return;
    const grades = [
      form[`tooth_${t}_buccal`],
      form[`tooth_${t}_occlusal`],
      form[`tooth_${t}_palatal`],
    ].filter(v => v !== null && v !== undefined);
    if (grades.length > 0) {
      const max = Math.max(...grades);
      toothMaxGrade[t] = max;
      if (max > highestGrade) highestGrade = max;
    }
  });

  // Generalisierung: Sextanten mit Grad ≥ 3 (erheblich)
  const sextantsWithSevere = new Set();
  allTeeth.forEach(t => {
    const max = toothMaxGrade[t];
    if (max !== undefined && max >= 3) {
      // Sextant bestimmen
      let sextant;
      if (t >= 14 && t <= 18) sextant = 1;
      else if ((t >= 11 && t <= 13) || (t >= 21 && t <= 23)) sextant = 2;
      else if (t >= 24 && t <= 28) sextant = 3;
      else if (t >= 34 && t <= 38) sextant = 4;
      else if ((t >= 31 && t <= 33) || (t >= 41 && t <= 43)) sextant = 5;
      else if (t >= 44 && t <= 48) sextant = 6;
      if (sextant) sextantsWithSevere.add(sextant);
    }
  });

  const distribution = sextantsWithSevere.size >= 3 ? 'generalisiert' :
                       sextantsWithSevere.size > 0 ? 'lokalisiert' : null;

  // Pathologie-Auswertung
  const pathologyCount = PATHOLOGY_ITEMS.filter(i => form[i.key] === true).length;
  const isPathological = highestGrade >= 2 && pathologyCount >= 1;

  // Ätiologie-Auswertung
  const chemCount = CHEMICAL_ITEMS.filter(i => form[i.key] === true).length;
  const mechCount = MECHANICAL_ITEMS.filter(i => form[i.key] === true).length;
  const chemMajority = chemCount >= 5;
  const mechMajority = mechCount >= 5;

  let etiology;
  if (chemMajority && mechMajority) etiology = 'beide gleichermaßen';
  else if (chemMajority && !mechMajority) etiology = 'überwiegend chemisch';
  else if (!chemMajority && mechMajority) etiology = 'überwiegend mechanisch';
  else if (chemCount > 0 && mechCount > 0) etiology = 'beide teilweise';
  else if (chemCount > 0) etiology = 'teilweise chemisch';
  else if (mechCount > 0) etiology = 'teilweise mechanisch';
  else etiology = null;

  return {
    highestGrade,
    distribution,
    pathologyCount,
    isPathological,
    chemCount,
    mechCount,
    etiology,
  };
}

function AutoEvaluation({ form }) {
  const ev = evaluateStatus(form);
  const gradeNames = ['kein', 'mild', 'moderat', 'erheblich', 'extrem'];

  const hasAnyData = ev.highestGrade > 0 || ev.pathologyCount > 0 || ev.chemCount > 0 || ev.mechCount > 0;

  if (!hasAnyData) {
    return (
      <div className="text-sm text-slate-500 italic text-center py-2">
        Auswertung erscheint sobald Befunde erfasst werden
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="bg-slate-50 rounded-md p-2 border border-slate-200">
          <div className="text-[9px] tracking-widest text-slate-600 font-mono font-bold mb-0.5">HÖCHSTER GRAD</div>
          <div className="text-sm font-bold text-slate-900">
            {ev.highestGrade} <span className="text-xs text-slate-600 font-normal">({gradeNames[ev.highestGrade]})</span>
          </div>
        </div>
        <div className="bg-slate-50 rounded-md p-2 border border-slate-200">
          <div className="text-[9px] tracking-widest text-slate-600 font-mono font-bold mb-0.5">VERTEILUNG</div>
          <div className="text-sm font-bold text-slate-900">
            {ev.distribution || <span className="text-slate-400 font-normal italic text-xs">–</span>}
          </div>
        </div>
        <div className={`rounded-md p-2 border ${ev.isPathological ? 'bg-rose-50 border-rose-300' : 'bg-emerald-50 border-emerald-300'}`}>
          <div className="text-[9px] tracking-widest text-slate-600 font-mono font-bold mb-0.5">PATHOLOGIE</div>
          <div className={`text-sm font-bold ${ev.isPathological ? 'text-rose-800' : 'text-emerald-800'}`}>
            {ev.isPathological ? 'pathologisch' : 'nicht-pathologisch'}
          </div>
        </div>
        <div className="bg-slate-50 rounded-md p-2 border border-slate-200">
          <div className="text-[9px] tracking-widest text-slate-600 font-mono font-bold mb-0.5">ÄTIOLOGIE</div>
          <div className="text-sm font-bold text-slate-900">
            {ev.etiology || <span className="text-slate-400 font-normal italic text-xs">–</span>}
          </div>
        </div>
      </div>
      <div className="text-[10px] font-mono text-slate-500 leading-relaxed">
        Logik: Höchster Wert pro Zahn → höchster Gesamtgrad. Generalisierung wenn ≥ 3 Sextanten Grad ≥ 3.
        Pathologisch wenn Grad ≥ 2 UND ≥ 1 Pathologie-Item. Ätiologie über 50%-Schwelle pro Container.
      </div>
    </div>
  );
}

// ─── HAUPT-VIEW ────────────────────────────────────────────────
export function View({ state, recentField }) {
  const form = state || {};
  const isHot = (f) => recentField === f;

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

      {/* PATIENTENKOPF */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-4">
        <div className="text-[10px] tracking-widest text-cyan-700 font-mono font-bold mb-3">PATIENTENDATEN</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <PatientField label="Patientennummer" value={form.patient_number} hot={isHot('patient_number')} />
          <PatientField label="Name, Vorname" value={form.patient_name} hot={isHot('patient_name')} />
          <PatientField label="Geburtsdatum" value={form.birth_date} hot={isHot('birth_date')} />
          <PatientField label="Untersuchungsdatum" value={form.examination_date} hot={isHot('examination_date')} />
        </div>
      </div>

      {/* SEKTION 1: VERSCHLEISSGRADE */}
      <SectionCard num="1" title="Verschleißgrade" subtitle="Pro Zahn und Fläche · TWES 2.0 Skala 0–4"
        recentField={recentField} fields={['tooth_']}>
        <ToothTable form={form} recentField={recentField} />
      </SectionCard>

      {/* SEKTION 2: PATHOLOGIE */}
      <SectionCard num="2" title="Anzeichen pathologischen Zahnverschleiß"
        subtitle="10 Indikatoren — bestimmen die Pathologie-Bewertung"
        recentField={recentField} fields={['pat_']}>
        <SymptomContainer items={PATHOLOGY_ITEMS} form={form} recentField={recentField} />
      </SectionCard>

      {/* SEKTION 3 + 4: ÄTIOLOGIE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard num="3" title="Chemische Faktoren"
          subtitle="≥ 5 von 10 = überwiegend chemisch"
          recentField={recentField} fields={['chem_']}>
          <SymptomContainer items={CHEMICAL_ITEMS} form={form} recentField={recentField} />
        </SectionCard>

        <SectionCard num="4" title="Mechanische Faktoren"
          subtitle="≥ 5 von 10 = überwiegend mechanisch"
          recentField={recentField} fields={['mech_']}>
          <SymptomContainer items={MECHANICAL_ITEMS} form={form} recentField={recentField} />
        </SectionCard>
      </div>

      {/* AUTO-AUSWERTUNG */}
      <SectionCard num="5" title="Auswertung" subtitle="Automatische TWES-2.0-Logik"
        recentField={recentField} fields={['pat_', 'chem_', 'mech_', 'tooth_']}>
        <AutoEvaluation form={form} />
      </SectionCard>

      {/* DIAGNOSE */}
      <SectionCard num="6" title="Diagnose"
        subtitle="Vier Bausteine: generalisierter Grad · lokalisierter Grad · Pathologie · Ätiologie"
        recentField={recentField} fields={['diagnosis']}>
        <div className={`min-h-[100px] p-3 rounded-md border-2 ${recentField === 'diagnosis' ? 'border-cyan-400 bg-cyan-50 animate-flash' : 'border-slate-200 bg-slate-50'}`}>
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

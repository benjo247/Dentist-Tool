// ═══════════════════════════════════════════════════════════════════
// Zahnverschleiß-Status — STUB (TWES 2.0 vollständig)
// ═══════════════════════════════════════════════════════════════════
'use client';
import React from 'react';
import { Construction } from 'lucide-react';

export const META = {
  label: 'Zahnverschleiß-Status',
  shortLabel: 'TW-Status',
  description: 'Differenzierte Erfassung pro Zahnfläche nach TWES 2.0',
  status: 'wip',
  fieldCount: '~256',
  duration: '~30 min',
  copyright: '© 2025 DGFDT, basierend auf TWES 2.0',
  source: 'DGFDT — Deutsche Gesellschaft für Funktionsdiagnostik und -therapie',
  sourceUrl: 'https://www.dgfdt.de/richtlinien_formulare',
  formTitle: 'Zahnverschleiß-Status',
  formSubtitle: 'Befundbogen der DGFDT (in Vorbereitung)',
};

export function getInitial() { return {}; }
export function getPrompt() {
  return 'Dieser Bogen ist noch nicht implementiert.';
}

export function View() {
  return (
    <div className="max-w-2xl mx-auto p-12 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-200 mb-6">
        <Construction className="w-10 h-10 text-amber-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-3">Zahnverschleiß-Status</h2>
      <p className="text-slate-600 mb-2">In Arbeit — fachliche Vollständigkeit folgt.</p>
      <p className="text-sm text-slate-500">
        TWES 2.0 vollständig pro Zahn pro Fläche. Etwa 256 Felder. Implementierung in der nächsten Iteration.
      </p>
      <div className="mt-6 inline-flex items-center gap-2 text-xs font-mono text-amber-700 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
        WORK IN PROGRESS
      </div>
    </div>
  );
}

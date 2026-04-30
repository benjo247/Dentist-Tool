'use client';
import React from 'react';
import {
  Home, TrendingUp, Settings, HelpCircle, FileText, Mic,
  Activity, Users, Clock, Plus, ChevronRight
} from 'lucide-react';
import { DEMO_PATIENTS, getAllExaminations } from '../data/demo-patients';
import { listForms, getForm } from '../forms/registry';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// ═══════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════
export function DashboardView({ onNavigate, onSelectExamination }) {
  const recentExams = getAllExaminations().slice(0, 6);
  const totalExams = getAllExaminations().length;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Willkommen</h1>
        <p className="text-sm text-slate-600">VoxDent · Sprachgestützte Befunderfassung</p>
      </div>

      {/* Stats-Karten */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border-2 border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-[10px] tracking-widest text-slate-600 font-mono font-bold uppercase">
            <Users className="w-3 h-3" /> Patienten
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{DEMO_PATIENTS.length}</div>
          <div className="text-xs text-slate-500 mt-1">in der Demo</div>
        </div>
        <div className="bg-white border-2 border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-[10px] tracking-widest text-slate-600 font-mono font-bold uppercase">
            <Activity className="w-3 h-3" /> Befunde
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{totalExams}</div>
          <div className="text-xs text-slate-500 mt-1">erfasst</div>
        </div>
        <div className="bg-white border-2 border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-[10px] tracking-widest text-slate-600 font-mono font-bold uppercase">
            <FileText className="w-3 h-3" /> Bögen verfügbar
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{listForms().filter(f => f.status === 'ready').length}</div>
          <div className="text-xs text-slate-500 mt-1">+ {listForms().filter(f => f.status === 'wip').length} in Arbeit</div>
        </div>
      </div>

      {/* Schnellaktionen */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => onNavigate('forms')}
          className="bg-gradient-to-br from-cyan-600 to-cyan-700 text-white rounded-xl p-5 text-left hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <Plus className="w-6 h-6" />
            <ChevronRight className="w-5 h-5 opacity-70" />
          </div>
          <div className="text-lg font-bold">Neuen Befund starten</div>
          <div className="text-sm opacity-90 mt-1">Bogen wählen und mit Spracherkennung erfassen</div>
        </button>
        <button
          onClick={() => onNavigate('patients')}
          className="bg-white border-2 border-slate-200 rounded-xl p-5 text-left hover:border-cyan-400 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <Users className="w-6 h-6 text-slate-700" />
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-lg font-bold text-slate-900">Patient öffnen</div>
          <div className="text-sm text-slate-600 mt-1">Patientenakte, Verlauf und alte Befunde</div>
        </button>
      </div>

      {/* Letzte Untersuchungen */}
      <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold uppercase flex items-center gap-2">
            <Clock className="w-3 h-3" /> Letzte Befunde
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {recentExams.map(exam => {
            const form = getForm(exam.formId);
            return (
              <button
                key={exam.id}
                onClick={() => onSelectExamination(exam)}
                className="w-full text-left px-5 py-3 hover:bg-slate-50 flex items-center gap-3"
              >
                <FileText className="w-4 h-4 text-cyan-700 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-900">
                    {exam.patient.firstName} {exam.patient.lastName}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5 truncate">
                    {form?.label} · {exam.summary}
                  </div>
                </div>
                <div className="text-[10px] font-mono text-slate-500 flex-shrink-0">
                  {formatDate(exam.date)}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FORMS BIBLIOTHEK
// ═══════════════════════════════════════════════════════════════════
import { Stethoscope, Sparkles, ScanLine, Brain, Construction } from 'lucide-react';
const FORM_ICONS = {
  'cmd-screening': Stethoscope,
  'bsi': Sparkles,
  'zahnverschleiss-screening': ScanLine,
  'funktionsstatus': Brain,
  'zahnverschleiss-status': ScanLine,
  'manuelle-strukturanalyse': Activity,
};

export function FormsView({ currentFormId, onSelectForm }) {
  const forms = listForms();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Befundbögen</h1>
        <p className="text-sm text-slate-600">Bibliothek der verfügbaren DGFDT-Bögen</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {forms.map(f => {
          const FormIcon = FORM_ICONS[f.id] || FileText;
          const isWip = f.status === 'wip';
          const isActive = f.id === currentFormId;
          return (
            <button
              key={f.id}
              onClick={() => { if (!isWip) onSelectForm(f.id); }}
              disabled={isWip}
              className={`text-left p-5 rounded-xl border-2 transition-all ${
                isActive ? 'bg-cyan-50 border-cyan-400 shadow-md' :
                isWip ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed' :
                'bg-white border-slate-200 hover:border-cyan-400 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isActive ? 'bg-cyan-600' : isWip ? 'bg-slate-300' : 'bg-slate-200'
                }`}>
                  {isWip ? (
                    <Construction className="w-5 h-5 text-slate-600" />
                  ) : (
                    <FormIcon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-700'}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-base">{f.label}</h3>
                    {isWip && (
                      <span className="text-[9px] font-mono font-bold tracking-widest text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                        BALD
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{f.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-[10px] font-mono text-slate-500">
                    <span>{f.fieldCount} Felder</span>
                    {f.duration && <span>{f.duration}</span>}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// VERLAUF (Stub)
// ═══════════════════════════════════════════════════════════════════
export function HistoryView() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Verlauf</h1>
        <p className="text-sm text-slate-600">Verlaufsvergleich von Befunden über Zeit</p>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-xl p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-50 border-2 border-cyan-200 mb-4">
          <TrendingUp className="w-8 h-8 text-cyan-700" />
        </div>
        <h3 className="font-bold text-slate-900 text-lg mb-2">Verlaufsanalyse</h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Hier werden später Verlaufsdiagramme angezeigt — z.B. die Entwicklung der Mundöffnung
          eines Patienten über mehrere Befunde, Bruxismus-Trends, oder Erkennungsraten der Sprachsteuerung.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 text-xs font-mono text-amber-700 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200">
          <Construction className="w-3 h-3" />
          IN ENTWICKLUNG
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// EINSTELLUNGEN (Stub)
// ═══════════════════════════════════════════════════════════════════
export function SettingsView() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Einstellungen</h1>
        <p className="text-sm text-slate-600">Praxis, Behandler, Sprache und Konnektoren</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white border-2 border-slate-200 rounded-xl p-5">
          <h3 className="font-bold text-slate-900 mb-3">Praxis</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <label className="text-xs text-slate-600 block mb-1">Praxisname</label>
              <input type="text" defaultValue="Demo-Zahnarztpraxis" className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg" disabled />
            </div>
            <div>
              <label className="text-xs text-slate-600 block mb-1">Standort</label>
              <input type="text" defaultValue="Frankfurt am Main" className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg" disabled />
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-xl p-5">
          <h3 className="font-bold text-slate-900 mb-3">Sprach-Erfassung</h3>
          <div className="space-y-2 text-sm text-slate-700">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span>Spracherkennungs-Sprache</span>
              <span className="font-mono text-slate-900">Deutsch (DE-DE)</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span>LLM-Provider</span>
              <span className="font-mono text-slate-900">Anthropic Claude Sonnet 4</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Datenstandort</span>
              <span className="font-mono text-slate-900">EU (Frankfurt)</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
          <h3 className="font-bold text-amber-900 mb-2">Demo-Modus</h3>
          <p className="text-xs text-amber-900 leading-relaxed">
            Diese Demo-Version speichert keine Daten persistent. Alle Befunde gehen beim Schließen
            des Browser-Tabs verloren. In der produktiven Multi-Tenant-Version werden Daten
            verschlüsselt gespeichert.
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// HILFE
// ═══════════════════════════════════════════════════════════════════
export function HelpView() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Hilfe & Sprach-Tipps</h1>
        <p className="text-sm text-slate-600">So funktioniert die sprachgestützte Befunderfassung</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white border-2 border-slate-200 rounded-xl p-5">
          <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Mic className="w-5 h-5 text-cyan-700" />
            Wie spreche ich richtig?
          </h3>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>· <strong>Region zuerst, dann Wert:</strong> "Masseter links Schmerz" statt "Schmerz, der Masseter links"</li>
            <li>· <strong>Bei Zahlen die Einheit nennen:</strong> "Mundöffnung 38 Millimeter" — nicht "Mundöffnung 38"</li>
            <li>· <strong>VAS-Werte als Zahl angeben:</strong> "Schläfen Stärke 7" — nicht "ziemlich stark"</li>
            <li>· <strong>Korrekturen klar markieren:</strong> "Korrektur: Mundöffnung 42" überschreibt den vorherigen Wert</li>
          </ul>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-xl p-5">
          <h3 className="font-bold text-slate-900 mb-3">Bulk-Aussagen sparen Zeit</h3>
          <div className="text-sm text-slate-700 space-y-2 font-mono">
            <div className="bg-slate-50 px-3 py-2 rounded">
              "Alle Temporalis-Anteile beidseits unauffällig"
              <div className="text-[10px] text-slate-500 mt-0.5 not-italic font-sans">füllt 6 Felder gleichzeitig</div>
            </div>
            <div className="bg-slate-50 px-3 py-2 rounded">
              "Anamnese komplett ohne Befund"
              <div className="text-[10px] text-slate-500 mt-0.5 not-italic font-sans">setzt mehrere Anamnese-Felder auf NEIN</div>
            </div>
            <div className="bg-slate-50 px-3 py-2 rounded">
              "Schläfen beidseits Stärke 6"
              <div className="text-[10px] text-slate-500 mt-0.5 not-italic font-sans">setzt 4 Felder gleichzeitig</div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-xl p-5">
          <h3 className="font-bold text-slate-900 mb-3">Befehle</h3>
          <div className="text-sm text-slate-700 space-y-2">
            <div><code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-xs">"Reset"</code> oder <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-xs">"Zurücksetzen"</code> — Formular zurücksetzen</div>
            <div><code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-xs">"Pause"</code> — Sprach-Erfassung pausieren</div>
            <div><code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-xs">"Weiter"</code> — Sprach-Erfassung fortsetzen</div>
          </div>
        </div>
      </div>
    </div>
  );
}

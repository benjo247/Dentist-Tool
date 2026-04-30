'use client';
import React, { useState } from 'react';
import { Search, User, Calendar, FileText, ChevronRight, Plus, Activity } from 'lucide-react';
import { DEMO_PATIENTS, getPatient, getExaminationsByPatient } from '../data/demo-patients';
import { getForm } from '../forms/registry';

const COLOR_CLASSES = {
  cyan:    { bg: 'bg-cyan-100',    text: 'text-cyan-700',    border: 'border-cyan-300' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' },
  rose:    { bg: 'bg-rose-100',    text: 'text-rose-700',    border: 'border-rose-300' },
  amber:   { bg: 'bg-amber-100',   text: 'text-amber-700',   border: 'border-amber-300' },
  violet:  { bg: 'bg-violet-100',  text: 'text-violet-700',  border: 'border-violet-300' },
};

function age(birthDate) {
  const today = new Date();
  const bd = new Date(birthDate);
  let a = today.getFullYear() - bd.getFullYear();
  const m = today.getMonth() - bd.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) a--;
  return a;
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// ─── Patienten-Detail-Ansicht ─────────────────────────────────────
function PatientDetail({ patient, onBack, onSelectExamination, onNewExamination }) {
  const colors = COLOR_CLASSES[patient.color] || COLOR_CLASSES.cyan;
  const examinations = getExaminationsByPatient(patient.id);

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="text-sm text-cyan-700 hover:text-cyan-900 mb-4 font-medium">
        ← Zurück zur Patientenliste
      </button>

      {/* Patienten-Header */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className={`w-16 h-16 rounded-2xl ${colors.bg} ${colors.border} border-2 flex items-center justify-center font-bold text-2xl ${colors.text}`}>
            {patient.initials}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">
              {patient.firstName} {patient.lastName}
            </h1>
            <div className="text-sm text-slate-600 mt-1 flex items-center gap-4 flex-wrap">
              <span><strong>Geb.:</strong> {formatDate(patient.birthDate)} ({age(patient.birthDate)} J.)</span>
              <span><strong>Pat.-Nr.:</strong> <code className="font-mono">{patient.patientNumber}</code></span>
            </div>
            {patient.notes && (
              <div className="text-sm text-slate-700 mt-3 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 italic">
                {patient.notes}
              </div>
            )}
          </div>
          <button
            onClick={onNewExamination}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-lg shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" />
            Neuer Befund
          </button>
        </div>
      </div>

      {/* Untersuchungen */}
      <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50">
          <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold uppercase">
            Untersuchungen ({examinations.length})
          </div>
        </div>

        {examinations.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Activity className="w-10 h-10 mx-auto mb-2 text-slate-400" />
            <p className="text-sm">Noch keine Befunde erfasst</p>
            <p className="text-xs text-slate-400 mt-1">Klicke auf "Neuer Befund" um zu starten</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {examinations.map(exam => {
              const form = getForm(exam.formId);
              return (
                <button
                  key={exam.id}
                  onClick={() => onSelectExamination(exam)}
                  className="w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors flex items-start gap-3"
                >
                  <div className="flex-shrink-0 mt-1">
                    <FileText className="w-5 h-5 text-cyan-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{form?.label || exam.formId}</span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {formatDate(exam.date)}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">{exam.summary}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Patientenliste ────────────────────────────────────────────────
export function PatientsView({ onSelectPatient, onNewExaminationForPatient }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const filtered = DEMO_PATIENTS.filter(p => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return p.firstName.toLowerCase().includes(q)
        || p.lastName.toLowerCase().includes(q)
        || p.patientNumber.toLowerCase().includes(q);
  });

  if (selectedPatient) {
    return (
      <div className="p-6">
        <PatientDetail
          patient={selectedPatient}
          onBack={() => setSelectedPatient(null)}
          onSelectExamination={(exam) => onSelectPatient(selectedPatient, exam)}
          onNewExamination={() => onNewExaminationForPatient(selectedPatient)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Patienten</h1>
        <p className="text-sm text-slate-600">{DEMO_PATIENTS.length} Demo-Patienten · Befund-Übersicht und Verlaufsvergleich</p>
      </div>

      {/* Demo-Hinweis */}
      <div className="mb-6 px-4 py-3 bg-amber-50 border-2 border-amber-200 rounded-xl">
        <div className="text-xs text-amber-900">
          <strong>Demo-Modus:</strong> Diese Patienten sind fiktiv und dienen nur der Demonstration.
          In der produktiven Version werden Patientendaten verschlüsselt in Frankfurt (DSGVO-konform) gespeichert.
        </div>
      </div>

      {/* Suche */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Name oder Patientennummer suchen…"
          className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-slate-300 rounded-lg focus:border-cyan-600 focus:outline-none text-sm"
        />
      </div>

      {/* Liste */}
      <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            Keine Patienten gefunden
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map(p => {
              const colors = COLOR_CLASSES[p.color] || COLOR_CLASSES.cyan;
              const examCount = p.examinations?.length || 0;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatient(p)}
                  className="w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors flex items-center gap-4"
                >
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.border} border-2 flex items-center justify-center font-bold ${colors.text} flex-shrink-0`}>
                    {p.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900">
                      {p.firstName} {p.lastName}
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-3">
                      <span>Geb. {formatDate(p.birthDate)} · {age(p.birthDate)} J.</span>
                      <span className="font-mono text-slate-500">{p.patientNumber}</span>
                    </div>
                    {p.notes && (
                      <div className="text-xs text-slate-600 mt-1 italic truncate">{p.notes}</div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-slate-500">{examCount} Befund{examCount !== 1 ? 'e' : ''}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

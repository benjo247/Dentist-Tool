'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic, MicOff, RotateCcw, AlertTriangle, Activity, Volume2, ArrowLeft
} from 'lucide-react';
import { FORMS, getForm } from './forms/registry';
import { AppSidebar } from './components/app-sidebar';
import { FormSelector } from './components/form-selector';
import { FloatingDemoPanel } from './components/floating-demo-panel';
import { PatientsView } from './views/patients-view';
import { DashboardView, FormsView, HistoryView, SettingsView, HelpView } from './views/main-views';

// ═══════════════════════════════════════════════════════════════════
// AUDIO FEEDBACK
// ═══════════════════════════════════════════════════════════════════
function useAudioFeedback() {
  const ctxRef = useRef(null);
  return useCallback((freq = 880, dur = 0.08, vol = 0.04) => {
    if (typeof window === 'undefined') return;
    if (!ctxRef.current) {
      try { ctxRef.current = new (window.AudioContext || window.webkitAudioContext)(); }
      catch { return; }
    }
    const ctx = ctxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    osc.type = 'sine';
    gain.gain.value = vol;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.stop(ctx.currentTime + dur);
  }, []);
}

// ═══════════════════════════════════════════════════════════════════
// PARSE API
// ═══════════════════════════════════════════════════════════════════
async function parseUtterance(text, formId) {
  try {
    const response = await fetch('/api/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, formId }),
    });
    if (!response.ok) throw new Error('API error: ' + response.status);
    const data = await response.json();
    const txt = data.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('')
      .replace(/```json|```/g, '')
      .trim();
    return JSON.parse(txt);
  } catch (e) {
    console.error('Parse failed:', e);
    return { updates: [], commands: [], interpretation: 'Fehler bei der Verarbeitung' };
  }
}

// ═══════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════
export default function App() {
  // ROUTING
  const [route, setRoute] = useState('dashboard');  // dashboard | patients | forms | history | settings | help | exam
  const [activePatient, setActivePatient] = useState(null);

  // FORM STATE
  const [activeFormId, setActiveFormId] = useState('funktionsstatus');  // ⬅ Default Funktionsstatus
  const activeForm = getForm(activeFormId);

  const [formStates, setFormStates] = useState(() => {
    const initial = {};
    Object.keys(FORMS).forEach(id => { initial[id] = FORMS[id].getInitial(); });
    return initial;
  });
  const currentState = formStates[activeFormId];

  // VOICE / UI STATE
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [log, setLog] = useState([]);
  const [listening, setListening] = useState(false);
  const [active, setActive] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [recentField, setRecentField] = useState(null);
  const [demoText, setDemoText] = useState('');
  const [supportsSpeech, setSupportsSpeech] = useState(true);
  const recognitionRef = useRef(null);
  const interimRef = useRef('');
  const beep = useAudioFeedback();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSupportsSpeech(false); return; }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'de-DE';
    rec.onresult = (event) => {
      let interimText = '', finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interimText += r[0].transcript;
      }
      if (finalText) {
        setTranscript(finalText);
        setInterim('');
        interimRef.current = '';
        handleUtterance(finalText.trim());
      } else {
        setInterim(interimText);
        interimRef.current = interimText;
      }
    };
    rec.onend = () => {
      if (recognitionRef.current?._wantListen) {
        try { rec.start(); } catch (e) {}
      } else { setListening(false); }
    };
    rec.onerror = (e) => { if (e.error !== 'no-speech') console.warn('Speech error:', e.error); };
    recognitionRef.current = rec;
    return () => { try { rec.stop(); } catch {} };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUtterance = async (text) => {
    if (!text || !active) return;
    setProcessing(true);
    const result = await parseUtterance(text, activeFormId);
    setProcessing(false);

    if (result.commands?.includes('reset')) {
      setFormStates(s => ({ ...s, [activeFormId]: activeForm.getInitial() }));
      setLog(l => [{ text, interp: 'Reset durchgeführt', updates: [], ts: Date.now(), cmd: true }, ...l].slice(0, 20));
      beep(440, 0.1);
      return;
    }
    if (result.commands?.includes('pause')) { setActive(false); beep(330, 0.1); return; }
    if (result.commands?.includes('resume')) { setActive(true); beep(660, 0.1); return; }

    const updates = result.updates || [];
    if (updates.length > 0) {
      setFormStates(s => {
        const next = { ...s };
        const formCopy = { ...next[activeFormId] };
        updates.forEach(({ field, value }) => {
          if (field === 'auscultation_event') {
            formCopy.auscultation_events = [...(formCopy.auscultation_events || []), value];
          } else if (field === 'static_occlusion' || field === 'supply_chart') {
            formCopy[field] = { ...(formCopy[field] || {}), ...value };
          } else if (field === 'dynamic_occlusion') {
            const dyn = { ...(formCopy.dynamic_occlusion || {}) };
            Object.keys(value).forEach(k => { dyn[k] = { ...(dyn[k] || {}), ...value[k] }; });
            formCopy.dynamic_occlusion = dyn;
          } else {
            formCopy[field] = value;
            // Auto-Sync VAS ↔ Boolean
            const vasMatch = field.match(/^(pain_\w+)_vas_(left|right)$/);
            if (vasMatch && typeof value === 'number' && value > 0) {
              const boolField = `${vasMatch[1]}_${vasMatch[2]}`;
              if (formCopy[boolField] !== true) formCopy[boolField] = true;
            }
            const boolMatch = field.match(/^(pain_(?:head|temples|ear_jaw|neck|shoulder))_(left|right)$/);
            if (boolMatch && value === false) {
              const vasField = `${boolMatch[1]}_vas_${boolMatch[2]}`;
              formCopy[vasField] = null;
            }
          }
        });
        next[activeFormId] = formCopy;
        return next;
      });
      const lastField = updates[updates.length - 1].field;
      setRecentField(lastField);
      setTimeout(() => setRecentField(null), 1500);
      beep(880, 0.06);
    }

    const avgConf = updates.length > 0
      ? updates.reduce((s, u) => s + (u.confidence || 1), 0) / updates.length
      : 0;
    setLog(l => [{
      text,
      interp: result.interpretation || (updates.length === 0 ? 'kein Befund erkannt' : ''),
      updates, conf: avgConf, ts: Date.now(),
    }, ...l].slice(0, 20));
  };

  const toggleListen = () => {
    if (!supportsSpeech || !recognitionRef.current) return;
    const rec = recognitionRef.current;
    if (listening) {
      rec._wantListen = false;
      try { rec.stop(); } catch {}
      const remaining = interimRef.current.trim();
      if (remaining) { handleUtterance(remaining); setTranscript(remaining); setInterim(''); interimRef.current = ''; }
      setListening(false);
    } else {
      rec._wantListen = true;
      try { rec.start(); setListening(true); } catch (e) { console.warn(e); }
    }
  };

  const resetAll = () => {
    setFormStates(s => ({ ...s, [activeFormId]: activeForm.getInitial() }));
    setLog([]);
    setTranscript('');
    setInterim('');
    interimRef.current = '';
    beep(440, 0.1);
  };

  // Manueller Field-Update (von Editor-Komponenten gerufen)
  // Wendet dieselbe Auto-Sync-Logik an wie der Sprach-Parser
  const updateField = (field, value) => {
    setFormStates(s => {
      const next = { ...s };
      const formCopy = { ...next[activeFormId] };
      formCopy[field] = value;

      // Auto-Sync VAS ↔ Boolean (gleiche Logik wie im Sprach-Handler)
      const vasMatch = field.match(/^(pain_\w+)_vas_(left|right)$/);
      if (vasMatch && typeof value === 'number' && value > 0) {
        const boolField = `${vasMatch[1]}_${vasMatch[2]}`;
        if (formCopy[boolField] !== true) formCopy[boolField] = true;
      }
      const boolMatch = field.match(/^(pain_(?:head|temples|ear_jaw|neck|shoulder))_(left|right)$/);
      if (boolMatch && value === false) {
        const vasField = `${boolMatch[1]}_vas_${boolMatch[2]}`;
        formCopy[vasField] = null;
      }

      next[activeFormId] = formCopy;
      return next;
    });
    setRecentField(field);
    setTimeout(() => setRecentField(null), 1500);
    beep(660, 0.04, 0.02);  // dezenterer Beep für manuelle Edits
  };

  const submitDemo = () => {
    if (!demoText.trim()) return;
    handleUtterance(demoText.trim());
    setDemoText('');
  };

  // Form-Wechsel
  const switchForm = (formId) => {
    setActiveFormId(formId);
    setRoute('exam');
    setLog([]);
  };

  // Patient + Examination öffnen
  const openExamination = (patient, exam) => {
    if (exam) {
      // Snapshot in den aktuellen State laden
      setFormStates(s => ({
        ...s,
        [exam.formId]: { ...FORMS[exam.formId].getInitial(), ...exam.snapshot },
      }));
      setActiveFormId(exam.formId);
      setActivePatient(patient);
      setRoute('exam');
    }
  };

  const newExaminationForPatient = (patient) => {
    setActivePatient(patient);
    setActiveFormId('funktionsstatus');
    setFormStates(s => ({ ...s, funktionsstatus: FORMS.funktionsstatus.getInitial() }));
    setRoute('exam');
  };

  const demoUtterances = activeForm.DEMO_UTTERANCES || [];
  const ActiveView = activeForm.View;
  const HasAnatomy = !!activeForm.AnatomyView;
  const AnatomyComp = activeForm.AnatomyView;

  // ═════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-slate-100">
      <AppSidebar currentRoute={route} onNavigate={setRoute} />

      <div className="pl-16">
        {/* HEADER — abhängig von Route */}
        {route === 'exam' ? (
          <ExamHeader
            activeForm={activeForm}
            activeFormId={activeFormId}
            switchForm={switchForm}
            activePatient={activePatient}
            setActivePatient={setActivePatient}
            processing={processing}
            active={active}
            listening={listening}
            supportsSpeech={supportsSpeech}
            transcript={transcript}
            interim={interim}
            resetAll={resetAll}
            toggleListen={toggleListen}
            onBackToPatient={() => setRoute('patients')}
          />
        ) : (
          <SimpleHeader route={route} />
        )}

        {/* MAIN CONTENT */}
        <main>
          {route === 'dashboard' && (
            <DashboardView
              onNavigate={setRoute}
              onSelectExamination={(exam) => openExamination(exam.patient, exam)}
            />
          )}
          {route === 'patients' && (
            <PatientsView
              onSelectPatient={openExamination}
              onNewExaminationForPatient={newExaminationForPatient}
            />
          )}
          {route === 'forms' && (
            <FormsView
              currentFormId={activeFormId}
              onSelectForm={switchForm}
            />
          )}
          {route === 'history' && <HistoryView />}
          {route === 'settings' && <SettingsView />}
          {route === 'help' && <HelpView />}

          {route === 'exam' && (
            <div className={HasAnatomy
              ? "px-6 py-6 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 max-w-[1600px] mx-auto"
              : "px-6 py-6 max-w-[1200px] mx-auto"
            }>
              <div className="min-w-0">
                <ActiveView state={currentState} recentField={recentField} updateField={updateField} />
              </div>
              {HasAnatomy && (
                <aside className="block xl:sticky xl:top-32 xl:self-start">
                  <AnatomyComp state={currentState} recentField={recentField} />
                </aside>
              )}
            </div>
          )}
        </main>

        <footer className="px-6 py-6 text-center text-[11px] text-slate-500 max-w-[1200px] mx-auto">
          VoxDent · Sprachgestützte Befunderfassung · Befundbögen der DGFDT
        </footer>
      </div>

      {/* Floating Demo+Log Panel — nur in Exam-Ansicht */}
      {route === 'exam' && (
        <FloatingDemoPanel
          demoText={demoText}
          setDemoText={setDemoText}
          submitDemo={submitDemo}
          processing={processing}
          demoUtterances={demoUtterances}
          handleUtterance={handleUtterance}
          log={log}
          supportsSpeech={supportsSpeech}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// HEADER VARIANTEN
// ═══════════════════════════════════════════════════════════════════

function SimpleHeader({ route }) {
  const titles = {
    dashboard: 'Dashboard',
    patients: 'Patienten',
    forms: 'Befundbögen',
    history: 'Verlauf',
    settings: 'Einstellungen',
    help: 'Hilfe',
  };
  return (
    <header className="border-b-2 border-slate-300 bg-white sticky top-0 z-40 shadow-sm">
      <div className="px-6 py-4 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-cyan-600" />
        <div className="text-sm font-bold tracking-tight text-slate-900">
          VoxDent
        </div>
        <div className="text-slate-300">›</div>
        <div className="text-base font-bold text-slate-900">{titles[route] || ''}</div>
      </div>
    </header>
  );
}

function ExamHeader({
  activeForm, activeFormId, switchForm,
  activePatient, setActivePatient,
  processing, active, listening, supportsSpeech,
  transcript, interim, resetAll, toggleListen,
  onBackToPatient,
}) {
  return (
    <header className="border-b-2 border-slate-300 bg-white sticky top-0 z-40 shadow-sm">
      <div className="px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          {activePatient && (
            <button
              onClick={onBackToPatient}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700 flex-shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{activePatient.firstName} {activePatient.lastName}</span>
            </button>
          )}
          <FormSelector currentFormId={activeFormId} onChange={switchForm} />
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 font-mono text-xs font-bold transition-all ${
            processing ? 'border-cyan-500 bg-cyan-50 text-cyan-800'
            : !active ? 'border-amber-500 bg-amber-50 text-amber-900'
            : listening ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
            : 'border-slate-400 bg-slate-100 text-slate-700'
          }`}>
            {processing
              ? <><Activity className="w-3 h-3 animate-spin" /><span>parse</span></>
              : !active ? <><AlertTriangle className="w-3 h-3" /><span>pausiert</span></>
              : listening ? <><Activity className="w-3 h-3" /><span>aktiv</span></>
              : <><span className="w-2 h-2 rounded-full bg-slate-500" /><span>idle</span></>
            }
          </div>

          <button onClick={resetAll} className="p-2 rounded-lg border-2 border-slate-300 hover:border-slate-500 hover:bg-slate-100" title="Zurücksetzen">
            <RotateCcw className="w-4 h-4 text-slate-700" />
          </button>

          <button
            onClick={toggleListen}
            disabled={!supportsSpeech}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              listening
                ? 'bg-rose-600 text-white pulse-mic hover:bg-rose-700'
                : supportsSpeech
                  ? 'bg-cyan-700 text-white hover:bg-cyan-800 shadow-sm'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
            }`}
          >
            {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{listening ? 'Stop' : supportsSpeech ? 'Mikrofon' : 'n/a'}</span>
          </button>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50">
        <div className="px-6 py-2 flex items-center gap-3 min-h-[40px]">
          <Volume2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <div className="flex-1 font-mono text-sm">
            {transcript && <span className="text-slate-900 font-bold">{transcript}</span>}
            {interim && <span className="text-slate-600 italic"> {interim}</span>}
            {!transcript && !interim && (
              <span className="text-slate-600">
                {listening ? 'höre zu — sprich natürlich, Smalltalk wird gefiltert' : 'Mikrofon aus — Demo-Eingaben unten rechts'}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

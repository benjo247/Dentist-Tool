'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic, MicOff, RotateCcw, Check, AlertTriangle, Activity,
  Sparkles, Volume2, FileText
} from 'lucide-react';
import { FORMS, listForms, getForm } from './forms/registry';
import { FormSwitcher } from './components/form-switcher';

// ═══════════════════════════════════════════════════════════════════
//   AUDIO FEEDBACK
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
//   PARSE API CALL
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
//   MAIN APP
// ═══════════════════════════════════════════════════════════════════
export default function App() {
  // Form-Auswahl
  const [activeFormId, setActiveFormId] = useState('cmd-screening');
  const activeForm = getForm(activeFormId);

  // Form-State pro Form (so geht beim Wechsel nichts verloren)
  const [formStates, setFormStates] = useState(() => {
    const initial = {};
    Object.keys(FORMS).forEach(id => {
      initial[id] = FORMS[id].getInitial();
    });
    return initial;
  });
  const currentState = formStates[activeFormId];

  // Voice / UI State
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

  // ─── Speech Recognition Setup ──────────────────────────
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

  // ─── Utterance Handler ─────────────────────────────────
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
            // Spezialfall Funktionsstatus
            formCopy.auscultation_events = [...(formCopy.auscultation_events || []), value];
          } else if (field === 'static_occlusion' || field === 'supply_chart') {
            formCopy[field] = { ...(formCopy[field] || {}), ...value };
          } else if (field === 'dynamic_occlusion') {
            const dyn = { ...(formCopy.dynamic_occlusion || {}) };
            Object.keys(value).forEach(k => { dyn[k] = { ...(dyn[k] || {}), ...value[k] }; });
            formCopy.dynamic_occlusion = dyn;
          } else {
            formCopy[field] = value;
          }
        });
        next[activeFormId] = formCopy;
        return next;
      });
      // Highlight letztes Feld
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
      updates,
      conf: avgConf,
      ts: Date.now(),
    }, ...l].slice(0, 20));
  };

  // ─── Buttons ───────────────────────────────────────────
  const toggleListen = () => {
    if (!supportsSpeech || !recognitionRef.current) return;
    const rec = recognitionRef.current;
    if (listening) {
      rec._wantListen = false;
      try { rec.stop(); } catch {}
      // Letzten Interim-Text noch verarbeiten
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

  const submitDemo = () => {
    if (!demoText.trim()) return;
    handleUtterance(demoText.trim());
    setDemoText('');
  };

  // Demo-Sätze des aktiven Formulars (falls vorhanden)
  const demoUtterances = activeForm.DEMO_UTTERANCES || [];

  // ═══════════════════════════════════════════════════════
  //   RENDER
  // ═══════════════════════════════════════════════════════
  const ActiveView = activeForm.View;

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ═══════════ HEADER ═══════════ */}
      <header className="border-b-2 border-slate-300 bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-600 scan-pulse" />
              <div className="text-sm font-bold tracking-tight text-slate-900">VoxDent</div>
              <div className="text-[10px] tracking-widest text-slate-500 font-mono uppercase">Sprach-Erfassung</div>
            </div>
            <FormSwitcher currentFormId={activeFormId} onChange={setActiveFormId} />
          </div>

          <div className="flex items-center gap-3">
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
              <span>{listening ? 'Stop' : supportsSpeech ? 'Mikrofon' : 'nicht verfügbar'}</span>
            </button>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50">
          <div className="max-w-[1400px] mx-auto px-6 py-2.5 flex items-center gap-3 min-h-[44px]">
            <Volume2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <div className="flex-1 font-mono text-sm">
              {transcript && <span className="text-slate-900 font-bold">{transcript}</span>}
              {interim && <span className="text-slate-600 italic"> {interim}</span>}
              {!transcript && !interim && (
                <span className="text-slate-600">
                  {listening ? 'höre zu — sprich natürlich, Smalltalk wird gefiltert' : 'Mikrofon aus — oder Beispiele rechts testen'}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

        {/* Form-spezifische View */}
        <div>
          <ActiveView state={currentState} recentField={recentField} />
        </div>

        {/* Generische Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-32 self-start">
          {/* Form-Info Card */}
          <div className="rounded-xl border-2 border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-3.5 h-3.5 text-cyan-700" />
              <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold uppercase">Aktiver Bogen</div>
            </div>
            <div className="text-sm font-bold text-slate-900 mb-1">{activeForm.formTitle}</div>
            <div className="text-xs text-slate-600 leading-snug">{activeForm.formSubtitle}</div>
            <div className="mt-3 pt-3 border-t border-slate-200 text-[10px] text-slate-500 leading-relaxed">
              <div>{activeForm.copyright}</div>
              <div className="mt-1 text-slate-400">{activeForm.source}</div>
            </div>
          </div>

          {/* Test-Eingabe */}
          <div className="rounded-xl border-2 border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-700" />
              <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold uppercase">Test-Eingabe</div>
            </div>
            {!supportsSpeech && (
              <div className="mb-3 px-3 py-2 rounded-md bg-amber-50 border-2 border-amber-300 text-xs text-amber-900 font-medium">
                Browser unterstützt keine Spracherkennung. Nutze die Texteingabe.
              </div>
            )}
            <textarea
              value={demoText}
              onChange={e => setDemoText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitDemo(); } }}
              placeholder="Befund-Aussage eingeben…"
              rows={3}
              className="w-full bg-slate-50 border-2 border-slate-300 rounded-md px-3 py-2 text-sm font-mono text-slate-900 placeholder-slate-500 focus:outline-none focus:border-cyan-600 focus:bg-white resize-none"
            />
            <button
              onClick={submitDemo}
              disabled={!demoText.trim() || processing}
              className="mt-2 w-full py-2 rounded-md bg-cyan-700 text-white text-sm font-bold hover:bg-cyan-800 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm"
            >
              Verarbeiten
            </button>
            {demoUtterances.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold mb-2">BEISPIELE · KLICKEN</div>
                <div className="space-y-0.5 max-h-[300px] overflow-y-auto pr-1">
                  {demoUtterances.map((u, i) => (
                    <button
                      key={i}
                      onClick={() => { handleUtterance(u); }}
                      disabled={processing}
                      className="w-full text-left px-2.5 py-1.5 rounded text-xs text-slate-800 hover:text-slate-900 hover:bg-cyan-50 transition disabled:opacity-40 leading-snug"
                    >
                      <span className="text-cyan-700 font-bold mr-1.5">›</span>{u}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Parse-Log */}
          <div className="rounded-xl border-2 border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-3.5 h-3.5 text-slate-700" />
              <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold uppercase">Parse-Log</div>
            </div>
            {log.length === 0 ? (
              <div className="text-xs text-slate-500 py-4 text-center">noch keine Eingaben</div>
            ) : (
              <div className="space-y-2.5 max-h-[400px] overflow-y-auto">
                {log.map((entry) => (
                  <div key={entry.ts} className="pb-2.5 border-b border-slate-200 last:border-0">
                    <div className="flex items-start gap-2 mb-1">
                      {entry.cmd ? (
                        <Sparkles className="w-3.5 h-3.5 text-amber-700 mt-1 shrink-0" />
                      ) : entry.updates.length === 0 ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-slate-500 mt-1 shrink-0" />
                      ) : (
                        <Check className={`w-3.5 h-3.5 mt-1 shrink-0 ${
                          entry.conf > 0.85 ? 'text-emerald-700' : entry.conf > 0.6 ? 'text-amber-700' : 'text-rose-700'
                        }`} />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-mono text-slate-900 leading-relaxed font-semibold">{entry.text}</div>
                        <div className="text-[11px] text-slate-700 mt-0.5">
                          {entry.interp}
                          {entry.updates.length > 0 && (
                            <span className="text-slate-600"> · {entry.updates.length} Feld{entry.updates.length !== 1 ? 'er' : ''}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </main>

      <footer className="max-w-[1400px] mx-auto px-6 py-6 text-center text-[11px] text-slate-500">
        VoxDent · Sprachgestützte Befunderfassung · Befundbögen der DGFDT — verwendet gemäß Software-Lizenz der DGFDT
      </footer>
    </div>
  );
}

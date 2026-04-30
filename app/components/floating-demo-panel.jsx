'use client';
import React, { useState } from 'react';
import { MessageSquare, X, Sparkles, Activity, Check, AlertTriangle } from 'lucide-react';

export function FloatingDemoPanel({
  demoText, setDemoText, submitDemo, processing,
  demoUtterances, handleUtterance,
  log, supportsSpeech
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('demo');

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-30 group flex items-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-2xl transition-all hover:scale-105"
        aria-label="Demo & Log öffnen"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-sm font-bold">Demo & Log</span>
        {log.length > 0 && (
          <span className="bg-cyan-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {log.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-30 w-[380px] max-h-[80vh] bg-white border-2 border-slate-300 rounded-xl shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-slate-900 text-white">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm font-bold">Demo & Log</span>
        </div>
        <button onClick={() => setOpen(false)} className="p-1 hover:bg-slate-700 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        <button
          onClick={() => setTab('demo')}
          className={`flex-1 px-3 py-2 text-xs font-bold transition-colors ${
            tab === 'demo' ? 'bg-white text-cyan-700 border-b-2 border-cyan-600 -mb-px' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3 h-3 inline mr-1" /> Demo-Eingabe
        </button>
        <button
          onClick={() => setTab('log')}
          className={`flex-1 px-3 py-2 text-xs font-bold transition-colors ${
            tab === 'log' ? 'bg-white text-cyan-700 border-b-2 border-cyan-600 -mb-px' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-3 h-3 inline mr-1" /> Parse-Log {log.length > 0 && `(${log.length})`}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {tab === 'demo' && (
          <div className="space-y-3">
            {!supportsSpeech && (
              <div className="px-3 py-2 rounded-md bg-amber-50 border-2 border-amber-300 text-xs text-amber-900 font-medium">
                Browser unterstützt keine Spracherkennung. Nutze die Texteingabe.
              </div>
            )}
            <div>
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
            </div>
            {demoUtterances.length > 0 && (
              <div>
                <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold mb-2">BEISPIELE · KLICKEN</div>
                <div className="space-y-0.5">
                  {demoUtterances.map((u, i) => (
                    <button
                      key={i}
                      onClick={() => handleUtterance(u)}
                      disabled={processing}
                      className="w-full text-left px-2.5 py-1.5 rounded text-xs text-slate-800 hover:bg-cyan-50 disabled:opacity-40 leading-snug"
                    >
                      <span className="text-cyan-700 font-bold mr-1.5">›</span>{u}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'log' && (
          <div>
            {log.length === 0 ? (
              <div className="text-xs text-slate-500 py-8 text-center">noch keine Eingaben</div>
            ) : (
              <div className="space-y-2.5">
                {log.map(entry => (
                  <div key={entry.ts} className="pb-2.5 border-b border-slate-200 last:border-0">
                    <div className="flex items-start gap-2">
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
        )}
      </div>
    </div>
  );
}

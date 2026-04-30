'use client';
import React, { useState } from 'react';
import { ChevronDown, Stethoscope, Sparkles, ScanLine, Brain, Activity, Construction, CheckCircle2, FileText } from 'lucide-react';
import { listForms } from '../forms/registry';

const FORM_ICONS = {
  'cmd-screening': Stethoscope,
  'bsi': Sparkles,
  'zahnverschleiss-screening': ScanLine,
  'funktionsstatus': Brain,
  'zahnverschleiss-status': ScanLine,
  'manuelle-strukturanalyse': Activity,
};

export function FormSelector({ currentFormId, onChange }) {
  const [open, setOpen] = useState(false);
  const forms = listForms();
  const current = forms.find(f => f.id === currentFormId);
  const Icon = FORM_ICONS[currentFormId] || FileText;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 bg-white shadow-sm transition-all ${
          open ? 'border-cyan-500 ring-2 ring-cyan-200' : 'border-slate-300 hover:border-cyan-400'
        }`}
      >
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <div className="text-left min-w-0">
          <div className="text-[10px] tracking-widest text-cyan-700 font-mono font-bold uppercase">
            Aktiver Bogen
          </div>
          <div className="text-base font-bold text-slate-900 leading-tight">
            {current?.label || 'Bogen wählen…'}
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${open ? 'rotate-180' : ''} flex-shrink-0`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 left-0 w-[480px] max-h-[80vh] overflow-y-auto bg-white border-2 border-slate-200 rounded-xl shadow-2xl z-40">
            <div className="px-4 py-3 border-b-2 border-slate-200 bg-slate-50">
              <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold uppercase">
                Befundbögen wählen
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Alle Bögen sind offizielle DGFDT-Vorlagen
              </div>
            </div>
            <div className="p-2 space-y-1">
              {forms.map(f => {
                const FormIcon = FORM_ICONS[f.id] || FileText;
                const isActive = f.id === currentFormId;
                const isWip = f.status === 'wip';
                return (
                  <button
                    key={f.id}
                    onClick={() => { if (!isWip) { onChange(f.id); setOpen(false); } }}
                    disabled={isWip}
                    className={`w-full text-left px-3 py-3 rounded-lg transition-colors flex items-start gap-3 ${
                      isActive ? 'bg-cyan-50 border-2 border-cyan-300' :
                      isWip ? 'opacity-50 cursor-not-allowed' :
                      'hover:bg-slate-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        isActive ? 'bg-cyan-600' : isWip ? 'bg-slate-300' : 'bg-slate-200'
                      }`}>
                        {isWip ? (
                          <Construction className="w-4 h-4 text-slate-600" />
                        ) : (
                          <FormIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-700'}`} strokeWidth={2} />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-bold ${isActive ? 'text-cyan-900' : 'text-slate-900'}`}>
                          {f.label}
                        </span>
                        {isWip && (
                          <span className="text-[9px] font-mono font-bold tracking-widest text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                            BALD
                          </span>
                        )}
                        {isActive && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-700" />
                        )}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">{f.description}</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-1">
                        {f.fieldCount} Felder · {f.duration || '—'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

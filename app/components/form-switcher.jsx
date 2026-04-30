'use client';
import React, { useState } from 'react';
import { ChevronDown, FileText, Construction, CheckCircle2 } from 'lucide-react';
import { listForms } from '../forms/registry';

export function FormSwitcher({ currentFormId, onChange }) {
  const [open, setOpen] = useState(false);
  const forms = listForms();
  const current = forms.find(f => f.id === currentFormId);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md border-2 border-slate-300 bg-white hover:border-cyan-600 hover:bg-cyan-50 transition-colors text-left min-w-[260px]"
      >
        <FileText className="w-4 h-4 text-cyan-700 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[9px] tracking-widest text-slate-500 font-mono font-bold uppercase">Aktiver Bogen</div>
          <div className="text-sm font-bold text-slate-900 truncate">{current?.label || 'Wählen…'}</div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 left-0 w-[420px] max-h-[70vh] overflow-y-auto bg-white border-2 border-slate-200 rounded-xl shadow-2xl z-40">
            <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50">
              <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold uppercase">Befundbögen der DGFDT</div>
            </div>
            <div className="p-2 space-y-1">
              {forms.map(f => {
                const isActive = f.id === currentFormId;
                const isWip = f.status === 'wip';
                return (
                  <button
                    key={f.id}
                    onClick={() => { if (!isWip) { onChange(f.id); setOpen(false); } }}
                    disabled={isWip}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                      isActive ? 'bg-cyan-50 border-2 border-cyan-300' :
                      isWip ? 'opacity-50 cursor-not-allowed' :
                      'hover:bg-slate-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-0.5">
                        {isWip ? (
                          <Construction className="w-4 h-4 text-amber-600" />
                        ) : isActive ? (
                          <CheckCircle2 className="w-4 h-4 text-cyan-700" />
                        ) : (
                          <FileText className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${isActive ? 'text-cyan-900' : 'text-slate-900'}`}>
                            {f.label}
                          </span>
                          {isWip && (
                            <span className="text-[9px] font-mono font-bold tracking-widest text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">WIP</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">{f.description}</div>
                        <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-slate-500">
                          <span>{f.fieldCount} Felder</span>
                        </div>
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

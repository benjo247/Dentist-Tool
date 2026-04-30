'use client';
// ═══════════════════════════════════════════════════════════════════
// EDITABLE FIELDS — wiederverwendbare Editor-Komponenten
// Alle nehmen value + onChange + optional weitere Props
// Werden inline gerendert mit dezentem Klickbereich (Stift-Icon bei Hover)
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Check, X } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════
// HOVER-WRAPPER — gemeinsamer Klickbereich für alle Editor-Typen
// ═══════════════════════════════════════════════════════════════════
function ClickWrapper({ children, onClick, hot, className = '', minWidth }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative inline-flex items-center transition-colors hover:bg-cyan-50 rounded-md cursor-pointer ${hot ? 'animate-flash' : ''} ${className}`}
      style={minWidth ? { minWidth } : {}}
    >
      {children}
      <Pencil className="w-3 h-3 text-cyan-600 opacity-0 group-hover:opacity-70 ml-1 flex-shrink-0" />
    </button>
  );
}

// Popover-Layer
function Popover({ children, onClose, anchorRef }) {
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const popRef = useRef(null);

  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    }
  }, [anchorRef]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (popRef.current && !popRef.current.contains(e.target) &&
          anchorRef?.current && !anchorRef.current.contains(e.target)) {
        onClose();
      }
    }
    function handleEscape(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose, anchorRef]);

  return (
    <div
      ref={popRef}
      className="fixed z-50 bg-white border-2 border-cyan-400 rounded-lg shadow-xl p-2"
      style={{ top: pos.top, left: pos.left }}
    >
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 1. BOOLEAN-EDITOR (ja/nein/–)
// ═══════════════════════════════════════════════════════════════════
export function EditableBoolean({ value, onChange, hot, label }) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const display = value === true ? 'ja' : value === false ? 'nein' : '–';
  const cls = value === true ? 'bg-rose-100 text-rose-800 border-rose-300' :
              value === false ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
              'bg-slate-50 text-slate-400 border-slate-300 border-dashed';

  return (
    <>
      <span ref={anchorRef} className="inline-block">
        <ClickWrapper onClick={() => setOpen(true)} hot={hot}>
          <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${cls}`}>
            {display}
          </span>
        </ClickWrapper>
      </span>
      {open && (
        <Popover anchorRef={anchorRef} onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-1 min-w-[140px]">
            {label && <div className="text-[10px] tracking-widest font-mono font-bold text-slate-600 px-2 pb-1 border-b border-slate-200">{label}</div>}
            <button onClick={() => { onChange(true); setOpen(false); }}
              className={`px-3 py-1.5 rounded text-sm text-left font-medium hover:bg-rose-50 ${value === true ? 'bg-rose-100 text-rose-800' : 'text-slate-700'}`}>
              ja
            </button>
            <button onClick={() => { onChange(false); setOpen(false); }}
              className={`px-3 py-1.5 rounded text-sm text-left font-medium hover:bg-emerald-50 ${value === false ? 'bg-emerald-100 text-emerald-800' : 'text-slate-700'}`}>
              nein
            </button>
            <button onClick={() => { onChange(null); setOpen(false); }}
              className="px-3 py-1.5 rounded text-sm text-left font-medium hover:bg-slate-100 text-slate-500 border-t border-slate-200">
              löschen (nicht erfasst)
            </button>
          </div>
        </Popover>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 2. PALPATIONS-EDITOR (Skala 0/1/2)
// ═══════════════════════════════════════════════════════════════════
export function EditablePalpation({ value, onChange, hot, mini = false }) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const colors = {
    0: 'bg-emerald-100 text-emerald-800 border-emerald-400',
    1: 'bg-amber-100 text-amber-900 border-amber-400',
    2: 'bg-rose-100 text-rose-800 border-rose-400',
  };
  const empty = 'bg-slate-50 text-slate-400 border-slate-300 border-dashed';
  const cls = value === null || value === undefined ? empty : colors[value];

  return (
    <>
      <span ref={anchorRef} className="inline-block">
        <ClickWrapper onClick={() => setOpen(true)} hot={hot}>
          <span className={`${mini ? 'h-7 px-2 text-xs' : 'h-9 px-3 text-sm'} flex items-center justify-center rounded-md border-2 font-mono font-bold ${cls}`}>
            {value === null || value === undefined ? '–' : value}
          </span>
        </ClickWrapper>
      </span>
      {open && (
        <Popover anchorRef={anchorRef} onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-1 min-w-[180px]">
            <div className="text-[10px] tracking-widest font-mono font-bold text-slate-600 px-2 pb-1 border-b border-slate-200">PALPATION</div>
            {[
              [0, 'unauffällig', 'emerald'],
              [1, 'Missempfindung', 'amber'],
              [2, 'Schmerz', 'rose'],
            ].map(([v, label, color]) => (
              <button key={v} onClick={() => { onChange(v); setOpen(false); }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm text-left hover:bg-slate-50 ${value === v ? `bg-${color}-50 ring-1 ring-${color}-300` : ''}`}>
                <span className={`font-mono font-bold w-5 text-center bg-${color}-100 text-${color}-800 rounded`}>{v}</span>
                <span className="text-slate-700">{label}</span>
              </button>
            ))}
            <button onClick={() => { onChange(null); setOpen(false); }}
              className="px-3 py-1.5 rounded text-xs text-left font-medium hover:bg-slate-100 text-slate-500 border-t border-slate-200 mt-1">
              löschen
            </button>
          </div>
        </Popover>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 3. TWES-GRADE-EDITOR (Skala 0-4 für Zahnverschleiß)
// ═══════════════════════════════════════════════════════════════════
export function EditableGrade({ value, onChange, hot, missing, onToggleMissing }) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  if (missing) {
    return (
      <span ref={anchorRef} className="inline-block">
        <ClickWrapper onClick={() => setOpen(true)} hot={hot}>
          <span className="h-7 flex items-center justify-center rounded text-xs font-mono font-bold bg-slate-200 text-slate-600 border-2 border-slate-300 px-2">✕</span>
        </ClickWrapper>
        {open && (
          <Popover anchorRef={anchorRef} onClose={() => setOpen(false)}>
            <div className="flex flex-col gap-1 min-w-[140px]">
              <div className="text-[10px] tracking-widest font-mono font-bold text-slate-600 px-2 pb-1 border-b border-slate-200">ZAHN FEHLT</div>
              <button onClick={() => { onToggleMissing(); setOpen(false); }}
                className="px-3 py-1.5 rounded text-sm text-left font-medium hover:bg-slate-50 text-slate-700">
                Zahn ist da (Fehlend rückgängig)
              </button>
            </div>
          </Popover>
        )}
      </span>
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
    <>
      <span ref={anchorRef} className="inline-block w-full">
        <ClickWrapper onClick={() => setOpen(true)} hot={hot} className="w-full">
          <span className={`h-7 w-full flex items-center justify-center rounded text-xs font-mono font-bold border-2 ${cls}`}>
            {value === null || value === undefined ? '–' : value}
          </span>
        </ClickWrapper>
      </span>
      {open && (
        <Popover anchorRef={anchorRef} onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-1 min-w-[200px]">
            <div className="text-[10px] tracking-widest font-mono font-bold text-slate-600 px-2 pb-1 border-b border-slate-200">TWES 2.0 GRAD</div>
            {[
              [0, 'kein Verschleiß'],
              [1, 'mild — nur Schmelz'],
              [2, 'moderat — Dentin ≤ 1/3'],
              [3, 'erheblich — Dentin 1/3-2/3'],
              [4, 'extrem — Dentin > 2/3'],
            ].map(([v, label]) => (
              <button key={v} onClick={() => { onChange(v); setOpen(false); }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm text-left hover:bg-slate-50 ${value === v ? 'ring-1 ring-cyan-400 bg-cyan-50' : ''}`}>
                <span className={`font-mono font-bold w-5 text-center rounded text-xs ${
                  v === 0 ? 'bg-emerald-100 text-emerald-800' :
                  v === 1 ? 'bg-lime-100 text-lime-800' :
                  v === 2 ? 'bg-amber-100 text-amber-800' :
                  v === 3 ? 'bg-orange-100 text-orange-800' :
                  'bg-rose-100 text-rose-800'
                }`}>{v}</span>
                <span className="text-slate-700 text-xs">{label}</span>
              </button>
            ))}
            <button onClick={() => { onChange(null); setOpen(false); }}
              className="px-3 py-1.5 rounded text-xs text-left font-medium hover:bg-slate-100 text-slate-500 border-t border-slate-200 mt-1">
              löschen
            </button>
            {onToggleMissing && (
              <button onClick={() => { onToggleMissing(); setOpen(false); }}
                className="px-3 py-1.5 rounded text-xs text-left font-medium hover:bg-slate-100 text-slate-500">
                Zahn als fehlend markieren ✕
              </button>
            )}
          </div>
        </Popover>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 4. NUMBER-EDITOR (mm, frei wählbar)
// ═══════════════════════════════════════════════════════════════════
export function EditableNumber({ value, onChange, hot, unit = '', min = 0, max = 100, step = 1, big = false, label }) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value ?? '');
  const inputRef = useRef(null);

  useEffect(() => {
    setTempValue(value ?? '');
  }, [value]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [open]);

  const save = () => {
    const num = tempValue === '' ? null : Number(tempValue);
    if (tempValue === '' || (!isNaN(num) && num >= min && num <= max)) {
      onChange(num);
      setOpen(false);
    }
  };

  const empty = value === null || value === undefined;

  return (
    <>
      <span ref={anchorRef} className="inline-block">
        <ClickWrapper onClick={() => setOpen(true)} hot={hot}>
          <span className={`flex items-baseline gap-1 font-mono font-bold ${big ? 'text-2xl' : 'text-base'} ${empty ? 'text-slate-300' : 'text-slate-900'}`}>
            <span>{empty ? '––' : value}</span>
            {unit && <span className="text-xs text-slate-600 font-semibold">{unit}</span>}
          </span>
        </ClickWrapper>
      </span>
      {open && (
        <Popover anchorRef={anchorRef} onClose={() => { save(); }}>
          <div className="flex flex-col gap-2 min-w-[180px]">
            {label && <div className="text-[10px] tracking-widest font-mono font-bold text-slate-600 px-1">{label}</div>}
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="number"
                value={tempValue}
                min={min}
                max={max}
                step={step}
                onChange={e => setTempValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') save();
                  if (e.key === 'Escape') { setTempValue(value ?? ''); setOpen(false); }
                }}
                className="w-24 px-2 py-1.5 border-2 border-slate-300 rounded font-mono text-sm focus:border-cyan-500 focus:outline-none"
                placeholder="–"
              />
              {unit && <span className="text-sm text-slate-600 font-medium">{unit}</span>}
              <button onClick={save} className="p-1.5 rounded hover:bg-emerald-50 text-emerald-700">
                <Check className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              {min} – {max} {unit} · Enter zum Speichern
            </div>
            <button onClick={() => { onChange(null); setOpen(false); }}
              className="px-2 py-1 rounded text-xs text-slate-500 hover:bg-slate-100 text-left">
              löschen (nicht erfasst)
            </button>
          </div>
        </Popover>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 5. VAS-EDITOR (Schmerzskala 0-10 mit Farbverlauf)
// ═══════════════════════════════════════════════════════════════════
export function EditableVAS({ value, onChange, hot, label }) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const empty = value === null || value === undefined;
  const colorFor = (v) => {
    if (v === 0) return '#10b981';
    if (v <= 1) return '#22c55e';
    if (v <= 3) return '#84cc16';
    if (v <= 5) return '#f59e0b';
    if (v <= 7) return '#f97316';
    if (v <= 9) return '#ef4444';
    return '#991b1b';
  };

  return (
    <>
      <span ref={anchorRef} className="inline-block">
        <ClickWrapper onClick={() => setOpen(true)} hot={hot}>
          <span className={`h-9 px-3 flex items-center justify-center rounded-md border-2 font-mono font-bold text-sm ${
            empty ? 'bg-slate-50 text-slate-400 border-slate-300 border-dashed' : 'border-2'
          }`} style={empty ? {} : {
            backgroundColor: colorFor(value) + '33',
            borderColor: colorFor(value),
            color: colorFor(value),
          }}>
            {empty ? '–' : `${value}/10`}
          </span>
        </ClickWrapper>
      </span>
      {open && (
        <Popover anchorRef={anchorRef} onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-2 min-w-[280px]">
            {label && <div className="text-[10px] tracking-widest font-mono font-bold text-slate-600 px-1">{label}</div>}
            <div className="text-[10px] text-slate-500 font-mono">VAS 0 = kein Schmerz · 10 = maximaler Schmerz</div>
            <div className="grid grid-cols-11 gap-0.5">
              {[0,1,2,3,4,5,6,7,8,9,10].map(v => (
                <button
                  key={v}
                  onClick={() => { onChange(v); setOpen(false); }}
                  className={`h-9 rounded text-xs font-mono font-bold border transition-transform hover:scale-110 ${value === v ? 'ring-2 ring-cyan-500' : 'border-slate-200'}`}
                  style={{ backgroundColor: colorFor(v) + '40', color: colorFor(v) }}
                >
                  {v}
                </button>
              ))}
            </div>
            <button onClick={() => { onChange(null); setOpen(false); }}
              className="px-2 py-1 rounded text-xs text-slate-500 hover:bg-slate-100 text-left">
              löschen (nicht erfasst)
            </button>
          </div>
        </Popover>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 6. ENUM-EDITOR (feste Liste von Optionen)
// ═══════════════════════════════════════════════════════════════════
export function EditableEnum({ value, onChange, hot, options, label, displayLabels = {} }) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const empty = value === null || value === undefined;
  const displayValue = empty ? '–' : (displayLabels[value] || value);

  return (
    <>
      <span ref={anchorRef} className="inline-block">
        <ClickWrapper onClick={() => setOpen(true)} hot={hot}>
          <span className={`font-mono text-sm font-bold ${empty ? 'text-slate-400' : 'text-slate-900'}`}>
            {displayValue}
          </span>
        </ClickWrapper>
      </span>
      {open && (
        <Popover anchorRef={anchorRef} onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-1 min-w-[180px]">
            {label && <div className="text-[10px] tracking-widest font-mono font-bold text-slate-600 px-2 pb-1 border-b border-slate-200">{label}</div>}
            {options.map(opt => {
              const optValue = typeof opt === 'object' ? opt.value : opt;
              const optLabel = typeof opt === 'object' ? opt.label : (displayLabels[opt] || opt);
              return (
                <button
                  key={optValue}
                  onClick={() => { onChange(optValue); setOpen(false); }}
                  className={`px-3 py-1.5 rounded text-sm text-left font-medium hover:bg-cyan-50 ${value === optValue ? 'bg-cyan-100 text-cyan-900' : 'text-slate-700'}`}
                >
                  {optLabel}
                </button>
              );
            })}
            <button onClick={() => { onChange(null); setOpen(false); }}
              className="px-3 py-1.5 rounded text-xs text-left font-medium hover:bg-slate-100 text-slate-500 border-t border-slate-200">
              löschen
            </button>
          </div>
        </Popover>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 7. TEXT-EDITOR (Freitext, ein- oder mehrzeilig)
// ═══════════════════════════════════════════════════════════════════
export function EditableText({ value, onChange, hot, label, placeholder, lines = 1, big = false }) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value ?? '');
  const inputRef = useRef(null);

  useEffect(() => {
    setTempValue(value ?? '');
  }, [value]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select?.();
    }
  }, [open]);

  const save = () => {
    onChange(tempValue.trim() === '' ? null : tempValue.trim());
    setOpen(false);
  };

  const empty = !value;

  return (
    <>
      <span ref={anchorRef} className="inline-block w-full">
        <ClickWrapper onClick={() => setOpen(true)} hot={hot} className="w-full">
          <span className={`block w-full text-left ${big ? 'text-base' : 'text-sm'} ${empty ? 'text-slate-400 italic' : 'text-slate-900'}`}>
            {empty ? (placeholder || 'klicken zum Eintragen') : value}
          </span>
        </ClickWrapper>
      </span>
      {open && (
        <Popover anchorRef={anchorRef} onClose={save}>
          <div className="flex flex-col gap-2 min-w-[400px]">
            {label && <div className="text-[10px] tracking-widest font-mono font-bold text-slate-600 px-1">{label}</div>}
            {lines > 1 ? (
              <textarea
                ref={inputRef}
                value={tempValue}
                rows={lines}
                onChange={e => setTempValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) save();
                  if (e.key === 'Escape') { setTempValue(value ?? ''); setOpen(false); }
                }}
                className="w-full px-3 py-2 border-2 border-slate-300 rounded font-medium text-sm focus:border-cyan-500 focus:outline-none resize-y"
                placeholder={placeholder}
              />
            ) : (
              <input
                ref={inputRef}
                type="text"
                value={tempValue}
                onChange={e => setTempValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') save();
                  if (e.key === 'Escape') { setTempValue(value ?? ''); setOpen(false); }
                }}
                className="w-full px-3 py-2 border-2 border-slate-300 rounded font-medium text-sm focus:border-cyan-500 focus:outline-none"
                placeholder={placeholder}
              />
            )}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-500 font-mono">
                {lines > 1 ? 'Cmd/Ctrl+Enter speichert · Esc bricht ab' : 'Enter speichert · Esc bricht ab'}
              </span>
              <div className="flex gap-1">
                <button onClick={save} className="px-3 py-1 bg-cyan-600 text-white text-xs font-bold rounded hover:bg-cyan-700">
                  Speichern
                </button>
              </div>
            </div>
          </div>
        </Popover>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 8. CHECKBOX-EDITOR (für Checkbox-artige Booleans, klickbar = toggelt)
// Nutze ich für Symptom-Listen wo jedes Item als Checkbox gerendert wird
// ═══════════════════════════════════════════════════════════════════
export function EditableCheckbox({ value, onChange, hot, label }) {
  // Tri-State: null → true → false → null
  const handleClick = () => {
    if (value === null || value === undefined) onChange(true);
    else if (value === true) onChange(false);
    else onChange(null);
  };

  const filled = value === true;
  const explicitNo = value === false;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full flex items-start gap-2 py-1 px-1.5 rounded transition-colors hover:bg-cyan-50 cursor-pointer text-left ${hot ? 'animate-flash bg-cyan-50' : ''}`}
    >
      <span className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
        filled ? 'bg-cyan-600 border-cyan-700' :
        explicitNo ? 'bg-slate-200 border-slate-400' :
        'bg-white border-slate-300'
      }`}>
        {filled && <span className="text-white text-[10px] font-bold leading-none">✓</span>}
        {explicitNo && <span className="text-slate-500 text-[10px] font-bold leading-none">–</span>}
      </span>
      <span className={`text-xs leading-snug ${filled ? 'text-slate-900 font-medium' : 'text-slate-700'}`}>
        {label}
      </span>
    </button>
  );
}

'use client';
// ═══════════════════════════════════════════════════════════════════
// Funktionsstatus — UI Component
// Migration aus monolithischer page.js, fachlich identisch.
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { Check } from 'lucide-react';
import { TEETH_UPPER, TEETH_LOWER, MUSCLES, PAIN_REGIONS } from './form';

// ─── UI HELPERS ───────────────────────────────────────────────
function Pill({ value, mini = false }) {
  const colors = {
    0: 'bg-emerald-100 text-emerald-800 border-emerald-400',
    1: 'bg-amber-100 text-amber-900 border-amber-400',
    2: 'bg-rose-100 text-rose-800 border-rose-400',
  };
  const empty = 'bg-slate-50 text-slate-400 border-slate-300 border-dashed';
  const cls = value === null || value === undefined ? empty : colors[value];
  return (
    <div className={`${mini ? 'h-7 px-2 text-xs' : 'h-9 px-3 text-sm'} flex items-center justify-center rounded-md border-2 font-mono font-bold ${cls} transition-all duration-300`}>
      {value === null || value === undefined ? '–' : value}
    </div>
  );
}

function ValuePill({ value, unit, big = false }) {
  const empty = value === null || value === undefined;
  return (
    <div className={`flex items-baseline gap-1 font-mono font-bold ${big ? 'text-2xl' : 'text-base'} ${empty ? 'text-slate-300' : 'text-slate-900'}`}>
      <span>{empty ? '––' : value}</span>
      {unit && <span className="text-xs text-slate-600 font-semibold">{unit}</span>}
    </div>
  );
}

function YesNoIndicator({ value }) {
  if (value === null || value === undefined) return <span className="text-slate-400 font-mono text-sm">–</span>;
  return (
    <span className={`font-mono text-sm font-bold px-2 py-0.5 rounded ${value ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
      {value ? 'ja' : 'nein'}
    </span>
  );
}

function Checkbox({ value, label, hot }) {
  const checked = value === true;
  return (
    <div className={`flex items-center gap-2 py-1 px-1.5 rounded ${hot ? 'animate-flash' : ''}`}>
      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
        checked ? 'bg-cyan-700 border-cyan-700' : value === false ? 'border-slate-400 bg-white' : 'border-slate-300 bg-slate-50 border-dashed'
      }`}>
        {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </span>
      <span className={`text-sm ${checked ? 'text-slate-900 font-semibold' : value === false ? 'text-slate-500' : 'text-slate-400'}`}>{label}</span>
    </div>
  );
}

function FreitextField({ value, label, hot, lines = 2 }) {
  return (
    <div className={`${hot ? 'animate-flash' : ''} rounded-md`}>
      <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold mb-1">{label}</div>
      <div className={`px-3 py-2 rounded-md border-2 text-sm min-h-[${lines * 1.4}rem] ${
        value ? 'bg-cyan-50 border-cyan-300 text-slate-900' : 'bg-slate-50 border-slate-300 border-dashed text-slate-400 italic'
      }`} style={{ minHeight: `${lines * 1.6}rem` }}>
        {value || '— noch nicht erfasst —'}
      </div>
    </div>
  );
}

function ToothCell({ tooth, occlusion, hot }) {
  const data = occlusion?.[tooth] || {};
  const codeColor = (c) => {
    if (!c) return 'text-slate-300';
    if (c === '+') return 'text-emerald-700';
    if (c === '+-') return 'text-amber-700';
    if (c === '-') return 'text-rose-700';
    if (c === 'x') return 'text-slate-500';
    return 'text-slate-700';
  };
  const filled = data.zo || data.ho;
  return (
    <div className={`flex flex-col items-center justify-center w-10 h-14 rounded border-2 font-mono ${hot ? 'animate-flash' : ''} ${
      filled ? 'border-cyan-300 bg-cyan-50' : 'border-slate-200 bg-white'
    }`}>
      <div className={`text-[9px] font-bold ${codeColor(data.zo)}`}>{data.zo || '·'}</div>
      <div className="text-[10px] text-slate-700 font-bold leading-tight">{tooth}</div>
      <div className={`text-[9px] font-bold ${codeColor(data.ho)}`}>{data.ho || '·'}</div>
    </div>
  );
}

function SupplyToothCell({ tooth, supply, hot }) {
  const code = supply?.[tooth];
  const codeColor = (c) => {
    if (!c) return 'text-slate-300';
    if (c === 'f') return 'text-rose-700';
    if (c === 'F' || c === 'K' || c === 'T') return 'text-cyan-800';
    if (c === 'B' || c === 'H' || c === 'E') return 'text-emerald-800';
    return 'text-slate-700';
  };
  return (
    <div className={`flex flex-col items-center justify-center w-10 h-12 rounded border-2 font-mono ${hot ? 'animate-flash' : ''} ${
      code ? 'border-cyan-300 bg-cyan-50' : 'border-slate-200 bg-white'
    }`}>
      <div className="text-[10px] text-slate-700 font-bold leading-tight">{tooth}</div>
      <div className={`text-sm font-bold ${codeColor(code)}`}>{code || '·'}</div>
    </div>
  );
}

function SectionCard({ title, num, children, recentField, fields }) {
  const isHot = recentField && fields.some(f => recentField.startsWith(f));
  return (
    <div className={`rounded-xl border-2 bg-white transition-all duration-500 ${
      isHot ? 'border-cyan-500 shadow-[0_0_0_4px_rgba(8,145,178,0.15)]' : 'border-slate-200'
    }`}>
      <div className="flex items-baseline gap-3 px-5 pt-4 pb-3 border-b border-slate-200">
        <span className="text-xs font-mono text-cyan-700 font-bold tracking-widest">{num}</span>
        <h3 className="text-sm font-bold tracking-wide text-slate-900 uppercase">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function FieldRow({ label, children, hot }) {
  return (
    <div className={`flex items-center justify-between gap-3 py-1.5 px-1 ${hot ? 'animate-flash' : ''}`}>
      <span className="text-sm text-slate-700 font-medium">{label}</span>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

function SubLabel({ children }) {
  return <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold mb-2">{children}</div>;
}

// ─── MAIN VIEW ────────────────────────────────────────────────
export function View({ state: form, recentField }) {
  const isHot = (field) => recentField === field;

  return (
    <div className="max-w-[1400px] mx-auto p-6">
      <div className="space-y-4">

          {/* ═══════════ 01 ANAMNESE ═══════════ */}
          <SectionCard num="01" title="Anamnese · Vorgeschichte" recentField={recentField}
            fields={['visit_reason','recent_treatment','previous_function_therapy','head_neck_trauma']}>
            <FreitextField value={form.visit_reason} label="GRUND DES BESUCHES" hot={isHot('visit_reason')} />
            <div className="grid grid-cols-2 gap-x-6 mt-4">
              <div>
                <SubLabel>VORBEHANDLUNG BEI</SubLabel>
                <Checkbox value={form.recent_treatment_dentist} label="Zahnarzt" hot={isHot('recent_treatment_dentist')} />
                <Checkbox value={form.recent_treatment_orthodontist} label="Kieferorthopäde" hot={isHot('recent_treatment_orthodontist')} />
                <Checkbox value={form.recent_treatment_doctor} label="Arzt (allgemein)" hot={isHot('recent_treatment_doctor')} />
              </div>
              <div>
                <SubLabel>ANAMNESE</SubLabel>
                <Checkbox value={form.previous_function_therapy} label="Funktionstherapie bereits durchgeführt" hot={isHot('previous_function_therapy')} />
                <Checkbox value={form.head_neck_trauma} label="Unfall/Schlag im Kopf-/Halsbereich" hot={isHot('head_neck_trauma')} />
              </div>
            </div>
            {form.previous_function_therapy_type && (
              <div className="mt-3">
                <FreitextField value={form.previous_function_therapy_type} label="ART DER FUNKTIONSTHERAPIE" hot={isHot('previous_function_therapy_type')} lines={1} />
              </div>
            )}
          </SectionCard>

          {/* ═══════════ 02 SCHMERZEN ═══════════ */}
          <SectionCard num="02" title="Schmerz · Charakteristik & Lokalisation" recentField={recentField}
            fields={['pain_vas','pain_impact','pain_head','pain_temples','pain_ear_jaw','pain_neck','pain_shoulder','pain_quality','pain_time','pain_frequency','pain_duration','pain_radiating']}>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 mb-4">
              <FieldRow label="Schmerz (VAS)" hot={isHot('pain_vas')}>
                <ValuePill value={form.pain_vas} unit="/10" big />
              </FieldRow>
              <FieldRow label="Beeinträchtigung (VAS)" hot={isHot('pain_impact_vas')}>
                <ValuePill value={form.pain_impact_vas} unit="/10" big />
              </FieldRow>
            </div>

            <div className="border-t border-slate-200 pt-4 mt-2">
              <SubLabel>LOKALISATION (Schmerzen / Verspannungen)</SubLabel>
              <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 gap-y-1.5 items-center">
                <div></div>
                <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold text-center">LI</div>
                <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold text-center">RE</div>
                {PAIN_REGIONS.map(([key, label]) => (
                  <React.Fragment key={key}>
                    <div className={`text-sm text-slate-800 font-medium ${(isHot(`${key}_left`) || isHot(`${key}_right`)) ? 'animate-flash' : ''}`}>{label}</div>
                    <div className="flex justify-center"><YesNoIndicator value={form[`${key}_left`]} /></div>
                    <div className="flex justify-center"><YesNoIndicator value={form[`${key}_right`]} /></div>
                  </React.Fragment>
                ))}
              </div>
              {(form.pain_other || form.pain_other_location) && (
                <div className={`mt-2 text-sm text-slate-700 ${isHot('pain_other') ? 'animate-flash' : ''}`}>
                  Andere: <span className="font-semibold text-slate-900">{form.pain_other_location || 'ja'}</span>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 pt-4 mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
              <FreitextField value={form.pain_quality} label="QUALITÄT" hot={isHot('pain_quality')} lines={1} />
              <div>
                <SubLabel>ZEITPUNKT</SubLabel>
                <div className="flex flex-wrap gap-x-3">
                  <Checkbox value={form.pain_time_morning} label="morgens" hot={isHot('pain_time_morning')} />
                  <Checkbox value={form.pain_time_during_day} label="tagsüber" hot={isHot('pain_time_during_day')} />
                  <Checkbox value={form.pain_time_evening} label="abends" hot={isHot('pain_time_evening')} />
                  <Checkbox value={form.pain_time_specific_occasion} label="best. Anlass" hot={isHot('pain_time_specific_occasion')} />
                </div>
              </div>
              <FieldRow label="Dauer (Min/Std)" hot={isHot('pain_duration_minutes') || isHot('pain_duration_hours')}>
                <ValuePill value={form.pain_duration_minutes} unit="min" />
                <span className="text-slate-400">·</span>
                <ValuePill value={form.pain_duration_hours} unit="h" />
              </FieldRow>
              <FieldRow label="Häufigkeit" hot={isHot('pain_frequency')}>
                <span className="font-mono text-sm font-bold text-slate-900">
                  {form.pain_frequency === 'daily' ? 'täglich' :
                   form.pain_frequency === 'weekly_1_2' ? '1–2×/Woche' :
                   form.pain_frequency === 'monthly_1_2' ? '1–2×/Monat' :
                   form.pain_frequency === 'seldom' ? 'seltener' : <span className="text-slate-400">–</span>}
                </span>
              </FieldRow>
              <FieldRow label="Ausstrahlend" hot={isHot('pain_radiating')}>
                <YesNoIndicator value={form.pain_radiating} />
              </FieldRow>
              <FieldRow label="Erstmals" hot={isHot('complaints_first_appeared')}>
                <span className="font-mono text-xs text-slate-900 font-semibold">{form.complaints_first_appeared || <span className="text-slate-400">–</span>}</span>
              </FieldRow>
            </div>

            {(form.pain_radiating_location) && (
              <div className="mt-2"><FreitextField value={form.pain_radiating_location} label="AUSSTRAHLUNG" hot={isHot('pain_radiating_location')} lines={1} /></div>
            )}
          </SectionCard>

          {/* ═══════════ 03 FUNKTIONELLE ANAMNESE ═══════════ */}
          <SectionCard num="03" title="Funktionelle Anamnese" recentField={recentField}
            fields={['chewing','jaw_opening','jaw_closing','jaw_other_movement','joint_sounds','teeth_painful','teeth_fit_correctly','numbness']}>
            <SubLabel>UNTERKIEFERBEWEGUNGEN — behindert (1) oder schmerzhaft (2)?</SubLabel>
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 gap-y-1.5 items-center">
              <div></div>
              <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold text-center">behindert</div>
              <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold text-center">schmerzh.</div>
              {[
                ['chewing', 'Kauen'],
                ['jaw_opening', 'Kieferöffnung'],
                ['jaw_closing', 'Kieferschluss'],
                ['jaw_other_movement', 'Andere UK-Bewegung'],
              ].map(([key, label]) => (
                <React.Fragment key={key}>
                  <div className="text-sm text-slate-800 font-medium">{label}</div>
                  <div className="flex justify-center"><YesNoIndicator value={form[`${key}_impaired`]} /></div>
                  <div className="flex justify-center"><YesNoIndicator value={form[`${key}_painful`]} /></div>
                </React.Fragment>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-4 mt-4 grid grid-cols-2 gap-x-6 gap-y-1">
              <FieldRow label="Bevorz. Kauseite" hot={isHot('chewing_side')}>
                <span className="font-mono text-sm font-bold text-slate-900">
                  {form.chewing_side === 'left' ? 'links' : form.chewing_side === 'right' ? 'rechts' : form.chewing_side === 'both' ? 'beidseitig' : <span className="text-slate-400">–</span>}
                </span>
              </FieldRow>
              <FieldRow label="Gelenkger. L · R" hot={isHot('joint_sounds_left') || isHot('joint_sounds_right')}>
                <YesNoIndicator value={form.joint_sounds_left} />
                <span className="text-slate-400">·</span>
                <YesNoIndicator value={form.joint_sounds_right} />
              </FieldRow>
              <FieldRow label="Geräusche seit" hot={isHot('joint_sounds_since')}>
                <span className="font-mono text-xs text-slate-900 font-semibold">{form.joint_sounds_since || <span className="text-slate-400">–</span>}</span>
              </FieldRow>
              <FieldRow label="Zähne empfindlich" hot={isHot('teeth_painful')}>
                <YesNoIndicator value={form.teeth_painful} />
              </FieldRow>
              <FieldRow label="Zähne passen" hot={isHot('teeth_fit_correctly')}>
                <YesNoIndicator value={form.teeth_fit_correctly} />
              </FieldRow>
              <FieldRow label="Taubheitsgefühl Kopf/Gesicht" hot={isHot('numbness_head_face')}>
                <YesNoIndicator value={form.numbness_head_face} />
              </FieldRow>
            </div>
            {form.additional_anamnesis && (
              <div className="mt-3"><FreitextField value={form.additional_anamnesis} label="WEITERE ANGABEN" hot={isHot('additional_anamnesis')} /></div>
            )}
          </SectionCard>

          {/* ═══════════ 04 KIEFERGELENK ═══════════ */}
          <SectionCard num="04" title="Kiefergelenk · Palpation & Auskultation" recentField={recentField}
            fields={['joint_palp','auscultation']}>
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 gap-y-2 items-center">
              <div></div>
              <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold text-center">LI</div>
              <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold text-center">RE</div>
              <div className="text-sm text-slate-800 font-medium">Palpation lateral</div>
              <Pill value={form.joint_palp_lateral_left} />
              <Pill value={form.joint_palp_lateral_right} />
              <div className="text-sm text-slate-800 font-medium">Palpation dorsal</div>
              <Pill value={form.joint_palp_dorsal_left} />
              <Pill value={form.joint_palp_dorsal_right} />
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200">
              <SubLabel>AUSKULTATION</SubLabel>
              {form.auscultation_events.length === 0 ? (
                <div className="text-sm text-slate-500">keine Geräusche dokumentiert</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {form.auscultation_events.map((e, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border-2 border-cyan-400 bg-cyan-50 font-mono text-xs">
                      <span className="text-cyan-800 font-bold">{e.type}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-800 font-bold">{e.side === 'left' ? 'li' : 're'}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-800">{e.phase === 'opening' ? 'öffnen' : 'schließen'}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-800">{e.timing}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </SectionCard>

          {/* ═══════════ 05 MUSKULATUR ═══════════ */}
          <SectionCard num="05" title="Muskulatur · Palpation" recentField={recentField}
            fields={['muscle_']}>
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 gap-y-1.5 items-center">
              <div></div>
              <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold text-center">LI</div>
              <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold text-center">RE</div>
              {MUSCLES.map(([key, label]) => (
                <React.Fragment key={key}>
                  <div className={`text-sm text-slate-800 font-medium ${(isHot(`${key}_left`) || isHot(`${key}_right`)) ? 'animate-flash' : ''}`}>{label}</div>
                  <Pill value={form[`${key}_left`]} mini />
                  <Pill value={form[`${key}_right`]} mini />
                </React.Fragment>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3 pt-3 border-t border-slate-200">
              <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold">SKALA</div>
              <div className="flex items-center gap-3 text-xs text-slate-800">
                <span><span className="text-emerald-800 font-mono font-bold">0</span> unauffällig</span>
                <span><span className="text-amber-800 font-mono font-bold">1</span> Missempfindung</span>
                <span><span className="text-rose-800 font-mono font-bold">2</span> Schmerz</span>
              </div>
            </div>
          </SectionCard>

          {/* ═══════════ 06 MOBILITÄT ═══════════ */}
          <SectionCard num="06" title="Mobilität des Unterkiefers" recentField={recentField}
            fields={['mouth_opening','laterotrusion','protrusion','retrusion']}>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <SubLabel>MUNDÖFFNUNG</SubLabel>
                <div className="space-y-1.5">
                  <div className={`flex justify-between items-baseline ${isHot('mouth_opening_active_mm') ? 'animate-flash' : ''}`}>
                    <span className="text-xs text-slate-700 font-medium">aktiv</span>
                    <ValuePill value={form.mouth_opening_active_mm} unit="mm" big />
                  </div>
                  <div className={`flex justify-between items-baseline ${isHot('mouth_opening_passive_mm') ? 'animate-flash' : ''}`}>
                    <span className="text-xs text-slate-700 font-medium">passiv</span>
                    <ValuePill value={form.mouth_opening_passive_mm} unit="mm" big />
                  </div>
                </div>
              </div>
              <div>
                <SubLabel>LATEROTRUSION</SubLabel>
                <div className="space-y-1.5">
                  <div className={`flex justify-between items-baseline ${isHot('laterotrusion_left_mm') ? 'animate-flash' : ''}`}>
                    <span className="text-xs text-slate-700 font-medium">links</span>
                    <ValuePill value={form.laterotrusion_left_mm} unit="mm" big />
                  </div>
                  <div className={`flex justify-between items-baseline ${isHot('laterotrusion_right_mm') ? 'animate-flash' : ''}`}>
                    <span className="text-xs text-slate-700 font-medium">rechts</span>
                    <ValuePill value={form.laterotrusion_right_mm} unit="mm" big />
                  </div>
                </div>
              </div>
              <div>
                <SubLabel>PRO·/RETRUSION</SubLabel>
                <div className="space-y-1.5">
                  <div className={`flex justify-between items-baseline ${isHot('protrusion_mm') ? 'animate-flash' : ''}`}>
                    <span className="text-xs text-slate-700 font-medium">protr.</span>
                    <ValuePill value={form.protrusion_mm} unit="mm" big />
                  </div>
                  <div className={`flex justify-between items-baseline ${isHot('retrusion_mm') ? 'animate-flash' : ''}`}>
                    <span className="text-xs text-slate-700 font-medium">retr.</span>
                    <ValuePill value={form.retrusion_mm} unit="mm" big />
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ═══════════ 07 KIEFERRELATION ═══════════ */}
          <SectionCard num="07" title="Kieferrelation · ZO/HO & Statik" recentField={recentField}
            fields={['gliding','vertical_relation','static_occlusion']}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-4">
              <FieldRow label="Gleiten ZO ↔ HO" hot={isHot('gliding_zo_ho')}>
                <YesNoIndicator value={form.gliding_zo_ho} />
              </FieldRow>
              <FieldRow label="Vertikale Relation" hot={isHot('vertical_relation')}>
                <span className={`font-mono text-sm font-bold ${
                  form.vertical_relation === 'normal' ? 'text-emerald-700' :
                  form.vertical_relation === 'increased' || form.vertical_relation === 'decreased' ? 'text-amber-700' : 'text-slate-400'
                }`}>
                  {form.vertical_relation === 'normal' ? 'unauffällig' :
                   form.vertical_relation === 'increased' ? 'erhöht' :
                   form.vertical_relation === 'decreased' ? 'zu niedrig' : '–'}
                </span>
              </FieldRow>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <SubLabel>GLEITWEG (mm) · re | mitte | li | vertikal</SubLabel>
              <div className="grid grid-cols-4 gap-2">
                {['gliding_right_mm','gliding_middle_mm','gliding_left_mm','gliding_vertical_mm'].map(k => (
                  <div key={k} className={`flex flex-col items-center py-2 rounded border-2 ${form[k] != null ? 'border-cyan-300 bg-cyan-50' : 'border-slate-200 bg-slate-50 border-dashed'} ${isHot(k) ? 'animate-flash' : ''}`}>
                    <ValuePill value={form[k]} unit="mm" />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 mt-4">
              <SubLabel>STATISCHE OKKLUSION · ZO (oben) / HO (unten) pro Zahn</SubLabel>
              <div className="space-y-3">
                <div>
                  <div className="text-[9px] text-slate-500 font-mono mb-1">OBERKIEFER</div>
                  <div className="flex gap-1 justify-center flex-wrap">
                    {TEETH_UPPER.slice(0, 8).map(t => <ToothCell key={t} tooth={t} occlusion={form.static_occlusion} hot={isHot(`static_occlusion_${t}`)} />)}
                    <div className="w-1" />
                    {TEETH_UPPER.slice(8).map(t => <ToothCell key={t} tooth={t} occlusion={form.static_occlusion} hot={isHot(`static_occlusion_${t}`)} />)}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 font-mono mb-1">UNTERKIEFER</div>
                  <div className="flex gap-1 justify-center flex-wrap">
                    {TEETH_LOWER.slice(0, 8).map(t => <ToothCell key={t} tooth={t} occlusion={form.static_occlusion} hot={isHot(`static_occlusion_${t}`)} />)}
                    <div className="w-1" />
                    {TEETH_LOWER.slice(8).map(t => <ToothCell key={t} tooth={t} occlusion={form.static_occlusion} hot={isHot(`static_occlusion_${t}`)} />)}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs text-slate-700 flex-wrap">
                <span className="font-mono"><span className="text-emerald-700 font-bold">+</span> Kontakt</span>
                <span className="font-mono"><span className="text-amber-700 font-bold">+-</span> schwach</span>
                <span className="font-mono"><span className="text-rose-700 font-bold">-</span> kein</span>
                <span className="font-mono"><span className="text-slate-500 font-bold">x</span> fehlend</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 mt-4">
              <SubLabel>DYNAMISCHE OKKLUSION · Führung bei Bewegung</SubLabel>
              <div className="grid grid-cols-[80px_repeat(5,1fr)] gap-2 items-center text-xs">
                <div></div>
                <div className="text-center font-mono font-bold text-slate-700 text-[10px]">FZ</div>
                <div className="text-center font-mono font-bold text-slate-700 text-[10px]">PM li</div>
                <div className="text-center font-mono font-bold text-slate-700 text-[10px]">PM re</div>
                <div className="text-center font-mono font-bold text-slate-700 text-[10px]">M li</div>
                <div className="text-center font-mono font-bold text-slate-700 text-[10px]">M re</div>
                {[
                  ['RL', 'Rechtslateral'],
                  ['LL', 'Linkslateral'],
                  ['P',  'Protrusion'],
                ].map(([mvmt, lbl]) => (
                  <React.Fragment key={mvmt}>
                    <div className="text-sm font-medium text-slate-800">{lbl}</div>
                    {['fz','pm_li','pm_re','m_li','m_re'].map(c => {
                      const v = form.dynamic_occlusion?.[mvmt]?.[c];
                      return (
                        <div key={c} className={`flex justify-center py-1 rounded border-2 ${
                          v === true ? 'bg-cyan-700 border-cyan-700 text-white' :
                          v === false ? 'border-slate-300 bg-white' : 'border-slate-200 bg-slate-50 border-dashed'
                        } ${isHot(`dynamic_occlusion_${mvmt}`) ? 'animate-flash' : ''}`}>
                          <span className="text-xs font-mono font-bold">
                            {v === true ? '✓' : v === false ? '·' : '·'}
                          </span>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* ═══════════ 08 WEITERE BEFUNDE ═══════════ */}
          <SectionCard num="08" title="Weitere Befunde" recentField={recentField}
            fields={['abrasions_attrition','wedge_defects','tongue_impressions','cheek_impressions','other_findings']}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
              <Checkbox value={form.abrasions_attrition} label="Abrasionen / Attrition" hot={isHot('abrasions_attrition')} />
              <Checkbox value={form.wedge_defects} label="Keilförmige Defekte" hot={isHot('wedge_defects')} />
              <Checkbox value={form.tongue_impressions} label="Zungenimpressionen" hot={isHot('tongue_impressions')} />
              <Checkbox value={form.cheek_impressions} label="Wangenimpressionen" hot={isHot('cheek_impressions')} />
            </div>
            {form.other_findings && (
              <div className="mt-3"><FreitextField value={form.other_findings} label="ANDERE BEFUNDE" hot={isHot('other_findings')} lines={1} /></div>
            )}
          </SectionCard>

          {/* ═══════════ 09 DIAGNOSTIK ═══════════ */}
          <SectionCard num="09" title="Weitere Diagnostische Maßnahmen" recentField={recentField}
            fields={['manual_structure','orthopedic','psychosocial','instrumental','consultation','consult_']}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
              <Checkbox value={form.manual_structure_analysis} label="Manuelle Strukturanalyse" hot={isHot('manual_structure_analysis')} />
              <Checkbox value={form.orthopedic_screening} label="Orthopädisches Screening" hot={isHot('orthopedic_screening')} />
              <Checkbox value={form.psychosocial_screening} label="Psychosoziales Screening" hot={isHot('psychosocial_screening')} />
              <Checkbox value={form.instrumental_function_analysis} label="Instr. Funktionsanalyse" hot={isHot('instrumental_function_analysis')} />
              <Checkbox value={form.instrumental_occlusion_analysis} label="Instr. Okklusionsanalyse" hot={isHot('instrumental_occlusion_analysis')} />
              <Checkbox value={form.consultation} label="Konsiliarische Untersuchung" hot={isHot('consultation')} />
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200">
              <SubLabel>KONSILE</SubLabel>
              <div className="grid grid-cols-3 gap-x-4 gap-y-0.5">
                <Checkbox value={form.consult_mri} label="MRT" hot={isHot('consult_mri')} />
                <Checkbox value={form.consult_ct} label="CT" hot={isHot('consult_ct')} />
                <Checkbox value={form.consult_arthroscopy} label="Arthroskopie" hot={isHot('consult_arthroscopy')} />
                <Checkbox value={form.consult_orthodontics} label="Kieferorthopädie" hot={isHot('consult_orthodontics')} />
                <Checkbox value={form.consult_mkg} label="MKG-Chirurgie" hot={isHot('consult_mkg')} />
                <Checkbox value={form.consult_ent} label="HNO" hot={isHot('consult_ent')} />
                <Checkbox value={form.consult_orthopedics} label="Orthopädie" hot={isHot('consult_orthopedics')} />
                <Checkbox value={form.consult_rheumatology} label="Rheumatologie" hot={isHot('consult_rheumatology')} />
                <Checkbox value={form.consult_internal} label="Innere Medizin" hot={isHot('consult_internal')} />
                <Checkbox value={form.consult_neurology} label="Neurologie" hot={isHot('consult_neurology')} />
                <Checkbox value={form.consult_psychosomatic} label="Psychosomatik" hot={isHot('consult_psychosomatic')} />
                <Checkbox value={form.consult_other} label="andere" hot={isHot('consult_other')} />
              </div>
              {form.consult_other_text && (
                <div className="mt-2"><FreitextField value={form.consult_other_text} label="ANDERE KONSILE" hot={isHot('consult_other_text')} lines={1} /></div>
              )}
            </div>
          </SectionCard>

          {/* ═══════════ 10 INITIALDIAGNOSE ═══════════ */}
          <SectionCard num="10" title="Initialdiagnose" recentField={recentField} fields={['initial_diagnosis']}>
            <FreitextField value={form.initial_diagnosis} label="DIAGNOSE" hot={isHot('initial_diagnosis')} lines={3} />
          </SectionCard>

          {/* ═══════════ 11 THERAPIE ═══════════ */}
          <SectionCard num="11" title="Therapie · Initial & Weitere" recentField={recentField}
            fields={['splint','physical_therapy','pt_','manual_therapy','exercises','medication','relaxation','therapy_other','selective_grinding','restorative','permanent_splint','psychosomatic','orthodontic','joint_surgery']}>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <SubLabel>INITIALTHERAPIE</SubLabel>
                <Checkbox value={form.splint} label="Okklusionsschiene" hot={isHot('splint')} />
                {form.splint_type && (
                  <div className="ml-6 -mt-1 mb-1 text-xs text-slate-700 italic">→ {form.splint_type}</div>
                )}
                <Checkbox value={form.physical_therapy} label="Physikalische Therapie" hot={isHot('physical_therapy')} />
                <div className="ml-5 grid grid-cols-2 gap-x-3 mb-1">
                  <Checkbox value={form.pt_massage} label="Massage" hot={isHot('pt_massage')} />
                  <Checkbox value={form.pt_heat} label="Wärme" hot={isHot('pt_heat')} />
                  <Checkbox value={form.pt_cold} label="Kälte" hot={isHot('pt_cold')} />
                  <Checkbox value={form.pt_electro} label="Elektrotherapie" hot={isHot('pt_electro')} />
                </div>
                <Checkbox value={form.manual_therapy} label="Manuelle Therapie" hot={isHot('manual_therapy')} />
                <Checkbox value={form.exercises} label="Bewegungsübungen" hot={isHot('exercises')} />
                <Checkbox value={form.medication} label="Medikamentöse Therapie" hot={isHot('medication')} />
                <Checkbox value={form.relaxation} label="Entspannungsübungen" hot={isHot('relaxation')} />
                <Checkbox value={form.therapy_other_initial} label="andere" hot={isHot('therapy_other_initial')} />
              </div>
              <div>
                <SubLabel>WEITERE THERAPIE</SubLabel>
                <Checkbox value={form.selective_grinding} label="Einschleifmaßnahmen" hot={isHot('selective_grinding')} />
                <Checkbox value={form.restorative_prosthetic} label="Restaurativ / Prothetisch" hot={isHot('restorative_prosthetic')} />
                <Checkbox value={form.permanent_splint} label="Dauerschiene" hot={isHot('permanent_splint')} />
                <Checkbox value={form.psychosomatic_therapy} label="Psychosomatische Therapie" hot={isHot('psychosomatic_therapy')} />
                <Checkbox value={form.orthodontics_therapy} label="Kieferorthopädie" hot={isHot('orthodontics_therapy')} />
                <Checkbox value={form.orthodontic_surgery} label="KFO-Chirurgie" hot={isHot('orthodontic_surgery')} />
                <Checkbox value={form.joint_surgery} label="Kiefergelenkchirurgie" hot={isHot('joint_surgery')} />
                <Checkbox value={form.therapy_other_further} label="andere" hot={isHot('therapy_other_further')} />
              </div>
            </div>
          </SectionCard>

          {/* ═══════════ 12 BEIBLATT GOZ ═══════════ */}
          <SectionCard num="12" title="Beiblatt · GOZ-Positionen, Indikation, Versorgung" recentField={recentField}
            fields={['goz_','indication_','supply_chart','treatment_planning']}>
            <SubLabel>GOZ-POSITIONEN</SubLabel>
            <div className="grid grid-cols-6 gap-x-3 gap-y-0.5 mb-4">
              {['8000','8010','8020','8030','8035','8050','8060','8065','8080','8090','8100'].map(num => (
                <Checkbox key={num} value={form[`goz_${num}`]} label={num} hot={isHot(`goz_${num}`)} />
              ))}
            </div>

            <div className="border-t border-slate-200 pt-4">
              <SubLabel>INDIKATIONEN</SubLabel>
              <div className="space-y-0.5">
                <Checkbox value={form.indication_function_pretreatment} label="Funktionelle Vorbehandlung" hot={isHot('indication_function_pretreatment')} />
                <Checkbox value={form.indication_jaw_muscle} label="Kiefergelenk-/Muskelerkrankungen" hot={isHot('indication_jaw_muscle')} />
                <Checkbox value={form.indication_dysgnathy} label="Mit Dysgnathien verbundene Erkrankungen" hot={isHot('indication_dysgnathy')} />
                <Checkbox value={form.indication_periodontal} label="Parodontopathien (ungleichm. Belastung)" hot={isHot('indication_periodontal')} />
                <Checkbox value={form.indication_dentition_reconstruction} label="Gebisssanierung mit verlorener ZO" hot={isHot('indication_dentition_reconstruction')} />
                <Checkbox value={form.indication_kfo_planning} label="Operations-/KFO-Planung" hot={isHot('indication_kfo_planning')} />
                <Checkbox value={form.indication_extensive_restoration} label="Umfangr. restaurative/prothet. Versorgung" hot={isHot('indication_extensive_restoration')} />
                <Checkbox value={form.indication_chronic_pain} label="Adjuvant bei chronischem Schmerz" hot={isHot('indication_chronic_pain')} />
                <Checkbox value={form.indication_other} label="Sonstige Indikation" hot={isHot('indication_other')} />
              </div>
              {form.indication_other_text && (
                <div className="mt-2"><FreitextField value={form.indication_other_text} label="BEGRÜNDUNG" hot={isHot('indication_other_text')} lines={1} /></div>
              )}
            </div>

            <div className="border-t border-slate-200 pt-4 mt-4">
              <SubLabel>VERSORGUNGSSCHEMA</SubLabel>
              <div className="space-y-2">
                <div>
                  <div className="text-[9px] text-slate-500 font-mono mb-1">OBERKIEFER</div>
                  <div className="flex gap-1 justify-center flex-wrap">
                    {TEETH_UPPER.slice(0, 8).map(t => <SupplyToothCell key={t} tooth={t} supply={form.supply_chart} hot={isHot(`supply_chart_${t}`)} />)}
                    <div className="w-1" />
                    {TEETH_UPPER.slice(8).map(t => <SupplyToothCell key={t} tooth={t} supply={form.supply_chart} hot={isHot(`supply_chart_${t}`)} />)}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 font-mono mb-1">UNTERKIEFER</div>
                  <div className="flex gap-1 justify-center flex-wrap">
                    {TEETH_LOWER.slice(0, 8).map(t => <SupplyToothCell key={t} tooth={t} supply={form.supply_chart} hot={isHot(`supply_chart_${t}`)} />)}
                    <div className="w-1" />
                    {TEETH_LOWER.slice(8).map(t => <SupplyToothCell key={t} tooth={t} supply={form.supply_chart} hot={isHot(`supply_chart_${t}`)} />)}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-700 flex-wrap font-mono">
                <span><b className="text-cyan-800">F</b> Füllung</span>
                <span><b className="text-cyan-800">K</b> Krone</span>
                <span><b className="text-cyan-800">T</b> Teleskop</span>
                <span><b className="text-emerald-800">B</b> Brückenglied</span>
                <span><b className="text-emerald-800">H</b> Halteelement</span>
                <span><b className="text-emerald-800">E</b> ersetzter Z.</span>
                <span><b className="text-rose-700">f</b> fehlend</span>
                <span><b className="text-slate-700">C</b> Lückenschluss</span>
              </div>
            </div>

            {form.treatment_planning_notes && (
              <div className="mt-4"><FreitextField value={form.treatment_planning_notes} label="PLANUNG / THERAPIE-NOTIZEN" hot={isHot('treatment_planning_notes')} lines={2} /></div>
            )}
          </SectionCard>

          {/* ═══════════ 13 PATIENTENAUSWERTUNG SCHIENENTHERAPIE ═══════════ */}
          <SectionCard num="13" title="Patientenauswertung Schienentherapie" recentField={recentField}
            fields={['splint_']}>
            {/* Hersteller-Auswahl */}
            <div className={`mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg ${(isHot('splint_manufacturer') || isHot('splint_manufacturer_other')) ? 'animate-flash' : ''}`}>
              <SubLabel>SCHIENEN-SYSTEM</SubLabel>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {[
                  ['myosa', 'Myosa®'],
                  ['osa', 'OSA'],
                  ['aqualizer', 'Aqualizer®'],
                  ['sci', 'SCi™'],
                  ['other', 'Andere'],
                ].map(([key, label]) => {
                  const selected = form.splint_manufacturer === key;
                  return (
                    <span key={key} className={`px-3 py-1 rounded-md text-sm font-mono font-bold border-2 ${
                      selected ? 'bg-cyan-600 text-white border-cyan-700' : 'bg-white text-slate-500 border-slate-300'
                    }`}>
                      {label}
                    </span>
                  );
                })}
                {form.splint_manufacturer === 'other' && form.splint_manufacturer_other && (
                  <span className="text-sm text-slate-700 font-medium ml-2">
                    → {form.splint_manufacturer_other}
                  </span>
                )}
                {!form.splint_manufacturer && (
                  <span className="text-xs text-slate-400 ml-2">noch nicht erfasst</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4">
              <FreitextField value={form.splint_main_complaints} label="HAUPTBESCHWERDEN" hot={isHot('splint_main_complaints')} lines={3} />
              <FreitextField value={form.splint_treatment_goals} label="BEHANDLUNGSZIELE" hot={isHot('splint_treatment_goals')} lines={3} />
            </div>

            <div className="border-t border-slate-200 pt-4">
              <SubLabel>SYMPTOME & SCHMERZANALYSE</SubLabel>
              <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 gap-y-1.5 items-center">
                <div></div>
                <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold text-center">VORH.</div>
                <div className="text-[10px] tracking-widest text-slate-700 font-mono font-bold text-center">VAS /10</div>
                {[
                  ['headache', 'Kopfschmerzen (frontal/temporal) · M. Temporalis'],
                  ['neck_pain', 'Nackenschmerzen / Steifheit · M. Trapezius / SCM'],
                  ['joint_clicking', 'Kiefergelenksknacken · Kapselpalpation'],
                  ['limited_opening', 'Eingeschränkte Mundöffnung'],
                  ['ear_pain_tinnitus', 'Ohrenschmerzen / Tinnitus · Meatus externus'],
                  ['atypical_facial_pain', 'Atypischer Gesichtsschmerz · M. Masseter / Buccinator'],
                ].map(([key, label]) => (
                  <React.Fragment key={key}>
                    <div className={`text-sm text-slate-800 font-medium ${(isHot(`splint_${key}`) || isHot(`splint_${key}_intensity`)) ? 'animate-flash' : ''}`}>{label}</div>
                    <div className="flex justify-center"><YesNoIndicator value={form[`splint_${key}`]} /></div>
                    <div className="flex justify-center"><ValuePill value={form[`splint_${key === 'ear_pain_tinnitus' ? 'ear_pain' : key === 'atypical_facial_pain' ? 'facial_pain' : key}_intensity`]} unit="/10" /></div>
                  </React.Fragment>
                ))}
              </div>
              <div className={`mt-3 flex items-center justify-between ${isHot('splint_max_opening_mm') ? 'animate-flash' : ''}`}>
                <span className="text-sm text-slate-700 font-medium">Max. Mundöffnung</span>
                <ValuePill value={form.splint_max_opening_mm} unit="mm" big />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 mt-4 grid grid-cols-3 gap-x-6">
              <div>
                <SubLabel>ATMUNG</SubLabel>
                <FieldRow label="Modus" hot={isHot('splint_breathing_mode')}>
                  <span className="font-mono text-sm font-bold text-slate-900">
                    {form.splint_breathing_mode === 'nasal' ? 'nasal' :
                     form.splint_breathing_mode === 'mouth' ? 'Mund' :
                     <span className="text-slate-400">–</span>}
                  </span>
                </FieldRow>
                <FieldRow label="Lippenschluss" hot={isHot('splint_lip_closure')}>
                  <YesNoIndicator value={form.splint_lip_closure} />
                </FieldRow>
                <FieldRow label="Tonsillen (0–4)" hot={isHot('splint_tonsils_grade')}>
                  <ValuePill value={form.splint_tonsils_grade} />
                </FieldRow>
              </div>
              <div>
                <SubLabel>SCHLAF</SubLabel>
                <Checkbox value={form.splint_snoring} label="Schnarchen" hot={isHot('splint_snoring')} />
                <Checkbox value={form.splint_apnea} label="Apnoe" hot={isHot('splint_apnea')} />
                <Checkbox value={form.splint_restless_sleep} label="Unruhig" hot={isHot('splint_restless_sleep')} />
                <Checkbox value={form.splint_morning_fatigue} label="Morg. Müdigkeit" hot={isHot('splint_morning_fatigue')} />
                <Checkbox value={form.splint_sleep_study_done} label="Schlafstudie erfolgt" hot={isHot('splint_sleep_study_done')} />
              </div>
              <div>
                <SubLabel>HALTUNG</SubLabel>
                <Checkbox value={form.splint_posture_head_forward} label="Kopf nach vorn" hot={isHot('splint_posture_head_forward')} />
                <Checkbox value={form.splint_posture_pelvic_tilt} label="Beckenschiefstand" hot={isHot('splint_posture_pelvic_tilt')} />
                <Checkbox value={form.splint_posture_shoulder_drop} label="Schultertiefstand" hot={isHot('splint_posture_shoulder_drop')} />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 mt-4">
              <SubLabel>MYOFUNKTIONELLE ANALYSE (SOFT TISSUE)</SubLabel>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <FieldRow label="Zungenposition" hot={isHot('splint_tongue_position')}>
                  <span className="font-mono text-sm font-bold text-slate-900">
                    {form.splint_tongue_position === 'low' ? 'tief' :
                     form.splint_tongue_position === 'interdental' ? 'interdental' :
                     form.splint_tongue_position === 'correct' ? 'richtig' :
                     form.splint_tongue_position === 'high' ? 'hoch' :
                     <span className="text-slate-400">–</span>}
                  </span>
                </FieldRow>
                <Checkbox value={form.splint_tongue_correction_needed} label="Zungen-Korrekturbedarf" hot={isHot('splint_tongue_correction_needed')} />
                <FieldRow label="Wangenmuskeln" hot={isHot('splint_cheek_muscles')}>
                  <span className="font-mono text-sm font-bold text-slate-900">
                    {form.splint_cheek_muscles === 'hypertonic' ? 'hyperton' :
                     form.splint_cheek_muscles === 'hypotonic' ? 'hypoton' :
                     form.splint_cheek_muscles === 'normal' ? 'normal' :
                     <span className="text-slate-400">–</span>}
                  </span>
                </FieldRow>
                <Checkbox value={form.splint_cheek_exercises_needed} label="Wangen-Übungen empfohlen" hot={isHot('splint_cheek_exercises_needed')} />
              </div>
              <div className="mt-2">
                <SubLabel>SCHLUCKREFLEX</SubLabel>
                <div className="flex flex-wrap gap-x-4">
                  <Checkbox value={form.splint_swallow_tongue_thrust} label="Zungenstoß" hot={isHot('splint_swallow_tongue_thrust')} />
                  <Checkbox value={form.splint_swallow_mentalis_activity} label="Mentalis-Aktivität" hot={isHot('splint_swallow_mentalis_activity')} />
                  <Checkbox value={form.splint_swallow_myofunctional_therapy_needed} label="Myofunkt. Therapie empfohlen" hot={isHot('splint_swallow_myofunctional_therapy_needed')} />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 mt-4">
              <SubLabel>DENTALER & SKELETTALER STATUS</SubLabel>
              <div className="grid grid-cols-4 gap-3">
                <FieldRow label="Oberkiefer" hot={isHot('splint_maxilla_shape')}>
                  <span className="font-mono text-sm font-bold text-slate-900">
                    {form.splint_maxilla_shape === 'v_form' ? 'V-Form' :
                     form.splint_maxilla_shape === 'u_form' ? 'U-Form' :
                     <span className="text-slate-400">–</span>}
                  </span>
                </FieldRow>
                <FieldRow label="Engstand" hot={isHot('splint_crowding')}>
                  <YesNoIndicator value={form.splint_crowding} />
                </FieldRow>
                <FieldRow label="Klasse" hot={isHot('splint_class')}>
                  <span className="font-mono text-sm font-bold text-slate-900">
                    {form.splint_class || <span className="text-slate-400">–</span>}
                  </span>
                </FieldRow>
                <FieldRow label="Biss" hot={isHot('splint_bite')}>
                  <span className="font-mono text-sm font-bold text-slate-900">
                    {form.splint_bite === 'deep' ? 'tief' :
                     form.splint_bite === 'cross' ? 'Kreuz' :
                     form.splint_bite === 'open' ? 'offen' :
                     form.splint_bite === 'normal' ? 'normal' :
                     <span className="text-slate-400">–</span>}
                  </span>
                </FieldRow>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 mt-4 space-y-3">
              <FreitextField value={form.splint_recommended_appliance} label="EMPFOHLENE APPARATUR" hot={isHot('splint_recommended_appliance')} lines={1} />
              <FreitextField value={form.splint_special_notes} label="BESONDERE ANMERKUNGEN" hot={isHot('splint_special_notes')} lines={2} />
            </div>
          </SectionCard>
      </div>

      {/* Footer mit DGFDT-Lizenzvermerk */}
      <div className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-200 pt-4 mt-8 max-w-3xl mx-auto text-center">
        <p>
          Befundbogen <strong>"Klinischer Funktionsstatus"</strong> der Deutschen Gesellschaft
          für Funktionsdiagnostik und -therapie (DGFDT).
        </p>
        <p className="mt-1">
          © Ottl, Ahlers, Lange, Utz, Reiber 2011 · DGFDT/DGZMK · Stand 01/2012
        </p>
        <p className="mt-1 text-slate-400">
          Sektion 13 (Patientenauswertung Schienentherapie) — herstellerneutral.
          Markennamen (Myosa®, OSA, Aqualizer®, SCi™) sind Eigentum der jeweiligen Inhaber.
        </p>
      </div>
    </div>
  );
}

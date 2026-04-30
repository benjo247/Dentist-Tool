// ═══════════════════════════════════════════════════════════════════
// Zahnverschleiß-Screening — TWES 2.0
//
// Konzept TWES 2.0 Screening:
// - Okklusal/inzisal: 5-Punkt-Skala (0-4)
// - Palatinal/oral/vestibulär: 3-Punkt-Skala (0-2)
// - Erhebung pro Sextant (Worst-Score-Prinzip)
// - 6 Sextanten (Oberkiefer und Unterkiefer je rechts/anterior/links)
//
// Skalen TWES 2.0:
//   Okklusal/inzisal (5-Punkt):
//     0 = kein Verschleiß
//     1 = Verschleiß im Schmelz
//     2 = Verschleiß im Dentin (≤ 1/3 Kronenhöhe)
//     3 = Verschleiß im Dentin (1/3 bis 2/3 Kronenhöhe)
//     4 = Verschleiß im Dentin (> 2/3 Kronenhöhe oder Pulpaexposition)
//   Non-okklusal (3-Punkt):
//     0 = kein sichtbarer Verschleiß
//     1 = Verschleiß auf Schmelz beschränkt
//     2 = Verschleiß mit freiliegendem Dentin
// ═══════════════════════════════════════════════════════════════════

// Sextanten (FDI-Schema, Standard-Konvention)
export const SEXTANTS = [
  { id: 'S1', label: 'OK rechts (18-14)', teeth: ['18','17','16','15','14'], jaw: 'upper', position: 'posterior_right' },
  { id: 'S2', label: 'OK anterior (13-23)', teeth: ['13','12','11','21','22','23'], jaw: 'upper', position: 'anterior' },
  { id: 'S3', label: 'OK links (24-28)', teeth: ['24','25','26','27','28'], jaw: 'upper', position: 'posterior_left' },
  { id: 'S4', label: 'UK links (34-38)', teeth: ['34','35','36','37','38'], jaw: 'lower', position: 'posterior_left' },
  { id: 'S5', label: 'UK anterior (33-43)', teeth: ['33','32','31','41','42','43'], jaw: 'lower', position: 'anterior' },
  { id: 'S6', label: 'UK rechts (44-48)', teeth: ['44','45','46','47','48'], jaw: 'lower', position: 'posterior_right' },
];

export const OCCLUSAL_SCALE = [
  { value: 0, label: 'kein Verschleiß', color: 'emerald' },
  { value: 1, label: 'Schmelz', color: 'sky' },
  { value: 2, label: 'Dentin ≤ 1/3', color: 'amber' },
  { value: 3, label: 'Dentin 1/3–2/3', color: 'orange' },
  { value: 4, label: 'Dentin > 2/3 / Pulpa', color: 'rose' },
];

export const PALATAL_SCALE = [
  { value: 0, label: 'kein Verschleiß', color: 'emerald' },
  { value: 1, label: 'Schmelz', color: 'amber' },
  { value: 2, label: 'Dentin freiliegend', color: 'rose' },
];

export const FIELDS = [
  // Okklusal-Sextanten S1-S6 (jeweils Worst-Score)
  ...SEXTANTS.map(s => ({
    key: `occlusal_${s.id}`,
    type: 'scale_0_4',
    sextant: s.id,
    aspect: 'occlusal',
    label: `${s.label} — okklusal/inzisal (Worst-Score)`,
    short: `${s.id} okklusal`,
  })),
  // Palatinal-Status Sextant 2 (OK anterior)
  // TWES 2.0: Screening konzentriert sich auf palatinale Flächen Sextant 2 (typisch Erosion)
  {
    key: 'palatal_S2',
    type: 'scale_0_2',
    sextant: 'S2',
    aspect: 'palatal',
    label: 'OK anterior — palatinale Flächen (typisch Erosion)',
    short: 'S2 palatinal',
  },
  // Anzeichen für pathologischen Zahnverschleiß
  {
    key: 'sign_pathological_severity',
    section: 'pathology',
    type: 'boolean',
    label: 'Mindestens ein Sextant zeigt moderaten/schweren/extremen Verschleiß (Grad ≥ 2 okklusal oder ≥ 1 palatinal)',
    short: 'Schweregrad pathologisch',
    autoCalculate: true,  // wird aus den Sextant-Werten abgeleitet
  },
  {
    key: 'sign_progression_concern',
    section: 'pathology',
    type: 'boolean',
    label: 'Anhaltspunkte für Progression (Hypersensibilität, Funktionseinschränkung, ästhetische Beeinträchtigung)',
    short: 'Progressions-Anzeichen',
  },
  // Ätiologie-Verdacht
  {
    key: 'etiology_mechanical',
    section: 'etiology',
    type: 'boolean',
    label: 'Verdacht auf mechanische Ursache (Bruxismus, Abrasion durch Hilfsmittel, Attrition)',
    short: 'mechanisch',
  },
  {
    key: 'etiology_chemical',
    section: 'etiology',
    type: 'boolean',
    label: 'Verdacht auf chemische Ursache (Erosion durch Säuren — intrinsisch oder extrinsisch)',
    short: 'chemisch',
  },
];

export const SECTIONS = [
  { id: 'sextants', title: 'Sextanten-Befund (TWES 2.0)', icon: 'S' },
  { id: 'pathology', title: 'Pathologie-Anzeichen', icon: 'P' },
  { id: 'etiology', title: 'Ätiologie-Verdacht', icon: 'Ä' },
];

export function getInitial() {
  const state = {};
  FIELDS.forEach(f => { state[f.key] = null; });
  return state;
}

// ─── BEWERTUNG ──────────────────────────────────────────
// Pathologisch laut TWES 2.0: moderater/schwerer/extremer Verschleiß
// (Grad ≥ 2 okklusal oder ≥ 1 palatinal) IN KOMBINATION MIT
// einem oder mehreren beschriebenen Anzeichen/Symptomen.
export function evaluate(state) {
  const occlusalScores = SEXTANTS.map(s => state[`occlusal_${s.id}`]).filter(v => v !== null);
  const palatal = state.palatal_S2;

  if (occlusalScores.length < 6 || palatal === null) {
    const missing = (6 - occlusalScores.length) + (palatal === null ? 1 : 0);
    return {
      result: 'incomplete',
      label: 'Befund unvollständig',
      detail: `Noch ${missing} Sextant-Werte zu erheben.`,
      severity: 'pending',
    };
  }

  const maxOcclusal = Math.max(...occlusalScores);
  const hasModerate = maxOcclusal >= 2 || palatal >= 1;
  const hasProgression = state.sign_progression_concern === true;

  if (hasModerate && hasProgression) {
    return {
      result: 'pathological',
      label: 'Pathologischer Zahnverschleiß — Status indiziert',
      detail: `Höchster okklusaler Grad: ${maxOcclusal}, palatinal: ${palatal}. Mit Progressions-Anzeichen → erweiterte Diagnostik (Zahnverschleiß-Status) empfohlen.`,
      severity: 'high',
      maxOcclusal,
      palatal,
    };
  }
  if (hasModerate) {
    return {
      result: 'moderate',
      label: 'Moderater bis schwerer Verschleiß ohne Progressions-Anzeichen',
      detail: `Höchster okklusaler Grad: ${maxOcclusal}, palatinal: ${palatal}. Verlaufskontrolle empfohlen.`,
      severity: 'medium',
      maxOcclusal,
      palatal,
    };
  }
  if (maxOcclusal === 1 || palatal === 0) {
    return {
      result: 'mild',
      label: 'Leichter Verschleiß im Schmelz',
      detail: `Höchster okklusaler Grad: ${maxOcclusal}, palatinal: ${palatal}. Routine-Kontrolle.`,
      severity: 'low',
      maxOcclusal,
      palatal,
    };
  }
  return {
    result: 'unremarkable',
    label: 'Kein klinisch relevanter Zahnverschleiß',
    detail: 'Alle Sextanten Grad 0.',
    severity: 'low',
    maxOcclusal: 0,
    palatal: 0,
  };
}

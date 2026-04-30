// ═══════════════════════════════════════════════════════════════════
// CMD-Screening — Felder & Bewertungslogik
// ═══════════════════════════════════════════════════════════════════

export const FIELDS = [
  // ─── ANAMNESE ──────────────────────────────────────────
  {
    key: 'a1_pain_face_jaw',
    section: 'anamnese',
    label: 'Schmerzen im Schläfen-/Gesichtsbereich, Kiefer/Kiefergelenk, beim Öffnen oder Kauen (≥ 1×/Woche)',
    short: 'Wöchentliche Schmerzen',
    type: 'boolean',
    weight: 1,  // Bewertungspunkt für Auslösekriterium
  },
  // ─── UNTERSUCHUNG ──────────────────────────────────────
  {
    key: 'u1_palp_masseter',
    section: 'untersuchung',
    label: 'Schmerz bei Palpation des M. masseter pars superficialis (Referenzmuskel, ~1,0 kg)',
    short: 'Schmerz Masseter-Palpation',
    type: 'boolean',
    weight: 1,
  },
  {
    key: 'u2_joint_sounds',
    section: 'untersuchung',
    label: 'Kiefergelenkgeräusche (Knacken oder Reiben)',
    short: 'Kiefergelenkgeräusche',
    type: 'boolean',
    weight: 1,
  },
  {
    key: 'u3_palp_joint',
    section: 'untersuchung',
    label: 'Schmerz bei Palpation des Kiefergelenks',
    short: 'Schmerz Gelenk-Palpation',
    type: 'boolean',
    weight: 1,
  },
  {
    key: 'u4_pain_opening',
    section: 'untersuchung',
    label: 'Schmerz am Kiefergelenk bei weiter Mundöffnung',
    short: 'Schmerz bei Öffnung',
    type: 'boolean',
    weight: 1,
  },
  {
    key: 'u5_limited_opening',
    section: 'untersuchung',
    label: 'Limitation aktive Mundöffnung < 40 mm',
    short: 'Mundöffnung limitiert (<40 mm)',
    type: 'boolean',
    weight: 1,
    note: 'CAVE: Bei allmählicher Limitation Neoplasie ausschließen',
  },
  {
    key: 'u6_occlusion_disorder',
    section: 'untersuchung',
    label: 'Okklusionsstörung (HO instabil, Stützzonen-Verlust > 2, oder traumatische Exzentrik)',
    short: 'Okklusionsstörung',
    type: 'boolean',
    weight: 1,
  },
];

export const SECTIONS = [
  { id: 'anamnese', title: 'Anamnese', icon: 'A' },
  { id: 'untersuchung', title: 'Untersuchung', icon: 'U' },
];

// Initial-State: alle Felder null (= nicht erhoben)
export function getInitial() {
  const state = {};
  FIELDS.forEach(f => { state[f.key] = null; });
  return state;
}

// ─── BEWERTUNGSMATRIX ────────────────────────────────────
// Auswertung gemäß DGFDT-Bewertungsmatrix:
// - Erweiterte Diagnostik SOLLTE: A1 (ja) UND ≥1 Untersuchungs-Kriterium (ja)
//   ODER 1-2 Untersuchungs-Kriterien (ja)
// - Erweiterte Diagnostik KANN: 1× anamnestisches Kriterium (ja)
// - CAVE: Alleinige Kiefergelenkgeräusche ohne Schmerzen → keine erweiterte Diagnostik
export function evaluate(state) {
  const a1 = state.a1_pain_face_jaw === true;
  const u_positive = ['u1_palp_masseter','u2_joint_sounds','u3_palp_joint',
                      'u4_pain_opening','u5_limited_opening','u6_occlusion_disorder']
                      .filter(k => state[k] === true);
  const u_count = u_positive.length;

  // Sonderfall CAVE: nur U2 (Geräusche) positiv
  if (!a1 && u_count === 1 && state.u2_joint_sounds === true) {
    return {
      result: 'no_extension',
      label: 'Erweiterte Diagnostik nicht indiziert',
      detail: 'Alleinige Kiefergelenkgeräusche ohne Schmerzen. CAVE laut DGFDT.',
      severity: 'info',
    };
  }

  if (a1 && u_count >= 1) {
    return {
      result: 'should_extend',
      label: 'Erweiterte Diagnostik SOLLTE durchgeführt werden',
      detail: 'Anamnese positiv und ≥ 1 Untersuchungs-Kriterium positiv.',
      severity: 'high',
    };
  }
  if (u_count >= 2) {
    return {
      result: 'should_extend',
      label: 'Erweiterte Diagnostik SOLLTE durchgeführt werden',
      detail: `${u_count} Untersuchungs-Kriterien positiv.`,
      severity: 'high',
    };
  }
  if (a1 || u_count === 1) {
    return {
      result: 'may_extend',
      label: 'Erweiterte Diagnostik KANN durchgeführt werden',
      detail: a1 ? 'Anamnestisch ein Kriterium positiv.' : 'Ein Untersuchungs-Kriterium positiv.',
      severity: 'medium',
    };
  }

  // alle Felder erhoben aber keiner positiv
  const allAnswered = FIELDS.every(f => state[f.key] !== null);
  if (allAnswered) {
    return {
      result: 'unremarkable',
      label: 'Unauffällig — keine erweiterte Diagnostik indiziert',
      detail: 'Keine Kriterien positiv.',
      severity: 'low',
    };
  }

  return {
    result: 'incomplete',
    label: 'Befund unvollständig',
    detail: `${FIELDS.filter(f => state[f.key] === null).length} Felder noch nicht erhoben.`,
    severity: 'pending',
  };
}

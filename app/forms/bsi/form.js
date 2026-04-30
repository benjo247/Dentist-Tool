// ═══════════════════════════════════════════════════════════════════
// BSI — Felder & Bewertungslogik
// Punktesystem nach DGFDT:
//   A1 = 1 Punkt, alle anderen je 2 Punkte
//   Höchster Einzelwert bestimmt das Gesamtergebnis
// ═══════════════════════════════════════════════════════════════════

export const FIELDS = [
  // ─── ANAMNESE ──────────────────────────────────────────
  {
    key: 'a1_self_report',
    section: 'anamnese',
    label: 'Selbstauskunft oder Bericht von Angehörigen über Knirschen oder Klappern mit den Zähnen',
    short: 'Knirschen / Klappern',
    type: 'boolean',
    points: 1,
    note: 'Bei zeitlicher Differenzierung: morgens → wahrscheinlich Schlaf-Bruxismus, tagsüber → Wach-Bruxismus',
  },
  {
    key: 'a2_muscle_complaints',
    section: 'anamnese',
    label: 'Beschwerden der Kaumuskulatur (Missempfindungen, Schmerzen, Ermüdung, vorübergehende Steifigkeit)',
    short: 'Beschwerden Kaumuskulatur',
    type: 'boolean',
    points: 2,
  },
  {
    key: 'a3_temporal_headache',
    section: 'anamnese',
    label: 'Vorübergehende Schläfenkopfschmerzen',
    short: 'Schläfenkopfschmerzen',
    type: 'boolean',
    points: 2,
    note: 'Im Zusammenhang mit lokalen myogenen Schmerzen der Mm. temporales',
  },
  {
    key: 'a4_sensitive_teeth',
    section: 'anamnese',
    label: 'Empfindliche Zähne',
    short: 'Empfindliche Zähne',
    type: 'boolean',
    points: 2,
    note: 'Typisch: mehrere Zähne in beiden Kiefern einer Seite oder im gesamten Kiefer',
  },
  // ─── UNTERSUCHUNG ──────────────────────────────────────
  {
    key: 'u1_masseter_hypertrophy',
    section: 'untersuchung',
    label: 'Masseterhypertrophie',
    short: 'Masseterhypertrophie',
    type: 'boolean',
    points: 2,
    note: 'Bilaterale Palpation der Muskelbäuche entspannt + bei Kieferschluss; oft visuell erkennbar',
  },
  {
    key: 'u2_facets_eccentric',
    section: 'untersuchung',
    label: 'Kongruente Schliffacetten in exzentrischer Okklusion',
    short: 'Schliffacetten exzentrisch',
    type: 'boolean',
    points: 2,
    note: 'Mit Okklusionsfolie markierbar (im Gegensatz zu Erosionen)',
  },
  {
    key: 'u3_tongue_cheek_impressions',
    section: 'untersuchung',
    label: 'Zungen- und/oder Wangenimpressionen von Zähnen (z.B. Linea alba)',
    short: 'Zungen-/Wangenimpressionen',
    type: 'boolean',
    points: 2,
    note: 'Typisch unmittelbar nach Kieferpressen; anhaltende Aktivität → Hyperkeratosen',
  },
];

export const SECTIONS = [
  { id: 'anamnese', title: 'Anamnese', icon: 'A' },
  { id: 'untersuchung', title: 'Untersuchung', icon: 'U' },
];

export function getInitial() {
  const state = {};
  FIELDS.forEach(f => { state[f.key] = null; });
  return state;
}

// ─── BEWERTUNG ──────────────────────────────────────────
// Höchster Einzelwert bestimmt das Gesamtergebnis.
// 0 Punkte: Bruxismus unwahrscheinlich
// 1 Punkt (nur A1=ja): Möglicher Bruxismus
// ≥ 2 Punkte (mind. 1 Item A2-U3 = ja): Wahrscheinlicher Bruxismus
//
// Hinweis: Der Gesamtwert sagt NICHTS über die Intensität des Bruxismus aus.
export function evaluate(state) {
  const positives = FIELDS.filter(f => state[f.key] === true);
  const allAnswered = FIELDS.every(f => state[f.key] !== null);

  if (!allAnswered) {
    const remaining = FIELDS.filter(f => state[f.key] === null).length;
    return {
      result: 'incomplete',
      label: 'Befund unvollständig',
      detail: `${remaining} von ${FIELDS.length} Feldern noch nicht erhoben.`,
      severity: 'pending',
      maxPoints: positives.length === 0 ? 0 : Math.max(...positives.map(f => f.points)),
      positiveCount: positives.length,
    };
  }

  // Höchster Einzelwert ist entscheidend
  const maxPoints = positives.length === 0 ? 0 : Math.max(...positives.map(f => f.points));

  if (maxPoints === 0) {
    return {
      result: 'unlikely',
      label: 'Bruxismus unwahrscheinlich',
      detail: 'Alle Items mit "nein" beantwortet (0 Punkte).',
      severity: 'low',
      maxPoints: 0,
      positiveCount: 0,
    };
  }
  if (maxPoints === 1) {
    return {
      result: 'possible',
      label: 'Möglicher Bruxismus',
      detail: 'Nur Selbstauskunft (A1) positiv (1 Punkt). Weitere Anamnese und klinische Anzeichen erforderlich.',
      severity: 'medium',
      maxPoints: 1,
      positiveCount: positives.length,
    };
  }
  return {
    result: 'probable',
    label: 'Wahrscheinlicher Bruxismus',
    detail: `${positives.length} Item(s) positiv (höchster Einzelwert: 2 Punkte). Hinweis: Der Wert sagt nichts über die Intensität aus.`,
    severity: 'high',
    maxPoints: 2,
    positiveCount: positives.length,
  };
}

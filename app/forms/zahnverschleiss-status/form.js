// ═══════════════════════════════════════════════════════════════════
// Zahnverschleiß-Status — FORM
// Datenmodell nach TWES 2.0 (Tooth Wear Evaluation System)
// ═══════════════════════════════════════════════════════════════════

// FDI-Notation: alle 32 Zähne
export const TEETH_UPPER = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
export const TEETH_LOWER = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

// Sextanten-Zuordnung (für Generalisierungs-Auswertung)
export const SEXTANTS = {
  1: { teeth: [18, 17, 16, 15, 14], label: 'OK rechts', side: 'right', jaw: 'upper' },
  2: { teeth: [13, 12, 11, 21, 22, 23], label: 'OK Front', side: 'front', jaw: 'upper' },
  3: { teeth: [24, 25, 26, 27, 28], label: 'OK links', side: 'left', jaw: 'upper' },
  4: { teeth: [34, 35, 36, 37, 38], label: 'UK links', side: 'left', jaw: 'lower' },
  5: { teeth: [44, 43, 42, 41, 31, 32, 33], label: 'UK Front', side: 'front', jaw: 'lower' },
  6: { teeth: [48, 47, 46, 45, 44], label: 'UK rechts', side: 'right', jaw: 'lower' },
};

// Pathologie-Items (10)
export const PATHOLOGY_ITEMS = [
  { key: 'pat_hypersensitivity', label: 'Überempfindlichkeit und/oder Schmerz' },
  { key: 'pat_functional_problems', label: 'Funktionelle Probleme' },
  { key: 'pat_chipping', label: 'Abbröckeln von Zahnhartsubstanzen/Restaurationen' },
  { key: 'pat_aesthetic_decline', label: 'Verschlechterung des ästhetischen Erscheinungsbildes' },
  { key: 'pat_phonetic', label: 'Phonetische Beeinträchtigung' },
  { key: 'pat_rapid_progression', label: 'Schnelles Fortschreiten unter Monitoring' },
  { key: 'pat_age_atypical', label: 'Verschleiß in für das Alter untypischem Maße' },
  { key: 'pat_vd_loss', label: 'Verlust der vertikalen Dimension der Okklusion' },
  { key: 'pat_saliva_unfavorable', label: 'Speichelmenge oder -zusammensetzung ungünstig' },
  { key: 'pat_etiology_unmodifiable', label: 'Fehlende Möglichkeit zur Beeinflussung der ätiologischen Faktoren' },
];

// Chemische Faktoren (10)
export const CHEMICAL_ITEMS = [
  { key: 'chem_cupping', label: 'Okklusale Mulden, inzisale Rillen, Kraterbildung, Rundung' },
  { key: 'chem_non_occluding', label: 'Verschleiß an nicht okkludierenden Oberflächen / NCCL' },
  { key: 'chem_raised_restorations', label: '"Erhabene" Restaurationen' },
  { key: 'chem_concavities', label: 'Abflachung konvexer Bereiche / Konkavitäten, Breite > Tiefe' },
  { key: 'chem_translucency', label: 'Erhöhte inzisale Transluzenz' },
  { key: 'chem_clean_amalgam', label: 'Sauberes, nicht angelaufenes Erscheinungsbild von Amalgam' },
  { key: 'chem_enamel_collar', label: 'Erhalt einer Schmelzmanschette jenseits der Gingiva' },
  { key: 'chem_no_plaque', label: 'Keine Plaque, Verfärbungen oder Zahnstein' },
  { key: 'chem_hypersensitivity', label: 'Überempfindlichkeiten einzelner oder aller Zähne' },
  { key: 'chem_silky_surface', label: 'Glatte, seidig-glänzende Optik, matte Oberfläche' },
];

// Mechanische Faktoren (10)
export const MECHANICAL_ITEMS = [
  { key: 'mech_facets', label: 'Glänzende Facetten, flach und glänzend' },
  { key: 'mech_equal_wear', label: 'Schmelz- und Dentinverschleiß in gleichem Maße' },
  { key: 'mech_occluding', label: 'Verschleiß an okkludierenden Oberflächen' },
  { key: 'mech_fractures', label: 'Fraktur von Höckern oder Restaurationen' },
  { key: 'mech_impressions', label: 'Abdrücke der Zahnkonturen in Wangen, Zunge, Lippen' },
  { key: 'mech_nccl', label: 'Nicht-kariöse zervikale Läsionen vorhanden' },
  { key: 'mech_nccl_wide', label: 'NCCL sind breiter als tief' },
  { key: 'mech_premolar_canine', label: 'Zervikale Bereiche von Prämolaren/Eckzähnen betroffen' },
  { key: 'mech_enamel_cracks', label: 'Auftreten von Rissen im Zahnschmelz' },
  { key: 'mech_torus', label: 'Entwicklung eines Torus mandibulae' },
];

// Initial-State
export function getInitial() {
  const tooth = {};
  // Pro Zahn drei Flächen: bukkal, okklusal/inzisal, palatinal/lingual
  // Skala 0-4 nach TWES 2.0 (siehe prompt.js)
  [...TEETH_UPPER, ...TEETH_LOWER].forEach(t => {
    tooth[`tooth_${t}_buccal`] = null;
    tooth[`tooth_${t}_occlusal`] = null;
    tooth[`tooth_${t}_palatal`] = null;
    tooth[`tooth_${t}_missing`] = null;
  });

  const items = {};
  [...PATHOLOGY_ITEMS, ...CHEMICAL_ITEMS, ...MECHANICAL_ITEMS].forEach(i => {
    items[i.key] = null;
  });

  return {
    // Patientenkopf
    patient_number: null,
    patient_name: null,
    birth_date: null,
    examination_date: null,

    ...tooth,
    ...items,
    diagnosis: null,
  };
}

export const DEMO_UTTERANCES = [
  "Zahn 16 okklusal Grad 2, Zahn 26 okklusal Grad 3",
  "OK Front palatinal Grad 3 — alle Frontzähne betroffen",
  "Quadrant 1 okklusal alle Grad 1, Quadrant 4 okklusal alle Grad 2",
  "Zahn 36 fehlt, Zahn 46 okklusal Grad 4",
  "Pathologie: Überempfindlichkeit ja, funktionelle Probleme ja, Abbröckeln nein",
  "Chemische Faktoren: erhöhte Transluzenz ja, Schmelzmanschette ja, seidig-glänzende Optik ja",
  "Mechanische Faktoren: glänzende Facetten ja, Verschleiß okkludierend ja, Fraktur Höcker nein",
  "Diagnose: Generalisierter moderater Zahnverschleiß und lokalisiert erheblicher pathologischer Zahnverschleiß, überwiegend mechanisch und teilweise chemisch verursacht",
];

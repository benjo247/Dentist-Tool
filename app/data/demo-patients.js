// ═══════════════════════════════════════════════════════════════════
// Demo-Patienten — fiktive Daten für Demonstration
// Keine echten Personendaten. Wird im produktiven Multi-Tenant-Setup
// durch verschlüsselte DB-Daten ersetzt.
// ═══════════════════════════════════════════════════════════════════

export const DEMO_PATIENTS = [
  {
    id: 'demo-001',
    firstName: 'Anna',
    lastName: 'Demo-Bauer',
    birthDate: '1978-03-12',
    patientNumber: 'D-001',
    notes: 'CMD seit 2 Jahren, Schienentherapie aktiv',
    initials: 'AB',
    color: 'cyan',
    examinations: [
      {
        id: 'exam-001-1',
        formId: 'funktionsstatus',
        date: '2025-11-08',
        status: 'completed',
        summary: 'Mundöffnung 32 mm aktiv, Knacken links terminal, Masseter beidseits Schmerz',
        snapshot: {
          mouth_opening_active_mm: 32,
          mouth_opening_passive_mm: 38,
          laterotrusion_left_mm: 6, laterotrusion_right_mm: 8,
          protrusion_mm: 5,
          muscle_mass_belly_left: 2, muscle_mass_belly_right: 2,
          muscle_temp_ant_left: 1, muscle_temp_ant_right: 1,
          pain_temples_left: true, pain_temples_vas_left: 7,
          pain_temples_right: true, pain_temples_vas_right: 6,
          joint_sounds_left: true, joint_sounds_right: false,
        },
      },
      {
        id: 'exam-001-2',
        formId: 'funktionsstatus',
        date: '2026-02-14',
        status: 'completed',
        summary: 'Mundöffnung 36 mm, Schmerzwerte deutlich reduziert nach 3 Monaten Schiene',
        snapshot: {
          mouth_opening_active_mm: 36,
          mouth_opening_passive_mm: 42,
          laterotrusion_left_mm: 8, laterotrusion_right_mm: 9,
          protrusion_mm: 6,
          muscle_mass_belly_left: 1, muscle_mass_belly_right: 1,
          muscle_temp_ant_left: 0, muscle_temp_ant_right: 0,
          pain_temples_left: true, pain_temples_vas_left: 4,
          pain_temples_right: true, pain_temples_vas_right: 3,
          joint_sounds_left: true, joint_sounds_right: false,
        },
      },
      {
        id: 'exam-001-3',
        formId: 'bsi',
        date: '2025-11-08',
        status: 'completed',
        summary: 'Wahrscheinlicher Bruxismus — 3 Items positiv',
        snapshot: {
          a1_self_report: true,
          a2_muscle_complaints: true,
          a3_temporal_headache: true,
          a4_sensitive_teeth: false,
          u1_masseter_hypertrophy: true,
          u2_facets_eccentric: true,
          u3_tongue_cheek_impressions: false,
        },
      },
    ],
  },
  {
    id: 'demo-002',
    firstName: 'Markus',
    lastName: 'Demo-Hoffmann',
    birthDate: '1965-09-23',
    patientNumber: 'D-002',
    notes: 'Vor PA-Therapie Bruxismus-Abklärung',
    initials: 'MH',
    color: 'emerald',
    examinations: [
      {
        id: 'exam-002-1',
        formId: 'cmd-screening',
        date: '2026-01-22',
        status: 'completed',
        summary: 'CMD-Screening unauffällig — keine erweiterte Diagnostik nötig',
        snapshot: {
          a1_pain_face_jaw: false,
          u1_palp_masseter: false,
          u2_joint_sounds: false,
          u3_palp_joint: false,
          u4_pain_opening: false,
          u5_limited_opening: false,
          u6_occlusion_disorder: false,
        },
      },
      {
        id: 'exam-002-2',
        formId: 'zahnverschleiss-screening',
        date: '2026-01-22',
        status: 'completed',
        summary: 'Moderater Verschleiß S2 + S5, kein Progressions-Anzeichen',
        snapshot: {
          occlusal_S1: 1, occlusal_S2: 2, occlusal_S3: 1,
          occlusal_S4: 1, occlusal_S5: 2, occlusal_S6: 1,
          palatal_S2: 1,
          sign_progression_concern: false,
          etiology_mechanical: true,
          etiology_chemical: false,
        },
      },
    ],
  },
  {
    id: 'demo-003',
    firstName: 'Sabine',
    lastName: 'Demo-Krause',
    birthDate: '1982-06-04',
    patientNumber: 'D-003',
    notes: 'Erstvorstellung mit Kopfschmerzen und Knirschen',
    initials: 'SK',
    color: 'rose',
    examinations: [
      {
        id: 'exam-003-1',
        formId: 'cmd-screening',
        date: '2026-03-15',
        status: 'completed',
        summary: 'Erweiterte Diagnostik indiziert — Anamnese und Untersuchung positiv',
        snapshot: {
          a1_pain_face_jaw: true,
          u1_palp_masseter: true,
          u2_joint_sounds: true,
          u3_palp_joint: false,
          u4_pain_opening: true,
          u5_limited_opening: false,
          u6_occlusion_disorder: false,
        },
      },
      {
        id: 'exam-003-2',
        formId: 'bsi',
        date: '2026-03-15',
        status: 'completed',
        summary: 'Wahrscheinlicher Bruxismus — alle Anamnese-Items positiv',
        snapshot: {
          a1_self_report: true,
          a2_muscle_complaints: true,
          a3_temporal_headache: true,
          a4_sensitive_teeth: true,
          u1_masseter_hypertrophy: false,
          u2_facets_eccentric: true,
          u3_tongue_cheek_impressions: true,
        },
      },
      {
        id: 'exam-003-3',
        formId: 'funktionsstatus',
        date: '2026-03-22',
        status: 'completed',
        summary: 'Vollständiger Status — myofasziale Komponente, Knacken beidseits',
        snapshot: {
          mouth_opening_active_mm: 41,
          mouth_opening_passive_mm: 47,
          laterotrusion_left_mm: 9, laterotrusion_right_mm: 10,
          protrusion_mm: 7,
          muscle_mass_belly_left: 2, muscle_mass_belly_right: 1,
          muscle_temp_ant_left: 2, muscle_temp_ant_right: 2,
          muscle_temp_med_left: 1, muscle_temp_med_right: 1,
          pain_temples_left: true, pain_temples_vas_left: 6,
          pain_temples_right: true, pain_temples_vas_right: 7,
          pain_neck_left: true, pain_neck_vas_left: 5,
          pain_neck_right: true, pain_neck_vas_right: 5,
          joint_sounds_left: true, joint_sounds_right: true,
        },
      },
    ],
  },
  {
    id: 'demo-004',
    firstName: 'Klaus',
    lastName: 'Demo-Schneider',
    birthDate: '1955-11-30',
    patientNumber: 'D-004',
    notes: 'Vor Implantatversorgung — Funktion abklären',
    initials: 'KS',
    color: 'amber',
    examinations: [
      {
        id: 'exam-004-1',
        formId: 'funktionsstatus',
        date: '2025-09-05',
        status: 'completed',
        summary: 'Funktion altersentsprechend, leichter Verschleiß',
        snapshot: {
          mouth_opening_active_mm: 44,
          mouth_opening_passive_mm: 50,
          laterotrusion_left_mm: 10, laterotrusion_right_mm: 11,
          protrusion_mm: 8,
          muscle_mass_belly_left: 0, muscle_mass_belly_right: 0,
          muscle_temp_ant_left: 0, muscle_temp_ant_right: 0,
          abrasions_attrition: true,
          wedge_defects: true,
        },
      },
      {
        id: 'exam-004-2',
        formId: 'zahnverschleiss-screening',
        date: '2025-09-05',
        status: 'completed',
        summary: 'Generalisiert moderater Verschleiß — Status indiziert',
        snapshot: {
          occlusal_S1: 2, occlusal_S2: 2, occlusal_S3: 2,
          occlusal_S4: 2, occlusal_S5: 3, occlusal_S6: 2,
          palatal_S2: 1,
          sign_progression_concern: true,
          etiology_mechanical: true,
          etiology_chemical: true,
        },
      },
    ],
  },
  {
    id: 'demo-005',
    firstName: 'Julia',
    lastName: 'Demo-Wagner',
    birthDate: '1991-04-17',
    patientNumber: 'D-005',
    notes: 'Sportlerin, Druckkopfschmerzen',
    initials: 'JW',
    color: 'violet',
    examinations: [
      {
        id: 'exam-005-1',
        formId: 'cmd-screening',
        date: '2026-04-10',
        status: 'completed',
        summary: 'Erweiterte Diagnostik kann erfolgen — milde Symptomatik',
        snapshot: {
          a1_pain_face_jaw: true,
          u1_palp_masseter: false,
          u2_joint_sounds: false,
          u3_palp_joint: false,
          u4_pain_opening: false,
          u5_limited_opening: false,
          u6_occlusion_disorder: false,
        },
      },
    ],
  },
];

export function getPatient(id) {
  return DEMO_PATIENTS.find(p => p.id === id);
}

export function getExaminationsByPatient(patientId) {
  const patient = getPatient(patientId);
  return patient ? patient.examinations : [];
}

// Hilfsfunktion: Alle Untersuchungen sortiert nach Datum
export function getAllExaminations() {
  return DEMO_PATIENTS.flatMap(p =>
    p.examinations.map(e => ({ ...e, patient: p }))
  ).sort((a, b) => b.date.localeCompare(a.date));
}

// Verlaufsdaten für ein bestimmtes Feld über alle Untersuchungen eines Patienten
export function getFieldHistory(patientId, fieldKey) {
  const patient = getPatient(patientId);
  if (!patient) return [];
  return patient.examinations
    .filter(e => e.snapshot && fieldKey in e.snapshot)
    .map(e => ({ date: e.date, value: e.snapshot[fieldKey], examId: e.id, formId: e.formId }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

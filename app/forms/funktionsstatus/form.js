// ═══════════════════════════════════════════════════════════════════
// Funktionsstatus — Konstanten und Initial-State
// ═══════════════════════════════════════════════════════════════════

export const TEETH_UPPER = ['18','17','16','15','14','13','12','11','21','22','23','24','25','26','27','28'];
export const TEETH_LOWER = ['48','47','46','45','44','43','42','41','31','32','33','34','35','36','37','38'];
export const ALL_TEETH = [...TEETH_UPPER, ...TEETH_LOWER];

export const MUSCLES = [
  ['muscle_temp_ant', 'M. temporalis · pars anterior'],
  ['muscle_temp_med', 'M. temporalis · pars media'],
  ['muscle_temp_post', 'M. temporalis · pars posterior'],
  ['muscle_temp_tendon', 'Sehne M. temporalis'],
  ['muscle_mass_origin', 'Masseter superficialis · Ursprung'],
  ['muscle_mass_belly', 'Masseter superficialis · Bauch'],
  ['muscle_mass_insert', 'Masseter superficialis · Ansatz'],
  ['muscle_postmand', 'Regio postmandibularis'],
  ['muscle_submand', 'Regio submandibularis'],
  ['muscle_pterygoid', 'M. pterygoideus lateralis'],
  ['muscle_subocc', 'Subokzipital · Nacken'],
];

export const PAIN_REGIONS = [
  ['pain_head', 'Kopf'],
  ['pain_temples', 'Schläfen'],
  ['pain_ear_jaw', 'Ohr / Kiefergelenk'],
  ['pain_neck', 'Nacken'],
  ['pain_shoulder', 'Schulter'],
];

export function getInitial() {
  return {
    // Anamnese
    visit_reason: null,
    recent_treatment_dentist: null, recent_treatment_orthodontist: null, recent_treatment_doctor: null,
    previous_function_therapy: null, previous_function_therapy_type: null,
    head_neck_trauma: null,
    pain_head_left: null, pain_head_right: null,
    pain_head_vas_left: null, pain_head_vas_right: null,
    pain_temples_left: null, pain_temples_right: null,
    pain_temples_vas_left: null, pain_temples_vas_right: null,
    pain_ear_jaw_left: null, pain_ear_jaw_right: null,
    pain_ear_jaw_vas_left: null, pain_ear_jaw_vas_right: null,
    pain_neck_left: null, pain_neck_right: null,
    pain_neck_vas_left: null, pain_neck_vas_right: null,
    pain_shoulder_left: null, pain_shoulder_right: null,
    pain_shoulder_vas_left: null, pain_shoulder_vas_right: null,
    pain_other: null, pain_other_location: null,
    pain_vas: null, pain_impact_vas: null,
    pain_radiating: null, pain_radiating_location: null,
    pain_quality: null,
    pain_time_morning: null, pain_time_during_day: null, pain_time_evening: null, pain_time_specific_occasion: null,
    pain_duration_minutes: null, pain_duration_hours: null,
    pain_frequency: null,
    complaints_first_appeared: null,
    chewing_impaired: null, chewing_painful: null,
    jaw_opening_impaired: null, jaw_opening_painful: null,
    jaw_closing_impaired: null, jaw_closing_painful: null,
    jaw_other_movement_impaired: null, jaw_other_movement_painful: null,
    chewing_side: null,
    joint_sounds_left: null, joint_sounds_right: null, joint_sounds_since: null,
    teeth_painful: null,
    teeth_fit_correctly: null,
    numbness_head_face: null,
    additional_anamnesis: null,
    // Kiefergelenk
    joint_palp_lateral_left: null, joint_palp_lateral_right: null,
    joint_palp_dorsal_left: null, joint_palp_dorsal_right: null,
    auscultation_events: [],
    // Muskulatur
    ...Object.fromEntries(MUSCLES.flatMap(([k]) => [[`${k}_left`, null], [`${k}_right`, null]])),
    // Mobilität
    mouth_opening_active_mm: null, mouth_opening_passive_mm: null,
    laterotrusion_left_mm: null, laterotrusion_right_mm: null,
    protrusion_mm: null, retrusion_mm: null,
    // Kieferrelation & Okklusion
    gliding_zo_ho: null,
    gliding_right_mm: null, gliding_middle_mm: null, gliding_left_mm: null, gliding_vertical_mm: null,
    vertical_relation: null,
    static_occlusion: {},
    dynamic_occlusion: {
      RL: { fz: null, pm_li: null, pm_re: null, m_li: null, m_re: null },
      LL: { fz: null, pm_li: null, pm_re: null, m_li: null, m_re: null },
      P:  { fz: null, pm_li: null, pm_re: null, m_li: null, m_re: null },
    },
    // Weitere Befunde
    abrasions_attrition: null, wedge_defects: null, tongue_impressions: null, cheek_impressions: null,
    other_findings: null,
    // Diagnostik
    manual_structure_analysis: null, orthopedic_screening: null, psychosocial_screening: null,
    instrumental_function_analysis: null, instrumental_occlusion_analysis: null,
    consultation: null,
    consult_mri: null, consult_ct: null, consult_arthroscopy: null,
    consult_orthodontics: null, consult_mkg: null, consult_ent: null,
    consult_orthopedics: null, consult_rheumatology: null, consult_internal: null,
    consult_neurology: null, consult_psychosomatic: null,
    consult_other: null, consult_other_text: null,
    // Diagnose
    initial_diagnosis: null,
    // Therapie initial
    splint: null, splint_type: null,
    physical_therapy: null,
    pt_massage: null, pt_heat: null, pt_cold: null, pt_electro: null,
    manual_therapy: null, exercises: null, medication: null, relaxation: null,
    therapy_other_initial: null, therapy_other_initial_text: null,
    // Therapie weitere
    selective_grinding: null, restorative_prosthetic: null, permanent_splint: null,
    psychosomatic_therapy: null, orthodontics_therapy: null,
    orthodontic_surgery: null, joint_surgery: null,
    therapy_other_further: null, therapy_other_further_text: null,
    // Beiblatt GOZ
    goz_8000: null, goz_8010: null, goz_8020: null, goz_8030: null, goz_8035: null, goz_8050: null,
    goz_8060: null, goz_8065: null, goz_8080: null, goz_8090: null, goz_8100: null,
    // Indikationen
    indication_function_pretreatment: null, indication_jaw_muscle: null, indication_dysgnathy: null,
    indication_periodontal: null, indication_dentition_reconstruction: null,
    indication_kfo_planning: null, indication_extensive_restoration: null,
    indication_chronic_pain: null,
    indication_other: null, indication_other_text: null,
    // Versorgung
    supply_chart: {},
    treatment_planning_notes: null,
    // Patientenauswertung Schienentherapie (Sektion 13)
    splint_manufacturer: null,  // 'myosa' | 'osa' | 'aqualizer' | 'sci' | 'other'
    splint_manufacturer_other: null,  // Freitext wenn 'other' gewählt
    splint_main_complaints: null,
    splint_treatment_goals: null,
    splint_headache: null, splint_headache_intensity: null,
    splint_neck_pain: null, splint_neck_pain_intensity: null,
    splint_joint_clicking: null, splint_joint_clicking_intensity: null,
    splint_limited_opening: null, splint_limited_opening_intensity: null,
    splint_max_opening_mm: null,
    splint_ear_pain_tinnitus: null, splint_ear_pain_intensity: null,
    splint_atypical_facial_pain: null, splint_facial_pain_intensity: null,
    splint_breathing_mode: null,
    splint_lip_closure: null,
    splint_tonsils_grade: null,
    splint_snoring: null, splint_apnea: null,
    splint_restless_sleep: null, splint_morning_fatigue: null,
    splint_sleep_study_done: null,
    splint_tongue_position: null,
    splint_tongue_correction_needed: null,
    splint_swallow_tongue_thrust: null,
    splint_swallow_mentalis_activity: null,
    splint_swallow_myofunctional_therapy_needed: null,
    splint_cheek_muscles: null,
    splint_cheek_exercises_needed: null,
    splint_maxilla_shape: null,
    splint_crowding: null,
    splint_class: null,
    splint_bite: null,
    splint_posture_head_forward: null,
    splint_posture_pelvic_tilt: null,
    splint_posture_shoulder_drop: null,
    splint_recommended_appliance: null,
    splint_special_notes: null,
  };
}

export const DEMO_UTTERANCES = [
  "Grund des Besuchs: zunehmende Kieferschmerzen seit drei Wochen. Schmerzstärke 6, Beeinträchtigung 4",
  "Schläfen links Stärke 7, Nacken beidseits Stärke 5, Schulter rechts Stärke 8",
  "Kopfschmerz links VAS 4, Ohr und Kiefergelenk rechts VAS 9",
  "Kein Kopfschmerz, keine Schläfenschmerzen, kein Nacken",
  "Schmerzqualität dumpf, morgens und abends, zwei Stunden Dauer, täglich, erstmals vor sechs Monaten",
  "Mundöffnung aktiv 38 Millimeter, passiv 44, Laterotrusion links 9 rechts 11, Protrusion 6",
  "Knacken links beim Öffnen terminal, rechts unauffällig, Geräusche links seit drei Monaten",
  "Alle Temporalis-Anteile beidseits unauffällig, Masseter superficialis Bauch links Schmerz, rechts Missempfindung",
  "Quadrant 1 alle ZO Kontakt, Zahn 16 HO schwach, Zahn 26 fehlt",
  "Bei Rechtslateral Frontzahnführung, bei Linkslateral Eckzahnführung, Protrusion alle Frontzähne",
  "Initialdiagnose: Myofasziale Dysfunktion mit anteriorer Diskusverlagerung links",
];

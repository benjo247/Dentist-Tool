// ═══════════════════════════════════════════════════════════════════
// Manuelle Strukturanalyse — FORM
// Datenmodell und Initial-State
// ═══════════════════════════════════════════════════════════════════

export function getInitial() {
  return {
    // ─── 1. KOMPRESSION IN DER STATIK (passive Kompression) ─────
    // Skala: 0=unauffällig, 1=Missempfindung, 2=Schmerz
    // Pro Test ein Wert je Seite (links/rechts)
    static_kranial_left: null,
    static_kranial_right: null,
    static_dorsokranial_zkp_left: null,        // 2.1 dorsokranial (ZKP)
    static_dorsokranial_zkp_right: null,
    static_dorsokranial_lat_left: null,        // 2.2 dorsokranial (Laterotrusion)
    static_dorsokranial_lat_right: null,
    static_dorsal_zkp_left: null,              // 3.1 dorsal (ZKP)
    static_dorsal_zkp_right: null,
    static_dorsal_lat_left: null,              // 3.2 dorsal (Laterotrusion)
    static_dorsal_lat_right: null,

    // ─── 2. TRAKTION / TRANSLATION ──────────────────────────────
    // Pro Test 4 Werte: Schmerz und Endgefühl je links/rechts
    // Endgefühl: "weich" | "fest" | "hart" | null
    traction_pain_left: null, traction_endfeel_left: null,
    traction_pain_right: null, traction_endfeel_right: null,
    ventrokaudal_pain_left: null, ventrokaudal_endfeel_left: null,
    ventrokaudal_pain_right: null, ventrokaudal_endfeel_right: null,
    lateral_pain_left: null, lateral_endfeel_left: null,
    lateral_pain_right: null, lateral_endfeel_right: null,
    medial_pain_left: null, medial_endfeel_left: null,
    medial_pain_right: null, medial_endfeel_right: null,

    // ─── 3. KOMPRESSION IN DER DYNAMIK ──────────────────────────
    // "+" = stärker/später, "0" = unverändert, "-" = schwächer/früher
    dynamic_sound_intensity_left: null,
    dynamic_sound_intensity_right: null,
    dynamic_sound_timing_left: null,
    dynamic_sound_timing_right: null,

    // ─── 4. ISOMETRIE ───────────────────────────────────────────
    // Pro Bewegung: Schmerz (0/1/2) und Muskelkraft je Seite
    // Muskelkraft 0-5 (medizinische Standard-Skala)
    iso_opening_pain_left: null, iso_opening_force_left: null,
    iso_opening_pain_right: null, iso_opening_force_right: null,
    iso_closing_pain_left: null, iso_closing_force_left: null,
    iso_closing_pain_right: null, iso_closing_force_right: null,
    iso_rl_pain_left: null, iso_rl_force_left: null,           // Rechtslateralbewegung
    iso_rl_pain_right: null, iso_rl_force_right: null,
    iso_ll_pain_left: null, iso_ll_force_left: null,           // Linkslateralbewegung
    iso_ll_pain_right: null, iso_ll_force_right: null,

    // ─── 5. INITIALDIAGNOSE(N) ──────────────────────────────────
    initial_diagnosis: null,
  };
}

export const DEMO_UTTERANCES = [
  "Statik kranial beidseits unauffällig",
  "Dorsokranial ZKP links Schmerz, rechts Missempfindung",
  "Statik dorsal ZKP beidseits unauffällig, dorsal Laterotrusion links Missempfindung",
  "Kaudaltraktion links Schmerz, Endgefühl fest, rechts unauffällig",
  "Ventrokaudale Translation beidseits unauffällig, Endgefühl weich",
  "Laterale Translation links Missempfindung, mediale Translation beidseits unauffällig",
  "Geräuschintensität dynamisch links plus, rechts null",
  "Geräuschzeitpunkt links später, rechts unverändert",
  "Isometrie Kieferöffnung links Schmerz Stärke 2, Muskelkraft 4",
  "Isometrie Kieferschluss beidseits unauffällig, Muskelkraft 5",
  "Rechtslateralbewegung links Missempfindung, Muskelkraft 4",
  "Linkslateralbewegung beidseits unauffällig, Kraft 5",
  "Initialdiagnose: Kapsulitis links mit anteriorer Diskusverlagerung ohne Reposition",
];

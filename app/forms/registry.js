// ═══════════════════════════════════════════════════════════════════
// Forms-Registry
// Zentrale Liste aller verfügbaren Befundbögen.
// Jedes Formular ist ein eigenständiges Modul mit:
//   - meta:    Anzeigename, Beschreibung, Copyright, Status
//   - initial: leerer Befund-State (was die UI rendert)
//   - prompt:  System-Prompt für die LLM-Sprach-Extraktion
//   - View:    React-Component die das Formular rendert
// ═══════════════════════════════════════════════════════════════════

import * as funktionsstatus from './funktionsstatus';
import * as cmdScreening from './cmd-screening';
import * as bsi from './bsi';
import * as zahnverschleissScreening from './zahnverschleiss-screening';
import * as zahnverschleissStatus from './zahnverschleiss-status';
import * as manuelleStrukturanalyse from './manuelle-strukturanalyse';

export const FORMS = {
  funktionsstatus: {
    id: 'funktionsstatus',
    ...funktionsstatus.META,
    getInitial: funktionsstatus.getInitial,
    getPrompt: funktionsstatus.getPrompt,
    View: funktionsstatus.View,
    AnatomyView: funktionsstatus.AnatomyView,
    DEMO_UTTERANCES: funktionsstatus.DEMO_UTTERANCES || [],
  },
  'cmd-screening': {
    id: 'cmd-screening',
    ...cmdScreening.META,
    getInitial: cmdScreening.getInitial,
    getPrompt: cmdScreening.getPrompt,
    View: cmdScreening.View,
    DEMO_UTTERANCES: cmdScreening.DEMO_UTTERANCES || [],
  },
  bsi: {
    id: 'bsi',
    ...bsi.META,
    getInitial: bsi.getInitial,
    getPrompt: bsi.getPrompt,
    View: bsi.View,
    DEMO_UTTERANCES: bsi.DEMO_UTTERANCES || [],
  },
  'zahnverschleiss-screening': {
    id: 'zahnverschleiss-screening',
    ...zahnverschleissScreening.META,
    getInitial: zahnverschleissScreening.getInitial,
    getPrompt: zahnverschleissScreening.getPrompt,
    View: zahnverschleissScreening.View,
    DEMO_UTTERANCES: zahnverschleissScreening.DEMO_UTTERANCES || [],
  },
  'zahnverschleiss-status': {
    id: 'zahnverschleiss-status',
    ...zahnverschleissStatus.META,
    getInitial: zahnverschleissStatus.getInitial,
    getPrompt: zahnverschleissStatus.getPrompt,
    View: zahnverschleissStatus.View,
    DEMO_UTTERANCES: [],
  },
  'manuelle-strukturanalyse': {
    id: 'manuelle-strukturanalyse',
    ...manuelleStrukturanalyse.META,
    getInitial: manuelleStrukturanalyse.getInitial,
    getPrompt: manuelleStrukturanalyse.getPrompt,
    View: manuelleStrukturanalyse.View,
    DEMO_UTTERANCES: [],
  },
};

// Reihenfolge im Switcher (von einfach nach komplex)
export const FORM_ORDER = [
  'cmd-screening',
  'bsi',
  'zahnverschleiss-screening',
  'funktionsstatus',
  'zahnverschleiss-status',
  'manuelle-strukturanalyse',
];

export function getForm(id) {
  return FORMS[id] || null;
}

export function listForms() {
  return FORM_ORDER.map(id => ({
    id,
    label: FORMS[id].label,
    shortLabel: FORMS[id].shortLabel,
    description: FORMS[id].description,
    status: FORMS[id].status,  // 'ready' | 'beta' | 'wip'
    fieldCount: FORMS[id].fieldCount,
  }));
}

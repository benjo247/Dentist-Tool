# VoxDent — Sprach-Erfassung für zahnärztliche Befundbögen (Demo-Prototyp)

Demo-Prototyp für **sprachgestützte Befunderfassung** in Zahnarztpraxen.
Multi-Form-Architektur mit aktuell 6 DGFDT-Bögen (4 funktionsfähig + 2 in Arbeit).

> Dies ist der **Single-Tenant-Demo-Prototyp** zum Vorführen der Sprach-UI.
> Das produktive Multi-Tenant-SaaS liegt im separaten Repo `funktionsstatus-app`.

---

## Verfügbare Befundbögen

Alle Bögen sind die offiziellen Vorlagen der **Deutschen Gesellschaft für Funktionsdiagnostik und -therapie (DGFDT)**.
Die DGFDT erlaubt Software-Herstellern die kostenfreie Nutzung der Bögen, wenn sie als DGFDT-Befundbögen
gekennzeichnet sind und das Urheberrecht in der Fußzeile genannt wird.

| Bogen | Status | Felder | Dauer |
|---|---|---|---|
| **CMD-Screening** | Ready | 7 | ~3 min |
| **BSI** (Bruxismus-Screening-Index) | Ready | 7 | ~3 min |
| **Zahnverschleiß-Screening** (TWES 2.0 kompakt) | Ready | 12 | ~5 min |
| **Klinischer Funktionsstatus** | Ready | ~80 | ~25 min |
| **Zahnverschleiß-Status** (TWES 2.0 vollständig) | WIP | ~256 | ~30 min |
| **Manuelle Strukturanalyse** | WIP | ~120 | ~20 min |

---

## Architektur

```
app/
├── forms/
│   ├── registry.js                 ← Zentrale Form-Registry
│   ├── cmd-screening/              ← Pro Formular ein Modul:
│   │   ├── meta.js                   - Anzeigename, Copyright, Status
│   │   ├── form.js                   - Felder, Sektionen, Initial-State, Bewertung
│   │   ├── prompt.js                 - LLM-System-Prompt für Spracherkennung
│   │   ├── view.jsx                  - React-View-Component
│   │   └── index.js                  - Barrel-Export
│   ├── bsi/                         (gleiche Struktur)
│   ├── zahnverschleiss-screening/   (gleiche Struktur)
│   ├── funktionsstatus/             (gleiche Struktur)
│   ├── zahnverschleiss-status/     ← WIP-Stub
│   └── manuelle-strukturanalyse/   ← WIP-Stub
├── components/
│   └── form-switcher.jsx           ← Dropdown im Header
├── api/parse/route.js              ← LLM-API mit dynamischem Prompt-Loading
├── page.js                          ← Generische Orchestrierung
├── layout.js
└── globals.css
```

**Neues Formular hinzufügen:**

1. Neuer Ordner `app/forms/<formularname>/`
2. Vier Dateien: `meta.js`, `form.js`, `prompt.js`, `view.jsx` (Pattern aus `cmd-screening/` kopieren)
3. `index.js` Barrel mit Re-Exports
4. In `app/forms/registry.js`: Import + Eintrag in `FORMS` und `FORM_ORDER`

Fertig. Form-Switcher, API-Route, Sidebar-Voice-UI funktionieren automatisch.

---

## Setup

```bash
npm install
cp .env.example .env.local
# ANTHROPIC_API_KEY in .env.local eintragen
npm run dev
```

Öffnen unter `http://localhost:3000`.

---

## Stack

- Next.js 14 App Router
- Anthropic Claude Sonnet 4 (direkt-API für Demo)
- Web Speech API (Browser-Spracherkennung, kostenlos)
- Tailwind CSS, lucide-react

---

## Lizenzhinweise

Befundbögen © Deutsche Gesellschaft für Funktionsdiagnostik und -therapie (DGFDT):
- CMD-Screening © Peroz, Faulhaber, Ahlers, Lange, Mentler, Wolowski, Ottl 2024
- BSI © Lange, Ahlers, Mentler, Ottl, Peroz, Wolowski 2019
- Zahnverschleiß-Screening/-Status © DGFDT 2025, basierend auf TWES 2.0
- Klinischer Funktionsstatus © Ottl, Ahlers, Lange, Utz, Reiber 2011
- Manuelle Strukturanalyse © DGFDT 2012

Verwendet gemäß Software-Lizenz der DGFDT (https://www.dgfdt.de/richtlinien_formulare).

Sektion 13 des Funktionsstatus (Myosa® TMJBDS) © Myofunctional Research Co.

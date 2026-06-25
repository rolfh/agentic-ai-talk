# Oppgave 08 — KONTORET (realistisk ombygging av Room2.tsx)

LES `agy-tasks/STYLE.md` FØRST. Fil du eier: `src/components/Room2.tsx` (rør KUN den).
Erstatt HELE dagens neon-sci-fi-innhold med en realistisk kontorscene.

## Tema & stemning
Lyst, ryddig kontor med store vinduer og dagslys (lysere enn stua). Tema: «på dine
egne filer» — agenten som jobber på filene dine. Bruk `<Model>` (scale 1).

## Møblering
To–tre arbeidsplasser: `metal_office_desk` med `classic_laptop` + `desk_lamp_arm_01`
+ en stol (`SchoolChair_01` eller `modern_arm_chair_01`). En `drawer_cabinet` og en
`wooden_bookshelf_worn` med `book_encyclopedia_set_01` langs vegg. `potted_plant_02` for liv.
Lag gjerne et vindu i veggen (lys flate / ramme) som slipper inn dagslys.

## Lineære stasjoner (rekkefølge langs en sti!)
1. **hva_kan_agent_gjoere** — `/tts/hva_kan_agent_gjoere.mp3` + `.json`. "1" + "På dine filer".
2. **fil_rydde_mappe** — `/tts/fil_rydde_mappe.mp3` + `.json`. "2" + "Rydde en mappe".
3. **fil_pdf_regneark** — `/tts/fil_pdf_regneark.mp3` + `.json`. "3" + "30 PDF → 1 ark".
4. **tusen_problemer** — `/tts/tusen_problemer.mp3` + `.json`. "4" + "Det forenende grepet".
Plasser dem i rekkefølge langs en synlig sti (løper/lys/møblering som leder framover).

## Dører
- `room3` label "Postrommet" — VIDERE.
- `lobby` label "Tilbake til stua" — TILBAKE.

Følg verifiseringen i STYLE.md.

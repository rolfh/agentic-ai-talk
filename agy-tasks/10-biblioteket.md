# Oppgave 10 — BIBLIOTEKET (realistisk ombygging av Room4.tsx)

LES `agy-tasks/STYLE.md` FØRST. Fil du eier: `src/components/Room4.tsx` (rør KUN den).
Erstatt HELE dagens neon-sci-fi/kort-innhold med en realistisk scene.

## Tema & stemning
Lun lesesal/bibliotek: bokhyller langs veggene, varmt lampelys, en stol å sette seg i.
Tema: styre agenten + spør tunge dokumenter. Bruk `<Model>` (scale 1).

## Møblering
Flere `wooden_bookshelf_worn` langs veggene (lag en vegg av hyller), fylt med
`book_encyclopedia_set_01` og `decorative_book_set_01`. En `mid_century_lounge_chair`
ved et `round_wooden_table_01` med `vintage_oil_lamp`. `modern_ceiling_lamp_01` i taket,
`potted_plant_01` i et hjørne. Varmt og lunt.

## Lineære stasjoner (rekkefølge!)
1. **hvordan_prompte** — `/tts/hvordan_prompte.mp3` + `.json`. "1" + "Hvordan prompte".
2. **fremgangsmaate** — `/tts/fremgangsmaate.mp3` + `.json`. "2" + "Fremgangsmåte".
3. **agents_md** — `/tts/agents_md.mp3` + `.json`. "3" + "AGENTS.md".
4. **styre_agenter** — `/tts/styre_agenter.mp3` + `.json`. "4" + "Globale vs. Skills".
5. **fil_spor_dokument** — `/tts/fil_spor_dokument.mp3` + `.json`. "5" + "Spør et dokument".
Plasser i rekkefølge langs en synlig sti gjennom biblioteket.

## Dører
- `room3` label "Tilbake til postrommet" — TILBAKE.
- `lobby` label "Hjem til stua" — HJEM.

Følg verifiseringen i STYLE.md.

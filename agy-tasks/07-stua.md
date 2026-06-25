# Oppgave 07 — STUA (realistisk ombygging av Lobby.tsx)

LES `agy-tasks/STYLE.md` FØRST. Fil du eier: `src/components/Lobby.tsx` (rør KUN den).
Dette er START-området (spilleren spawner her) og introen til reisen.

## Tema & stemning
Lun, realistisk stue, kveldslys. Dette er hjemmet man starter i. Erstatt ALLE Kenney
`<Furniture>`-elementer med realistiske `<Model>` (se STYLE.md). Behold det varme
tregulvet (laminat-teksturene) og taket.

## Møblering (bruk `<Model>`, scale 1)
Stue-vignett: `sofa_03`, to `mid_century_lounge_chair` (eller `modern_arm_chair_01`)
rundt `modern_coffee_table_01`, `side_table_01` med `vintage_oil_lamp` eller
`desk_lamp_arm_01`, en `wooden_bookshelf_worn` mot vegg med `decorative_book_set_01`,
`Television_01` på en `drawer_cabinet`, et par `potted_plant_01/02`, og en
`modern_ceiling_lamp_01` i taket. Gjør det innbydende, ikke tomt.

## Lineære stasjoner (rekkefølge!)
1. **stua_intro** — ved spawn/inngangen: `audioUrl="/tts/stua_intro.mp3"`, `subtitleUrl="/tts/stua_intro.json"`. Flytende "1" + "Velkommen".
2. **claude_cowork** — litt lenger inn: `/tts/claude_cowork.mp3` + `.json`. Flytende "2" + "Cowork".

## Dører (3 stk)
- `room2` label "Kontoret" — **START-DØRA**, fremhevet (varmt spotlys + dørmatte-følelse, tydeligst).
- `room3` label "Postrommet" — sekundær snarvei.
- `room4` label "Biblioteket" — sekundær snarvei.
Behold dagens dør-posisjoner/rotasjoner omtrent (3 vegger), tilpass til møbleringen.

## Behold
- `useTexture`-gulvet + preloads.
- Varm belysning (juster til realistisk look).

Følg verifiseringen i STYLE.md.

# Felles stilguide — realistiske områder

Les denne FØR du gjør en rom-oppgave (07–10). Du står i prosjektets ROTMAPPE.
Ikke kjør `find`/`grep -r` over disken — bruk relative stier direkte.

## Look
Realistisk PBR, varmt og stemningsfullt. Vekk fra flatshadet Kenney. Hvert område er
en FYLDIG scene man utforsker mens man hører på — ikke en tom boks.

## Modeller — bruk `<Model>` (IKKE Kenney `<Furniture>`)
`import { Model } from "./Model";` → `<Model id="sofa_03" position={[x,y,z]} rotation={[0,ry,0]} scale={1} solid />`
- Poly Haven-modeller ligger i `public/models/realistic/<id>/`. De er i VIRKELIG SKALA (meter) → `scale={1}` som standard.
- `solid` legger boks-collider (bruk på store møbler man ikke skal gå gjennom).
- Tilgjengelige id-er (lastet ned, 2k):
  - Sittemøbler: `sofa_03` (2.7m), `mid_century_lounge_chair`, `modern_arm_chair_01`, `SchoolChair_01`
  - Bord: `modern_coffee_table_01`, `side_table_01`, `round_wooden_table_01`, `metal_office_desk` (2.0m)
  - Hyller/skap: `wooden_bookshelf_worn`, `drawer_cabinet`
  - Bøker/props: `book_encyclopedia_set_01`, `decorative_book_set_01`, `classic_laptop`, `Television_01`, `korean_public_payphone_01`
  - Lys: `modern_ceiling_lamp_01`, `desk_lamp_arm_01`, `vintage_oil_lamp`
  - Planter: `potted_plant_01`, `potted_plant_02`
- Trenger du noe som ikke finnes: hold deg til lista, ikke finn på id-er.

## Rom-skall
- Koselig størrelse (~16–20 m). Gulv + 4 vegger + TAK (lukk rommet — ingen åpen void).
- Gulv: bruk laminat-teksturene i `public/textures/laminate_floor_03/` (se hvordan Lobby.tsx
  gjorde det) ELLER en varm ensfarget PBR-aktig flate. Vegger: varm puss-farge, `roughness≈0.95`,
  `metalness=0`. Unngå neon-kanter og sterke emissive-flater.

## Lys
Varmt og mykt. `ambientLight` lav (~0.3, varm farge), en `directionalLight` som mykt
dagslys/kveldslys med skygge (`shadow-mapSize={[2048,2048]}`), og noen varme `pointLight`
ved lamper. Hold det stemningsfullt, ikke utbrent. (Global eksponering/HDRI er allerede
satt i App.tsx — ikke rør den.)

## Lineær fortelling — VIKTIG
Hvert område skal lede spilleren i en TYDELIG REKKEFØLGE gjennom nummererte stasjoner:
- Plasser `AudioZone`-stasjonene langs en sti i rekkefølge 1 → 2 → 3 …
- Marker hver stasjon med et flytende nummer + kort tittel (`<Text>`), f.eks. "1", "2".
- Lag en visuell ledetråd langs stien: en løper/teppe-flate, en rekke lys, eller møblering
  som peker framover. Spilleren skal skjønne hvor de starter og hvilken vei de går.

## AudioZone (uendret API)
`import { AudioZone } from "./AudioZone";`
`<AudioZone position={[x,y,z]} size={[w,h,d]} audioUrl="/tts/<navn>.mp3" subtitleUrl="/tts/<navn>.json" />`
Bruk de NYE klippnavnene som rom-oppgaven angir. (Lyden regenereres separat — det er OK
om mp3-en ikke finnes ennå; sonen feiler stille til den er på plass.)

## Dører (uendret API)
`import { Portal } from "./Portal";`
`<Portal position={[x,y,z]} rotation={[0,ry,0]} room="roomX" label="..." color="#.." />`
Hvert område skal ha en dør VIDERE og en dør TILBAKE (rom-oppgaven angir hvilke).

## Verifisering (alltid)
- `npm run lint` — ingen NYE feil (2 pre-eksisterende i AudioZone er OK).
- `npx tsc -b` kompilerer.
- Rapporter kort hva du bygde.

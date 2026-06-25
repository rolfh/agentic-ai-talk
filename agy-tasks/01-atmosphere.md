# Oppgave 01 — Fiks eksponering + legg til tak (Lobby)

Du jobber i et React Three Fiber (Three.js) prosjekt — en walkable "Agentisk AI"-demo.
Lobbyen ble nettopp bygget om til et varmt hjem/kontor med Kenney-møbler.

## Problem
Scenen er kraftig OVEREKSPONERT — hele høyre side er helt hvit — og det finnes
INGEN tak, så den lyse HDRI-bakgrunnen (en "void") synes over de 6 m høye veggene.

## Scope (rør kun disse)
- `src/App.tsx`
- `src/components/Lobby.tsx`

IKKE rør møbelplassering, de andre rommene (Room1–4), TTS eller store.ts.

## Konkrete fikser
1. I `src/App.tsx` `<Canvas>`: legg til `gl={{ toneMappingExposure: 0.85 }}` for å
   dempe eksponeringen (behold standard ACESFilmic tone mapping).
2. `<Environment files="/hdri/photo_studio_loft_hall_1k.exr" background blur={0.2} />`
   er hovedsynderen — den lyse studio-HDRI-en rendres som bakgrunn og blåser ut alt.
   Endre så HDRI-en KUN brukes til myk image-based lighting, IKKE som synlig bakgrunn:
   - fjern `background`-propen
   - legg til `environmentIntensity={0.35}`
   - bytt gjerne fil til `/hdri/evening_field_1k.exr` for varmere tone (finnes i public/hdri)
   - legg til en varm solid bakgrunnsfarge inne i Canvas:
     `<color attach="background" args={["#241d15"]} />`
3. Demp Bloom: sett `luminanceThreshold={1.0}` og `intensity={0.25}`.
4. I `src/components/Lobby.tsx`: legg til et TAK så void-en over veggene skjules.
   Veggene er 6 m høye (topp ved y=6) over et 30x30 gulv. Legg en takflate ved y=6
   (en 30x30 plane rotert til å vende nedover, eller en tynn boks) med varmt materiale
   `color="#cdbfa6"`, `roughness={1}`. Den skal `receiveShadow`.
5. Hvis lobbyen blir for mørk etterpå, hev `ambientLight` litt — men behold den varm
   og stemningsfull, ikke flcombelyst.

## Verifisering
- Kjør `npm run lint` og sørg for at du IKKE innfører nye lint-feil (det finnes 6
  fra før i Portal.tsx og AudioZone.tsx — de er greie å la stå).
- Sørg for at TypeScript fortsatt kompilerer (`npx tsc -b` eller at `npm run dev` bygger).

## Rapporter
Gi et kort sammendrag av nøyaktig hva du endret.

# Oppgave 02 — Bytt portalene til hus-dører

Du jobber i et React Three Fiber (Three.js) prosjekt — en walkable "Agentisk AI"-demo
med en lobby i varm hjem/kontor-stil (Kenney-møbler).

## VIKTIG — ikke søk i filsystemet
Du står allerede i prosjektets rotmappe (current working directory). Filen du skal
endre ligger på `src/components/Portal.tsx`. Åpne den DIREKTE med relativ sti. Ikke
kjør `find`, `grep -r` eller andre søk over hele disken — det henger seg. Andre
relevante filer: `src/components/Furniture.tsx`, `src/components/Lobby.tsx`,
`public/models/furniture/` (Kenney .glb-er).

## Problem
Dørene mellom rommene (`src/components/Portal.tsx`) bruker en middelaldersk
stein-bue-modell (`/models/portal_frame.glb`) med en blendhvit, additivt blandet
"swirl"-shader inni. Dette kræsjer totalt med den koselige hjem-stilen — buen ser ut
som en steinport og swirl-en er utbrent hvit.

## Mål
Gjør portalene til naturlige dør-åpninger i et hjem, men BEHOLD all funksjonalitet:
- kollisjons-sensoren som kaller `setRoom(room)` når spilleren går gjennom
- de faste collider-ene som hindrer at man går gjennom dørkarmen
- `label`-teksten over døra (men gjør den mindre neon — se under)

## Konkrete fikser (i `src/components/Portal.tsx`)
1. Fjern stein-bue-modellen (`useGLTF("/models/portal_frame.glb")` og bruken av den).
2. Erstatt den med en treramme fra Kenney furniture-kit. Bruk
   `<Furniture name="doorwayOpen" .../>` (fra `src/components/Furniture.tsx`), evt.
   `wallDoorwayWide` eller `doorwayFront` — velg den som ser mest ut som en åpen dør.
   Skaler så åpningen blir ~2 m høy og passer spilleren (test rundt scale 2–2.6).
   Sjekk modellens mål om nødvendig; møblene er ca. 0.5× virkelig størrelse.
3. Bytt ut den utbrente swirl-shaderen: i stedet for additiv hvit swirl, lag åpningen
   til en myk, mørk "neste rom"-flate. Enten:
   - en mørk plane (`color="#1a140d"`) med en svak varm glød rundt karmen, ELLER
   - behold en ANTYDNING av portal-effekt, men sterkt dempet: ikke-additiv,
     lav opacity, varm farge i stedet for blå/hvit.
   Velg det som ser roligst og mest "dør inn til et rom" ut.
4. Behold `color`-propen som aksent på karm/label, men demp emissiveIntensity kraftig
   (f.eks. 0.3 i stedet for 1.2) så det ikke gløder neon.
5. Behold `<Text>`-labelen, men vurder mindre `outlineWidth` / lavere intensitet så
   den ikke stråler.

## Viktig
- Sensor-collideren som trigger `setRoom` MÅ fortsatt fungere (samme posisjon/størrelse).
- Lobby.tsx kaller `<Portal position rotation room label color />` — behold dette API-et.
- Room1–4 bruker også `<Portal>` — endringene gjelder alle, det er ønsket.

## Verifisering
- `npm run lint`: ingen nye feil.
- TypeScript kompilerer.
- Gå mentalt gjennom at man fortsatt kan gå mellom alle rom.

## Rapporter
Kort sammendrag av hva du endret og hvilken dør-modell/skala du landet på.

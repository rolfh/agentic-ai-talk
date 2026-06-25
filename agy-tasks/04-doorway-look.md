# Oppgave 04 — Gjør dør-åpningene pene

React Three Fiber-prosjekt. Du står i ROTMAPPEN. Ikke kjør `find`/`grep -r` over
disken — bruk relative stier. Filen du eier: `src/components/Portal.tsx` (rør KUN den).
Relevante referanser: `src/components/Furniture.tsx`, `public/models/furniture/`.

## Problem
Dagens dør (se Portal.tsx) er et stort svart plan (2.0 x 4.0) med en tynn farget
ramme og en BITTELITEN Kenney-dørmodell inni. Resultatet ser ut som et svart hull
med en mini-dør. Det ser billig ut.

## Mål: en innbydende, naturlig dør-åpning
Behold ALL funksjonalitet uendret:
- `PortalProps`-API-et (position, rotation, room, label, color)
- sensor-collideren som kaller `setRoom(room)`
- karm-colliderne som hindrer at man går gjennom ramma

## Gjør dette (src/components/Portal.tsx)
1. **Skaler dørmodellen riktig.** `<Furniture name="doorwayOpen" .../>` skal fylle
   åpningen så den leser som en ekte dør i menneskehøyde (~2.2 m). Sjekk modellens
   høyde om nødvendig (Kenney-møbler er ~0.5× virkelig størrelse; gruppa har allerede
   `scale={1.5}`). Juster `scale` på Furniture til åpningen passer karmen.
2. **Fiks det mørke "innenfor"-planet.** I stedet for et stort svart 2x4-plan: gjør
   planet på størrelse med selve ÅPNINGEN i dørmodellen, plasser det rett innenfor
   karmen. Bruk en myk, varm-mørk farge (#1a140d) ELLER en svak gradient/glød som
   antyder "et rom bortenfor" — ikke kullsvart. Det skal se ut som man kikker inn i
   et dunkelt, lunt rom.
3. **Demp/forbedre rammen.** De tre lysende stolpene rundt åpningen ser løsrevne ut.
   Enten integrer dem tettere på dørkarmen som en subtil aksent-glød (behold `color`
   som aksent), eller fjern dem og la selve tre-karmen + en myk `pointLight` i varm
   tone ved terskelen gjøre jobben.
4. **Legg til en terskel/dørmatte:** plasser en `<Furniture name="rugDoormat" .../>`
   foran åpningen, og en svak varm `pointLight` ved terskelen så døra inviterer.
5. **Behold labelen** over døra, men sørg for at den sitter pent og ikke
   overeksponerer (toneMapped, lav outline).

## Verifisering
- `npm run lint` — ingen nye feil.
- `npx tsc -b` kompilerer.
- Bekreft mentalt at `setRoom`-sensoren og karm-colliderne står på nøyaktig samme
  posisjon/størrelse som før.

## Rapporter kort hva du endret og hvilken skala du landet på.

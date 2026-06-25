# Oppgave 05 — Lobby: koseligere rom, vinduer, fremhevet start-dør

React Three Fiber-prosjekt. Du står i ROTMAPPEN. Ikke kjør `find`/`grep -r` over
disken. Filen du eier: `src/components/Lobby.tsx` (rør KUN den). Referanser:
`src/components/Furniture.tsx` (laster Kenney-møbler fra public/models/furniture),
`src/components/Portal.tsx` (dør-komponent — API: position, rotation, room, label, color).

## Problemer (fra screenshots)
- Rommet er 30x30 m — altfor stort og tomt, møblene virker små.
- PC-skjermen i arbeidskroken er UTBRENT hvit (for sterkt lys/emissive på den).
- Bare 4 like dører — uklart hvor man skal starte.
- Veggene er nakne bokser; trenger mer art direction (vinduer).

## Gjør dette

### 1. Krymp rommet til koselig størrelse
Endre gulv, tak og de fire veggene fra 30x30 til ca **18x18 m** (vegger ved ±9,
tak/gulv 18x18). Reposisjoner møblene så stua fylles fint uten å være overfylt — mindre
tomt gulv. Skaler gjerne møblene litt opp (f.eks. sofagruppe scale ~2.6–3.0) så de
føles riktige i menneskehøyde. Behold den varme paletten.

### 2. Tre dører (room1/bombe er fjernet)
Det skal nå være **3 dører**, plassert på veggene ved den nye størrelsen:
- `room2` — label "Kontoret"  — DETTE ER START-DØRA (se punkt 3)
- `room3` — label "Postrommet"
- `room4` — label "Biblioteket"
FJERN den gamle `room1`-portalen ("Inngangshall") helt.

### 3. Fremhev start-døra ("Kontoret"/room2)
Gjør det visuelt åpenbart at man starter her:
- en varm `spotLight`/`pointLight` rettet mot denne døra
- en dørmatte (`<Furniture name="rugDoormat" .../>`) foran den
- gjerne en liten `<Text>`-pil eller "Start her"-skilt i nærheten
De to andre dørene skal være tydelige, men mindre opplyst (sekundære snarveier).

### 4. Vinduer / art direction
Bytt 1–2 vegg-segmenter mot vindus-følelse: bruk `<Furniture name="wallWindow" .../>`
eller `wallWindowSlide` plassert i vegg-flaten, ELLER lag enkle vindusrammer. Bak
vinduet kan du antyde "ute" med en lys, varm kveldshimmel-farge (rommet har allerede
en mørk bakgrunn globalt — et lyst plan utenfor vinduet gir kontrast). Legg gjerne
til et par `<Furniture name="plantSmall1/2/3" />` og et `pottedPlant` for liv.

### 5. Fiks den utbrente PC-skjermen
I arbeidskroken (rundt position [10,0,-6], nå reposisjonert): den kalde blå
`pointLight` (intensity 2.5) blåser ut skjermen. Demp den kraftig (intensity ~0.8)
og/eller gjør den varmere, så `computerScreen` ikke blir et hvitt lyspunkt.

### 6. Teppe under arbeidskroken
Legg et `<Furniture name="rugRound" />` eller `rugSquare` under skrivebordet/stolen.

## Verifisering
- `npm run lint` — ingen nye feil.
- `npx tsc -b` kompilerer.
- Behold `useTexture`-gulvet og preloads.

## Rapporter kort hva du endret (rom-størrelse, dør-posisjoner, hva du gjorde med start-døra).

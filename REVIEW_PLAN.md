# Codebase Review & Fix Plan — agentic-ai-talk

A walkable Three.js / react-three-fiber demo (Vite + React 19 + TS + Rapier physics).
This document is the work order for the `agy` (Antigravity) agent. Fixes are grouped
into batches. Complete batches in order; after each batch, `npm run lint` and
`npx tsc -b --noEmit` must pass.

---

## Batch 1 — Correctness & lint blockers (HIGH)

`npm run lint` currently FAILS with 5 errors. These must end green.

1. **AudioZone subtitles stale-closure bug** (`src/components/AudioZone.tsx`)
   - The 100ms polling interval started in `handleEnter` closes over `subtitles`
     state, which is populated asynchronously by `fetch`. Entering a zone before the
     JSON resolves means captions never show for that playback.
   - Fix: store subtitles in a `useRef` (`subtitlesRef`) and read from `.current`
     inside the interval. Keep the state only if needed for render.

2. **AudioZone immutability lint errors** (`src/components/AudioZone.tsx:59,61,94,165`)
   - `react-hooks/immutability` fires because `useFrame` mutates `glowUniforms` and
     code mutates `activeAudio` (an `HTMLAudioElement` pulled from the zustand store).
   - Root cause: a mutable `HTMLAudioElement` is stored in zustand (`src/store.ts:8`).
   - Fix: stop storing the live audio element in zustand. Track the currently-playing
     audio via a module-level singleton or `useRef` inside AudioZone. The store should
     hold only serializable state (e.g. an `activeAudioId: string | null` and
     `subtitle`). Update `store.ts` and AudioZone together.
   - For `glowUniforms`: hold uniforms in a `useRef` (not a value passed to a hook) so
     mutating `.current.uTime.value` in `useFrame` is allowed.

3. **AudioZone unmount cleanup** (`src/components/AudioZone.tsx:78-88`)
   - On unmount the audio is paused but the store still references it and `subtitle`
     may stay on screen. Fix: on unmount, if this zone owns the active audio, clear it
     (`setActiveAudioId(null)` / `setSubtitle(null)`), pause, and clear `src` to release
     the element.

4. **App.tsx setState-in-effect / DPR flash** (`src/App.tsx:83`)
   - `dpr` starts at `1` then is set via effect, forcing a second full-Canvas render.
   - Fix: compute the initial dpr lazily with `useState(() => computeDpr())`; remove the
     effect's `setDpr`. Clamp the result to a sane max (e.g. `Math.min(result, 2*window.devicePixelRatio)` or an absolute cap) to avoid runaway resolution on retina + `?res>1`.

5. **Player jump ground-check** (`src/components/Player.tsx:79`)
   - `jump && Math.abs(velocity.y) < 0.05` allows a mid-air double-jump at apex.
   - Fix: use a proper grounded check — Rapier ray cast downward from the body, or a
     grounded flag set from collision events — and only allow jump when grounded.

**Batch 1 done when:** `npm run lint` → 0 errors, `npx tsc -b --noEmit` → clean,
`npm run build` succeeds.

---

## Batch 2 — Duplication / dead code (MED)

6. **Extract `StationLabel`** into `src/components/StationLabel.tsx`.
   - Duplicated 5× (Outside, Lobby, Room2, Room3, Room4). Hoist the inline `style`
     object to a module constant. Unify prop typing (`number?: string`). Replace all
     five local definitions with the shared import.

7. **Extract a `Painting` component** (`src/components/Painting.tsx`).
   - The frame-box + canvas-plane (+ optional wall-lamp box/cylinder/pointLight) cluster
     is repeated dozens of times (Lobby, Room2, Room3, Room4). Props: texture, frame
     size, optional lamp. Replace the inline clusters.

8. **Extract `useTiledTextures` hook** (`src/hooks/useTiledTextures.ts` or similar).
   - The `useMemo`-as-side-effect blocks that set `wrapS/wrapT/repeat` (Lobby:57,
     Room2:62, Room3:67, Room4:82) should become one hook using `useLayoutEffect`
     (not `useMemo`) to mutate texture wrap/repeat. Use it in all four rooms.

9. **Remove debug global leak** (`src/components/Outside.tsx:200-202`).
   - Delete `window.three = three` (or gate behind `import.meta.env.DEV` with cleanup).

10. **Delete dead `src/components/Furniture.tsx`** — not imported anywhere.

11. **Delete dead `src/App.css`** — never imported (App.tsx uses Tailwind only).
    Confirm no import exists before deleting.

**Batch 2 done when:** lint + tsc + build still green; no behavior change in the scene.

---

## Batch 3 — Architecture, config, hygiene (MED)

12. **Enable TS strict mode** — add `"strict": true` to `tsconfig.app.json`
    `compilerOptions`. Fix any resulting type errors (likely few given tsc already
    passes). Optionally add `noUncheckedIndexedAccess`.

13. **Loading UI + error boundary** (`src/App.tsx`).
    - Replace `Suspense fallback={null}` with drei `<Loader />` or a `useProgress`-based
      overlay so first load shows progress instead of a black screen.
    - Add a React error boundary around the Canvas so a failed GLB/EXR load shows a
      message instead of a blank page.

14. **Project hygiene**
    - `package.json`: rename `"name": "tmp-starter"` → `"agentic-ai-talk"`.
    - Fill the empty `README.md` (what the project is, how to run: `npm i && npm run dev`).
    - `index.html`: set `<html lang="nb">` (UI copy is Norwegian), add
      `<meta name="description">`. Remove the redundant `document.title` override in
      App.tsx:60-65 (title already in index.html).
    - Subtitles overlay (`App.tsx:153-162`): add `role="status" aria-live="polite"`.

**Batch 3 done when:** lint + tsc (strict) + build all green.

---

## Out of scope (report only — do NOT change without explicit user approval)
- Tree/Football instancing (perf rework, larger effort).
- Untracking large committed screenshots / removing ad-hoc root scripts.
- Verifying the unusual dependency pins (TS 6, Vite 8, ESLint 10) — flag to user.

## Verification (run after every batch)
```
npm run lint
npx tsc -b --noEmit
npm run build
```
Then `npm run dev` and walk the scene: enter an audio zone (captions appear), jump
(no mid-air double jump), switch rooms (no console errors, no leaked audio).

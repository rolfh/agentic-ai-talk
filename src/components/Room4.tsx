import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useTexture, Text } from "@react-three/drei";
import { StationLabel } from "./StationLabel";
import { Painting } from "./Painting";
import { useTiledTextures } from "../hooks/useTiledTextures";

import { Model } from "./Model";
import { AudioZone } from "./AudioZone";
import { Portal } from "./Portal";
import { Football } from "./Football";



/**
 * BIBLIOTEKET — lun lesesal.
 * Bokhylle-vegger, varmt lampelys, en lesekrok. Spilleren følger en synlig
 * løper gjennom fem nummererte stasjoner (1 → 5) fra dørene og innover.
 */

interface Station {
  n: string;
  title: string;
  audio: string;
  pos: [number, number, number];
}

// Stasjonene i rekkefølge langs løperen (fra dørene ved z=+ og innover).
const STATIONS: Station[] = [
  { n: "1", title: "Hvordan prompte", audio: "hvordan_prompte", pos: [4.5, 0, 5.0] },
  { n: "2", title: "Fremgangsmåte", audio: "fremgangsmaate", pos: [-4.5, 0, 2.0] },
  { n: "3", title: "AGENTS.md", audio: "agents_md", pos: [-2.5, 0, -1.0] },
  { n: "4", title: "Globale vs. Skills", audio: "styre_agenter", pos: [4.5, 0, -4.0] },
  { n: "5", title: "Spør et dokument", audio: "fil_spor_dokument", pos: [-5.0, 0, -6.8] },
];

export const Room4 = () => {
  // Varmt tregulv (samme laminat som Lobby).
  const floorTextures = useTexture({
    map: "/textures/laminate_floor_03/laminate_floor_03_diff_1k.jpg",
    normalMap: "/textures/laminate_floor_03/laminate_floor_03_nor_gl_1k.jpg",
    roughnessMap: "/textures/laminate_floor_03/laminate_floor_03_rough_1k.jpg",
  });

  // Load dark wooden planks for the floor
  const woodenPlanksTextures = useTexture({
    map: "/textures/dark_wooden_planks/diff.jpg",
    normalMap: "/textures/dark_wooden_planks/nor.jpg",
    roughnessMap: "/textures/dark_wooden_planks/rough.jpg",
  });

  const starryNightTexture = useTexture("/artwork/starry_night.png");

  const promptingTexture = useTexture("/artwork/biblioteket_prompting.png");
  const manualsTexture = useTexture("/artwork/biblioteket_manuals.png");

  useTiledTextures(floorTextures, 6, 6);
  useTiledTextures(woodenPlanksTextures, 6, 6);

  // Bokhyller langs venstre vegg (x = -8.2, front mot +x) i alcoven.
  const leftShelves = [-4.1, -1.7, 0.7, 3.1];
  // Bokhyller langs bakvegg (z = -8.2, front mot +z) i alcoven.
  const backShelves = [-3.5, 3.5];
  // Bokhyller langs høyre vegg (x = 8.2, front mot -x) i alcoven.
  const rightShelves = [-4.1, -1.7, 0.7, 3.1];

  // Interne bokhyller tilpasset den åpne oktogon-layouten
  const internalShelves = [
    { pos: [-1.5, 0, -6.5], rot: [0, Math.PI / 2, 0] },
    { pos: [2.0, 0, -3.0], rot: [0, Math.PI / 2, 0] },
    { pos: [1.5, 0, 4.0], rot: [0, Math.PI / 2, 0] },
  ];

  return (
    <group>
      {/* ---------- Rom-skall (18 x 18, hevet tak Y = 8.0) ---------- */}
      {/* Tregulv */}
      <RigidBody type="fixed" position={[0, -0.1, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[18, 0.2, 18]} />
          <meshStandardMaterial {...woodenPlanksTextures} color="#b08a5c" roughness={0.9} metalness={0} />
        </mesh>
      </RigidBody>

      {/* Delte takplater for å lage åpning til glass-skylight (4x4 åpning i midten) */}
      <RigidBody type="fixed" position={[0, 8.0, -5.5]}>
        <mesh receiveShadow>
          <boxGeometry args={[18, 0.2, 7.0]} />
          <meshStandardMaterial color="#c9b89c" roughness={1} metalness={0} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[0, 8.0, 5.5]}>
        <mesh receiveShadow>
          <boxGeometry args={[18, 0.2, 7.0]} />
          <meshStandardMaterial color="#c9b89c" roughness={1} metalness={0} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[-5.5, 8.0, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[7.0, 0.2, 4.0]} />
          <meshStandardMaterial color="#c9b89c" roughness={1} metalness={0} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[5.5, 8.0, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[7.0, 0.2, 4.0]} />
          <meshStandardMaterial color="#c9b89c" roughness={1} metalness={0} />
        </mesh>
      </RigidBody>

      {/* Glass Skylight i taket */}
      <RigidBody type="fixed" position={[0, 8.1, 0]}>
        <mesh>
          <boxGeometry args={[4.0, 0.05, 4.0]} />
          <meshPhysicalMaterial color="#c5e3fc" transmission={0.9} opacity={0.6} transparent roughness={0.1} />
        </mesh>
      </RigidBody>

      {/* Skylight backdrop (moved further up for better parallax) */}
      <mesh position={[0, 13.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 26]} />
        <meshBasicMaterial map={starryNightTexture} toneMapped={false} />
      </mesh>

      {/* Skylight Rammer og Grid */}
      <mesh position={[0, 8.1, -2.0]}>
        <boxGeometry args={[4.2, 0.15, 0.15]} />
        <meshStandardMaterial color="#3a2c18" roughness={0.7} />
      </mesh>
      <mesh position={[0, 8.1, 2.0]}>
        <boxGeometry args={[4.2, 0.15, 0.15]} />
        <meshStandardMaterial color="#3a2c18" roughness={0.7} />
      </mesh>
      <mesh position={[-2.0, 8.1, 0]}>
        <boxGeometry args={[0.15, 0.15, 4.2]} />
        <meshStandardMaterial color="#3a2c18" roughness={0.7} />
      </mesh>
      <mesh position={[2.0, 8.1, 0]}>
        <boxGeometry args={[0.15, 0.15, 4.2]} />
        <meshStandardMaterial color="#3a2c18" roughness={0.7} />
      </mesh>
      <mesh position={[0, 8.1, 0]}>
        <boxGeometry args={[4.0, 0.12, 0.08]} />
        <meshStandardMaterial color="#3a2c18" roughness={0.7} />
      </mesh>
      <mesh position={[0, 8.1, 0]}>
        <boxGeometry args={[0.08, 0.12, 4.0]} />
        <meshStandardMaterial color="#3a2c18" roughness={0.7} />
      </mesh>

      {/* Måneskinn som strømmer ned fra skylight */}
      <spotLight
        position={[0, 7.9, 0]}
        angle={Math.PI / 3}
        penumbra={0.8}
        intensity={8}
        color="#a5c9eb"
        distance={15}
        castShadow
      />

      {/* Yttervegger (Høyde hevet til 8.0, Y=4.0) */}
      <RigidBody type="fixed" position={[0, 4.0, -9]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[18, 8, 0.4]} />
          <meshStandardMaterial color="#cdb497" roughness={0.95} metalness={0} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[0, 4.0, 9]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[18, 8, 0.4]} />
          <meshStandardMaterial color="#cdb497" roughness={0.95} metalness={0} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[-9, 4.0, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 8, 18]} />
          <meshStandardMaterial color="#cdb497" roughness={0.95} metalness={0} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[9, 4.0, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 8, 18]} />
          <meshStandardMaterial color="#cdb497" roughness={0.95} metalness={0} />
        </mesh>
      </RigidBody>

      {/* ---------- Diagonal Corner Walls for Octagon ---------- */}
      <RigidBody type="fixed" position={[6.75, 4.0, -6.75]} rotation={[0, Math.PI / 4, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 8.0, 6.36]} />
          <meshStandardMaterial color="#cdb497" roughness={0.95} metalness={0} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[-6.75, 4.0, -6.75]} rotation={[0, -Math.PI / 4, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 8.0, 6.36]} />
          <meshStandardMaterial color="#cdb497" roughness={0.95} metalness={0} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[6.75, 4.0, 6.75]} rotation={[0, -Math.PI / 4, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 8.0, 6.36]} />
          <meshStandardMaterial color="#cdb497" roughness={0.95} metalness={0} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[-6.75, 4.0, 6.75]} rotation={[0, Math.PI / 4, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 8.0, 6.36]} />
          <meshStandardMaterial color="#cdb497" roughness={0.95} metalness={0} />
        </mesh>
      </RigidBody>

      {/* ---------- Gallery Floors (Y = 4.0) ---------- */}
      <RigidBody type="fixed" position={[0, 3.9, -8.25]}>
        <mesh receiveShadow>
          <boxGeometry args={[9.0, 0.2, 1.5]} />
          <meshStandardMaterial color="#b08a5c" roughness={0.8} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[0, 3.9, 8.25]}>
        <mesh receiveShadow>
          <boxGeometry args={[9.0, 0.2, 1.5]} />
          <meshStandardMaterial color="#b08a5c" roughness={0.8} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[8.25, 3.9, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[1.5, 0.2, 9.0]} />
          <meshStandardMaterial color="#b08a5c" roughness={0.8} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[-8.25, 3.9, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[1.5, 0.2, 9.0]} />
          <meshStandardMaterial color="#b08a5c" roughness={0.8} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[6.2, 3.9, -6.2]} rotation={[0, Math.PI / 4, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[1.5, 0.2, 5.0]} />
          <meshStandardMaterial color="#b08a5c" roughness={0.8} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[-6.2, 3.9, -6.2]} rotation={[0, -Math.PI / 4, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[1.5, 0.2, 5.0]} />
          <meshStandardMaterial color="#b08a5c" roughness={0.8} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[6.2, 3.9, 6.2]} rotation={[0, -Math.PI / 4, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[1.5, 0.2, 5.0]} />
          <meshStandardMaterial color="#b08a5c" roughness={0.8} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[-6.2, 3.9, 6.2]} rotation={[0, Math.PI / 4, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[1.5, 0.2, 5.0]} />
          <meshStandardMaterial color="#b08a5c" roughness={0.8} />
        </mesh>
      </RigidBody>

      {/* ---------- Gallery Railings ---------- */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 4.5, -7.5]}>
          <boxGeometry args={[9.0, 1.0, 0.08]} />
          <meshStandardMaterial color="#3a2c18" roughness={0.7} />
        </mesh>
        <mesh position={[0, 4.5, 7.5]}>
          <boxGeometry args={[9.0, 1.0, 0.08]} />
          <meshStandardMaterial color="#3a2c18" roughness={0.7} />
        </mesh>
        <mesh position={[7.5, 4.5, 0]}>
          <boxGeometry args={[0.08, 1.0, 9.0]} />
          <meshStandardMaterial color="#3a2c18" roughness={0.7} />
        </mesh>
        {/* West inner railing is split to leave a gap for the stairs bridge */}
        <mesh position={[-7.5, 4.5, -1.5]}>
          <boxGeometry args={[0.08, 1.0, 6.0]} />
          <meshStandardMaterial color="#3a2c18" roughness={0.7} />
        </mesh>
        <mesh position={[-7.5, 4.5, 4.0]}>
          <boxGeometry args={[0.08, 1.0, 1.0]} />
          <meshStandardMaterial color="#3a2c18" roughness={0.7} />
        </mesh>
        {/* Diagonal Railings */}
        <mesh position={[5.3, 4.5, -5.3]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[0.08, 1.0, 5.0]} />
          <meshStandardMaterial color="#3a2c18" roughness={0.7} />
        </mesh>
        <mesh position={[-5.3, 4.5, -5.3]} rotation={[0, -Math.PI / 4, 0]}>
          <boxGeometry args={[0.08, 1.0, 5.0]} />
          <meshStandardMaterial color="#3a2c18" roughness={0.7} />
        </mesh>
        <mesh position={[5.3, 4.5, 5.3]} rotation={[0, -Math.PI / 4, 0]}>
          <boxGeometry args={[0.08, 1.0, 5.0]} />
          <meshStandardMaterial color="#3a2c18" roughness={0.7} />
        </mesh>
        <mesh position={[-5.3, 4.5, 5.3]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[0.08, 1.0, 5.0]} />
          <meshStandardMaterial color="#3a2c18" roughness={0.7} />
        </mesh>
      </RigidBody>

      {/* ---------- Bookshelves on the Gallery Level ---------- */}
      {[-3.5, -1.2, 1.2, 3.5].map((x) => (
        <Model
          key={`gal-n-${x}`}
          id="wooden_bookshelf_worn"
          position={[x, 4.0, -8.3]}
          rotation={[0, 0, 0]}
          scale={1}
          solid
        />
      ))}
      {[-3.5, -1.2, 1.2, 3.5].map((z) => (
        <Model
          key={`gal-e-${z}`}
          id="wooden_bookshelf_worn"
          position={[8.3, 4.0, z]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={1}
          solid
        />
      ))}
      {[-3.5, -1.2, 1.2, 3.5].map((z) => (
        <Model
          key={`gal-w-${z}`}
          id="wooden_bookshelf_worn"
          position={[-8.3, 4.0, z]}
          rotation={[0, Math.PI / 2, 0]}
          scale={1}
          solid
        />
      ))}

      {/* ---------- HELICAL STAIRCASE & PILLAR ---------- */}
      {/* Central Pillar */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[0.0, 2.5, 1.5]}>
          <cylinderGeometry args={[0.3, 0.3, 5.0, 16]} />
          <meshStandardMaterial color="#3a2c18" roughness={0.75} />
        </mesh>
      </RigidBody>

      {/* Steps winding 234 degrees to reach bridge walkway (visuals only) */}
      {Array.from({ length: 20 }).map((_, idx) => {
        const stepHeight = 0.2;
        const stepWidth = 1.2;
        const stepDepth = 0.45;
        const radius = 1.8;
        const angle = -Math.PI / 2 + (idx * (1.3 * Math.PI)) / 20;
        const x = Math.cos(angle) * radius;
        const z = 1.5 + Math.sin(angle) * radius;
        const y = (idx + 0.5) * stepHeight;
        return (
          <mesh key={`step-${idx}`} position={[x, y, z]} rotation={[0, -angle, 0]} receiveShadow castShadow>
            <boxGeometry args={[stepWidth, stepHeight, stepDepth]} />
            <meshStandardMaterial color="#7a2f25" roughness={0.8} />
          </mesh>
        );
      })}

      {/* Helical staircase smooth ramp segments (3 slanted boxes) */}
      <RigidBody type="fixed" position={[1.13, 0.67, 0.1]} rotation={[0.48, -0.89, 0]}>
        <CuboidCollider args={[0.6, 0.05, 1.35]} />
      </RigidBody>
      <RigidBody type="fixed" position={[1.53, 2.0, 2.44]} rotation={[0.48, 0.55, 0]}>
        <CuboidCollider args={[0.6, 0.05, 1.2]} />
      </RigidBody>
      <RigidBody type="fixed" position={[-0.49, 3.3, 3.23]} rotation={[0.48, 1.85, 0]}>
        <CuboidCollider args={[0.6, 0.05, 1.2]} />
      </RigidBody>

      {/* Bridge Walkway from top of helical stairs to West Gallery */}
      <RigidBody type="fixed" position={[-4.25, 3.9, 2.55]}>
        <mesh receiveShadow>
          <boxGeometry args={[6.5, 0.2, 1.2]} />
          <meshStandardMaterial color="#b08a5c" roughness={0.8} />
        </mesh>
      </RigidBody>
      {/* Bridge Railings */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[-4.25, 4.5, 3.1]}>
          <boxGeometry args={[6.5, 1.0, 0.08]} />
          <meshStandardMaterial color="#3a2c18" roughness={0.7} />
        </mesh>
        <mesh position={[-4.25, 4.5, 2.0]}>
          <boxGeometry args={[6.5, 1.0, 0.08]} />
          <meshStandardMaterial color="#3a2c18" roughness={0.7} />
        </mesh>
      </RigidBody>

      {/* Tittel på bakveggen */}
      <Text
        position={[0, 6.0, -8.75]}
        fontSize={0.45}
        color="#e8d5b0"
        anchorX="center"
        outlineWidth={0.01}
        outlineColor="#3a2c18"
      >
        BIBLIOTEKET
      </Text>

      {/* ---------- Bokhylle-vegger (Grenser på bakkenivå) ---------- */}
      {leftShelves.map((z) => (
        <Model
          key={`l${z}`}
          id="wooden_bookshelf_worn"
          position={[-8.3, 0, z]}
          rotation={[0, Math.PI / 2, 0]}
          scale={1}
          solid
        />
      ))}
      {rightShelves.map((z) => (
        <Model
          key={`r${z}`}
          id="wooden_bookshelf_worn"
          position={[8.3, 0, z]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={1}
          solid
        />
      ))}
      {backShelves.map((x) => (
        <Model
          key={`b${x}`}
          id="wooden_bookshelf_worn"
          position={[x, 0, -8.3]}
          rotation={[0, 0, 0]}
          scale={1}
          solid
        />
      ))}

      {/* ---------- Interne bokhylle-vegger ---------- */}
      {internalShelves.map((shelf, idx) => (
        <Model
          key={`int${idx}`}
          id="wooden_bookshelf_worn"
          position={shelf.pos as [number, number, number]}
          rotation={shelf.rot as [number, number, number]}
          scale={1}
          solid
        />
      ))}

      {/* Fylte hyller på bakkenivå */}
      {leftShelves
        .filter((_, i) => i % 2 === 0)
        .flatMap((z) => [0.85, 1.55].map((y) => ({ z, y })))
        .map(({ z, y }) => (
          <Model
            key={`lb${z}-${y}`}
            id="book_encyclopedia_set_01"
            position={[-7.95, y, z]}
            rotation={[0, Math.PI / 2, 0]}
            scale={1}
          />
        ))}
      {rightShelves
        .filter((_, i) => i % 2 === 0)
        .flatMap((z) => [0.85, 1.55].map((y) => ({ z, y })))
        .map(({ z, y }) => (
          <Model
            key={`rb${z}-${y}`}
            id="book_encyclopedia_set_01"
            position={[7.95, y, z]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={1}
          />
        ))}

      {/* Bokhyller dekorasjoner på de interne hyllene */}
      <Model id="book_encyclopedia_set_01" position={[-1.15, 1.55, -6.5]} rotation={[0, Math.PI / 2, 0]} scale={1} />
      <Model id="book_encyclopedia_set_01" position={[1.65, 1.55, -3.0]} rotation={[0, -Math.PI / 2, 0]} scale={1} />



      {/* ---------- Lese-bord ved stasjon 3 (flyttet unna trappa) ---------- */}
      <Model id="round_wooden_table_01" position={[0, 0, -3.2]} scale={1.2} solid />
      <Model id="SchoolChair_01" position={[-1.2, 0, -3.2]} rotation={[0, Math.PI / 2, 0]} scale={1.2} solid />
      <Model id="book_encyclopedia_set_01" position={[0, 1.206, -3.2]} scale={1} />
      <Model id="vintage_oil_lamp" position={[0.4, 1.206, -3.2]} scale={1} />
      <pointLight position={[0, 1.856, -3.2]} intensity={5} color="#ffc080" distance={5} decay={2} />

      {/* Decorative items */}
      <Model id="brass_candleholders_1k" position={[0.2, 1.206, -3.0]} rotation={[0, 0, 0]} scale={1.2} solid={false} />
      <Model id="carved_wooden_elephant_1k" position={[7.95, 0.85, -1.7]} rotation={[0, -Math.PI / 2, 0]} scale={1.3} solid={false} />

      {/* Easel Frame near the reading table displaying biblioteket_prompting.png */}
      <group position={[-2.2, 0, -3.2]}>
        {/* Left leg */}
        <mesh position={[-0.1, 0.6, 0.4]} rotation={[0.15, 0, 0]} castShadow>
          <boxGeometry args={[0.08, 1.2, 0.08]} />
          <meshStandardMaterial color="#3a2c18" roughness={0.8} />
        </mesh>
        {/* Right leg */}
        <mesh position={[-0.1, 0.6, -0.4]} rotation={[-0.15, 0, 0]} castShadow>
          <boxGeometry args={[0.08, 1.2, 0.08]} />
          <meshStandardMaterial color="#3a2c18" roughness={0.8} />
        </mesh>
        {/* Back leg */}
        <mesh position={[0.2, 0.6, 0.0]} rotation={[0, 0, -0.3]} castShadow>
          <boxGeometry args={[0.08, 1.2, 0.08]} />
          <meshStandardMaterial color="#3a2c18" roughness={0.8} />
        </mesh>
        {/* Support shelf */}
        <mesh position={[-0.05, 0.8, 0.0]} castShadow>
          <boxGeometry args={[0.1, 0.04, 1.2]} />
          <meshStandardMaterial color="#2b1d0c" roughness={0.7} />
        </mesh>
        {/* Artwork Canvas and inner Frame tilted back */}
        <group position={[-0.03, 1.25, 0.0]} rotation={[0, 0, -0.15]}>
          <Painting
            position={[0, 0, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            texture={promptingTexture}
            width={1.0}
            height={0.8}
            frameWidth={1.1}
            frameHeight={0.9}
            frameColor="#2b1d0c"
            frameRoughness={0.7}
            canvasRoughness={0.2}
            canvasMetalness={0.1}
          />
        </group>
      </group>

      {/* ---------- Lesekrok ved stasjon 5 ---------- */}
      <Model id="round_wooden_table_01" position={[-4.5, 0, -7.5]} scale={1} solid />
      <Model
        id="mid_century_lounge_chair"
        position={[-5.8, 0, -6.5]}
        rotation={[0, Math.PI / 2, 0]}
        scale={1}
        solid
      />
      {/* Oljelampe på bordet + varmt punktlys */}
      <Model id="vintage_oil_lamp" position={[-4.5, 1.005, -7.5]} scale={1} />
      <pointLight position={[-4.5, 1.555, -7.5]} intensity={6} color="#ffb066" distance={7} decay={2} />
      {/* Et oppslått oppslagsverk på bordet */}
      <Model id="book_encyclopedia_set_01" position={[-4.0, 1.005, -7.2]} scale={1} />

      {/* Painting 2: biblioteket_manuals (on the wall in the Station 5 alcove, behind lounge chair) */}
      <Painting
        position={[-8.78, 2.6, -6.5]}
        rotation={[0, Math.PI / 2, 0]}
        texture={manualsTexture}
        width={1.3}
        height={0.9}
        frameWidth={1.4}
        frameHeight={1.0}
        frameColor="#2b1d0c"
        frameRoughness={0.7}
        canvasRoughness={0.2}
        canvasMetalness={0.1}
      />

      {/* ---------- Dekorasjoner for andre stasjoner ---------- */}
      <Model id="SchoolChair_01" position={[5.7, 0, 5.0]} rotation={[0, -Math.PI / 2, 0]} scale={1.2} solid />
      <Model id="drawer_cabinet" position={[-6.0, 0, 2.0]} rotation={[0, Math.PI / 2, 0]} scale={1.2} solid />
      <Model id="side_table_01" position={[5.8, 0, -4.0]} scale={1.2} solid />
      <Model id="vintage_oil_lamp" position={[5.8, 0.6608, -4.0]} scale={1} />
      <pointLight position={[5.8, 1.2, -4.0]} intensity={2} color="#ffb066" distance={5} decay={2} />

      {/* ---------- Planter i hjørnene ---------- */}
      <Model id="potted_plant_01" position={[7.6, 0, 7.6]} scale={1} />
      <Model id="potted_plant_01" position={[-7.6, 0, 7.6]} scale={1} />

      {/* ---------- Taklampe ---------- */}
      <Model id="modern_ceiling_lamp_01" position={[0, 8.0, 1]} scale={1} />
      <pointLight position={[0, 7.2, 1]} intensity={6} color="#ffd9a0" distance={14} decay={2} castShadow />

      {/* ---------- Nummererte stasjoner langs den labyrintiske løperen ---------- */}
      {STATIONS.map((s) => (
        <group key={s.n} position={s.pos}>
          {/* Flytende nummer + tittel */}
          <StationLabel position={[0, 3.5, 0]} number={s.n} label={s.title} />
          {/* Liten varm markør på gulvet */}
          <pointLight position={[0, 1.6, 0]} intensity={1.4} color="#ffcaa0" distance={4.5} decay={2} />

          <AudioZone
            position={[0, 1, 0]}
            size={[3.2, 3, 2.2]}
            audioUrl={`/tts/${s.audio}.mp3`}
            subtitleUrl={`/tts/${s.audio}.json`}
          />
        </group>
      ))}

      {/* ---------- Dører ---------- */}
      {/* TILBAKE til postrommet */}
      <Portal
        position={[-3, 0, 7.5]}
        rotation={[0, Math.PI, 0]}
        room="room3"
        label="Tilbake til postrommet"
        color="#ff4a4a"
      />
      {/* HJEM til stua (nå grønn, går til startsiden ute) */}
      <Portal
        position={[3, 0, 7.5]}
        rotation={[0, Math.PI, 0]}
        room="outside"
        label="Avslutt og gå ut"
        color="#2eff7c"
      />

      {/* ---------- Belysning (varm og myk) ---------- */}
      <ambientLight intensity={0.03} color="#ffe6c2" />
      <hemisphereLight args={["#ffeccc", "#4a3a2a", 0.04]} />
      <directionalLight
        position={[6, 12, 6]}
        intensity={0.6}
        color="#ffdca8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0005}
      />

      {/* ---------- 3 Footballs inside Room 4 ---------- */}
      <Football position={[-3.0, 0.5, 3.0]} />
      <Football position={[3.0, 0.5, -3.0]} />
      <Football position={[0.0, 0.5, 0.0]} />
    </group>
  );
};

useTexture.preload("/textures/laminate_floor_03/laminate_floor_03_diff_1k.jpg");
useTexture.preload("/textures/laminate_floor_03/laminate_floor_03_nor_gl_1k.jpg");
useTexture.preload("/textures/laminate_floor_03/laminate_floor_03_rough_1k.jpg");
useTexture.preload("/artwork/biblioteket_prompting.png");
useTexture.preload("/artwork/biblioteket_manuals.png");
useTexture.preload("/textures/dark_wooden_planks/diff.jpg");
useTexture.preload("/textures/dark_wooden_planks/nor.jpg");
useTexture.preload("/textures/dark_wooden_planks/rough.jpg");
useTexture.preload("/artwork/starry_night.png");

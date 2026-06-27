import { useMemo } from "react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useTexture, Html } from "@react-three/drei";
import * as THREE from "three";

import { Model } from "./Model";
import { AudioZone } from "./AudioZone";
import { Portal } from "./Portal";
import { Football } from "./Football";

interface StationLabelProps {
  position: [number, number, number];
  number: string | number;
  label: string;
}

const StationLabel = ({ position, number, label }: StationLabelProps) => {
  return (
    <Html position={[position[0], position[1] + 1.0, position[2]]} center distanceFactor={10}>
      <div style={{
        fontFamily: "'Instrument Serif', serif",
        color: "white",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        minWidth: "300px",
        padding: "6px 12px",
        borderRadius: "8px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        textAlign: "center",
        pointerEvents: "none",
        userSelect: "none",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
      }}>
        <div style={{ fontSize: "20px", fontWeight: "bold", lineHeight: "1.1" }}>{number}</div>
        <div style={{ fontSize: "11px", marginTop: "2px", letterSpacing: "0.03em" }}>{label}</div>
      </div>
    </Html>
  );
};

/**
 * KONTORET — lyst, ryddig kontor med dagslys. Tema: «agenten jobber på dine filer».
 * Spilleren går fra lobby-døra (z = -8.7) framover langs en lys løper, forbi fire
 * nummererte arbeidsstasjoner (1 → 4), og ut døra til Postrommet (z = +8.7).
 */
export const Room2 = () => {
  // Lyst tregulv (samme laminat som lobbyen, men mer dagslys på det)
  const floorTextures = useTexture({
    map: "/textures/laminate_floor_03/laminate_floor_03_diff_1k.jpg",
    normalMap: "/textures/laminate_floor_03/laminate_floor_03_nor_gl_1k.jpg",
    roughnessMap: "/textures/laminate_floor_03/laminate_floor_03_rough_1k.jpg",
  });

  // Load fine grained wood for floor and ceiling
  const woodTextures = useTexture({
    map: "/textures/fine_grained_wood/diff.jpg",
    normalMap: "/textures/fine_grained_wood/nor.jpg",
    roughnessMap: "/textures/fine_grained_wood/rough.jpg",
  });

  const daytimeSkyTexture = useTexture("/artwork/daytime_sky.png");

  useMemo(() => {
    Object.values(floorTextures).forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(6, 6);
    });
    Object.values(woodTextures).forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(6, 6);
    });
  }, [floorTextures, woodTextures]);

  const textureOrganizing = useTexture("/artwork/kontor_organizing.png");
  const texturePdfData = useTexture("/artwork/kontor_pdf_data.png");

  return (
    <group>
      {/* ---------- Rom-skall (18 x 18) ---------- */}
      {/* Gulv */}
      <RigidBody type="fixed" position={[0, -0.1, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[18, 0.2, 18]} />
          <meshStandardMaterial {...woodTextures} color="#c8a877" />
        </mesh>
      </RigidBody>

      {/* Asymmetrisk skråtak (shed-tak) (Y = 6.5 i øst, Y = 9.5 i vest) med integrert takvindu */}
      <group position={[0, 8.0, 0]} rotation={[0, 0, -Math.atan(3 / 18)]}>
        {/* Vestlig solid del av taket */}
        <RigidBody type="fixed" colliders="cuboid">
          <mesh receiveShadow position={[-8, 0, 0]}>
            <boxGeometry args={[2, 0.2, 18]} />
            <meshStandardMaterial {...woodTextures} color="#c8a877" />
          </mesh>
        </RigidBody>

        {/* Østlig solid del av taket */}
        <RigidBody type="fixed" colliders="cuboid">
          <mesh receiveShadow position={[2, 0, 0]}>
            <boxGeometry args={[14, 0.2, 18]} />
            <meshStandardMaterial {...woodTextures} color="#c8a877" />
          </mesh>
        </RigidBody>

        {/* Nord/Sør-rammer rundt takvinduet */}
        <RigidBody type="fixed" colliders="cuboid">
          <mesh receiveShadow position={[-6, 0, -8]}>
            <boxGeometry args={[2, 0.2, 2]} />
            <meshStandardMaterial {...woodTextures} color="#c8a877" />
          </mesh>
        </RigidBody>
        <RigidBody type="fixed" colliders="cuboid">
          <mesh receiveShadow position={[-6, 0, 8]}>
            <boxGeometry args={[2, 0.2, 2]} />
            <meshStandardMaterial {...woodTextures} color="#c8a877" />
          </mesh>
        </RigidBody>

        {/* Takvindu glass (skylight) */}
        <mesh position={[-6, 0, 0]}>
          <boxGeometry args={[2, 0.1, 14]} />
          <meshPhysicalMaterial color="#eaf6ff" transmission={0.9} opacity={0.5} transparent roughness={0.05} />
        </mesh>
      </group>

      {/* Bakvegg (Nord, z = -9) — lobby-døra */}
      <RigidBody type="fixed" position={[0, 6, -9]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[18, 12, 0.4]} />
          <meshStandardMaterial color="#e6dbc4" roughness={0.95} metalness={0} />
        </mesh>
      </RigidBody>

      {/* Frontvegg (Sør, z = 9) — døra videre */}
      <RigidBody type="fixed" position={[0, 6, 9]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[18, 12, 0.4]} />
          <meshStandardMaterial color="#e6dbc4" roughness={0.95} metalness={0} />
        </mesh>
      </RigidBody>

      {/* Høyre vegg (Øst, x = 9) */}
      <RigidBody type="fixed" position={[9, 6, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 12, 18]} />
          <meshStandardMaterial color="#e6dbc4" roughness={0.95} metalness={0} />
        </mesh>
      </RigidBody>

      {/* Venstre vegg (Vest, x = -9) med full-bredde vindu (panorama) */}
      <group position={[-9, 0, 0]}>
        {/* Brystning under og overstykke over vinduet (hele bredden) */}
        <RigidBody type="fixed" position={[0, 0.75, 0]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[0.4, 1.5, 18.0]} />
            <meshStandardMaterial color="#e6dbc4" roughness={0.95} metalness={0} />
          </mesh>
        </RigidBody>
        <RigidBody type="fixed" position={[0, 6.75, 0]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[0.4, 5.5, 18.0]} />
            <meshStandardMaterial color="#e6dbc4" roughness={0.95} metalness={0} />
          </mesh>
        </RigidBody>

        {/* Glass (hele bredden) */}
        <RigidBody type="fixed" position={[0, 2.75, 0]}>
          <mesh>
            <boxGeometry args={[0.1, 2.5, 18.0]} />
            <meshPhysicalMaterial color="#eaf6ff" transmission={0.85} opacity={1} transparent roughness={0.05} />
          </mesh>
        </RigidBody>
        
        {/* Vindussprosser / Poster */}
        {[-6.0, -3.0, 0.0, 3.0, 6.0].map((zVal) => (
          <mesh key={`sprosse-${zVal}`} position={[0, 2.75, zVal]}>
            <boxGeometry args={[0.15, 2.5, 0.15]} />
            <meshStandardMaterial color="#5a5a5a" />
          </mesh>
        ))}

        {/* Innfallende dagslys fra vinduet (flere lyspunkter for jevn fordeling) */}
        <pointLight position={[2, 3, -4.5]} intensity={3.5} color="#fdf4e3" distance={12} decay={2} />
        <pointLight position={[2, 3, 0.0]} intensity={3.5} color="#fdf4e3" distance={12} decay={2} />
        <pointLight position={[2, 3, 4.5]} intensity={3.5} color="#fdf4e3" distance={12} decay={2} />
      </group>

      {/* Landscape Painting behind Portal (daytimeSkyTexture) on South Wall */}
      <group position={[0, 4.5, 8.78]} rotation={[0, Math.PI, 0]}>
        {/* Frame */}
        <mesh castShadow>
          <boxGeometry args={[5.2, 3.7, 0.08]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
        {/* Canvas */}
        <mesh position={[0, 0, 0.045]} castShadow>
          <planeGeometry args={[5.0, 3.5]} />
          <meshStandardMaterial map={daytimeSkyTexture} roughness={0.3} />
        </mesh>
      </group>
      {/* Lamp over landscape painting */}
      <mesh position={[0, 6.5, 8.6]} rotation={[0, Math.PI, 0]}>
        <boxGeometry args={[0.6, 0.05, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0, 6.45, 8.6]} rotation={[0, Math.PI, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <pointLight position={[0, 6.3, 8.6]} intensity={12} color="#fff1dd" distance={8} decay={2} castShadow />



      {/* Diskré takpunkter som markerer den svingete stien (tilpasset det skrå taket) */}
      {[
        [1.0, -6.0],
        [-1.0, -3.0],
        [1.0, 0.0],
        [-1.0, 3.0],
        [-1.0, 6.0],
      ].map(([x, z], idx) => {
        const ceilingY = 8.0 - x / 6;
        const y = ceilingY - 0.7;
        return (
          <pointLight key={idx} position={[x, y, z]} intensity={1.6} color="#fdf6e8" distance={7} decay={2} />
        );
      })}

      {/* ---------- Platå (Y = 0.6) for stasjon 3 og 4 (Z = 0 til 9) ---------- */}
      <RigidBody type="fixed" position={[0, 0.3, 4.5]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[18, 0.6, 9]} />
          <meshStandardMaterial {...floorTextures} color="#c8a877" roughness={0.8} metalness={0} />
        </mesh>
      </RigidBody>

      {/* 3 trinn som leder opp til platået (plassert rett før platået ved Z = 0) */}
      {/* 3 trinn som leder opp til platået (visuals only) */}
      {/* Trinn 1 */}
      <mesh position={[0, 0.075, -0.9]} receiveShadow castShadow>
        <boxGeometry args={[18, 0.15, 0.3]} />
        <meshStandardMaterial {...floorTextures} color="#c8a877" roughness={0.8} />
      </mesh>
      {/* Trinn 2 */}
      <mesh position={[0, 0.225, -0.6]} receiveShadow castShadow>
        <boxGeometry args={[18, 0.30, 0.3]} />
        <meshStandardMaterial {...floorTextures} color="#c8a877" roughness={0.8} />
      </mesh>
      {/* Trinn 3 */}
      <mesh position={[0, 0.375, -0.3]} receiveShadow castShadow>
        <boxGeometry args={[18, 0.45, 0.3]} />
        <meshStandardMaterial {...floorTextures} color="#c8a877" roughness={0.8} />
      </mesh>

      {/* Invisible Slanted Ramp Collider for smooth platform entry */}
      <RigidBody type="fixed" position={[0, 0.3, -0.45]} rotation={[Math.atan2(0.6, 0.9), 0, 0]}>
        <CuboidCollider args={[9.0, 0.05, 0.541]} />
      </RigidBody>

      {/* ---------- Kunstverk ---------- */}
      {/* 1. kontor_organizing.png henges over arkivskapene på Stasjon 2 */}
      <group position={[-8.8, 2.8, -1.5]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[3.2, 2.2, 0.08]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[3.0, 2.0]} />
          <meshStandardMaterial map={textureOrganizing} roughness={0.3} />
        </mesh>
      </group>

      {/* 2. kontor_pdf_data.png henges over Stasjon 3 på platåveggen */}
      <group position={[8.8, 3.4, 1.5]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[3.2, 2.2, 0.08]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[3.0, 2.0]} />
          <meshStandardMaterial map={texturePdfData} roughness={0.3} />
        </mesh>
      </group>

      {/* ===================================================================
          STASJON 1 — hva_kan_agent_gjoere · "På dine filer"
          Arbeidsplass med laptop + skrivebordslampe, høyre side.
          =================================================================== */}
      <group position={[4.5, 0, -4.5]}>
        <Model id="metal_office_desk" position={[2.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} scale={1.5} solid />
        <Model id="classic_laptop" position={[2.5, 1.1813, 0]} rotation={[0, -Math.PI / 2, 0]} scale={1.5} />
        <Model id="desk_lamp_arm_01" position={[3.2, 1.1813, -0.9]} rotation={[0, Math.PI / 2, 0]} scale={1.5} />
        <Model id="SchoolChair_01" position={[1.0, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={1.5} solid />
        <pointLight position={[2.0, 1.25, -0.4]} intensity={2.2} color="#ffe6c0" distance={4} decay={2} />

        {/* Flytende nummer + tittel over stien */}
        <StationLabel position={[-2.3, 3.0, 0]} number="1" label="På dine filer" />

        <AudioZone
          position={[-2.3, 1, 0]}
          size={[6, 4, 2.8]}
          audioUrl="/tts/hva_kan_agent_gjoere.mp3"
          subtitleUrl="/tts/hva_kan_agent_gjoere.json"
        />
      </group>

      {/* ===================================================================
          STASJON 2 — fil_rydde_mappe · "Rydde en mappe"
          Arkivskap med planten ved siden, venstre side.
          =================================================================== */}
      <group position={[-4.5, 0, -1.5]}>
        <Model id="drawer_cabinet" position={[-2.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={1.5} solid />
        <Model id="potted_plant_02" position={[-3.2, 0, -1.9]} rotation={[0, 0, 0]} scale={1.5} />

        <StationLabel position={[2.3, 3.5, 0]} number="2" label="Rydde en mappe" />

        <AudioZone
          position={[2.3, 1, 0]}
          size={[6, 4, 2.8]}
          audioUrl="/tts/fil_rydde_mappe.mp3"
          subtitleUrl="/tts/fil_rydde_mappe.json"
        />
      </group>

      {/* ===================================================================
          STASJON 3 — fil_pdf_regneark · "30 PDF → 1 ark"
          Arbeidsplass nummer to med laptop, høyre side. Plassert på platå (Y = 0.6)
          =================================================================== */}
      <group position={[4.5, 0.6, 1.5]}>
        <Model id="metal_office_desk" position={[2.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} scale={1.5} solid />
        <Model id="classic_laptop" position={[2.5, 1.1813, 0]} rotation={[0, -Math.PI / 2, 0]} scale={1.5} />
        <Model id="desk_lamp_arm_01" position={[3.2, 1.1813, 0.9]} rotation={[0, Math.PI / 2, 0]} scale={1.5} />
        <Model id="modern_arm_chair_01" position={[1.0, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={1.5} solid />
        <pointLight position={[2.0, 1.25, 0.4]} intensity={2.2} color="#ffe6c0" distance={4} decay={2} />

        <StationLabel position={[-2.3, 2.4, 0]} number="3" label="30 PDF → 1 ark" />

        <AudioZone
          position={[-2.3, 1, 0]}
          size={[6, 4, 2.8]}
          audioUrl="/tts/fil_pdf_regneark.mp3"
          subtitleUrl="/tts/fil_pdf_regneark.json"
        />
      </group>

      {/* ===================================================================
          STASJON 4 — tusen_problemer · "Det forenende grepet"
          Bokhylle med oppslagsverk, venstre side. Plassert på platå (Y = 0.6)
          =================================================================== */}
      <group position={[-4.5, 0.6, 4.5]}>
        <Model id="wooden_bookshelf_worn" position={[-2.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={1.5} solid />
        <Model id="book_encyclopedia_set_01" position={[-2.3, 1.65, 0]} rotation={[0, Math.PI / 2, 0]} scale={1.5} />
        <Model id="potted_plant_02" position={[-2.9, 0, 2.0]} rotation={[0, 0, 0]} scale={1.5} />

        <StationLabel position={[2.3, 2.9, 0]} number="4" label="Det forenende grepet" />

        <AudioZone
          position={[2.3, 1, 0]}
          size={[6, 4, 2.8]}
          audioUrl="/tts/tusen_problemer.mp3"
          subtitleUrl="/tts/tusen_problemer.json"
        />
      </group>

      {/* ---------- Liv i hjørnene ---------- */}
      <Model id="potted_plant_01" position={[7.5, 0, -7.5]} scale={1.5} />
      <Model id="potted_plant_01" position={[7.5, 0.6, 7.5]} scale={1.5} />

      {/* ---------- Dører ---------- */}
      {/* TILBAKE til stua (bakvegg, bakkeplan) */}
      <Portal position={[0, 0, -7.0]} room="lobby" label="Tilbake til stua" color="#ff4a4a" />
      {/* VIDERE til Postrommet (frontvegg, hevet til platå Y = 0.6) */}
      <Portal position={[0, 0.6, 7.0]} rotation={[0, Math.PI, 0]} room="room3" label="Postrommet" color="#3aa0ff" />

      {/* ---------- Belysning: lyst, mykt dagslys ---------- */}
      <ambientLight intensity={0.02} color="#fff3e0" />
      <hemisphereLight args={["#fdfbf5", "#8a7a62", 0.03]} />
      <directionalLight
        position={[-8, 12, 4]}
        intensity={2.2}
        color="#fff1da"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={45}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-bias={-0.0005}
      />

      {/* ---------- 3 Footballs inside Room 2 ---------- */}
      <Football position={[-2.5, 0.5, -2.5]} />
      <Football position={[2.5, 1.1, 2.5]} />
      <Football position={[0.0, 1.1, 1.0]} />

      {/* Decorative items */}
      <Model id="wall_clock_1k" position={[0, 6.0, -8.75]} rotation={[0, 0, 0]} scale={1.8} solid={false} />
      <Model id="ceramic_vase_01_1k" position={[-8.9, 1.51, 1.0]} rotation={[0, 0, 0]} scale={1.5} solid={false} />
    </group>
  );
};

useTexture.preload("/textures/laminate_floor_03/laminate_floor_03_diff_1k.jpg");
useTexture.preload("/textures/laminate_floor_03/laminate_floor_03_nor_gl_1k.jpg");
useTexture.preload("/textures/laminate_floor_03/laminate_floor_03_rough_1k.jpg");
useTexture.preload("/artwork/kontor_organizing.png");
useTexture.preload("/artwork/kontor_pdf_data.png");
useTexture.preload("/textures/fine_grained_wood/diff.jpg");
useTexture.preload("/textures/fine_grained_wood/nor.jpg");
useTexture.preload("/textures/fine_grained_wood/rough.jpg");
useTexture.preload("/artwork/daytime_sky.png");

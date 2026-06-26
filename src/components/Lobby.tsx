import { useMemo } from "react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useTexture, Text, Billboard } from "@react-three/drei";
import * as THREE from "three";

import { Portal } from "./Portal";
import { Model } from "./Model";
import { AudioZone } from "./AudioZone";
import { Football } from "./Football";

export const Lobby = () => {
  // Load laminate floor textures (gir et varmt tregulv) — BEHOLDT
  const floorTextures = useTexture({
    map: "/textures/laminate_floor_03/laminate_floor_03_diff_1k.jpg",
    normalMap: "/textures/laminate_floor_03/laminate_floor_03_nor_gl_1k.jpg",
    roughnessMap: "/textures/laminate_floor_03/laminate_floor_03_rough_1k.jpg",
  });

  // Load clay plaster wall textures
  const wallTextures = useTexture({
    map: "/textures/clay_plaster/diff.jpg",
    normalMap: "/textures/clay_plaster/nor.jpg",
    roughnessMap: "/textures/clay_plaster/rough.jpg",
  });

  const twilightGardenTexture = useTexture("/artwork/twilight_garden.png");

  useMemo(() => {
    Object.values(floorTextures).forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(6, 6);
    });
    Object.values(wallTextures).forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4);
    });
  }, [floorTextures, wallTextures]);

  const textureWelkommen = useTexture("/artwork/stua_welkommen.png");
  const textureCowork = useTexture("/artwork/stua_cowork.png");

  return (
    <group>
      {/* Tregulv (18x18) — BEHOLDT */}
      <RigidBody type="fixed" position={[0, -0.1, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[18, 0.2, 18]} />
          <meshStandardMaterial {...floorTextures} color="#b6905f" roughness={0.85} metalness={0} />
        </mesh>
      </RigidBody>

      {/* Tak (18x18) — Hevet til 9m */}
      <RigidBody type="fixed" position={[0, 9.1, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[18, 0.2, 18]} />
          <meshStandardMaterial color="#cdbfa6" roughness={1} />
        </mesh>
      </RigidBody>

      {/* ---------- Varme pussede vegger ---------- */}
      {/* Bakvegg (Nord, z=-9) */}
      <RigidBody type="fixed" position={[0, 4.5, -9]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[18, 9, 0.4]} />
          <meshStandardMaterial {...wallTextures} color="#d9cbb2" />
        </mesh>
      </RigidBody>

      {/* Venstre vegg (Vest, x=-9) */}
      <RigidBody type="fixed" position={[-9, 4.5, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 9, 18]} />
          <meshStandardMaterial {...wallTextures} color="#d9cbb2" />
        </mesh>
      </RigidBody>

      {/* Høyre vegg (Øst, x=9) med stort vindu som slipper inn dagslys */}
      <group position={[9, 0, 0]}>
        {/* Solide veggdeler rundt vinduet */}
        <RigidBody type="fixed" position={[0, 4.5, -6.5]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[0.4, 9, 5]} />
            <meshStandardMaterial {...wallTextures} color="#d9cbb2" />
          </mesh>
        </RigidBody>
        <RigidBody type="fixed" position={[0, 4.5, 6.5]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[0.4, 9, 5]} />
            <meshStandardMaterial {...wallTextures} color="#d9cbb2" />
          </mesh>
        </RigidBody>
        {/* Brystning under og overstykke over vinduet */}
        <RigidBody type="fixed" position={[0, 0.75, 0]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[0.4, 1.5, 8]} />
            <meshStandardMaterial {...wallTextures} color="#d9cbb2" />
          </mesh>
        </RigidBody>
        <RigidBody type="fixed" position={[0, 6.5, 0]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[0.4, 5, 8]} />
            <meshStandardMaterial {...wallTextures} color="#d9cbb2" />
          </mesh>
        </RigidBody>

        {/* Vindusglass + sprosse */}
        <RigidBody type="fixed" position={[0, 2.75, 0]}>
          <mesh>
            <boxGeometry args={[0.1, 2.5, 8]} />
            <meshPhysicalMaterial color="#e0f7fa" transmission={0.8} opacity={1} transparent roughness={0.1} />
          </mesh>
        </RigidBody>
        <mesh position={[0, 2.75, 0]}>
          <boxGeometry args={[0.2, 2.5, 0.15]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>
      </group>

      {/* Frontvegg med stort panoramavindu (Sør, z=9) */}
      <group position={[0, 0, 9]}>
        <RigidBody type="fixed" position={[-6.5, 4.5, 0]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[5, 9, 0.4]} />
            <meshStandardMaterial {...wallTextures} color="#d9cbb2" />
          </mesh>
        </RigidBody>
        <RigidBody type="fixed" position={[6.5, 4.5, 0]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[5, 9, 0.4]} />
            <meshStandardMaterial {...wallTextures} color="#d9cbb2" />
          </mesh>
        </RigidBody>

        {/* Stort gulv-til-tak panoramavindu */}
        <RigidBody type="fixed" position={[0, 4.5, 0]}>
          <mesh>
            <boxGeometry args={[8, 9, 0.1]} />
            <meshPhysicalMaterial color="#e0f7fa" transmission={0.8} opacity={1} transparent roughness={0.1} />
          </mesh>
        </RigidBody>
        <mesh position={[0, 4.5, 0]}>
          <boxGeometry args={[0.2, 9, 0.15]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>
      </group>

      {/* South window backdrop (moved further back for better parallax) */}
      <mesh position={[0, 4.5, 16.5]}>
        <planeGeometry args={[45, 24]} />
        <meshBasicMaterial map={twilightGardenTexture} toneMapped={false} />
      </mesh>

      {/* ---------- Mesanin-plattform på vestvegg (Y = 4.5) ---------- */}
      <RigidBody type="fixed" position={[-6.5, 4.4, -1]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[5, 0.2, 16]} />
          <meshStandardMaterial color="#cdbfa6" roughness={0.8} />
        </mesh>
      </RigidBody>

      {/* Rekkverk på mesaninen for å forhindre fall */}
      {/* Frontrekkverk ved Z = 7 (går fra X = -9 til X = -4) */}
      <RigidBody type="fixed" position={[-6.5, 5.0, 7.0]}>
        <mesh castShadow>
          <boxGeometry args={[5, 1.0, 0.1]} />
          <meshStandardMaterial color="#4a4a4a" roughness={0.5} />
        </mesh>
      </RigidBody>
      {/* Rekkverk langs kanten X = -4 (Del 1: Z = -9 til Z = -1.5) */}
      <RigidBody type="fixed" position={[-4.0, 5.0, -5.25]}>
        <mesh castShadow>
          <boxGeometry args={[0.1, 1.0, 7.5]} />
          <meshStandardMaterial color="#4a4a4a" roughness={0.5} />
        </mesh>
      </RigidBody>
      {/* Rekkverk langs kanten X = -4 (Del 2: Z = 0 til Z = 7) */}
      <RigidBody type="fixed" position={[-4.0, 5.0, 3.5]}>
        <mesh castShadow>
          <boxGeometry args={[0.1, 1.0, 7.0]} />
          <meshStandardMaterial color="#4a4a4a" roughness={0.5} />
        </mesh>
      </RigidBody>

      {/* ---------- Funksjonell trapp opp til mesaninen (visuals only) ---------- */}
      {Array.from({ length: 20 }, (_, i) => {
        const stepHeight = 4.5 / 20;
        const stepDepth = 6.0 / 20;
        const y = stepHeight * (i + 0.5);
        const z = 5.0 - stepDepth * i;
        const x = -3.25;
        return (
          <mesh key={i} position={[x, y, z]} castShadow receiveShadow>
            <boxGeometry args={[1.5, stepHeight, stepDepth]} />
            <meshStandardMaterial color="#6b4a2f" roughness={0.8} />
          </mesh>
        );
      })}

      {/* Invisible Slanted Ramp Collider for smooth stair climbing */}
      <RigidBody type="fixed" position={[-3.25, 2.25, 2.0]} rotation={[Math.atan2(4.5, 6.0), 0, 0]}>
        <CuboidCollider args={[0.75, 0.05, 3.75]} />
      </RigidBody>

      {/* ---------- Kunstverk ---------- */}
      {/* 1. stua_welkommen.png henges på vestveggen over sofaen */}
      <group position={[-8.8, 2.5, -3.8]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[3.2, 2.2, 0.08]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[3.0, 2.0]} />
          <meshStandardMaterial map={textureWelkommen} roughness={0.3} />
        </mesh>
      </group>

      {/* 2. stua_cowork.png henges over Cowork-området suspended fra det høye taket */}
      <group position={[0, 3.6, -1.5]} rotation={[0, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[3.2, 2.2, 0.08]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[3.0, 2.0]} />
          <meshStandardMaterial map={textureCowork} roughness={0.3} />
        </mesh>
      </group>
      {/* Opphengskabler for det hengende bildet */}
      <mesh position={[-1.0, 6.3, -1.5]}>
        <boxGeometry args={[0.02, 5.4, 0.02]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[1.0, 6.3, -1.5]}>
        <boxGeometry args={[0.02, 5.4, 0.02]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* ---------- Stue-vignett (flyttet til venstre og forstørret) ---------- */}
      {/* Sofa vendt mot vinduet (sør), lenestoler rundt sofabordet */}
      <Model id="sofa_03" position={[-4.5, 0, -3.8]} rotation={[0, 0, 0]} scale={1.6} solid />
      <Model id="throw_pillows_01_1k" position={[-4.5, 0.65, -3.8]} rotation={[0, 0, 0]} scale={1.5} solid={false} />
      
      <Model id="modern_coffee_table_01" position={[-4.5, 0, -1.3]} rotation={[0, 0, 0]} scale={1.6} solid />
      <Model id="chess_set_1k" position={[-4.5, 0.73, -1.3]} rotation={[0, 0, 0]} scale={1.4} solid={false} />
      <Model id="mid_century_lounge_chair" position={[-6.8, 0, -1.3]} rotation={[0, Math.PI * 0.8, 0]} scale={1.6} solid />
      <Model id="mid_century_lounge_chair" position={[-2.2, 0, -1.3]} rotation={[0, -Math.PI * 0.8, 0]} scale={1.6} solid />

      {/* Sidebord ved sofaen med oljelampe + varmt fyll-lys */}
      <Model id="side_table_01" position={[-6.9, 0, -3.8]} rotation={[0, 0, 0]} scale={1.6} solid />
      <Model id="vintage_oil_lamp" position={[-6.9, 0.88, -3.8]} rotation={[0, 0, 0]} scale={1.6} />
      <pointLight position={[-6.9, 1.76, -3.8]} intensity={2.5} color="#ffcf99" distance={5} decay={2} />

      {/* Bokhylle mot vestveggen med encyklopedi-sett */}
      <Model id="wooden_bookshelf_worn" position={[-8.4, 0, 3.2]} rotation={[0, Math.PI / 2, 0]} scale={1} solid />
      <Model id="book_encyclopedia_set_01" position={[-8.1, 1.1, 3.2]} rotation={[0, Math.PI / 2, 0]} scale={1} />

      {/* TV på kommode mot nordveggen (flyttet til høyre og vinklet for synlighet) */}
      <Model id="drawer_cabinet" position={[4.8, 0, -8.0]} rotation={[0, -Math.PI / 4, 0]} scale={1.3} solid />
      <Model id="Television_01" position={[4.8, 2.445, -8.0]} rotation={[0, -Math.PI / 4, 0]} scale={1.3} />

      {/* Ekstra møbel: Lesekrok i hjørnet (Vest, z=5) */}
      <Model id="round_wooden_table_01" position={[-6.0, 0, 5.0]} rotation={[0, 0, 0]} scale={1.5} solid />
      <Model id="potted_plant_02" position={[-6.0, 1.5075, 5.0]} rotation={[0, 0, 0]} scale={1.2} />
      <Model id="ArmChair_01" position={[-4.4, 0, 5.0]} rotation={[0, -Math.PI / 2, 0]} scale={1.5} res="1k" solid />

      {/* Planter i hjørnene */}
      <Model id="potted_plant_01" position={[-7.5, 0, -7.5]} rotation={[0, 0, 0]} scale={1} />
      <Model id="potted_plant_02" position={[7.5, 0, -7.5]} rotation={[0, 0, 0]} scale={1} />
      <Model id="potted_plant_01" position={[7.5, 0, 7.3]} rotation={[0, 0, 0]} scale={1} />

      {/* Chandelier hanging from high ceiling */}
      <Model id="Chandelier_01_1k" position={[-4.5, 8.9, -2]} rotation={[0, 0, 0]} scale={1.8} />
      <pointLight position={[-4.5, 8.0, -2]} intensity={12} color="#ffd9a0" distance={11} decay={2} castShadow />



      {/* ---------- Stasjon 2: Cowork (lenger inn ved sofagruppa) ---------- */}
      <AudioZone
        position={[0, 1, -0.5]}
        size={[5, 3, 4]}
        audioUrl="/tts/claude_cowork.mp3"
        subtitleUrl="/tts/claude_cowork.json"
      />
      <Billboard position={[0, 3.5, -0.5]}>
        <Text fontSize={0.25} color="#ffffff" anchorX="center">
          Cowork
        </Text>
      </Billboard>

      {/* VIDERE-DØR til Kontoret — fremhevet med varmt spotlys + dørmatte */}
      <Portal position={[0, 0, -7.0]} room="room2" label="Kontoret" color="#3aa0ff" />

      <spotLight
        position={[0, 8.6, -4.8]}
        target-position={[0, 0, -6.9]}
        angle={0.5}
        penumbra={0.6}
        intensity={35}
        color="#ffd8a8"
        distance={12}
        decay={2}
        castShadow
      />

      {/* Dør UT til uteplassen (sør) */}
      <Portal position={[0, 0, 7.0]} rotation={[0, Math.PI, 0]} room="outside" label="Ut" color="#ff4a4a" />

      {/* ---------- Generell varm/myk belysning ---------- */}
      <ambientLight intensity={0.02} color="#ffe2c2" />
      <hemisphereLight args={["#fff1dd", "#5a4a38", 0.04]} />
      <directionalLight
        position={[6, 13, 5]}
        intensity={0.75}
        color="#ffe0b0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={45}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-bias={-0.0005}
      />

      {/* ---------- 3 Footballs inside the Lobby ---------- */}
      <Football position={[-2.5, 0.5, 2.0]} />
      <Football position={[2.5, 0.5, 3.0]} />
      <Football position={[4.5, 0.5, 2.0]} />
    </group>
  );
};

useTexture.preload("/textures/laminate_floor_03/laminate_floor_03_diff_1k.jpg");
useTexture.preload("/textures/laminate_floor_03/laminate_floor_03_nor_gl_1k.jpg");
useTexture.preload("/textures/laminate_floor_03/laminate_floor_03_rough_1k.jpg");
useTexture.preload("/artwork/stua_welkommen.png");
useTexture.preload("/artwork/stua_cowork.png");
useTexture.preload("/textures/clay_plaster/diff.jpg");
useTexture.preload("/textures/clay_plaster/nor.jpg");
useTexture.preload("/textures/clay_plaster/rough.jpg");
useTexture.preload("/artwork/twilight_garden.png");

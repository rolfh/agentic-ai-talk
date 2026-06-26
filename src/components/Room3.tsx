import { useMemo } from "react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useTexture, Text, Billboard } from "@react-three/drei";
import * as THREE from "three";

import { Model } from "./Model";
import { AudioZone } from "./AudioZone";
import { Portal } from "./Portal";
import { Football } from "./Football";

/**
 * POSTROMMET — «den strekker seg ut».
 * Et varmt, utadvendt rom der agenten kobler seg til verden utenfor (MCP + nettleser).
 * Stort vindu mot en solfylt hage, payphone som blikkfang, en TV-«skjerm» som viser
 * nettleseren. Tre nummererte stasjoner langs en løper fra inngang (sør) til videre-dør (nord).
 */
export const Room3 = () => {
  // Varmt tregulv (laminat)
  const floorTextures = useTexture({
    map: "/textures/laminate_floor_03/laminate_floor_03_diff_1k.jpg",
    normalMap: "/textures/laminate_floor_03/laminate_floor_03_nor_gl_1k.jpg",
    roughnessMap: "/textures/laminate_floor_03/laminate_floor_03_rough_1k.jpg",
  });

  // Load brick texture for walls
  const wallTextures = useTexture({
    map: "/textures/brick_floor_003/diff.jpg",
    normalMap: "/textures/brick_floor_003/nor.jpg",
    roughnessMap: "/textures/brick_floor_003/rough.jpg",
  });

  const sunnyCourtyardTexture = useTexture("/artwork/sunny_courtyard.png");

  const mcpTexture = useTexture("/artwork/postrom_mcp.png");
  const browserTexture = useTexture("/artwork/postrom_browser_steering.png");

  useMemo(() => {
    Object.values(floorTextures).forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(5, 5);
    });
    Object.values(wallTextures).forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4);
    });
  }, [floorTextures, wallTextures]);

  return (
    <group>
      {/* ---------------- Rom-skall (18 x 18, lukket) ---------------- */}
      {/* Gulv */}
      <RigidBody type="fixed" position={[0, -0.1, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[18, 0.2, 18]} />
          <meshStandardMaterial {...floorTextures} color="#b6905f" roughness={0.85} metalness={0} />
        </mesh>
      </RigidBody>

      {/* Tak */}
      <RigidBody type="fixed" position={[0, 6.1, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[18, 0.2, 18]} />
          <meshStandardMaterial color="#cdbfa6" roughness={1} />
        </mesh>
      </RigidBody>

      {/* Nordvegg (z = -9) — bak videre-døra (kun vestre del er synlig pga L-shape) */}
      <RigidBody type="fixed" position={[-3.5, 3, -9]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[11, 6, 0.4]} />
          <meshStandardMaterial {...wallTextures} color="#dcccb0" />
        </mesh>
      </RigidBody>

      {/* Sørvegg (z = +9) — bak tilbake-døra */}
      <RigidBody type="fixed" position={[0, 3, 9]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[18, 6, 0.4]} />
          <meshStandardMaterial {...wallTextures} color="#dcccb0" />
        </mesh>
      </RigidBody>

      {/* Vestvegg (x = -9) — stasjonsvegg */}
      <RigidBody type="fixed" position={[-9, 3, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 6, 18]} />
          <meshStandardMaterial {...wallTextures} color="#d9cbb2" />
        </mesh>
      </RigidBody>

      {/* ---------------- L-shape Inner Partition Walls ---------------- */}
      {/* Partition wall blocking northeast quadrant: Z from -9 to -2 at X = 2.0 */}
      <RigidBody type="fixed" position={[2.0, 3.0, -5.5]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 6.0, 7.0]} />
          <meshStandardMaterial {...wallTextures} color="#d9cbb2" />
        </mesh>
      </RigidBody>
      {/* Partition wall blocking northeast quadrant: X from 2 to 9 at Z = -2.0 */}
      <RigidBody type="fixed" position={[5.5, 3.0, -2.0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[7.0, 6.0, 0.4]} />
          <meshStandardMaterial {...wallTextures} color="#d9cbb2" />
        </mesh>
      </RigidBody>

      {/* ---------------- Østvegg (x = +9) med sirkulært glasskarnapp (bay window) ---------------- */}
      {/* Sørlig solid del av østvegg: Z fra 5.0 til 9.0 */}
      <RigidBody type="fixed" position={[9.0, 3.0, 7.0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 6.0, 4.0]} />
          <meshStandardMaterial {...wallTextures} color="#d9cbb2" />
        </mesh>
      </RigidBody>
      {/* Nordlig solid del av østvegg: Z fra -2.0 til 1.0 */}
      <RigidBody type="fixed" position={[9.0, 3.0, -0.5]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 6.0, 3.0]} />
          <meshStandardMaterial {...wallTextures} color="#d9cbb2" />
        </mesh>
      </RigidBody>
      {/* Veggdel under vinduet: Z fra 1.0 til 5.0, høyde 0.8 */}
      <RigidBody type="fixed" position={[9.0, 0.4, 3.0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 0.8, 4.0]} />
          <meshStandardMaterial {...wallTextures} color="#d9cbb2" />
        </mesh>
      </RigidBody>
      {/* Veggdel over vinduet: Z fra 1.0 til 5.0, høyde 1.5 (Y=4.5 til 6.0) */}
      <RigidBody type="fixed" position={[9.0, 5.25, 3.0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 1.5, 4.0]} />
          <meshStandardMaterial {...wallTextures} color="#d9cbb2" />
        </mesh>
      </RigidBody>

      {/* Glasskarnapp Gulv & Tak */}
      <RigidBody type="fixed" position={[9.75, -0.1, 3.0]}>
        <mesh receiveShadow>
          <boxGeometry args={[1.5, 0.2, 4.0]} />
          <meshStandardMaterial color="#b6905f" roughness={0.85} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[9.75, 5.9, 3.0]}>
        <mesh>
          <boxGeometry args={[1.5, 0.2, 4.0]} />
          <meshStandardMaterial color="#cdbfa6" roughness={1} />
        </mesh>
      </RigidBody>

      {/* Sittebenk i karnappet */}
      <RigidBody type="fixed" position={[9.75, 0.25, 3.0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[1.2, 0.5, 3.6]} />
          <meshStandardMaterial color="#5b4a36" roughness={0.7} />
        </mesh>
      </RigidBody>
      {/* Komfortable sitteputer */}
      <mesh position={[9.75, 0.525, 3.0]}>
        <boxGeometry args={[1.1, 0.05, 3.4]} />
        <meshStandardMaterial color="#9c6644" roughness={0.9} />
      </mesh>

      {/* Glass i karnappet (blokkerer spilleren) */}
      <RigidBody type="fixed" position={[10.5, 2.65, 3.0]}>
        <mesh>
          <boxGeometry args={[0.1, 3.7, 2.0]} />
          <meshPhysicalMaterial color="#eaf6ff" transmission={0.9} opacity={0.6} transparent roughness={0.05} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[9.75, 2.65, 4.5]} rotation={[0, Math.atan2(1.5, -1.0), 0]}>
        <mesh>
          <boxGeometry args={[0.1, 3.7, 1.8]} />
          <meshPhysicalMaterial color="#eaf6ff" transmission={0.9} opacity={0.6} transparent roughness={0.05} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[9.75, 2.65, 1.5]} rotation={[0, Math.atan2(1.5, 1.0), 0]}>
        <mesh>
          <boxGeometry args={[0.1, 3.7, 1.8]} />
          <meshPhysicalMaterial color="#eaf6ff" transmission={0.9} opacity={0.6} transparent roughness={0.05} />
        </mesh>
      </RigidBody>

      {/* Vindussprosser / Poster */}
      <mesh position={[10.5, 2.65, 4.0]}>
        <boxGeometry args={[0.12, 3.7, 0.12]} />
        <meshStandardMaterial color="#5b4a36" roughness={0.7} />
      </mesh>
      <mesh position={[10.5, 2.65, 2.0]}>
        <boxGeometry args={[0.12, 3.7, 0.12]} />
        <meshStandardMaterial color="#5b4a36" roughness={0.7} />
      </mesh>
      <mesh position={[9.0, 2.65, 5.0]}>
        <boxGeometry args={[0.12, 3.7, 0.12]} />
        <meshStandardMaterial color="#5b4a36" roughness={0.7} />
      </mesh>
      <mesh position={[9.0, 2.65, 1.0]}>
        <boxGeometry args={[0.12, 3.7, 0.12]} />
        <meshStandardMaterial color="#5b4a36" roughness={0.7} />
      </mesh>

      {/* Lyset fra vinduet */}
      <pointLight position={[10.8, 2.65, 3.0]} intensity={6} color="#fff1d6" distance={14} decay={2} />

      {/* East window backdrop (moved further back for better parallax) */}
      <mesh position={[16.5, 3.0, 3.0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[35, 21]} />
        <meshBasicMaterial map={sunnyCourtyardTexture} toneMapped={false} />
      </mesh>

      {/* Tittel over rommet */}
      <Text
        position={[-3.5, 5.2, -8.7]}
        fontSize={0.45}
        color="#8a6a44"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#fff6e6"
      >
        POSTROMMET — DEN STREKKER SEG UT
      </Text>



      {/* ---------------- PLATFORM & STAIRS IN NW CORNER ---------------- */}
      {/* Raised Platform */}
      <RigidBody type="fixed" position={[-7.0, 1.0, -7.0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[4, 2.0, 4]} />
          <meshStandardMaterial color="#dcccb0" roughness={0.8} />
        </mesh>
      </RigidBody>

      {/* Railings on the platform */}
      <mesh position={[-5.0, 2.5, -7.0]}>
        <boxGeometry args={[0.08, 1.0, 4.0]} />
        <meshStandardMaterial color="#5b4a36" roughness={0.7} />
      </mesh>
      <mesh position={[-8.5, 2.5, -5.0]}>
        <boxGeometry args={[1.0, 1.0, 0.08]} />
        <meshStandardMaterial color="#5b4a36" roughness={0.7} />
      </mesh>
      <mesh position={[-5.5, 2.5, -5.0]}>
        <boxGeometry args={[1.0, 1.0, 0.08]} />
        <meshStandardMaterial color="#5b4a36" roughness={0.7} />
      </mesh>

      {/* Stairs: 10 steps climbing (visuals only) */}
      {Array.from({ length: 10 }).map((_, idx) => {
        const stepHeight = 0.2;
        const stepDepth = 0.3;
        const stepWidth = 2.0;
        const y = (idx + 0.5) * stepHeight;
        const z = -5.0 + (9 - idx) * stepDepth + stepDepth / 2;
        const x = -7.0;
        return (
          <mesh key={`step-${idx}`} position={[x, y, z]} receiveShadow castShadow>
            <boxGeometry args={[stepWidth, stepHeight, stepDepth]} />
            <meshStandardMaterial color="#7d4a36" roughness={0.8} />
          </mesh>
        );
      })}

      {/* Invisible Slanted Ramp Collider for smooth stair climbing */}
      <RigidBody type="fixed" position={[-7.0, 1.0, -3.5]} rotation={[Math.atan2(2.0, 3.0), 0, 0]}>
        <CuboidCollider args={[1.0, 0.05, 1.803]} />
      </RigidBody>

      {/* ================= STASJON 1 — MCP (z = 1.0) ================= */}
      <group position={[-5.0, 0, 1.0]}>
        {/* Payphone som blikkfang — kobling/telefon-motiv, mot vestveggen */}
        <Model id="korean_public_payphone_01" position={[-2.3, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={1.5} solid />
        {/* Sidebord med oljelampe ved siden av */}
        <Model id="side_table_01" position={[-1.0, 0, 2.4]} rotation={[0, 0, 0]} scale={1.5} solid />
        <Model id="vintage_oil_lamp" position={[-1.0, 0.8261, 2.4]} rotation={[0, 0, 0]} scale={1.5} />
        <pointLight position={[-1.0, 1.5, 2.4]} intensity={4.5} color="#ffcf99" distance={6} decay={2} />

        {/* Flytende nummer + tittel ved stien */}
        <Billboard position={[2.5, 3.5, 0]}>
          <Text fontSize={0.45} color="#ffffff" anchorX="center">
            1
          </Text>
          <Text position={[0, -0.4, 0]} fontSize={0.22} color="#ffffff" anchorX="center">
            MCP
          </Text>
        </Billboard>

        <AudioZone
          position={[2.5, 1, 0]}
          size={[6, 4, 4]}
          audioUrl="/tts/mcp_mange_programmer.mp3"
          subtitleUrl="/tts/mcp_mange_programmer.json"
        />
      </group>

      {/* Painting 1: postrom_mcp (next to payphone) */}
      <group position={[-8.78, 2.4, 3.2]} rotation={[0, Math.PI / 2, 0]}>
        {/* Frame */}
        <mesh castShadow>
          <boxGeometry args={[1.8, 1.2, 0.08]} />
          <meshStandardMaterial color="#2b1d0c" roughness={0.7} />
        </mesh>
        {/* Canvas */}
        <mesh position={[0, 0, 0.041]} castShadow>
          <planeGeometry args={[1.7, 1.1]} />
          <meshStandardMaterial map={mcpTexture} roughness={0.2} metalness={0.1} />
        </mesh>
      </group>

      {/* ================= STASJON 2 — MCP-servere (z = -0.5) ================= */}
      <group position={[5.0, 0, -0.5]}>
        {/* TV på kommode = «skjerm» som viser nettleseren/serverne, vendt mot rommet */}
        <Model id="drawer_cabinet" position={[2.2, 0, 0]} rotation={[0, -Math.PI / 2, 0]} scale={1.5} solid />
        <Model id="Television_01" position={[2.05, 2.822, 0]} rotation={[0, -Math.PI / 2, 0]} scale={1.5} />
        <pointLight position={[1.0, 3.642, 0]} intensity={3.5} color="#bcd6ff" distance={5} decay={2} />
        {/* Skjerm-glød / liste over tilkoblede servere */}
        <Text
          position={[1.78, 3.692, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={0.16}
          color="#dff0ff"
          maxWidth={2.0}
          textAlign="center"
          outlineWidth={0.004}
          outlineColor="#1a2a44"
        >
          {"MCP-SERVERE\nChrome · Blender\nPhotoshop · Premiere"}
        </Text>

        {/* Flytende nummer + tittel */}
        <Billboard position={[-2.5, 3.5, 0]}>
          <Text fontSize={0.45} color="#ffffff" anchorX="center">
            2
          </Text>
          <Text position={[0, -0.4, 0]} fontSize={0.22} color="#ffffff" anchorX="center">
            MCP-servere
          </Text>
        </Billboard>

        <AudioZone
          position={[-2.5, 1, 0.5]}
          size={[5, 4, 3]}
          audioUrl="/tts/mcp_servere.mp3"
          subtitleUrl="/tts/mcp_servere.json"
        />
      </group>

      {/* Painting 2: postrom_browser_steering (above TV/drawer cabinet) */}
      <group position={[7.0, 3.2, -0.5]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Frame */}
        <mesh castShadow>
          <boxGeometry args={[1.8, 1.2, 0.08]} />
          <meshStandardMaterial color="#2b1d0c" roughness={0.7} />
        </mesh>
        {/* Canvas */}
        <mesh position={[0, 0, 0.041]} castShadow>
          <planeGeometry args={[1.7, 1.1]} />
          <meshStandardMaterial map={browserTexture} roughness={0.2} metalness={0.1} />
        </mesh>
      </group>

      {/* ================= STASJON 3 — Claude in Chrome (z = 5.0) ================= */}
      <group position={[-5.0, 0, 5.0]}>
        {/* Rundt bord med laptop = nettleseren */}
        <Model id="round_wooden_table_01" position={[-1.0, 0, 0]} rotation={[0, 0, 0]} scale={1.5} solid />
        <Model id="classic_laptop" position={[-1.0, 1.5075, 0]} rotation={[0, Math.PI / 2, 0]} scale={1.5} />
        <Model id="desk_lamp_arm_01" position={[-1.9, 1.5075, 0.9]} rotation={[0, 0.6, 0]} scale={1.5} />
        <pointLight position={[-1.0, 2.268, 0]} intensity={4.0} color="#ffe0b0" distance={5} decay={2} />

        {/* Flytende nummer + tittel */}
        <Billboard position={[2.5, 3.5, 0]}>
          <Text fontSize={0.45} color="#ffffff" anchorX="center">
            3
          </Text>
          <Text position={[0, -0.4, 0]} fontSize={0.22} color="#ffffff" anchorX="center">
            Claude in Chrome
          </Text>
        </Billboard>

        <AudioZone
          position={[2.5, 1, 0]}
          size={[6, 4, 4]}
          audioUrl="/tts/claude_in_chrome.mp3"
          subtitleUrl="/tts/claude_in_chrome.json"
        />
      </group>

      {/* ---------------- Østvendt sittekrok (i karnappet) ---------------- */}
      <Model id="modern_arm_chair_01" position={[6.0, 0, 3.5]} rotation={[0, Math.PI / 2 + 0.5, 0]} scale={1.5} solid />
      <Model id="modern_arm_chair_01" position={[6.0, 0, 1.5]} rotation={[0, Math.PI / 2 - 0.5, 0]} scale={1.5} solid />
      <Model id="round_wooden_table_01" position={[7.2, 0, 2.5]} rotation={[0, 0, 0]} scale={1.5} solid />
      <Model id="potted_plant_01" position={[7.2, 1.5075, 2.5]} rotation={[0, 0, 0]} scale={1.5} />
      <Model id="potted_plant_01" position={[7.6, 0, 5.2]} rotation={[0, 0, 0]} scale={1.5} />
      <Model id="potted_plant_01" position={[7.6, 0, -1.2]} rotation={[0, 0, 0]} scale={1.5} />

      {/* Plante ved inngangen for å ramme inn stien */}
      <Model id="potted_plant_02" position={[-7.6, 0, 7.4]} rotation={[0, 0, 0]} scale={1.5} />

      {/* ---------------- Belysning (varm og myk) ---------------- */}
      <ambientLight intensity={0.02} color="#ffe8cc" />
      <hemisphereLight args={["#fff1dd", "#5a4a38", 0.03]} />
      <directionalLight
        position={[12, 11, 3]}
        intensity={2.0}
        color="#ffe6bc"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={45}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0005}
      />

      {/* ---------------- Dører ---------------- */}
      {/* VIDERE — Biblioteket (plassert på raised platform i NW-hjørnet) */}
      <Portal position={[-7.0, 2.0, -8.0]} room="room4" label="Biblioteket" color="#3aa0ff" />
      {/* TILBAKE — Kontoret (sørvegg) */}
      <Portal position={[3, 0, 7.0]} rotation={[0, Math.PI, 0]} room="room2" label="Tilbake til kontoret" color="#ff4a4a" />

      {/* ---------- 3 Footballs inside Room 3 ---------- */}
      <Football position={[-2.5, 0.5, -2.5]} />
      <Football position={[1.0, 0.5, 3.0]} />
      <Football position={[3.0, 0.5, 0.0]} />

      {/* Decorative items */}
      <Model id="vintage_wooden_drawer_01_1k" position={[7.2, 0, 7.5]} rotation={[0, -Math.PI / 2, 0]} scale={1.3} solid />
      <Model id="circuit_board_1k" position={[7.2, 1.2, 7.5]} rotation={[0, 0, 0]} scale={1.2} solid={false} />
    </group>
  );
};

useTexture.preload("/textures/laminate_floor_03/laminate_floor_03_diff_1k.jpg");
useTexture.preload("/textures/laminate_floor_03/laminate_floor_03_nor_gl_1k.jpg");
useTexture.preload("/textures/laminate_floor_03/laminate_floor_03_rough_1k.jpg");
useTexture.preload("/artwork/postrom_mcp.png");
useTexture.preload("/artwork/postrom_browser_steering.png");
useTexture.preload("/textures/brick_floor_003/diff.jpg");
useTexture.preload("/textures/brick_floor_003/nor.jpg");
useTexture.preload("/textures/brick_floor_003/rough.jpg");
useTexture.preload("/artwork/sunny_courtyard.png");

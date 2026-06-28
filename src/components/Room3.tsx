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
  const mcpServersTexture = useTexture("/artwork/mcp_servers.jpg");
  const agentDataCloudTexture = useTexture("/artwork/agent_data_cloud.jpg");
  const norwegianRomanticOilTexture = useTexture("/artwork/norwegian_romantic_oil.jpg");

  useTiledTextures(floorTextures, 5, 5);
  useTiledTextures(wallTextures, 4, 4);

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
      <RigidBody type="fixed" position={[0, 12.1, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[20, 0.2, 20]} />
          <meshStandardMaterial color="#181614" roughness={1} />
        </mesh>
      </RigidBody>

      {/* Nordvegg (z = -9) — bak videre-døra (kun vestre del er synlig pga L-shape) */}
      <RigidBody type="fixed" position={[-3.5, 6.0, -9]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[11, 12, 0.4]} />
          <meshStandardMaterial {...wallTextures} color="#dcccb0" />
        </mesh>
      </RigidBody>

      {/* Sørvegg (z = +9) — bak tilbake-døra */}
      <RigidBody type="fixed" position={[0, 6.0, 9]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[18, 12, 0.4]} />
          <meshStandardMaterial {...wallTextures} color="#dcccb0" />
        </mesh>
      </RigidBody>

      {/* Vestvegg (x = -9) — stasjonsvegg (delt i solid del for stasjon 1 og vindusdel) */}
      {/* Sørlig solid del: Z fra 1.0 til 9.0 */}
      <RigidBody type="fixed" position={[-9, 6.0, 5.0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 12.0, 8.0]} />
          <meshStandardMaterial {...wallTextures} color="#d9cbb2" />
        </mesh>
      </RigidBody>

      {/* Nordlig vindusdel: Z fra -9.0 til 1.0 */}
      {/* Veggdel under vinduet */}
      <RigidBody type="fixed" position={[-9, 0.6, -4.0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 1.2, 10.0]} />
          <meshStandardMaterial {...wallTextures} color="#d9cbb2" />
        </mesh>
      </RigidBody>
      {/* Veggdel over vinduet */}
      <RigidBody type="fixed" position={[-9, 8.5, -4.0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 7.0, 10.0]} />
          <meshStandardMaterial {...wallTextures} color="#d9cbb2" />
        </mesh>
      </RigidBody>
      {/* Glass */}
      <RigidBody type="fixed" position={[-9, 3.1, -4.0]}>
        <mesh>
          <boxGeometry args={[0.1, 3.8, 10.0]} />
          <meshPhysicalMaterial color="#eaf6ff" transmission={0.9} opacity={0.6} transparent roughness={0.05} />
        </mesh>
      </RigidBody>
      {/* Vindussprosser / Poster */}
      <mesh position={[-9.0, 3.1, -7.0]}>
        <boxGeometry args={[0.12, 3.8, 0.12]} />
        <meshStandardMaterial color="#5b4a36" roughness={0.7} />
      </mesh>
      <mesh position={[-9.0, 3.1, -4.0]}>
        <boxGeometry args={[0.12, 3.8, 0.12]} />
        <meshStandardMaterial color="#5b4a36" roughness={0.7} />
      </mesh>
      <mesh position={[-9.0, 3.1, -1.0]}>
        <boxGeometry args={[0.12, 3.8, 0.12]} />
        <meshStandardMaterial color="#5b4a36" roughness={0.7} />
      </mesh>

      {/* ---------------- L-shape Inner Partition Walls ---------------- */}
      {/* Partition wall blocking northeast quadrant: Z from -9 to -2 at X = 2.0 */}
      <RigidBody type="fixed" position={[2.0, 6.0, -5.5]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 12.0, 7.0]} />
          <meshStandardMaterial {...wallTextures} color="#d9cbb2" />
        </mesh>
      </RigidBody>
      {/* Partition wall blocking northeast quadrant: X from 2 to 9 at Z = -2.0 */}
      <RigidBody type="fixed" position={[5.5, 6.0, -2.0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[7.0, 12.0, 0.4]} />
          <meshStandardMaterial {...wallTextures} color="#d9cbb2" />
        </mesh>
      </RigidBody>

      {/* ---------------- Østvegg (x = +9) med sirkulært glasskarnapp (bay window) ---------------- */}
      {/* Sørlig solid del av østvegg: Z fra 5.0 til 9.0 */}
      <RigidBody type="fixed" position={[9.0, 6.0, 7.0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 12.0, 4.0]} />
          <meshStandardMaterial {...wallTextures} color="#d9cbb2" />
        </mesh>
      </RigidBody>
      {/* Nordlig solid del av østvegg: Z fra -2.0 til 1.0 */}
      <RigidBody type="fixed" position={[9.0, 6.0, -0.5]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 12.0, 3.0]} />
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
      {/* Veggdel over vinduet: Z fra 1.0 til 5.0, hevet for høyere tak */}
      <RigidBody type="fixed" position={[9.0, 8.25, 3.0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 7.5, 4.0]} />
          <meshStandardMaterial {...wallTextures} color="#d9cbb2" />
        </mesh>
      </RigidBody>

      {/* Sidevegger over karnappvinduer (fjerner glipper mot taket) */}
      <RigidBody type="fixed" position={[9.75, 8.25, 4.5]} rotation={[0, Math.atan2(1.5, -1.0), 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.2, 7.5, 1.8]} />
          <meshStandardMaterial {...wallTextures} color="#d9cbb2" />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[9.75, 8.25, 1.5]} rotation={[0, Math.atan2(1.5, 1.0), 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.2, 7.5, 1.8]} />
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
      <RigidBody type="fixed" position={[9.75, 11.9, 3.0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[1.5, 0.2, 4.0]} />
          <meshStandardMaterial color="#181614" roughness={1} />
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
      <pointLight position={[10.8, 2.65, 3.0]} intensity={6} color="#fff1d6" distance={14} decay={2} castShadow />

      {/* East window backdrop (moved further back for better parallax and scaled up for high ceiling) */}
      <mesh position={[25.0, 6.0, 3.0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[75, 48]} />
        <meshBasicMaterial map={sunnyCourtyardTexture} toneMapped={false} />
      </mesh>

      {/* Tittel over rommet */}
      <Text
        position={[-3.5, 11.2, -8.7]}
        fontSize={0.45}
        color="#8a6a44"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#fff6e6"
      >
        POSTROMMET — DEN STREKKER SEG UT
      </Text>



      {/* ---------------- PLATFORM & STAIRS IN NW CORNER ---------------- */}
      {/* Raised Platform (Enlarged to 8x6 meters for even more space around portal) */}
      <RigidBody type="fixed" position={[-5.0, 1.0, -6.0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[8, 2.0, 6]} />
          <meshStandardMaterial color="#dcccb0" roughness={0.8} />
        </mesh>
      </RigidBody>

      {/* Railings on the platform */}
      <mesh position={[-1.0, 2.5, -6.0]}>
        <boxGeometry args={[0.08, 1.0, 6.0]} />
        <meshStandardMaterial color="#5b4a36" roughness={0.7} />
      </mesh>
      <mesh position={[-8.5, 2.5, -3.0]}>
        <boxGeometry args={[1.0, 1.0, 0.08]} />
        <meshStandardMaterial color="#5b4a36" roughness={0.7} />
      </mesh>
      <mesh position={[-3.5, 2.5, -3.0]}>
        <boxGeometry args={[5.0, 1.0, 0.08]} />
        <meshStandardMaterial color="#5b4a36" roughness={0.7} />
      </mesh>

      {/* Stairs: 10 steps climbing (visuals only, shifted to align with deeper platform) */}
      {Array.from({ length: 10 }).map((_, idx) => {
        const stepHeight = 0.2;
        const stepDepth = 0.3;
        const stepWidth = 2.0;
        const y = (idx + 0.5) * stepHeight;
        const z = -3.0 + (9 - idx) * stepDepth + stepDepth / 2;
        const x = -7.0;
        return (
          <mesh key={`step-${idx}`} position={[x, y, z]} receiveShadow castShadow>
            <boxGeometry args={[stepWidth, stepHeight, stepDepth]} />
            <meshStandardMaterial color="#7d4a36" roughness={0.8} />
          </mesh>
        );
      })}

      {/* Invisible Slanted Ramp Collider for smooth stair climbing */}
      <RigidBody type="fixed" position={[-7.0, 1.0, -1.5]} rotation={[Math.atan2(2.0, 3.0), 0, 0]}>
        <CuboidCollider args={[1.0, 0.05, 1.803]} />
      </RigidBody>

      {/* ================= STASJON 1 — MCP (z = 1.0) ================= */}
      <group position={[-5.0, 0, 1.0]}>
        {/* Payphone som blikkfang — kobling/telefon-motiv, mot vestveggen */}
        <Model id="korean_public_payphone_01" position={[-2.3, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={1.5} solid />
        {/* Sidebord med oljelampe ved siden av */}
        <Model id="side_table_01" position={[-1.0, 0, 2.4]} rotation={[0, 0, 0]} scale={1.5} solid />
        <Model id="vintage_oil_lamp" position={[-1.0, 0.8261, 2.4]} rotation={[0, 0, 0]} scale={1.5} />
        <pointLight position={[-1.0, 1.5, 2.4]} intensity={4.5} color="#ffcf99" distance={6} decay={2} castShadow />

        {/* Flytende nummer + tittel ved stien */}
        <StationLabel position={[2.5, 3.5, 0]} number="1" label="MCP" />

        <AudioZone
          position={[2.5, 1, 0]}
          size={[4.8, 4, 4]}
          audioUrl="/tts/mcp_mange_programmer.mp3"
          subtitleUrl="/tts/mcp_mange_programmer.json"
        />
      </group>

      {/* Painting 1: postrom_mcp (next to payphone) */}
      <Painting
        position={[-8.78, 2.4, 3.2]}
        rotation={[0, Math.PI / 2, 0]}
        texture={mcpTexture}
        width={1.7}
        height={1.1}
        frameWidth={1.8}
        frameHeight={1.2}
        frameColor="#2b1d0c"
        frameRoughness={0.7}
        canvasRoughness={0.2}
        canvasMetalness={0.1}
      />

      {/* ================= STASJON 2 — MCP-servere (z = -0.5) ================= */}
      <group position={[5.0, 0, -0.5]}>
        {/* Drawer cabinet vendt mot rommet */}
        <Model id="drawer_cabinet" position={[2.2, 0, 0]} rotation={[0, -Math.PI / 2, 0]} scale={1.5} solid />

        {/* Flytende nummer + tittel */}
        <StationLabel position={[-2.5, 3.5, 0]} number="2" label="MCP-servere" />

        <AudioZone
          position={[-2.5, 1, 0.5]}
          size={[4.8, 4, 3]}
          audioUrl="/tts/mcp_servere.mp3"
          subtitleUrl="/tts/mcp_servere.json"
        />
      </group>

      {/* Painting 2: mcp_servers (above Stasjon 2 drawer cabinet) */}
      <Painting
        position={[8.8, 3.2, -0.5]}
        rotation={[0, -Math.PI / 2, 0]}
        texture={mcpServersTexture}
        width={3.0}
        height={2.0}
        lamp
      />

      {/* Painting 3: postrom_browser_steering (next to Stasjon 3 table) */}
      <Painting
        position={[8.8, 3.2, 5.0]}
        rotation={[0, -Math.PI / 2, 0]}
        texture={browserTexture}
        width={3.0}
        height={2.0}
        lamp
      />

      {/* Painting 4: agent_data_cloud (on South brick wall, opposite the entrance) */}
      <Painting
        position={[0, 5.0, 8.78]}
        rotation={[0, Math.PI, 0]}
        texture={agentDataCloudTexture}
        width={12.0}
        height={8.0}
        lamp={{ intensity: 35, distance: 20 }}
      />

      {/* Spotlight shining on the giant painting on the South wall */}
      <spotLight
        position={[0, 10.0, 3.0]}
        target-position={[0, 5.0, 9.0]}
        angle={0.85}
        penumbra={0.6}
        intensity={60}
        color="#ffe3c0"
        distance={15}
        decay={1.8}
        castShadow
      />

      {/* Painting 5: norwegian_romantic_oil (on North brick wall behind Station 3) */}
      <Painting
        position={[-3.5, 5.0, -8.78]}
        rotation={[0, 0, 0]}
        texture={norwegianRomanticOilTexture}
        width={6.0}
        height={4.0}
        lamp={{ intensity: 15, distance: 10 }}
      />

      {/* ================= STASJON 3 — Claude in Chrome (z = 5.0) ================= */}
      <group position={[-5.0, 0, 5.0]}>
        {/* Rundt bord med laptop = nettleseren */}
        <Model id="round_wooden_table_01" position={[-1.0, 0, 0]} rotation={[0, 0, 0]} scale={1.5} solid />
        <Model id="classic_laptop" position={[-1.0, 1.5075, 0]} rotation={[0, Math.PI / 2, 0]} scale={1.5} />
        <Model id="desk_lamp_arm_01" position={[-1.9, 1.5075, 0.9]} rotation={[0, 0.6, 0]} scale={1.5} />
        <pointLight position={[-1.0, 2.268, 0]} intensity={4.0} color="#ffe0b0" distance={5} decay={2} castShadow />

        {/* Flytende nummer + tittel */}
        <StationLabel position={[2.5, 3.5, 0]} number="3" label="Claude in Chrome" />

        <AudioZone
          position={[2.5, 1, 0]}
          size={[4.8, 4, 4]}
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
      <ambientLight intensity={0.08} color="#ffe8cc" />
      <hemisphereLight args={["#fff1dd", "#5a4a38", 0.10]} />
      <directionalLight
        position={[15, 15, 5]}
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

      {/* Lysekroner (Chandelier) hengt fra det høye taket */}
      <Model id="Chandelier_01_1k" position={[0, 11.9, 2.5]} rotation={[0, 0, 0]} scale={2.0} />
      <pointLight position={[0, 10.8, 2.5]} intensity={16} color="#ffd9a0" distance={16} decay={2} castShadow />

      <Model id="Chandelier_01_1k" position={[-5.0, 11.9, -6.0]} rotation={[0, 0, 0]} scale={2.0} />
      <pointLight position={[-5.0, 10.8, -6.0]} intensity={16} color="#ffd9a0" distance={16} decay={2} castShadow />

      {/* ---------------- Dører ---------------- */}
      {/* VIDERE — Biblioteket (plassert på raised platform i NW-hjørnet) */}
      <Portal position={[-5.0, 2.0, -6.0]} room="room4" label="Biblioteket" color="#3aa0ff" />
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
useTexture.preload("/artwork/mcp_servers.jpg");
useTexture.preload("/textures/brick_floor_003/diff.jpg");
useTexture.preload("/textures/brick_floor_003/nor.jpg");
useTexture.preload("/textures/brick_floor_003/rough.jpg");
useTexture.preload("/artwork/sunny_courtyard.png");
useTexture.preload("/artwork/agent_data_cloud.jpg");
useTexture.preload("/artwork/norwegian_romantic_oil.jpg");

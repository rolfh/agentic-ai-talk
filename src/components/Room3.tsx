import { RigidBody } from "@react-three/rapier";
import { Text } from "@react-three/drei";
import { AudioZone } from "./AudioZone";
import { Portal } from "./Portal";

export const Room3 = () => {
  return (
    <group>
      {/* Floor */}
      <RigidBody type="fixed" position={[0, -0.1, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[36, 0.2, 36]} />
          <meshStandardMaterial color="#080d1a" roughness={0.85} metalness={0.2} />
        </mesh>
      </RigidBody>

      {/* Walls */}
      <RigidBody type="fixed" position={[0, 3, -18]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[36, 6, 0.4]} />
          <meshStandardMaterial color="#0e1324" roughness={0.7} metalness={0.4} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[0, 3, 18]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[36, 6, 0.4]} />
          <meshStandardMaterial color="#0e1324" roughness={0.7} metalness={0.4} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[-18, 3, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 6, 36]} />
          <meshStandardMaterial color="#0e1324" roughness={0.7} metalness={0.4} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[18, 3, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 6, 36]} />
          <meshStandardMaterial color="#0e1324" roughness={0.7} metalness={0.4} />
        </mesh>
      </RigidBody>

      {/* Ceiling Neon Border (Blue theme) */}
      <mesh position={[0, 5.95, -17.75]}>
        <boxGeometry args={[36, 0.08, 0.08]} />
        <meshBasicMaterial color="#3080ff" toneMapped={false} />
      </mesh>
      <mesh position={[0, 5.95, 17.75]}>
        <boxGeometry args={[36, 0.08, 0.08]} />
        <meshBasicMaterial color="#3080ff" toneMapped={false} />
      </mesh>
      <mesh position={[-17.75, 5.95, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[36, 0.08, 0.08]} />
        <meshBasicMaterial color="#3080ff" toneMapped={false} />
      </mesh>
      <mesh position={[17.75, 5.95, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[36, 0.08, 0.08]} />
        <meshBasicMaterial color="#3080ff" toneMapped={false} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 5.0, -17.5]}
        fontSize={0.5}
        color="#3080ff"
        outlineWidth={0.015}
        outlineColor="#3080ff"
        material-toneMapped={false}
      >
        TILKOBLINGER & VERKTØY
      </Text>

      {/* ----------------- SUB-STATION 1: Cabinets (Left Front) ----------------- */}
      <group position={[-7, 0, -5]}>
        {/* Filing Cabinets Left */}
        <RigidBody type="fixed" position={[0, 1.25, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.5, 2.5, 3]} />
            <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.4} />
          </mesh>
          {/* Drawer divides */}
          <mesh position={[0.76, 0.6, 0]}>
            <boxGeometry args={[0.02, 0.05, 2.8]} />
            <meshBasicMaterial color="#475569" />
          </mesh>
          <mesh position={[0.76, -0.6, 0]}>
            <boxGeometry args={[0.02, 0.05, 2.8]} />
            <meshBasicMaterial color="#475569" />
          </mesh>
        </RigidBody>
        <Text
          position={[0, 2.8, 0]}
          fontSize={0.25}
          color="#3080ff"
          material-toneMapped={false}
        >
          Hva kan en agent gjøre?
        </Text>

        <AudioZone
          position={[0, 1, 0]}
          size={[7, 4, 8]}
          audioUrl="/tts/hva_kan_agent_gjoere.mp3"
          subtitleUrl="/tts/hva_kan_agent_gjoere.json"
        />
      </group>

      {/* ----------------- SUB-STATION 2: 1000 Problems Cabinets (Left Back) ----------------- */}
      <group position={[-7, 0, 5]}>
        {/* Filing Cabinets Middle */}
        <RigidBody type="fixed" position={[0, 1.25, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.5, 2.5, 3]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} />
          </mesh>
          {/* Drawer divides */}
          <mesh position={[0.76, 0.6, 0]}>
            <boxGeometry args={[0.02, 0.05, 2.8]} />
            <meshBasicMaterial color="#334155" />
          </mesh>
          <mesh position={[0.76, -0.6, 0]}>
            <boxGeometry args={[0.02, 0.05, 2.8]} />
            <meshBasicMaterial color="#334155" />
          </mesh>
        </RigidBody>
        <Text
          position={[0, 2.8, 0]}
          fontSize={0.25}
          color="#3080ff"
          material-toneMapped={false}
        >
          1000 Problemer & Kode
        </Text>

        <AudioZone
          position={[0, 1, 0]}
          size={[7, 4, 8]}
          audioUrl="/tts/tusen_problemer.mp3"
          subtitleUrl="/tts/tusen_problemer.json"
        />
      </group>



      {/* ----------------- SUB-STATION 4: MCP Terminal (Right Front) ----------------- */}
      <group position={[7, 0, -5]}>
        {/* Console / Desk */}
        <RigidBody type="fixed" position={[0, 0.5, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.5, 1.0, 1.5]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.6} />
          </mesh>
        </RigidBody>
        {/* Screen */}
        <mesh position={[0, 1.5, 0]} rotation={[-0.2, 0, 0]} castShadow>
          <boxGeometry args={[1.8, 1.2, 0.1]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, 1.5, 0.06]} rotation={[-0.2, 0, 0]}>
          <planeGeometry args={[1.6, 1.0]} />
          <meshStandardMaterial color="#1e3a8a" emissive="#3b82f6" emissiveIntensity={0.4} roughness={0.1} />
        </mesh>
        <pointLight position={[0, 1.5, 0.4]} intensity={1.0} color="#3b82f6" distance={4} />

        <Text
          position={[0, 1.5, 0.07]}
          fontSize={0.08}
          color="#fff"
          maxWidth={1.4}
          textAlign="center"
          rotation={[-0.2, 0, 0]}
        >
          [ MODEL CONTEXT PROTOCOL ]\nBidirectional Connection\nActive MCP Server Channels
        </Text>

        <Text
          position={[0, 2.3, 0]}
          fontSize={0.25}
          color="#3080ff"
          material-toneMapped={false}
        >
          Hva er MCP?
        </Text>

        <AudioZone
          position={[0, 1, 1]}
          size={[7, 4, 7]}
          audioUrl="/tts/mcp_mange_programmer.mp3"
          subtitleUrl="/tts/mcp_mange_programmer.json"
        />
      </group>

      {/* ----------------- SUB-STATION 5: MCP Servere Grid (Right Back) ----------------- */}
      <group position={[7, 0, 5]}>
        {/* Large Grid Billboard display */}
        <RigidBody type="fixed" position={[0, 1.8, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3, 2.6, 0.3]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, -0.16]}>
            <planeGeometry args={[2.7, 2.3]} />
            <meshStandardMaterial color="#0f172a" emissive="#3b82f6" emissiveIntensity={0.3} roughness={0.1} />
          </mesh>
        </RigidBody>
        <pointLight position={[0, 1.8, -0.5]} intensity={1.2} color="#60a5fa" distance={5} />

        <Text
          position={[0, 1.8, -0.17]}
          fontSize={0.08}
          color="#93c5fd"
          maxWidth={2.5}
          textAlign="left"
          rotation={[0, Math.PI, 0]}
        >
          • Chrome & Firefox\n• Photoshop & Affinity\n• DaVinci & Premiere Pro\n• Blender 3D\n• Meta & LinkedIn Ads\n• Custom Server Integration
        </Text>

        <Text
          position={[0, 3.3, 0]}
          fontSize={0.25}
          color="#3080ff"
          material-toneMapped={false}
        >
          MCP Servere
        </Text>

        <AudioZone
          position={[0, 1, -1]}
          size={[7, 4, 7]}
          audioUrl="/tts/mcp_servere.mp3"
          subtitleUrl="/tts/mcp_servere.json"
        />
      </group>

      {/* General Lights */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[-5, 10, 5]} intensity={0.4} castShadow />

      {/* Portal to Room 4 */}
      <Portal position={[0, 0, -17.5]} room="room4" label="Til Rom 4: Mestring" color="#ffff30" />
    </group>
  );
};

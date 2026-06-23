import { RigidBody } from "@react-three/rapier";
import { Text } from "@react-three/drei";
import { AudioZone } from "./AudioZone";

export const Room2 = () => {
  return (
    <group>
      {/* Floor */}
      <RigidBody type="fixed" position={[0, -0.1, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[24, 0.2, 24]} />
          <meshStandardMaterial color="#0b0f19" roughness={0.8} metalness={0.3} />
        </mesh>
      </RigidBody>

      {/* Walls */}
      <RigidBody type="fixed" position={[0, 3, -12]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[24, 6, 0.4]} />
          <meshStandardMaterial color="#121829" roughness={0.6} metalness={0.5} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[0, 3, 12]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[24, 6, 0.4]} />
          <meshStandardMaterial color="#121829" roughness={0.6} metalness={0.5} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[-12, 3, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 6, 24]} />
          <meshStandardMaterial color="#121829" roughness={0.6} metalness={0.5} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[12, 3, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 6, 24]} />
          <meshStandardMaterial color="#121829" roughness={0.6} metalness={0.5} />
        </mesh>
      </RigidBody>

      {/* Ceiling Neon Border (Green theme) */}
      <mesh position={[0, 5.95, -11.75]}>
        <boxGeometry args={[24, 0.08, 0.08]} />
        <meshBasicMaterial color="#10ff70" toneMapped={false} />
      </mesh>
      <mesh position={[0, 5.95, 11.75]}>
        <boxGeometry args={[24, 0.08, 0.08]} />
        <meshBasicMaterial color="#10ff70" toneMapped={false} />
      </mesh>
      <mesh position={[-11.75, 5.95, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[24, 0.08, 0.08]} />
        <meshBasicMaterial color="#10ff70" toneMapped={false} />
      </mesh>
      <mesh position={[11.75, 5.95, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[24, 0.08, 0.08]} />
        <meshBasicMaterial color="#10ff70" toneMapped={false} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 5.0, -11.5]}
        fontSize={0.5}
        color="#10ff70"
        outlineWidth={0.015}
        outlineColor="#10ff70"
        material-toneMapped={false}
      >
        AGENTEN I ARBEID
      </Text>

      {/* ----------------- SUB-STATION 1: Center Giant PC ----------------- */}
      <group position={[0, 0, -4]}>
        {/* Pedestal */}
        <RigidBody type="fixed" position={[0, 0.4, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[4, 0.8, 3]} />
            <meshStandardMaterial color="#1f293d" metalness={0.8} roughness={0.2} />
          </mesh>
        </RigidBody>

        {/* Retro Computer Monitor */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[2.5, 2.0, 1.8]} />
          <meshStandardMaterial color="#2d3748" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* PC Screen */}
        <mesh position={[0, 1.8, 0.91]}>
          <planeGeometry args={[2.1, 1.6]} />
          <meshStandardMaterial color="#10ff70" emissive="#10ff70" emissiveIntensity={0.6} roughness={0.1} />
        </mesh>
        {/* Glow point light */}
        <pointLight position={[0, 1.8, 1.2]} intensity={1.5} color="#10ff70" distance={6} decay={2} />
        
        {/* Screen Text */}
        <Text
          position={[0, 1.8, 0.92]}
          fontSize={0.15}
          color="#000"
          maxWidth={1.8}
          textAlign="center"
        >
          [ AI WEB PORTAL ]\nOnline\nWaiting for Input...
        </Text>

        {/* Audio Trigger Zone: Walk in front of the PC */}
        <AudioZone
          position={[0, 1, 1.5]}
          size={[5, 3.5, 4]}
          audioUrl="/tts/dagens_bruk.mp3"
          subtitleUrl="/tts/dagens_bruk.json"
        />
      </group>

      {/* ----------------- SUB-STATION 2: Claude Cowork (Left) ----------------- */}
      <group position={[-6, 0, 2]}>
        {/* Volumetric Cloud representation */}
        <group position={[0, 3.5, 0]}>
          {/* Main sphere */}
          <mesh castShadow>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshStandardMaterial color="#f0efe6" roughness={0.9} emissive="#ff8c00" emissiveIntensity={0.2} />
          </mesh>
          {/* Supporting spheres to look like a cloud */}
          <mesh position={[0.6, -0.2, 0.2]}>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshStandardMaterial color="#f0efe6" roughness={0.9} />
          </mesh>
          <mesh position={[-0.6, -0.1, -0.2]}>
            <sphereGeometry args={[0.55, 16, 16]} />
            <meshStandardMaterial color="#f0efe6" roughness={0.9} />
          </mesh>
          
          <Text
            position={[0, 1.2, 0]}
            fontSize={0.25}
            color="#ff8c00"
            outlineWidth={0.01}
            outlineColor="#ff8c00"
            material-toneMapped={false}
          >
            Claude Cowork
          </Text>
        </group>
        
        {/* Soft amber light from the cloud */}
        <pointLight position={[0, 3, 0]} intensity={1.2} color="#ffaa44" distance={5} />

        {/* Audio Trigger Zone: Walk under the Claude Cloud */}
        <AudioZone
          position={[0, 1, 0]}
          size={[4, 3.5, 4]}
          audioUrl="/tts/claude_cowork.mp3"
          subtitleUrl="/tts/claude_cowork.json"
        />
      </group>

      {/* ----------------- SUB-STATION 3: Terminal Server (Right) ----------------- */}
      <group position={[6, 0, 2]}>
        {/* Server Rack / Vertical Screen */}
        <RigidBody type="fixed" position={[0, 1.8, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.5, 3.6, 0.8]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.9} />
          </mesh>
          {/* Glowing terminal panels */}
          <mesh position={[0, 0, 0.41]}>
            <planeGeometry args={[1.2, 3.2]} />
            <meshStandardMaterial color="#022c22" emissive="#059669" emissiveIntensity={0.5} roughness={0.1} />
          </mesh>
        </RigidBody>

        <pointLight position={[0, 1.8, 0.6]} intensity={1.0} color="#059669" distance={5} />

        {/* Terminal Header */}
        <Text
          position={[0, 3.8, 0]}
          fontSize={0.25}
          color="#059669"
          outlineWidth={0.01}
          outlineColor="#059669"
          material-toneMapped={false}
        >
          Terminal vs Desktop
        </Text>

        <Text
          position={[0, 1.8, 0.42]}
          fontSize={0.1}
          color="#10ff70"
          font="monospace"
          maxWidth={1.1}
          textAlign="left"
        >
          {"$ agy run dev\n> Installing tools...\n> Initializing sandbox...\n> Running checks...\n\n[PORT] 5173\n[STATUS] Connected"}
        </Text>

        {/* Audio Trigger Zone: Walk in front of the terminal server */}
        <AudioZone
          position={[0, 1, 1.0]}
          size={[4, 3.5, 4]}
          audioUrl="/tts/terminal_vs_desktop.mp3"
          subtitleUrl="/tts/terminal_vs_desktop.json"
        />
      </group>

      {/* General Lights */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 10, 5]} intensity={0.4} castShadow />
    </group>
  );
};

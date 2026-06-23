import { RigidBody } from "@react-three/rapier";
import { Text, useTexture, Float, RoundedBox } from "@react-three/drei";
import { AudioZone } from "./AudioZone";
import { Portal } from "./Portal";

export const Room4 = () => {
  const cardNames = ["utforsk", "definer", "planlegg", "revider", "kjør", "verifiser", "fiks"];
  
  // Load textures for the front and back of each card
  const textures = useTexture(
    cardNames.reduce((acc, name) => {
      acc[`${name}_f`] = `/cards/${name}-f.png`;
      acc[`${name}_b`] = `/cards/${name}-b.png`;
      return acc;
    }, {} as Record<string, string>)
  );

  return (
    <group>
      {/* Floor */}
      <RigidBody type="fixed" position={[0, -0.1, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[36, 0.2, 36]} />
          <meshStandardMaterial color="#140f05" roughness={0.8} metalness={0.2} />
        </mesh>
      </RigidBody>

      {/* Walls */}
      <RigidBody type="fixed" position={[0, 3, -18]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[36, 6, 0.4]} />
          <meshStandardMaterial color="#1f180d" roughness={0.7} metalness={0.4} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[0, 3, 18]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[36, 6, 0.4]} />
          <meshStandardMaterial color="#1f180d" roughness={0.7} metalness={0.4} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[-18, 3, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 6, 36]} />
          <meshStandardMaterial color="#1f180d" roughness={0.7} metalness={0.4} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[18, 3, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 6, 36]} />
          <meshStandardMaterial color="#1f180d" roughness={0.7} metalness={0.4} />
        </mesh>
      </RigidBody>

      {/* Ceiling Neon Border (Yellow theme) */}
      <mesh position={[0, 5.95, -17.75]}>
        <boxGeometry args={[36, 0.08, 0.08]} />
        <meshBasicMaterial color="#ffff30" toneMapped={false} />
      </mesh>
      <mesh position={[0, 5.95, 17.75]}>
        <boxGeometry args={[36, 0.08, 0.08]} />
        <meshBasicMaterial color="#ffff30" toneMapped={false} />
      </mesh>
      <mesh position={[-17.75, 5.95, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[36, 0.08, 0.08]} />
        <meshBasicMaterial color="#ffff30" toneMapped={false} />
      </mesh>
      <mesh position={[17.75, 5.95, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[36, 0.08, 0.08]} />
        <meshBasicMaterial color="#ffff30" toneMapped={false} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 5.0, -17.5]}
        fontSize={0.5}
        color="#ffff30"
        outlineWidth={0.015}
        outlineColor="#ffff30"
        material-toneMapped={false}
      >
        MESTRING & PROMPTING
      </Text>

      {/* ----------------- AUDIO ZONE 1: Entrance (Hvordan prompte) ----------------- */}
      <group position={[0, 0, -8]}>
        <Text
          position={[0, 3, 0]}
          fontSize={0.25}
          color="#ffff30"
          material-toneMapped={false}
        >
          Hvordan prompte en agent?
        </Text>
        <AudioZone
          position={[0, 1, 0]}
          size={[10, 4, 7]}
          audioUrl="/tts/hvordan_prompte.mp3"
          subtitleUrl="/tts/hvordan_prompte.json"
        />
      </group>

      {/* ----------------- SUB-STATION 2: The 7 Playing Cards Arc (Center-Front) ----------------- */}
      <group position={[0, 0, -2]}>
        {cardNames.map((name, idx) => {
          // Arrange in an arc
          const angle = (idx - 3) * 0.4;
          const radius = 6;
          const x = radius * Math.sin(angle);
          const z = -radius * Math.cos(angle);
          const rotY = -angle;

          const frontTex = textures[`${name}_f`];
          const backTex = textures[`${name}_b`];

          return (
            <group key={name} position={[x, 2.2, z]} rotation={[0, rotY, 0]}>
              {/* Giant Card Shape */}
              <Float floatIntensity={2} speed={1.5} rotationIntensity={0.2}>
                {/* Thin middle card body */}
                <RoundedBox args={[1.2, 1.8, 0.01]} radius={0.05} smoothness={4} castShadow receiveShadow>
                  <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.5} />
                </RoundedBox>
                {/* Front face plane displaying front image */}
                <mesh position={[0, 0, 0.006]} castShadow>
                  <planeGeometry args={[1.2, 1.8]} />
                  <meshStandardMaterial map={frontTex} transparent roughness={0.2} metalness={0.1} />
                </mesh>
                {/* Back face plane displaying back image */}
                <mesh position={[0, 0, -0.006]} rotation={[0, Math.PI, 0]} castShadow>
                  <planeGeometry args={[1.2, 1.8]} />
                  <meshStandardMaterial map={backTex} transparent roughness={0.2} metalness={0.1} />
                </mesh>
              </Float>
            </group>
          );
        })}

        {/* Audio Zone in front of the cards */}
        <AudioZone
          position={[0, 1, 0]}
          size={[12, 4, 8]}
          audioUrl="/tts/fremgangsmaate.mp3"
          subtitleUrl="/tts/fremgangsmaate.json"
        />
      </group>

      {/* ----------------- SUB-STATION 3: AGENTS.md (Left Wall) ----------------- */}
      <group position={[-8, 0, 2]}>
        <RigidBody type="fixed" position={[0, 2.0, 0]} rotation={[0, Math.PI / 2, 0]}>
          {/* Giant Document Panel */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[4, 3, 0.1]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[3.8, 2.8]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} />
          </mesh>
          <Text
            position={[0, 0.8, 0.07]}
            fontSize={0.18}
            color="#ffff30"
            fontWeight="bold"
          >
            AGENTS.md
          </Text>
          <Text
            position={[0, -0.2, 0.07]}
            fontSize={0.08}
            color="#fff"
            maxWidth={3.2}
            textAlign="left"
          >
            {"# Globale Føringer\n• Tone of voice: Profesjonell & Hjelpsom\n• Kodestil: Ren TypeScript, ingen placeholder-kode\n• Verktøybruk: Forespør samtykke før skriving av filer.\n• Organisering: Hold orden på prosjektspecs."}
          </Text>
        </RigidBody>

        <pointLight position={[-0.5, 2.0, 0]} intensity={1.0} color="#ffffaa" distance={5} />

        <AudioZone
          position={[-1, 1, 0]}
          size={[7, 4, 8]}
          audioUrl="/tts/agents_md.mp3"
          subtitleUrl="/tts/agents_md.json"
        />
      </group>

      {/* ----------------- SUB-STATION 4: Generelle Regler Console (Right Center) ----------------- */}
      <group position={[8, 0, 2]}>
        {/* Terminal/Dashboard representing rules */}
        <RigidBody type="fixed" position={[0, 1.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.0, 2.2, 0.3]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0.16]}>
            <planeGeometry args={[2.7, 1.9]} />
            <meshStandardMaterial color="#1e1b4b" emissive="#4338ca" emissiveIntensity={0.4} roughness={0.1} />
          </mesh>
        </RigidBody>
        <Text
          position={[0, 1.2, 0.18]}
          fontSize={0.08}
          color="#a5f3fc"
          maxWidth={2.5}
          textAlign="left"
          rotation={[0, -Math.PI / 2, 0]}
        >
          {"[ GENERELLE REGLER ]\n- Alltid ha en klar og tydelig plan\n- Foretrekk inline kommentarer for kompleks kode\n- Unngå placeholders i kodefiler\n- Bruk standard HTML5 tagger"}
        </Text>

        <Text
          position={[0, 2.6, 0]}
          fontSize={0.25}
          color="#ffff30"
          material-toneMapped={false}
        >
          Generelle regler
        </Text>

        <AudioZone
          position={[1, 1, 0]}
          size={[7, 4, 8]}
          audioUrl="/tts/noen_ting_gjelder_alle.mp3"
          subtitleUrl="/tts/noen_ting_gjelder_alle.json"
        />
      </group>

      {/* ----------------- SUB-STATION 5: Styre Agenter (Back Center) ----------------- */}
      <group position={[0, 0, 6]}>
        {/* Master Control Sphere */}
        <RigidBody type="fixed" position={[0, 1.5, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.6, 32, 32]} />
            <meshStandardMaterial color="#eab308" emissive="#ffff30" emissiveIntensity={0.6} roughness={0.1} />
          </mesh>
          <mesh position={[0, -1.0, 0]}>
            <cylinderGeometry args={[0.1, 0.2, 1.0, 16]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </RigidBody>
        <Text
          position={[0, 2.6, 0]}
          fontSize={0.25}
          color="#ffff30"
          material-toneMapped={false}
        >
          Globale vs Spesifikke
        </Text>

        <pointLight position={[0, 1.5, 0]} intensity={1.5} color="#ffff00" distance={6} />

        <AudioZone
          position={[0, 1, -1]}
          size={[7, 4, 7]}
          audioUrl="/tts/styre_agenter.mp3"
          subtitleUrl="/tts/styre_agenter.json"
        />
      </group>

      {/* General Lights */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 10, 5]} intensity={0.4} castShadow />

      {/* Portal to Lobby */}
      <Portal position={[0, 0, -17.5]} room="lobby" label="Tilbake til Lobby" color="#ffffff" />
    </group>
  );
};

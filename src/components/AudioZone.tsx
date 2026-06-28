/* eslint-disable react-hooks/immutability */
import { useRef, useEffect, useState, useMemo } from "react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import type { IntersectionEnterPayload, IntersectionExitPayload } from "@react-three/rapier";
import { useStore } from "../store";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const glowVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFrag = /* glsl */ `
  uniform float uTime;
  uniform float uActive;
  varying vec2 vUv;
  void main() {
    float y = vUv.y;
    float alpha = smoothstep(0.0, 0.25, y) * smoothstep(1.0, 0.45, y);
    float pulse = 0.55 + 0.45 * sin(uTime * (2.2 + uActive * 4.5) + y * 4.0);
    vec3 baseColor = mix(vec3(0.85, 0.82, 0.78), vec3(0.25, 0.65, 1.0), uActive);
    gl_FragColor = vec4(baseColor * (1.2 + uActive * 1.8), alpha * pulse * (0.08 + uActive * 0.42));
  }
`;

interface SubtitleSegment {
  start: number;
  end: number;
  text: string;
}

interface AudioZoneProps {
  position: [number, number, number];
  size: [number, number, number];
  audioUrl: string;
  subtitleUrl: string;
}

export const AudioZone = ({ position, size, audioUrl, subtitleUrl }: AudioZoneProps) => {
  const setSubtitle = useStore((state) => state.setSubtitle);
  const activeAudio = useStore((state) => state.activeAudio);
  const setActiveAudio = useStore((state) => state.setActiveAudio);

  const [subtitles, setSubtitles] = useState<SubtitleSegment[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);

  const glowUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uActive: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    glowUniforms.uTime.value = t;
    const isActive = activeAudio && activeAudio === audioRef.current;
    glowUniforms.uActive.value = THREE.MathUtils.lerp(glowUniforms.uActive.value, isActive ? 1.0 : 0.0, 0.1);
  });

  // Load subtitles JSON
  useEffect(() => {
    fetch(subtitleUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Subtitles not found at ${subtitleUrl}`);
        return res.json();
      })
      .then((data) => setSubtitles(data))
      .catch((err) => console.error("Error loading subtitles for", audioUrl, err));
  }, [subtitleUrl, audioUrl]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleEnter = () => {
    // 1. If another audio is playing, stop it
    if (activeAudio && activeAudio !== audioRef.current) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    }

    // 2. Create audio if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      
      // When audio finishes, clear subtitles
      audioRef.current.addEventListener("ended", () => {
        setSubtitle(null);
        setActiveAudio(null);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      });
    }

    // 3. Play audio from start
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(err => {
      console.warn("Audio playback was blocked or deferred by browser autoplay policies:", err);
    });
    setActiveAudio(audioRef.current);

    // 4. Start subtitle tracking timer (polls every 100ms)
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = window.setInterval(() => {
      if (!audioRef.current) return;
      const time = audioRef.current.currentTime;
      
      // Find matching segment based on current timestamp
      const segment = subtitles.find(
        (s) => time >= s.start && time <= s.end
      );
      
      if (segment) {
        setSubtitle(segment.text);
      } else {
        setSubtitle(null);
      }
    }, 100);
  };

  const handleExit = () => {
    // When player leaves the zone, pause audio and clear subtitles
    if (audioRef.current) {
      audioRef.current.pause();
      setSubtitle(null);
      if (activeAudio === audioRef.current) {
        setActiveAudio(null);
      }
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Convert size dimensions to half-extents, overriding height (Y) to 50.0 (100m total height)
  // to ensure player triggers the zone even when jumping or flying high.
  const halfExtents = [size[0] / 2, 50.0, size[2] / 2] as [number, number, number];

  return (
    <group>
      <RigidBody type="fixed">
        <CuboidCollider
          args={halfExtents}
          position={position}
          sensor
          onIntersectionEnter={(event: IntersectionEnterPayload) => {
            if (event.other.rigidBodyObject?.name === "player") {
              handleEnter();
            }
          }}
          onIntersectionExit={(event: IntersectionExitPayload) => {
            if (event.other.rigidBodyObject?.name === "player") {
              handleExit();
            }
          }}
        />
      </RigidBody>
      {/* Visual ground marker for the AudioZone bounds — simple, clean flat overlay */}
      <mesh position={[position[0], 0.02, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size[0], size[2]]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.015} depthWrite={false} />
      </mesh>
      
      {/* Glowing pulsing flame-like pillar at the center of the AudioZone */}
      <mesh position={[position[0], 0.6, position[2]]}>
        <cylinderGeometry args={[0.08, 0.25, 1.2, 16, 1, true]} />
        <shaderMaterial
          vertexShader={glowVert}
          fragmentShader={glowFrag}
          uniforms={glowUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

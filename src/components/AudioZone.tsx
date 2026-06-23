import { useRef, useEffect, useState } from "react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useStore } from "../store";

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

  // Convert size dimensions to half-extents
  const halfExtents = [size[0] / 2, size[1] / 2, size[2] / 2] as [number, number, number];

  return (
    <group>
      <RigidBody type="fixed">
        <CuboidCollider
          args={halfExtents}
          position={position}
          sensor
          onIntersectionEnter={handleEnter}
          onIntersectionExit={handleExit}
        />
      </RigidBody>
      {/* Visual ground marker for the AudioZone bounds */}
      <mesh position={[position[0], 0.05, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size[0], size[2]]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.03} depthWrite={false} />
      </mesh>
      <mesh position={[position[0], 0.06, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size[0], size[2]]} />
        <meshBasicMaterial color="#aaaaaa" transparent opacity={0.15} wireframe depthWrite={false} />
      </mesh>
    </group>
  );
};

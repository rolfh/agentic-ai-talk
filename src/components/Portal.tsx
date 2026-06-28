import { useMemo, useRef, useState, useEffect } from "react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import type { IntersectionEnterPayload } from "@react-three/rapier";
import { useStore } from "../store";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PortalProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  room: 'outside' | 'lobby' | 'room2' | 'room3' | 'room4';
  label: string;
  color: string;
}

const MODEL_URL = "/models/stone_portal.glb";

/* ---------- Shaders ---------- */

const flameVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const flameFrag = /* glsl */ `
  uniform float uTime;
  uniform vec3 uCore;
  uniform vec3 uMid;
  uniform vec3 uAccent;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main() {
    float y = vUv.y;
    float flow  = fbm(vec2(vUv.x * 5.0,        vUv.y * 3.0 - uTime * 1.4));
    float flow2 = fbm(vec2(vUv.x * 9.0 + 5.0,  vUv.y * 5.0 - uTime * 2.3));
    float flame = mix(flow, flow2, 0.5);

    float hf = smoothstep(1.0, 0.05, y);          // strong low, fade up
    float intensity = flame * hf;

    vec3 col = uMid;                                               // blue base
    col = mix(col, uAccent, smoothstep(0.30, 0.80, flame) * (1.0 - y * 0.55)); // orange licks, hotter low
    col = mix(col, uCore, smoothstep(0.74, 1.0, intensity));      // white only at hottest cores
    col = mix(col, uCore, pow(max(0.0, 1.0 - y * 2.2), 3.0) * 0.45); // soft white-hot base

    float alpha = clamp(intensity * smoothstep(1.0, 0.52, y) * 1.5, 0.0, 1.0);
    gl_FragColor = vec4(col * 0.7, alpha * 0.6);                        // Dimmed HDR boost for bloom
  }
`;

const discFrag = /* glsl */ `
  uniform float uTime;
  uniform vec3 uCore;
  uniform vec3 uMid;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5) * 2.0;            // 0 center -> 1 edge
    float glow = smoothstep(1.0, 0.0, d);
    float ring = smoothstep(0.55, 0.75, d) * smoothstep(0.95, 0.78, d);
    float pulse = 0.7 + 0.3 * sin(uTime * 2.0);
    vec3 col = mix(uCore, uMid, d) * 1.3;
    float alpha = (glow * 0.8 + ring * 0.9) * pulse;
    gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  }
`;

const CORE = new THREE.Color("#ffffff");

export const Portal = ({ position, rotation = [0, 0, 0], room, color = "#3aa0ff" }: PortalProps) => {
  const setRoom = useStore((state) => state.setRoom);
  const { scene } = useGLTF(MODEL_URL);

  const midColor = useMemo(() => new THREE.Color(color), [color]);
  const accentColor = useMemo(() => {
    // If the color is reddish, make the accent warm gold/yellow, else standard warm orange
    const temp = new THREE.Color(color);
    if (temp.r > temp.b) {
      return new THREE.Color("#ffaa00");
    } else {
      return new THREE.Color("#ff7a1a");
    }
  }, [color]);

  const lightColor1 = useMemo(() => {
    const temp = new THREE.Color(color);
    if (temp.r > temp.b) {
      return "#ff8a8a"; // warm red/pink glow
    } else {
      return "#7ec0ff"; // bright blue glow
    }
  }, [color]);

  const lightColor2 = useMemo(() => {
    const temp = new THREE.Color(color);
    if (temp.r > temp.b) {
      return "#ff4a4a"; // red base light
    } else {
      return "#ff8a3a"; // orange base light
    }
  }, [color]);

  const [active, setActive] = useState(false);
  useEffect(() => {
    // 300ms cooldown to prevent triggering the portal during transition frame
    const timer = setTimeout(() => setActive(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Clone the stone pad, scale it to a ~3 m footprint and rest it on the floor,
  // centred on x/z. The raw glb is many metres across, so we normalise by its
  // true (node-transformed) world bounding box.
  const TARGET_DIAMETER = 3.2;
  const { padMesh } = useMemo(() => {
    let targetMesh: THREE.Mesh | null = null;
    scene.traverse((c) => {
      if ((c as THREE.Mesh).isMesh && c.name === "defaultMaterial_8") {
        targetMesh = (c as THREE.Mesh).clone() as THREE.Mesh;
      }
    });

    if (!targetMesh) {
      // Fallback if name is different
      scene.traverse((c) => {
        if ((c as THREE.Mesh).isMesh && c.parent?.name === "Cylinder") {
          targetMesh = (c as THREE.Mesh).clone() as THREE.Mesh;
        }
      });
    }

    if (!targetMesh) {
      return { padMesh: null };
    }

    const mesh = targetMesh as THREE.Mesh;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Tweak PBR properties of the stone pad
    if (mesh.material) {
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((mat) => {
        if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
          const stdMat = mat as THREE.MeshStandardMaterial;
          stdMat.roughness = Math.max(stdMat.roughness ?? 0, 0.85); // Stone should be very rough
          stdMat.metalness = Math.min(stdMat.metalness ?? 0, 0.05); // Stone is non-metallic
        }
      });
    }

    mesh.geometry = mesh.geometry.clone(); // Clone to avoid modifying shared cache
    mesh.geometry.center();
    mesh.geometry.computeBoundingBox();
    const box = mesh.geometry.boundingBox!;
    const size = box.getSize(new THREE.Vector3());

    const diameter = Math.max(size.x, size.y, size.z);
    const height = Math.min(size.x, size.y, size.z);
    const s = TARGET_DIAMETER / diameter;

    mesh.scale.setScalar(s);
    mesh.rotation.set(-Math.PI / 2, 0, 0);
    // Align bottom of the pad to y=0
    mesh.position.set(0, (height * s) / 2, 0);

    const group = new THREE.Group();
    group.add(mesh);

    return { padMesh: group };
  }, [scene]);

  const flameUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uCore: { value: CORE }, uMid: { value: midColor }, uAccent: { value: accentColor } }),
    [midColor, accentColor]
  );
  const discUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uCore: { value: CORE }, uMid: { value: midColor } }),
    [midColor]
  );

  const flickerLight = useRef<THREE.PointLight>(null);
  const flameMatA = useRef<THREE.ShaderMaterial>(null);
  const flameMatB = useRef<THREE.ShaderMaterial>(null);
  const discMat = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const uTimeA = flameMatA.current?.uniforms.uTime;
    if (uTimeA) uTimeA.value = t;
    const uTimeB = flameMatB.current?.uniforms.uTime;
    if (uTimeB) uTimeB.value = t;
    const uTimeD = discMat.current?.uniforms.uTime;
    if (uTimeD) uTimeD.value = t;
    if (flickerLight.current) {
      flickerLight.current.intensity = 1.2 + Math.sin(t * 9.0) * 0.2 + Math.sin(t * 23.0) * 0.1;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Stone portal pad, scaled + rested on the floor */}
      {padMesh && <primitive object={padMesh} />}

      {/* Glowing floor disc */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 64]} />
        <shaderMaterial
          ref={discMat}
          uniforms={discUniforms}
          vertexShader={flameVert}
          fragmentShader={discFrag}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* Flame / light column rising from the pad */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.18, 0.62, 2.6, 40, 1, true]} />
        <shaderMaterial
          ref={flameMatA}
          uniforms={flameUniforms}
          vertexShader={flameVert}
          fragmentShader={flameFrag}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* Inner brighter core */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.05, 0.28, 2.0, 24, 1, true]} />
        <shaderMaterial
          ref={flameMatB}
          uniforms={flameUniforms}
          vertexShader={flameVert}
          fragmentShader={flameFrag}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* Colored light cast onto surroundings */}
      <pointLight ref={flickerLight} position={[0, 1.0, 0]} intensity={1.2} distance={9} color={lightColor1} />
      <pointLight position={[0, 0.3, 0]} intensity={0.7} distance={5} color={lightColor2} />

      {/* Walk-in sensor */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider
          args={[0.8, 1.0, 0.4]}
          position={[0, 1.0, 0]}
          sensor
          onIntersectionEnter={(event: IntersectionEnterPayload) => {
            if (active && event.other.rigidBodyObject?.name === "player") {
              setRoom(room);
            }
          }}
        />
      </RigidBody>

    </group>
  );
};

useGLTF.preload(MODEL_URL);

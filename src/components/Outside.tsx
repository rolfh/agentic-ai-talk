import { useMemo, useEffect } from "react";
import { useGLTF, Html } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

import { Portal } from "./Portal";
import { Model } from "./Model";
import { Football } from "./Football";
import { AudioZone } from "./AudioZone";

interface StationLabelProps {
  position: [number, number, number];
  number?: string | number;
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
        {number && <div style={{ fontSize: "20px", fontWeight: "bold", lineHeight: "1.1" }}>{number}</div>}
        <div style={{ fontSize: "11px", marginTop: number ? "2px" : "0px", letterSpacing: "0.03em" }}>{label}</div>
      </div>
    </Html>
  );
};

/**
 * Tree model with roughness adjustment for realistic PBR shading.
 */
const Tree = ({
  position,
  kind,
  height = 6,
}: {
  position: [number, number, number];
  kind: "furu" | "gran";
  height?: number;
}) => {
  const { scene } = useGLTF(kind === "furu" ? "/models/furu.glb" : "/models/gran.glb");

  const { object, scale, offset } = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((mat) => {
            if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
              const stdMat = mat as THREE.MeshStandardMaterial;
              stdMat.roughness = Math.max(stdMat.roughness ?? 0, 0.9); // trees are rough
              stdMat.metalness = Math.min(stdMat.metalness ?? 0, 0.05);
            }
          });
        }
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const s = height / (size.y || 1);
    const off: [number, number, number] = [
      -center.x * s,
      -box.min.y * s,
      -center.z * s,
    ];
    return { object: clone, scale: s, offset: off };
  }, [scene, height]);

  return (
    <group position={position}>
      <primitive object={object} position={offset} scale={scale} />
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.4, height / 2, 0.4]} position={[0, height / 2, 0]} />
      </RigidBody>
    </group>
  );
};

/**
 * Soccer Goal model with colliders for physics.
 */
const SoccerGoal = ({
  position,
  rotation,
  scale = 0.0045,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) => {
  const { scene } = useGLTF("/models/soccer_goal.glb");

  const { object, offset } = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((mat) => {
            if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
              const stdMat = mat as THREE.MeshStandardMaterial;
              stdMat.roughness = Math.max(stdMat.roughness ?? 0, 0.45);
              stdMat.metalness = Math.min(stdMat.metalness ?? 0, 0.1);
            }
          });
        }
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // We center the X and Z, and place the bottom of the bounding box at Y=0
    const off: [number, number, number] = [
      -center.x,
      -box.min.y,
      -center.z,
    ];
    return { object: clone, offset: off };
  }, [scene]);

  return (
    <RigidBody
      type="fixed"
      colliders="trimesh"
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <primitive object={object} position={offset} />
    </RigidBody>
  );
};

/**
 * Hip-height barrier surrounding the soccer field.
 * Designed with a premium glassmorphism pane and a dark wood top rail.
 */
const Barrier = ({
  position,
  size,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  size: [number, number, number];
  rotation?: [number, number, number];
}) => {
  const [w, h, d] = size;
  return (
    <RigidBody type="fixed" position={position} rotation={rotation} colliders={false}>
      {/* Glass Pane */}
      <mesh position={[0, h / 2 - 0.025, 0]}>
        <boxGeometry args={[w, h - 0.05, d - 0.08]} />
        <meshStandardMaterial
          color="#a0c8f0"
          transparent
          opacity={0.35}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
      {/* Top Wooden Rail */}
      <mesh position={[0, h - 0.025, 0]}>
        <boxGeometry args={[w, 0.05, d]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.8} />
      </mesh>
      {/* Physics Collider */}
      <CuboidCollider args={[w / 2, h / 2, d / 2]} position={[0, h / 2, 0]} />
    </RigidBody>
  );
};

export const Outside = () => {
  const three = useThree();
  useEffect(() => {
    (window as unknown as Record<string, unknown>).three = three;
  }, [three]);

  const { scene } = useGLTF("/models/autumn_house.glb");

  const sun: [number, number, number] = [28, 8.0, -10];

  // Adjust house materials PBR roughness/metalness and remove the built-in tree mesh
  const houseScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      // Remove tree meshes baked in the model
      if (child.name.includes("polySurface355") || child.name.includes("initialShadingGrouppolySurface116")) {
        child.visible = false;
        child.scale.set(0, 0, 0);
      }

      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat) => {
            if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
              const stdMat = mat as THREE.MeshStandardMaterial;
              stdMat.roughness = Math.max(stdMat.roughness ?? 0, 0.7);
              if (stdMat.metalness > 0.8) {
                stdMat.roughness = Math.max(stdMat.roughness, 0.45);
              } else {
                stdMat.metalness = Math.min(stdMat.metalness ?? 0, 0.1);
              }
            }
          });
        }
      }
    });
    return clone;
  }, [scene]);

  return (
    <group>
      {/* ---------- Ground ---------- */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[60, 0.5, 60]} position={[0, -0.5, 0]} />
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[120, 120]} />
          <meshStandardMaterial color="#54523b" roughness={1.0} metalness={0.0} />
        </mesh>
      </RigidBody>


      {/* ---------- House Model (Aligned and raised slightly to prevent clipping) ---------- */}
      <RigidBody type="fixed" colliders="trimesh">
        <primitive
          object={houseScene}
          position={[0.918, -0.40, 8.6]} // Raised and moved back for larger scale
          rotation={[0, -Math.PI / 2, 0]}
          scale={0.52}
        />
      </RigidBody>

      {/* ---------- 10 Footballs Scattered Outdoors ---------- */}
      <Football position={[-6.5, 0.5, 25.0]} />
      <Football position={[-4.83, 0.5, 25.0]} />
      <Football position={[-3.17, 0.5, 25.0]} />
      <Football position={[-1.5, 0.5, 25.0]} />
      <Football position={[0.17, 0.5, 25.0]} />
      <Football position={[1.83, 0.5, 25.0]} />
      <Football position={[3.5, 0.5, 25.0]} />
      <Football position={[5.17, 0.5, 25.0]} />
      <Football position={[6.83, 0.5, 25.0]} />
      <Football position={[8.5, 0.5, 25.0]} />

      {/* ---------- Trees ---------- */}
      {/* Trees along the path */}
      <Tree position={[-13, 0, 10]} kind="furu" height={5.5} />
      <Tree position={[13, 0, 9]} kind="gran" height={5.2} />
      <Tree position={[-24, 0, 6]} kind="gran" height={6.0} />
      <Tree position={[14, 0, 5]} kind="furu" height={5.6} />
      <Tree position={[-25, 0, 2]} kind="furu" height={5.0} />
      <Tree position={[15, 0, 1.5]} kind="gran" height={5.8} />

      {/* Scattered background trees */}
      <Tree position={[-12, 0, 8]} kind="gran" height={7.5} />
      <Tree position={[13, 0, 12]} kind="furu" height={7.0} />
      <Tree position={[-26, 0, -2]} kind="furu" height={8.0} />
      <Tree position={[15, 0, -4]} kind="gran" height={7.4} />
      <Tree position={[-18, 0, 14]} kind="gran" height={7.8} />
      <Tree position={[20, 0, 4]} kind="furu" height={7.6} />
      <Tree position={[-25, 0, -12]} kind="furu" height={6.8} />
      <Tree position={[10, 0, -12]} kind="gran" height={7.2} />

      {/* Forest expansion - Left Side (Positive X) */}
      <Tree position={[14, 0, 18]} kind="furu" height={6.2} />
      <Tree position={[18, 0, 16]} kind="gran" height={5.8} />
      <Tree position={[22, 0, 14]} kind="furu" height={7.1} />
      <Tree position={[12, 0, 8]} kind="gran" height={6.5} />
      <Tree position={[16, 0, 6]} kind="furu" height={6.9} />
      <Tree position={[24, 0, 4]} kind="gran" height={7.5} />
      <Tree position={[18, 0, -2]} kind="furu" height={8.2} />
      <Tree position={[22, 0, -6]} kind="gran" height={7.8} />
      <Tree position={[15, 0, -10]} kind="furu" height={7.0} />
      <Tree position={[26, 0, -14]} kind="gran" height={7.4} />
      <Tree position={[11, 0, -18]} kind="furu" height={6.5} />

      {/* Forest expansion - Right Side (Negative X) */}
      <Tree position={[-22, 0, 18]} kind="gran" height={6.4} />
      <Tree position={[-26, 0, 16]} kind="furu" height={6.0} />
      <Tree position={[-30, 0, 12]} kind="gran" height={7.2} />
      <Tree position={[-24, 0, 8]} kind="furu" height={6.8} />
      <Tree position={[-28, 0, 4]} kind="gran" height={7.0} />
      <Tree position={[-22, 0, -2]} kind="furu" height={8.0} />
      <Tree position={[-27, 0, -6]} kind="gran" height={7.5} />
      <Tree position={[-32, 0, -10]} kind="furu" height={6.6} />
      <Tree position={[-25, 0, -16]} kind="gran" height={7.2} />

      {/* Forest expansion - Far Back (Behind the house) */}
      <Tree position={[-18, 0, -22]} kind="furu" height={8.5} />
      <Tree position={[-10, 0, -24]} kind="gran" height={7.9} />
      <Tree position={[0, 0, -26]} kind="furu" height={8.2} />
      <Tree position={[10, 0, -23]} kind="gran" height={7.6} />
      <Tree position={[18, 0, -21]} kind="furu" height={8.0} />
      <Tree position={[-5, 0, -28]} kind="gran" height={8.3} />
      <Tree position={[5, 0, -27]} kind="furu" height={8.1} />

      {/* ---------- Porch Details ---------- */}
      <Model id="potted_plant_01" position={[-2.5, 1.32, 6.4]} scale={1} />
      <Model id="potted_plant_01" position={[2.5, 1.32, 6.4]} scale={1} />

      {/* ---------- Door leading into lobby ---------- */}
      <Portal position={[0, 1.32, 6.05]} rotation={[0, 0, 0]} room="lobby" label="Inn i stua" color="#3aa0ff" />

      {/* ---------- Soccer Goals ---------- */}
      <SoccerGoal position={[-10.8, 0.0, 25.0]} rotation={[0, 0, 0]} scale={0.0045} />
      <SoccerGoal position={[12.4, 0.0, 25.0]} rotation={[0, Math.PI, 0]} scale={0.0045} />

      {/* ---------- Soccer Field Barriers (Hip-Height Walls) ---------- */}
      {/* South Wall */}
      <Barrier position={[0.8, 0.0, 30.0]} size={[24.0, 1.0, 0.2]} />
      {/* West Wall */}
      <Barrier position={[-11.2, 0.0, 25.0]} size={[10.0, 1.0, 0.2]} rotation={[0, Math.PI / 2, 0]} />
      {/* East Wall */}
      <Barrier position={[12.8, 0.0, 25.0]} size={[10.0, 1.0, 0.2]} rotation={[0, Math.PI / 2, 0]} />
      {/* North Wall - Split with 3m entrance gate in the middle */}
      <Barrier position={[-5.95, 0.0, 20.0]} size={[10.5, 1.0, 0.2]} />
      <Barrier position={[7.55, 0.0, 20.0]} size={[10.5, 1.0, 0.2]} />

      {/* ---------- Station 1: Velkommen (utendørs fotballbane) ---------- */}
      <AudioZone
        position={[0.8, 1.0, 25.0]}
        size={[24, 4, 10]}
        audioUrl="/tts/stua_intro.mp3"
        subtitleUrl="/tts/stua_intro.json"
      />
      {/* Station 1 billboarded text */}
      <StationLabel position={[0.8, 3.5, 25.0]} label="Velkommen" />

      {/* ---------- Lights ---------- */}
      <ambientLight intensity={0.02} color="#1a1c2e" />
      <hemisphereLight args={["#4c5870", "#1f2214", 0.1]} />
      <directionalLight
        position={sun}
        target-position={[0, 0, 6]}
        intensity={2.8}
        color="#ff8d4f"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0005}
      />
    </group>
  );
};

useGLTF.preload("/models/autumn_house.glb");
useGLTF.preload("/models/furu.glb");
useGLTF.preload("/models/gran.glb");
useGLTF.preload("/models/fifa_trionda_ball_world_cup_2026.glb");
useGLTF.preload("/models/soccer_goal.glb");

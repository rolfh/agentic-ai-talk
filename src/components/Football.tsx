import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

export const Football = ({ position }: { position: [number, number, number] }) => {
  const { scene } = useGLTF("/models/fifa_trionda_ball_world_cup_2026.glb");

  const { object, scale } = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = Math.max(mat.roughness || 0, 0.45);
          mat.metalness = Math.min(mat.metalness || 0, 0.1);
        }
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    
    // Target ball diameter of 0.45m
    const targetDiameter = 0.45;
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = targetDiameter / maxDim;

    return { object: clone, scale: s };
  }, [scene]);

  return (
    <RigidBody
      type="dynamic"
      colliders="ball"
      position={position}
      restitution={0.8}
      friction={0.4}
      linearDamping={0.6}
      angularDamping={0.6}
      mass={0.25}
    >
      <primitive object={object} scale={scale} />
    </RigidBody>
  );
};

useGLTF.preload("/models/fifa_trionda_ball_world_cup_2026.glb");

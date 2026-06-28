import { useLayoutEffect } from "react";
import * as THREE from "three";

export type TextureMap = Record<string, THREE.Texture> | THREE.Texture[] | THREE.Texture;

export function useTiledTextures(
  textures: TextureMap,
  repeatX: number,
  repeatY: number
) {
  useLayoutEffect(() => {
    const list = Array.isArray(textures)
      ? textures
      : textures instanceof THREE.Texture
      ? [textures]
      : Object.values(textures);

    list.forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(repeatX, repeatY);
    });
  }, [textures, repeatX, repeatY]);
}

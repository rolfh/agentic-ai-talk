import * as THREE from 'three'

// Intercept all Three.js loaders to prepend BASE_URL dynamically for GitHub Pages compatibility.
// This MUST be run before we import App, because components inside App call useGLTF.preload/useTexture.preload
// immediately at the module level when imported.
THREE.DefaultLoadingManager.setURLModifier((url) => {
  if (url.startsWith('/') && !url.startsWith('//') && !url.startsWith('data:')) {
    const base = import.meta.env.BASE_URL || '/';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
    return `${cleanBase}${cleanUrl}`;
  }
  return url;
});

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

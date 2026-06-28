import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as THREE from 'three'
import './index.css'
import App from './App.tsx'

// Intercept all Three.js loaders to prepend BASE_URL dynamically for GitHub Pages compatibility
THREE.DefaultLoadingManager.setURLModifier((url) => {
  if (url.startsWith('/') && !url.startsWith('//') && !url.startsWith('data:')) {
    const base = import.meta.env.BASE_URL || '/';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
    return `${cleanBase}${cleanUrl}`;
  }
  return url;
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

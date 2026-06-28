import * as THREE from 'three'

// Intercept all Three.js loaders to prepend BASE_URL dynamically for GitHub Pages compatibility.
// This MUST be run before we import App, because components inside App call useGLTF.preload/useTexture.preload
// immediately at the module level when imported.
THREE.DefaultLoadingManager.setURLModifier((url) => {
  try {
    const parsed = new URL(url, window.location.href);
    if (parsed.origin === window.location.origin) {
      const base = import.meta.env.BASE_URL || '/';
      if (base !== '/') {
        const cleanBase = base.endsWith('/') ? base : `${base}/`;
        const cleanBasePathname = new URL(cleanBase, window.location.origin).pathname;
        if (!parsed.pathname.startsWith(cleanBasePathname)) {
          const relativePath = parsed.pathname.startsWith('/') ? parsed.pathname.slice(1) : parsed.pathname;
          parsed.pathname = cleanBasePathname + relativePath;
          const resolved = parsed.toString();
          console.log("[URL Modifier] Intercepted & Resolved:", url, "->", resolved);
          return resolved;
        }
      }
    }
  } catch (err) {
    console.error("[URL Modifier] Error parsing URL:", url, err);
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

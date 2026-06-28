import * as THREE from 'three'

// Intercept all Three.js loaders to prepend BASE_URL dynamically for GitHub Pages compatibility.
// This MUST be run before we import App, because components inside App call useGLTF.preload/useTexture.preload
// immediately at the module level when imported.
THREE.DefaultLoadingManager.setURLModifier((url) => {
  try {
    // Three.js often resolves URLs to absolute paths (e.g. https://... or http://...)
    // before they reach the DefaultLoadingManager. We parse the URL to handle both cases.
    const parsed = new URL(url, window.location.href);
    if (parsed.origin === window.location.origin) {
      const base = import.meta.env.BASE_URL || '/';
      if (base !== '/') {
        const cleanBase = base.endsWith('/') ? base : `${base}/`;
        const cleanBasePathname = new URL(cleanBase, window.location.origin).pathname;
        if (!parsed.pathname.startsWith(cleanBasePathname)) {
          const relativePath = parsed.pathname.startsWith('/') ? parsed.pathname.slice(1) : parsed.pathname;
          parsed.pathname = cleanBasePathname + relativePath;
          return parsed.toString();
        }
      }
    }
  } catch {
    // Fall back to original url if parsing fails (e.g. data URIs)
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

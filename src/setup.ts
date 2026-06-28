import * as THREE from 'three'

// Intercept all Three.js loaders to prepend BASE_URL dynamically for GitHub Pages compatibility.
// This is executed as the very first module import in the application to ensure it runs before
// any components call .preload() at the module level.
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
  } catch {
    // Fall back to original url if parsing fails (e.g. data URIs)
  }
  return url;
});

// Laster ned CC0-teksturer fra Poly Haven (Diffuse, nor_gl, Rough) i 1k oppløsning
// og lagrer dem til public/textures/<id>/ som diff.jpg, nor.jpg og rough.jpg.
//
// Bruk:
//   node download-textures.js wood_planks_grey
//   node download-textures.js plaster_grey --res=2k
//

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "public/textures");

const args = process.argv.slice(2);
const opts = Object.fromEntries(
  args.filter((a) => a.startsWith("--") && a.includes("=")).map((a) => a.slice(2).split("="))
);
const res = opts.res || "1k";
const ids = args.filter((a) => !a.startsWith("--"));

async function getJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
}

async function download(url, dest) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  const buf = Buffer.from(await r.arrayBuffer());
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function fetchTexture(id) {
  console.log(`Leter etter tekstur: ${id} ...`);
  const files = await getJSON(`https://api.polyhaven.com/files/${id}`);
  
  const destDir = path.join(OUT_DIR, id);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  const downloads = [];

  // Diffuse map
  const diffInfo = files.Diffuse?.[res]?.jpg || files.Diffuse?.["1k"]?.jpg;
  if (diffInfo?.url) {
    downloads.push({ url: diffInfo.url, dest: path.join(destDir, "diff.jpg"), label: "Diffuse" });
  }

  // Normal map (OpenGL format standard in three.js)
  const norInfo = files.nor_gl?.[res]?.jpg || files.nor_gl?.["1k"]?.jpg;
  if (norInfo?.url) {
    downloads.push({ url: norInfo.url, dest: path.join(destDir, "nor.jpg"), label: "Normal (GL)" });
  }

  // Roughness map
  const roughInfo = files.Rough?.[res]?.jpg || files.Rough?.["1k"]?.jpg;
  if (roughInfo?.url) {
    downloads.push({ url: roughInfo.url, dest: path.join(destDir, "rough.jpg"), label: "Roughness" });
  }

  if (downloads.length === 0) {
    throw new Error(`Ingen standard jpg-filer funnet for teksturen ${id}`);
  }

  let totalBytes = 0;
  for (const dl of downloads) {
    console.log(`  Laster ned ${dl.label}...`);
    totalBytes += await download(dl.url, dl.dest);
  }

  const kb = (totalBytes / 1024).toFixed(0);
  console.log(`✓ Tekstur ${id} ferdig nedlastet (${kb} KB)  →  /textures/${id}/`);
}

async function main() {
  if (!ids.length) {
    console.log("Oppgi tekstur-id, f.eks: node download-textures.js plaster_grey");
    return;
  }
  for (const id of ids) {
    try {
      await fetchTexture(id);
    } catch (e) {
      console.error(`✗ ${id}: ${e.message}`);
    }
  }
}

main();

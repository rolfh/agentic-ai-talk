// Laster ned realistiske CC0-modeller fra Poly Haven (gltf + .bin + PBR-teksturer)
// til public/models/realistic/<id>/. Alt er CC0 (fri bruk).
//
// Bruk:
//   node download-models.js Sofa_01 ArmChair_01 CoffeeTable_01
//   node download-models.js Sofa_01 --res=2k        # teksturoppløsning (default 2k)
//   node download-models.js --list desk             # søk i katalogen etter "desk"
//
// I R3F: useGLTF("/models/realistic/<id>/<fil>.gltf"). Stien til .gltf-fila skrives ut.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "public/models/realistic");

const args = process.argv.slice(2);
const opts = Object.fromEntries(
  args.filter((a) => a.startsWith("--") && a.includes("=")).map((a) => a.slice(2).split("="))
);
const res = opts.res || "2k";
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

async function listSearch(term) {
  const all = await getJSON("https://api.polyhaven.com/assets?type=models");
  const hits = Object.keys(all).filter((k) => k.toLowerCase().includes(term.toLowerCase()));
  console.log(`${hits.length} treff på "${term}":`);
  console.log(hits.slice(0, 60).join(", "));
}

async function fetchModel(id) {
  const files = await getJSON(`https://api.polyhaven.com/files/${id}`);
  const set = files.gltf?.[res] || files.gltf?.["2k"] || files.gltf?.["1k"];
  if (!set) throw new Error(`ingen gltf for ${id}`);
  // Strukturen er files.gltf[res].<navn> = { url, include } — ta første oppføring
  const gltfSet = Object.values(set)[0];
  if (!gltfSet?.url) throw new Error(`fant ikke gltf-url for ${id}`);
  const dir = path.join(OUT, id);

  // hovedfil (.gltf)
  const gltfName = gltfSet.url.split("/").pop();
  let total = await download(gltfSet.url, path.join(dir, gltfName));

  // .bin + teksturer (relative stier = include-nøklene)
  for (const [rel, info] of Object.entries(gltfSet.include || {})) {
    total += await download(info.url, path.join(dir, rel));
  }
  const kb = (total / 1024).toFixed(0);
  console.log(`✓ ${id}  (${kb} KB)  →  /models/realistic/${id}/${gltfName}`);
}

async function main() {
  if (opts.list !== undefined || args[0] === "--list") {
    await listSearch(opts.list || ids[0] || "");
    return;
  }
  if (!ids.length) {
    console.log("Oppgi modell-ID-er, f.eks: node download-models.js Sofa_01 ArmChair_01");
    return;
  }
  console.log(`Oppløsning: ${res}\n`);
  for (const id of ids) {
    try {
      await fetchModel(id);
    } catch (e) {
      console.error(`✗ ${id}: ${e.message}`);
    }
  }
}

main();

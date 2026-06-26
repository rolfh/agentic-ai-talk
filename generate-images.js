// Genererer bilder for rommene i image-content.js via Gemini Image Generation (Nano Banana).
// Pipeline: Gemini (Base64) -> public/artwork/<name>.png
//
// Bruk:
//   node generate-images.js                  # generer alle som mangler
//   node generate-images.js stua_welkommen   # generer kun navngitte bilder (overskriver)
//   node generate-images.js --force          # regenerer alt, også eksisterende
//   node generate-images.js --list           # bare list bilder og status
//

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { images } from "./image-content.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- Konfig ----
const DEFAULT_MODEL = "gemini-2.5-flash-image";
const OUT_DIR = path.resolve(__dirname, "public/artwork");

// ---- .env-lasting ----
function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, ".env");
    if (!fs.existsSync(envPath)) return;
    fs.readFileSync(envPath, "utf8")
      .split(/\r?\n/)
      .forEach((line) => {
        if (line.trim().startsWith("#") || !line.includes("=")) return;
        const [key, ...rest] = line.split("=");
        const value = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
        process.env[key.trim()] = value;
      });
  } catch (err) {
    console.warn("Kunne ikke lese .env:", err.message);
  }
}
loadEnv();

const apiKey = process.env["GPC-API-KEY"];
if (!apiKey) {
  console.error("Feil: GPC-API-KEY mangler i miljøet eller .env.");
  process.exit(1);
}

// ---- Argumenter ----
const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const opts = Object.fromEntries(
  args
    .filter((a) => a.startsWith("--") && a.includes("="))
    .map((a) => a.slice(2).split("="))
);
const targets = args.filter((a) => !a.startsWith("--"));

const MODEL = opts.model || DEFAULT_MODEL;
const FORCE = flags.has("--force");

// ---- Gemini Image-kall (generateContent med responseModalities: ["IMAGE"]) ----
async function generateImage(promptText) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: promptText
          }
        ]
      }
    ],
    generationConfig: {
      responseModalities: ["IMAGE"]
    }
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`API ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const candidates = data?.candidates || [];
  let base64Data = null;

  for (const candidate of candidates) {
    const parts = candidate?.content?.parts || [];
    for (const part of parts) {
      if (part?.inlineData?.data) {
        base64Data = part.inlineData.data;
        break;
      }
    }
    if (base64Data) break;
  }

  if (!base64Data) {
    throw new Error("Ingen bildedata i svaret: " + JSON.stringify(data).slice(0, 400));
  }

  return Buffer.from(base64Data, "base64");
}

// ---- Hovedløkke ----
async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  let queue = images;
  if (targets.length) {
    queue = images.filter((img) => targets.includes(img.name));
    const unknown = targets.filter((t) => !images.some((img) => img.name === t));
    if (unknown.length) console.warn("Ukjente bilder ignorert:", unknown.join(", "));
  }

  if (flags.has("--list")) {
    for (const img of images) {
      const pngPath = path.join(OUT_DIR, `${img.name}.png`);
      const exists = fs.existsSync(pngPath);
      console.log(`${exists ? "✓" : "·"} ${img.name}  (Rom: ${img.room})`);
    }
    return;
  }

  console.log(`Modell: ${MODEL}\n`);
  let done = 0;
  let skipped = 0;

  for (const img of queue) {
    const pngPath = path.join(OUT_DIR, `${img.name}.png`);
    const explicit = targets.includes(img.name);

    if (fs.existsSync(pngPath) && !FORCE && !explicit) {
      console.log(`· hopper over ${img.name} (finnes – bruk --force)`);
      skipped++;
      continue;
    }

    process.stdout.write(`→ ${img.name} ... `);
    try {
      const imgBuffer = await generateImage(img.prompt);
      fs.writeFileSync(pngPath, imgBuffer);
      console.log("ok");
      done++;
    } catch (err) {
      console.log("FEIL");
      console.error(`  ${err.message}`);
    }
  }

  console.log(`\nFerdig: ${done} generert, ${skipped} hoppet over.`);
}

main();

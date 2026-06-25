// Genererer TTS-lyd for klippene i tts-content.js via Gemini TTS.
// Pipeline: Gemini (PCM/base64) -> WAV -> mp3 (ffmpeg) -> public/tts/<name>.mp3
//
// Bruk:
//   node generate-tts.js                  # generer alle som mangler mp3
//   node generate-tts.js kjernekraft      # generer kun navngitte klipp (overskriver)
//   node generate-tts.js --force          # regenerer alt, også eksisterende
//   node generate-tts.js --voice=Charon   # overstyr stemme
//   node generate-tts.js --model=gemini-2.5-pro-preview-tts
//   node generate-tts.js --list           # bare list klippene og status
//
// Etter generering: kjør `python3 transcribe.py` for å lage undertekst-JSON.
// Stale .json slettes automatisk når et klipp regenereres.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execFileSync } from "child_process";
import { clips } from "./tts-content.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- Konfig ----
const DEFAULT_MODEL = "gemini-3.1-flash-tts-preview";
const DEFAULT_VOICE = "Fenrir";
const STYLE_INSTRUCTION =
  "Snakk med trøndersk dialekt, fortellende og tydelig, som en engasjert foredragsholder:";
const OUT_DIR = path.resolve(__dirname, "public/tts");

// ---- .env-lasting (samme mønster som trygemini.js) ----
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
const VOICE = opts.voice || DEFAULT_VOICE;
const FORCE = flags.has("--force");

// ---- Gemini TTS-kall ----
async function synthesize(text, voice) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  const prompt = STYLE_INSTRUCTION ? `${STYLE_INSTRUCTION}\n${text}` : text;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } },
      },
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-goog-api-key": apiKey },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`API ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const part = data?.candidates?.[0]?.content?.parts?.[0];
  const inline = part?.inlineData;
  if (!inline?.data) {
    throw new Error("Ingen lyd i svaret: " + JSON.stringify(data).slice(0, 400));
  }
  const rate = parseInt(/rate=(\d+)/.exec(inline.mimeType || "")?.[1] || "24000", 10);
  return { pcm: Buffer.from(inline.data, "base64"), rate };
}

// ---- PCM (16-bit mono) -> WAV ----
function pcmToWav(pcm, sampleRate) {
  const channels = 1;
  const bitsPerSample = 16;
  const blockAlign = (channels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

// ---- Hovedløkke ----
async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  let queue = clips;
  if (targets.length) {
    queue = clips.filter((c) => targets.includes(c.name));
    const unknown = targets.filter((t) => !clips.some((c) => c.name === t));
    if (unknown.length) console.warn("Ukjente klipp ignorert:", unknown.join(", "));
  }

  if (flags.has("--list")) {
    for (const c of clips) {
      const exists = fs.existsSync(path.join(OUT_DIR, `${c.name}.mp3`));
      console.log(`${exists ? "✓" : "·"} ${c.name}  (${c.text.length} tegn)`);
    }
    return;
  }

  console.log(`Modell: ${MODEL} · Stemme: ${VOICE}\n`);
  let done = 0;
  let skipped = 0;

  for (const clip of queue) {
    const mp3Path = path.join(OUT_DIR, `${clip.name}.mp3`);
    const explicit = targets.includes(clip.name);

    if (fs.existsSync(mp3Path) && !FORCE && !explicit) {
      console.log(`· hopper over ${clip.name} (finnes – bruk --force)`);
      skipped++;
      continue;
    }

    process.stdout.write(`→ ${clip.name} ... `);
    try {
      const { pcm, rate } = await synthesize(clip.text, clip.voice || VOICE);
      const wavPath = path.join(OUT_DIR, `${clip.name}.wav`);
      fs.writeFileSync(wavPath, pcmToWav(pcm, rate));

      execFileSync(
        "ffmpeg",
        ["-y", "-loglevel", "error", "-i", wavPath, "-codec:a", "libmp3lame", "-qscale:a", "2", mp3Path],
        { stdio: "inherit" }
      );
      fs.unlinkSync(wavPath);

      // Stale undertekster slettes så transcribe.py lager nye
      const jsonPath = path.join(OUT_DIR, `${clip.name}.json`);
      if (fs.existsSync(jsonPath)) fs.unlinkSync(jsonPath);

      console.log("ok");
      done++;
    } catch (err) {
      console.log("FEIL");
      console.error(`  ${err.message}`);
    }
  }

  console.log(`\nFerdig: ${done} generert, ${skipped} hoppet over.`);
  if (done) console.log("Kjør så:  python3 transcribe.py   (lager undertekst-JSON)");
}

main();

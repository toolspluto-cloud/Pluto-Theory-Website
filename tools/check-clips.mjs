// Decodes every voice clip in headless Chrome and reports length, silence at the start/end, loudness,
// and speaking speed, to find clips that are cut off, padded with silence, garbled or too quiet.
//   node check-clips.mjs http://localhost:8090
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const base = process.argv[2] || "http://localhost:8090";
const site = fileURLToPath(new URL("..", import.meta.url)); // the website folder, one up from tools/
const lineId = (who, text) => {
  let h = 0x811c9dc5;
  for (const c of `${who}|${text}`) { h ^= c.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, "0");
};
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(`${site}/conversation.js`, "utf8"), ctx);
const lines = new Map();
for (const [scene, s] of Object.entries(ctx.window.PT_SCENES))
  for (const l of s.lines) if (/[a-z]/i.test(l.t)) lines.set(lineId(l.s, l.t), { scene, who: l.s, text: l.t });

const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage();
await page.goto(`${base}/work.html`);
const stats = await page.evaluate(async (ids) => {
  const ac = new OfflineAudioContext(1, 24000, 24000);
  const out = {};
  for (const id of ids) {
    try {
      const buf = await ac.decodeAudioData(await (await fetch(`voices/${id}.mp3`)).arrayBuffer());
      const d = buf.getChannelData(0), sr = buf.sampleRate, win = Math.round(sr * 0.01);
      const rms = [];
      for (let i = 0; i < d.length; i += win) { let s = 0; for (let j = i; j < Math.min(d.length, i + win); j++) s += d[j] * d[j]; rms.push(Math.sqrt(s / win)); }
      const loud = rms.map((v) => v > 0.01);
      const first = loud.indexOf(true), last = loud.lastIndexOf(true);
      let peak = 0; for (const v of d) peak = Math.max(peak, Math.abs(v));
      // longest gap of silence inside the speech
      let gap = 0, run = 0; for (let k = first; k <= last; k++) { if (!loud[k]) { run++; gap = Math.max(gap, run); } else run = 0; }
      out[id] = { dur: +buf.duration.toFixed(2), lead: +(first * 0.01).toFixed(2), tail: +((rms.length - 1 - last) * 0.01).toFixed(2), peak: +peak.toFixed(2), gap: +(gap * 0.01).toFixed(2), clipped: peak >= 0.999 };
    } catch (e) { out[id] = { error: String(e) }; }
  }
  return out;
}, [...lines.keys()]);
await browser.close();

const rows = [...lines].map(([id, l]) => ({ id, ...l, ...stats[id], cps: stats[id].dur ? +(l.text.length / stats[id].dur).toFixed(1) : null }));
fs.writeFileSync("clips.json", JSON.stringify(rows, null, 1));
const n = rows.length, avg = (k) => (rows.reduce((s, r) => s + (r[k] || 0), 0) / n).toFixed(2);
console.log(`clips ${n}, avg length ${avg("dur")}s, avg lead silence ${avg("lead")}s, avg tail ${avg("tail")}s, avg peak ${avg("peak")}, avg chars/sec ${avg("cps")}`);
const show = (label, f) => { const bad = rows.filter(f); console.log(`\n${label}: ${bad.length}`); bad.slice(0, 12).forEach((r) => console.log(`  ${r.id} ${r.who} dur=${r.dur} lead=${r.lead} gap=${r.gap} peak=${r.peak} cps=${r.cps} | ${r.text.slice(0, 70)}`)); };
show("errors", (r) => r.error);
show("long silence at start (>0.25s)", (r) => r.lead > 0.25);
show("long pause inside speech (>0.9s)", (r) => r.gap > 0.9);
show("too quiet (peak < 0.25)", (r) => r.peak < 0.25);
show("distorted (clipping)", (r) => r.clipped);
show("too fast, maybe cut off (>22 chars/s)", (r) => r.cps > 22);
show("too slow, maybe garbled (<8 chars/s, 15+ chars)", (r) => r.cps < 8 && r.text.length >= 15);

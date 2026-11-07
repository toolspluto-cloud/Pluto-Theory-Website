// Plays the chat like a real visitor (normal motion, cold cache, optional slow phone) and logs, for every line:
// how long after its bubble the voice starts, and the silence since the previous voice ended.
//   node check-voice-flow.mjs <url> [fast|3g] [cpu-slowdown]
import puppeteer from "puppeteer-core";

const base = process.argv[2] || "http://localhost:8090";
const net = process.argv[3] || "fast", cpu = Number(process.argv[4] || 1);
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1366, height: 900 });
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
const cdp = await page.createCDPSession();
await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
if (net === "3g") await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 300, downloadThroughput: 750 * 1024 / 8, uploadThroughput: 250 * 1024 / 8 });
if (cpu > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
await page.evaluateOnNewDocument(() => {
  window.__ev = [];
  const T = () => Math.round(performance.now());
  const os = AudioBufferSourceNode.prototype.start;
  AudioBufferSourceNode.prototype.start = function (...a) { window.__ev.push({ t: T(), voice: true, dur: Math.round(this.buffer.duration * 1000) }); return os.apply(this, a); };
  const oa = Element.prototype.appendChild;
  Element.prototype.appendChild = function (n) {
    if (n.classList?.contains("stage-msg") && !n.classList.contains("is-typing") && !n.classList.contains("is-you")) window.__ev.push({ t: T(), bubble: n.textContent.replace(/^(Pluto|Theory): (Pluto|Theory)/, "").slice(0, 46) });
    return oa.call(this, n);
  };
});
await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
await page.mouse.click(5, 5); // a real click, like a visitor, so sound is allowed
await page.evaluate(() => document.querySelector(".stage").scrollIntoView({ block: "center" }));
await page.waitForSelector(".stage-replies .reply", { timeout: 120000 });
await page.evaluate(() => document.querySelector(".stage-replies .reply").click());
await new Promise((r) => setTimeout(r, 800));
await page.waitForSelector(".stage-replies .reply:not([aria-disabled])", { timeout: 120000 });
await new Promise((r) => setTimeout(r, 300));
const ev = await page.evaluate(() => window.__ev);
await browser.close();

let bubble = null, prevEnd = null, missing = 0;
const delays = [], gaps = [];
for (const e of ev) {
  if (e.bubble) { if (bubble && !bubble.voiced) { missing++; console.log(`   NO VOICE        | ${bubble.bubble}`); } bubble = e; continue; }
  const d = e.t - bubble.t, g = prevEnd ? e.t - prevEnd : null;
  bubble.voiced = true; delays.push(d); if (g !== null) gaps.push(g);
  console.log(`${String(d).padStart(5)}ms after text  ${String(g ?? "-").padStart(5)}ms quiet before | ${bubble.bubble}`);
  prevEnd = e.t + e.dur;
}
if (bubble && !bubble.voiced) { missing++; console.log(`   NO VOICE        | ${bubble.bubble}`); }
const avg = (a) => Math.round(a.reduce((s, v) => s + v, 0) / (a.length || 1));
console.log(`\n${net} cpu x${cpu}: lines ${delays.length + missing}, voiced ${delays.length}, silent ${missing}, voice starts avg ${avg(delays)}ms / max ${Math.max(...delays)}ms after text, quiet between lines avg ${avg(gaps)}ms / max ${Math.max(...gaps)}ms`);

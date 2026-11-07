// Plays the chat on a site with a cold cache and times each line: when its bubble appears, when the
// voice actually starts, whether the voice played at all, and gaps between lines.
//   node check-voice-timing.mjs https://plutotheory.com [cpu-slowdown] [network: fast|3g]
import puppeteer from "puppeteer-core";

const base = process.argv[2] || "http://localhost:8090";
const slow = Number(process.argv[3] || 1);
const net = process.argv[4] || "fast";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1366, height: 900 });
const cdp = await page.createCDPSession();
await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
if (net === "3g") await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 300, downloadThroughput: 750 * 1024 / 8, uploadThroughput: 250 * 1024 / 8 });
if (slow > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: slow });

await page.evaluateOnNewDocument(() => {
  window.__t0 = performance.now();
  window.__log = [];
  const op = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    const rec = { src: this.src.split("/").pop(), call: performance.now() };
    window.__log.push(rec);
    this.addEventListener("playing", () => (rec.playing = performance.now()), { once: true });
    this.addEventListener("ended", () => (rec.ended = performance.now()), { once: true });
    this.addEventListener("error", () => (rec.error = true), { once: true });
    return op.call(this).catch((e) => { rec.rejected = e.name; throw e; });
  };
  addEventListener("DOMContentLoaded", () => new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => {
    if (n.classList?.contains("stage-msg") && !n.classList.contains("is-typing") && !n.classList.contains("is-you"))
      window.__log.push({ bubble: n.textContent.slice(0, 50), at: performance.now() });
  }))).observe(document.body, { childList: true, subtree: true }));
});
await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
await page.mouse.click(5, 5); // a real click so the browser allows sound
await page.evaluate(() => document.querySelector(".stage").scrollIntoView({ block: "center" }));
await page.waitForSelector(".stage-replies .reply", { timeout: 90000 });
await page.evaluate(() => document.querySelector(".stage-replies .reply").click());
await new Promise((r) => setTimeout(r, 1500));
await page.waitForSelector(".stage-replies .reply", { timeout: 90000 });
const log = await page.evaluate(() => window.__log);
await browser.close();

let lastBubble = null, prevEnd = null;
const rows = [];
for (const e of log) {
  if (e.bubble) { lastBubble = e; continue; }
  const delay = e.playing && lastBubble ? Math.round(e.playing - lastBubble.at) : null;
  const gap = prevEnd && e.playing ? Math.round(e.playing - prevEnd) : null;
  rows.push({ line: lastBubble?.bubble, startDelayMs: delay, gapFromPrevVoiceMs: gap, played: !!e.playing, rejected: e.rejected, error: e.error });
  if (e.ended) prevEnd = e.ended;
}
const bubbles = log.filter((e) => e.bubble).length;
console.log(`network=${net} cpu=x${slow}  bubbles=${bubbles}  voice clips started=${rows.filter((r) => r.played).length}`);
rows.forEach((r) => console.log(`${String(r.startDelayMs).padStart(5)}ms to start  ${String(r.gapFromPrevVoiceMs ?? "-").padStart(5)}ms silence before  ${r.played ? "" : "NOT PLAYED " + (r.rejected || "") + (r.error ? " error" : "")} | ${r.line}`));

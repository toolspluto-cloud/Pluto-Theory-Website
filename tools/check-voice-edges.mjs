// Edge cases for the chat voices. Run: node check-voice-edges.mjs http://localhost:8090
import puppeteer from "puppeteer-core";

const base = process.argv[2] || "http://localhost:8090";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const results = {};

async function open({ click = true, setup } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
  await page.evaluateOnNewDocument(() => {
    try { localStorage.clear(); sessionStorage.clear(); } catch (_) {}
    window.__starts = 0; window.__playing = new Set(); window.__synth = 0;
    const os = AudioBufferSourceNode.prototype.start, ostop = AudioBufferSourceNode.prototype.stop;
    AudioBufferSourceNode.prototype.start = function (...a) {
      window.__starts++; window.__playing.add(this);
      this.addEventListener("ended", () => window.__playing.delete(this));
      return os.apply(this, a);
    };
    AudioBufferSourceNode.prototype.stop = function (...a) { window.__playing.delete(this); return ostop.apply(this, a); };
    if (window.speechSynthesis) { const sp = speechSynthesis.speak.bind(speechSynthesis); speechSynthesis.speak = (u) => { window.__synth++; sp(u); }; }
  });
  if (setup) await setup(page);
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  if (click) await page.mouse.click(5, 5);
  await page.evaluate(() => document.querySelector(".stage").scrollIntoView({ block: "center" }));
  return page;
}
const state = (page) => page.evaluate(() => ({
  starts: window.__starts, playing: window.__playing.size, synth: window.__synth,
  bubbles: document.querySelectorAll(".stage-msg:not(.is-typing):not(.is-you)").length,
  hint: !document.querySelector(".stage-voice-note").hidden && document.querySelector(".stage-voice-note").classList.contains("is-tap")
}));

// 1. Before any tap: covered by check-before-tap.mjs (needs scrolling that does not count as a click)
// 2. Site-wide mute, then the chat's Voices off button
{
  const page = await open();
  await page.click(".sound-toggle");
  await page.evaluate(() => document.querySelector(".u-restart").click());
  await wait(6000);
  const muted = await state(page);
  await page.click(".sound-toggle");
  await page.evaluate(() => document.querySelector(".stage-voice").click()); // voices off
  await page.evaluate(() => { window.__starts = 0; document.querySelector(".u-restart").click(); });
  await wait(6000);
  const off = await state(page);
  results.muteAndVoicesOff = { muted, off, pass: muted.starts === 0 && muted.bubbles >= 3 && off.starts === 0 && off.bubbles >= 3 };
  await page.close();
}
// 3. Scrolling away stops the voice at once; closing the chat mid-line stops it too
{
  const page = await open();
  await page.waitForFunction(() => window.__playing.size > 0, { timeout: 20000 });
  await page.evaluate(() => scrollTo(0, 0));
  await wait(500);
  const scrolled = await state(page);
  await page.evaluate(() => document.querySelector(".stage").scrollIntoView({ block: "center" }));
  await page.waitForFunction(() => window.__playing.size > 0, { timeout: 20000 });
  await page.evaluate(() => document.querySelector(".u-close").click());
  await wait(300);
  const closed = await state(page);
  results.scrollAndClose = { playingAfterScroll: scrolled.playing, playingAfterClose: closed.playing, pass: scrolled.playing === 0 && closed.playing === 0 };
  await page.close();
}
// 4. A clip that fails to download: no robot voice, chat keeps going
{
  const page = await open({
    setup: async (p) => { await p.setRequestInterception(true); p.on("request", (r) => (r.url().includes("/voices/") && r.url().includes(".mp3") ? r.respond({ status: 404, body: "" }) : r.continue())); }
  });
  await wait(9000);
  const s = await state(page);
  results.clipFails = { ...s, pass: s.starts === 0 && s.synth === 0 && s.bubbles >= 3 };
  await page.close();
}
// 5. iPhone-like: the audio never unlocks (resume never settles) — the chat must not freeze
{
  const page = await open({
    setup: (p) => p.evaluateOnNewDocument(() => {
      Object.defineProperty(AudioContext.prototype, "state", { get: () => "suspended" });
      AudioContext.prototype.resume = () => new Promise(() => {});
    })
  });
  await wait(10000);
  const s = await state(page);
  results.unlockHangs = { ...s, pass: s.bubbles >= 4 && s.hint };
  await page.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
console.log(Object.values(results).every((r) => r.pass) ? "ALL PASS" : "SOME FAILED");

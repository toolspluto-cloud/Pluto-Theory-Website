import puppeteer from "puppeteer-core";
const base = process.argv[2];
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1366, height: 900 });
await page.evaluateOnNewDocument(() => {
  window.__ev = []; const T = () => Math.round(performance.now());
  const op = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    const s = this.src.split("/").pop(); window.__ev.push([T(), "play() called", s]);
    ["loadeddata", "playing", "ended", "pause", "error", "waiting", "stalled"].forEach((t) => this.addEventListener(t, () => window.__ev.push([T(), t, s])));
    return op.call(this).catch((e) => { window.__ev.push([T(), "REJECTED " + e.name, s]); throw e; });
  };
  const oa = Element.prototype.appendChild;
  Element.prototype.appendChild = function (n) { if (n.classList?.contains("stage-msg")) window.__ev.push([T(), n.classList.contains("is-typing") ? "typing dots" : "BUBBLE", n.textContent.slice(0, 40)]); return oa.call(this, n); };
});
await page.goto(`${base}/`, { waitUntil: "networkidle0" });
await page.mouse.click(5, 5);
await page.evaluate(() => document.querySelector(".stage").scrollIntoView({ block: "center" }));
await page.waitForSelector(".stage-replies .reply", { timeout: 90000 });
const ev = await page.evaluate(() => window.__ev);
await browser.close();
const t0 = ev[0][0];
ev.forEach(([t, what, d]) => console.log(String(t - t0).padStart(6), what.padEnd(14), d));

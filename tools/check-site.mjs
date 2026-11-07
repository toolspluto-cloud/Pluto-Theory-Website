// Loads every page at desktop and phone sizes in headless Chrome, scrolls through it, and reports
// console errors, failed requests, sideways scrolling, content that never fades in, and screenshots.
//   node check-site.mjs http://localhost:8090
import puppeteer from "puppeteer-core";
import fs from "node:fs";

const base = process.argv[2] || "http://localhost:8090";
const pages = process.argv[3] === "clean" ? ["", "what-we-are", "branding", "photography", "ai-photoshoot", "gallery", "blog", "work", "contact"] : ["index.html", "what-we-are.html", "work.html", "contact.html"];
const sizes = { desktop: { width: 1366, height: 820 }, phone: { width: 375, height: 740, isMobile: true, hasTouch: true, deviceScaleFactor: 1 } };
fs.mkdirSync("shots", { recursive: true });

const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--autoplay-policy=no-user-gesture-required"] });
const report = [];
for (const [size, vp] of Object.entries(sizes)) {
  for (const p of pages) {
    const page = await browser.newPage();
    await page.setViewport(vp);
    const errors = [];
    page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errors.push(`${m.type()}: ${m.text()}`); });
    page.on("pageerror", (e) => errors.push(`exception: ${e.message}`));
    page.on("requestfailed", (r) => errors.push(`request failed: ${r.url()} ${r.failure()?.errorText}`));
    page.on("response", (r) => { if (r.status() >= 400) errors.push(`HTTP ${r.status()}: ${r.url()}`); });
    await page.goto(`${base}/${p}`, { waitUntil: "networkidle0" });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 250) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
      await new Promise((r) => setTimeout(r, 1500));
    });
    const info = await page.evaluate(() => {
      const wide = [...document.querySelectorAll("body *")].filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.right > innerWidth + 1 && getComputedStyle(e).position !== "fixed"; })
        .filter((e) => !e.closest("[aria-hidden=true]")).slice(0, 5).map((e) => `${e.tagName.toLowerCase()}.${String(e.className).split(" ")[0]} right=${Math.round(e.getBoundingClientRect().right)}`);
      const small = [...document.querySelectorAll("a, button, input, label, summary")].filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.height && (r.height < 24 || r.width < 24) && getComputedStyle(e).visibility !== "hidden"; }).length;
      return {
        pageWidth: document.documentElement.scrollWidth, viewport: innerWidth,
        hiddenReveals: document.querySelectorAll(".reveal:not(.is-visible)").length,
        overflowing: wide, tinyTapTargets: small
      };
    });
    await page.evaluate(() => scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: `shots/${size}-${p.replace(".html", "") || "index"}.png`, fullPage: true });
    report.push({ size, page: p, ...info, errors });
    await page.close();
  }
}
await browser.close();
console.log(JSON.stringify(report, null, 1));

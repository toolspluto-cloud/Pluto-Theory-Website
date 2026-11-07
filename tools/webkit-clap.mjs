// Loads the live home page in WebKit (Safari's engine) and captures the hero over time.
import { webkit } from "playwright";
const url = process.argv[2] || "https://www.plutotheory.com/";
const browser = await webkit.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 }, reducedMotion: process.argv[3] === "reduce" ? "reduce" : "no-preference" });
const errs = []; page.on("pageerror", (e) => errs.push(e.message)); page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const info = await page.evaluate(() => {
  const h = document.querySelector(".pt-scene[data-scene=hero]");
  const a = h.querySelector(".clap-a"), b = h.querySelector(".clap-b");
  return { variant: h.dataset.variant, hasClap: !!a, aAnim: a && getComputedStyle(a).animationName, opacityA: a && getComputedStyle(a).opacity, opacityB: b && getComputedStyle(b).opacity,
    reduced: matchMedia("(prefers-reduced-motion: reduce)").matches, anims: document.getAnimations().filter((x) => /clap/.test(x.animationName || "")).map((x) => x.animationName + ":" + x.playState).slice(0, 4) };
});
console.log(JSON.stringify(info), "errors:", JSON.stringify(errs));
const hero = await page.$(".pt-scene[data-scene=hero]");
for (let i = 0; i < 6; i++) { await hero.screenshot({ path: `shots/wk-${i}.png` }); await page.waitForTimeout(430); }
await browser.close();

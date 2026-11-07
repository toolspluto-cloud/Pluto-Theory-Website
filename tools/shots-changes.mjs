// Screenshots of the contact page top, the story steps and the pillar cards at a few widths.
import puppeteer from "puppeteer-core";
const base = process.argv[2] || "http://localhost:8090";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const show = (p) => p.evaluate(() => document.querySelectorAll(".reveal").forEach((r) => r.classList.add("is-visible")));
for (const [w, h] of [[1440, 900], [1366, 800], [390, 844]]) {
  const p = await browser.newPage();
  await p.setViewport({ width: w, height: h });
  await p.goto(`${base}/contact`, { waitUntil: "networkidle0" }); await show(p); await new Promise((r) => setTimeout(r, 900));
  const m = await p.evaluate(() => ({ eyebrow: Math.round(document.querySelector(".page-hero .eyebrow").getBoundingClientRect().top), form: Math.round(document.querySelector(".form").getBoundingClientRect().top), mascot: !!document.querySelector(".hello-scene") }));
  await p.screenshot({ path: `shots/contact-${w}.png` });
  await p.goto(`${base}/`, { waitUntil: "networkidle0" }); await show(p);
  const j = await p.$(".journey");
  await j.evaluate((el) => { el.scrollIntoView({ block: "center" }); el.querySelector(".journey-play").hidden = false; });
  await new Promise((r) => setTimeout(r, 1200));
  const gap = await p.evaluate(() => Math.round(document.querySelector(".journey ol").getBoundingClientRect().top - document.querySelector(".journey-play").getBoundingClientRect().bottom));
  await j.screenshot({ path: `shots/journey-${w}.png` });
  const pl = await p.$(".pillars");
  await pl.evaluate((el) => el.closest("section").scrollIntoView({ block: "start" }));
  await new Promise((r) => setTimeout(r, 1200));
  const card = await p.evaluate(() => { const c = document.querySelector(".pillar"); const s = c.querySelector(".card-scene").getBoundingClientRect(); return { cardW: Math.round(c.getBoundingClientRect().width), cardH: Math.round(c.getBoundingClientRect().height), sceneW: Math.round(s.width) }; });
  await (await p.$(".pillars")).screenshot({ path: `shots/pillars-${w}.png` });
  console.log(w, JSON.stringify({ contact: m, gapUnderPlayButton: gap, firstCard: card }));
  await p.close();
}
await browser.close();

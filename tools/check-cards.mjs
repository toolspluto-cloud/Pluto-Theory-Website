// Measures and screenshots the two mascot cards at several screen widths.
import puppeteer from "puppeteer-core";
const base = process.argv[2] || "http://localhost:8090";
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
for (const w of [1600, 1366, 1024, 800, 375]) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: 900 });
  await page.goto(`${base}/`, { waitUntil: "networkidle0" });
  const duo = await page.$(".duo");
  await duo.evaluate((el) => { el.scrollIntoView({ block: "center" }); el.querySelectorAll(".reveal").forEach((r) => r.classList.add("is-visible")); });
  await new Promise((r) => setTimeout(r, 1200));
  const m = await page.evaluate(() => [...document.querySelectorAll(".misfit")].map((c) => {
    const top = c.getBoundingClientRect().top, y = (s) => Math.round(c.querySelector(s).getBoundingClientRect().top - top);
    return { role: y(".role"), desc: y(".misfit-body > p:nth-child(2)"), says: y(".says"), cardH: Math.round(c.getBoundingClientRect().height) };
  }));
  console.log(w, JSON.stringify(m));
  await duo.screenshot({ path: `shots/cards-${w}.png` });
  await page.close();
}
await browser.close();

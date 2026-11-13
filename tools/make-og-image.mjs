// Draws the link-preview image (assets/og-image.png, 1200x630) shown when the site is shared on WhatsApp, LinkedIn,
// X and in search/AI results. Edit the text below and run:   node make-og-image.mjs
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const SITE = fileURLToPath(new URL("..", import.meta.url)).replace(/\\/g, "/");
const pill = "India · Worldwide";
const title = "AI automation &amp;<br>creative studio.";
const line = "AI automation · AI agents &amp; chatbots · Branding · Photography";

const html = `<!doctype html><html><head><style>
@font-face { font-family: Spartan; src: url('../fonts/league-spartan-latin.woff2'); font-weight: 100 900; }
@font-face { font-family: Inter; src: url('../fonts/inter-latin.woff2'); font-weight: 100 900; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; background: #F7F7F9; position: relative; overflow: hidden; font-family: Inter, sans-serif; color: #0B0B0F; }
.logo { position: absolute; left: 72px; top: 64px; height: 92px; }
.pill { position: absolute; left: 72px; top: 186px; background: #FF8A00; border: 3px solid #0B0B0F; border-radius: 40px; box-shadow: 0 5px 0 #0B0B0F;
  font: 800 20px/1 Spartan; letter-spacing: .12em; text-transform: uppercase; padding: 14px 26px 11px; }
h1 { position: absolute; left: 72px; top: 268px; font: 800 82px/0.98 Spartan; letter-spacing: -0.02em; }
p { position: absolute; left: 72px; top: 532px; font: 400 24px/1 Inter; color: #4A4A55; }
.bar { position: absolute; bottom: 0; height: 16px; width: 400px; }
</style></head><body>
<img class="logo" src="../assets/logo.png">
<div class="pill">${pill}</div>
<h1>${title}</h1>
<p>${line}</p>
<svg style="position:absolute;right:0;top:0" width="430" height="420" viewBox="0 0 430 420">
  <circle cx="440" cy="160" r="246" fill="none" stroke="#9A9AA5" stroke-width="3" stroke-dasharray="7 9"/>
  <circle cx="80" cy="90" r="18" fill="#8830D6" stroke="#0B0B0F" stroke-width="3.5"/>
  <circle cx="266" cy="170" r="76" fill="#46C750" stroke="#0B0B0F" stroke-width="3.5"/>
  <ellipse cx="266" cy="170" rx="126" ry="26" fill="none" stroke="#FF8A00" stroke-width="7" transform="rotate(-12 266 170)"/>
  <circle cx="356" cy="314" r="12" fill="#FF8A00" stroke="#0B0B0F" stroke-width="3"/>
</svg>
<div class="bar" style="left:0;background:#46C750"></div><div class="bar" style="left:400px;background:#8830D6"></div><div class="bar" style="left:800px;background:#0B0B0F"></div>
</body></html>`;

const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--allow-file-access-from-files"] });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
const tmp = fileURLToPath(new URL("./og-image.tmp.html", import.meta.url));
fs.writeFileSync(tmp, html);
await page.goto(pathToFileURL(tmp).href, { waitUntil: "networkidle0" });
fs.unlinkSync(tmp);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: fileURLToPath(new URL("../assets/og-image.png", import.meta.url)) });
await browser.close();
console.log("wrote assets/og-image.png");

// Dumps the visible text of every page (headings, paragraphs, buttons, labels) for a copy/grammar review.
import puppeteer from "puppeteer-core";
import fs from "node:fs";
const base = process.argv[2] || "http://localhost:8090";
const b = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const p = await b.newPage();
let out = "";
for (const pg of ["", "what-we-are", "work", "contact", "missing-page"]) {
  await p.goto(`${base}/${pg}`, { waitUntil: "networkidle0" });
  const t = await p.evaluate(() => {
    const rows = [], seen = new Set();
    document.querySelectorAll("h1,h2,h3,p,li,a,button,label,small,figcaption,.num").forEach((e) => {
      if (e.closest(".sr, .stage-chat")) return;
      const s = (e.innerText || "").replace(/\s+/g, " ").trim();
      if (s.length > 2 && !seen.has(s)) { seen.add(s); rows.push(`[${e.tagName.toLowerCase()}] ${s}`); }
    });
    return rows.join("\n");
  });
  out += `\n===== /${pg} =====\n${t}\n`;
}
fs.writeFileSync("site-copy.txt", out);
await b.close();

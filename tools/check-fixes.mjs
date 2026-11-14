// Behaviour checks for the bug fixes. Run: node check-fixes.mjs http://localhost:8090
import puppeteer from "puppeteer-core";

const base = process.argv[2] || "http://localhost:8090";
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--autoplay-policy=no-user-gesture-required"] });
const results = {};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// 3. Idea box punctuation
{
  const page = await browser.newPage();
  await page.goto(`${base}/index.html`, { waitUntil: "networkidle0" });
  const said = [];
  for (const idea of ["Is this weird?", "A coffee brand for night owls"]) {
    await page.evaluate((idea) => { const f = document.querySelector(".lab-form"); f.querySelector("input").value = idea; f.requestSubmit(); }, idea);
    await page.waitForFunction(() => document.querySelector(".lab").classList.contains("is-done"), { timeout: 20000 });
    said.push(await page.evaluate(() => document.querySelector(".lab-bubble").textContent.split(" Okay.")[0]));
    await page.evaluate(() => document.querySelector(".lab").classList.remove("is-done"));
  }
  results.ideaPunctuation = { said, pass: said[0] === "“Is this weird?”" && said[1] === "“A coffee brand for night owls.”" };
  await page.close();
}

// 4. Contact form refuses empty / bad email
{
  const page = await browser.newPage();
  await page.goto(`${base}/contact.html`, { waitUntil: "networkidle0" });
  const sentEmpty = await page.evaluate(() => { const f = document.querySelector(".form"); f.requestSubmit(); return f.classList.contains("is-sent"); });
  const sentBad = await page.evaluate(() => { const f = document.querySelector(".form"); f.querySelector("#f-name").value = "Test"; f.querySelector("#f-email").value = "not-an-email"; f.requestSubmit(); return f.classList.contains("is-sent"); });
  results.contactValidation = { sentEmpty, sentBad, pass: !sentEmpty && !sentBad };
  await page.close();
}

// 5. Footer link stays on one line on a phone
{
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 740, isMobile: true, hasTouch: true });
  await page.goto(`${base}/contact.html`, { waitUntil: "networkidle0" });
  const h = await page.evaluate(() => { const a = document.querySelector(".mascot-note a"); return { height: a.getBoundingClientRect().height, lines: a.getClientRects().length }; });
  results.footerLink = { ...h, pass: h.lines === 1 && h.height < 30 };
  await page.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 1));

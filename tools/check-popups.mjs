// Section 08 pop-ups and the new chat flow.   node check-popups.mjs http://localhost:8090
import puppeteer from "puppeteer-core";

const base = process.argv[2] || "http://localhost:8090";
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const results = {};
const popText = (page) => page.evaluate(() => document.querySelector(".pt-pop")?.innerText.replace(/\s+/g, " ").trim() || null);

// 1. Second page of the visit -> "You're following us" pop-up; never more than one per page
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });
  await page.goto(`${base}/what-we-are`, { waitUntil: "networkidle0" });
  await wait(7000);
  const first = await popText(page);
  await page.goto(`${base}/contact`, { waitUntil: "networkidle0" });
  await wait(9000);
  const second = await popText(page);
  results.secondPage = { firstPage: first, secondPage: second, pass: first === null && /following us/.test(second || "") };
  // dismiss with the X
  await page.click(".pt-pop-x");
  // it fades out for 0.3 s, then goes; allow slower machines up to 3 s
  const gone = await page.waitForFunction(() => !document.querySelector(".pt-pop"), { timeout: 3000 }).then(() => true, () => false);
  results.dismiss = { gone, pass: gone };
  await page.close();
}
// 2. Not while typing in the form, and capped: scroll trigger right after another pop-up is blocked by the 60 s gap
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });
  await page.goto(`${base}/what-we-are`, { waitUntil: "networkidle0" });
  await page.evaluate(() => { sessionStorage.setItem("pt-pop-last", Date.now()); }); // a pop-up just showed
  await wait(21000);
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight * 0.5));
  await wait(1500);
  results.gapRespected = { popup: await popText(page), pass: (await popText(page)) === null };
  await page.close();
}
// 3. Scroll trigger on a fresh visit: 20 s in and a third of the way down
{
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport({ width: 1366, height: 900 });
  await page.goto(`${base}/what-we-are`, { waitUntil: "networkidle0" });
  await wait(21000);
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight * 0.4));
  await wait(2500);
  const t = await popText(page);
  results.scrollPopup = { popup: t, pass: /still here/.test(t || "") };
  await ctx.close();
}
// 4. Home chat: six opening choices, branch, link actions; closing the chat shows the goodbye pop-up
{
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport({ width: 1366, height: 900 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]); // no typing pauses, for speed
  await page.evaluateOnNewDocument(() => localStorage.setItem("pt-voice", "off")); // flow only; voices are tested elsewhere
  await page.goto(`${base}/`, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.querySelector(".stage").scrollIntoView({ block: "center" }));
  await page.waitForSelector(".stage-replies .reply", { timeout: 20000 });
  const opening = await page.$$eval(".stage-replies .reply", (b) => b.map((x) => x.textContent));
  // no pop-up while the chat is on screen, even if a trigger fires
  const blocked = await page.evaluate(() => { sessionStorage.removeItem("pt-pop-last"); return document.querySelector(".pt-pop") === null; });
  await page.evaluate(() => [...document.querySelectorAll(".stage-replies .reply")].find((b) => b.textContent === "I need branding").click());
  await page.waitForFunction(() => [...document.querySelectorAll(".stage-replies .reply")].some((b) => b.textContent === "Don't judge my logo"), { timeout: 20000 });
  await page.evaluate(() => [...document.querySelectorAll(".stage-replies .reply")].find((b) => b.textContent === "Don't judge my logo").click());
  await page.waitForFunction(() => [...document.querySelectorAll(".stage-replies .reply")].some((b) => b.textContent === "See your branding work"), { timeout: 20000 });
  const links = await page.$$eval(".stage-replies a.reply", (a) => a.map((x) => `${x.textContent} -> ${x.getAttribute("href")}`));
  const lastLines = await page.$$eval(".stage-msg p", (p) => p.slice(-4).map((x) => x.textContent.replace(/^(Plu|Theo): (Plu|Theo)/, "")));
  await page.click(".u-close");
  await wait(1500);
  const bye = await popText(page);
  results.chatFlow = {
    opening, links, lastLines, bye,
    pass: opening.length === 6 && links.includes("Show you my logo -> /contact") && links.includes("See your branding work -> /what-we-are#branding")
      && lastLines[0] === "Too late. I'm judging." && /say something wrong/.test(bye || "") && blocked
  };
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
console.log(Object.values(results).every((r) => r.pass) ? "ALL PASS" : "SOME FAILED");

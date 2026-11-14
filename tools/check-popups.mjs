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
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]); // lines one by one, as most visitors see them
  await page.goto(`${base}/what-we-are`, { waitUntil: "networkidle0" });
  await wait(7000);
  const first = await popText(page);
  await page.goto(`${base}/contact`, { waitUntil: "networkidle0" });
  // click the ✕ as soon as it has popped in, while later lines are still to come (hovering reveals them,
  // which used to make the pop-up grow and push the ✕ away from the pointer)
  await page.waitForSelector(".pt-pop", { timeout: 15000 }).catch(() => {});
  await wait(500);
  const second = await popText(page);
  results.secondPage = { firstPage: first, secondPage: second, pass: first === null && /following us/.test(second || "") };
  // The ✕ must stay put when the pointer arrives (hovering shows the remaining lines at once), then close it
  const xTop = () => page.evaluate(() => Math.round(document.querySelector(".pt-pop-x")?.getBoundingClientRect().top));
  const before = await xTop();
  await page.hover(".pt-pop-lines");
  await wait(100);
  const afterHover = await xTop();
  await page.click(".pt-pop-x");
  // it fades out for 0.3 s, then goes; allow slower machines up to 3 s
  const gone = await page.waitForFunction(() => !document.querySelector(".pt-pop"), { timeout: 3000 }).then(() => true, () => false);
  results.dismiss = { xTopBefore: before, xTopAfterHover: afterHover, gone, pass: before === afterHover && gone };
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
await browser.close();
console.log(JSON.stringify(results, null, 1));
console.log(Object.values(results).every((r) => r.pass) ? "ALL PASS" : "SOME FAILED");

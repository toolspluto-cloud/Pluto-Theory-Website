// A visitor who only scrolls (never clicks): voices stay silent with the hint; the first real click starts them.
import puppeteer from "puppeteer-core";
const base = process.argv[2] || "http://localhost:8090";
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1366, height: 900 });
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
await page.evaluateOnNewDocument(() => {
  window.__starts = 0;
  const os = AudioBufferSourceNode.prototype.start;
  AudioBufferSourceNode.prototype.start = function (...a) { window.__starts++; return os.apply(this, a); };
});
await page.goto(`${base}/`, { waitUntil: "networkidle0" });
const cdp = await page.createCDPSession();
// read the page WITHOUT counting as a click (puppeteer evaluate would)
const peek = async (expr) => (await cdp.send("Runtime.evaluate", { expression: expr, returnByValue: true, userGesture: false, awaitPromise: true })).result.value;
// scroll down with the mouse wheel until the chat is in view
for (let i = 0; i < 60; i++) {
  const top = await peek("document.querySelector(\".stage\").getBoundingClientRect().top");
  if (top < 120) break;
  await page.mouse.move(683, 450);
  await page.mouse.wheel({ deltaY: 300 });
  await new Promise((r) => setTimeout(r, 120));
}
await new Promise((r) => setTimeout(r, 24000)); // the opening scene is 7 lines
const before = await peek("({ activated: navigator.userActivation.hasBeenActive, starts: window.__starts, bubbles: document.querySelectorAll(\".stage-msg:not(.is-typing):not(.is-you)\").length, hint: !document.querySelector(\".stage-voice-note\").hidden })");
await page.mouse.click(30, 450);
await page.click(".stage-replies .reply");
await new Promise((r) => setTimeout(r, 6000));
const after = await page.evaluate(() => ({ starts: window.__starts, hint: !document.querySelector(".stage-voice-note").hidden }));
console.log(JSON.stringify({ before, after, pass: before.starts === 0 && before.hint && before.bubbles >= 3 && after.starts > 0 && !after.hint }, null, 1));
await browser.close();

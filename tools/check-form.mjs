// Contact form check with the FormSubmit request intercepted (nothing is really sent).
//   node check-form.mjs http://localhost:8090
import puppeteer from "puppeteer-core";

const base = process.argv[2] || "http://localhost:8090";
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const out = {};
for (const mode of ["success", "failure"]) {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  let sent = null;
  page.on("request", (req) => {
    if (!req.url().startsWith("https://api.web3forms.com/")) return req.continue();
    if (req.method() === "OPTIONS") return req.respond({ status: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type, Accept", "Access-Control-Allow-Methods": "POST" } });
    sent = { url: req.url(), body: JSON.parse(req.postData()) };
    req.respond(mode === "success"
      ? { status: 200, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*" }, body: '{"success":true,"body":{"message":"Email sent successfully!"}}' }
      : { status: 400, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*" }, body: '{"success":false,"body":{"message":"Invalid access key"}}' });
  });
  await page.goto(`${base}/contact`, { waitUntil: "networkidle0" });
  await page.evaluate(() => (document.querySelector(".form").dataset.accessKey = "test-key"));
  await page.type("#f-name", "Test Person");
  await page.type("#f-email", "test@example.com");
  await page.type("#f-phone", "+91 98765 43210");
  await page.click('label[for="p1"]'); // a second service, to test multiple choices
  await page.click('label[for="p2"]');
  await page.type("#f-msg", "Hello from the form test");
  await page.click('.form [type="submit"]');
  await new Promise((r) => setTimeout(r, 1500));
  const state = await page.evaluate(() => ({
    sentShown: document.querySelector(".form").classList.contains("is-sent"),
    error: document.querySelector(".form-error").hidden ? null : document.querySelector(".form-error").textContent,
    emailLink: document.querySelector(".alt a")?.href
  }));
  out[mode] = { sent, ...state };
  await page.close();
}
await browser.close();
console.log(JSON.stringify(out, null, 1));

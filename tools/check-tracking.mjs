// Enquiry source and analytics check. Nothing real is sent: Web3Forms and Google are intercepted.
//   node check-tracking.mjs http://localhost:8090
// Prints a JSON list of problems (empty = pass).
import puppeteer from "puppeteer-core";

const base = process.argv[2] || "http://localhost:8090";
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const bad = [];
const ok = (cond, text) => { if (!cond) bad.push(text); };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// ga: pretend GA4 has an ID and this is the live site
async function open({ ga = false, send = "success", js = true } = {}) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  const seen = { form: [], google: [], posts: [] };
  await page.setJavaScriptEnabled(js);
  await page.setRequestInterception(true);
  page.on("request", async (req) => {
    const u = req.url();
    const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type, Accept", "Access-Control-Allow-Methods": "POST" };
    if (u.startsWith("https://api.web3forms.com/")) {
      if (req.method() === "OPTIONS") return req.respond({ status: 204, headers: cors });
      if (req.method() !== "POST" && !req.isNavigationRequest()) return req.respond({ status: 204 }); // e.g. favicon
      if (req.isNavigationRequest()) seen.posts.push({ method: req.method(), url: u, body: req.postData() || "" });
      else seen.form.push(JSON.parse(req.postData()));
      return req.respond({ status: send === "success" ? 200 : 400, contentType: "application/json", headers: cors, body: JSON.stringify({ success: send === "success" }) });
    }
    if (/google/.test(new URL(u).hostname)) { seen.google.push(u); return req.respond({ status: 200, contentType: "text/javascript", body: "" }); }
    if (ga && /\/js\/track\.js/.test(u)) {
      const src = (await (await fetch(u)).text()).replace(/const GA4_ID = "[^"]*"/, 'const GA4_ID = "G-TEST000000"').replace(/const live = [^;]+;/, "const live = true;");
      return req.respond({ status: 200, contentType: "text/javascript", body: src });
    }
    req.continue();
  });
  return { page, seen, ctx };
}
const fill = async (page) => { await page.type("#f-name", "Test Person"); await page.type("#f-email", "test@example.com"); };
const events = (page) => page.evaluate(() => (window.dataLayer || []).map((a) => Array.from(a)).filter((a) => a[0] === "event").map((a) => [a[1], a[2]]));

// 1. Ad click on one page, enquiry from another: the source reaches the form
{
  const { page, seen, ctx } = await open();
  await page.goto(`${base}/automations/crm?utm_source=google&utm_medium=cpc&utm_campaign=test&gclid=abc123`, { waitUntil: "networkidle0" });
  await page.goto(`${base}/contact?interest=automation`, { waitUntil: "networkidle0" });
  await fill(page);
  await page.click('.form [type="submit"]'); await wait(1200);
  const b = seen.form[0] || {};
  ok(seen.form.length === 1, `form sent ${seen.form.length} times`);
  ok(b.utm_source === "google" && b.utm_campaign === "test" && b.gclid === "abc123", "campaign details missing from the enquiry");
  ok(b.landing_page === "/automations/crm", `landing page sent as ${b.landing_page}`);
  ok(b.requested === "automation", `"One automation" button sent as ${b.requested}`);
  ok(/^[0-9a-f-]{36}$/.test(b.lead_id || ""), "no lead_id");
  ok(b.name === "Test Person" && !!b.access_key, "normal form fields missing");
  ok(seen.google.length === 0, "Google was contacted on a local copy of the site");
  await ctx.close();
}
// 2. A visit with no campaign sends no made-up campaign
{
  const { page, seen, ctx } = await open();
  await page.goto(`${base}/contact?interest=lead-generation,crm`, { waitUntil: "networkidle0" });
  await fill(page); await page.click('.form [type="submit"]'); await wait(1200);
  const b = seen.form[0] || {};
  ok(!b.utm_source && !b.gclid, "campaign invented for a direct visit");
  ok(/,/.test(b.interest || ""), "bundle button no longer ticks both automations");
  await ctx.close();
}
// 3. Consent: nothing from Google before a choice or after Decline; loads after Accept
{
  const { page, seen, ctx } = await open({ ga: true });
  await page.goto(`${base}/contact`, { waitUntil: "networkidle0" });
  ok(seen.google.length === 0, "Google loaded before consent");
  ok(!!(await page.$(".pt-consent")), "no consent question");
  const press = (t) => page.evaluate((t) => [...document.querySelectorAll(".pt-consent button")].find((b) => b.textContent === t).click(), t);
  await press("Decline"); await page.reload({ waitUntil: "networkidle0" });
  ok(seen.google.length === 0 && !(await page.$(".pt-consent")), "Decline was not respected");
  await ctx.close();
}
for (const send of ["success", "failure"]) {
  const { page, seen, ctx } = await open({ ga: true, send });
  await page.goto(`${base}/contact`, { waitUntil: "networkidle0" });
  await page.evaluate(() => [...document.querySelectorAll(".pt-consent button")].find((b) => b.textContent === "Accept cookies").click());
  await wait(400);
  ok(seen.google.length === 1, `after Accept, gtag loaded ${seen.google.length} times`);
  await page.click('.form [type="submit"]'); await wait(300);
  ok(!(await events(page)).some((e) => e[0] === "generate_lead"), "empty form counted as a lead");
  await fill(page); await page.click('.form [type="submit"]'); await wait(1200);
  const ev = await events(page), leads = ev.filter((e) => e[0] === "generate_lead");
  ok(leads.length === (send === "success" ? 1 : 0), `${send}: ${leads.length} leads counted`);
  if (send === "success") ok(leads[0] && leads[0][1].lead_id === seen.form[0]?.lead_id, "event and enquiry have different lead_id");
  else ok(ev.some((e) => e[0] === "form_error"), "failed send not recorded");
  ok(!/Test Person|test@example\.com/.test(JSON.stringify(ev)), "personal data in an analytics event");
  await ctx.close();
}
// 4. Without JavaScript, the form posts to Web3Forms and never puts details in the address
{
  const { page, seen, ctx } = await open({ js: false });
  await page.goto(`${base}/contact`, { waitUntil: "load" });
  await fill(page); await page.click('.form [type="submit"]').catch(() => {}); await wait(1500);
  const p = seen.posts[0];
  ok(p && p.method === "POST", "no-JavaScript form did not POST");
  ok(p && /access_key=/.test(p.body) && !/test/.test(p.url), "no-JavaScript form is missing its key or leaks details");
  ok(!/Test(\+|%20)Person|test%40example/.test(page.url()), "personal data in the page address");
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(bad, null, 1));

// Runs every website check that has a clear pass/fail, against a local copy of the site, and exits with
// an error if any fails. Used by GitHub Actions (.github/workflows/tests.yml) and by `npm test`.
//   node ci.mjs            all checks
//   node ci.mjs quick      skip the slow ones (pop-up timers, voice behaviour)
// Chrome: set CHROME_PATH if it isn't installed in the usual Windows place.
import { spawn } from "node:child_process";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const site = fileURLToPath(new URL("..", import.meta.url));
const port = 8091; // not 8090, so it can run while `npm run serve` is open
const base = `http://localhost:${port}`;
const quick = process.argv[2] === "quick";

function run(cmd, args) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { cwd: here });
    let out = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (out += d));
    p.on("close", (code) => resolve({ code, out }));
  });
}
const json = (out) => {
  const start = out.search(/[[{]/), end = Math.max(out.lastIndexOf("}"), out.lastIndexOf("]"));
  return JSON.parse(out.slice(start, end + 1));
};
const failing = (results) => Object.entries(results).filter(([, r]) => !r.pass).map(([k, r]) => `${k}: ${JSON.stringify(r)}`);

// Each check returns a list of problems (empty = pass)
const checks = [
  ["SEO: titles, descriptions, canonicals, headings, structured data, links, sitemap, robots.txt, llms.txt", async () => {
    const r = await run("node", ["check-seo.mjs"]);
    return r.code === 0 ? [] : r.out.trim().split("\n");
  }],
  ["Every page on desktop and phone (errors, broken files, sideways scrolling, hidden content)", async () => {
    const r = await run("node", ["check-site.mjs", base, "clean"]);
    return json(r.out).flatMap((p) => [
      ...p.errors.map((e) => `${p.size} /${p.page}: ${e}`),
      ...(p.pageWidth > p.viewport ? [`${p.size} /${p.page}: page scrolls sideways (${p.pageWidth}px wide on a ${p.viewport}px screen): ${p.overflowing.join(", ")}`] : []),
      ...(p.hiddenReveals ? [`${p.size} /${p.page}: ${p.hiddenReveals} section(s) never faded in`] : [])
    ]);
  }],
  ["Contact form (phone, several services, success and failure messages)", async () => {
    const r = json((await run("node", ["check-form.mjs", base])).out);
    const s = r.success, f = r.failure, bad = [];
    if (!s.sent) bad.push("the form sent nothing to Web3Forms");
    else {
      if (s.sent.body.phone !== "+91 98765 43210") bad.push(`phone sent as ${JSON.stringify(s.sent.body.phone)}`);
      if (!/,/.test(s.sent.body.services || "")) bad.push(`two services ticked but sent ${JSON.stringify(s.sent.body.services)}`);
    }
    if (!s.sentShown) bad.push("no thank-you message after a successful send");
    if (!f.error) bad.push("no error message when sending fails");
    return bad;
  }],
  ["Idea box, form checks, footer", async () => failing(json((await run("node", ["check-fixes.mjs", base])).out))],
  ["Pop-ups", async () => failing(json((await run("node", ["check-popups.mjs", base])).out)), "slow"],
];

const server = spawn("node", ["serve.js", site, String(port)], { cwd: here });
for (let i = 0; i < 50; i++) {
  try { if ((await fetch(base)).ok) break; } catch {}
  await new Promise((r) => setTimeout(r, 200));
}

let failed = 0;
for (const [name, check, speed] of checks) {
  if (quick && speed === "slow") { console.log(`-    ${name} (skipped)`); continue; }
  const t = Date.now();
  let problems;
  try { problems = await check(); } catch (e) { problems = [`the check itself crashed: ${e.message}`]; }
  const secs = Math.round((Date.now() - t) / 1000);
  console.log(`${problems.length ? "FAIL" : "ok  "} ${name} (${secs}s)`);
  problems.forEach((p) => console.log(`       ${p}`));
  if (problems.length) failed++;
}
server.kill();
console.log(failed ? `\n${failed} check(s) failed.` : "\nAll checks passed.");
process.exit(failed ? 1 : 0);

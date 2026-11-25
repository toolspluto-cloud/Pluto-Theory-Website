// Daily marketing health check of the live site, written as Markdown. Reads public pages only: it never submits the
// form, contacts an ad platform or changes anything. Run by .github/workflows/perf-monitor.yml.
//   node perf-monitor.mjs [https://www.plutotheory.com]
// Exit code: 0 = fine, 1 = something that loses or miscounts enquiries is broken.
import { fileURLToPath } from "node:url";

const DEFAULT = "https://www.plutotheory.com";
const PAGES = ["/", "/contact", "/pricing", "/automations", "/automations/lead-generation", "/automations/crm", "/automations/whatsapp", "/demos", "/privacy"];
const SLOW_MS = 3000;

async function get(url) {
  for (let attempt = 1; ; attempt++) {
    const t = Date.now();
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(20000), headers: { "Cache-Control": "no-cache" } });
      const text = await r.text();
      if (r.status >= 500 && attempt < 3) throw new Error(`status ${r.status}`);
      return { status: r.status, text, ms: Date.now() - t, csp: r.headers.get("content-security-policy") || "" };
    } catch (e) {
      if (attempt >= 3) return { status: 0, text: "", ms: Date.now() - t, csp: "", error: e.message };
      await new Promise((res) => setTimeout(res, 3000 * attempt));
    }
  }
}

export async function check(origin = DEFAULT, { expectCsp = true } = {}) {
  const problems = [], notes = [], info = [];
  const got = {};
  for (const p of PAGES) {
    const r = (got[p] = await get(origin + p));
    if (r.status !== 200) problems.push(`${p} did not load (${r.error || `status ${r.status}`})`);
    else if (r.ms > SLOW_MS) notes.push(`${p} was slow: ${r.ms} ms`);
  }
  const loaded = PAGES.filter((p) => got[p].status === 200);

  const contact = got["/contact"].text;
  if (got["/contact"].status === 200) {
    const form = (contact.match(/<form[^>]*data-form[^>]*>/) || [""])[0];
    if (!form) problems.push("the contact form is missing");
    else {
      if (!/data-endpoint="https:\/\/api\.web3forms\.com\/submit"/.test(form) || !/data-access-key="[\w-]{36}"/.test(form)) problems.push("the contact form has lost its Web3Forms address or key");
      if (!/method="post"/i.test(form)) problems.push("the contact form is not set to POST, so details could end up in the page address");
    }
    for (const id of ["f-name", "f-email"]) if (!contact.includes(`id="${id}"`)) problems.push(`the contact form field ${id} is missing`);
  }

  const noTrack = loaded.filter((p) => !/\/js\/track\.js\?v=/.test(got[p].text));
  if (noTrack.length) problems.push(`enquiry source tracking is missing on ${noTrack.join(", ")}`);
  const src = (contact.match(/\/js\/track\.js\?v=\w+/) || [])[0];
  const siteSrc = (contact.match(/\/js\/site\.js\?v=\w+/) || [])[0];
  if (src) {
    const t = await get(origin + src);
    if (t.status !== 200) problems.push("js/track.js did not load");
    else {
      const id = (t.text.match(/const GA4_ID = "([^"]*)"/) || [])[1];
      if (id) {
        info.push(`Google Analytics: on (${id})`);
        if (!/^G-[A-Z0-9]{6,}$/.test(id)) problems.push(`the Google Analytics ID looks wrong: ${id}`);
        if (!/Google Analytics/.test(got["/privacy"].text)) problems.push("Google Analytics is on but the privacy page doesn't name it");
      } else info.push("Google Analytics: off (no ID yet)");
    }
  }
  if (siteSrc) {
    const s = await get(origin + siteSrc);
    if (s.status !== 200) problems.push("js/site.js did not load, so the form can't send normally");
    else if (!/generate_lead/.test(s.text) || !/ptVisit/.test(s.text)) problems.push("the form no longer records the enquiry or its source");
  }
  if (expectCsp && got["/contact"].status === 200) {
    for (const host of ["https://api.web3forms.com", "https://www.googletagmanager.com"]) if (!got["/contact"].csp.includes(host)) problems.push(`the site's security header blocks ${host}`);
  }
  const avg = loaded.length ? Math.round(loaded.reduce((s, p) => s + got[p].ms, 0) / loaded.length) : 0;
  info.unshift(`Pages checked: ${PAGES.length}, loading: ${loaded.length}, average ${avg} ms from where this ran`);
  return { problems, notes, info };
}

export function report({ problems, notes, info }, origin) {
  const list = (a) => a.map((x) => `- ${x}`).join("\n");
  return [
    `Marketing health check of ${origin}, ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC.`,
    problems.length ? `## Needs fixing\n\n${list(problems)}` : "## All good\n\nNothing that loses or miscounts enquiries was found.",
    notes.length ? `## Worth a look\n\n${list(notes)}` : "",
    `## Details\n\n${list(info)}`,
    "Not checked here: whether enquiries reach the inbox, and ad results. No form was sent."
  ].filter(Boolean).join("\n\n") + "\n";
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const origin = (process.argv[2] || DEFAULT).replace(/\/$/, "");
  const r = await check(origin, { expectCsp: !/localhost/.test(origin) });
  console.log(report(r, origin));
  process.exitCode = r.problems.length ? 1 : 0;
}

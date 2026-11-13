// Weekly SEO report for www.plutotheory.com, written as Markdown. GitHub runs it every Monday and posts it as an
// issue (.github/workflows/seo-report.yml). Settings: tools/seo-report-config.json.
//
// Sections, each used only when its key is available:
//   1. Website health        always: every sitemap page loads, how fast
//   2. Google                GSC_SERVICE_ACCOUNT (a Google service account's JSON key with read access to
//                            Search Console): clicks, impressions, average position, the tracked keywords, top
//                            searches and pages, each compared with the week before
//   3. AI answers            ANTHROPIC_API_KEY: asks Claude (with live web search, as from Hyderabad) the questions
//                            a client might ask, and records whether Pluto Theory is named or plutotheory.com cited
//
//   node weekly-report.mjs [previous-report.md]   prints the report; pass last week's report to show changes
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";

const config = JSON.parse(fs.readFileSync(new URL("./seo-report-config.json", import.meta.url), "utf8"));
const ORIGIN = "https://www.plutotheory.com";
const day = (d) => d.toISOString().slice(0, 10);
const addDays = (d, n) => new Date(d.getTime() + n * 86400000);
const pct = (x) => `${(x * 100).toFixed(1)}%`;
const num = (x) => (x == null ? "-" : Number.isInteger(x) ? String(x) : x.toFixed(1));
// Change with an arrow. For positions, lower is better.
function delta(now, before, { lowerIsBetter = false, digits = 0 } = {}) {
  if (now == null || before == null) return "";
  const d = now - before;
  if (Math.abs(d) < (digits ? 0.05 : 0.5)) return " (same)";
  const better = lowerIsBetter ? d < 0 : d > 0;
  if (lowerIsBetter) return ` (${better ? "▲ up" : "▼ down"} ${Math.abs(d).toFixed(digits)})`; // positions: up = closer to the top
  return ` (${better ? "▲" : "▼"} ${d > 0 ? "+" : ""}${d.toFixed(digits)})`;
}

// ---------- 1. Website health ----------
export async function siteHealth() {
  const xml = await (await fetch(`${ORIGIN}/sitemap.xml`)).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const rows = [];
  for (const url of urls) {
    const t = Date.now();
    let status = 0;
    try { status = (await fetch(url, { redirect: "manual" })).status; } catch {}
    rows.push({ url, status, ms: Date.now() - t });
  }
  return { pages: rows.length, broken: rows.filter((r) => r.status !== 200), slow: rows.filter((r) => r.ms > 1500), avgMs: Math.round(rows.reduce((s, r) => s + r.ms, 0) / (rows.length || 1)) };
}

// ---------- 2. Google Search Console ----------
async function googleToken(key) {
  const b64 = (o) => Buffer.from(typeof o === "string" ? o : JSON.stringify(o)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({ iss: key.client_email, scope: "https://www.googleapis.com/auth/webmasters.readonly", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 })}`;
  const sig = crypto.createSign("RSA-SHA256").update(unsigned).sign(key.private_key, "base64url");
  const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${sig}` }) });
  const j = await r.json();
  if (!j.access_token) throw new Error(`Google sign-in failed: ${j.error_description || j.error || r.status}`);
  return j.access_token;
}

export async function searchConsole(keyJson, today = new Date()) {
  const token = await googleToken(JSON.parse(keyJson));
  // Search Console data arrives 2-3 days late, so "this week" is the 7 days ending 3 days ago
  const end = addDays(today, -3), start = addDays(end, -6), prevEnd = addDays(start, -1), prevStart = addDays(prevEnd, -6);
  const query = async (startDate, endDate, dimensions, rowLimit = 250) => {
    const r = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(config.searchConsoleProperty)}/searchAnalytics/query`, {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ startDate: day(startDate), endDate: day(endDate), dimensions, rowLimit })
    });
    const j = await r.json();
    if (!r.ok) throw new Error(`Search Console: ${j.error?.message || r.status}`);
    return j.rows || [];
  };
  const [totNow, totPrev, qNow, qPrev, pNow, pPrev] = await Promise.all([
    query(start, end, []), query(prevStart, prevEnd, []),
    query(start, end, ["query"]), query(prevStart, prevEnd, ["query"]),
    query(start, end, ["page"], 25), query(prevStart, prevEnd, ["page"], 250)
  ]);
  const byKey = (rows) => Object.fromEntries(rows.map((r) => [r.keys[0], r]));
  const qp = byKey(qPrev), pp = byKey(pPrev);
  const total = (rows) => rows[0] || { clicks: 0, impressions: 0, ctr: 0, position: null };
  const qn = byKey(qNow);
  return {
    range: `${day(start)} to ${day(end)}`,
    now: total(totNow), prev: total(totPrev),
    tracked: config.keywords.map((k) => ({ keyword: k, now: qn[k] || null, prev: qp[k] || null })),
    topQueries: [...qNow].sort((a, b) => b.impressions - a.impressions).slice(0, 15).map((r) => ({ ...r, prev: qp[r.keys[0]] || null, isNew: !qp[r.keys[0]] })),
    topPages: [...pNow].sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions).slice(0, 10).map((r) => ({ ...r, prev: pp[r.keys[0]] || null }))
  };
}

// ---------- 3. AI answers ----------
// Asks one question the way a visitor in Hyderabad would, with live web search, and checks the answer.
export async function askAI(client, question) {
  let messages = [{ role: "user", content: question }];
  let response;
  for (let turn = 0; turn < 4; turn++) { // a long search can pause; send it back to let it finish
    response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default", // if the model declines, the API retries on a fallback model in the same call
      output_config: { effort: "low" },
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 3, user_location: { type: "approximate", city: "Hyderabad", region: "Telangana", country: "IN", timezone: "Asia/Kolkata" } }],
      messages
    });
    if (response.stop_reason !== "pause_turn") break;
    messages = [...messages, { role: "assistant", content: response.content }];
  }
  if (response.stop_reason === "refusal") return { question, answered: false, note: "the model declined" };
  const text = response.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  const cited = new Set(), found = new Set();
  for (const b of response.content) {
    if (b.type === "text") for (const c of b.citations || []) if (c.url) cited.add(c.url);
    if (b.type === "web_search_tool_result" && Array.isArray(b.content)) for (const r of b.content) if (r.url) found.add(r.url);
  }
  const ours = (u) => new URL(u).hostname.replace(/^www\./, "") === config.domain;
  const host = (u) => new URL(u).hostname.replace(/^www\./, "");
  return {
    question, answered: true,
    mentioned: config.brand.some((b) => text.toLowerCase().includes(b)),
    cited: [...cited].some(ours),
    inSearchResults: [...found].some(ours),
    sources: [...new Set([...cited].map(host))].slice(0, 8),
    excerpt: text.replace(/\s+/g, " ").trim().slice(0, 600)
  };
}

// ---------- the report ----------
const prevAI = (prev) => { // last week's AI results, kept in a hidden comment at the end of the report
  const m = prev && prev.match(/<!-- ai-results (.*?) -->/s);
  try { return m ? JSON.parse(m[1]) : []; } catch { return []; }
};

export async function buildReport({ prev = "", gscKey = process.env.GSC_SERVICE_ACCOUNT, anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null, today = new Date() } = {}) {
  const out = [], notes = [];
  out.push(`Weekly SEO report for ${ORIGIN}, ${day(today)}.`, "");

  // 1. Health
  const h = await siteHealth();
  out.push("## Website health", "");
  out.push(`- ${h.pages} pages in the sitemap, ${h.broken.length ? `**${h.broken.length} not loading**` : "all loading"}; average load ${h.avgMs} ms from GitHub's servers in the US.`);
  for (const b of h.broken) out.push(`  - ${b.url} answered ${b.status || "nothing"}`);
  if (h.slow.length) out.push(`- Slow (over 1.5 s): ${h.slow.map((s) => s.url.replace(ORIGIN, "") || "/").join(", ")}`);
  out.push("");

  // 2. Google
  out.push("## Google", "");
  if (!gscKey) out.push("_Not connected yet: add the `GSC_SERVICE_ACCOUNT` secret (see README, SEO report) to see clicks, impressions and positions here._", "");
  else {
    try {
      const g = await searchConsole(gscKey, today);
      out.push(`Week of ${g.range}, compared with the week before. Position is the average spot in Google results (1 = top).`, "");
      out.push("| | This week | Change |", "|---|---|---|");
      out.push(`| Clicks | ${g.now.clicks} | ${delta(g.now.clicks, g.prev.clicks).trim()} |`);
      out.push(`| Times shown in results | ${g.now.impressions} | ${delta(g.now.impressions, g.prev.impressions).trim()} |`);
      out.push(`| Click rate | ${pct(g.now.ctr)} | |`);
      out.push(`| Average position | ${num(g.now.position)} | ${delta(g.now.position, g.prev.position, { lowerIsBetter: true, digits: 1 }).trim()} |`, "");
      out.push("**Tracked searches**", "", "| Search | Position | Shown | Clicks |", "|---|---|---|---|");
      for (const t of g.tracked) out.push(t.now
        ? `| ${t.keyword} | ${num(t.now.position)}${delta(t.now.position, t.prev?.position, { lowerIsBetter: true, digits: 1 })} | ${t.now.impressions} | ${t.now.clicks} |`
        : `| ${t.keyword} | not shown this week${t.prev ? ` (was ${num(t.prev.position)})` : ""} | 0 | 0 |`);
      out.push("");
      if (g.topQueries.length) {
        out.push("**What people searched before finding you** (most shown first)", "", "| Search | Position | Shown | Clicks |", "|---|---|---|---|");
        for (const q of g.topQueries) out.push(`| ${q.keys[0]}${q.isNew ? " 🆕" : ""} | ${num(q.position)}${delta(q.position, q.prev?.position, { lowerIsBetter: true, digits: 1 })} | ${q.impressions} | ${q.clicks} |`);
        out.push("");
      }
      if (g.topPages.length) {
        out.push("**Pages**", "", "| Page | Clicks | Shown | Position |", "|---|---|---|---|");
        for (const p of g.topPages) out.push(`| ${p.keys[0].replace(/^https?:\/\/(www\.)?plutotheory\.com/, "") || "/"} | ${p.clicks}${delta(p.clicks, p.prev?.clicks)} | ${p.impressions} | ${num(p.position)} |`);
        out.push("");
      }
    } catch (e) { out.push(`_Couldn't read Search Console: ${e.message}_`, ""); notes.push("google"); }
  }

  // 3. AI answers
  out.push("## AI answers", "");
  let ai = [];
  if (!anthropic) out.push("_Not connected yet: add the `ANTHROPIC_API_KEY` secret (see README, SEO report) to check what AI assistants say about you._", "");
  else {
    const before = Object.fromEntries(prevAI(prev).map((r) => [r.question, r]));
    for (const q of config.aiQuestions) {
      try { ai.push(await askAI(anthropic, q)); }
      catch (e) { ai.push({ question: q, answered: false, note: e instanceof Anthropic.APIError ? `API error ${e.status}` : e.message }); }
    }
    const answered = ai.filter((r) => r.answered), yes = answered.filter((r) => r.mentioned || r.cited).length;
    if (!answered.length) out.push(`**Couldn't ask any of the questions** (${ai[0]?.note}). Check the \`ANTHROPIC_API_KEY\` secret.`, "");
    else out.push(`Asked Claude ${answered.length} questions with live web search, as someone in Hyderabad. Pluto Theory came up in **${yes} of ${answered.length}** answers${prevAI(prev).length ? ` (last week: ${prevAI(prev).filter((r) => r.mentioned || r.cited).length})` : ""}.`, "");
    out.push("| Question | Named | Your site cited | Sources the answer used |", "|---|---|---|---|");
    const mark = (now, was) => `${now ? "✅" : "—"}${was !== undefined && was !== now ? (now ? " (new)" : " (lost)") : ""}`;
    for (const r of ai) {
      const b = before[r.question];
      out.push(r.answered
        ? `| ${r.question} | ${mark(r.mentioned, b?.mentioned)} | ${mark(r.cited, b?.cited)} | ${r.sources.join(", ") || "-"} |`
        : `| ${r.question} | ? | ? | ${r.note} |`);
    }
    out.push("", "<details><summary>What the answers said</summary>", "");
    for (const r of ai.filter((x) => x.answered)) out.push(`**${r.question}**`, "", `> ${r.excerpt}${r.excerpt.length >= 600 ? "…" : ""}`, "");
    out.push("</details>", "");
    out.push("The sites in the last column are where AI tools get their answers. Being listed or mentioned on them (directories, \"best agencies\" lists, articles) is the most direct way to start appearing.", "");
  }

  out.push(`<!-- ai-results ${JSON.stringify(ai.filter((r) => r.answered).map(({ question, mentioned, cited }) => ({ question, mentioned, cited })))} -->`);
  return out.join("\n");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const prev = process.argv[2] && fs.existsSync(process.argv[2]) ? fs.readFileSync(process.argv[2], "utf8") : "";
  console.log(await buildReport({ prev }));
}

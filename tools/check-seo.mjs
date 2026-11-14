// SEO checks on the site's files (no browser needed). Prints one problem per line; exit 1 if there are any.
//   node check-seo.mjs
// Catches: missing or badly sized titles and descriptions, wrong canonical addresses, pages with no or several
// main headings, broken structured data, images without descriptions, links to pages that don't exist,
// main pages hidden from Google by mistake, a sitemap that's missing pages, and a robots.txt that blocks
// Google or the AI search engines.
import fs from "node:fs";
import path from "node:path";
import { SITE, ORIGIN, pages, isNoindex, buildSitemap } from "./build-sitemap.mjs";

// These must always be visible to search engines. (gallery and work stay hidden until they have real work.)
const MUST_BE_FOUND = ["/", "/ai-automation", "/ai-agents", "/branding", "/photography", "/ai-photoshoot", "/what-we-are", "/contact", "/blog"];
// Search and AI crawlers that must not be blocked in robots.txt
const CRAWLERS = ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "GPTBot", "PerplexityBot", "ClaudeBot", "Claude-SearchBot", "Google-Extended", "Applebot"];

const problems = [];
const bad = (where, what) => problems.push(`${where}: ${what}`);
const all = pages();
const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`, "i")) || [])[1];
const meta = (html, key) => { const t = html.match(new RegExp(`<meta (?:name|property)="${key}"[^>]*>`, "i")); return t ? attr(t[0], "content") : undefined; };
const text = (s) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&[a-z]+;|&#\d+;/g, "x").trim();

// Does an address on this site lead to a real file? (clean addresses: /contact -> contact.html)
function exists(href) {
  const p = decodeURIComponent(href.split(/[?#]/)[0]).replace(/^\//, "");
  if (p === "") return true;
  return [p, `${p}.html`, `${p}/index.html`].some((c) => fs.existsSync(path.join(SITE, c)) && fs.statSync(path.join(SITE, c)).isFile());
}

for (const { file, url, html } of all) {
  if (file === "404.html") continue;
  const where = `/${file.replace(/\.html$/, "").replace(/^index$/, "")}`;
  const hidden = isNoindex(html);

  if (!/<html lang="[a-z]{2}/.test(html)) bad(where, "no language set on <html>");
  const title = text((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "");
  if (!title) bad(where, "no <title>");
  else if (!hidden && (title.length < 20 || title.length > 70)) bad(where, `title is ${title.length} characters (keep it 20-70 so Google shows it whole): "${title}"`);
  const desc = meta(html, "description");
  if (!desc) bad(where, "no meta description");
  else if (!hidden && (desc.length < 70 || desc.length > 170)) bad(where, `description is ${desc.length} characters (keep it 70-170)`);

  const canon = html.match(/<link rel="canonical" href="([^"]*)"/);
  if (!canon) bad(where, "no canonical address");
  else if (canon[1] !== url) bad(where, `canonical is ${canon[1]} but the page lives at ${url}`);

  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) bad(where, `${h1s} main headings (<h1>); a page should have exactly one`);

  if (!hidden) {
    for (const k of ["og:title", "og:description", "og:image", "og:url"]) if (!meta(html, k)) bad(where, `no ${k} (used for link previews on WhatsApp, LinkedIn and AI answers)`);
    const og = meta(html, "og:url");
    if (og && og !== url) bad(where, `og:url is ${og} but the page lives at ${url}`);
  }

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]);
      for (const node of [data, ...(data["@graph"] || [])]) if (node && typeof node === "object" && !Array.isArray(node) && !node["@type"] && !node["@graph"]) bad(where, "structured data block with no @type");
    } catch (e) { bad(where, `structured data isn't valid JSON (${e.message})`); }
  }
  if (!hidden && !/application\/ld\+json/.test(html)) bad(where, "no structured data (JSON-LD)");

  for (const img of html.match(/<img\b[^>]*>/g) || []) if (attr(img, "alt") === undefined) bad(where, `image with no alt text: ${attr(img, "src")}`);

  for (const m of html.matchAll(/\shref="([^"]+)"/g)) {
    const h = m[1];
    if (/^(https?:|mailto:|tel:|#|data:)/.test(h)) { if (h.startsWith(ORIGIN) && !exists(h.slice(ORIGIN.length) || "/")) bad(where, `link to a page that doesn't exist: ${h}`); continue; }
    const abs = h.startsWith("/") ? h : `/${path.posix.join(path.posix.dirname(file), h)}`;
    if (!exists(abs)) bad(where, `link to a page or file that doesn't exist: ${h}`);
  }
}

// Main pages hidden by mistake
for (const p of MUST_BE_FOUND) {
  const page = all.find((x) => x.url === `${ORIGIN}${p}`);
  if (!page) bad(p, "this main page is missing");
  else if (isNoindex(page.html)) bad(p, "this main page is marked noindex, so Google will drop it");
}

// Sitemap: matches the pages (GitHub rebuilds it on main; this catches anything else)
const sitemap = fs.readFileSync(path.join(SITE, "sitemap.xml"), "utf8");
const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const wanted = [...buildSitemap().matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const u of wanted) if (!listed.includes(u)) bad("sitemap.xml", `missing ${u} (run: node tools/build-sitemap.mjs)`);
for (const u of listed) if (!wanted.includes(u)) bad("sitemap.xml", `lists ${u}, which doesn't exist or is hidden from search`);

// robots.txt: nothing important blocked, sitemap advertised
const robots = fs.readFileSync(path.join(SITE, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) bad("robots.txt", "doesn't point to the sitemap");
const groups = robots.split(/\n(?=User-agent:)/i);
for (const bot of ["*", ...CRAWLERS]) {
  const g = groups.find((x) => new RegExp(`^User-agent:\\s*${bot.replace("*", "\\*")}\\s*$`, "im").test(x));
  if (g && /^Disallow:\s*\/\s*$/im.test(g)) bad("robots.txt", `blocks ${bot === "*" ? "every crawler" : bot} from the whole site`);
}

// llms.txt: the summary AI tools read; its links must work
const llms = fs.readFileSync(path.join(SITE, "llms.txt"), "utf8");
for (const m of llms.matchAll(/\((https:\/\/www\.plutotheory\.com[^)]*)\)/g)) if (!exists(m[1].slice(ORIGIN.length) || "/")) bad("llms.txt", `link to a page that doesn't exist: ${m[1]}`);
for (const p of all) if (!isNoindex(p.html) && p.file !== "404.html" && p.file.startsWith("blog/") && !llms.includes(p.url)) bad("llms.txt", `blog post not listed, so AI tools may miss it: ${p.url}`);

// Blog posts: listed on /blog, marked up as articles, FAQ schema matches the visible FAQ
const blogIndex = fs.readFileSync(path.join(SITE, "blog.html"), "utf8");
for (const p of all.filter((x) => x.file.startsWith("blog/") && !isNoindex(x.html))) {
  const where = `/${p.file.replace(/\.html$/, "")}`;
  if (!blogIndex.includes(`href="${where}"`)) bad("blog.html", `doesn't list ${where}`);
  if (!/"@type":\s*"BlogPosting"/.test(p.html)) bad(where, "no BlogPosting structured data");
  if (!/"datePublished":\s*"\d{4}-\d{2}-\d{2}"/.test(p.html)) bad(where, "no datePublished");
  const shown = (p.html.match(/<details\b/g) || []).length, marked = (p.html.match(/"@type":\s*"Question"/g) || []).length;
  if (shown !== marked) bad(where, `${shown} FAQ questions on the page but ${marked} in the FAQPage structured data`);
}

// Home page "Latest from the blog" shows the three newest posts listed on /blog
{
  const home = fs.readFileSync(path.join(SITE, "index.html"), "utf8");
  const sec = home.slice(home.indexOf('class="section--tight latest-posts"'));
  const newest = [...blogIndex.matchAll(/<a href="(\/blog\/[^"]+)">/g)].map((m) => m[1]).slice(0, 3);
  const shown = [...sec.slice(0, sec.indexOf("</section>")).matchAll(/<a href="(\/blog\/[^"]+)">/g)].map((m) => m[1]);
  if (home.indexOf("latest-posts") < 0) bad("/", "no \"Latest from the blog\" section");
  else if (newest.join() !== shown.join()) bad("/", `"Latest from the blog" should list ${newest.join(", ")} (the three newest posts on /blog), but lists ${shown.join(", ")}`);
}

console.log(problems.length ? problems.join("\n") : `SEO checks passed (${all.length} pages, ${listed.length} in the sitemap)`);
process.exit(problems.length ? 1 : 0);

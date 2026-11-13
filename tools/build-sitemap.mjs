// Rebuilds sitemap.xml from the pages themselves: every .html page that isn't marked noindex, at its canonical
// address, with the date that page was last changed in git. GitHub runs this on every push to main and commits
// the result, so a new or edited page reaches the sitemap without anyone touching it.
//   node build-sitemap.mjs          write sitemap.xml
//   node build-sitemap.mjs --check  only say whether sitemap.xml is up to date (exit 1 if not)
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const SITE = fileURLToPath(new URL("..", import.meta.url));
export const ORIGIN = "https://www.plutotheory.com";

// Every page of the website, as { file, url, html }
export function pages() {
  const files = [...fs.readdirSync(SITE).filter((f) => f.endsWith(".html")),
    ...fs.readdirSync(path.join(SITE, "blog")).filter((f) => f.endsWith(".html")).map((f) => `blog/${f}`)];
  return files.map((file) => {
    const slug = file.replace(/\.html$/, "").replace(/(^|\/)index$/, "");
    return { file, url: `${ORIGIN}/${slug}`, html: fs.readFileSync(path.join(SITE, file), "utf8") };
  });
}
export const isNoindex = (html) => /<meta name="robots" content="[^"]*noindex/i.test(html);

function lastChanged(file) {
  try {
    const d = execFileSync("git", ["log", "-1", "--format=%cs", "--", file], { cwd: SITE, encoding: "utf8" }).trim();
    if (d) return d;
  } catch {}
  return new Date().toISOString().slice(0, 10); // a page that isn't committed yet
}

export function buildSitemap() {
  // Home first, then the main pages, then the blog posts, then the rest
  const order = (u) => (u === `${ORIGIN}/` ? 0 : u.includes("/blog/") ? 2 : /privacy/.test(u) ? 3 : 1);
  const rows = pages().filter((p) => p.file !== "404.html" && !isNoindex(p.html))
    .sort((a, b) => order(a.url) - order(b.url) || a.file.localeCompare(b.file))
    .map((p) => `  <url><loc>${p.url}</loc><lastmod>${lastChanged(p.file)}</lastmod></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join("\n")}\n</urlset>\n`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const file = path.join(SITE, "sitemap.xml");
  const fresh = buildSitemap(), current = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  if (process.argv[2] === "--check") {
    console.log(fresh === current ? "sitemap.xml is up to date" : "sitemap.xml is out of date (run: node build-sitemap.mjs)");
    process.exit(fresh === current ? 0 : 1);
  }
  fs.writeFileSync(file, fresh);
  console.log(fresh === current ? "sitemap.xml unchanged" : `sitemap.xml updated (${fresh.match(/<url>/g).length} pages)`);
}

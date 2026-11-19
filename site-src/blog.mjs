// Gives the hand-written blog pages (blog.html and blog/*.html) the site's current design: the shared header,
// footer, stylesheet and scripts, and the new class names for their sections. Each page keeps its own <head>
// (title, description, canonical, structured data) and its own words. Safe to run any number of times: a page that
// is already converted comes out unchanged. Runs at the end of `node site-src/build.mjs`.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { header, footer, HEAD_ASSETS, SCRIPTS } from "./lib.mjs";

export function convertBlog(root) {
  const files = ["blog.html", ...readdirSync(join(root, "blog")).filter((f) => f.endsWith(".html")).map((f) => `blog/${f}`)];
  let changed = 0;
  for (const file of files) {
    const full = join(root, file);
    const before = readFileSync(full, "utf8");
    const after = convertPage(before, file === "blog.html");
    if (after !== before) { writeFileSync(full, after); changed++; }
  }
  return { files: files.length, changed };
}

function convertPage(html, isIndex) {
  const path = isIndex ? "/blog" : "/blog/";

  // <head>: drop the old and current stylesheet/boot links, then add the current ones once
  let head = html.slice(0, html.indexOf("</head>"));
  head = head
    .replace(/\n\s*<link rel="stylesheet" href="\/(?:styles|css\/site)\.css[^"]*">/g, "")
    .replace(/\n\s*<script src="\/js\/boot\.js[^"]*"><\/script>/g, "")
    .replace(/<meta name="theme-color" content="[^"]*">/, '<meta name="theme-color" content="#0B0B0F">');
  const ld = head.indexOf('  <script type="application/ld+json">');
  head = ld > 0 ? head.slice(0, ld) + HEAD_ASSETS + "\n" + head.slice(ld) : head.trimEnd() + "\n" + HEAD_ASSETS + "\n";

  // <main>: new section classes; old "reveal" animations become the site's data-reveal
  let main = html.slice(html.indexOf("<main"), html.indexOf("</main>") + 7);
  main = main
    .replace('<main id="main" class="article">', '<main id="main">')
    .replace(/<section class="page-hero svc-hero">/, isIndex ? '<section class="phero dark blog-hero" data-theme="dark">' : '<section class="phero blog-hero">')
    .replace(/class="crumbs"/g, 'class="crumb"')
    .replace(/<h1 class="reveal"[^>]*>/, `<h1 class="${isIndex ? "h-xl" : "h-lg"}" data-reveal>`)
    .replace(/<p class="sub reveal"[^>]*>/, '<p class="lede" data-reveal>')
    .replace(/ style="--accent: var\(--[a-z]+\)"/g, "")
    .replace(/<summary>(?![\s\S]{0,400}?<i aria-hidden)([\s\S]*?)<\/summary>/g, '<summary>$1<i aria-hidden="true"></i></summary>')
    .replace(/<div class="ctas reveal">/g, '<div class="ctas" data-reveal>')
    .replace(/ class="reveal"/g, " data-reveal")
    .replace(/ class="([^"]*?) reveal"/g, ' class="$1" data-reveal')
    .replace(/ data-delay="\d+"/g, "");

  return `${head}</head>
<body>
${header(path, isIndex)}
  ${main}
${footer()}
${SCRIPTS}
</body>
</html>
`;
}

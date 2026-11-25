// Shared pieces for every page: icons, the layout (head, header, footer) and small helpers.
import { PRODUCTS } from "./products.mjs";

export const SITE = "https://www.plutotheory.com";
export const EMAIL = "info@plutotheory.com";
export const V = "11"; // bump to bust caches after CSS/JS changes

const s = (d, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;
export const I = {
  ne: s('<path d="M7 17L17 7M8 7h9v9"/>'),
  arrow: s('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  chev: s('<path d="M6 9l6 6 6-6"/>'),
  check: s('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  plus: s('<path d="M12 5v14M5 12h14"/>'),
  seo: s('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20M8 12l2-2 1.5 1.5L14 9"/>'),
  lead: s('<path d="M4 13l2.5-7.5A2 2 0 0 1 8.4 4h7.2a2 2 0 0 1 1.9 1.5L20 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M4 13h4.5l1.5 2.5h4l1.5-2.5H20"/>'),
  crm: s('<circle cx="9" cy="8.5" r="3.5"/><path d="M3 19.5c.6-3.2 3-5 6-5s5.4 1.8 6 5"/><path d="M16 5.5a3.2 3.2 0 0 1 0 6.2M18 14.8c1.6.7 2.6 2.4 3 4.7"/>'),
  post: s('<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>'),
  insta: s('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>'),
  perf: s('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
  pr: s('<path d="M3 10v4a1 1 0 0 0 1 1h3l6 4V5L7 9H4a1 1 0 0 0-1 1z"/><path d="M17 8.5a5 5 0 0 1 0 7M19.5 6a8.5 8.5 0 0 1 0 12"/>'),
  wa: s('<path d="M4.5 19.5l1.2-3.6A8 8 0 1 1 8.6 18.6z"/><path d="M9.2 9.4c.2 1.9 2.4 4.3 5 5 .5.1 1.4-.5 1.6-1l-1.5-.9-.8.6c-.9-.4-1.8-1.3-2.2-2.2l.6-.8-.9-1.5c-.5.2-1.1.6-.9 1z"/>'),
  web: s('<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/>'),
  shield: s('<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z"/><path d="M9 12l2 2 4-4"/>'),
  plug: s('<path d="M9 3v5M15 3v5M7 8h10v3a5 5 0 0 1-10 0zM12 16v5"/>'),
  sliders: s('<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>'),
  eye: s('<path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>'),
  bell: s('<path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9zM10 20a2.2 2.2 0 0 0 4 0"/>'),
  clock: s('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  cal: s('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
  mail: s('<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6.5L12 13l8.5-6.5"/>'),
  globe: s('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.5 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.5-3.5-8.5s1-5.9 3.5-8.5z"/>'),
  form: s('<rect x="4" y="3.5" width="16" height="17" rx="2.5"/><path d="M8 8h8M8 12h8M8 16h4"/>'),
  db: s('<ellipse cx="12" cy="6" rx="7.5" ry="2.8"/><path d="M4.5 6v6c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8V6M4.5 12v6c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-6"/>'),
  chart: s('<path d="M3.5 19.5h17M6 16l4-5 3.5 3L19 7"/>'),
  spark: s('<path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z"/>'),
  brand: s('<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.3 6L12 16.4 6.6 19.4l1.3-6L3.4 9.3l6-.7z"/>'),
  camera: s('<path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>'),
  code: s('<path d="M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5"/>'),
  chat: s('<path d="M4 5.5h16v10H9l-5 4z"/>'),
  user: s('<circle cx="12" cy="8" r="4"/><path d="M4.5 20c.8-4 3.8-6 7.5-6s6.7 2 7.5 6"/>'),
  play: s('<circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l5.5-3.5z" fill="currentColor"/>'),
  help: s('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/>'),
  layers: s('<path d="M12 3.5l9 4.5-9 4.5L3 8z"/><path d="M3 12.5l9 4.5 9-4.5M3 16.5l9 4.5 9-4.5"/>'),
  x: s('<path d="M6 6l12 12M18 6L6 18"/>'),
  minus: s('<path d="M5 12h14"/>'),
  team: s('<circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M2.5 19c.5-3 2.6-4.5 5.5-4.5s5 1.5 5.5 4.5M13.5 15c.8-.4 1.6-.5 2.5-.5 2.9 0 5 1.5 5.5 4.5"/>')
};
export const CURSOR = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3l14 7.2-6.2 1.6L9.6 18z" fill="#fff" stroke="#0B0B0F" stroke-width="1.6" stroke-linejoin="round"/></svg>`;

export const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Split a heading into words so each one can rise in. Segments: plain strings, or {t, cls} for styled words.
export function words(...segs) {
  let i = 0;
  return segs.map((seg) => {
    const { t, cls } = typeof seg === "string" ? { t: seg, cls: "" } : seg;
    return t.split(/(\s+|<br>)/).map((w) => {
      if (w === "<br>") return "<br>";
      if (!w.trim()) return " ";
      return `<span class="w"><span class="${cls}" style="--i:${i++}">${w}</span></span>`;
    }).join("");
  }).join("");
}

export const statusPill = (st) => st === "live" ? `<span class="st st--done">Available</span>` : st === "pilot" ? `<span class="st st--run">Pilot</span>` : st === "soon" ? `<span class="st st--soon">Coming soon</span>` : `<span class="st st--early">Early access</span>`;

const nav = (path) => {
  const cur = (p) => (path === p || (p !== "/" && path.startsWith(p + "/")) ? ' aria-current="page"' : "");
  const mega = PRODUCTS.map((p) => `<a href="/automations/${p.slug}"><span class="ico">${I[p.icon]}</span><b>${p.name}</b><small>${p.short}</small></a>`).join("");
  return `<nav class="nav" id="nav" aria-label="Main">
        <div class="nav-drop"><button type="button" aria-expanded="false" aria-controls="mega">Automations ${I.chev}</button>
          <div class="mega" id="mega">${mega}<div class="mega-foot"><span>Not sure where to start?</span><a href="/automations">See every automation →</a></div></div>
        </div>
        <a href="/how-it-works"${cur("/how-it-works")}>How it works</a>
        <a href="/studio"${cur("/studio")}>Studio</a>
        <a href="/pricing"${cur("/pricing")}>Pricing</a>
        <a href="/demos"${cur("/demos")}>Demos</a>
        <a href="/blog"${cur("/blog")}>Blog</a>
        <a href="/support"${cur("/support")}>Support</a>
      </nav>`;
};

export function layout({ path, title, description, body, dark = true, schema = [], noindex = false }) {
  const url = SITE + (path === "/" ? "/" : path);
  const ld = [
    { "@type": "Organization", "@id": SITE + "/#organization", name: "Pluto Theory", url: SITE + "/", logo: SITE + "/assets/logo.png", email: EMAIL,
      slogan: "Marketing in a click.", description: "Pluto Theory builds AI marketing automations and offers them through subscriptions, with a studio team for the work that needs people." },
    { "@type": "WebSite", "@id": SITE + "/#website", url: SITE + "/", name: "Pluto Theory", publisher: { "@id": SITE + "/#organization" } },
    { "@type": "WebPage", "@id": url + "#webpage", url, name: title, description, isPartOf: { "@id": SITE + "/#website" } },
    ...schema
  ];
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${url}">
  ${noindex ? '<meta name="robots" content="noindex, follow">' : ""}
  <meta name="theme-color" content="#0B0B0F">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Pluto Theory">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITE}/assets/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="preload" href="/fonts/league-spartan-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
${HEAD_ASSETS}
  <script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": ld })}</script>
</head>
<body>
${header(path, dark)}
  <main id="main">
${body}
  </main>
${footer()}
${SCRIPTS}
</body>
</html>
`;
}

// Shared pieces, also used by site-src/blog.mjs to give the hand-written blog pages the same header, footer and assets.
export const HEAD_ASSETS = `  <link rel="stylesheet" href="/css/site.css?v=${V}">
  <script src="/js/boot.js?v=${V}"></script>`;
export const SCRIPTS = `  <script src="/js/track.js?v=${V}" defer></script>
  <script src="/js/characters.js?v=${V}" defer></script>
  <script src="/js/site.js?v=${V}" defer></script>`;

export function header(path, dark = true) {
  return `  <a class="skip" href="#main">Skip to content</a>
  <header class="site-header${dark ? " is-dark" : ""}">
    <div class="wrap">
      <a class="logo" href="/" aria-label="Pluto Theory home"><img src="/assets/logo.png" alt="Pluto Theory" width="554" height="176"></a>
      ${nav(path)}
      <div class="header-cta">
        <a class="btn btn--primary btn--sm" href="/automations">Explore automations</a>
        <button class="menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav"><span></span><span></span></button>
      </div>
    </div>
  </header>`;
}

export function footer() {
  const autos = PRODUCTS.map((p) => `<a href="/automations/${p.slug}">${p.name}</a>`).join("");
  return `<footer class="site-footer" data-theme="dark">
    <div class="wrap">
      <div class="foot-top">
        <div>
          <h2>Marketing in a click.</h2>
          <p>AI marketing automations on subscription, and a studio team for the work that needs people.</p>
          <a class="btn btn--primary" href="/automations">Explore automations ${I.arrow.replace("<svg", '<svg class="arr"')}</a>
        </div>
        <div class="foot-col"><h4>Automations</h4>${autos}</div>
        <div class="foot-col"><h4>Company</h4><a href="/how-it-works">How it works</a><a href="/pricing">Pricing</a><a href="/demos">Demos</a><a href="/studio">Studio</a><a href="/blog">Blog</a><a href="/about">About</a></div>
        <div class="foot-col"><h4>Help</h4><a href="/support">Support</a><a href="/contact">Contact</a><a href="mailto:${EMAIL}">${EMAIL}</a><a href="/privacy">Privacy</a></div>
      </div>
      <p class="foot-word" aria-hidden="true">pluto theory</p>
      <div class="foot-bot"><span style="display:inline-flex;align-items:center;gap:12px"><span class="pt-mono">PT</span>© <span data-year>2026</span> Pluto Theory. AI marketing automations on subscription.</span><span>Plu &amp; Theo say hi. <a href="#main" class="to-top">Back to top ↑</a></span></div>
    </div>
  </footer>`;
}

export const arrow = I.arrow.replace("<svg", '<svg class="arr"');
export const btn = (href, label, cls = "btn--primary") => `<a class="btn ${cls}" href="${href}">${label} ${arrow}</a>`;
export const link = (href, label) => `<a class="link" href="${href}">${label} ${I.ne}</a>`;

export function faq(items) {
  return `<div class="faq">${items.map(([q, a]) => `<details data-reveal><summary>${q}<i aria-hidden="true"></i></summary><div class="ans">${a.split("\n").map((p) => `<p>${p}</p>`).join("")}</div></details>`).join("")}</div>`;
}

export function productCard(p, i) {
  return `<a class="card${p.feature ? " is-feature" : ""}" href="/automations/${p.slug}" data-goal="${p.goal}" data-reveal style="--d:${i % 4}">
    <div class="card-top"><span class="card-ico">${I[p.icon]}</span>${statusPill(p.status)}</div>
    <span class="num">${String(i + 1).padStart(2, "0")}</span>
    <h3>${p.name}</h3>
    <p>${p.card}</p>
    <span class="link">Explore automation ${I.ne}</span>
  </a>`;
}

export function cta({ h = "Start with the marketing task you want off your list.", p = "Explore the automations, pick a useful starting point, and see it working on a demo before you subscribe.", primary = ["/automations", "Explore automations"], secondary = ["/contact", "Request a demo"] } = {}) {
  return `<section class="section--tight"><div class="wrap">
    <div class="cta" data-reveal="scale" data-theme="dark">
      <div>
        <h2 class="h-lg">${h}</h2>
        <p>${p}</p>
        <div class="ctas">${btn(primary[0], primary[1])}${btn(secondary[0], secondary[1], "btn--ghost")}</div>
      </div>
      <div class="cta-scene"><div class="pt-scene" data-scene="hero" data-variant="clap" role="img" aria-label="Plu and Theo high-five"></div></div>
    </div>
  </div></section>`;
}

export const marquee = (light = false) => {
  const brands = [["kfc.svg", "KFC"], ["zomato-wordmark.png", "Zomato"], ["starbucks.svg", "Starbucks", "sq keep"], ["uber.svg", "Uber"], ["asian-paints.svg", "Asian Paints"], ["snitch.svg", "Snitch"], ["paper-boat.png", "Paper Boat", 1], ["banana-club.png", "Banana Club"], ["emirati-gentleman.webp", "The Emirati Gentleman"], ["business-one.png", "Business One"], ["viskefi.svg", "Viskefi", 1]];
  const li = (hidden) => brands.map(([f, n, sq]) => `<li${sq ? ` class="${sq === 1 ? "sq" : sq}"` : ""}${hidden ? ' aria-hidden="true"' : ""}><img src="/assets/brands/${f}" alt="${hidden ? "" : n}" loading="lazy" decoding="async"></li>`).join("");
  return `<div class="marquee${light ? " light-strip" : ""}"><ul>${li(false)}${li(true)}</ul></div>`;
};

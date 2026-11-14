// Builds team.html from tools/pages/team.mjs, using the site's shared head, header, footer and scripts
// (copied from the AI automation page).   node make-team-page.mjs
import fs from "node:fs";
import path from "node:path";
import { SITE, ORIGIN } from "./build-sitemap.mjs";
import team from "./pages/team.mjs";

const url = `${ORIGIN}/team`;
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const initials = (n) => n.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
const real = team.people.filter((p) => !p.sample);
const hasSamples = team.people.some((p) => p.sample);
let html = fs.readFileSync(path.join(SITE, "ai-automation.html"), "utf8");
const set = (re, value, what) => { if (!re.test(html)) throw new Error(`template has no ${what}`); html = html.replace(re, value); };

set(/<title>[^<]*<\/title>/, `<title>${esc(team.title)}</title>`, "title");
for (const k of ['name="description"', 'property="og:description"', 'name="twitter:description"'])
  set(new RegExp(`(<meta ${k} content=")[^"]*`), `$1${esc(team.description)}`, k);
for (const k of ['property="og:title"', 'name="twitter:title"']) set(new RegExp(`(<meta ${k} content=")[^"]*`), `$1${esc(team.title)}`, k);
set(/(<meta property="og:url" content=")[^"]*/, `$1${url}`, "og:url");
set(/(<link rel="canonical" href=")[^"]*/, `$1${url}`, "canonical");
// Hidden from Google until every placeholder is replaced with a real person
html = html.replace(/\n\s*<meta name="robots" content="[^"]*">/, "");
if (hasSamples) html = html.replace(/(\n\s*<link rel="canonical")/, `\n  <meta name="robots" content="noindex, follow"> <!-- remove placeholders in tools/pages/team.mjs to show this page on Google -->$1`);
// Menu: mark Team as the current page
html = html.replace(' aria-current="page">AI automation</a>', ">AI automation</a>");
if (!/href="\/team"/.test(html)) {
  html = html.replace(/(\n(\s*)<a href="\/gallery">Gallery<\/a>)/, `$1\n$2<a href="/team" aria-current="page">Team</a>`);
  html = html.replace('<a href="/what-we-are">What we are</a><a href="/ai-automation">', '<a href="/what-we-are">What we are</a><a href="/team">Team</a><a href="/ai-automation">');
} else html = html.replace('<a href="/team">Team</a>\n', '<a href="/team" aria-current="page">Team</a>\n');

// Structured data: organisation and website, plus an AboutPage listing the real people only
const m = html.match(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/);
const data = JSON.parse(m[2]);
data["@graph"] = [...data["@graph"].filter((n) => ["ProfessionalService", "WebSite"].includes(n["@type"])),
  { "@type": "AboutPage", "@id": `${url}#webpage`, url, name: team.title, description: team.description, isPartOf: { "@id": `${ORIGIN}/#website` },
    about: { "@id": `${ORIGIN}/#organization` }, inLanguage: "en", breadcrumb: { "@id": `${url}#breadcrumb` },
    ...(real.length ? { mainEntity: real.map((p) => ({ "@type": "Person", name: p.name, jobTitle: p.role, worksFor: { "@id": `${ORIGIN}/#organization` },
      ...(p.photo ? { image: `${ORIGIN}/${p.photo}` } : {}), ...(p.linkedin ? { sameAs: [p.linkedin] } : {}) })) } : {}) },
  { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` }, { "@type": "ListItem", position: 2, name: "Team", item: url }] }
];
html = html.replace(m[0], `${m[1]}\n${JSON.stringify(data, null, 1)}\n  ${m[3]}`);

const card = (p, i) => `          <article class="member reveal${p.sample ? " is-sample" : ""}" data-delay="${i % 4}">
            <div class="member-photo">${p.photo
              ? `<img src="/${esc(p.photo)}" alt="${esc(p.name)}, ${esc(p.role)}" loading="lazy" decoding="async" width="800" height="1000">`
              : `<span class="member-initials" aria-hidden="true">${esc(initials(p.name))}</span>`}</div>
            <div class="member-text">
              <h3>${esc(p.name)}</h3>
              <p class="member-role">${esc(p.role)}</p>
              <p>${esc(p.line)}</p>${p.linkedin ? `\n              <a class="member-link" href="${esc(p.linkedin)}" rel="noopener" target="_blank">LinkedIn ↗</a>` : ""}
            </div>
          </article>`;

const main = `    <section class="page-hero svc-hero team-hero">
      <div class="wrap">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Team</span></nav>
        <p class="eyebrow reveal" style="--accent: var(--purple)">The people</p>
        <h1 class="reveal" data-delay="1">The humans behind Pluto Theory.</h1>
        <p class="sub reveal" data-delay="2">${esc(team.intro)}</p>
      </div>
    </section>

    <section class="section--tight">
      <div class="wrap">
        <div class="team-grid">
${team.people.map(card).join("\n")}
        </div>
      </div>
    </section>

    <section class="section--tight">
      <div class="wrap team-mascots">
        <div class="pt-scene team-mascots-art reveal" data-scene="hero" data-variant="side" data-psay="What if?" data-tsay="Let’s do it." role="img" aria-label="Plu and Theo, the Pluto Theory characters"></div>
        <div class="reveal" data-delay="1">
          <p class="eyebrow">And two misfits</p>
          <h2>Plu and Theo</h2>
          <p>Plu asks “What if?” Theo says “Let’s do it.” Our two characters are how we think: one wild idea, one plan to ship it. You’ll find them around the site, usually arguing.</p>
        </div>
      </div>
    </section>

    <section class="section--tight">
      <div class="wrap">
        <div class="section-head"><h2 class="reveal">How we work together</h2></div>
        <div class="steps">
          <div class="step reveal"><div class="big">01</div><h3>One small team</h3><p>The people on your call are the people doing the work. No hand-offs to a team you never meet.</p></div>
          <div class="step reveal" data-delay="1"><div class="big">02</div><h3>AI and craft, side by side</h3><p>The people who build your automations sit next to the people who design your brand, so both feel like you.</p></div>
          <div class="step reveal" data-delay="2"><div class="big">03</div><h3>Straight answers</h3><p>We tell you what will work, what won't, and what it costs, before we start.</p></div>
        </div>
      </div>
    </section>

    <section class="section band">
      <div class="orbit" aria-hidden="true"></div>
      <div class="orbit orbit-2" aria-hidden="true"></div>
      <div class="wrap">
        <h2 class="reveal">Want to work with us?</h2>
        <p class="reveal" data-delay="1">Tell us what you're building. You'll hear back from one of the people above.</p>
        <div class="ctas reveal" data-delay="2"><a class="btn btn--primary" href="/contact">Start a project <span class="arrow">→</span></a></div>
      </div>
    </section>`;
set(/<main id="main">[\s\S]*<\/main>/, `<main id="main">\n${main}\n  </main>`, "main");
fs.writeFileSync(path.join(SITE, "team.html"), html);
console.log(`wrote team.html: ${team.people.length} people (${real.length} real${hasSamples ? `, ${team.people.length - real.length} placeholders: page hidden from Google` : ""})`);

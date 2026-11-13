// Makes a service page from the AI photoshoot page (same head, header, footer and scripts) with new text,
// structured data and FAQ.   node make-service-page.mjs pages/<slug>.mjs   (writes ../<slug>.html)
// The page file exports { slug, title, description, crumb, serviceName, serviceType, mainHtml, faq: [[q, a], ...] };
// mainHtml has a {{FAQ}} placeholder for the questions. Edit the page file and re-run rather than editing the HTML.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { SITE, ORIGIN } from "./build-sitemap.mjs";

const spec = (await import(pathToFileURL(path.resolve(process.argv[2])).href)).default;
const url = `${ORIGIN}/${spec.slug}`;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const plain = (s) => s.replace(/<[^>]+>/g, "");
let html = fs.readFileSync(path.join(SITE, "ai-photoshoot.html"), "utf8");

const set = (re, value, what) => { if (!re.test(html)) throw new Error(`template has no ${what}`); html = html.replace(re, value); };
set(/<title>[^<]*<\/title>/, `<title>${esc(spec.title)}</title>`, "title");
for (const k of ['name="description"', 'property="og:description"', 'name="twitter:description"'])
  set(new RegExp(`(<meta ${k} content=")[^"]*`), `$1${esc(spec.description)}`, k);
for (const k of ['property="og:title"', 'name="twitter:title"']) set(new RegExp(`(<meta ${k} content=")[^"]*`), `$1${esc(spec.title)}`, k);
set(/(<meta property="og:url" content=")[^"]*/, `$1${url}`, "og:url");
set(/(<link rel="canonical" href=")[^"]*/, `$1${url}`, "canonical");

// Structured data: keep the organisation and website, replace the rest
const m = html.match(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/);
const data = JSON.parse(m[2]);
const keep = data["@graph"].filter((n) => ["ProfessionalService", "WebSite"].includes(n["@type"]));
data["@graph"] = [...keep,
  { "@type": "WebPage", "@id": `${url}#webpage`, url, name: spec.title, description: spec.description, isPartOf: { "@id": `${ORIGIN}/#website` },
    about: { "@id": `${ORIGIN}/#organization` }, inLanguage: "en", primaryImageOfPage: `${ORIGIN}/assets/og-image.png`, breadcrumb: { "@id": `${url}#breadcrumb` } },
  { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` }, { "@type": "ListItem", position: 2, name: spec.crumb, item: url }] },
  { "@type": "Service", "@id": `${url}#service`, name: spec.serviceName, serviceType: spec.serviceType, description: spec.description,
    provider: { "@id": `${ORIGIN}/#organization` }, areaServed: ["India", "Worldwide"], url },
  { "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: spec.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: plain(a) } })) }
];
html = html.replace(m[0], `${m[1]}\n${JSON.stringify(data, null, 1)}\n  ${m[3]}`);

// Page body
const faq = spec.faq.map(([q, a]) => `        <details class="reveal"><summary>${q}</summary><p>${a}</p></details>`).join("\n");
const main = spec.mainHtml.replace("{{FAQ}}", faq);
set(/<main id="main">[\s\S]*<\/main>/, `<main id="main">\n${main}\n  </main>`, "main");
fs.writeFileSync(path.join(SITE, `${spec.slug}.html`), html);
console.log(`wrote ${spec.slug}.html (${spec.title.length}-char title, ${spec.description.length}-char description, ${spec.faq.length} FAQs)`);

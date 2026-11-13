// Tells Bing (and Yandex, Seznam, Naver) right away which pages changed, through IndexNow, so they recrawl
// within hours instead of weeks. ChatGPT search and Copilot answer from Bing's index, so this helps there too.
// GitHub runs it after every push to main; it waits until Vercel is serving the new version first.
//   node indexnow.mjs <changed file> [<changed file> ...]     e.g. node indexnow.mjs index.html blog/new-post.html
//   node indexnow.mjs --all                                    every page in the sitemap
// Google doesn't use IndexNow: it reads sitemap.xml, which Search Console should know about (submit it once there).
import fs from "node:fs";
import path from "node:path";
import { SITE, ORIGIN, pages, isNoindex } from "./build-sitemap.mjs";

const key = fs.readdirSync(SITE).map((f) => f.match(/^([a-f0-9]{32})\.txt$/)).find(Boolean)?.[1];
if (!key) { console.log("No IndexNow key file (<32 hex characters>.txt) in the site folder; nothing sent."); process.exit(0); }

const args = process.argv.slice(2).map((f) => f.replace(/\\/g, "/"));
const indexable = pages().filter((p) => p.file !== "404.html" && !isNoindex(p.html));
const changed = args[0] === "--all" ? indexable : indexable.filter((p) => args.includes(p.file));
if (!changed.length) { console.log("No search-visible page changed; nothing to send."); process.exit(0); }

// Wait for Vercel: every changed page (and the key file) must be live exactly as committed. Up to 10 minutes.
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const live = async (p) => { try { const r = await fetch(`${p.url}?indexnow=${Date.now()}`, { cache: "no-store" }); return r.ok && (await r.text()) === p.html; } catch { return false; } };
const keyLive = async () => { try { const r = await fetch(`${ORIGIN}/${key}.txt`); return r.ok && (await r.text()).trim() === key; } catch { return false; } };
let ready = false;
for (let i = 0; i < 60 && !ready; i++) {
  ready = (await keyLive()) && (await Promise.all(changed.map(live))).every(Boolean);
  if (!ready) await wait(10000);
}
if (!ready) { console.log("The new version isn't live after 10 minutes (did the Vercel deploy fail?). Nothing sent."); process.exit(1); }

const urlList = changed.map((p) => p.url);
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(ORIGIN).host, key, keyLocation: `${ORIGIN}/${key}.txt`, urlList })
});
// 200 = received, 202 = received and the key is still being checked (normal the first time)
console.log(`IndexNow answered ${res.status} for:\n  ${urlList.join("\n  ")}`);
process.exit(res.status === 200 || res.status === 202 ? 0 : 1);

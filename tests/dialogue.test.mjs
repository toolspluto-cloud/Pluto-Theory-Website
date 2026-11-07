// Graph integrity tests for the Chaos Console dialogue (run: node tests/dialogue.test.mjs)
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = fileURLToPath(new URL("..", import.meta.url));
const ctx = { window: {} };
vm.runInNewContext(readFileSync(root + "conversation.js", "utf8"), ctx);
const S = ctx.window.PT_SCENES;
const ACTIONS = new Set(["portfolio", "services", "story", "contact", "branding", "pr", "night", "exit", "restart", "back", "resume"]);
const ROUTES = { portfolio: "work.html", services: "what-we-are.html", story: "what-we-are.html", contact: "contact.html", branding: "what-we-are.html#branding", pr: "what-we-are.html#pluto-times", night: "what-we-are.html#pluto-night" };
let failed = 0;
const check = (ok, msg) => { if (!ok) { failed++; console.error("FAIL:", msg); } };

const ids = Object.keys(S);
check(new Set(ids).size === ids.length, "scene IDs are unique");
check(S.OPENING, "OPENING scene exists");
for (const [id, sc] of Object.entries(S)) {
  check(sc.lines.length > 0, `${id} has lines`);
  check(sc.choices.length >= 1 && sc.choices.length <= 6, `${id} has 1 to 6 choices (has ${sc.choices.length})`);
  check(sc.lines.length <= 7, `${id} stays short (${sc.lines.length} lines)`);
  check(new Set(sc.choices.map((c) => c[0])).size === sc.choices.length, `${id} has no duplicate buttons`);
  sc.lines.forEach((l, k) => {
    check(l.s === "P" || l.s === "T", `${id}#${k} has a known speaker`);
    check(typeof l.t === "string" && l.t.trim().length > 0, `${id}#${k} has text`);
  });
  sc.choices.forEach(([label, to]) => {
    check(label && label.trim(), `${id} choice has a label`);
    if (to.startsWith("ACTION:")) check(ACTIONS.has(to.slice(7)), `${id} → ${to} is a known action`);
    else check(S[to], `${id} → ${to} points at a real scene`);
  });
}
// Every route action resolves to a page that exists
for (const [a, target] of Object.entries(ROUTES)) {
  const [file, hash] = target.split("#");
  let html = "";
  try { html = readFileSync(root + file, "utf8"); } catch { check(false, `route ${a} → ${file} exists`); }
  if (hash) check(html.includes(`id="${hash}"`), `route ${a} → #${hash} exists on ${file}`);
}
// The engine's routes match the ones tested here
const engine = readFileSync(root + "characters.js", "utf8");
for (const [a, target] of Object.entries(ROUTES)) check(engine.includes(`${a}: "/${target.replace(".html", "").replace(/^index$/, "")}"`) || engine.includes(`${a}: "/${target.replace(".html", "")}"`), `engine route ${a} → /${target.replace(".html", "")}`);
// Every scene can be reached from OPENING (easter eggs and the welcome-back scene are entered by events)
const seen = new Set(["OPENING"]), queue = ["OPENING"];
while (queue.length) for (const [, to] of S[queue.shift()].choices) if (!to.startsWith("ACTION:") && !seen.has(to)) { seen.add(to); queue.push(to); }
const unreachable = ids.filter((id) => !seen.has(id) && !["POKE_PLUTO", "POKE_THEORY", "WELCOME_BACK"].includes(id));
check(unreachable.length === 0, `all scenes reachable from OPENING (unreachable: ${unreachable.join(", ")})`);
// From every scene the visitor can reach an exit or a real page without finishing the conversation
const canLeave = (start) => {
  const v = new Set([start]), q = [start];
  while (q.length) for (const [, to] of S[q.shift()].choices) { if (to.startsWith("ACTION:")) return true; if (!v.has(to)) { v.add(to); q.push(to); } }
  return false;
};
for (const id of ids) check(canLeave(id), `${id} can reach an exit or a real page`);
// Opening matches the conversation script (section 01)
check(S.OPENING.choices.map((c) => c[0]).join("|") === "I need branding|PR & publicity|Join Pluto World|Just your handsome faces|Just scrolling|I've got a story", "OPENING shows the six script choices in order");
check(S.OPENING.lines.map((l) => l.s).join("") === "TPTPTPT", "OPENING alternates Theo / Plu as scripted");
check(S.OPENING.lines[0].t === "Psst. Plu. Wake up. Someone's here.", "Theo whispers first");

const lines = ids.reduce((n, id) => n + S[id].lines.length, 0);
console.log(`${ids.length} scenes, ${lines} lines checked. ${failed ? failed + " failures" : "All tests passed."}`);
process.exit(failed ? 1 : 0);

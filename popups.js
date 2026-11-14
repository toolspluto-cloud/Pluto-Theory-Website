// Pluto Theory: section 08 "random pop-ups" from the conversation script. Plu and Theo drop a few short
// lines in a small card at the bottom-left of any page. They're text only (no voices), so they never talk
// over someone reading. Limits: one per page, three per visit, a minute apart, each moment once per visit,
// never while the menu is open or someone is typing in a form. Always dismissible.
(() => {
  const P = (t) => ({ s: "P", t }), T = (t) => ({ s: "T", t });
  const LINES = {
    scroll: [P("Theo! They're still here!"), T("Yes. That's how websites work."), P("Do you think they like us?"), T("They haven't blocked us yet.")],
    secondPage: [T("Psst. You're following us."), P("DON'T SAY THAT! They're exploring!"), T("Sure. Very casually. On our second page.")],
    idle: [P("Hello? Did we lose you?"), T("Maybe they're thinking."), P("About us?"), T("About closing this popup, probably.")],
    returns: [P("YOU'RE BACK!"), T("Act normal. Don't make it awkward."), P("I MISSED YOU!"), T("And there goes normal.")]
  };
  const NAMES = { P: "Plu", T: "Theo" };
  const PER_VISIT = 3, GAP_MS = 60000;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const get = (store, k) => { try { return store.getItem(k); } catch (_) { return null; } };
  const set = (store, k, v) => { try { store.setItem(k, v); } catch (_) {} };
  const S = window.sessionStorage, L = window.localStorage;

  let box = null, timers = [], shownHere = false;
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  function allowed(force) {
    if (box || document.hidden) return false;
    const a = document.activeElement;
    if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return false;
    if (document.body.classList.contains("menu-open")) return false;
    if (force) return true;
    if (shownHere || +(get(S, "pt-pop-count") || 0) >= PER_VISIT) return false;
    if (Date.now() - +(get(S, "pt-pop-last") || 0) < GAP_MS) return false;
    return true;
  }

  function hide() {
    if (!box) return;
    timers.forEach(clearTimeout); timers = [];
    const b = box; box = null;
    b.classList.add("is-out");
    setTimeout(() => b.remove(), reduced ? 0 : 300);
  }

  function show(kind, { force = false } = {}) {
    if (!LINES[kind] || get(S, `pt-pop-${kind}`) || !allowed(force)) return false;
    set(S, `pt-pop-${kind}`, "1");
    if (!force) { shownHere = true; set(S, "pt-pop-count", +(get(S, "pt-pop-count") || 0) + 1); set(S, "pt-pop-last", Date.now()); }
    box = document.createElement("aside");
    box.className = "pt-pop";
    box.setAttribute("role", "status");
    box.setAttribute("aria-label", "Plu and Theo");
    box.innerHTML = '<button class="pt-pop-x" type="button" aria-label="Dismiss Plu and Theo">✕</button><div class="pt-pop-lines"></div>';
    box.querySelector(".pt-pop-x").addEventListener("click", hide);
    const list = box.querySelector(".pt-pop-lines");
    document.body.appendChild(box);
    let wait = 0;
    // Every line is placed at once, hidden, so the pop-up is its full height from the start and the ✕ never
    // moves (it sits at the bottom of the screen, so growing would push the ✕ up, away from the pointer).
    const lines = LINES[kind];
    const rows = lines.map(({ s, t }) => {
      const row = document.createElement("p");
      row.className = `pt-pop-line is-${s} is-wait`;
      row.innerHTML = `<span class="av" aria-hidden="true">${s}</span><span><b>${NAMES[s]}</b></span>`;
      row.lastChild.append(document.createTextNode(t));
      list.appendChild(row);
      return row;
    });
    const reveal = (row) => row.classList.remove("is-wait");
    lines.forEach((line, i) => {
      if (reduced || i === 0) reveal(rows[i]); else later(() => reveal(rows[i]), wait);
      wait += 1300 + line.t.length * 30;
    });
    later(hide, (reduced ? 0 : wait) + 5000);
    // Hovering shows the rest at once and keeps it open; moving away gives a few more seconds
    box.addEventListener("pointerenter", () => {
      timers.forEach(clearTimeout); timers = [];
      rows.forEach(reveal);
    });
    box.addEventListener("pointerleave", () => later(hide, 4000));
    return true;
  }
  addEventListener("keydown", (e) => { if (e.key === "Escape") hide(); });

  // ---- when they show ----
  const now = Date.now();
  const firstLoadThisVisit = !get(S, "pt-visit");
  set(S, "pt-visit", "1");
  // A visitor coming back after a while (6+ hours since their last visit)
  const lastVisit = +(get(L, "pt-last-visit") || 0);
  set(L, "pt-last-visit", now);
  if (firstLoadThisVisit && lastVisit && now - lastVisit > 6 * 3600 * 1000) later(() => show("returns"), 5000);
  // Their second page this visit
  const pages = JSON.parse(get(S, "pt-pages") || "[]");
  if (!pages.includes(location.pathname)) {
    pages.push(location.pathname);
    set(S, "pt-pages", JSON.stringify(pages));
    if (pages.length === 2) later(() => show("secondPage"), 6000);
  }
  // After scrolling a little: a third of the page, 20+ seconds in
  const tryScroll = () => {
    const depth = (scrollY + innerHeight) / document.documentElement.scrollHeight;
    if (depth > 0.35 && Date.now() - now > 20000 && show("scroll")) removeEventListener("scroll", tryScroll);
  };
  addEventListener("scroll", tryScroll, { passive: true });
  // Inactive for 45 seconds
  let idle;
  const resetIdle = () => { clearTimeout(idle); idle = setTimeout(() => show("idle"), 45000); };
  ["pointermove", "pointerdown", "keydown", "scroll", "touchstart"].forEach((t) => addEventListener(t, resetIdle, { passive: true }));
  resetIdle();
})();

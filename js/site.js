// Pluto Theory: motion and interactions. No dependencies.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  let reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Testing switch: add ?motion=full to a URL to see every animation even with reduced motion on.
  if (new URLSearchParams(location.search).get("motion") === "full") {
    reduce = false;
    for (const sh of document.styleSheets) { try { for (let i = sh.cssRules.length - 1; i >= 0; i--) if (sh.cssRules[i].conditionText?.includes("reduced-motion")) sh.deleteRule(i); } catch {} }
  }
  const fine = matchMedia("(pointer: fine)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- Header: scrolled state + colour that matches the section under it ---------- */
  const header = $(".site-header");
  const darkSections = $$('[data-theme="dark"]');
  const startsDark = header.classList.contains("is-dark");
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    header.classList.toggle("is-scrolled", scrollY > 12);
    const y = header.offsetHeight / 2;
    const overDark = darkSections.some((s) => { const r = s.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
    header.classList.toggle("is-dark", scrollY < 12 ? startsDark || overDark : overDark);
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- Menu + mega menu ---------- */
  const menuBtn = $(".menu-btn");
  menuBtn?.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  const drop = $(".nav-drop");
  if (drop) {
    const btn = $("button", drop);
    const set = (v) => { drop.classList.toggle("is-open", v); btn.setAttribute("aria-expanded", v); };
    btn.addEventListener("click", () => set(!drop.classList.contains("is-open")));
    if (fine) {
      let t;
      drop.addEventListener("pointerenter", () => { clearTimeout(t); set(true); });
      drop.addEventListener("pointerleave", () => { t = setTimeout(() => set(false), 180); });
    }
    document.addEventListener("click", (e) => { if (!drop.contains(e.target)) set(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { set(false); document.body.classList.remove("menu-open"); } });
  }

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
  $$("[data-reveal], [data-in]").forEach((el) => io.observe(el));

  /* ---------- Count up ---------- */
  const countIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      countIO.unobserve(e.target);
      const el = e.target, to = +el.dataset.count, t0 = performance.now(), dur = 1600;
      const step = (t) => { const k = Math.min(1, (t - t0) / dur); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 4))); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }
  }, { threshold: 0.5 });
  $$("[data-count]").forEach((el) => countIO.observe(el));

  /* ---------- Typing ---------- */
  const typeIO = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { typeIO.unobserve(e.target); type(e.target); }
  }, { threshold: 0.4 });
  $$("[data-type]").forEach((el) => typeIO.observe(el));
  async function type(el) {
    const lines = el.dataset.type.split("|"), loop = el.hasAttribute("data-loop");
    let i = 0;
    do {
      const text = lines[i % lines.length];
      for (let c = 1; c <= text.length; c++) { el.textContent = text.slice(0, c); await wait(text[c - 1] === " " ? 30 : 22 + Math.random() * 40); }
      if (!loop) break;
      await wait(1800);
      for (let c = text.length; c >= 0; c--) { el.textContent = text.slice(0, c); await wait(14); }
      await wait(300);
      i++;
    } while (true);
  }

  /* ---------- Spotlight on cards and buttons ---------- */
  if (fine) {
    document.addEventListener("pointermove", (e) => {
      const el = e.target.closest?.(".card, .btn");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    }, { passive: true });
  }

  /* ---------- Catalogue filter tabs ---------- */
  $$("[data-tabs]").forEach((root) => {
    const tabs = $$(".tab", root), glider = $(".tab-glider", root), cards = $$(".card", root);
    const move = (t) => { glider.style.left = t.offsetLeft + "px"; glider.style.width = t.offsetWidth + "px"; };
    tabs.forEach((t) => t.addEventListener("click", () => {
      tabs.forEach((x) => x.setAttribute("aria-selected", x === t));
      move(t);
      const f = t.dataset.filter;
      cards.forEach((c) => c.classList.toggle("is-dim", f !== "all" && c.dataset.goal !== f));
    }));
    const init = () => move(tabs.find((t) => t.getAttribute("aria-selected") === "true"));
    init(); addEventListener("resize", init); document.fonts?.ready.then(init);
  });

  /* ---------- Scattered notes snap into a queue as you scroll ---------- */
  const scrubs = $$("[data-scrub]");
  if (scrubs.length) {
    const upd = () => {
      for (const el of scrubs) {
        const r = el.getBoundingClientRect();
        const p = reduce ? 1 : Math.min(1, Math.max(0, (innerHeight * 0.92 - r.top) / (innerHeight * 0.6)));
        el.style.setProperty("--p", p.toFixed(3));
        el.classList.toggle("is-sorted", p > 0.97);
      }
    };
    addEventListener("scroll", () => requestAnimationFrame(upd), { passive: true });
    upd();
  }

  /* ---------- Sticky story: steps drive the app panel ---------- */
  $$("[data-story]").forEach((root) => {
    const steps = $$(".story-step", root), panel = $("[data-panel]", root);
    const views = $$(".view", panel), side = $$("[data-side]", panel);
    const activate = (i) => {
      steps.forEach((s, k) => s.classList.toggle("is-active", k === i));
      panel.dataset.step = i;
      views.forEach((v, k) => v.classList.toggle("is-on", k === i));
      side.forEach((a, k) => a.classList.toggle("on", k === i));
    };
    const stepIO = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) activate(+e.target.dataset.step);
    }, { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach((s) => stepIO.observe(s));
    // phone layout: each step has its own small panel
    const mIO = new IntersectionObserver((entries) => {
      for (const e of entries) $(".view", e.target).classList.toggle("is-on", e.isIntersecting);
    }, { threshold: 0.35 });
    $$(".panel-m", root).forEach((m) => mIO.observe(m));
  });

  /* ---------- Hero workspace: a cursor approves the next item, forever ---------- */
  const ws = $("[data-workspace]");
  if (ws) {
    const feed = $(".ws-feed", ws), cursor = $(".ghost-cursor", ws), tpl = $("#ws-queue");
    const queue = tpl ? [...tpl.content.children] : [];
    const stat = (k) => $(`[data-stat="${k}"]`, ws);
    const bump = (k, d) => { const el = stat(k); el.textContent = +el.textContent + d; el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); };
    let qi = 0, visible = true, running = false;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !running) loop(); }).observe(ws);
    document.addEventListener("visibilitychange", () => { if (!document.hidden && visible && !running) loop(); });

    const place = (x, y) => { cursor.style.transform = `translate(${x}px, ${y}px)`; cursor.style.setProperty("--t", `translate(${x}px, ${y}px)`); };
    place(ws.offsetWidth * 0.62, ws.offsetHeight + 10);

    async function loop() {
      running = true;
      await wait(1400);
      while (visible && !document.hidden) {
        const item = $(".ws-item", feed), b = item && $(".ws-btn", item);
        if (!b) break;
        const wr = ws.getBoundingClientRect(), br = b.getBoundingClientRect();
        const x = br.left - wr.left + br.width * 0.55, y = br.top - wr.top + br.height * 0.6;
        item.classList.add("is-focus");
        place(x, y);
        await wait(1150);
        cursor.classList.remove("is-click"); void cursor.offsetWidth; cursor.classList.add("is-click");
        b.classList.add("is-press");
        const rp = document.createElement("span"); rp.className = "ripple"; rp.style.left = x + "px"; rp.style.top = y + "px"; ws.appendChild(rp); setTimeout(() => rp.remove(), 800);
        await wait(260);
        b.outerHTML = `<span class="st st--done">Completed</span>`;
        item.classList.remove("is-focus"); item.classList.add("is-done");
        bump("review", -1); bump("done", 1);
        place(ws.offsetWidth * 0.78, ws.offsetHeight * 0.92);
        await wait(1700);
        // retire the oldest item and bring in the next one
        const items = $$(".ws-item", feed);
        if (items.length >= 3) { const last = items[items.length - 1]; last.style.opacity = "0"; last.style.transform = "translateY(10px) scale(.97)"; await wait(380); last.remove(); }
        const next = queue[qi++ % queue.length].cloneNode(true);
        next.classList.add("is-enter");
        feed.prepend(next);
        bump("review", 1);
        if (Math.random() > 0.5) bump("run", Math.random() > 0.5 ? 1 : -1);
        await wait(1500);
      }
      running = false;
    }

    // gentle 3D tilt toward the pointer
    if (fine && !reduce) {
      const stage = ws.closest(".hero") || document;
      stage.addEventListener("pointermove", (e) => {
        const r = ws.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / innerWidth, dy = (e.clientY - (r.top + r.height / 2)) / innerHeight;
        ws.style.setProperty("--ry", `${dx * 3}deg`); ws.style.setProperty("--rx", `${-dy * 2.5}deg`);
      }, { passive: true });
    }
  }

  /* ---------- Star field (hero) ---------- */
  const cv = $("[data-stars]");
  if (cv && !reduce) {
    const ctx = cv.getContext("2d");
    let w, h, stars = [], mx = 0, my = 0, on = true;
    const size = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      w = cv.offsetWidth; h = cv.offsetHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: Math.round((w * h) / 9000) }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.3 + 0.2, z: Math.random() * 0.8 + 0.2, t: Math.random() * 6.28, s: 0.6 + Math.random() * 1.6 }));
    };
    size(); addEventListener("resize", size);
    addEventListener("pointermove", (e) => { mx = (e.clientX / innerWidth - 0.5) * 2; my = (e.clientY / innerHeight - 0.5) * 2; }, { passive: true });
    new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on) requestAnimationFrame(draw); }).observe(cv);
    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const a = 0.35 + 0.65 * Math.abs(Math.sin(s.t + (t / 1000) * s.s * 0.6));
        ctx.globalAlpha = a * s.z;
        ctx.fillStyle = s.z > 0.85 ? "#E3C8FF" : "#fff";
        ctx.beginPath(); ctx.arc(s.x - mx * 14 * s.z, s.y - my * 10 * s.z - scrollY * 0.15 * s.z, s.r, 0, 6.283); ctx.fill();
      }
      if (on) requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  /* ---------- Contact form ---------- */
  const form = $("[data-form]");
  if (form) {
    const want = new URLSearchParams(location.search).get("interest");
    if (want) want.split(",").forEach((slug) => { const box = $(`[data-slug="${slug}"]`, form); if (box) box.checked = true; });
    const requested = (want || "").replace(/[^a-z0-9,-]/gi, "").slice(0, 80); // which button brought them here
    const track = (name, details) => window.ptTrack && window.ptTrack(name, details);
    form.noValidate = true; // our own messages below; the browser's checks stay on if this script doesn't run
    const msg = $(".form-msg", form);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      msg.className = "form-msg";
      const bad = $$("[required]", form).find((f) => !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value)));
      if (bad) { msg.textContent = bad.type === "email" ? "Please check your email address." : "Please add your name and email."; msg.classList.add("err"); bad.focus(); return; }
      const data = Object.fromEntries(new FormData(form));
      data.interest = $$("[name=interest]:checked", form).map((c) => c.value).join(", ") || "Not specified";
      data.access_key = form.dataset.accessKey;
      if (requested) data.requested = requested;
      data.lead_id = crypto.randomUUID ? crypto.randomUUID() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16));
      Object.assign(data, window.ptVisit ? window.ptVisit() : {}); // campaign, landing page and referring site (js/track.js)
      const btn = $("button[type=submit]", form); btn.disabled = true; btn.style.opacity = ".6";
      try {
        const res = await fetch(form.dataset.endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        track("generate_lead", { lead_id: data.lead_id, interest: data.interest, requested: requested || "none", page_path: location.pathname });
        form.reset();
        msg.textContent = "Thanks! We'll reply within one working day."; msg.classList.add("ok");
      } catch {
        track("form_error", { page_path: location.pathname });
        msg.innerHTML = `That didn't send. Please email us at <a href="mailto:info@plutotheory.com">info@plutotheory.com</a>.`; msg.classList.add("err");
      } finally { btn.disabled = false; btn.style.opacity = ""; }
    });
  }

  /* ---------- Misc ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const id = a.getAttribute("href").slice(1), t = id && document.getElementById(id);
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    document.body.classList.remove("menu-open");
  }));
})();

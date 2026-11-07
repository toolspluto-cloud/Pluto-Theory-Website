// Pluto Theory — shared behaviour
(() => {
  const body = document.body;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Page curtain: lift on load, drop before internal navigation
  requestAnimationFrame(() => requestAnimationFrame(() => body.classList.add("is-loaded")));
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) body.classList.remove("is-leaving");
  });
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a || reduced || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
    const url = new URL(a.href, location.href);
    const samePage = url.pathname === location.pathname;
    if (url.origin !== location.origin || samePage || a.hasAttribute("download")) return;
    e.preventDefault();
    body.classList.add("is-leaving");
    setTimeout(() => (location.href = a.href), 650);
  });

  // Header state
  const header = document.querySelector(".site-header");
  const onScroll = () => header && header.classList.toggle("is-scrolled", scrollY > 20);
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  const toggle = document.querySelector(".menu-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open);
    });
    document.querySelectorAll(".nav a").forEach((a) =>
      a.addEventListener("click", () => body.classList.remove("menu-open"))
    );
  }

  // Scroll reveal
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
    }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // Pillar word rotator in the hero
  const rot = document.querySelector(".rotator");
  if (rot) {
    const words = [...rot.children];
    let i = 0;
    words[0].classList.add("is-in");
    if (!reduced) {
      setInterval(() => {
        const cur = words[i];
        i = (i + 1) % words.length;
        const next = words[i];
        cur.classList.replace("is-in", "is-out");
        next.classList.remove("is-out");
        next.classList.add("is-in");
        setTimeout(() => cur.classList.remove("is-out"), 650);
      }, 2000);
    }
  }

  // Back to top
  document.querySelectorAll(".to-top").forEach((b) =>
    b.addEventListener("click", () => scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }))
  );

  // Contact form: preselect a service from ?pillar= (visitors can then tick more) and show the success line
  const form = document.querySelector(".form");
  if (form) {
    const pillar = new URLSearchParams(location.search).get("pillar");
    const match = pillar && form.querySelector(`input[name="services"][value="${CSS.escape(pillar)}"]`);
    if (match) match.checked = true;
    try {
      const idea = sessionStorage.getItem("pt-idea");
      const msg = form.querySelector("textarea");
      if (idea && msg && !msg.value) msg.value = `My idea: ${idea}`;
    } catch (_) {}

    // Messages are emailed through Web3Forms (web3forms.com) to plutotheory.pt@gmail.com. The access key in the
    // form's data-access-key decides where they go; it's safe to be public (it can only send to that inbox).
    const errorEl = form.querySelector(".form-error");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (form.classList.contains("is-sending")) return;
      if (!form.reportValidity()) return; // name, a real email and a phone number are required
      const data = Object.fromEntries(new FormData(form));
      const services = [...form.querySelectorAll('input[name="services"]:checked')].map((i) => i.value).join(", ");
      if (data.botcheck) return; // ticked by a spam bot, not a person
      errorEl.hidden = true;
      form.classList.add("is-sending");
      try {
        const res = await fetch(form.dataset.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: form.dataset.accessKey,
            subject: `New project enquiry from ${data.name}`,
            from_name: "Pluto Theory website",
            name: data.name, email: data.email, phone: data.phone, company: data.company || "-", services: services || "-", message: data.message || "-",
            botcheck: false
          })
        });
        const out = await res.json().catch(() => ({}));
        if (!res.ok || out.success !== true) throw new Error(out.message || res.status);
      } catch (_) {
        window.ptTrack?.("contact_form_error");
        form.classList.remove("is-sending");
        errorEl.innerHTML = 'That didn’t send. Please try again, or email us at <a href="mailto:plutotheory.pt@gmail.com">plutotheory.pt@gmail.com</a>.';
        errorEl.hidden = false;
        return;
      }
      form.classList.remove("is-sending");
      window.ptTrack?.("generate_lead", { services: services || "not chosen" });
      const r = form.querySelector('[type="submit"]').getBoundingClientRect();
      if (window.ptConfetti) window.ptConfetti(r.left + r.width / 2, r.top + r.height / 2, 30);
      if (window.ptSound) window.ptSound("jingle");
      form.classList.add("is-sent");
      form.querySelector(".success").focus();
    });
  }

  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();

// Pluto Theory: motion and play
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  const COLORS = ["#46C750", "#8830D6", "#FF8A00", "#0B0B0F"];
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  // Confetti burst in brand colours
  const sfx = (name) => window.ptSound && window.ptSound(name);

  function confetti(x, y, n = 22) {
    sfx("sparkle");
    for (let i = 0; i < n; i++) {
      const el = document.createElement("i");
      const size = 6 + Math.random() * 8;
      el.className = "confetti";
      el.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${COLORS[i % 4]};border-radius:${Math.random() < 0.5 ? "50%" : "2px"}`;
      document.body.appendChild(el);
      const a = Math.random() * Math.PI * 2, v = 70 + Math.random() * 150;
      const dx = Math.cos(a) * v, dy = Math.sin(a) * v - 90;
      el.animate(
        [
          { transform: "translate(-50%, -50%) rotate(0deg)", opacity: 1 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy + 170}px)) rotate(${Math.random() * 720 - 360}deg)`, opacity: 0 }
        ],
        { duration: 900 + Math.random() * 600, easing: "cubic-bezier(.2,.7,.4,1)" }
      ).onfinish = () => el.remove();
    }
  }
  window.ptConfetti = confetti;

  // Split text into bouncy letters
  document.querySelectorAll("[data-split]").forEach((el) => {
    let idx = 0;
    // Screen readers get the plain sentence from a hidden copy (aria-label isn't allowed on a <p>)
    const plain = el.textContent.replace(/\s+/g, " ").trim();
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 1) return walk(n);
        if (n.nodeType !== 3) return;
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((word) => {
          if (!word) return;
          if (/^\s+$/.test(word)) return frag.append(document.createTextNode(" "));
          const w = document.createElement("span");
          w.className = "word";
          w.setAttribute("aria-hidden", "true");
          [...word].forEach((ch) => {
            const c = document.createElement("span");
            c.className = "ch";
            c.textContent = ch;
            c.style.setProperty("--i", idx++);
            c.style.setProperty("--r", `${(Math.random() * 36 - 18).toFixed(1)}deg`);
            c.style.setProperty("--y", `${(Math.random() * 20 - 10).toFixed(1)}px`);
            w.append(c);
          });
          frag.append(w);
        });
        n.replaceWith(frag);
      });
    };
    walk(el);
    const sr = document.createElement("span");
    sr.className = "sr";
    sr.textContent = plain;
    el.prepend(sr);
    el.classList.add("is-split");
  });

  // Scroll progress bar + parallax
  const bar = document.createElement("div");
  bar.className = "progress";
  document.body.appendChild(bar);
  const floaters = [...document.querySelectorAll("[data-parallax]")];
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    if (reduced) return;
    floaters.forEach((f) => (f.style.transform = `translateY(${scrollY * parseFloat(f.dataset.parallax)}px)`));
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  if (fine) {
    // Custom cursor ring that follows with a little lag
    const ring = document.createElement("div");
    ring.className = "cursor";
    ring.innerHTML = "<span>boop</span>";
    document.body.appendChild(ring);
    let x = -100, y = -100, cx = x, cy = y;
    addEventListener("pointermove", (e) => {
      x = e.clientX; y = e.clientY;
      const t = e.target.closest("a, button, input, textarea, label, [data-who], .flip");
      ring.classList.toggle("is-hover", !!t);
      ring.classList.toggle("is-boop", !!(t && t.matches("[data-who]")));
    }, { passive: true });
    addEventListener("pointerdown", () => ring.classList.add("is-down"));
    addEventListener("pointerup", () => ring.classList.remove("is-down"));
    document.addEventListener("mouseleave", () => (x = y = -100));
    (function loop() {
      cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;
      ring.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    })();

    // Magnetic buttons
    document.querySelectorAll(".btn, .moods button").forEach((b) => {
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      });
      b.addEventListener("pointerleave", () => (b.style.transform = ""));
    });

    // 3D tilt on cards
    document.querySelectorAll(".pillar, .misfit, .flip, .night-step, .sbl-card").forEach((c) => {
      c.classList.add("tilt");
      c.addEventListener("pointermove", (e) => {
        const r = c.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        c.style.transform = `perspective(900px) rotateX(${-py * 8}deg) rotateY(${px * 10}deg) translateY(-4px)`;
      });
      c.addEventListener("pointerleave", () => (c.style.transform = ""));
    });
  }

  // Flip cards also flip on tap
  document.querySelectorAll(".flip").forEach((f) => f.addEventListener("click", () => f.classList.toggle("is-flipped")));

  // Poke the hero characters: new mood, new line, confetti
  const hero = document.querySelector('.pt-scene[data-scene="hero"]');
  if (hero && window.PT) {
    const LINES = {
      P: [["skeptical", "Hmm. Why?"], ["shocked", "Wait, really?"], ["happy", "Ooh. Yes."], ["love", "I love this."], ["wink", "Got it."], ["thinking", "What if?"]],
      T: [["laugh", "Ha! Ship it."], ["cool", "Already on it."], ["determined", "Bigger. Bolder."], ["love", "Weird. Love it."], ["excited", "Let’s do it!"]]
    };
    const step = { P: 0, T: 0 };
    let timer;
    hero.addEventListener("click", (e) => {
      const fig = e.target.closest("[data-who]");
      if (!fig) return;
      const who = fig.dataset.who;
      const [mood, line] = LINES[who][step[who]++ % LINES[who].length];
      hero.dataset[who === "P" ? "pmood" : "tmood"] = mood;
      hero.dataset[who === "P" ? "psay" : "tsay"] = line;
      window.PT.render(hero);
      hero.classList.remove("say-P", "say-T");
      void hero.offsetWidth;
      hero.classList.add(`say-${who}`);
      const g = hero.querySelector(`[data-who="${who}"] .pt-fig`);
      if (g) g.classList.add("is-boing");
      sfx("boing");
      setTimeout(() => sfx(mood), 180);
      confetti(e.clientX, e.clientY, 16);
      document.querySelector(".poke")?.classList.add("is-gone");
      clearTimeout(timer);
      timer = setTimeout(() => hero.classList.remove("say-P", "say-T"), 2600);
    });
  }

  // Journey: each step plays a little scene between Plu and Theo. Auto-plays quietly until tapped.
  const journey = document.querySelector(".journey");
  if (journey) {
    const steps = [...journey.querySelectorAll("li")];
    const scene = journey.querySelector(".journey-scene");
    const talk = { P: journey.querySelector(".jt.is-P"), B: journey.querySelector(".jt.is-B"), T: journey.querySelector(".jt.is-T") };
    const playAll = journey.querySelector(".journey-play");
    // B = the client's brand. Each step: three short lines and a sound for each.
    const BEATS = {
      meet: [["B", "Hi… nobody notices us.", "pop"], ["P", "Come in! Tell us everything.", "happy"], ["T", "Start with what makes you, you.", "thinking"]],
      friction: [["P", "Bold colours! Big launch!", "excited"], ["T", "Clear message first.", "skeptical"], ["B", "Can we have both?", "pop"]],
      spark: [["T", "Wait. That’s it.", "wink"], ["P", "THAT’S THE IDEA!", "sparkle"], ["B", "Ooh. That feels like us.", "happy"]],
      build: [["P", "Colours, voice, characters…", "determined"], ["T", "…and a system that holds up.", "tick"], ["B", "I’m becoming… me?", "love"]],
      ship: [["T", "Campaign is live.", "whoosh"], ["P", "People are looking!", "excited"], ["B", "They’re talking about us!", "sparkle"]],
      bond: [["B", "We’ve never felt more like ourselves.", "love"], ["P", "Happy brand!", "happy"], ["T", "And it keeps growing.", "wink"]]
    };
    let idx = -1, timer = null, auto = true, hold = 0;
    const lineTimers = [];
    function show(k, withSound) {
      idx = k;
      const key = steps[k].querySelector(".j-btn").dataset.step;
      steps.forEach((s, n) => { s.classList.toggle("is-on", n <= k); s.classList.toggle("is-now", n === k); });
      journey.style.setProperty("--p", (k / (steps.length - 1)) * 100);
      scene.dataset.step = key;
      if (window.PT) window.PT.render(scene);
      lineTimers.splice(0).forEach(clearTimeout);
      Object.values(talk).forEach((el) => { el.textContent = ""; el.classList.remove("is-in"); });
      BEATS[key].forEach(([who, text, sound], n) => lineTimers.push(setTimeout(() => {
        talk[who].textContent = text;
        talk[who].classList.add("is-in");
        if (withSound) sfx(sound);
      }, 350 + n * 1000)));
    }
    const tick = () => {
      if (hold > 0) { hold--; return; }
      const next = (idx + 1) % steps.length;
      show(next, false);
      if (next === steps.length - 1) hold = 1;
    };
    const start = () => { if (!timer) { tick(); timer = setInterval(tick, 4300); } };
    const stop = () => { clearInterval(timer); timer = null; };
    steps.forEach((s, k) => s.querySelector(".j-btn").addEventListener("click", () => {
      auto = false; stop();
      playAll.hidden = false;
      show(k, true);
    }));
    playAll.addEventListener("click", () => { auto = true; playAll.hidden = true; idx = -1; hold = 0; sfx("pop"); stop(); start(); });
    new IntersectionObserver((entries) => {
      const on = entries.some((e) => e.isIntersecting);
      if (on && auto) start();
      if (!on) stop();
    }, { threshold: 0.3 }).observe(journey);
  }

  // Idea lab: pitch it to P. and T.
  const lab = document.querySelector(".lab");
  if (lab && window.PT) {
    const QUESTIONS = [
      "Who is it really for?",
      "What would make someone tell a friend?",
      "What is the one line people should remember?",
      "Why now, and why you?",
      "What is the weird version of this?",
      "What happens if it works too well?"
    ];
    const ANSWERS = [
      "Let’s prototype it before lunch.",
      "Make it loud. Make it useful. Ship it.",
      "I’m already sketching the launch.",
      "Weird enough to notice. Serious enough to work.",
      "Let’s do it! I’ll bring the confetti."
    ];
    const form = lab.querySelector(".lab-form");
    const input = form.querySelector("input");
    const btn = form.querySelector("button");
    const [pFace, tFace] = lab.querySelectorAll(".lab-face");
    const [pSay, tSay] = lab.querySelectorAll(".lab-bubble");
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const type = async (el, text) => {
      el.classList.add("is-typing");
      el.textContent = "";
      let n = 0;
      for (const ch of text) { el.textContent += ch; if (n++ % 2 === 0 && ch !== " ") sfx("tick"); await wait(22); }
      el.classList.remove("is-typing");
    };
    const mood = (face, m) => { face.dataset.mood = m; window.PT.render(face); };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const idea = input.value.trim();
      if (!idea) return;
      try { sessionStorage.setItem("pt-idea", idea); } catch (_) {}
      btn.disabled = true;
      lab.classList.remove("is-done");
      const short = idea.length > 42 ? `${idea.slice(0, 40)}…` : /[.!?…]$/.test(idea) ? idea : `${idea}.`;
      mood(pFace, "thinking"); mood(tFace, "neutral");
      sfx("thinking");
      await type(pSay, `“${short}” Okay. ${pick(QUESTIONS)}`);
      await wait(350);
      mood(tFace, "excited");
      sfx("excited");
      await type(tSay, pick(ANSWERS));
      mood(pFace, "happy");
      lab.classList.add("is-done");
      sfx("jingle");
      const r = tFace.getBoundingClientRect();
      confetti(r.left + r.width / 2, r.top + r.height / 3, 26);
      btn.disabled = false;
    });
  }
})();

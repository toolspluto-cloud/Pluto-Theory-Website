// Pluto Theory: synthesized sound effects (Web Audio, no files)
(() => {
  const KEY = "pt-sound";
  let on = true;
  try { on = localStorage.getItem(KEY) !== "off"; } catch (_) {}

  let ctx, master, noise;
  function audio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.45;
      master.connect(ctx.destination);
      noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const d = noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // One oscillator note with a pitch path and a quick envelope
  function tone({ type = "sine", from = 440, to = from, mid, t = 0, dur = 0.15, vol = 0.4, vibrato = 0 }) {
    const c = ctx, s = c.currentTime + t;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(from, s);
    if (mid) {
      o.frequency.exponentialRampToValueAtTime(mid, s + dur * 0.35);
      o.frequency.exponentialRampToValueAtTime(to, s + dur);
    } else {
      o.frequency.exponentialRampToValueAtTime(to, s + dur);
    }
    if (vibrato) {
      const l = c.createOscillator(), lg = c.createGain();
      l.frequency.value = vibrato; lg.gain.value = from * 0.08;
      l.connect(lg).connect(o.frequency); l.start(s); l.stop(s + dur);
    }
    g.gain.setValueAtTime(0.0001, s);
    g.gain.exponentialRampToValueAtTime(vol, s + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, s + dur);
    o.connect(g).connect(master);
    o.start(s); o.stop(s + dur + 0.02);
  }

  // Filtered noise for whooshes and fwips
  function hiss({ t = 0, dur = 0.3, from = 400, to = 2400, q = 1.2, vol = 0.35, type = "bandpass" }) {
    const c = ctx, s = c.currentTime + t;
    const src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    src.buffer = noise;
    f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(from, s);
    f.frequency.exponentialRampToValueAtTime(to, s + dur);
    g.gain.setValueAtTime(0.0001, s);
    g.gain.exponentialRampToValueAtTime(vol, s + dur * 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, s + dur);
    src.connect(f).connect(g).connect(master);
    src.start(s); src.stop(s + dur + 0.02);
  }

  const SOUNDS = {
    blip: () => tone({ from: 1320, to: 1500, dur: 0.05, vol: 0.06 }),
    pop: () => tone({ from: 420, to: 1100, dur: 0.08, vol: 0.35 }),
    boing: () => tone({ type: "triangle", from: 160, mid: 620, to: 220, dur: 0.45, vol: 0.45, vibrato: 28 }),
    sparkle: () => { for (let i = 0; i < 6; i++) tone({ from: 1800 + Math.random() * 1600, to: 2600 + Math.random() * 1400, t: i * 0.035, dur: 0.09, vol: 0.08 }); },
    whoosh: () => hiss({ dur: 0.45, from: 300, to: 3200, vol: 0.4 }),
    flip: () => { hiss({ dur: 0.16, from: 1200, to: 5000, q: 0.8, vol: 0.3, type: "highpass" }); tone({ from: 300, to: 900, t: 0.05, dur: 0.08, vol: 0.12 }); },
    tick: () => tone({ type: "square", from: 2200 + Math.random() * 400, dur: 0.015, vol: 0.025 }),
    doorbell: () => { tone({ type: "triangle", from: 784, dur: 0.6, vol: 0.35 }); tone({ type: "triangle", from: 622, t: 0.35, dur: 0.8, vol: 0.35 }); },
    jingle: () => [523, 659, 784, 1047].forEach((f, i) => tone({ type: "triangle", from: f, t: i * 0.08, dur: 0.3, vol: 0.25 })),
    // Moods
    happy: () => { tone({ type: "triangle", from: 660, t: 0, dur: 0.18, vol: 0.3 }); tone({ type: "triangle", from: 990, t: 0.1, dur: 0.25, vol: 0.3 }); },
    thinking: () => { tone({ from: 300, to: 520, dur: 0.12, vol: 0.3 }); tone({ from: 360, to: 640, t: 0.14, dur: 0.12, vol: 0.3 }); tone({ from: 420, to: 760, t: 0.28, dur: 0.14, vol: 0.3 }); },
    skeptical: () => tone({ type: "sawtooth", from: 150, mid: 140, to: 210, dur: 0.5, vol: 0.12, vibrato: 6 }),
    excited: () => [600, 800, 1000, 1300].forEach((f, i) => tone({ type: "square", from: f, to: f * 1.2, t: i * 0.05, dur: 0.07, vol: 0.09 })),
    laugh: () => [0, 1, 2, 3].forEach((i) => tone({ type: "sawtooth", from: 420 - i * 30, mid: 560 - i * 30, to: 360 - i * 30, t: i * 0.13, dur: 0.11, vol: 0.12 })),
    wink: () => { tone({ type: "triangle", from: 1568, dur: 0.25, vol: 0.2 }); tone({ type: "triangle", from: 2093, t: 0.06, dur: 0.3, vol: 0.12 }); },
    love: () => { tone({ from: 500, to: 1400, dur: 0.35, vol: 0.25, vibrato: 9 }); SOUNDS.sparkle(); },
    cool: () => tone({ type: "sawtooth", from: 90, mid: 60, to: 80, dur: 0.6, vol: 0.22, vibrato: 7 }),
    shocked: () => tone({ type: "sine", from: 1600, to: 260, dur: 0.6, vol: 0.3, vibrato: 10 }),
    determined: () => { tone({ type: "sine", from: 150, to: 45, dur: 0.3, vol: 0.6 }); hiss({ dur: 0.12, from: 2000, to: 800, vol: 0.2 }); },
    sleepy: () => { tone({ from: 400, to: 180, dur: 0.7, vol: 0.18 }); tone({ type: "sawtooth", from: 70, dur: 0.6, t: 0.2, vol: 0.05 }); },
    neutral: () => tone({ from: 500, dur: 0.1, vol: 0.2 })
  };

  function play(name) {
    // Browsers block sound until the visitor has clicked or tapped; skip quietly until then (no console warnings).
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
    if (!on || !SOUNDS[name] || !audio()) return;
    try { SOUNDS[name](); } catch (_) {}
    btn.classList.remove("is-playing"); void btn.offsetWidth; btn.classList.add("is-playing");
  }
  window.ptSound = play;
  window.ptSoundOn = () => on;


  // Mute toggle
  const btn = document.createElement("button");
  btn.className = "sound-toggle";
  btn.type = "button";
  btn.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/>
    <path class="on" d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path class="off" d="M16.5 9.5l5 5M21.5 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
  const sync = () => {
    btn.setAttribute("aria-pressed", on);
    btn.setAttribute("aria-label", on ? "Sound on. Click to mute" : "Sound off. Click to unmute");
    btn.classList.toggle("is-off", !on);
  };
  sync();
  btn.addEventListener("click", () => {
    on = !on;
    try { localStorage.setItem(KEY, on ? "on" : "off"); } catch (_) {}
    sync();
    if (on) play("happy");
    else if (window.ptStopVoice) window.ptStopVoice();
  });
  document.body.appendChild(btn);

  // Sounds for common things, by delegation
  document.addEventListener("click", (e) => {
    const t = e.target;
    const mood = t.closest(".moods button");
    if (mood) return play(mood.dataset.mood);
    if (t.closest(".flip")) return play("flip");
    if (t.closest(".menu-toggle")) return play("pop");
    if (t.closest(".chips label")) return play("pop");
    const a = t.closest("a[href]");
    if (a) {
      const url = new URL(a.href, location.href);
      if (url.origin === location.origin && url.pathname !== location.pathname) return play("whoosh");
      return play("pop");
    }
    if (t.closest(".btn")) play("pop");
  });
  let last = null;
  document.addEventListener("pointerover", (e) => {
    const b = e.target.closest(".btn, .nav a, .moods button");
    if (b && b !== last) play("blip");
    last = b;
  });
})();

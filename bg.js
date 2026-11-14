// Pluto Theory: the aurora background behind every page. Soft watercolour light in the brand colours drifts slowly
// behind the content, and one wash follows the pointer (or a finger) a little late, like wet paint. Scrolling moves
// the light gently. One small canvas, blurred by CSS, so it costs very little.
// It never blocks clicks, pauses when the tab is hidden, and moves more slowly when "reduce motion" is on.
(() => {
  const canvas = document.createElement("canvas");
  canvas.className = "pt-bg";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const speed = reduced ? 0.35 : 1;
  const C = { purple: [136, 48, 214], green: [70, 199, 80], orange: [255, 138, 0] };
  const rgba = ([r, g, b], a) => `rgba(${r},${g},${b},${a})`;
  const SCALE = 0.25; // the light is soft anyway: draw at a quarter size and let CSS blur it up
  let W = 0, H = 0, scrollY = window.scrollY;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false };

  // Four slow washes, each on its own drifting path
  const washes = [
    { c: C.purple, a: 0.26, r: 0.42, fx: 0.00011, fy: 0.00008, px: 0.2, py: 0.25 },
    { c: C.green, a: 0.22, r: 0.38, fx: 0.00009, fy: 0.00013, px: 0.8, py: 0.35 },
    { c: C.orange, a: 0.2, r: 0.34, fx: 0.00012, fy: 0.0001, px: 0.55, py: 0.8 },
    { c: C.purple, a: 0.14, r: 0.3, fx: 0.00007, fy: 0.00011, px: 0.9, py: 0.9 }
  ];
  const follow = { x: 0, y: 0 };

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * SCALE); canvas.height = Math.round(H * SCALE);
    ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    follow.x = W / 2; follow.y = H * 0.4;
  }

  function blob(x, y, r, c, a) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rgba(c, a)); g.addColorStop(0.55, rgba(c, a * 0.45)); g.addColorStop(1, rgba(c, 0));
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    const m = Math.max(W, H), drift = (scrollY * 0.15) % H;
    ctx.globalCompositeOperation = "multiply";
    for (const b of washes) {
      const x = (b.px + Math.sin(t * b.fx * speed + b.px * 6) * 0.18) * W;
      const y = (b.py + Math.cos(t * b.fy * speed + b.py * 6) * 0.16) * H - drift * 0.3;
      blob(x, y, b.r * m, b.c, b.a);
    }
    // the wash that follows the pointer, a little late
    follow.x += ((pointer.active ? pointer.x : W * 0.5) - follow.x) * 0.04;
    follow.y += ((pointer.active ? pointer.y : H * 0.4) - follow.y) * 0.04;
    blob(follow.x, follow.y, m * 0.22, C.green, pointer.active ? 0.22 : 0.08);
    ctx.globalCompositeOperation = "source-over";
  }

  const move = (x, y) => {
    pointer.tx = x; pointer.ty = y;
    if (!pointer.active) { pointer.x = x; pointer.y = y; }
    pointer.active = true;
  };
  addEventListener("pointermove", (e) => move(e.clientX, e.clientY), { passive: true });
  addEventListener("touchmove", (e) => e.touches[0] && move(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
  document.addEventListener("pointerleave", () => { pointer.active = false; });
  addEventListener("scroll", () => { scrollY = window.scrollY; }, { passive: true });
  addEventListener("resize", resize);

  let running = true, last = 0;
  function frame(t) {
    if (!running) return;
    pointer.x += (pointer.tx - pointer.x) * 0.18; pointer.y += (pointer.ty - pointer.y) * 0.18; // glide, don't snap
    if (t - last > 15) { draw(t); last = t; }
    requestAnimationFrame(frame);
  }
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) requestAnimationFrame(frame);
  });

  resize();
  requestAnimationFrame(frame);
})();

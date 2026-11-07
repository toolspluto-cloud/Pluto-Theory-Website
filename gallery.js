// Pluto Theory: the gallery page. Photos come from gallery-data.js (made by scripts/build_gallery.py from the
// folders in assets/gallery/originals). Grid with filters, and a full-size viewer: click a photo, then use the
// arrows, arrow keys or a swipe to move, Esc or the close button to leave.
(() => {
  const items = window.PT_GALLERY || [];
  const grid = document.querySelector(".gallery-grid");
  const empty = document.querySelector(".gallery-empty");
  const filters = document.querySelector(".gallery-filters");
  const box = document.querySelector(".lightbox");
  if (!grid) return;

  const LABELS = { branding: "Branding", photography: "Photography", "ai-photoshoot": "AI photoshoot" };
  let shown = items;
  let current = 0;

  function render(category) {
    shown = category === "all" ? items : items.filter((it) => it.category === category);
    grid.innerHTML = "";
    shown.forEach((it, i) => {
      const li = document.createElement("li");
      li.className = "gallery-item";
      const b = document.createElement("button");
      b.type = "button";
      b.className = "gallery-open";
      b.setAttribute("aria-label", `Open: ${it.alt}`);
      const img = document.createElement("img");
      img.src = it.thumb;
      img.alt = it.alt;
      img.width = it.w;
      img.height = it.h;
      img.loading = i < 6 ? "eager" : "lazy";
      img.decoding = "async";
      const tag = document.createElement("span");
      tag.className = "gallery-tag";
      tag.textContent = LABELS[it.category] || it.category;
      b.append(img, tag);
      b.addEventListener("click", () => open(i));
      li.appendChild(b);
      grid.appendChild(li);
    });
    if (empty) empty.hidden = shown.length > 0;
    grid.hidden = shown.length === 0;
  }

  // Filters: only show the buttons for categories that actually have photos
  if (filters) {
    const present = new Set(items.map((it) => it.category));
    filters.querySelectorAll("button[data-filter]").forEach((btn) => {
      const f = btn.dataset.filter;
      if (f !== "all" && !present.has(f)) btn.hidden = true;
      btn.addEventListener("click", () => {
        filters.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === btn)));
        render(f);
      });
    });
    if (present.size < 2) filters.hidden = true;
  }

  // ---- full-size viewer ----
  const bigImg = box && box.querySelector(".lightbox-img");
  const caption = box && box.querySelector(".lightbox-caption");
  function show(i) {
    current = (i + shown.length) % shown.length;
    const it = shown[current];
    bigImg.src = it.src;
    bigImg.alt = it.alt;
    bigImg.width = it.w;
    bigImg.height = it.h;
    caption.textContent = `${it.alt} · ${current + 1} of ${shown.length}`;
  }
  function open(i) {
    if (!box || typeof box.showModal !== "function") return window.open(shown[i].src, "_blank", "noopener");
    show(i);
    box.showModal();
    document.body.classList.add("lightbox-open");
  }
  if (box) {
    box.querySelector(".lightbox-prev").addEventListener("click", () => show(current - 1));
    box.querySelector(".lightbox-next").addEventListener("click", () => show(current + 1));
    box.querySelector(".lightbox-close").addEventListener("click", () => box.close());
    box.addEventListener("close", () => document.body.classList.remove("lightbox-open"));
    box.addEventListener("click", (e) => { if (e.target === box) box.close(); }); // click outside the photo
    box.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
    let x0 = null;
    box.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    box.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  render("all");
})();

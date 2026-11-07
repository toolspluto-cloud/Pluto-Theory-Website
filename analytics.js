// Pluto Theory: Google Analytics 4 + Microsoft Clarity. Paste the two IDs below to switch them on;
// with an ID left empty that tool simply doesn't load. Everything else on the site reports through ptTrack().
//   GA4 ID:     Google Analytics > Admin > Data streams > your web stream > "Measurement ID" (looks like G-XXXXXXXXXX)
//   Clarity ID: clarity.microsoft.com > your project > Settings > Overview > "Project ID" (about 10 letters/numbers)
(() => {
  const GA4_ID = "";
  const CLARITY_ID = "";

  // Never count local testing
  const live = /(^|\.)plutotheory\.com$/.test(location.hostname);

  if (live && GA4_ID) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA4_ID);
  }
  if (live && CLARITY_ID) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_ID);
  }

  // One call for both tools. GA4 gets the event with its details; Clarity tags the session recording.
  window.ptTrack = (name, params = {}) => {
    try {
      if (window.gtag) window.gtag("event", name, params);
      if (window.clarity) window.clarity("event", name);
    } catch (_) {}
  };

  // Clicks worth counting, wherever they are on the page
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a) return;
    const href = a.getAttribute("href");
    const where = a.closest("header") ? "header" : a.closest("footer") ? "footer" : a.closest(".stage") ? "chat" : (a.closest("section")?.className.split(" ")[0] || "page");
    if (href.startsWith("mailto:")) return window.ptTrack("email_click", { location: where });
    if (/wa\.me|whatsapp\.com/.test(href)) return window.ptTrack("whatsapp_click", { location: where });
    if (/cal\.com|calendly\.com/.test(href)) return window.ptTrack("booking_click", { location: where });
    if (/^\/contact(\?|$)/.test(href)) return window.ptTrack("start_project_click", { location: where, label: a.textContent.trim().slice(0, 40) });
  }, true);

  if (document.title.startsWith("Page not found")) window.ptTrack("page_not_found", { path: location.pathname });
})();

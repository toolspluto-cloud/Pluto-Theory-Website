// Pluto Theory: where enquiries come from, and Google Analytics 4.
// - Works now: remembers how this visit started, so the contact form can say which ad, search or page an enquiry
//   came from. Kept for the browser tab only and sent only if the visitor submits the form.
// - GA4 (empty ID = off). The ID is in Google Analytics > Admin > Data streams > your web stream > "Measurement ID".
//   Visitors are asked first and nothing loads from Google unless they accept.
(() => {
  const GA4_ID = "G-693R6RV010";
  const live = /(^|\.)plutotheory\.com$/.test(location.hostname); // never count local or preview testing

  const read = (store, k) => { try { return store.getItem(k); } catch { return null; } };
  const write = (store, k, v) => { try { store.setItem(k, v); } catch {} };

  /* ---------- Where this visit came from ---------- */
  const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "gbraid", "wbraid", "fbclid"];
  const clean = (v) => String(v).replace(/[\u0000-\u001f<>"'`]/g, "").slice(0, 200);
  const params = new URLSearchParams(location.search);
  const found = {};
  KEYS.forEach((k) => { if (params.get(k)) found[k] = clean(params.get(k)); });

  const stored = (() => { try { return JSON.parse(read(sessionStorage, "pt-visit")); } catch { return null; } })();
  let visit = stored && typeof stored === "object" ? stored : null;
  // A new ad or campaign click replaces what we had; ordinary page views don't.
  if (!visit || Object.keys(found).length) {
    let from = "";
    try { const h = new URL(document.referrer).hostname; if (h !== location.hostname) from = clean(h); } catch {}
    visit = { ...found, landing_page: clean(location.pathname), ...(from ? { referrer: from } : {}) };
    write(sessionStorage, "pt-visit", JSON.stringify(visit));
  }
  window.ptVisit = () => ({ ...visit });

  /* ---------- Events ---------- */
  // Never pass a name, email, phone, company or message here.
  window.ptTrack = (name, details = {}) => { try { if (window.gtag) window.gtag("event", name, details); } catch {} };

  function startGA() {
    if (window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "granted" });
    window.gtag("js", new Date());
    window.gtag("config", GA4_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`;
    document.head.appendChild(s);
  }

  function ask() {
    const box = document.createElement("div");
    box.setAttribute("role", "region");
    box.setAttribute("aria-label", "Analytics choice");
    box.className = "pt-consent";
    box.style.cssText = "position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:520px;margin:0 auto;padding:16px 18px;border-radius:16px;background:#fff;color:#0B0B0F;box-shadow:0 10px 40px rgba(0,0,0,.25);font-size:14px;line-height:1.45";
    const p = document.createElement("p");
    p.style.cssText = "margin:0 0 12px";
    p.append("May we use Google Analytics to see which pages are useful? ");
    const a = document.createElement("a");
    a.href = "/privacy"; a.textContent = "Privacy policy"; a.style.cssText = "color:inherit;text-decoration:underline";
    p.append(a);
    const row = document.createElement("div");
    row.style.cssText = "display:flex;gap:10px";
    ["Accept", "Decline"].forEach((label) => {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = label;
      b.style.cssText = "flex:1;min-height:44px;border-radius:999px;border:1.5px solid #0B0B0F;background:#fff;color:#0B0B0F;font:inherit;font-weight:600;cursor:pointer";
      b.addEventListener("click", () => {
        write(localStorage, "pt-consent", label === "Accept" ? "yes" : "no");
        box.remove();
        if (label === "Accept") startGA();
      });
      row.append(b);
    });
    box.append(p, row);
    document.body.append(box);
  }

  if (live && GA4_ID) {
    const choice = read(localStorage, "pt-consent");
    if (choice === "yes") startGA();
    else if (choice !== "no") ask();
    // "Change my analytics choice" on the privacy page
    document.querySelectorAll("[data-consent-reset]").forEach((b) => {
      b.hidden = false;
      b.addEventListener("click", () => { try { localStorage.removeItem("pt-consent"); } catch {} location.reload(); });
    });
  }

  /* ---------- Clicks worth counting ---------- */
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    const href = a.getAttribute("href");
    const where = a.closest("header") ? "header" : a.closest("footer") ? "footer" : "page";
    if (href.startsWith("mailto:")) return window.ptTrack("email_click", { location: where });
    if (/wa\.me|whatsapp\.com/.test(href)) return window.ptTrack("whatsapp_click", { location: where });
    if (/^\/contact(\?|$)/.test(href)) window.ptTrack("demo_click", { location: where, page_path: location.pathname });
  }, true);
})();

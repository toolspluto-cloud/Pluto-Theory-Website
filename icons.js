// Pluto Theory: illustrated icons for "What you get" cards. <span class="ic" data-ic="name"></span>
(() => {
  const G = "#46C750", P = "#8830D6", O = "#FF8A00", K = "#0B0B0F", W = "#fff";
  const S = `stroke="${K}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`;
  const spark = (x, y, f = O) => `<path d="M${x} ${y - 5}l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z" fill="${f}" ${S} stroke-width="1.6"/>`;

  const ICONS = {
    logo: `<rect x="5" y="5" width="38" height="38" rx="10" fill="${W}" ${S}/><circle cx="19" cy="21" r="8" fill="${P}" ${S}/><path d="M24 36l8-15 8 15z" fill="${G}" ${S}/>${spark(38, 11)}`,
    tag: `<path d="M5 11h21l17 13-17 13H5z" fill="${O}" ${S}/><circle cx="12" cy="24" r="3" fill="${W}" ${S}/><path d="M19 20h10M19 28h7" ${S}/>`,
    voice: `<path d="M8 8h28a5 5 0 0 1 5 5v14a5 5 0 0 1-5 5H20l-9 8v-8H8a5 5 0 0 1-5-5V13a5 5 0 0 1 5-5z" fill="${W}" ${S}/><path d="M12 20v0M17 16v8M22 13v14M27 17v6M32 15v10" ${S} stroke="${P}" stroke-width="3"/>`,
    book: `<path d="M5 9h15a4 4 0 0 1 4 4v28a3 3 0 0 0-3-3H5z" fill="${G}" ${S}/><path d="M43 9H28a4 4 0 0 0-4 4v28a3 3 0 0 1 3-3h16z" fill="${P}" ${S}/><path d="M9 16h10M9 22h8M29 16h10M29 22h7" stroke="${W}" stroke-width="2.5" stroke-linecap="round"/>`,
    social: `<rect x="13" y="3" width="22" height="42" rx="5" fill="${W}" ${S}/><path d="M24 31c-7-4.5-8-10-4-11.6 1.8-.7 3.4.4 4 1.6.6-1.2 2.2-2.3 4-1.6 4 1.6 3 7.1-4 11.6z" fill="${O}" ${S}/><path d="M21 8h6" ${S}/>${spark(40, 12, G)}`,
    browser: `<rect x="3" y="7" width="42" height="34" rx="5" fill="${W}" ${S}/><path d="M3 15h42" ${S}/><circle cx="9" cy="11" r="1.4" fill="${O}"/><circle cx="14" cy="11" r="1.4" fill="${G}"/><rect x="9" y="21" width="15" height="13" rx="2" fill="${P}" ${S}/><path d="M29 23h10M29 29h7" ${S}/>`,
    character: `<path d="M9 45q2-13 15-13t15 13z" fill="${P}" ${S}/><circle cx="24" cy="19" r="14" fill="${W}" ${S}/><circle cx="27" cy="19" r="6.5" fill="${G}" ${S}/><circle cx="27" cy="19" r="3.2" fill="${K}"/><circle cx="29" cy="17" r="1.5" fill="${W}"/>`,
    refresh: `<path d="M38 19a15 15 0 0 0-27-4" fill="none" ${S} stroke="${P}" stroke-width="4"/><path d="M10 29a15 15 0 0 0 27 4" fill="none" ${S} stroke="${G}" stroke-width="4"/><path d="M10 7v9h9M38 41v-9h-9" fill="none" ${S}/>`,
    people: `<path d="M3 42q0-12 13-12t13 12z" fill="${G}" ${S}/><path d="M21 42q1-10 12-10t12 10z" fill="${P}" ${S}/><circle cx="16" cy="18" r="8" fill="${W}" ${S}/><circle cx="33" cy="21" r="6.5" fill="${W}" ${S}/><circle cx="18" cy="18" r="3" fill="${K}"/><circle cx="34.5" cy="21" r="2.6" fill="${K}"/>`,
    moon: `<path d="M30 5a17 17 0 1 0 13 28A14 14 0 1 1 30 5z" fill="${O}" ${S}/>${spark(39, 11, W)}${spark(12, 8, W)}`,
    mic: `<rect x="17" y="3" width="14" height="25" rx="7" fill="${P}" ${S}/><path d="M17 12h5M17 18h5" stroke="${W}" stroke-width="2" stroke-linecap="round"/><path d="M10 22a14 14 0 0 0 28 0M24 36v7M17 44h14" fill="none" ${S}/>`,
    award: `<path d="M16 31l-4 13 7-3 4 5 3-12M32 31l4 13-7-3-4 5-3-12" fill="${P}" ${S}/><circle cx="24" cy="20" r="14" fill="${O}" ${S}/><path d="M24 12l2.4 5 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z" fill="${W}" ${S} stroke-width="1.8"/>`,
    camera: `<path d="M16 13l3-6h10l3 6" fill="${W}" ${S}/><rect x="3" y="13" width="42" height="28" rx="6" fill="${W}" ${S}/><circle cx="24" cy="27" r="9" fill="${P}" ${S}/><circle cx="26.5" cy="24.5" r="2.3" fill="${W}"/><circle cx="38" cy="19" r="2" fill="${O}"/>`,
    calendar: `<rect x="4" y="9" width="40" height="34" rx="6" fill="${W}" ${S}/><path d="M4 18h40M15 5v8M33 5v8" ${S}/><circle cx="15" cy="29" r="3.5" fill="${G}" ${S}/><circle cx="24" cy="29" r="3.5" fill="${P}" ${S}/><circle cx="33" cy="29" r="3.5" fill="${O}" ${S}/>`,
    compass: `<circle cx="24" cy="24" r="20" fill="${W}" ${S}/><path d="M31 13l-5 13-9 9 5-13z" fill="${O}" ${S}/><circle cx="24" cy="24" r="2.2" fill="${K}"/><path d="M24 6v4M24 38v4M6 24h4M38 24h4" ${S}/>`,
    rocket: `<path d="M24 3c9 7 11 17 7 29H17C13 20 15 10 24 3z" fill="${W}" ${S}/><circle cx="24" cy="17" r="4.5" fill="${P}" ${S}/><path d="M17 25l-8 9 8-1M31 25l8 9-8-1" fill="${G}" ${S}/><path d="M19 36q5 13 10 0z" fill="${O}" ${S}/>`,
    news: `<path d="M38 15h6v21a4 4 0 0 1-4 4H9" fill="${W}" ${S}/><rect x="4" y="7" width="34" height="33" rx="3" fill="${W}" ${S}/><rect x="9" y="13" width="12" height="10" rx="1.5" fill="${P}"/><path d="M25 14h8M25 20h8M9 28h24M9 34h17" ${S}/>`,
    idcard: `<rect x="3" y="9" width="42" height="30" rx="5" fill="${W}" ${S}/><circle cx="15" cy="20" r="5" fill="${G}" ${S}/><path d="M8 33q7-9 14 0" fill="${G}" ${S}/><path d="M27 18h12M27 24h12M27 30h8" ${S}/>`,
    folder: `<path d="M3 13a4 4 0 0 1 4-4h11l4 5h19a4 4 0 0 1 4 4v21a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" fill="${O}" ${S}/><rect x="11" y="20" width="26" height="15" rx="3" fill="${W}" ${S}/><path d="M16 25h16M16 30h10" ${S}/>`,
    shield: `<path d="M24 3l18 7v12c0 12-8 19-18 23C14 41 6 34 6 22V10z" fill="${P}" ${S}/><path d="M15 23l6 6 12-13" fill="none" stroke="${W}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
    chart: `<rect x="3" y="5" width="42" height="38" rx="5" fill="${W}" ${S}/><rect x="10" y="26" width="7" height="11" rx="1.5" fill="${G}" ${S}/><rect x="21" y="18" width="7" height="19" rx="1.5" fill="${P}" ${S}/><rect x="32" y="11" width="7" height="26" rx="1.5" fill="${O}" ${S}/>`,
    chat: `<path d="M3 9a4 4 0 0 1 4-4h21a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H14l-7 6v-6a4 4 0 0 1-4-4z" fill="${G}" ${S}/><path d="M45 22a4 4 0 0 0-4-4H22a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h12l7 6v-6a4 4 0 0 0 4-4z" fill="${W}" ${S}/><circle cx="26" cy="27" r="1.8" fill="${K}"/><circle cx="31.5" cy="27" r="1.8" fill="${K}"/><circle cx="37" cy="27" r="1.8" fill="${K}"/>`,
    bulb: `<path d="M15 26a13 13 0 1 1 18 0c-2 2-3 4-3 7H18c0-3-1-5-3-7z" fill="${O}" ${S}/><path d="M18 38h12M20 43h8" ${S}/><path d="M19 19q5-6 10 0" fill="none" stroke="${W}" stroke-width="2.5" stroke-linecap="round"/><path d="M5 12l3 2M43 12l-3 2M24 1v3" ${S}/>`,
    app: `<rect x="11" y="3" width="26" height="42" rx="5" fill="${W}" ${S}/><rect x="15" y="10" width="18" height="10" rx="2" fill="${P}" ${S} stroke-width="1.8"/><rect x="15" y="23" width="8" height="8" rx="2" fill="${G}" ${S} stroke-width="1.8"/><rect x="25" y="23" width="8" height="8" rx="2" fill="${O}" ${S} stroke-width="1.8"/><path d="M15 37h18" ${S}/>`,
    flask: `<path d="M20 4v15L8 39a4 4 0 0 0 3.5 6h25a4 4 0 0 0 3.5-6L28 19V4" fill="${W}" ${S}/><path d="M12.5 32h23l4 7a3 3 0 0 1-2.6 4.5H11.1a3 3 0 0 1-2.6-4.5z" fill="${G}"/><path d="M17 4h14" ${S}/><circle cx="20" cy="37" r="2.2" fill="${W}"/><circle cx="27" cy="26" r="1.8" fill="${P}"/><circle cx="23" cy="20" r="1.3" fill="${P}"/>`,
    palette: `<path d="M24 4C12 4 3 12 3 23s8 20 19 20c3 0 4-2 3-4.5s0-5 3-5h6c7 0 11-4 11-10C45 12 36 4 24 4z" fill="${W}" ${S}/><circle cx="13" cy="21" r="3.6" fill="${P}" ${S}/><circle cx="21" cy="12" r="3.6" fill="${G}" ${S}/><circle cx="32" cy="14" r="3.6" fill="${O}" ${S}/>`,
    gear: `<circle cx="24" cy="24" r="16" fill="none" stroke="${K}" stroke-width="9" stroke-dasharray="6.2 6.4"/><circle cx="24" cy="24" r="14" fill="${G}" ${S}/><circle cx="24" cy="24" r="5.5" fill="${W}" ${S}/>`,
    film: `<rect x="4" y="18" width="40" height="25" rx="4" fill="${P}" ${S}/><path d="M4 11l37-6 2 8-37 6z" fill="${W}" ${S}/><path d="M12 9.6l4 7.2M22 8l4 7.2M32 6.3l4 7.2" ${S}/><path d="M20 25v12l10-6z" fill="${W}" ${S} stroke-width="1.8"/>`,
    reel: `<rect x="12" y="3" width="24" height="42" rx="5" fill="${G}" ${S}/><path d="M20 17v14l11-7z" fill="${W}" ${S}/><path d="M16 39h16" stroke="${W}" stroke-width="2.5" stroke-linecap="round"/>`,
    pen: `<path d="M24 4l11 19-11 18-11-18z" fill="${O}" ${S}/><circle cx="24" cy="24" r="3" fill="${W}" ${S}/><path d="M24 4v17M13 45h22" ${S}/>`,
    play: `<circle cx="24" cy="25" r="19" fill="${P}" ${S}/><path d="M19 16v18l15-9z" fill="${W}" ${S}/>${spark(41, 7)}${spark(6, 9, G)}`,
    grid: `<rect x="4" y="4" width="17" height="17" rx="4" fill="${G}" ${S}/><rect x="27" y="4" width="17" height="17" rx="4" fill="${W}" ${S}/><rect x="4" y="27" width="17" height="17" rx="4" fill="${W}" ${S}/><rect x="27" y="27" width="17" height="17" rx="4" fill="${P}" ${S}/><path d="M31 12h9M8 35h9" ${S}/>`,
    box: `<path d="M5 15l19-10 19 10v20l-19 10-19-10z" fill="${O}" ${S}/><path d="M5 15l19 10 19-10M24 25v20M14 10l19 10" fill="none" ${S}/>`,
    fire: `<path d="M24 3c2 8 13 12 13 25a13 13 0 0 1-26 0c0-6 3-10 5-13 1 4 3 6 5 6-1-7 1-13 3-18z" fill="${O}" ${S}/><path d="M24 30c1 3 5 4 5 8a5 5 0 0 1-10 0c0-3 3-5 5-8z" fill="${W}" ${S}/>`,
    dice: `<rect x="5" y="5" width="38" height="38" rx="9" fill="${W}" ${S}/><circle cx="15" cy="15" r="3.4" fill="${P}"/><circle cx="33" cy="15" r="3.4" fill="${G}"/><circle cx="24" cy="24" r="3.4" fill="${O}"/><circle cx="15" cy="33" r="3.4" fill="${G}"/><circle cx="33" cy="33" r="3.4" fill="${P}"/>`,
    sprout: `<path d="M12 33h24l-3 12H15z" fill="${O}" ${S}/><path d="M24 33c0-8-1-13 1-19" fill="none" ${S} stroke="${K}"/><path d="M24 22c-9 1-14-4-14-10 8-1 14 3 14 10z" fill="${G}" ${S}/><path d="M25 16c3-7 9-10 15-8-1 7-7 10-15 8z" fill="${G}" ${S}/>`,
    bolt: `<path d="M27 3L9 27h13l-3 18 20-26H26z" fill="${O}" ${S}/>`,
    heart: `<path d="M24 42C8 31 4 22 6 15c2-7 11-10 18-3 7-7 16-4 18 3 2 7-2 16-18 27z" fill="${P}" ${S}/><path d="M14 16q3-4 7-2" fill="none" stroke="${W}" stroke-width="2.5" stroke-linecap="round"/>`,
    wrench: `<path d="M31 5a11 11 0 0 0-10 15L5 36a4.5 4.5 0 0 0 6.4 6.4L27 27a11 11 0 0 0 15-10l-7 6-7-2-2-7z" fill="${W}" ${S}/><circle cx="9" cy="39" r="1.8" fill="${P}"/>`
  };

  document.querySelectorAll(".ic[data-ic]").forEach((el) => {
    const svg = ICONS[el.dataset.ic];
    if (svg) el.innerHTML = `<svg viewBox="0 0 48 48" aria-hidden="true">${svg}</svg>`;
  });
})();

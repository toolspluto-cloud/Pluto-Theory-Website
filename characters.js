// Pluto Theory: P. and T. character system.
// Every figure is drawn in local units with its feet at (0,0) and the head centred at (0,-180).
(() => {
  const C = { green: "#46C750", purple: "#8830D6", orange: "#FF8A00", ink: "#0B0B0F", white: "#FFFFFF", paper: "#F7F7F9" };
  const SUIT = { P: C.purple, T: C.green };
  let uid = 0;

  // Shared gradients, injected once per page
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  defs.setAttribute("aria-hidden", "true");
  defs.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
  defs.innerHTML = `<defs>
    <radialGradient id="pt-eye" gradientUnits="userSpaceOnUse" cx="-16" cy="-200" r="74">
      <stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#F7F7F9"/><stop offset="1" stop-color="#D4D4DC"/>
    </radialGradient>
    <linearGradient id="pt-shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity=".22"/><stop offset=".45" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="1" stop-color="#0B0B0F" stop-opacity=".3"/>
    </linearGradient>
    <linearGradient id="pt-night" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8830D6"/><stop offset="1" stop-color="#3A1470"/>
    </linearGradient>
    <radialGradient id="pt-lens" cx=".4" cy=".35" r=".7">
      <stop offset="0" stop-color="#8830D6"/><stop offset=".5" stop-color="#2a1640"/><stop offset="1" stop-color="#0B0B0F"/>
    </radialGradient>
  </defs>`;
  document.body.prepend(defs);

  const nums = (d) => d.match(/-?\d+(\.\d+)?/g).map(Number);
  const out = (w) => `stroke="${C.ink}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;

  // A puffy tube: ink outline, suit colour, quilted seams, soft highlight
  function limb(d, color, w) {
    return `<path d="${d}" fill="none" ${out(w + 5.5)}/>
      <path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>
      <path d="${d}" fill="none" stroke="${C.ink}" stroke-opacity=".38" stroke-width="${w - 3}" stroke-dasharray="2 13" stroke-dashoffset="-8"/>
      <path d="${d}" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="${w * 0.32}" stroke-linecap="round" transform="translate(-3 -3)"/>`;
  }

  function hand(d, kind) {
    const n = nums(d);
    const [ex, ey] = n.slice(-2);
    const [cx, cy] = n.slice(-4, -2);
    const len = Math.hypot(ex - cx, ey - cy) || 1;
    const ux = (ex - cx) / len, uy = (ey - cy) / len;
    let s = "";
    if (kind === "point") {
      const fx = ex + ux * 15, fy = ey + uy * 15;
      s += `<path d="M${ex},${ey} L${fx},${fy}" ${out(10)}/><path d="M${ex},${ey} L${fx},${fy}" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`;
    }
    s += `<circle cx="${ex}" cy="${ey}" r="12" fill="#fff" ${out(2.5)}/>`;
    if (kind === "open") {
      s += `<path d="M${ex - 6},${ey - 10} l-3,-8 M${ex},${ey - 12} l0,-9 M${ex + 6},${ey - 10} l3,-8" ${out(6)}/>
            <path d="M${ex - 6},${ey - 10} l-3,-8 M${ex},${ey - 12} l0,-9 M${ex + 6},${ey - 10} l3,-8" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>`;
    } else {
      s += `<path d="M${ex - 5},${ey - 3} q4,4 9,1" fill="none" stroke="${C.ink}" stroke-width="1.8" stroke-linecap="round" opacity=".55"/>`;
    }
    return s;
  }

  function sneaker(x, y, dir, color, rot = 0) {
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${dir} 1)">
      <path d="M-15,-17 Q-15,-24 -6,-24 L6,-24 Q14,-22 20,-13 L29,-9 Q34,-7 34,-1 L34,2 L-19,2 L-19,-9 Q-19,-15 -15,-17 Z" fill="#fff" ${out(2.5)}/>
      <rect x="-19.5" y="-2" width="54" height="7" rx="3.5" fill="${C.ink}"/>
      <path d="M-9,-11 Q7,-4 24,-9" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
      <path d="M-1,-21 l4,6 M6,-20 l4,6" stroke="${C.ink}" stroke-width="1.8" stroke-linecap="round"/>
    </g>`;
  }

  const LEGS = {
    stand: { l: "M-18,-62 Q-20,-40 -20,-16", r: "M18,-62 Q20,-40 20,-16", fl: [-20, -2, 0], fr: [20, -2, 0] },
    stride: { l: "M-18,-62 Q-30,-40 -40,-18", r: "M18,-62 Q30,-42 34,-16", fl: [-42, -3, -10], fr: [36, -2, 4] },
    sit: { l: "M-18,-62 Q-40,-64 -36,-40 L-36,-16", r: "M18,-62 Q40,-64 36,-40 L36,-16", fl: [-36, -2, 0], fr: [36, -2, 0] },
    jump: { l: "M-18,-62 Q-42,-50 -30,-30", r: "M18,-62 Q40,-58 36,-38", fl: [-31, -16, -18], fr: [37, -24, 14] },
    run: { l: "M-18,-62 Q-44,-50 -56,-36", r: "M18,-62 Q36,-42 28,-16", fl: [-58, -22, -35], fr: [30, -2, 0] }
  };

  const ARMS = {
    downL: "M-40,-116 Q-56,-92 -52,-68",
    downR: "M40,-116 Q56,-92 52,-68",
    hipL: "M-40,-116 Q-74,-98 -44,-82",
    hipR: "M40,-116 Q74,-98 44,-82",
    kneeL: "M-40,-116 Q-62,-90 -34,-70",
    chinR: "M40,-116 Q74,-84 22,-134",
    upL: "M-40,-116 Q-70,-140 -66,-180",
    upR: "M40,-116 Q70,-140 66,-180",
    pointUpR: "M40,-116 Q72,-140 92,-176",
    pointR: "M40,-116 Q70,-130 90,-150"
  };

  // Moods: eye lids, iris details, mouth and cheeks
  function face(mood, look, id, color) {
    const [lx, ly] = look;
    const ix = lx, iy = -180 + ly;
    const closed = ["laugh", "wink"].includes(mood);
    let iris = "";
    if (!closed && mood !== "cool") {
      const pupil = mood === "shocked" ? 8 : mood === "excited" ? 13 : 16;
      const centre = mood === "love"
        ? `<path d="M0,9 C-17,-3 -11,-19 0,-9 C11,-19 17,-3 0,9 Z" fill="${C.orange}" stroke="${C.ink}" stroke-width="2"/>`
        : `<circle r="${pupil}" fill="${C.ink}"/>`;
      const shine = mood === "excited"
        ? `<path d="M7,-17 Q8.5,-9.5 15,-8 Q8.5,-6.5 7,1 Q5.5,-6.5 -1,-8 Q5.5,-9.5 7,-17 Z" fill="#fff"/>`
        : `<circle cx="7" cy="-8" r="6.5" fill="#fff"/>`;
      iris = `<g transform="translate(${ix} ${iy})"><g class="pt-track">
        <circle r="23" fill="${color}" stroke="${C.ink}" stroke-width="2.5"/>
        <circle r="23" fill="url(#pt-shade)"/>
        ${centre}${shine}<circle cx="-7" cy="8" r="3" fill="#fff" opacity=".85"/>
      </g></g>`;
    }
    const upper = (yl, ym, yr) =>
      `<path d="M-60,-240 H60 V${yr} Q0,${ym} -60,${yl} Z" fill="url(#pt-eye)"/><path d="M-60,${yl} Q0,${ym} 60,${yr}" fill="none" ${out(3)}/>`;
    const lower = (y) =>
      `<path d="M-60,-120 H60 V${y} Q0,${y - 22} -60,${y} Z" fill="url(#pt-eye)"/><path d="M-60,${y} Q0,${y - 22} 60,${y}" fill="none" ${out(3)}/>`;
    let lids = "";
    if (mood === "thinking") lids = upper(-206, -206, -196);
    if (mood === "skeptical") lids = upper(-188, -190, -186);
    if (mood === "sleepy") lids = upper(-176, -178, -176) + lower(-158);
    if (mood === "determined") lids = upper(-212, -200, -186);
    if (mood === "happy" || mood === "love") lids = lower(-160);
    const blink = closed || mood === "cool" ? "" : `<rect class="pt-blink" x="-50" y="-230" width="100" height="100" fill="url(#pt-eye)"/>`;

    let extra = "";
    if (mood === "laugh") extra += `<path d="M-24,-176 Q0,-204 24,-176" fill="none" ${out(5.5)}/>`;
    if (mood === "wink") extra += `<path d="M-24,-182 Q0,-168 24,-182" fill="none" ${out(5.5)}/><path d="M22,-184 l8,-5" ${out(3)}/>`;
    if (mood === "cool") extra += `<path d="M-44,-198 Q0,-208 44,-198 L39,-174 Q22,-160 0,-166 Q-22,-160 -39,-174 Z" fill="${C.ink}"/>
      <path d="M-30,-194 L-12,-196" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".55"/><path d="M-47,-198 L-56,-194 M47,-198 L56,-194" ${out(3)}/>`;

    const mouths = {
      happy: `<path d="M-10,-149 Q0,-140 10,-149" fill="none" ${out(3)}/>`,
      love: `<path d="M-10,-149 Q0,-140 10,-149" fill="none" ${out(3)}/>`,
      excited: `<path d="M-9,-150 Q0,-136 9,-150 Z" fill="${C.ink}" ${out(2.5)}/>`,
      laugh: `<path d="M-18,-156 Q0,-152 18,-156 Q14,-136 0,-136 Q-14,-136 -18,-156 Z" fill="${C.ink}" ${out(2.5)}/><path d="M-8,-142 Q0,-148 8,-142 Q4,-137 0,-137 Q-4,-137 -8,-142 Z" fill="${C.orange}"/>`,
      wink: `<path d="M-8,-147 Q4,-140 14,-150" fill="none" ${out(3)}/>`,
      cool: `<path d="M-6,-147 Q6,-141 14,-149" fill="none" ${out(3)}/>`,
      shocked: `<ellipse cx="0" cy="-146" rx="6" ry="8" fill="${C.ink}"/>`,
      determined: `<path d="M-9,-146 L9,-148" ${out(3)}/>`,
      sleepy: `<path d="M-4,-146 q4,3 8,0" fill="none" ${out(2.5)}/>`
    };
    const cheeks = ["happy", "love", "laugh", "excited", "wink"].includes(mood)
      ? `<ellipse cx="-30" cy="-152" rx="9" ry="5" fill="${C.orange}" opacity=".35"/><ellipse cx="30" cy="-152" rx="9" ry="5" fill="${C.orange}" opacity=".35"/>` : "";

    return `<clipPath id="hc${id}"><circle cx="0" cy="-180" r="48"/></clipPath>
      <g clip-path="url(#hc${id})">${iris}${lids}${blink}</g>${extra}${cheeks}${mouths[mood] || ""}`;
  }

  const star = (x, y, s, fill) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0,-10 Q2,-2 10,0 Q2,2 0,10 Q-2,2 -10,0 Q-2,-2 0,-10 Z" fill="${fill}" ${out(2 / s)}/>`;
  const heart = (x, y, s) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0,8 C-14,-2 -9,-16 0,-8 C9,-16 14,-2 0,8 Z" fill="${C.orange}" ${out(2 / s)}/>`;

  const MARKS = {
    q: `<text x="56" y="-220" transform="rotate(12 56 -220)" font-family="League Spartan, sans-serif" font-weight="800" font-size="34" fill="${C.ink}">?</text>`,
    excl: `<text x="58" y="-218" transform="rotate(10 58 -218)" font-family="League Spartan, sans-serif" font-weight="800" font-size="34" fill="${C.ink}">!</text><text x="72" y="-228" transform="rotate(18 72 -228)" font-family="League Spartan, sans-serif" font-weight="800" font-size="24" fill="${C.ink}">!</text>`,
    sparkles: star(62, -222, 1.1, C.orange) + star(-60, -204, 0.7, "#fff") + star(74, -190, 0.55, "#fff"),
    lines: `<path d="M52,-222 l14,-14 M60,-206 l20,-4 M44,-234 l4,-18" ${out(3.5)}/>`,
    zzz: `<g font-family="League Spartan, sans-serif" font-weight="800" fill="${C.ink}"><text x="52" y="-212" font-size="16">z</text><text x="64" y="-228" font-size="21">z</text><text x="80" y="-248" font-size="27">Z</text></g>`,
    bulb: `<g class="pt-bulb"><path d="M-22,-262 l-10,-6 M22,-262 l10,-6 M0,-290 v-12 M-16,-282 l-7,-9 M16,-282 l7,-9" stroke="${C.orange}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M-14,-262 a16,16 0 1 1 28,0 q-5,6 -5,12 h-18 q0,-6 -5,-12 z" fill="#fff" ${out(2.5)}/><path d="M-7,-246 h14 M-6,-241 h12" ${out(2.5)}/><path d="M-4,-262 q4,-6 8,0" fill="none" stroke="${C.orange}" stroke-width="2.5"/></g>`,
    crown: `<path d="M-22,-232 L-24,-252 L-11,-242 L0,-258 L11,-242 L24,-252 L22,-232 Z" fill="none" ${out(3)}/>`,
    hearts: heart(58, -222, 1) + heart(76, -244, 0.7) + heart(-60, -214, 0.6),
    notes: `<g ${out(2.5)} fill="${C.ink}"><path d="M58,-214 v-26 l14,-4 v24" fill="none"/><circle cx="54" cy="-214" r="5"/><circle cx="68" cy="-220" r="5"/><path d="M-62,-206 v-22" fill="none"/><circle cx="-66" cy="-206" r="5"/></g>`,
    sweat: `<path d="M-50,-216 q-8,12 0,16 q8,-4 0,-16 z" fill="#fff" ${out(2.5)}/>`,
    code: `<text x="50" y="-222" font-family="League Spartan, sans-serif" font-weight="800" font-size="22" fill="${C.ink}">&lt;/&gt;</text>`
  };

  // Default doodles for each mood when a scene doesn't pick its own
  const MOOD_MARKS = {
    happy: ["sparkles"], thinking: ["q"], skeptical: ["q"], excited: ["excl"], laugh: ["lines"], wink: ["sparkles"],
    sleepy: ["zzz"], determined: ["lines"], shocked: ["excl", "sweat"], love: ["hearts"], cool: ["sparkles"], neutral: []
  };

  function figure(o) {
    const id = ++uid;
    const who = o.who || "P";
    const color = SUIT[who];
    const legs = LEGS[o.legs || "stand"];
    const mood = o.mood || "neutral";
    const arms = Object.assign({ l: { d: ARMS.downL }, r: { d: ARMS.downR } }, o.arms || {});
    const marks = o.marks || MOOD_MARKS[mood] || [];
    const props = o.props || {};

    const armSvg = (a) => limb(a.d, color, 24) + hand(a.d, a.hand);
    const back = [arms.l, arms.r].filter((a) => !a.front).map(armSvg).join("");
    const front = [arms.l, arms.r].filter((a) => a.front).map(armSvg).join("");

    const body = `
      <ellipse cx="0" cy="${(o.ground || 0) + 3}" rx="${o.legs === "jump" ? 34 : 46}" ry="6" fill="${C.ink}" opacity=".13"/>
      ${props.back || ""}
      ${limb(legs.l, color, 28)}${limb(legs.r, color, 28)}
      ${sneaker(legs.fl[0], legs.fl[1], -1, color, legs.fl[2])}${sneaker(legs.fr[0], legs.fr[1], 1, color, legs.fr[2])}
      <path d="M-44,-120 Q-50,-134 -28,-138 L28,-138 Q50,-134 44,-120 L49,-74 Q50,-60 36,-60 L-36,-60 Q-50,-60 -49,-74 Z" fill="${color}" ${out(2.5)}/>
      <path d="M-44,-120 Q-50,-134 -28,-138 L28,-138 Q50,-134 44,-120 L49,-74 Q50,-60 36,-60 L-36,-60 Q-50,-60 -49,-74 Z" fill="url(#pt-shade)"/>
      <path d="M-46,-106 Q0,-97 46,-106 M-48,-84 Q0,-75 48,-84" fill="none" stroke="${C.ink}" stroke-width="2" opacity=".45"/>
      <path d="M0,-136 V-61" stroke="${C.ink}" stroke-width="2"/><rect x="1.5" y="-128" width="5" height="11" rx="2" fill="#fff" stroke="${C.ink}" stroke-width="1.5"/>
      <text x="-34" y="-86" font-family="League Spartan, sans-serif" font-weight="800" font-size="17" fill="#fff">${who}</text><circle cx="-21" cy="-89" r="2.6" fill="${C.orange}"/>
      ${back}
      <ellipse cx="0" cy="-134" rx="38" ry="14" fill="${color}" ${out(2.5)}/><ellipse cx="0" cy="-134" rx="38" ry="14" fill="url(#pt-shade)"/>
      <path d="M-9,-128 l-2,16 M9,-128 l2,16" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
      <g transform="rotate(${o.tilt || 0} 0 -134)"><g class="pt-head">
        <circle cx="0" cy="-180" r="48" fill="url(#pt-eye)" ${out(2.5)}/>
        ${face(mood, o.look || [0, 0], id, color)}
        <g class="pt-talk"><ellipse cx="0" cy="-146" rx="9" ry="7" fill="${C.ink}"/><ellipse cx="0" cy="-142.5" rx="5" ry="3" fill="${C.orange}"/></g>
        <ellipse cx="-21" cy="-207" rx="13" ry="7" transform="rotate(-32 -21 -207)" fill="#fff" opacity=".9"/>
        <circle cx="-34" cy="-192" r="3" fill="#fff" opacity=".8"/>
      </g></g>
      ${front}
      ${props.front || ""}
      <g class="pt-marks">${marks.map((m) => MARKS[m] || "").join("")}</g>`;

    return `<g data-who="${who}" transform="translate(${o.x} ${o.y}) scale(${o.s || 1})"><g class="pt-fig ${o.cls || ""}">${body}</g></g>`;
  }

  // ---------- Props ----------
  const P = {
    cube: (x, y, w, h, label) => `<g transform="translate(${x} ${y})">
      ${label ? `<rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="10" fill="${C.ink}"/>
      <path d="M${-w / 2 + 6},${-h + 8} H${w / 2 - 6}" stroke="#fff" stroke-opacity=".18" stroke-width="3" stroke-linecap="round"/>`
        : `<rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="10" fill="#fff" ${out(2.5)}/>
      <path d="M${-w / 2 + 10},${-h + 10} H${w / 2 - 10}" stroke="${C.ink}" stroke-opacity=".12" stroke-width="3" stroke-linecap="round"/>`}
      ${label ? `<text x="${-12}" y="${-h / 2 + 12}" font-family="League Spartan, sans-serif" font-weight="800" font-size="34" fill="#fff">${label}</text>
      <circle cx="${14}" cy="${-h / 2 + 9}" r="4.5" fill="${C.orange}"/>` : ""}</g>`,
    brush: `<g><path d="M66,-140 L106,-164" ${out(9)}/><path d="M66,-140 L106,-164" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M100,-168 l14,-8 l6,10 l-14,8 z" fill="${C.ink}"/><path d="M114,-176 q14,-10 18,2 q-4,8 -12,8 z" fill="${C.orange}" ${out(2.5)}/></g>`,
    swatches: (x, y) => `<g transform="translate(${x} ${y})">
      <rect x="-9" y="-46" width="18" height="44" rx="5" transform="rotate(-26)" fill="${C.orange}" ${out(2.5)}/>
      <rect x="-9" y="-48" width="18" height="44" rx="5" fill="${C.green}" ${out(2.5)}/>
      <rect x="-9" y="-46" width="18" height="44" rx="5" transform="rotate(26)" fill="${C.purple}" ${out(2.5)}/>
      <circle r="4" fill="#fff" ${out(2)}/></g>`,
    mug: (x, y) => `<g transform="translate(${x} ${y})"><path d="M-12,-20 h24 v18 q0,8 -8,8 h-8 q-8,0 -8,-8 z" fill="#fff" ${out(2.5)}/>
      <path d="M12,-15 q10,0 10,7 q0,7 -10,7" fill="none" ${out(2.5)}/><text x="-5" y="-4" font-family="League Spartan, sans-serif" font-weight="800" font-size="12" fill="${C.purple}">P</text>
      <path class="pt-steam" d="M-5,-26 q-5,-7 0,-14 M5,-26 q-5,-7 0,-14" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".8"/></g>`,
    mic: (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-4" y="0" width="8" height="30" rx="3" fill="${C.ink}" stroke="#fff" stroke-width="1.5"/>
      <circle cy="-6" r="11" fill="#9a9aa6" ${out(2.5)}/><path d="M-8,-10 h16 M-9,-4 h18" stroke="${C.ink}" stroke-width="1.5" opacity=".6"/><rect x="-6" y="5" width="12" height="4" fill="${C.orange}"/></g>`,
    megaphone: `<g><path d="M80,-142 L134,-176 Q142,-136 134,-94 L80,-124 Z" fill="${C.orange}" ${out(2.5)}/>
      <ellipse cx="136" cy="-135" rx="8" ry="41" fill="#fff" ${out(2.5)}/><rect x="70" y="-142" width="14" height="22" rx="4" fill="${C.ink}"/>
      <path d="M98,-122 l-4,22" ${out(7)}/><path class="pt-wave" d="M156,-158 q14,23 0,46 M172,-170 q22,35 0,70 M188,-180 q28,45 0,90" fill="none" ${out(3.5)}/></g>`,
    news: `<g transform="rotate(-5 0 -100)"><rect x="-46" y="-138" width="92" height="74" rx="4" fill="#fff" ${out(2.5)}/>
      <text x="-38" y="-120" font-family="League Spartan, sans-serif" font-weight="800" font-size="12.5" fill="${C.ink}">PLUTO TIMES</text>
      <path d="M-38,-113 h76" stroke="${C.ink}" stroke-width="2"/><rect x="-38" y="-106" width="30" height="24" rx="3" fill="${C.purple}"/>
      <path d="M-2,-104 h40 M-2,-96 h40 M-2,-88 h30 M-38,-75 h76" stroke="${C.ink}" stroke-width="2.5" opacity=".5" stroke-linecap="round"/></g>`,
    laptop: `<g><path d="M-38,-112 h76 l-4,44 h-68 z" fill="#fff" ${out(2.5)}/><rect x="-46" y="-70" width="92" height="9" rx="4" fill="${C.ink}"/>
      <rect x="-12" y="-100" width="24" height="17" rx="5" fill="${C.ink}"/><text x="-8" y="-87" font-family="League Spartan, sans-serif" font-weight="800" font-size="11" fill="${C.purple}">P</text><text x="0" y="-87" font-family="League Spartan, sans-serif" font-weight="800" font-size="11" fill="${C.green}">T</text>
      <circle cx="10" cy="-98" r="1.8" fill="${C.orange}"/></g>`,
    wrench: (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0,0 L0,-38" ${out(11)}/><path d="M0,0 L0,-38" stroke="#b9b9c4" stroke-width="6" stroke-linecap="round"/>
      <path d="M-11,-44 a12,12 0 1 1 22,0 l-5,-1 l0,-9 l-12,0 l0,9 z" fill="#b9b9c4" ${out(2.5)}/></g>`,
    clapper: `<g transform="translate(70 -172)"><rect x="-30" y="-6" width="60" height="40" rx="4" fill="${C.ink}" stroke="#fff" stroke-width="1"/>
      <text x="-24" y="16" font-family="League Spartan, sans-serif" font-weight="800" font-size="10" fill="#fff">TAKE 1</text><path d="M-24,24 h40" stroke="#fff" stroke-width="2" opacity=".5"/>
      <g class="pt-clap"><rect x="-30" y="-18" width="60" height="12" rx="2" fill="#fff" ${out(2.5)}/><path d="M-20,-18 l-8,12 M-4,-18 l-8,12 M12,-18 l-8,12 M28,-18 l-8,12" stroke="${C.ink}" stroke-width="5"/></g></g>`,
    camera: `<g><rect x="-64" y="-140" width="58" height="40" rx="8" fill="${C.ink}" stroke="#fff" stroke-width="1"/><rect x="-52" y="-152" width="22" height="13" rx="3" fill="${C.ink}"/>
      <circle cx="-68" cy="-120" r="17" fill="url(#pt-lens)" ${out(2.5)}/><circle cx="-73" cy="-126" r="4" fill="#fff" opacity=".8"/>
      <circle class="pt-rec" cx="-14" cy="-131" r="4" fill="${C.orange}"/></g>`,
    rocket: (x, y) => `<g transform="translate(${x} ${y})"><g class="pt-rocket">
      <path class="pt-flame" d="M-9,22 Q0,52 9,22 Z" fill="${C.orange}" ${out(2.5)}/>
      <path d="M-16,8 l-12,16 l14,-2 z M16,8 l12,16 l-14,-2 z" fill="${C.green}" ${out(2.5)}/>
      <path d="M0,-38 Q20,-18 16,24 H-16 Q-20,-18 0,-38 Z" fill="#fff" ${out(2.5)}/>
      <circle cy="-6" r="8" fill="${C.purple}" ${out(2.5)}/><circle cx="-2" cy="-8" r="2.5" fill="#fff"/></g></g>`,
    sprout: (x, y) => `<g transform="translate(${x} ${y})"><path d="M-18,-26 h36 l-5,26 h-26 z" fill="${C.ink}"/>
      <path d="M0,-26 q-2,-20 2,-34" fill="none" stroke="${C.green}" stroke-width="4" stroke-linecap="round"/>
      <path d="M1,-46 q-22,-6 -24,-20 q18,0 24,20 z M2,-54 q16,-14 28,-10 q-8,16 -28,10 z" fill="${C.green}" ${out(2.5)}/></g>`,
    gear: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="pt-spin"><path d="M-4,-20 h8 l2,6 l6,3 l6,-3 l6,6 l-3,6 l3,6 l6,2 v8 l-6,2 l-3,6 l3,6 l-6,6 l-6,-3 l-6,3 l-2,6 h-8 l-2,-6 l-6,-3 l-6,3 l-6,-6 l3,-6 l-3,-6 l-6,-2 v-8 l6,-2 l3,-6 l-3,-6 l6,-6 l6,3 l6,-3 z" fill="none" ${out(2.5)}/><circle r="7" fill="none" ${out(2.5)}/></g></g>`,
    plane: `<g><path d="M300,52 q60,-40 110,8" fill="none" stroke="${C.ink}" stroke-width="2" stroke-dasharray="5 7" stroke-linecap="round"/>
      <g class="pt-float"><path d="M412,62 l52,-24 l-20,40 l-10,-14 z" fill="#fff" ${out(2.5)}/><path d="M434,64 l30,-26" ${out(2)}/></g></g>`,
    cloud: (x, y, s) => `<path transform="translate(${x} ${y}) scale(${s})" d="M-30,0 q-14,0 -12,-12 q2,-12 16,-9 q4,-16 22,-12 q14,3 14,16 q14,-2 14,10 q0,7 -10,7 z" fill="#fff" ${out(2.5 / s)}/>`,
    lights: (w) => {
      let s = `<path d="M10,30 Q${w / 2},90 ${w - 10},30" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="2"/>`;
      const cols = [C.green, C.purple, C.orange];
      for (let i = 1; i < 10; i++) {
        const t = i / 10, x = 10 + (w - 20) * t, y = 30 + 120 * t * (1 - t);
        s += `<g class="pt-glow" style="animation-delay:${-i * 0.37}s"><path d="M${x},${y} v6" stroke="#fff" stroke-opacity=".5" stroke-width="2"/><ellipse cx="${x}" cy="${y + 13}" rx="6" ry="8" fill="${cols[i % 3]}"/></g>`;
      }
      return s;
    },
    film: `<g opacity=".9"><path d="M-10,40 Q120,0 240,30 T460,20" fill="none" stroke="${C.ink}" stroke-width="26"/>
      <path d="M-10,40 Q120,0 240,30 T460,20" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="7 9" transform="translate(0 -7)"/>
      <path d="M-10,40 Q120,0 240,30 T460,20" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="7 9" transform="translate(0 7)"/></g>`,
    softbox: `<g transform="translate(46 0)"><path d="M0,284 V150 M-16,284 l16,-30 l16,30" ${out(3)} fill="none"/>
      <path d="M-30,96 h60 l-10,54 h-40 z" fill="${C.ink}"/><path d="M-26,100 h52 l-8,44 h-36 z" fill="#fff"/>
      <path class="pt-ray" d="M36,110 l26,-6 M38,126 l30,0 M34,142 l26,8" stroke="${C.orange}" stroke-width="3.5" stroke-linecap="round"/></g>`,
    easel: `<g><path d="M330,120 L296,284 M370,120 L404,284 M350,190 L350,284" ${out(4)} fill="none"/>
      <rect x="280" y="60" width="140" height="124" rx="6" fill="#fff" ${out(3)}/>
      <path class="pt-paint" d="M298,150 q22,-56 48,-20 t52,-30" fill="none" stroke="${C.green}" stroke-width="12" stroke-linecap="round"/>
      <text x="306" y="138" font-family="League Spartan, sans-serif" font-weight="800" font-size="62" fill="${C.purple}">P</text><circle cx="356" cy="132" r="9" fill="${C.orange}"/>
      <path d="M392,162 v14" stroke="${C.purple}" stroke-width="5" stroke-linecap="round"/><path d="M268,184 h164" ${out(5)}/></g>`,
    bubble: (cls, x, y, w, text, fill, tail) => `<g class="${cls}"><path d="M${x + 20},${y} H${x + w - 20} A20,20 0 0 1 ${x + w - 20},${y + 42} H${tail[0] + 10} L${tail[0]},${tail[1]} L${tail[0] - 4},${y + 42} H${x + 20} A20,20 0 0 1 ${x + 20},${y} Z" fill="${fill}" ${out(2.5)}/>
      <text x="${x + w / 2}" y="${y + 28}" text-anchor="middle" font-family="League Spartan, sans-serif" font-weight="800" font-size="19" fill="${C.ink}">${text}</text></g>`,
    stars: (pts) => pts.map(([x, y, s, f]) => star(x, y, s, f || "#fff")).join("")
  };

  // ---------- Scenes ----------
  const SCENES = {
    hero: (_, d = {}) => {
      const pm = d.pmood || "thinking", tm = d.tmood || "excited";
      const pSay = d.psay || "What if?", tSay = d.tsay || "Let’s do it!";
      const w = (t) => Math.max(130, Math.round(t.length * 10.5 + 40));
      const bg = `${P.plane}${P.cloud(80, 66, 1)}${P.cloud(480, 210, 0.7)}${P.stars([[250, 40, 1, C.orange], [40, 200, 0.8], [300, 250, 0.6, C.green]])}`;
      const v = d.variant || "classic";
      // Other ways to stage the pair (data-variant on the scene): swap, highfive, side
      if (v === "swap") return {
        vb: "0 0 520 340",
        svg: `${bg}${P.cube(160, 318, 108, 74, "")}
          ${figure({ who: "T", x: 160, y: 318, legs: "sit", mood: d.tmood || "cool", look: [10, -8], tilt: -6,
            arms: { l: { d: ARMS.kneeL }, r: { d: ARMS.chinR, front: true } }, cls: "pt-sway" })}
          ${figure({ who: "P", x: 380, y: 296, ground: 22, legs: "jump", mood: d.pmood || "excited", look: [-8, -12], tilt: -7, marks: ["sparkles"],
            arms: { l: { d: ARMS.upL, hand: "open" }, r: { d: ARMS.upR, hand: "open" } }, cls: "pt-hop" })}
          ${P.bubble("bubble-t", 14, 40, w(tSay), tSay, C.orange, [112, 98])}
          ${P.bubble("bubble-p", 236, 0, Math.max(150, w(pSay)), pSay, "#fff", [360, 62])}`
      };
      if (v === "highfive") return {
        vb: "0 0 520 340",
        svg: `${bg}
          ${figure({ who: "P", x: 172, y: 318, legs: "stride", mood: d.pmood || "excited", look: [12, -8], tilt: 6,
            arms: { l: { d: ARMS.hipL }, r: { d: ARMS.pointR, hand: "open", front: true } }, cls: "pt-hop-small" })}
          ${figure({ who: "T", x: 348, y: 318, legs: "stride", mood: d.tmood || "laugh", look: [-12, -8], tilt: -6, marks: ["sparkles"],
            arms: { l: { d: "M-40,-116 Q-70,-130 -90,-150", hand: "open", front: true }, r: { d: ARMS.hipR } }, cls: "pt-hop-small" })}
          ${P.stars([[260, 150, 1.3, C.orange]])}
          ${P.bubble("bubble-p", 6, 30, w(pSay), pSay, "#fff", [112, 92])}
          ${P.bubble("bubble-t", 520 - 6 - Math.max(150, w(tSay)), 30, Math.max(150, w(tSay)), tSay, C.orange, [392, 92])}`
      };
      // "clap": the high five, animated. Each character is drawn twice (arms down / hands together) and CSS
      // swaps between the two (.clap-a / .clap-b), with a spark where the hands meet and a little lean in.
      if (v === "clap") {
        const pFig = (arms) => figure({ who: "P", x: 172, y: 318, legs: "stride", mood: d.pmood || "excited", look: [12, -8], tilt: 6, arms });
        const tFig = (arms) => figure({ who: "T", x: 348, y: 318, legs: "stride", mood: d.tmood || "laugh", look: [-12, -8], tilt: -6, marks: ["sparkles"], arms });
        return {
          vb: "0 0 520 340",
          svg: `${bg}
            <g class="clap-p">
              <g class="clap-a">${pFig({ l: { d: ARMS.hipL }, r: { d: ARMS.downR } })}</g>
              <g class="clap-b">${pFig({ l: { d: ARMS.hipL }, r: { d: ARMS.pointR, hand: "open", front: true } })}</g>
            </g>
            <g class="clap-t">
              <g class="clap-a">${tFig({ l: { d: ARMS.downL }, r: { d: ARMS.hipR } })}</g>
              <g class="clap-b">${tFig({ l: { d: "M-40,-116 Q-70,-130 -90,-150", hand: "open", front: true }, r: { d: ARMS.hipR } })}</g>
            </g>
            <g class="clap-spark">
              <path d="M246,136 L239,128 M260,132 L260,120 M274,136 L281,128" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round"/>
              ${P.stars([[260, 106, 0.85, C.orange]])}
            </g>
            ${P.bubble("bubble-p", 6, 30, w(pSay), pSay, "#fff", [112, 92])}
            ${P.bubble("bubble-t", 520 - 6 - Math.max(150, w(tSay)), 30, Math.max(150, w(tSay)), tSay, C.orange, [392, 92])}`
        };
      }
      if (v === "side") return {
        vb: "0 0 520 340",
        svg: `${bg}
          ${figure({ who: "P", x: 180, y: 318, legs: "stand", mood: d.pmood || "happy", look: [6, -4], tilt: -4,
            arms: { l: { d: ARMS.upL, hand: "open" }, r: { d: ARMS.downR } }, cls: "pt-sway" })}
          ${figure({ who: "T", x: 340, y: 318, legs: "stand", mood: d.tmood || "excited", look: [-6, -4], tilt: 4, marks: ["sparkles"],
            arms: { l: { d: ARMS.downL }, r: { d: ARMS.pointUpR, hand: "point" } }, cls: "pt-hop-small" })}
          ${P.bubble("bubble-p", 10, 30, w(pSay), pSay, "#fff", [130, 88])}
          ${P.bubble("bubble-t", 520 - 10 - Math.max(150, w(tSay)), 30, Math.max(150, w(tSay)), tSay, C.orange, [392, 88])}`
      };
      return {
        vb: "0 0 520 340",
        svg: `${bg}
          ${P.cube(160, 318, 108, 74, "")}
          ${figure({ who: "P", x: 160, y: 318, legs: "sit", mood: pm, look: [10, -10], tilt: -8,
            arms: { l: { d: ARMS.kneeL }, r: { d: ARMS.chinR, front: true } }, cls: "pt-sway" })}
          ${figure({ who: "T", x: 380, y: 296, ground: 22, legs: "jump", mood: tm, look: [8, -12], tilt: 7, marks: tm === "excited" ? ["bulb", "sparkles"] : undefined,
            arms: { l: { d: ARMS.upL, hand: "open" }, r: { d: ARMS.pointUpR, hand: "point" } }, cls: "pt-hop" })}
          ${P.bubble("bubble-p", 14, 40, w(pSay), pSay, "#fff", [112, 98])}
          ${P.bubble("bubble-t", 196, 0, Math.max(150, w(tSay)), tSay, C.orange, [318, 62])}`
      };
    },
    branding: () => ({
      vb: "0 0 440 300",
      svg: `${P.easel}
        ${figure({ who: "P", x: 92, y: 284, mood: "skeptical", look: [14, -2], tilt: 6,
          arms: { l: { d: "M-40,-116 Q-68,-128 -60,-162" }, r: { d: ARMS.chinR, front: true } },
          props: { front: P.swatches(-60, -168) } })}
        ${figure({ who: "T", x: 222, y: 284, legs: "stride", mood: "excited", look: [16, -6], tilt: 4, marks: ["sparkles"],
          arms: { l: { d: ARMS.hipL }, r: { d: "M40,-116 Q64,-120 70,-142", front: true } }, props: { front: P.brush } })}`
    }),
    plutoNight: () => ({
      vb: "0 0 440 300",
      svg: `<rect width="440" height="300" rx="28" fill="url(#pt-night)"/>
        ${P.stars([[60, 110, 0.6], [380, 120, 0.8], [220, 96, 0.5], [120, 160, 0.4, C.orange]])}
        <path d="M392,62 a22,22 0 1 0 14,38 a17,17 0 1 1 -14,-38 z" fill="#fff"/>
        ${P.lights(440)}
        <path d="M60,286 Q50,214 128,210 Q206,206 204,286 Z" fill="#fff" ${out(2.5)}/><path d="M92,226 q14,20 0,58 M162,222 q-12,26 0,62" fill="none" stroke="${C.ink}" stroke-width="2" opacity=".35"/>
        ${figure({ who: "P", x: 130, y: 286, legs: "sit", mood: "happy", look: [12, -4], tilt: -5, marks: ["notes"],
          arms: { l: { d: "M-40,-116 Q-66,-96 -52,-72" }, r: { d: "M40,-116 Q62,-86 30,-90", front: true } }, props: { front: P.mug(34, -88) } })}
        ${figure({ who: "T", x: 318, y: 286, legs: "stride", mood: "laugh", tilt: -6, marks: ["sparkles"], cls: "pt-groove",
          arms: { l: { d: ARMS.upL, hand: "open" }, r: { d: "M40,-116 Q64,-140 30,-148", front: true } }, props: { front: P.mic(36, -150, -30) } })}`
    }),
    pr: () => ({
      vb: "0 0 440 300",
      svg: `${figure({ who: "T", x: 110, y: 284, legs: "stride", mood: "determined", look: [14, -4], tilt: 4, marks: ["lines"],
          arms: { l: { d: ARMS.hipL }, r: { d: "M40,-116 Q66,-120 80,-132", front: true } }, props: { front: P.megaphone } })}
        ${figure({ who: "P", x: 352, y: 284, mood: "excited", look: [-12, 2], tilt: -6, marks: ["excl"], cls: "pt-hop-small",
          arms: { l: { d: "M-40,-116 Q-62,-96 -40,-100", front: true }, r: { d: "M40,-116 Q62,-96 40,-100", front: true } },
          props: { front: `<g transform="translate(0 6)">${P.news}</g>` } })}`
    }),
    tuto: () => ({
      vb: "0 0 440 300",
      svg: `${P.sprout(36, 284)}${P.gear(240, 60, 0.9)}${P.gear(268, 92, 0.55)}
        ${P.cube(150, 284, 104, 64, "T")}
        ${figure({ who: "P", x: 150, y: 284, legs: "sit", mood: "determined", look: [0, 8], marks: ["code"],
          arms: { l: { d: "M-40,-116 Q-56,-86 -30,-72", front: true }, r: { d: "M40,-116 Q56,-86 30,-72", front: true } },
          props: { back: "", front: `<g transform="translate(0 4)">${P.laptop}</g>` } })}
        ${figure({ who: "T", x: 310, y: 284, legs: "stride", mood: "excited", look: [12, -10], tilt: 5, marks: ["excl"],
          arms: { l: { d: ARMS.upL }, r: { d: "M40,-116 Q70,-132 88,-152", hand: "point" } }, props: { front: P.wrench(-66, -186, -20) } })}
        ${P.rocket(404, 150)}`
    }),
    production: () => ({
      vb: "0 0 440 300",
      svg: `${P.film}${P.softbox}
        ${figure({ who: "P", x: 150, y: 284, legs: "stride", mood: "excited", look: [14, -6], tilt: 5, marks: ["excl"],
          arms: { l: { d: ARMS.hipL }, r: { d: "M40,-116 Q66,-128 70,-150" } }, props: { front: P.clapper } })}
        ${figure({ who: "T", x: 330, y: 284, mood: "cool", tilt: -6,
          arms: { l: { d: "M-40,-116 Q-62,-100 -50,-112", front: true }, r: { d: "M40,-116 Q20,-92 -14,-108", front: true } },
          props: { front: P.camera } })}`
    }),
    waiting: () => ({
      vb: "0 0 360 240",
      svg: `${P.cube(130, 230, 104, 64, "P")}
        ${figure({ who: "P", x: 130, y: 230, s: 0.8, legs: "sit", mood: "sleepy", tilt: -10,
          arms: { l: { d: ARMS.kneeL }, r: { d: ARMS.chinR, front: true } }, cls: "pt-sway" })}
        ${figure({ who: "T", x: 270, y: 230, s: 0.8, legs: "stand", mood: "shocked", look: [-12, 4], tilt: -4, cls: "pt-hop-small",
          arms: { l: { d: "M-40,-116 Q-70,-124 -76,-150", hand: "point" }, r: { d: ARMS.hipR } } })}`
    }),
    hello: () => ({
      vb: "-120 -300 300 310",
      svg: `${P.stars([[110, -250, 1, C.orange], [-90, -220, 0.7]])}${figure({ who: "T", x: 0, y: 0, mood: "happy", look: [-6, -4], tilt: -6, marks: ["sparkles"],
        arms: { l: { d: ARMS.hipL }, r: { d: "M40,-116 Q70,-140 66,-182", hand: "open", cls: "" } }, cls: "pt-wave-fig" })}
        ${P.bubble("bubble-hi", 50, -296, 120, "Hey there!", C.orange, [66, -236])}`
    }),
    // The journey stage: a brand's story with Pluto Theory. Meet, plan (friction), spark, build, ship (execute), bond (a happier brand)
    journey: (_, d = {}) => {
      const step = d.step || "meet";
      const L = (d2, hand) => ({ d: d2, hand });
      // The client brand: a little box that starts grey and worried and ends colourful and happy
      const brand = (st) => {
        const colour = st === "ship" || st === "bond";
        const body = colour ? C.orange : "#D6D6DE";
        const eyes = st === "bond"
          ? `<path d="M-19,-64 q5,-7 10,0 M9,-64 q5,-7 10,0" fill="none" ${out(3.5)}/>`
          : `<circle cx="-14" cy="-64" r="${st === "spark" ? 6 : 5}" fill="${C.ink}"/><circle cx="14" cy="-64" r="${st === "spark" ? 6 : 5}" fill="${C.ink}"/><circle cx="-12" cy="-66" r="1.8" fill="#fff"/><circle cx="16" cy="-66" r="1.8" fill="#fff"/>`;
        const mouth = {
          meet: `<path d="M-9,-44 q9,-7 18,0" fill="none" ${out(3)}/><path d="M-22,-74 l10,3 M22,-74 l-10,3" ${out(2.5)}/>`,
          friction: `<path d="M-8,-46 h16" ${out(3)}/>`,
          spark: `<ellipse cx="0" cy="-45" rx="6" ry="7" fill="${C.ink}"/>`,
          build: `<path d="M-9,-47 q9,7 18,0" fill="none" ${out(3)}/>`,
          ship: `<path d="M-13,-50 q13,16 26,0 z" fill="${C.ink}" ${out(2.5)}/>`,
          bond: `<path d="M-14,-50 q14,18 28,0 z" fill="${C.ink}" ${out(2.5)}/><path d="M-6,-44 q6,-4 12,0" fill="${C.orange}"/>`
        }[st];
        const paint = st === "build"
          ? `<clipPath id="pt-brand-clip"><rect x="-38" y="-96" width="76" height="76" rx="20"/></clipPath><g clip-path="url(#pt-brand-clip)"><g class="j-paint"><rect x="-38" y="-96" width="76" height="26" fill="${C.purple}"/><rect x="-38" y="-70" width="76" height="18" fill="${C.green}"/><rect x="-38" y="-52" width="44" height="32" fill="${C.orange}"/></g></g>`
          : "";
        const logo = colour ? `<g transform="translate(24 -30)"><circle r="9" fill="#fff" ${out(2)}/><path d="M0,-6 L1.7,-1.7 L6,0 L1.7,1.7 L0,6 L-1.7,1.7 L-6,0 L-1.7,-1.7 Z" fill="${C.purple}"/></g>` : "";
        const blush = st === "bond" || st === "ship" ? `<ellipse cx="-24" cy="-50" rx="7" ry="4" fill="#fff" opacity=".45"/><ellipse cx="24" cy="-50" rx="7" ry="4" fill="#fff" opacity=".45"/>` : "";
        const extra = st === "meet"
          ? `<text x="40" y="-96" font-family="League Spartan, sans-serif" font-weight="800" font-size="28" fill="${C.ink}">?</text><path d="M-44,-80 q-6,10 0,13 q6,-3 0,-13 z" fill="#fff" ${out(2)}/>`
          : st === "bond" ? `${heart(-46, -100, 0.9)}${heart(48, -110, 1.1)}${heart(0, -126, 0.8)}` : "";
        return `<g transform="translate(260 286)"><g class="j-brand">
          <path d="M-14,-22 L-16,-2 M14,-22 L16,-2" ${out(5)}/><path d="M-24,-1 h14 M10,-1 h14" ${out(5)}/>
          <path d="M-38,-62 l-16,${colour ? -18 : 10} M38,-62 l16,${colour ? -18 : 10}" ${out(5)}/>
          <rect x="-38" y="-96" width="76" height="76" rx="20" fill="${body}" ${out(3)}/>
          ${paint}
          <rect x="-38" y="-96" width="76" height="76" rx="20" fill="url(#pt-shade)"/>
          ${logo}${blush}${eyes}${mouth}${extra}
        </g></g>`;
      };
      const POSES = {
        meet: { P: ["excited", [10, 0], { l: L(ARMS.downL), r: L("M40,-116 Q70,-140 66,-180", "open") }], T: ["happy", [-10, 2], { l: L("M-40,-116 Q-72,-122 -88,-110", "open"), r: L(ARMS.downR) }], prop: "" },
        friction: { P: ["excited", [10, -10], { l: L(ARMS.downL), r: L("M40,-116 Q70,-150 80,-184", "point") }], T: ["thinking", [-10, -10], { l: L(ARMS.hipL), r: L(ARMS.chinR, null) }],
          prop: `<g class="j-board"><path d="M214 128 L206 176 M306 128 L314 176" ${out(3)}/><rect x="196" y="34" width="128" height="94" rx="8" fill="#fff" ${out(3)}/>
            <path d="M210 54 h46 M210 68 h32 M210 82 h40" ${out(3)} opacity=".55"/><rect x="270" y="48" width="40" height="28" rx="5" fill="${C.green}" ${out(2)}/>
            <path d="M226 110 q26 -22 58 -8" fill="none" stroke="${C.purple}" stroke-width="4" stroke-linecap="round"/><path d="M278 96 l8 6 -9 4" fill="none" stroke="${C.purple}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g>` },
        spark: { P: ["shocked", [12, -12], { l: L(ARMS.downL), r: L("M40,-116 Q76,-150 96,-176", "point") }], T: ["excited", [-12, -12], { l: L("M-40,-116 Q-76,-150 -96,-176", "point"), r: L(ARMS.downR) }],
          prop: `<g class="j-bulb"><g transform="translate(260 300)">${MARKS.bulb}</g></g>${P.stars([[206, 70, 0.8, C.orange], [316, 60, 0.7]])}` },
        build: { P: ["determined", [14, 6], { l: L(ARMS.downL), r: L("M40,-116 Q64,-120 70,-142") }], T: ["determined", [-14, 6], { l: L("M-40,-116 Q-66,-112 -78,-98"), r: L(ARMS.downR) }],
          prop: `${P.gear(178, 92, 0.7)}${P.gear(344, 84, 0.55)}${P.gear(368, 112, 0.35)}` },
        ship: { P: ["excited", [10, -8], { l: L(ARMS.upL, "open"), r: L(ARMS.upR, "open") }], T: ["cool", [0, -6], { l: L(ARMS.upL, "open"), r: L(ARMS.upR, "open") }],
          prop: `<g class="j-spot"><path d="M170 0 L224 280 H300 Z M350 0 L220 280 H296 Z" fill="${C.orange}" opacity=".16"/></g>
            <g class="j-live"><rect x="230" y="22" width="60" height="26" rx="13" fill="${C.orange}" ${out(2.5)}/><circle cx="244" cy="35" r="4" fill="#fff"/><text x="252" y="41" font-family="League Spartan, sans-serif" font-weight="800" font-size="14" fill="${C.ink}">LIVE</text></g>
            ${P.stars([[190, 70, 0.9, C.orange], [330, 80, 0.8, C.green], [300, 40, 0.6]])}` },
        bond: { P: ["love", [12, 0], { l: L(ARMS.downL), r: L(ARMS.upR, "open") }], T: ["happy", [-12, 0], { l: L(ARMS.upL, "open"), r: L(ARMS.downR) }],
          prop: P.stars([[180, 90, 0.9, C.orange], [340, 70, 0.8, C.green], [220, 50, 0.6], [310, 130, 0.5, C.purple]]) }
      };
      const p = POSES[step] || POSES.meet;
      const fig = (who, x, pose) => figure({ who, x, y: 286, s: 0.74, mood: pose[0], look: pose[1], arms: pose[2], marks: [],
        props: who === "P" && step === "build" ? { front: P.brush } : who === "T" && step === "build" ? { front: P.wrench(-82, -96, -50) } : {} });
      return {
        vb: "0 0 520 300",
        svg: `<ellipse cx="260" cy="290" rx="230" ry="8" fill="${C.ink}" opacity=".06"/>
          ${p.prop}
          ${fig("P", 104, p.P)}
          ${fig("T", 416, p.T)}
          ${brand(step)}`
      };
    },
    portraitP: (mood) => ({
      vb: "-100 -276 200 230",
      svg: figure({ who: "P", x: 0, y: 0, mood: mood || "thinking", look: [10, -8], tilt: -6, arms: { l: { d: ARMS.downL }, r: { d: ARMS.chinR, front: true } } })
    }),
    portraitT: (mood) => ({
      vb: "-100 -276 200 230",
      svg: figure({ who: "T", x: 0, y: 0, mood: mood || "excited", look: [8, -10], tilt: 6, arms: { l: { d: ARMS.hipL }, r: { d: "M40,-116 Q64,-140 74,-170", hand: "point" } } })
    })
  };

  function render(el) {
    const make = SCENES[el.dataset.scene];
    if (!make) return;
    const { vb, svg } = make(el.dataset.mood, el.dataset);
    el.innerHTML = `<svg viewBox="${vb}" aria-hidden="true" overflow="visible">${svg}</svg>`;
  }
  document.querySelectorAll(".pt-scene").forEach(render);
  window.PT = { render };

  // ---------- The Chaos Console: Plu and Theo's website tour (scene data in conversation.js) ----------
  const DIALOG = window.PT_SCENES;
  const stage = document.querySelector(".stage");
  if (stage && DIALOG) {
    const NAMES = { P: "Plu", T: "Theo" };
    const $ = (sel) => stage.querySelector(sel);
    const chat = $(".stage-chat"), choicesEl = $(".stage-replies");
    const chars = { P: $(".stage-char.is-P"), T: $(".stage-char.is-T") };
    const faces = { P: chars.P.querySelector(".stage-face"), T: chars.T.querySelector(".stage-face") };
    const ui = {
      skip: $(".stage-skip"), back: $(".u-back"), restart: $(".u-restart"), explore: $(".u-explore"), close: $(".u-close"),
      voice: $(".stage-voice"), chaos: $(".stage-chaos"), latest: $(".stage-latest"), sticker: $(".stage-sticker"), note: $(".stage-voice-note")
    };
    const reopen = document.querySelector(".stage-reopen");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sfx = (n) => window.ptSound && window.ptSound(n);
    const ROUTES = {
      portfolio: "/work", services: "/what-we-are", story: "/what-we-are", contact: "/contact",
      branding: "/what-we-are#branding", pr: "/what-we-are#pluto-times", night: "/what-we-are#pluto-night"
    };
    const CHAOS = [[0, "Mildly suspicious"], [3, "Questionable"], [6, "HR notified"], [10, "Iconic"]];
    const KEY = "pt-chaos-console";

    // ---- state ----
    let st = { scene: null, history: [], chaos: 0, visited: [] };
    try { const saved = JSON.parse(sessionStorage.getItem(KEY) || "null"); if (saved && DIALOG[saved.scene]) st = saved; } catch (_) {}
    const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch (_) {} };
    let token = 0, skipping = false, locked = false, started = false;
    const sleep = (ms, my) => new Promise((r) => setTimeout(() => r(my === token), ms));

    // ---- voices: on by default, the visitor can switch them off ----
    const synth = window.speechSynthesis;
    let voiceOn = true;
    try { voiceOn = localStorage.getItem("pt-voice") !== "off"; } catch (_) {}
    let voices = [];
    const loadVoices = () => (voices = synth ? synth.getVoices().filter((v) => /^en/i.test(v.lang)) : []);
    if (synth) { loadVoices(); synth.addEventListener?.("voiceschanged", loadVoices); }
    // Neural/"Natural" voices sound human; pitch shifting makes them robotic, so pitch stays at 1.
    const HUMAN = /(Premium|Enhanced|Natural|Neural|Online)/i;
    const VOICE = {
      P: { names: ["Microsoft Andrew", "Microsoft Brian", "Microsoft Christopher", "Microsoft Eric", "Microsoft Guy", "Evan", "Nathan", "Tom", "Aaron", "Google US English", "Alex", "Microsoft Mark"], pitch: 1, rate: 1.04 },
      T: { names: ["Microsoft Ryan", "Microsoft Thomas", "Microsoft William", "Microsoft Liam", "Oliver", "Daniel", "Arthur", "Google UK English Male", "Rishi", "Microsoft David"], pitch: 1, rate: 0.97 }
    };
    const picked = {};
    const pickVoice = (who) => {
      if (picked[who] && voices.includes(picked[who])) return picked[who];
      const names = VOICE[who].names, other = picked[who === "P" ? "T" : "P"];
      const find = (test) => { for (const n of names) { const v = voices.find((x) => x !== other && x.name.startsWith(n) && test(x)); if (v) return v; } return null; };
      return (picked[who] = find((x) => HUMAN.test(x.name)) || find(() => true));
    };
    const sayable = (t) => t.replace(/([a-z])\1{2,}/gi, "$1$1").replace(/\b[A-Z]{2,}\b/g, (w) => (/^(TED|PR|AI|OK|HR)$/.test(w) ? w : w.toLowerCase())).replace(/[“”‘’]/g, "'");
    // Recorded lines (made by scripts/generate-voices.mjs) live in voices/<id>.mp3, listed in voices/manifest.js.
    // The id is a hash of speaker + text, so an edited line falls back to the browser voice until it is re-recorded.
    const FILES = window.PT_VOICE_FILES || {};
    const lineId = (who, text) => {
      let h = 0x811c9dc5;
      for (const c of `${who}|${text}`) { h ^= c.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
      return h.toString(16).padStart(8, "0");
    };
    // Clips play through one Web Audio context, not a new <audio> element per line: Safari on iPhone/iPad
    // blocks every new element that wasn't started by a tap, but a context unlocked by one tap stays unlocked.
    // Clips are downloaded and decoded ahead of time (see prefetch), so a line's voice starts with its bubble.
    const VER = window.PT_VOICE_VERSION || 1; // changes when the clips are re-recorded, so browsers fetch the new ones
    const AC = window.AudioContext || window.webkitAudioContext;
    const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    let actx = null;
    const getCtx = () => {
      if (!actx && AC) { try { actx = new AC(); } catch (_) {} }
      return actx;
    };
    const decoder = OAC ? new OAC(1, 1, 24000) : null; // decodes without needing a tap first
    const clips = new Map(); // id -> Promise<AudioBuffer | null>
    const loadClip = (id) => {
      if (!FILES[id] || !decoder) return Promise.resolve(null);
      if (!clips.has(id)) {
        clips.set(id, fetch(`voices/${id}.mp3?v=${VER}`)
          .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(r.status)))
          .then((ab) => new Promise((res, rej) => decoder.decodeAudioData(ab, res, rej)))
          .catch(() => { clips.delete(id); return null; })); // forget failures so a later line can retry
      }
      return clips.get(id);
    };
    let current = null; // the clip playing right now: { finish(ok) }
    const stopVoice = () => {
      if (synth) synth.cancel();
      if (current) current.finish(true);
    };
    window.ptStopVoice = stopVoice;
    function playClip(id, whisper) {
      if (current) current.finish(true);
      return new Promise((resolve) => {
        let done = false, src = null;
        const me = {
          finish(ok) {
            if (done) return;
            done = true;
            if (current === me) current = null;
            try { src && src.stop(); } catch (_) {}
            resolve(ok);
          }
        };
        current = me;
        const ctx = getCtx();
        if (!ctx) return me.finish(false);
        // Some Safari versions never settle resume() without a tap, so don't wait on it for long.
        const ready = ctx.state === "running" ? Promise.resolve()
          : Promise.race([ctx.resume().catch(() => {}), new Promise((r) => setTimeout(r, 400))]);
        Promise.all([loadClip(id), ready]).then(([buf]) => {
          if (done) return; // stopped while loading
          if (ctx.state !== "running") { blocked = true; askForTap(); return me.finish(false); }
          if (!buf) return me.finish(false);
          src = ctx.createBufferSource();
          src.buffer = buf;
          const g = ctx.createGain();
          g.gain.value = whisper ? 0.6 : 1;
          src.connect(g).connect(ctx.destination);
          src.onended = () => me.finish(true);
          src.start();
        });
      });
    }
    // Download the scene's clips plus the first lines of every scene a reply can lead to.
    const sayLines = (sceneId, n) => (DIALOG[sceneId]?.lines || []).filter((l) => /[a-z]/i.test(l.t)).slice(0, n);
    function prefetch(sceneId) {
      if (!voiceOn || (window.ptSoundOn && !window.ptSoundOn())) return;
      const scene = DIALOG[sceneId];
      if (!scene) return;
      sayLines(sceneId, 99).forEach((l) => loadClip(lineId(l.s, l.t)));
      (scene.choices || []).forEach(([, to]) => sayLines(to, 2).forEach((l) => loadClip(lineId(l.s, l.t))));
    }
    // Browsers only allow sound after the visitor has clicked or tapped the page (scrolling doesn't count),
    // so until then the chat runs silently with a hint, and the first tap anywhere unlocks the voices.
    // Every tap also re-wakes the audio if the phone paused it (a call, switching apps, the screen locking).
    let blocked = false;
    const soundAllowed = () => !blocked && (navigator.userActivation ? navigator.userActivation.hasBeenActive : true);
    const askForTap = () => {
      ui.note.hidden = false;
      ui.note.textContent = "🔈 Tap anywhere to hear Plu and Theo";
      ui.note.classList.add("is-tap");
    };
    const unlock = () => {
      blocked = false;
      if (navigator.audioSession) { try { navigator.audioSession.type = "playback"; } catch (_) {} } // iPhone: play even on silent mode, like a video
      const ctx = getCtx();
      if (ctx && ctx.state !== "running") ctx.resume().catch(() => {});
      if (ui.note.classList.contains("is-tap")) ui.note.hidden = true;
    };
    addEventListener("pointerdown", unlock, true);
    addEventListener("keydown", unlock, true);
    addEventListener("touchend", unlock, true); // older iOS only unlocks audio on touchend
    // Voices only play while the chat is on screen; scrolling away silences them (the text keeps going).
    let inView = false;
    new IntersectionObserver((entries) => {
      inView = entries[entries.length - 1].isIntersecting;
      if (!inView) stopVoice();
      else if (!started) prefetch(st.scene && st.scene !== "OPENING" ? "WELCOME_BACK" : "OPENING"); // get the first lines ready
    }, { threshold: 0.25 }).observe(stage);
    async function speak(who, text, rx) {
      if (!voiceOn || !inView || stage.hidden || !/[a-z]/i.test(text)) return;
      if (window.ptSoundOn && !window.ptSoundOn()) return; // the site-wide mute button silences the voices too
      if (!soundAllowed()) return askForTap();
      const id = lineId(who, text);
      // A recorded line never falls back to the robotic browser voice mid-chat; if its clip can't load it stays quiet.
      if (FILES[id]) return void (await playClip(id, rx.includes("whisper")));
      if (!synth || blocked) return;
      return new Promise((resolve) => {
        const u = new SpeechSynthesisUtterance(sayable(text));
        const cfg = VOICE[who], whisper = rx.includes("whisper");
        u.voice = pickVoice(who);
        u.pitch = cfg.pitch; u.rate = cfg.rate * (whisper ? 0.94 : 1); u.volume = whisper ? 0.4 : 0.6;
        const done = () => { clearTimeout(guard); resolve(); };
        const guard = setTimeout(done, text.length * 95 + 1800);
        u.onend = done; u.onerror = done;
        synth.speak(u);
      });
    }
    const syncVoiceBtn = () => {
      ui.voice.textContent = voiceOn ? "Voices on 🔈" : "Voices off 🔇";
      ui.voice.setAttribute("aria-pressed", voiceOn);
    };
    syncVoiceBtn();
    ui.voice.addEventListener("click", () => {
      if (!synth && !Object.keys(FILES).length) { ui.note.hidden = false; ui.note.classList.remove("is-tap"); ui.note.textContent = "Our voices are on a coffee break. Reading still works."; return; }
      voiceOn = !voiceOn;
      try { localStorage.setItem("pt-voice", voiceOn ? "on" : "off"); } catch (_) {}
      if (!voiceOn) { stopVoice(); if (ui.note.classList.contains("is-tap")) ui.note.hidden = true; }
      syncVoiceBtn();
    });
    document.addEventListener("visibilitychange", () => { if (document.hidden) stopVoice(); });

    // ---- expressions ----
    const RX_MOOD = { smile: "happy", gasp: "shocked", wiggle: "excited", blink: "sleepy", sideEye: "skeptical", smug: "cool", facepalm: "determined", whisper: "wink", suspense: "thinking", dramatic: "excited" };
    function moodFor(who, text, rx) {
      if (rx.includes("soft")) return who === "P" ? "love" : "happy";
      for (const r of rx) if (RX_MOOD[r]) return RX_MOOD[r];
      const shout = /[A-Z]{3,}/.test(text.replace(/\b(HR|PR|AI|TED)\b/g, ""));
      if (who === "P") return shout || text.includes("!") ? "excited" : text.includes("?") ? "thinking" : "happy";
      return text.includes("?") ? "thinking" : shout ? "shocked" : "skeptical";
    }
    const setFace = (who, m) => {
      const el = faces[who];
      if (!el || el.dataset.mood === m) return;
      el.dataset.mood = m;
      render(el);
      el.className = el.className.replace(/\bmood-\S+/g, "").trim() + ` mood-${m}`;
    };
    function react(who, rx) {
      const c = chars[who];
      c.className = c.className.replace(/\brx-\S+/g, "").trim();
      void c.offsetWidth;
      c.classList.add(`rx-${rx[0] || "pop"}`);
    }

    // ---- stickers: one at a time, auto-dismiss ----
    let stickerTimer;
    function sticker(text, where = "center", ms = 2600) {
      clearTimeout(stickerTimer);
      ui.sticker.textContent = text;
      ui.sticker.dataset.where = where;
      ui.sticker.hidden = false;
      ui.sticker.classList.remove("is-in"); void ui.sticker.offsetWidth; ui.sticker.classList.add("is-in");
      stickerTimer = setTimeout(() => (ui.sticker.hidden = true), ms);
    }

    // ---- chat log ----
    const nearBottom = () => chat.scrollHeight - chat.scrollTop - chat.clientHeight < 90;
    function append(node) {
      const stick = nearBottom();
      chat.appendChild(node);
      if (stick) { chat.scrollTop = chat.scrollHeight; ui.latest.hidden = true; } else ui.latest.hidden = false;
    }
    chat.addEventListener("scroll", () => { if (nearBottom()) ui.latest.hidden = true; });
    ui.latest.addEventListener("click", () => { chat.scrollTop = chat.scrollHeight; ui.latest.hidden = true; });
    function separator(text) {
      if (!chat.querySelector(".stage-msg")) return;
      const d = document.createElement("p");
      d.className = "stage-sep"; d.textContent = text;
      append(d);
    }
    function bubble(who, text) {
      const row = document.createElement("div");
      row.className = `stage-msg is-${who}`;
      const prev = chat.lastElementChild;
      if (prev && prev.classList.contains(`is-${who}`)) row.classList.add("is-cont");
      row.innerHTML = `<span class="stage-av" aria-hidden="true">${who}</span><p><b class="sr">${NAMES[who]}: </b><b aria-hidden="true">${NAMES[who]}</b></p>`;
      row.querySelector("p").append(document.createTextNode(text));
      append(row);
      return row;
    }
    function typing(who) {
      const row = document.createElement("div");
      row.className = `stage-msg is-${who} is-typing`;
      row.setAttribute("aria-hidden", "true");
      row.innerHTML = `<span class="stage-av">${who}</span><p><i class="dots"><i></i><i></i><i></i></i></p>`;
      append(row);
      return row;
    }
    function you(text) {
      const row = document.createElement("div");
      row.className = "stage-msg is-you";
      const p = document.createElement("p");
      p.innerHTML = '<b class="sr">You: </b>';
      p.append(document.createTextNode(text));
      row.appendChild(p);
      append(row);
    }
    const setChaos = () => {
      const label = CHAOS.filter(([n]) => st.chaos >= n).pop()[1];
      ui.chaos.textContent = `Chaos level: ${label}`;
    };

    // ---- playback ----
    async function play(id, opts = {}) {
      const scene = DIALOG[id];
      if (!scene) return;
      const my = ++token;
      stopVoice();
      locked = true;
      skipping = !!opts.instant;
      choicesEl.innerHTML = "";
      ui.skip.hidden = false;
      ui.back.disabled = st.history.length === 0;
      if (opts.sep) separator(opts.sep);
      st.scene = id;
      if (!st.visited.includes(id)) st.visited.push(id);
      save();
      prefetch(id);
      for (const line of scene.lines) {
        const rx = line.rx || [];
        if (!skipping && !reduced) {
          const t = typing(line.s);
          // While the voices talk, the spoken line already sets the pace, so only a short "typing…" beat between lines.
          const talking = voiceOn && inView && soundAllowed() && (!window.ptSoundOn || window.ptSoundOn());
          const pause = talking ? 250 + Math.random() * 200 : line.t.length < 40 ? 450 + Math.random() * 400 : 850 + Math.random() * 500;
          const ok = await sleep(pause, my);
          t.remove();
          if (!ok) return;
        } else if (my !== token) return;
        const other = line.s === "P" ? "T" : "P";
        setFace(line.s, moodFor(line.s, line.t, rx));
        setFace(other, other === "P" ? "happy" : "skeptical");
        react(line.s, rx);
        bubble(line.s, line.t);
        if (line.sticker && !skipping) sticker(line.sticker, line.s === "P" ? "left" : "right");
        if (!skipping) {
          chars[line.s].classList.add("is-talking");
          await speak(line.s, line.t, rx);
          chars[line.s].classList.remove("is-talking");
          if (my !== token) return;
        }
      }
      if (my !== token) return;
      skipping = false;
      ui.skip.hidden = true;
      showChoices(scene, my);
    }

    function showChoices(scene, my) {
      choicesEl.innerHTML = "";
      scene.choices.slice(0, 6).forEach(([label, to], k) => {
        const action = to.startsWith("ACTION:") ? to.slice(7) : null;
        const href = action && ROUTES[action];
        const el = document.createElement(href ? "a" : "button");
        el.className = "reply";
        el.style.setProperty("--k", k);
        el.textContent = label;
        if (href) el.href = href; else el.type = "button";
        el.addEventListener("click", (e) => {
          if (locked && my !== token) return;
          if (choicesEl.dataset.busy) { e.preventDefault(); return; }
          choicesEl.dataset.busy = "1";
          choicesEl.querySelectorAll(".reply").forEach((b) => b.setAttribute("aria-disabled", "true"));
          choose(label, to, href, e);
        });
        choicesEl.appendChild(el);
      });
      delete choicesEl.dataset.busy;
      locked = false;
      const first = choicesEl.querySelector(".reply");
      if (first && stage.contains(document.activeElement)) first.focus({ preventScroll: true });
    }

    function choose(label, to, href, e) {
      window.ptTrack?.("chat_choice", { choice: label, scene: st.scene });
      you(label);
      sfx("blip");
      st.chaos++;
      setChaos();
      if (st.chaos === 4) sticker("you are legally one of us now (not legally)", "center", 3200);
      const action = to.startsWith("ACTION:") ? to.slice(7) : null;
      if (!action) {
        st.history.push(st.scene);
        save();
        if (DIALOG[to] && st.visited.includes(to) && st.chaos % 5 === 0) setTimeout(() => sticker("The plot thickens. The website doesn’t."), 400);
        return play(to, { sep: "Meanwhile…" });
      }
      if (action === "resume") {
        const prev = st.resumeScene || "OPENING";
        return play(prev, { sep: "Where were we…", instant: true });
      }
      if (href) {
        save();
        sticker("Plu: Adventure time!  ·  Theo: It’s a link, Plu.", "center", 1500);
        stopVoice();
        return; // the real link navigates (Cmd/Ctrl-click opens a new tab)
      }
      if (action === "exit") return exploreSite();
      if (action === "restart") return restart();
      if (action === "back") return goBack();
    }

    function goBack() {
      if (!st.history.length) return;
      const prev = st.history.pop();
      save();
      play(prev, { sep: "↶ Undoing that life choice…", instant: true });
    }
    function restart() {
      token++;
      stopVoice();
      chat.innerHTML = "";
      st = { scene: null, history: [], chaos: 0, visited: [] };
      setChaos(); save();
      play("OPENING");
    }
    function close(sayBye) {
      token++;
      stopVoice();
      stage.hidden = true;
      reopen.hidden = false;
      ui.sticker.hidden = true;
      if (sayBye) window.ptTrack?.("chat_close", { scene: st.scene });
      if (sayBye && window.ptPopup) window.ptPopup("close"); // the script's "when visitor closes popup" lines
    }
    function exploreSite() {
      close();
      document.querySelector(".pillars")?.closest("section")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }
    // Remember where the visitor was, but never "resume" into the welcome-back scene itself (that would loop).
    const markResume = () => { if (st.scene && st.scene !== "WELCOME_BACK") st.resumeScene = st.scene; };
    reopen.addEventListener("click", () => {
      stage.hidden = false;
      reopen.hidden = true;
      markResume();
      play("WELCOME_BACK", { sep: "Later…" });
    });

    // Coming back with the Back button after a reply opened another page: make the replies clickable again.
    addEventListener("pageshow", (e) => {
      if (!e.persisted) return;
      delete choicesEl.dataset.busy;
      choicesEl.querySelectorAll(".reply").forEach((b) => b.removeAttribute("aria-disabled"));
    });

    ui.skip.addEventListener("click", () => { skipping = true; stopVoice(); });
    ui.back.addEventListener("click", goBack);
    ui.restart.addEventListener("click", restart);
    ui.explore.addEventListener("click", exploreSite);
    ui.close.addEventListener("click", () => close(true));

    // Easter eggs: three pokes on a head within five seconds
    const pokes = { P: [], T: [] };
    ["P", "T"].forEach((who) => faces[who].addEventListener("click", () => {
      if (locked || stage.hidden || !started) return;
      const now = Date.now();
      pokes[who] = pokes[who].filter((t) => now - t < 5000).concat(now);
      react(who, ["gasp"]);
      if (pokes[who].length >= 3) {
        pokes[who] = [];
        st.history.push(st.scene);
        play(who === "P" ? "POKE_PLUTO" : "POKE_THEORY", { sep: "Meanwhile…" });
      }
    }));

    // Opening choreography: a silent look-around, Theo's whisper preview, then the scene
    async function open() {
      started = true;
      window.ptTrack?.("chat_start");
      setChaos();
      const my = ++token;
      if (st.scene && st.scene !== "OPENING") {
        markResume();
        return play("WELCOME_BACK");
      }
      setFace("P", "sleepy"); setFace("T", "thinking");
      stage.classList.add("is-looking");
      if (!(await sleep(900, my))) return;
      sticker("Psst. Plu. Wake up. Someone’s here.", "right", 1100);
      if (!(await sleep(1150, my))) return;
      ui.sticker.hidden = true;
      stage.classList.remove("is-looking");
      react("P", ["gasp"]);
      st.history = [];
      play("OPENING");
    }
    setChaos();
    const seen = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { seen.disconnect(); setTimeout(open, 2000); }
    }, { threshold: 0.4 });
    seen.observe(stage);
  }

  // Eyes follow the cursor
  if (matchMedia("(pointer: fine)").matches) {
    let px = 0, py = 0, queued = false;
    addEventListener("pointermove", (e) => {
      px = e.clientX; py = e.clientY;
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        document.querySelectorAll(".pt-track").forEach((t) => {
          const r = t.getBoundingClientRect();
          if (r.bottom < 0 || r.top > innerHeight) return;
          const dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height / 2);
          const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 300) * 7;
          t.style.transform = `translate(${(dx / d) * k}px, ${(dy / d) * k}px)`;
        });
      });
    }, { passive: true });
  }
})();

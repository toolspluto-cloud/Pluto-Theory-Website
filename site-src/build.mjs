// Builds every page of the site into static HTML.   node tools/build.mjs
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { convertBlog } from "./blog.mjs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PRODUCTS, GOALS } from "./products.mjs";
import { I, CURSOR, EMAIL, SITE, layout, words, btn, link, faq, productCard, cta, marquee, statusPill, esc } from "./lib.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const pages = [];
const page = (file, opts) => pages.push({ file, html: layout(opts), path: opts.path, noindex: opts.noindex });

/* ============ Shared components ============ */

const wsItem = (ico, color, t, sub, right) =>
  `<div class="ws-item"><span class="ws-ico ${color}">${I[ico]}</span><div><b>${t}</b><small>${sub}</small></div>${right}</div>`;
const approve = (label = "Approve") => `<button class="ws-btn" type="button" tabindex="-1">${label}</button>`;

const heroWorkspace = `
  <div class="ws-stage" data-reveal="scale" style="--d:3">
    <div class="ws" data-workspace>
      <div class="ws-top"><span class="eyebrow">Your marketing workspace</span><span class="ws-live"><i></i>Running</span></div>
      <h2>Know what needs you.</h2>
      <div class="ws-stats">
        <div class="ws-stat"><small>Running</small><b data-stat="run">4</b></div>
        <div class="ws-stat"><small>Ready for review</small><b data-stat="review">2</b></div>
        <div class="ws-stat"><small>Completed</small><b data-stat="done">9</b></div>
      </div>
      <div class="ws-feed">
        ${wsItem("lead", "", "A new enquiry has a next step.", "Lead captured · Owner assigned · Reply drafted", approve())}
        ${wsItem("seo", "o", "Page improvements ready", "SEO automation · 3 titles and descriptions", `<span class="st st--review">Ready for review</span>`)}
        ${wsItem("crm", "g", "Follow-ups organised for your team", "CRM follow-up · 4 next actions", `<span class="st st--done">Completed</span>`)}
      </div>
      <div class="ws-foot"><span>Illustrative workspace · sample activity</span><span>Important decisions stay visible.</span></div>
      <span class="ghost-cursor" aria-hidden="true">${CURSOR}</span>
    </div>
    <div class="ws-peek pt-scene" data-scene="portraitP" data-mood="happy" aria-hidden="true"></div>
  </div>
  <template id="ws-queue">
    ${wsItem("seo", "o", "3 page titles improved", "SEO automation · ready for your review", approve())}
    ${wsItem("post", "", "LinkedIn post drafted", "From your notes on pricing · Tue 9:00", approve())}
    ${wsItem("crm", "g", "2 follow-ups due today", "CRM follow-up · messages drafted", approve("Review"))}
    ${wsItem("pr", "o", "PR opportunity found", "Industry feature · angle prepared", approve())}
    ${wsItem("lead", "", "Enquiry from your website", "Qualified · routed to your sales team", approve())}
    ${wsItem("perf", "g", "Weekly campaign summary", "Performance · spend and results in one view", approve("Review"))}
  </template>`;

const productTicker = () => {
  const li = (h) => PRODUCTS.map((p) => `<li${h ? ' aria-hidden="true"' : ""}><span class="tick-item">${I[p.icon]}${p.name}</span></li>`).join("");
  return `<div class="marquee ticker"><ul>${li(false)}${li(true)}</ul></div>`;
};

const split7030 = (more = true) => `
  <div class="split" data-in>
    <div class="split-bar" role="img" aria-label="70% automations, 30% hands-on studio work">
      <div class="a"><b><span data-count="70">0</span>%</b><span>AI marketing<br>automations</span></div>
      <div class="b"><b><span data-count="30">0</span>%</b><span>Hands-on<br>studio work</span></div>
    </div>
    <div class="split-cols">
      <div class="split-col" data-reveal>
        <h3>The automations handle the work that repeats.</h3>
        <p>Subscription products we build and maintain in-house. Each one runs a defined marketing job on a schedule, on a trigger or when you click, and shows you what it did.</p>
        <div class="chips">${["Site checks", "Content briefs", "Post drafts", "Enquiry capture", "Lead routing", "Follow-ups", "Campaign checks", "Reports"].map((c) => `<span class="chip">${I.check}${c}</span>`).join("")}</div>
      </div>
      <div class="split-col split-col--b" data-reveal style="--d:1">
        <h3>Our team does the work that needs people.</h3>
        <p>Strategy, craft and relationships.</p>
        <div class="chips">${["Brand", "Shoots", "PR outreach", "Bespoke builds"].map((c) => `<span class="chip">${I.spark}${c}</span>`).join("")}</div>
      </div>
    </div>
    ${more ? `<p class="note-line" data-reveal>Most of what we build, sell and support is automation. The studio is there when the job needs a person. ${link("/studio", "Meet the studio")}</p>` : ""}
  </div>`;

/* --- Story: macOS-style app with four views --- */
const sideNav = (on) => {
  const items = [["layers", "Automations"], ["plug", "Connections"], ["sliders", "Rules"], ["eye", "Workspace", "3"]];
  return `<div class="app-side"><div class="app-brand"><i>P</i>Your business</div>
    ${items.map(([ic, t, b], i) => `<a class="${i === on ? "on" : ""}" data-side="${i}">${I[ic]}${t}${b ? `<span class="badge">${b}</span>` : ""}</a>`).join("")}
    <span class="grp">Account</span><a>${I.cal}Billing</a><a>${I.help}Support</a></div>`;
};
const VIEWS = [
  `<div class="view-h"><b>Choose an automation</b><span class="seg"><span>All</span><span>Discover</span><span>Enquiries</span></span></div>
   <div class="grid-autos">
     <div class="auto-tile pick"><b>SEO automation</b><small>Checks, improvements and reports on a schedule.</small><span class="add">+ Add</span></div>
     <div class="auto-tile"><b>Lead generation</b><small>Capture and route supported enquiries.</small><span class="add">+ Add</span></div>
     <div class="auto-tile"><b>CRM &amp; follow-up</b><small>Owners, stages and next actions.</small><span class="add">+ Add</span></div>
     <div class="auto-tile"><b>LinkedIn content</b><small>Drafts from your expertise, reviewed by you.</small><span class="add">+ Add</span></div>
   </div>`,
  `<div class="view-h"><b>Connect your business</b><small>2 of 3 connected</small></div>
   <div class="conn"><span class="ci">${I.globe}</span><div><b>Your website</b><small>Used for site checks and approved page changes</small></div><span class="st st--done">Connected</span></div>
   <div class="conn"><span class="ci">${I.chart}</span><div><b>Search data</b><small>Used for reporting impressions and clicks</small></div><span class="st st--done">Connected</span></div>
   <div class="conn"><span class="ci">${I.form}</span><div><b>Business details</b><small>Services, locations and the markets you serve</small></div><span class="cbtn go">Add details</span></div>
   <div class="perm">${I.shield}<span>Each connection is used only for the job this automation does. You can see what it is for before you connect.</span></div>`,
  `<div class="view-h"><b>Set your rules</b><small>SEO automation</small></div>
   <div class="rule"><div><b>Weekly site check</b><small>Every Monday, 7:00</small></div><span class="tog on"></span></div>
   <div class="rule"><div><b>Changes need my approval</b><small>Nothing goes live without a yes</small></div><span class="tog flip"></span></div>
   <div class="rule"><div><b>Prepare content briefs</b><small>Up to your plan's monthly limit</small></div><span class="tog on"></span></div>
   <div class="rule"><div><b>Apply simple fixes automatically</b><small>Switch on when you're ready</small></div><span class="tog"></span></div>`,
  `<div class="view-h"><b>Workspace</b><span class="seg"><span>This week</span><span>Month</span></span></div>
   <div class="kanban">
     <div class="kcol"><small>Running <span>2</span></small><div class="kcard" style="--k:0"><b>Site check</b><span class="st st--run">Running</span></div><div class="kcard" style="--k:1"><b>Enquiry routing</b><span class="st st--run">Running</span></div></div>
     <div class="kcol"><small>Ready for review <span>3</span></small><div class="kcard" style="--k:2"><b>3 page titles</b><span class="st st--review">Review</span></div><div class="kcard" style="--k:3"><b>Drafted reply</b><span class="st st--review">Review</span></div><div class="kcard" style="--k:4"><b>Content brief</b><span class="st st--review">Review</span></div></div>
     <div class="kcol"><small>Completed <span>2</span></small><div class="kcard" style="--k:5"><b>Weekly report</b><span class="st st--done">Done</span></div><div class="kcard" style="--k:6"><b>Follow-ups set</b><span class="st st--done">Done</span></div></div>
     <div class="kcol"><small>Needs attention <span>1</span></small><div class="kcard" style="--k:7"><b>Inbox disconnected</b><span class="st st--attn">Reconnect</span></div></div>
   </div>`
];
const app = (views, on) => `<div class="app"><div class="app-chrome"><i></i><i></i><i></i><small>Illustrative product · sample data</small></div>${sideNav(on)}<div class="app-main">${views}</div></div>`;

const STORY = [
  ["01 — Choose", "#8830D6", "Pick the marketing job you need help with.", "Start with one automation, like SEO, lead handling or CRM follow-up. Each has a defined scope, so you know what it does before you subscribe."],
  ["02 — Connect", "#2E9C4B", "Connect your business and the tools it needs.", "Add your business information and the accounts that automation needs. Nothing more. You'll know what each connection is for."],
  ["03 — Activate", "#E0662A", "Set the rules. Decide what needs you.", "Choose schedules, permissions and review steps. Start cautious: every action can wait for your approval until you're ready to let simple ones run."],
  ["04 — Keep track", "#9A5B2E", "See what ran, what's ready and what's next.", "Running, Ready for review, Completed, Needs attention. Plain statuses that reflect what actually happened, including when nothing ran."]
];
const story = () => `
  <div class="story" data-story>
    <div class="story-steps">
      ${STORY.map(([e, c, h, p], i) => `<div class="story-step${i === 0 ? " is-active" : ""}" data-step="${i}" style="--c:${c}">
        <span class="eyebrow eyebrow--num">${e}</span><h3>${h}</h3><p class="note-box">${p}</p>
        <div class="panel-m"><div class="panel" data-step="${i}">${app(`<div class="view" data-view="${i}">${VIEWS[i]}</div>`, i)}</div></div>
      </div>`).join("")}
    </div>
    <div class="story-pin"><div class="panel" data-step="0" data-panel>${app(VIEWS.map((v, i) => `<div class="view${i === 0 ? " is-on" : ""}" data-view="${i}">${v}</div>`).join(""), 0)}</div></div>
  </div>`;

/* --- Phone mocks for the task cards --- */
const phone = (inner) => `<div class="phone"><div class="phone-scr"><div class="phone-bar"><span>9:41</span><span class="isl"></span><span class="sig"><i style="height:5px"></i><i style="height:8px"></i><i style="height:11px"></i></span></div><div class="phone-in">${inner}</div></div></div>`;
const phoneSEO = phone(`<div class="phone-title"><b>SEO queue</b>${I.sliders.replace("<svg", '<svg width="20"')}</div><div class="phone-prog"><i></i></div>
  <div class="p-row"><div><b>Page title improvement</b><small>Services page</small></div><span class="st st--review">Review</span></div>
  <div class="p-row"><div><b>Content brief</b><small>"How much does it cost?"</small></div><span class="st st--run">Drafting</span></div>
  <div class="p-row"><div><b>Weekly site check</b><small>4 issues prioritised</small></div><span class="st st--done">Done</span></div>
  <div class="p-row"><div><b>Internal links</b><small>2 suggestions</small></div><span class="st st--review">Review</span></div>
  <div class="p-row"><div><b>Monthly report</b><small>Due Friday</small></div><span class="st st--soon">Next</span></div>`);
const phoneCRM = phone(`<div class="phone-title"><b>New enquiry</b><span class="st st--review">Needs review</span></div>
  <div class="p-card" style="margin-top:14px"><div class="p-card-h"><span class="p-av">AK</span><div><b style="font-size:13.5px">Website enquiry</b><small style="display:block;font-size:11.5px;color:var(--muted)">2 minutes ago</small></div></div>
  <div class="p-card-b"><div class="p-kv"><span>Stage</span><b>New enquiry</b></div><div class="p-kv"><span>Owner</span><b>Your sales team</b></div><div class="p-kv"><span>Next action</span><b>Review reply</b></div>
  <p style="margin-top:12px;font-size:11.5px;font-weight:700;color:var(--purple);letter-spacing:.08em;text-transform:uppercase">Drafted reply</p>
  <p class="typing" data-type="Thanks for getting in touch! Happy to help. Could you tell us a little about what you'd like to start with?"></p></div>
  <div class="p-actions"><span>Approve</span><span>Edit</span></div></div>`);

/* ============ Home ============ */
const home = () => `
<section class="hero dark" data-theme="dark">
  <div class="hero-sky" aria-hidden="true"></div>
  <div class="wrap hero-grid">
    <div>
      <span class="pill" data-reveal><span class="dot"></span>AI marketing automations. On subscription.</span>
      <h1 class="h-xl words" data-in><span class="line">${words("Marketing")}</span><span class="line">${words({ t: "in a click.", cls: "it" })}</span></h1>
      <p class="hero-sub" data-reveal style="--d:3">Get more marketing done with the team you have.</p>
      <p class="lede" data-reveal style="--d:4">Choose AI automations for SEO, leads, CRM and other recurring marketing work. Connect your business and keep the next step moving.</p>
      <div class="ctas" data-reveal style="--d:5">${btn("/automations", "Explore automations")}${btn("#how", "See how it works", "btn--ghost")}</div>
      <div class="hero-steps" data-reveal style="--d:6"><span><i>1</i>Choose what you need</span><span><i>2</i>Connect your tools</span><span><i>3</i>Activate</span></div>
    </div>
    ${heroWorkspace}
  </div>
  <div class="wrap strip" style="margin-top:clamp(56px,7vw,96px)" data-reveal="fade"><div class="strip-in"><p>${countWord(PRODUCTS.length)} automations for the marketing work that keeps coming back.</p>${productTicker()}</div></div>
</section>

<section class="section">
  <div class="wrap">
    <div class="head head--center">
      <span class="eyebrow" data-reveal>How Pluto Theory is built</span>
      <h2 class="h-lg words" data-in>${words("Automation does the 70%.<br>Our team does the 30%.")}</h2>
      <p class="lede" data-reveal>Most marketing work repeats. That is what our automations are for. The rest needs judgement and craft, and that is where our studio comes in.</p>
    </div>
    ${split7030()}
  </div>
</section>

<section class="section white">
  <div class="wrap mess">
    <div>
      <span class="eyebrow" data-reveal>The problem</span>
      <h2 class="h-lg words" data-in style="margin:18px 0 24px">${words("Your marketing shouldn't depend on remembering every task.")}</h2>
      <p class="lede" data-reveal>The next post. The new enquiry. The campaign report. The customer you meant to follow up with. Pluto Theory gives recurring marketing work a process, so the next step has somewhere to go.</p>
    </div>
    <div class="mess-board" data-scrub aria-label="Scattered tasks become an organised queue" role="img">
      <div class="queue-head"><b>This week</b><span>2 need you · 2 running · 1 done</span></div>
      ${[
        ["Write this week's LinkedIn post", "LinkedIn content · drafted from your notes", "post", "purple", "review", "Ready for review", 100, "#FFF6D1", "-60px", "-30px", "-9deg"],
        ["Reply to the new website enquiry", "Lead generation · owner assigned", "lead", "green", "done", "Completed", 100, "#F1E6FF", "70px", "40px", "7deg"],
        ["Pull the campaign report", "Performance · gathering this week's data", "perf", "orange", "run", "Running", 62, "#E3F7E4", "-40px", "70px", "-5deg"],
        ["Follow up with last month's leads", "CRM & follow-up · 6 messages drafted", "crm", "purple", "review", "Ready for review", 100, "#FFEBD6", "80px", "-20px", "10deg"],
        ["Fix the slow services page", "SEO · 3 fixes prepared", "seo", "green", "run", "Running", 38, "#FFF6D1", "-70px", "10px", "6deg"]
      ].map(([t, m, ic, col, st, l, pg, bg, x, y, r], i) => `<div class="note n--${col} is-${st}" style="--i:${i};--sx:${x};--sy:${y};--sr:${r};--pg:${pg}%;--sticky:${bg}"><span class="nico">${I[ic]}</span><span class="ntext"><b>${t}</b><small>${m}</small></span><span class="st st--${st}">${l}</span><span class="nbar"><i></i></span></div>`).join("")}
    </div>
  </div>
</section>

<section class="section" id="automations">
  <div class="wrap">
    <div class="head head--split">
      <div><span class="eyebrow" data-reveal>Automations</span><h2 class="h-lg words" data-in style="margin-top:18px">${words("What would you like to make easier?")}</h2><p class="lede" data-reveal style="margin-top:18px">Start with one job. Add more when your business needs it.</p></div>
      <div data-reveal>${btn("/automations", "See all automations", "btn--ghost")}</div>
    </div>
    ${catalogue()}
  </div>
</section>

<section class="section dark" data-theme="dark">
  <div class="wrap">
    <div class="head head--center">
      <span class="eyebrow" data-reveal>Marketing in a click</span>
      <h2 class="h-lg words" data-in>${words("Tick it off your list.", )}</h2>
      <p class="lede" data-reveal>Pick the job. The automation keeps it moving and brings you the decisions that need a person.</p>
    </div>
    <div class="tasks">
      <article class="task task--purple" data-in>
        <div class="task-head"><span class="tick">${I.check}</span><h3><s>Keep my SEO work moving</s></h3></div>
        <p>Site checks, improvement briefs and progress reports on a schedule. You review the changes that matter.</p>
        ${link("/automations/seo", "SEO automation")}
        <div class="task-visual">${phoneSEO}<div class="mascot pt-scene" data-scene="portraitP" data-mood="thinking" style="right:-6px;bottom:20px" aria-hidden="true"></div></div>
      </article>
      <article class="task task--blue" data-in>
        <div class="task-head"><span class="tick">${I.check}</span><h3><s>Follow up with this week's enquiries</s></h3></div>
        <p>Every enquiry gets a record, an owner and a drafted reply waiting for your approval.</p>
        ${link("/automations/crm", "CRM &amp; follow-up")}
        <div class="task-visual">${phoneCRM}<div class="mascot pt-scene" data-scene="portraitT" data-mood="excited" style="left:-10px;bottom:30px" aria-hidden="true"></div></div>
      </article>
      <article class="task task--orange task--wide" data-in>
        <div>
          <div class="task-head"><span class="tick">${I.check}</span><h3><s>Tell me what needs me today</s></h3></div>
          <p>One place for everything your automations did, what is waiting for your review and anything that needs attention. If nothing ran, it says so.</p>
          ${link("/how-it-works", "How the workspace works")}
        </div>
        <div class="task-visual">
          <div class="stack">
            <div class="stack-it"><span class="si" style="color:#946C00">${I.bell}</span><div><b>2 items ready for review</b><small>An enquiry reply and 3 page titles</small></div></div>
            <div class="stack-it"><span class="si" style="color:var(--purple)">${I.cal}</span><div><b>4 posts scheduled</b><small>LinkedIn, this week</small></div></div>
            <div class="stack-it"><span class="si" style="color:#C23A2E">${I.plug}</span><div><b>1 connection needs attention</b><small>Reconnect your inbox</small></div></div>
          </div>
          <div class="mascot pt-scene" data-scene="portraitT" data-mood="happy" style="right:-20px;bottom:-60px;width:170px" aria-hidden="true"></div>
        </div>
      </article>
    </div>
  </div>
</section>

<section class="section" id="how">
  <div class="wrap">
    <div class="head">
      <span class="eyebrow" data-reveal>How it works</span>
      <h2 class="h-lg words" data-in>${words("See what happens after the click.")}</h2>
    </div>
    ${story()}
  </div>
</section>

<section class="section white">
  <div class="wrap">
    <div class="head head--center"><span class="eyebrow" data-reveal>Built for control</span><h2 class="h-lg words" data-in>${words("Know what's running.<br>Know what needs you.")}</h2></div>
    <div class="bento">
      <div class="b-4" data-reveal data-in>
        <h3>Connected, <em>not complicated</em></h3>
        <p>Each automation connects only to the tools its job needs: your website, inbox, CRM, calendar or ad accounts.</p>
        <div class="vis orbit-vis">
          <div class="orbit-ring">${[["globe", "Website", 0], ["mail", "Inbox", 90], ["db", "CRM", 180], ["chart", "Ads", 270]].map(([ic, t, a]) => `<span class="orb-node" style="transform:rotate(${a}deg) translate(260px) rotate(-${a}deg)">${I[ic]}<small>${t}</small></span>`).join("")}</div>
          <div class="orbit-ring orbit-ring--2">${[["cal", "Calendar", 45], ["form", "Forms", 165], ["post", "Social", 285]].map(([ic, t, a]) => `<span class="orb-node" style="transform:rotate(${a}deg) translate(170px) rotate(-${a}deg)">${I[ic]}<small>${t}</small></span>`).join("")}</div>
          <div class="prompt"><span class="typing" data-type="Follow up with Tuesday's enquiries|Prepare next week's SEO briefs|Summarise this week's campaigns|Draft three LinkedIn posts" data-loop></span><span class="go">${I.arrow}</span></div>
        </div>
      </div>
      <div class="b-2" data-reveal data-in style="--d:1">
        <h3>Decisions <em>stay yours</em></h3>
        <p>Choose what runs on its own and what waits for a yes.</p>
        <div class="vis fan">
          ${[0, 1, 2].map((i) => `<div class="fan-card"><span class="st ${["st--done", "st--review", "st--review"][i]}">${["Approved", "Ready for review", "Ready for review"][i]}</span><span class="line"></span><span class="line m"></span><span class="line s"></span><span class="line"></span><span class="line m"></span><div class="fa"><span class="ok">Approve</span><span>Edit</span></div></div>`).join("")}
        </div>
      </div>
      </div>
    </div>
  </div>
</section>

${studioBand()}

<section class="section--tight latest-posts">
  <div class="wrap">
    <div class="head head--split"><div><span class="eyebrow" data-reveal>Guides</span><h2 class="h-md words" data-in style="margin-top:18px">${words("Latest from the blog")}</h2></div><div data-reveal>${btn("/blog", "All posts", "btn--ghost")}</div></div>
    <div class="related" data-reveal>
          ${latestPosts().join("\n          ")}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="head head--center"><span class="eyebrow" data-reveal>Subscriptions</span><h2 class="h-lg words" data-in>${words("A subscription that keeps the work moving.")}</h2><p class="lede" data-reveal>Start with the automation your business needs. Add more when you're ready.</p></div>
    ${plans()}
  </div>
</section>

<section class="section--tight">
  <div class="wrap wrap--narrow">
    <div class="head head--center"><span class="eyebrow" data-reveal>Questions</span><h2 class="h-md words" data-in>${words("Before you subscribe")}</h2></div>
    ${faq(HOME_FAQ)}
  </div>
</section>

${cta()}
`;

// The three newest posts, copied from the list on /blog (the SEO agent keeps that list newest-first).
function latestPosts() {
  const blog = readFileSync(join(ROOT, "blog.html"), "utf8");
  return [...blog.matchAll(/<a href="\/blog\/[^"]+"><b>.*?<\/a>/g)].map((m) => m[0]).slice(0, 3);
}

// "Nine", "Ten"... for headlines, so adding a product never leaves a stale count in the copy.
const countWord = (n) => ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"][n] || String(n);

function catalogue() {
  const tabs = [["all", "All"], ...Object.entries(GOALS)];
  return `<div data-tabs>
    <div class="tabs" role="tablist" aria-label="Filter automations by goal">${tabs.map(([k, t], i) => `<button class="tab" role="tab" type="button" data-filter="${k}" aria-selected="${i === 0}">${t}</button>`).join("")}<span class="tab-glider" aria-hidden="true"></span></div>
    <div class="cards cards--3">${PRODUCTS.map(productCard).join("")}</div>
  </div>`;
}

function studioBand() {
  const svcs = [["brand", "Brand & messaging", "Positioning, naming, identity and the words your automations will use."], ["camera", "Shoots & production", "Product and brand photography, AI photoshoots, film and content."], ["pr", "PR strategy & outreach", "People who build media relationships and run the outreach."], ["code", "Bespoke builds", "Custom websites and marketing systems that don't fit a standard product."]];
  return `<section class="section dark" data-theme="dark">
  <div class="wrap">
    <div class="head head--split">
      <div><span class="eyebrow" data-reveal>The 30%</span><h2 class="h-lg words" data-in style="margin-top:18px">${words("Some work needs people.<br>That's our studio.")}</h2>
      <p class="lede" data-reveal style="margin-top:18px">Automations handle the recurring jobs. Our team takes on the work that needs taste, judgement and relationships, alongside your automations or on its own.</p></div>
      <div data-reveal>${btn("/studio", "Explore the studio", "btn--ghost")}</div>
    </div>
    <div class="studio-grid">${svcs.map(([ic, h, p], i) => `<div class="svc" data-reveal style="--d:${i}"><span class="svc-num">0${i + 1}</span><span class="si">${I[ic]}</span><h3>${h}</h3><p>${p}</p></div>`).join("")}</div>
    <div class="strip" style="margin-top:56px;border-top:0"><div class="strip-in"><p>Brands our team has worked with</p>${marquee()}</div></div>
  </div>
</section>`;
}

function plans() {
  const li = (t) => `<li>${I.check}<span>${t}</span></li>`;
  return `<div class="plans">
    <div class="plan" data-reveal>
      <span class="eyebrow">One automation</span><h3>Subscribe to one job</h3>
      <div class="price">Early access <small>pricing on your demo</small></div>
      <ul>${["The defined work it does, and how often", "The connections it needs", "Review steps and support", "Clear limits and any usage charges"].map(li).join("")}</ul>
      ${btn("/contact?interest=automation", "Request a demo", "btn--ghost")}
    </div>
    <div class="plan plan--hl" data-reveal style="--d:1">
      <span class="plan-tag st st--early">Good first bundle</span>
      <span class="eyebrow">Connected bundle</span><h3>Leads + CRM, together</h3>
      <div class="price">Early access <small>pricing on your demo</small></div>
      <ul>${["Enquiries captured, routed and followed up", "Shared records and clean hand-offs", "One setup for both jobs", "Combined limits stated upfront"].map(li).join("")}</ul>
      ${btn("/contact?interest=lead-generation,crm", "Request the bundle demo")}
    </div>
    <div class="plan" data-reveal style="--d:2">
      <span class="eyebrow">Studio support</span><h3>People for the 30%</h3>
      <div class="price">Quoted <small>on scope</small></div>
      <ul>${["Brand, shoots, PR and bespoke builds", "A separate scope, fee and owner", "Works alongside any automation", "Or on its own"].map(li).join("")}</ul>
      ${btn("/contact?interest=studio", "Talk to the studio", "btn--ghost")}
    </div>
  </div>
  <p class="note-line" data-reveal>Before you subscribe, every plan states its included work, usage, connections, setup, support, extra charges and cancellation terms. Advertising spend is always separate.</p>`;
}

const HOME_FAQ = [
  ["What is AI marketing automation for a small business?", "It is software that runs a defined, recurring marketing job for you, such as SEO checks, lead follow-up, CRM updates or LinkedIn drafts, so the work no longer depends on someone remembering it. Pluto Theory is based in Hyderabad, India, and offers these automations on subscription to small businesses in India and worldwide. Every automation is in early access, and pricing is shared on a demo."],
  ["Is Pluto Theory an AI automation agency in India?", `Pluto Theory is based in Hyderabad, India. About 70% of its work is AI marketing automations sold on subscription, and the other 30% is a studio team for brand, photography, PR and bespoke builds. Unlike a project-based agency, you subscribe to an automation that runs a recurring job. Every automation is in early access, and pricing is shared on a demo. For how to compare providers, read <a class="link" href="/blog/ai-automation-agency-india">how to pick an AI automation agency in India</a>.`],
  ["What does “Marketing in a click” actually mean?", "It describes the experience: choose an automation, connect what it needs, set your rules and activate it. It does not mean rankings, leads or sales appear instantly. It means the recurring work behind them stops depending on someone remembering it."],
  ["What is the 70/30 split?", "About 70% of what Pluto Theory does is AI automation: subscription products that run defined, recurring marketing jobs. The other 30% is hands-on studio work, like brand, shoots, PR outreach and bespoke builds, for the parts that need people."],
  ["Will anything happen without my approval?", "Only what you allow. You decide which actions run on their own and which wait for a review. Most teams start with everything waiting for approval."],
  ["Which accounts do I need to connect?", "Only the ones the automation's job needs. Each product page lists its inputs, and we confirm the supported connections for your setup during the demo."],
  ["How much does it cost?", "The automations are in early access. We share pricing for your chosen automation on the demo. Each plan will list its included work, usage limits and any extra charges. Advertising spend is never mixed into the subscription."],
  ["Is setup self-serve?", "In early access, we set up each automation with you. If any part of activation needs our help, we tell you before you subscribe."],
  ["Which automations can I use now?", "Every automation is currently in early access. Request a demo and we will show you what it does today, what it supports and what is still being built."],
  ["What if I need help?", `Email <a class="link" href="mailto:${EMAIL}">${EMAIL}</a> or use the <a class="link" href="/support">support page</a>. Studio work has its own named contact.`]
];

page("index.html", { path: "/", title: "AI Marketing Automation Subscriptions | Pluto Theory", description: "Explore subscription-based AI automations for SEO, leads, CRM and other marketing work. Choose what you need and see how Pluto Theory works.", body: home() });

/* ============ Automations catalogue ============ */
page("automations.html", {
  path: "/automations", title: "Marketing Automations Catalogue | Pluto Theory",
  description: "Browse Pluto Theory's AI marketing automations by goal: get discovered, bring in enquiries and keep customers connected. See what each one does, needs and returns.",
  body: `
<section class="phero dark" data-theme="dark">
  <div class="wrap">
    <nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>Automations</span></nav>
    <span class="pill" data-reveal><span class="dot"></span>${PRODUCTS.length} automations · early access</span>
    <h1 class="h-xl words" data-in style="margin-top:24px;max-width:12em">${words("Choose the work you want to keep", { t: "moving.", cls: "it" })}</h1>
    <p class="lede" data-reveal style="--d:3">Every automation does one defined marketing job. Pick it by the goal it serves, see exactly what it needs and returns, and add more when you're ready.</p>
  </div>
</section>
<section class="section--tight"><div class="wrap">${catalogue()}</div></section>
<section class="section--tight"><div class="wrap">
  <div class="two-col">
    <div class="box" data-reveal><span class="eyebrow">Availability, honestly</span><h3 style="margin-top:14px">What “Early access” means</h3>
      <ul>${[["Early access", "Working with a small number of businesses. Request a demo to see it and join."], ["Pilot", "Running with real customers under agreed terms."], ["Available", "Ready to subscribe, with published plans and limits."]].map(([a, b]) => `<li>${I.check}<span><b style="color:var(--ink)">${a}.</b> ${b}</span></li>`).join("")}</ul></div>
    <div class="box box--dark" data-reveal style="--d:1"><span class="eyebrow">Better together</span><h3 style="margin-top:14px">Connected bundles</h3>
      <ul>${["Lead generation + CRM: enquiries captured, owned and followed up.", "Websites + lead generation: pages whose enquiries reach the right person.", "Each automation still works on its own. Bundles only exist where the connection adds value."].map((t) => `<li>${I.spark}<span>${t}</span></li>`).join("")}</ul></div>
  </div>
</div></section>
${cta({ h: "Not sure where to start?", p: "Tell us which marketing task keeps coming back. We'll show you the automation that fits, working, on a short demo.", primary: ["/contact", "Request a demo"], secondary: ["/how-it-works", "How it works"] })}`
});

/* ============ Product pages ============ */
const PREVIEWS = {
  seo: () => `<h3>Your SEO work, visible. <span class="st st--run">Running</span></h3>
    <div class="q-row"><div><b>Page title improvement</b><small>Services page · ready for review</small></div><span class="st st--review">Review</span></div>
    <div class="q-row"><div><b>Content brief</b><small>Draft prepared from your services</small></div><span class="st st--run">Drafting</span></div>
    <div class="q-row"><div><b>Site check</b><small>Issues prioritised by impact</small></div><span class="st st--done">Done</span></div>
    <div class="q-row"><div><b>Monthly progress report</b><small>Due on the 1st</small></div><span class="st st--soon">Next</span></div>`,
  lead: () => `<h3>New enquiries <span class="st st--run">Capturing</span></h3>
    <div class="q-row"><div><b>Website form · Pricing question</b><small>Qualified · routed to Sales</small></div><span class="st st--done">Routed</span></div>
    <div class="q-row"><div><b>Inbox · Partnership request</b><small>Duplicate merged · owner assigned</small></div><span class="st st--review">Review reply</span></div>
    <div class="q-row"><div><b>Website form · Booking</b><small>Missing phone number</small></div><span class="st st--attn">Needs attention</span></div>
    <div class="callout"><b>Next step</b>A first reply is drafted for each new enquiry. Nothing is sent until you approve.</div>`,
  crm: () => `<h3>Customer enquiry <span class="st st--review">Needs review</span></h3>
    <div class="kv"><span>Source</span><b>Website enquiry form</b></div><div class="kv"><span>Stage</span><b>New enquiry</b></div><div class="kv"><span>Owner</span><b>Your sales team</b></div><div class="kv"><span>Next action</span><b>Review the drafted reply</b></div>
    <div class="callout"><b>Suggested follow-up</b><span class="typing" data-type="Thanks for getting in touch. What would you like help with first?"></span></div>`,
  linkedin: () => `<h3>Post draft <span class="st st--review">Ready for review</span></h3>
    <div class="p-card"><div class="p-card-h"><span class="p-av">YOU</span><div><b style="font-size:14px">From your notes: pricing</b><small style="display:block;font-size:12px;color:var(--muted)">Scheduled for Tue 9:00, once approved</small></div></div>
    <div class="p-card-b" style="font-size:14.5px"><span class="typing" data-type="Most clients ask about price in the first call. Here's what we've learned about answering it honestly, and why it builds more trust than dodging it..."></span></div>
    <div class="p-actions"><span>Approve</span><span>Edit</span><span>Skip</span></div></div>`,
  instagram: () => `<h3>Content queue <span class="st st--run">Planning</span></h3>
    <div class="ig-grid">${[["#E9DDFB", "Scheduled"], ["#FFE4C2", "Review"], ["#D9F2DC", "Draft"], ["#FDE2EC", "Review"], ["#DCE7FF", "Scheduled"], ["#F3ECE1", "Draft"]].map(([c, st]) => `<i style="--c:${c}" data-s="${st}"></i>`).join("")}</div>
    <div class="q-row"><div><b>Caption ready for review</b><small>Your photo · new product launch</small></div><span class="st st--review">Review</span></div>`,
  performance: () => `<h3>Campaign overview <span class="st st--run">Checking</span></h3>
    <div class="mini-chart" data-in>${[38, 52, 44, 61, 58, 72, 66, 80, 74, 88].map((h, k) => `<i style="--h:${h}%;--k:${k}"${k > 7 ? ' class="hl"' : ""}></i>`).join("")}</div>
    <div class="q-row"><div><b>Spend pacing above your limit</b><small>Search campaign · suggested pause</small></div><span class="st st--attn">Needs approval</span></div>
    <div class="q-row"><div><b>Weekly summary</b><small>Spend and conversions in one view</small></div><span class="st st--done">Ready</span></div>`,
  pr: () => `<h3>Opportunities <span class="st st--run">Monitoring</span></h3>
    <div class="q-row"><div><b>Industry trends feature</b><small>Fit: your recent launch and data</small></div><span class="st st--review">Pitch drafted</span></div>
    <div class="q-row"><div><b>Founder profile series</b><small>Fit: spokesperson story</small></div><span class="st st--run">Researching</span></div>
    <div class="q-row"><div><b>Local business awards</b><small>Deadline in 9 days</small></div><span class="st st--soon">Next</span></div>
    <div class="callout"><b>Why it fits</b>Matches a verified fact you provided. Nothing is sent without approval.</div>`,
  web: () => `<h3>Landing page <span class="st st--review">Preview ready</span></h3>
    <div class="page-prev"><div class="pp-bar"><i></i><i></i><i></i></div><div class="pp-body"><span class="pp-h"></span><span class="pp-l"></span><span class="pp-l" style="width:80%"></span><span class="pp-l" style="width:60%"></span><span class="pp-btn"></span></div></div>
    <div class="q-row"><div><b>Enquiry form connected</b><small>Sends to lead generation → CRM</small></div><span class="st st--done">Connected</span></div>`,
  whatsapp: () => `<h3>WhatsApp chat <span class="st st--run">Replying</span></h3>
    <div class="wa-chat">
      <p class="wa-msg in">Hi, do you deliver to Gachibowli? And what are your timings?</p>
      <p class="wa-msg out">Yes, we deliver to Gachibowli. We're open 10am to 8pm, Monday to Saturday. Would you like to place an order or ask about something else?<small>Answered from your approved replies</small></p>
      <p class="wa-msg in">I'd like a quote for a bulk order.</p>
    </div>
    <div class="q-row"><div><b>Enquiry captured</b><small>Bulk order · sent to CRM & follow-up</small></div><span class="st st--done">Captured</span></div>
    <div class="q-row"><div><b>Handed to your team</b><small>Quotes always go to a person</small></div><span class="st st--review">Needs a person</span></div>`
};

for (const p of PRODUCTS) {
  const related = PRODUCTS.filter((x) => x !== p).sort((a, b) => (b.goal === p.goal) - (a.goal === p.goal) || b.feature - a.feature).slice(0, 3);
  const body = `
<section class="phero">
  <div class="wrap phero-grid">
    <div>
      <nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/automations">Automations</a><span>/</span><span>${p.name}</span></nav>
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap" data-reveal><span class="eyebrow">${p.eyebrow}</span>${statusPill(p.status)}</div>
      <h1 class="h-lg words" data-in style="margin-top:20px">${words(p.h1)}</h1>
      <p class="lede" data-reveal style="--d:3">${p.sub}</p>
      <div class="ctas" data-reveal style="--d:4">${btn(`/contact?interest=${p.slug}`, `Request the ${p.name.replace(/ automation$/, "")} demo`)}${btn("#scope", "See what's included", "btn--ghost")}</div>
    </div>
    <div class="preview" data-reveal="scale" data-in style="--d:2">
      <div class="preview-in"><div class="preview-cap"><span>Product preview</span><span>Sample data</span></div>${PREVIEWS[p.preview]()}</div>
    </div>
  </div>
</section>
<section class="section--tight white">
  <div class="wrap wrap--narrow" style="text-align:center">
    <span class="eyebrow" data-reveal>Sound familiar?</span>
    <p class="h-sm words" data-in style="margin-top:18px;font-family:var(--display);font-weight:600;font-size:clamp(26px,3vw,40px);line-height:1.15;letter-spacing:-.03em">${words(p.problem)}</p>
  </div>
</section>
<section class="section--tight" id="scope">
  <div class="wrap">
    <div class="head"><span class="eyebrow" data-reveal>The job, defined</span><h2 class="h-md words" data-in>${words("What you give it. What you get back.")}</h2></div>
    <div class="trio">
      ${[["plug", "You connect", p.connect], ["layers", "You receive", p.receive], ["sliders", "You control", p.control]].map(([ic, h, l], i) => `<div data-reveal style="--d:${i}"><span class="ti">${I[ic]}</span><h3>${h}</h3><ul>${l.map((x) => `<li>${x}</li>`).join("")}</ul></div>`).join("")}
    </div>
  </div>
</section>
<section class="section--tight">
  <div class="wrap">
    <div class="head head--center"><span class="eyebrow" data-reveal>How it runs</span><h2 class="h-md words" data-in>${words("Three steps, on repeat.")}</h2></div>
    <div class="flow" data-in>${p.steps.map(([h, t], k) => `<div style="--k:${k}"><span class="fn">0${k + 1}</span><h3>${h}</h3><p>${t}</p></div>`).join("")}</div>
  </div>
</section>
<section class="section--tight">
  <div class="wrap two-col">
    <div class="box" data-reveal><span class="eyebrow">Included</span><h3 style="margin-top:14px">What the automation does</h3><ul>${p.includes.map((x) => `<li>${I.check}<span>${x}</span></li>`).join("")}</ul></div>
    <div class="box limits" data-reveal style="--d:1"><span class="eyebrow" style="color:var(--muted)">Good to know</span><h3 style="margin-top:14px">Honest limits</h3><ul>${p.limits.map((x) => `<li>${I.minus}<span>${x}</span></li>`).join("")}</ul></div>
  </div>
</section>
<section class="section--tight">
  <div class="wrap">
    <div class="box box--dark" data-reveal data-theme="dark" style="display:grid;grid-template-columns:1fr auto;gap:28px;align-items:center">
      <div><span class="eyebrow" style="color:var(--orange)">The 30% · Studio</span><h3 style="margin-top:12px;font-size:26px">${p.studio}</h3></div>
      ${btn("/studio", "Explore the studio", "btn--ghost")}
    </div>
  </div>
</section>
<section class="section--tight">
  <div class="wrap wrap--narrow"><div class="head head--center"><span class="eyebrow" data-reveal>Questions</span><h2 class="h-md words" data-in>${words(p.name + " FAQs")}</h2></div>${faq([...p.faqs, ["How much does it cost?", "It is in early access. We share pricing on your demo, along with the included work, usage limits, setup and any extra charges."]])}</div>
</section>
<section class="section--tight">
  <div class="wrap"><div class="head head--split"><h2 class="h-md words" data-in>${words("Works well with")}</h2><div data-reveal>${link("/automations", "All automations")}</div></div>
  <div class="related-grid">${related.map((r) => productCard(r, PRODUCTS.indexOf(r))).join("")}</div></div>
</section>
${cta({ h: `See ${p.name.replace(/ automation$/, "")} working.`, p: "A short demo shows what it does today, what it needs from you and what is still being built. No pressure, no slides.", primary: [`/contact?interest=${p.slug}`, "Request a demo"], secondary: ["/pricing", "How pricing works"] })}`;
  page(`automations/${p.slug}.html`, {
    path: `/automations/${p.slug}`, title: p.title, description: p.desc, dark: false, body,
    schema: [{ "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" }, { "@type": "ListItem", position: 2, name: "Automations", item: SITE + "/automations" }, { "@type": "ListItem", position: 3, name: p.name, item: `${SITE}/automations/${p.slug}` }] }]
  });
}

/* ============ How it works ============ */
page("how-it-works.html", {
  path: "/how-it-works", title: "How Pluto Theory Works | Choose, Connect, Activate",
  description: "What happens after you subscribe to a Pluto Theory automation: choose a job, connect your tools, set your rules, review the work and keep improving.",
  body: `
<section class="phero dark" data-theme="dark">
  <div class="wrap">
    <nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>How it works</span></nav>
    <h1 class="h-xl words" data-in style="max-width:11em">${words("The work behind marketing is complicated.", { t: "Using it shouldn't be.", cls: "it" })}</h1>
    <p class="lede" data-reveal style="--d:3">Choose an automation, connect the tools it needs and let the recurring work move, with clear updates and control over the decisions that matter.</p>
  </div>
</section>
<section class="section"><div class="wrap">${story()}</div></section>
<section class="section--tight white">
  <div class="wrap">
    <div class="head head--center"><span class="eyebrow" data-reveal>Choose → connect → activate → review → improve</span><h2 class="h-md words" data-in>${words("After you subscribe")}</h2></div>
    <div class="cards" style="grid-template-columns:repeat(5,1fr)">
      ${[["layers", "Choose", "Pick the job. See its scope, inputs and limits before you start."], ["plug", "Connect", "Add business information and the accounts that job needs."], ["sliders", "Activate", "Set schedules, permissions and review steps. Test the first useful output."], ["eye", "Review", "Approve, edit or skip what's waiting. See exactly what decision is needed."], ["chart", "Improve", "Loosen or tighten the rules as you go, and add the next automation."]].map(([ic, h, t], i) => `<div class="card" data-reveal style="--d:${i};min-height:0"><span class="card-ico">${I[ic]}</span><span class="num">0${i + 1}</span><h3>${h}</h3><p>${t}</p></div>`).join("")}
    </div>
  </div>
</section>
<section class="section--tight">
  <div class="wrap two-col">
    <div class="box" data-reveal><span class="eyebrow">Runs by itself</span><h3 style="margin-top:14px">What can happen automatically</h3><ul>${["Scheduled work: checks, research, drafts and reports", "Event-driven work: a new enquiry is captured and routed", "Click-to-run work: start a job when you need it", "Actions you have explicitly allowed"].map((x) => `<li>${I.check}<span>${x}</span></li>`).join("")}</ul></div>
    <div class="box box--dark" data-reveal style="--d:1"><span class="eyebrow" style="color:var(--orange)">Waits for you</span><h3 style="margin-top:14px">What needs your approval</h3><ul>${["Anything published under your name", "Messages to customers, unless you allow them", "Changes to your website or campaigns", "Anything that does not fit the rules you set"].map((x) => `<li>${I.user}<span>${x}</span></li>`).join("")}</ul></div>
  </div>
</section>
<section class="section"><div class="wrap"><div class="head head--center"><span class="eyebrow" data-reveal>Who does what</span><h2 class="h-lg words" data-in>${words("70% automated. 30% people.")}</h2></div>${split7030()}</div></section>
<section class="section--tight"><div class="wrap wrap--narrow"><div class="head head--center"><h2 class="h-md words" data-in>${words("Common questions")}</h2></div>${faq([
  ["Is setup done for me?", "In early access, we set up each automation with you. We will always tell you before you subscribe if any step needs our help."],
  ["What if a connection breaks?", "The workspace shows it as Needs attention, with the issue and what to do next. Work that depends on it pauses rather than guessing."],
  ["What if nothing ran this week?", "The workspace says so. A quiet week is shown as a quiet week, not hidden."],
  ["Can I change the rules later?", "Yes. Most teams start with everything waiting for review, then let simple, trusted actions run on their own."]
])}</div></section>
${cta()}`
});

/* ============ Pricing ============ */
page("pricing.html", {
  path: "/pricing", title: "Pricing | AI Marketing Automation Subscriptions | Pluto Theory",
  description: "How Pluto Theory subscriptions work: one automation, connected bundles or studio support. Every plan states its included work, limits, setup, support and extra charges.",
  dark: false,
  body: `
<section class="phero">
  <div class="wrap" style="text-align:center">
    <nav class="crumb" aria-label="Breadcrumb" style="justify-content:center"><a href="/">Home</a><span>/</span><span>Pricing</span></nav>
    <h1 class="h-xl words" data-in style="max-width:12em;margin-inline:auto">${words("Start with the automation your business", { t: "needs.", cls: "it" })}</h1>
    <p class="lede" data-reveal style="--d:3;margin-inline:auto">Add more when you're ready. During early access, pricing for each automation is shared on your demo, alongside everything it includes.</p>
  </div>
</section>
<section class="section--tight"><div class="wrap">${plans()}</div></section>
<section class="section--tight white">
  <div class="wrap">
    <div class="head head--center"><span class="eyebrow" data-reveal>No surprises</span><h2 class="h-md words" data-in>${words("Every plan tells you, upfront")}</h2></div>
    <div class="cards">${[["layers", "Included work", "The actions it takes and the outputs you receive."], ["clock", "Cadence & usage", "How often it runs and the monthly limits."], ["plug", "Connections", "The accounts it needs and supports."], ["sliders", "Setup", "Whether setup is self-serve or assisted, and any setup fee."], ["help", "Support", "How to get help, and how fast."], ["chart", "Extra charges", "Usage or overage charges, if any. Ad spend is always separate."], ["x", "Cancellation", "How to stop, and what happens to your data."], ["user", "Your approvals", "What needs a person before it happens."]].map(([ic, h, t], i) => `<div class="card" data-reveal style="--d:${i % 4};min-height:0"><span class="card-ico">${I[ic]}</span><h3 style="margin-top:8px">${h}</h3><p>${t}</p></div>`).join("")}</div>
  </div>
</section>
<section class="section--tight">
  <div class="wrap">
    <div class="head head--center"><span class="eyebrow" data-reveal>After choosing a plan</span><h2 class="h-md words" data-in>${words("From yes to first useful output")}</h2></div>
    <div class="flow" data-in style="grid-template-columns:repeat(4,1fr)">${[["Your business", "Add goals and context."], ["Connections", "Connect the required accounts."], ["Review rules", "Set permissions and limits."], ["Activation", "Test the first useful output."]].map(([h, t], k) => `<div style="--k:${k}"><span class="fn">${k + 1}</span><h3>${h}</h3><p>${t}</p></div>`).join("")}</div>
  </div>
</section>
<section class="section--tight"><div class="wrap wrap--narrow"><div class="head head--center"><h2 class="h-md words" data-in>${words("Pricing questions")}</h2></div>${faq([
  ["What is marketing automation on subscription?", "It means you subscribe to an automation that runs one recurring marketing job, such as SEO checks, lead follow-up, CRM updates or LinkedIn drafts, instead of hiring for it or buying a large software suite. Pluto Theory, based in Hyderabad, India, offers its AI marketing automations on subscription to businesses in India and worldwide. You start with one automation and add more later. Every automation is in early access, and each plan's included work, limits and price are shared on a demo."],
  ["Why isn't there a price on the page?", "The automations are in early access, and we would rather show you a real demo and a clear scope than publish a number before the plan is finalised. Published prices will appear here as each automation becomes generally available."],
  ["Is advertising spend included?", "No. Ad spend is always separate from the subscription, and paid directly to the ad platform."],
  ["Can I combine automations?", "Yes. Bundles exist where the connection adds value, such as lead generation with CRM follow-up. Each automation also works on its own."],
  ["Is studio work part of the subscription?", "Studio work is scoped and priced separately, so you always know what you are paying for."]
])}</div></section>
${cta({ h: "Get pricing for your automation.", p: "Book a short demo. You'll see it working and get the plan details, limits and price for your setup.", primary: ["/contact", "Request a demo"], secondary: ["/automations", "Explore automations"] })}`
});

/* ============ Demos ============ */
page("demos.html", {
  path: "/demos", title: "Demos | See Pluto Theory Automations Working",
  description: "Request a walkthrough of any Pluto Theory automation. Every demo is labelled as a prototype, test, pilot or production deployment, so you know what you're seeing.",
  body: `
<section class="phero dark" data-theme="dark">
  <div class="wrap">
    <nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>Demos</span></nav>
    <h1 class="h-xl words" data-in style="max-width:11em">${words("See it working", { t: "before you subscribe.", cls: "it" })}</h1>
    <p class="lede" data-reveal style="--d:3">Demos are run live, one to one, on the automation you care about. You see the input, the real output and the next step, along with what is still being built.</p>
    <div class="ctas" data-reveal style="--d:4">${btn("/contact", "Request a demo")}</div>
  </div>
</section>
<section class="section--tight">
  <div class="wrap">
    <div class="head"><span class="eyebrow" data-reveal>Clearly labelled</span><h2 class="h-md words" data-in>${words("You'll always know what you're looking at.")}</h2></div>
    <div class="cards">${[["Prototype", "A working design of the product, not yet connected to live accounts."], ["Test", "Running on test data or our own accounts."], ["Pilot", "Running for a real business under agreed terms."], ["Production", "Running for customers as a released product."]].map(([h, t], i) => `<div class="card" data-reveal style="--d:${i};min-height:0"><span class="card-ico">${I.play}</span><h3 style="margin-top:8px">${h}</h3><p>${t}</p></div>`).join("")}</div>
  </div>
</section>
<section class="section--tight">
  <div class="wrap">
    <div class="head"><span class="eyebrow" data-reveal>Pick a demo</span><h2 class="h-md words" data-in>${words("Which automation would you like to see?")}</h2></div>
    <div class="cards cards--3">${PRODUCTS.map((p, i) => `<a class="card" href="/contact?interest=${p.slug}" data-reveal style="--d:${i % 4}"><div class="card-top"><span class="card-ico">${I[p.icon]}</span>${statusPill(p.status)}</div><h3>${p.name}</h3><p>${p.card}</p><span class="link">Request this demo ${I.ne}</span></a>`).join("")}</div>
  </div>
</section>
${cta()}`
});

/* ============ Support ============ */
page("support.html", {
  path: "/support", title: "Support | Pluto Theory",
  description: "Get help with Pluto Theory automations: setup guidance, supported connections, troubleshooting and how to reach a person.",
  dark: false,
  body: `
<section class="phero">
  <div class="wrap">
    <nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>Support</span></nav>
    <h1 class="h-xl words" data-in style="max-width:10em">${words("Help, from", { t: "a person.", cls: "it" })}</h1>
    <p class="lede" data-reveal style="--d:3">During early access, every customer has a direct line to the team that builds the automations.</p>
  </div>
</section>
<section class="section--tight">
  <div class="wrap">
    <div class="cards">${[["sliders", "Setup", "We set up each automation with you, and walk through the rules and review steps together."], ["plug", "Connections", "Supported connections are confirmed for your setup before you subscribe. Ask us about the tools you use."], ["bell", "Something's wrong", "If a status shows Needs attention, it tells you what happened and what to do. If it doesn't, email us."], ["chat", "Talk to us", `Email <a class="link" href="mailto:${EMAIL}">${EMAIL}</a>. We reply within one working day.`]].map(([ic, h, t], i) => `<div class="card" data-reveal style="--d:${i};min-height:0"><span class="card-ico">${I[ic]}</span><h3 style="margin-top:8px">${h}</h3><p>${t}</p></div>`).join("")}</div>
  </div>
</section>
<section class="section--tight"><div class="wrap wrap--narrow"><div class="head head--center"><h2 class="h-md words" data-in>${words("Support questions")}</h2></div>${faq([
  ["How do I pause an automation?", "Tell us and we will pause it. As the workspace grows, pausing will be a single switch on each automation."],
  ["Can I change what needs my approval?", "Yes, any time. Tell us what you would like to change and we will update the rules with you."],
  ["Who do I contact about studio work?", "Use the contact form and choose Studio, or email us. Studio projects have a named owner."],
  ["Where is my data used?", `Only for the job the automation does for you. See our <a class="link" href="/privacy">privacy policy</a> for how this website handles information.`]
])}</div></section>
${cta({ h: "Still stuck?", p: "Send us a note and a person will reply.", primary: ["/contact", "Contact us"], secondary: [`mailto:${EMAIL}`, "Email us"] })}`
});

/* ============ Studio (the 30%) ============ */
const STUDIO = [
  ["brand", "Brand & messaging", "The clarity your automations will speak with.", ["Positioning and messaging", "Naming and brand identity", "Tone of voice for your content and replies", "Sales and pitch materials"]],
  ["camera", "Shoots & creative production", "The real material automation can't make up.", ["Product and brand photography", "AI photoshoots, worldwide", "Short-form video and film", "Design and content production"]],
  ["pr", "PR strategy & outreach", "The relationship side of PR, done by people.", ["Story strategy and launch planning", "Hands-on media outreach", "Spokesperson preparation", "Works with the PR workflow automation"]],
  ["code", "Bespoke builds", "For the jobs that don't fit a standard product.", ["Custom websites and landing pages", "Bespoke marketing systems", "Integrations for unusual setups", "Kept current with automation afterwards"]]
];
page("studio.html", {
  path: "/studio", title: "Studio: Brand, Shoots, PR & Bespoke Builds | Pluto Theory",
  description: "Pluto Theory's studio handles the marketing work that needs people: brand and messaging, shoots and creative production, PR outreach and bespoke builds.",
  body: `
<section class="phero dark" data-theme="dark">
  <div class="wrap phero-grid">
    <div>
      <nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>Studio</span></nav>
      <span class="pill" data-reveal><span class="dot"></span>The 30%</span>
      <h1 class="h-xl words" data-in style="margin-top:24px">${words("The work that needs", { t: "people.", cls: "it" })}</h1>
      <p class="lede" data-reveal style="--d:3">Sometimes the system needs more than an automation. Clearer messaging, real photos, a person on the phone to a journalist, a site built from scratch. Our studio team does that work, alongside your automations or on its own.</p>
      <div class="ctas" data-reveal style="--d:4">${btn("/contact?interest=studio", "Talk to the studio")}</div>
    </div>
    <div class="pt-scene" data-scene="hero" data-variant="clap" data-reveal="scale" style="--d:2" role="img" aria-label="Plu and Theo high-five"></div>
  </div>
  <div class="wrap strip" style="margin-top:72px"><div class="strip-in"><p>Brands our team has worked with</p>${marquee()}</div></div>
</section>
<section class="section">
  <div class="wrap">
    <div class="tasks">
      ${STUDIO.map(([ic, h, t, l], i) => `<div class="box" data-reveal style="--d:${i % 2}"><span class="card-ico" style="width:52px;height:52px;border-radius:16px;display:grid;place-items:center;background:var(--ink);color:#fff;margin-bottom:22px">${I[ic].replace("<svg", '<svg width="24"')}</span><h3>${h}</h3><p class="muted" style="margin-bottom:18px">${t}</p><ul>${l.map((x) => `<li>${I.check}<span>${x}</span></li>`).join("")}</ul></div>`).join("")}
    </div>
  </div>
</section>
<section class="section--tight"><div class="wrap"><div class="head head--center"><span class="eyebrow" data-reveal>How it fits</span><h2 class="h-lg words" data-in>${words("Automation for the 70%. Studio for the 30%.")}</h2></div>${split7030(false)}</div></section>
<section class="section--tight"><div class="wrap wrap--narrow"><div class="head head--center"><h2 class="h-md words" data-in>${words("Studio questions")}</h2></div>${faq([
  ["Do I need an automation to work with the studio?", "No. Studio work can stand on its own. It works best when it feeds an automation, like messaging that shapes your follow-ups or photos that fill your content queue."],
  ["How is studio work priced?", "Each project has its own scope, fee and owner, quoted before we start."],
  ["Does the studio do branding and product photography in Hyderabad?", `Yes. Pluto Theory is based in Hyderabad, India, and its studio team handles brand and messaging and product and brand photography, including AI photoshoots for teams anywhere in the world. Each project is scoped and quoted before we start. If you are choosing a partner, read <a class="link" href="/blog/branding-agency-hyderabad">how to choose a branding agency in Hyderabad</a> and <a class="link" href="/blog/product-photography-cost-hyderabad">what product photography costs in Hyderabad</a>.`],
  ["Is human PR different from the PR workflow automation?", "Yes. The automation finds opportunities and prepares pitches. The studio adds people who run the outreach and build relationships."]
])}</div></section>
${cta({ h: "Tell us what you're making.", p: "Brand, shoots, PR or a bespoke build. We'll reply with next steps and a clear scope.", primary: ["/contact?interest=studio", "Talk to the studio"], secondary: ["/automations", "Explore automations"] })}`
});

/* ============ About ============ */
page("about.html", {
  path: "/about", title: "About Pluto Theory | AI Marketing Automations on Subscription",
  description: "Pluto Theory builds AI automations for recurring marketing work and makes them available through subscriptions, with a studio team for the work that needs people.",
  body: `
<section class="phero dark" data-theme="dark">
  <div class="wrap wrap--narrow">
    <nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>About</span></nav>
    <h1 class="h-xl words" data-in>${words("Marketing keeps creating", { t: "work.", cls: "it" })}</h1>
    <div class="lede" data-reveal style="--d:3;display:grid;gap:18px;margin-top:28px">
      <p>Research has to be updated. Posts need a process. Enquiries need a response. Customers need a follow-up.</p>
      <p>Pluto Theory builds AI automations for that recurring work and makes them available through subscriptions. We package the process into products businesses can understand, connect and use.</p>
      <p>The aim is simple: more marketing capacity, less dependence on someone manually restarting the next task. Clear outputs. Visible controls. A useful place to begin.</p>
      <p>For the work that needs people, our studio is there too.</p>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="head head--center"><span class="eyebrow" data-reveal>Meet the guides</span><h2 class="h-lg words" data-in>${words("Plu asks “What if?” Theo says “Let's do it.”")}</h2></div>
    <div class="tasks">
      <div class="box" data-reveal style="display:grid;grid-template-columns:150px 1fr;gap:24px;align-items:center"><div class="pt-scene" data-scene="portraitP" aria-hidden="true"></div><div><span class="eyebrow">Plu · The Questioner</span><h3 style="margin-top:10px">Asks the question everyone skipped.</h3><p class="muted">Curious, precise, kindly sceptical. The reason every automation has clear limits.</p></div></div>
      <div class="box" data-reveal style="--d:1;display:grid;grid-template-columns:150px 1fr;gap:24px;align-items:center"><div class="pt-scene" data-scene="portraitT" aria-hidden="true"></div><div><span class="eyebrow" style="color:#2E9C4B">Theo · The Idea Machine</span><h3 style="margin-top:10px">Turns ideas into things that ship.</h3><p class="muted">Bold, fast, never at the cost of trust. The reason it all happens in a click.</p></div></div>
    </div>
  </div>
</section>
<section class="section--tight white">
  <div class="wrap">
    <div class="head head--center"><span class="eyebrow" data-reveal>The team</span><h2 class="h-md words" data-in>${words("The team")}</h2></div>
    <div class="two-col" style="max-width:920px;margin-inline:auto">${[["Arjun", "Co-founder", "Co-founded Pluto Theory and leads the studio with Swaroop, from first call to finished work."], ["Swaroop", "Co-founder", "Co-founded Pluto Theory and leads the studio with Arjun, from first call to finished work."], ["Akshith", "AI & Automations Lead", "Leads our automation and agent work: finding the busy work in a business and building what does it."], ["Sanjay", "AI & Creative Lead", "Leads the work where AI meets creative, from AI photoshoots to AI-made content that still looks like the brand."]].map(([n, r, b], i) => `<div class="box" id="${n.toLowerCase()}" data-reveal style="--d:${i % 2};display:flex;gap:18px;align-items:flex-start"><span class="p-av" style="width:56px;height:56px;font-size:18px;flex:none">${n[0]}</span><div><h3 style="margin:0">${n}</h3><p class="muted" style="font-weight:600;margin:4px 0 8px">${esc(r)}</p><p class="muted">${b}</p></div></div>`).join("")}</div>
  </div>
</section>
${cta()}`
});

/* ============ Contact ============ */
const interests = [...PRODUCTS.map((p) => [p.slug, p.name]), ["studio", "Studio work"], ["not-sure", "Not sure yet"]];
page("contact.html", {
  path: "/contact", title: "Request a Demo or Contact Pluto Theory",
  description: "Request a demo of a Pluto Theory marketing automation, or talk to the studio. Tell us which marketing task keeps coming back and we'll reply with next steps.",
  dark: false,
  body: `
<section class="phero">
  <div class="wrap contact-grid">
    <div>
      <nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>Contact</span></nav>
      <h1 class="h-xl words" data-in>${words("Which task keeps", { t: "coming back?", cls: "it" })}</h1>
      <p class="lede" data-reveal style="--d:3">Tell us the marketing work you'd like off your list. We'll reply within one working day with the automation that fits and a time for a demo.</p>
      <div class="contact-aside" style="margin-top:36px">
        <div class="box" data-reveal><b>Email</b><p><a class="link" href="mailto:${EMAIL}">${EMAIL}</a></p></div>
        <div class="box" data-reveal style="--d:1"><b>What happens next</b><p>A short reply, then a live demo of the automation you picked. You'll see what it does today and get the plan details.</p></div>
      </div>
    </div>
    <form class="form" data-reveal="scale" data-form method="post" action="https://api.web3forms.com/submit" data-endpoint="https://api.web3forms.com/submit" data-access-key="0d2ea896-e674-4afb-9865-555f53d9f1e5">
      <input type="hidden" name="access_key" value="0d2ea896-e674-4afb-9865-555f53d9f1e5">
      <input type="hidden" name="subject" value="New enquiry from plutotheory.com">
      <div class="row2">
        <div class="field"><label for="f-name">Name</label><input id="f-name" name="name" autocomplete="name" required></div>
        <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
      </div>
      <div class="row2">
        <div class="field"><label for="f-phone">Phone <span class="muted" style="font-weight:400">(optional)</span></label><input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel"></div>
        <div class="field"><label for="f-company">Company</label><input id="f-company" name="company" autocomplete="organization"></div>
      </div>
      <fieldset class="field"><legend>What would you like to see?</legend>
        <div class="opts">${interests.map(([v, t]) => `<input type="checkbox" name="interest" id="i-${v}" value="${esc(t)}" data-slug="${v}"><label for="i-${v}">${t}</label>`).join("")}</div>
      </fieldset>
      <div class="field"><label for="f-msg">The task that keeps coming back</label><textarea id="f-msg" name="message" rows="4" placeholder="e.g. We get enquiries from our website and Instagram, and follow-ups slip."></textarea></div>
      <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <p class="form-msg" role="status" aria-live="polite"></p>
      <button class="btn btn--primary" type="submit">Request a demo ${I.arrow.replace("<svg", '<svg class="arr"')}</button>
    </form>
  </div>
</section>`
});

/* ============ Privacy ============ */
page("privacy.html", {
  path: "/privacy", title: "Privacy Policy | Pluto Theory", dark: false,
  description: "What the Pluto Theory website collects, why, and what you can ask us to do with it.",
  body: `
<section class="phero"><div class="wrap prose">
  <nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>Privacy</span></nav>
  <h1 class="h-lg">Privacy policy</h1>
  <p class="lede" style="margin-top:20px">What this website collects, why, and what you can ask us to do with it. Last updated 25 November 2026.</p>
  <h2>Who we are</h2><p>This website is run by Pluto Theory, which builds AI marketing automations offered on subscription and runs a studio for brand, production, PR and bespoke work. You can reach us at <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>
  <h2>What we collect</h2><ul>
    <li><b>Contact form.</b> When you send the form we receive your name, email, phone (if given), company, the automations or services you picked and your message. The form is delivered to our inbox by Web3Forms (web3forms.com).</li>
    <li><b>Emails you send us.</b> We keep them so we can reply and follow up.</li>
    <li><b>Where your enquiry came from.</b> While you browse, your browser tab remembers the first page you opened, the site that sent you and any campaign or ad click labels in the link (such as utm_source or gclid). We receive this only if you send the contact form, with a reference number for the enquiry. It is cleared when you close the tab.</li>
    <li><b>Visit statistics.</b> The site can use Google Analytics to understand how people use it, such as which pages are visited. When it is switched on, we ask you first. If you accept, it may set cookies and collect information about your device and visit. If you decline, it does not load.</li>
    <li><b>Hosting.</b> The site is hosted on Vercel, which keeps standard technical logs to run and protect the service.</li></ul>
  <h2>How we use it</h2><p>We use what you send us to reply to your enquiry, arrange demos and work with you. We use visit statistics to improve the website. We do not sell your information.</p>
  <h2>How long we keep it</h2><p>We keep enquiries for as long as we need them to talk to you and, if we work together, for our records.</p>
  <h2>Your choices</h2><p>You can ask us to show, correct or delete the information you have sent us by emailing <a href="mailto:${EMAIL}">${EMAIL}</a>. You can block or delete cookies in your browser settings. <button type="button" class="link" data-consent-reset hidden>Change my analytics choice</button></p>
  <h2>Automation customers</h2><p>If you subscribe to an automation, how it uses your connected accounts and data is set out in your plan terms.</p>
  <h2>Changes</h2><p>If this policy changes, we will update this page and the date at the top.</p>
</div></section>`
});

/* ============ 404 ============ */
page("404.html", {
  path: "/404", title: "Page not found | Pluto Theory", description: "This page drifted out of orbit.", noindex: true,
  body: `<section class="phero dark" data-theme="dark" style="min-height:80vh"><div class="wrap" style="text-align:center">
    <div class="pt-scene" data-scene="portraitP" data-mood="shocked" style="width:180px;margin:0 auto 24px" aria-hidden="true"></div>
    <h1 class="h-xl">Lost in orbit.</h1><p class="lede" style="margin:20px auto 34px">This page drifted off. Plu is looking into it.</p>
    <div class="ctas" style="justify-content:center">${btn("/", "Back home")}${btn("/automations", "Explore automations", "btn--ghost")}</div>
  </div></section>`
});

/* ============ Write files ============ */
for (const { file, html } of pages) {
  const out = join(ROOT, file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
}
// sitemap.xml is rebuilt by the SEO workflow (tools/build-sitemap.mjs); robots.txt and llms.txt are edited by hand
// and by the SEO agent, so this script leaves them alone.
// The blog pages are written by hand (and by the SEO agent); give them the current header, footer and styles.
const blog = convertBlog(ROOT);
console.log(`Built ${pages.length} pages; blog: ${blog.files} pages checked, ${blog.changed} updated.`);

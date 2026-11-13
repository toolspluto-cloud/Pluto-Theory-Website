// /ai-automation — build with: node make-service-page.mjs pages/ai-automation.mjs
const CTA = "/contact?pillar=AI%20automation";
export default {
  slug: "ai-automation",
  title: "AI Automation Agency in India | Pluto Theory",
  description: "Pluto Theory builds AI automations for businesses in India and worldwide: lead follow-ups, CRM updates, WhatsApp and email replies, reports and document work.",
  crumb: "AI automation",
  serviceName: "AI workflow automation",
  serviceType: "AI automation and business process automation",
  faq: [
    ["What does an AI automation agency do?", "It finds the repetitive work in your business and builds workflows that do it for you, using AI for the parts that need reading or writing: understanding a message, pulling details from a document, drafting a reply. Pluto Theory does this for businesses across India and worldwide, from Hyderabad."],
    ["What can be automated with AI?", "Most frequent, rule-shaped work: lead follow-ups, CRM updates, data entry from invoices and forms, sorting emails and WhatsApp messages, scheduling, reports and first drafts. Work that needs judgement or a relationship stays with people, and we design the hand-over."],
    ["Do we have to change the tools we use?", "Usually not. We connect the tools you already have, such as your CRM, Google Workspace or Microsoft 365, spreadsheets, WhatsApp Business and accounting software. If a tool can't be connected, we suggest the simplest change."],
    ["Is our data safe?", "We give each workflow only the data it needs, keep it in your own accounts where possible, and tell you which AI services will see which data before anything goes live. We design with India's Digital Personal Data Protection Act, 2023 in mind, alongside your own policies."],
    ["How much does AI automation cost?", "It depends on how many tools and steps a workflow has and how much AI it needs. We quote per workflow after a short call, and suggest starting with one so you can see it working before you automate more. Running costs, such as AI and software subscriptions, are listed separately."]
  ],
  mainHtml: `    <section class="page-hero svc-hero">
      <div class="wrap">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">AI automation</span></nav>
        <p class="eyebrow reveal" style="--accent: var(--green)">AI automation · India &amp; worldwide</p>
        <h1 class="reveal" data-delay="1">AI automation that takes the busy work off your team.</h1>
        <p class="sub reveal" data-delay="2">We find the repetitive work in your business (leads, follow-ups, data entry, reports, documents) and build AI-powered workflows that do it for you, connected to the tools you already use.</p>
        <div class="ctas reveal" data-delay="3"><a class="btn btn--primary" href="${CTA}">Automate a workflow <span class="arrow">→</span></a><a class="btn btn--ghost" href="/ai-agents">Need an AI agent or chatbot?</a></div>
      </div>
    </section>

    <section class="section--tight">
      <div class="wrap svc-body">
        <div class="prose reveal">
          <h2>What AI automation is</h2>
          <p>Automation connects your tools so work moves by itself: a new lead lands in your CRM, gets a reply within a minute, and a follow-up task appears for the right person. AI handles the parts that used to need someone to read or write: understanding an email, pulling details out of an invoice, summarising a call, sorting enquiries by what the customer wants, drafting the first reply.</p>
          <p>The result is fewer copy-pastes, faster replies and numbers you can trust, without hiring for work nobody enjoys.</p>
          <h2>Where it pays off first</h2>
          <p>The best first projects are frequent, repetitive and follow clear rules: tasks your team does many times a week in the same way. A five-minute job that happens fifty times a week is a strong candidate. A task that needs judgement every time is usually better helped by an <a href="/ai-agents">AI assistant</a> that drafts and a person who decides.</p>
          <h2>Built to be trusted</h2>
          <p>Every workflow we build keeps a record of what it did, puts a person in the loop wherever a mistake would be costly, and alerts you when something fails instead of failing silently. You own the workflows and the accounts they run on, with documentation your team can follow.</p>
          <h2>From a studio that also does creative</h2>
          <p>Pluto Theory is an AI and creative studio. The same team that automates your operations also does <a href="/branding">branding</a>, <a href="/photography">photography</a> and <a href="/ai-photoshoot">AI photoshoots</a>, so automations that face your customers, like replies and content, sound and look like your brand.</p>
        </div>
        <aside class="facts reveal" data-delay="1" aria-labelledby="facts-title">
          <h2 id="facts-title">At a glance</h2>
          <dl>
            <div><dt>Available</dt><dd>India and worldwide, remote</dd></div>
            <div><dt>Based in</dt><dd>Hyderabad, India</dd></div>
            <div><dt>Connects</dt><dd>CRMs, Google Workspace, Microsoft 365, WhatsApp Business, spreadsheets, your own software</dd></div>
            <div><dt>Built with</dt><dd>Automation platforms such as n8n, Make or Zapier, or custom code</dd></div>
          </dl>
          <a class="btn btn--primary" href="${CTA}">Start a project <span class="arrow">→</span></a>
        </aside>
      </div>
    </section>

    <section class="section--tight">
      <div class="wrap">
        <div class="section-head"><h2 class="reveal">What you can automate</h2></div>
          <div class="gets-grid cols-3">
            <div class="get reveal" data-delay="0"><span class="ic" data-ic="bolt"></span><b>Lead capture &amp; follow-up</b><p>Enquiries from your site, ads and WhatsApp land in one place, get an instant reply and a follow-up plan.</p></div>
            <div class="get reveal" data-delay="1"><span class="ic" data-ic="chat"></span><b>Customer messages</b><p>Emails and messages sorted by intent, answered from your own information, and passed to a person when needed.</p></div>
            <div class="get reveal" data-delay="2"><span class="ic" data-ic="folder"></span><b>Documents &amp; data entry</b><p>Invoices, forms and PDFs read by AI, checked, and entered into your sheets or accounting tool.</p></div>
            <div class="get reveal" data-delay="0"><span class="ic" data-ic="chart"></span><b>Reports &amp; dashboards</b><p>Sales, marketing and operations numbers pulled together on a schedule, with a plain-language summary.</p></div>
            <div class="get reveal" data-delay="1"><span class="ic" data-ic="people"></span><b>Hiring &amp; team admin</b><p>CV shortlists, interview scheduling and onboarding checklists that run themselves.</p></div>
            <div class="get reveal" data-delay="2"><span class="ic" data-ic="social"></span><b>Content operations</b><p>One piece of content turned into posts, captions and newsletters in your brand voice, ready for review.</p></div>
          </div>
      </div>
    </section>

    <section class="section--tight">
      <div class="wrap">
        <div class="section-head"><h2 class="reveal">How an automation project works</h2></div>
        <div class="steps">
          <div class="step reveal">
            <div class="big">01</div>
            <h3>Map the work</h3>
            <p>A short call to list the repetitive tasks, how often they happen and how long they take. We pick the one with the clearest payoff.</p>
          </div>
          <div class="step reveal" data-delay="1">
            <div class="big">02</div>
            <h3>Build and test</h3>
            <p>We build the workflow on your tools, test it on real examples, and add a human check wherever a mistake would matter.</p>
          </div>
          <div class="step reveal" data-delay="2">
            <div class="big">03</div>
            <h3>Launch and improve</h3>
            <p>We switch it on, watch it closely for the first weeks, document it and walk your team through it, then move to the next workflow.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section--tight">
      <div class="wrap faq">
        <h2 class="reveal">Questions people ask</h2>
{{FAQ}}
      </div>
    </section>

    <section class="section--tight">
      <div class="wrap">
        <div class="section-head"><h2 class="reveal">Also at Pluto Theory</h2></div>
        <div class="related reveal">
          <a href="/ai-agents"><b>AI agents &amp; chatbots</b><span>Assistants for your website, WhatsApp and team.</span></a>
          <a href="/ai-photoshoot"><b>AI photoshoots</b><span>On-brand product images, made with AI.</span></a>
          <a href="/branding"><b>Branding</b><span>Identity, naming, voice and guidelines.</span></a>
        </div>
      </div>
    </section>

    <section class="section band">
      <div class="orbit" aria-hidden="true"></div>
      <div class="orbit orbit-2" aria-hidden="true"></div>
      <div class="wrap">
        <h2 class="reveal">Give your team their hours back.</h2>
        <p class="reveal" data-delay="1">Tell us the task you're tired of doing by hand. We'll reply with how we'd automate it and a quote.</p>
        <div class="ctas reveal" data-delay="2"><a class="btn btn--primary" href="${CTA}">Automate a workflow <span class="arrow">→</span></a></div>
      </div>
    </section>`
};

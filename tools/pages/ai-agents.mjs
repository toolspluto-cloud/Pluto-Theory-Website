// /ai-agents — build with: node make-service-page.mjs pages/ai-agents.mjs
const CTA = "/contact?pillar=AI%20agents";
export default {
  slug: "ai-agents",
  title: "AI Agent & Chatbot Development in India | Pluto Theory",
  description: "Pluto Theory builds AI agents and chatbots for businesses across India: website and WhatsApp chatbots that answer from your own information and hand over to a person.",
  crumb: "AI agents & chatbots",
  serviceName: "AI agents and chatbots",
  serviceType: "AI agent and chatbot development",
  faq: [
    ["What is the difference between a chatbot and an AI agent?", "A chatbot answers questions. An AI agent can also take actions with tools you allow it to use, such as looking up an order, updating your CRM, booking a meeting or raising a ticket. Many businesses need both: an assistant that answers, and acts when it is safe to."],
    ["Can it work on WhatsApp?", "Yes. WhatsApp assistants run on Meta's WhatsApp Business Platform, which needs a verified business account and an approved number. We help you set that up, and we explain Meta's messaging charges before launch."],
    ["What happens when it doesn't know the answer?", "It says so and hands the conversation to your team with the context, instead of guessing. We set clear limits on what it may answer and do, and test it on tricky questions before it goes live."],
    ["Will customers know they are talking to AI?", "We recommend telling them, and we design assistants to say they are AI and to offer a person whenever the customer asks."],
    ["How much does an AI chatbot or agent cost?", "It depends on the channels, the systems it connects to and how many conversations it handles. We quote after a short call, and list running costs such as AI usage and messaging fees separately, so there are no surprises."]
  ],
  mainHtml: `    <section class="page-hero svc-hero">
      <div class="wrap">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">AI agents &amp; chatbots</span></nav>
        <p class="eyebrow reveal" style="--accent: var(--purple)">AI agents &amp; chatbots · India &amp; worldwide</p>
        <h1 class="reveal" data-delay="1">AI agents and chatbots that know your business.</h1>
        <p class="sub reveal" data-delay="2">Assistants for your website, WhatsApp and team that answer from your own information, qualify leads, book meetings and hand over to a person when they should.</p>
        <div class="ctas reveal" data-delay="3"><a class="btn btn--primary" href="${CTA}">Build an AI agent <span class="arrow">→</span></a><a class="btn btn--ghost" href="/ai-automation">Automate a workflow instead?</a></div>
      </div>
    </section>

    <section class="section--tight">
      <div class="wrap svc-body">
        <div class="prose reveal">
          <h2>Chatbot or AI agent?</h2>
          <p>A chatbot answers questions. An AI agent also does things: it can look up an order, update your CRM, book a slot in your calendar or raise a support ticket, using only the tools you allow. Most businesses need a bit of both, and we help you decide where answering ends and acting begins.</p>
          <h2>Trained on your information, not the whole internet</h2>
          <p>We connect the assistant to your own knowledge: products, prices, policies, FAQs and documents. It answers from that, says when it doesn't know, and passes the conversation to your team with everything they need to pick it up.</p>
          <h2>It sounds like your brand</h2>
          <p>An assistant is often the first conversation a customer has with you. Because Pluto Theory is also a <a href="/branding">branding studio</a>, we write how it speaks: the tone, the greeting, how it says no, so it feels like your brand rather than a generic bot.</p>
          <h2>Safe by design</h2>
          <p>Every agent gets clear limits on what it may say and do, approval steps for anything that spends money or changes records, and a log of every conversation and action so you can review it. We tell you which AI services handle which data before launch.</p>
        </div>
        <aside class="facts reveal" data-delay="1" aria-labelledby="facts-title">
          <h2 id="facts-title">At a glance</h2>
          <dl>
            <div><dt>Channels</dt><dd>Website, WhatsApp, Instagram, email, Slack or Microsoft Teams</dd></div>
            <div><dt>Languages</dt><dd>English and Indian languages such as Hindi and Telugu</dd></div>
            <div><dt>Available</dt><dd>India and worldwide, remote</dd></div>
            <div><dt>Based in</dt><dd>Hyderabad, India</dd></div>
          </dl>
          <a class="btn btn--primary" href="${CTA}">Start a project <span class="arrow">→</span></a>
        </aside>
      </div>
    </section>

    <section class="section--tight">
      <div class="wrap">
        <div class="section-head"><h2 class="reveal">What we build</h2></div>
          <div class="gets-grid cols-3">
            <div class="get reveal" data-delay="0"><span class="ic" data-ic="browser"></span><b>Website assistant</b><p>Answers visitor questions, recommends the right product or service and collects enquiries.</p></div>
            <div class="get reveal" data-delay="1"><span class="ic" data-ic="chat"></span><b>WhatsApp &amp; Instagram assistant</b><p>Instant replies to common questions, at any hour, with a hand-over to your team.</p></div>
            <div class="get reveal" data-delay="2"><span class="ic" data-ic="idcard"></span><b>Lead qualification</b><p>Asks the right questions, sorts serious enquiries from browsers and books a call with sales.</p></div>
            <div class="get reveal" data-delay="0"><span class="ic" data-ic="shield"></span><b>Customer support agent</b><p>Order status, returns and FAQs handled, with the rest escalated with full context.</p></div>
            <div class="get reveal" data-delay="1"><span class="ic" data-ic="book"></span><b>Internal knowledge assistant</b><p>Your team asks questions of your documents, policies and SOPs and gets sourced answers.</p></div>
            <div class="get reveal" data-delay="2"><span class="ic" data-ic="gear"></span><b>Task agents</b><p>Agents that do multi-step jobs, like research, data clean-up and updating systems, with approval steps.</p></div>
          </div>
      </div>
    </section>

    <section class="section--tight">
      <div class="wrap">
        <div class="section-head"><h2 class="reveal">How we build an assistant</h2></div>
        <div class="steps">
          <div class="step reveal">
            <div class="big">01</div>
            <h3>Define the job</h3>
            <p>What it should handle, what it must never do, which systems it can use, and how we'll know it's working.</p>
          </div>
          <div class="step reveal" data-delay="1">
            <div class="big">02</div>
            <h3>Build and test</h3>
            <p>We connect it to your information and tools, write its voice, and test it against real and deliberately awkward conversations.</p>
          </div>
          <div class="step reveal" data-delay="2">
            <div class="big">03</div>
            <h3>Launch with a person in the loop</h3>
            <p>It goes live with your team watching, we review conversations, and we improve it from what customers actually ask.</p>
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
          <a href="/ai-automation"><b>AI automation</b><span>Workflows that do the repetitive work.</span></a>
          <a href="/branding"><b>Branding</b><span>Identity, naming, voice and guidelines.</span></a>
          <a href="/ai-photoshoot"><b>AI photoshoots</b><span>On-brand product images, made with AI.</span></a>
        </div>
      </div>
    </section>

    <section class="section band">
      <div class="orbit" aria-hidden="true"></div>
      <div class="orbit orbit-2" aria-hidden="true"></div>
      <div class="wrap">
        <h2 class="reveal">Your best salesperson, awake at 2 AM.</h2>
        <p class="reveal" data-delay="1">Tell us what your customers ask most. We'll reply with what an assistant could handle and a quote.</p>
        <div class="ctas reveal" data-delay="2"><a class="btn btn--primary" href="${CTA}">Build an AI agent <span class="arrow">→</span></a></div>
      </div>
    </section>`
};

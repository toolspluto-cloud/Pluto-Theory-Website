// The automation catalogue. Edit copy here, then run `node tools/build.mjs`.
// status: "early" (Early access, demo/waitlist), "pilot", "live" (ready to buy), "soon" (coming soon).
// Only change a product to "live" once its scope, connections, price and activation are tested.

export const GOALS = {
  discover: "Get discovered",
  enquiries: "Bring in enquiries",
  connected: "Keep customers connected"
};

export const PRODUCTS = [
  {
    slug: "seo", name: "SEO automation", icon: "seo", goal: "discover", status: "early", feature: false,
    short: "A recurring improvement process for your site.",
    card: "Keep site checks, improvement work and SEO reporting moving.",
    title: "SEO Automation Subscription | Pluto Theory",
    desc: "A subscription SEO automation that runs recurring site checks, prioritises improvements, prepares briefs and reports the work. See what runs and what needs your review.",
    eyebrow: "SEO automation",
    h1: "Keep your SEO work moving.",
    sub: "Turn occasional checks into a recurring process. See what needs attention, prepare the next improvements and track the work in one place.",
    problem: "SEO rarely fails for lack of ideas. It stalls because the checks, fixes and briefs keep slipping behind everything else that needs doing this week.",
    connect: ["Your website, or the agreed connection to it", "Business context: services, products, locations", "Target topics and the markets you serve", "Search data access where you have it"],
    receive: ["A prioritised work queue, refreshed on a schedule", "Page improvement recommendations", "Content briefs ready for review", "A plain-language progress report"],
    control: ["Which changes the automation may prepare or apply", "What needs your approval before it goes live", "The cadence of checks and reports"],
    steps: [["Check", "Recurring site checks look for issues and opportunities across your pages."], ["Prepare", "Improvements and content briefs are drafted and placed in your review queue."], ["Report", "You see what was completed, what is waiting for you and what comes next."]],
    includes: ["Recurring technical and on-page checks", "Topic and keyword research for your services", "Page title, description and content recommendations", "Content briefs for new or improved pages", "Approved changes applied where your site connection supports it", "Progress reports using the data available to us"],
    limits: ["Rankings depend on Google, competitors and your market. No automation can guarantee a position.", "We do not mass-produce pages without added value. Drafts are reviewed for accuracy.", "Applying changes directly depends on your site platform and the access you grant."],
    studio: "Need new pages written and designed by hand, or a site rebuild? Our studio team can help alongside the automation.",
    preview: "seo",
    faqs: [
      ["Will this get us to the first page of Google?", "No one can honestly promise that. The automation keeps useful SEO work happening every week and shows you what was done. We measure completed improvements alongside impressions, relevant clicks and enquiries."],
      ["Does it change my website on its own?", "Only where you allow it and your site connection supports it. By default, changes are prepared for your review first."],
      ["What does a report include?", "What was checked, what was improved, what is waiting for your review and how search visibility is moving, using the data you have connected."]
    ]
  },
  {
    slug: "lead-generation", name: "Lead generation", icon: "lead", goal: "enquiries", status: "early", feature: true,
    short: "Enquiries with a clear next step.",
    card: "Capture and organise supported enquiries, then connect them to a clear next step.",
    title: "Lead Generation Automation | Pluto Theory",
    desc: "Bring enquiries from supported channels into one process. Capture the details, route each opportunity and keep the next action visible. Lead handling on subscription.",
    eyebrow: "Lead generation automation",
    h1: "Turn enquiries into clear next steps.",
    sub: "Bring enquiries from supported channels into one process. Capture the details, route the opportunity and keep the next action visible.",
    problem: "An enquiry arrives through a form, an inbox or a DM. Someone means to reply. By the time they do, the details are scattered and the moment has passed.",
    connect: ["Your supported enquiry sources, such as website forms and inboxes", "The qualification questions that matter to you", "Routing rules: who owns which kind of enquiry", "Where enquiries should be handed over"],
    receive: ["One clean record per enquiry, with duplicates merged", "Source, details and qualification answers in one place", "An owner and a next action on every enquiry", "A summary of new enquiries by source"],
    control: ["Which sources are connected", "Which follow-up actions are permitted", "What needs a person before anything is sent"],
    steps: [["Capture", "Enquiries from supported sources land in one place as clean records."], ["Qualify & route", "Agreed details are collected and each enquiry is assigned to the right owner."], ["Next step", "A permitted next action is triggered or prepared for review."]],
    includes: ["Capture from supported forms and inboxes", "Deduplication of repeat enquiries", "Qualification details you define", "Routing to the right owner", "Drafted first replies for review", "Hand-off to your CRM or workspace"],
    limits: ["This product handles inbound enquiries. Prospect research and outbound outreach are separate and defined case by case.", "We do not sell scraped contact lists or promise a volume of ready-to-buy customers.", "Supported sources are listed during your demo. New sources are added as they are tested."],
    studio: "Need a landing page or a campaign to bring in the enquiries? Our studio and website automation can help.",
    preview: "lead",
    faqs: [
      ["Is this outbound lead generation?", "No. It captures and organises the enquiries you already receive. If you need prospect research or outreach, we scope that separately so you know exactly what is included."],
      ["Which enquiry sources are supported?", "We confirm the supported sources for your setup during the demo. Website forms and email inboxes are the usual starting point."],
      ["Does it reply to people automatically?", "Only if you allow it. By default, first replies are drafted for a person to approve."]
    ]
  },
  {
    slug: "crm", name: "CRM & follow-up", icon: "crm", goal: "connected", status: "early", feature: true,
    short: "Owners, records and next actions.",
    card: "Keep records, owners and follow-ups connected.",
    title: "CRM & Lead Follow-Up Automation | Pluto Theory",
    desc: "Keep lead records, owners and follow-ups connected. A CRM automation that maintains stages, flags overdue follow-ups and drafts messages for your review.",
    eyebrow: "CRM & customer follow-up automation",
    h1: "Give every recorded lead a next step.",
    sub: "Keep lead details, owners and follow-ups connected, so your team knows who needs attention and what to do next.",
    problem: "A new enquiry arrives. Someone replies. Then the conversation moves to another tool, the next action is unclear and the follow-up depends on someone remembering it.",
    connect: ["A supported CRM or an agreed workspace", "Your stages and what moves a lead between them", "Ownership rules for your team", "Communication preferences and approved contact routes"],
    receive: ["Up-to-date records with source, stage and owner", "Overdue follow-ups flagged before they go cold", "Relevant follow-up messages drafted for review", "Relationship history where the connection supports it"],
    control: ["The actions the automation may take", "The points that need a person's review", "How often and through which channels people are contacted"],
    steps: [["Capture & organise", "Bring supported enquiries into a clear record."], ["Assign the next action", "Keep stage, owner and follow-up visible."], ["Review & keep moving", "Use agreed rules for permitted actions."]],
    includes: ["Record updates from supported sources", "Owner assignment and stage maintenance", "Overdue follow-up detection", "Drafted follow-ups that match the conversation", "A daily view of who needs attention", "Exception handling when something does not fit the rules"],
    limits: ["Staying in touch means relevant contact at sensible times, not constant messaging.", "We do not claim no lead can ever be missed. We make the gaps visible.", "Which CRMs are supported is confirmed during your demo."],
    studio: "Need help writing your follow-up sequences or shaping your sales message? Our studio team can help.",
    preview: "crm",
    faqs: [
      ["Do I need to switch CRMs?", "Not necessarily. We work with supported CRMs or an agreed workspace. We confirm what fits your setup during the demo."],
      ["Will it message my customers without asking?", "Only within the rules you set. Most teams start with every message drafted for review, then allow simple ones to send automatically."],
      ["What happens when a lead doesn't fit the rules?", "It is flagged as needing attention, with the reason, so a person can decide."]
    ]
  },
  {
    slug: "linkedin", name: "LinkedIn content", icon: "post", goal: "discover", status: "early", feature: false,
    short: "Your expertise, as a repeatable content process.",
    card: "Turn your expertise into a repeatable content process.",
    title: "LinkedIn Content Automation | Pluto Theory",
    desc: "Bring your experience and point of view. Pluto Theory turns them into a repeatable LinkedIn content process: research, drafts, a review queue and scheduling.",
    eyebrow: "LinkedIn content automation",
    h1: "Keep your LinkedIn presence moving.",
    sub: "Bring your experience and point of view. Pluto Theory helps turn them into a repeatable LinkedIn content process.",
    problem: "You know a consistent presence matters. But every week starts from a blank page, and the post you meant to write becomes the post you will write next week.",
    connect: ["Your role, experience and point of view", "Proof: results, stories and examples you are happy to share", "Brand and tone preferences", "Access needed for supported scheduling features"],
    receive: ["Relevant topic ideas based on your expertise", "Post drafts in your voice, ready to review", "An upcoming content calendar", "Performance summaries where available"],
    control: ["Every post is approved by you", "Topics you want covered or avoided", "Which supported features are switched on"],
    steps: [["Gather", "Your expertise, notes and proof become a content source."], ["Draft", "Posts are drafted and placed in your review queue."], ["Schedule", "Approved posts are scheduled through supported routes."]],
    includes: ["Positioning inputs and profile copy suggestions", "Topic research", "Post drafts in your voice", "A review and approval queue", "Supported scheduling", "Performance summaries"],
    limits: ["LinkedIn restricts third-party automation of activity on its site. We do not automate browsing, mass connection requests or personal conversations.", "Personal profiles and company pages have different supported features. We confirm which apply to you.", "Drafts are a starting point. Your review keeps them accurate and yours."],
    studio: "Need a profile rewrite, a photoshoot or a sharper personal brand? That is studio work, and we can help.",
    preview: "linkedin",
    faqs: [
      ["Will it post as me without asking?", "No. Every post goes through your review queue first."],
      ["Does it send connection requests or messages?", "No. LinkedIn does not allow that kind of automation, and it is not part of this product."],
      ["How do the drafts sound like me?", "They start from your own notes, stories and opinions, and get better as you edit and approve them."]
    ]
  },
  {
    slug: "instagram", name: "Instagram content", icon: "insta", goal: "discover", status: "early", feature: false,
    short: "Assets, captions, reviews and scheduling together.",
    card: "Bring assets, captions, reviews and scheduling together.",
    title: "Instagram Marketing Automation | Pluto Theory",
    desc: "Move from scattered ideas and assets to a clear Instagram content queue, with captions, reviews and supported publishing connected.",
    eyebrow: "Instagram content automation",
    h1: "Keep your Instagram organised and consistent.",
    sub: "Move from scattered ideas and assets to a clear content queue, with captions, reviews and supported publishing connected.",
    problem: "The photos are in one folder, the ideas are in your notes and the captions get written at 11pm. The result is a feed that posts when someone remembers.",
    connect: ["Business details and brand preferences", "Your photos and videos, or access to a separately scoped shoot", "Accurate product information", "A professional Instagram account for supported publishing"],
    receive: ["A planned content queue", "Captions drafted for each post", "Items ready for your review", "Scheduled and published status, with clear exceptions"],
    control: ["Every post and caption is approved by you", "Which formats are scheduled", "When and how often you post"],
    steps: [["Plan", "Ideas and assets become a planned content queue."], ["Caption & review", "Captions are drafted and everything waits for your approval."], ["Publish", "Approved posts are scheduled through supported publishing."]],
    includes: ["Content planning from your assets", "Caption drafts", "A review queue", "Supported scheduling and publishing", "Simple performance reporting"],
    limits: ["Automation cannot film your real product or create authentic customer testimonials. It works from the material you supply.", "Supported publishing requires a professional account and only covers the formats we list.", "Shoots and manual creative production are studio work, scoped separately."],
    studio: "No usable photos yet? Our studio team runs product shoots and creative production.",
    preview: "instagram",
    faqs: [
      ["Does it create my photos?", "No. It organises and publishes the material you supply. If you need new photos or video, our studio can scope a shoot."],
      ["Which post formats are supported?", "We confirm the supported formats for your account before you subscribe."],
      ["When will this be available?", "It is in early access. Request a demo and we will show you where it stands and what it supports today."]
    ]
  },
  {
    slug: "performance-marketing", name: "Performance marketing", icon: "perf", goal: "enquiries", status: "early", feature: false,
    short: "Campaign data, checks and next decisions.",
    card: "Bring campaign information, checks and next actions together.",
    title: "Performance Marketing Automation | Pluto Theory",
    desc: "Bring campaign information, routine checks and next actions into a repeatable process, so your team spends less time assembling the picture.",
    eyebrow: "Performance marketing automation",
    h1: "Keep campaign work and decisions in view.",
    sub: "Bring campaign information, routine checks and next actions into a repeatable process, so your team spends less time assembling the picture.",
    problem: "Every Monday someone exports the numbers, builds the same report and tries to spot what changed. The decisions get made late, if at all.",
    connect: ["Your advertising accounts", "Goals and what counts as a conversion", "Available creative", "Authorised budget limits"],
    receive: ["Campaign status and spend in one view", "Flagged exceptions: overspend, drops, broken tracking", "Suggested next actions with reasons", "A history of approved changes"],
    control: ["Whether the plan reports, recommends or changes campaigns", "Budget limits and who authorises spend", "Which changes need approval"],
    steps: [["Collect", "Campaign data is gathered into one consistent view."], ["Check", "Routine checks flag exceptions and opportunities."], ["Decide", "Suggested actions wait for your approval, with a record of every change."]],
    includes: ["Connected campaign reporting", "Routine checks and exception alerts", "Creative test organisation", "Suggested changes with reasons", "Approved changes applied where supported, within your limits"],
    limits: ["Advertising spend is separate from the subscription.", "Clicks alone do not prove business results. We report on qualified outcomes and the quality of your conversion data.", "Each plan states clearly whether it reports, recommends or changes campaigns."],
    studio: "Need ad creative made? Our studio team produces campaign assets and shoots.",
    preview: "performance",
    faqs: [
      ["Will it spend my money?", "Only within limits you authorise, and only on plans that include making changes. Many teams start with reporting and recommendations."],
      ["Is ad spend included?", "No. Your advertising budget is always separate from the subscription."],
      ["When will this be available?", "It is in early access. Request a demo to see what it supports today."]
    ]
  },
  {
    slug: "pr", name: "PR workflow", icon: "pr", goal: "discover", status: "early", feature: false,
    short: "Opportunities, angles and next steps.",
    card: "Find opportunities, prepare angles and track next steps.",
    title: "PR Workflow Automation | Pluto Theory",
    desc: "Find relevant PR opportunities, prepare a credible story and keep track of the next step. A PR process that continues beyond a one-off idea.",
    eyebrow: "PR workflow automation",
    h1: "Give your PR opportunities a process.",
    sub: "Find relevant opportunities, prepare a credible story and keep track of the next step. Build a PR process that continues beyond a one-off idea.",
    problem: "There is a story in your business. But spotting the right moment, preparing the angle and following up never quite fits into the week.",
    connect: ["Verified business facts and proof", "Spokesperson information", "Newsworthy developments as they happen", "Any approved outreach rules"],
    receive: ["Relevant opportunities, with reasons for the fit", "Sources and media research", "Story angles and pitch drafts", "Status and next actions for every opportunity"],
    control: ["Every pitch is approved before it goes anywhere", "Which outlets and topics are in scope", "Who is the spokesperson"],
    steps: [["Monitor", "Selected sources are watched for relevant opportunities."], ["Prepare", "Angles and pitch drafts are prepared from your verified facts."], ["Track", "Approved activity and follow-ups are recorded in one place."]],
    includes: ["Monitoring of selected sources", "Opportunity matching with reasons", "Media research", "Angles and pitch drafts", "Follow-up tracking"],
    limits: ["Coverage, interviews and journalist responses are editorial decisions. No product controls them.", "Pitches only use facts you have verified.", "Hands-on outreach and relationship building are studio work."],
    studio: "Want people to run the outreach and build media relationships? Our studio PR team can take it on.",
    preview: "pr",
    faqs: [
      ["Do you guarantee coverage?", "No. Journalists decide what they cover. We make sure good opportunities are spotted and well prepared."],
      ["Who sends the pitches?", "You, or our studio PR team if you add hands-on support. Nothing goes out without approval."],
      ["Is this the same as hiring a PR agency?", "It is the process part of PR, automated. The relationship part is people work, which our studio can add."]
    ]
  },
  {
    slug: "websites", name: "Websites & landing pages", icon: "web", goal: "enquiries", status: "early", feature: false,
    short: "Pages connected to your enquiry process.",
    card: "Create and maintain useful pages, then connect their enquiries to the next step.",
    title: "Website & Landing Page Automation | Pluto Theory",
    desc: "Create and maintain useful marketing pages from approved inputs, then connect the enquiries they generate to the next step in your lead and CRM process.",
    eyebrow: "Website & landing page automation",
    h1: "Make your website part of the marketing system.",
    sub: "Create and maintain useful marketing pages, then connect the enquiries they generate to the next step.",
    problem: "Your website was finished once. Since then the offers have changed, the pages have not, and the enquiry form sends emails into an inbox nobody owns.",
    connect: ["Approved business inputs and offers", "Your site platform, where supported", "Brand assets and templates", "Where enquiries should go next"],
    receive: ["Page previews before anything goes live", "Maintained content on selected pages", "Enquiry forms connected to your lead process", "Publishing status for every change"],
    control: ["Every page and change is previewed and approved", "Which pages the automation maintains", "Where enquiries are routed"],
    steps: [["Create", "Pages are built from approved inputs and templates."], ["Connect", "Enquiry forms are wired into your lead and CRM process."], ["Maintain", "Selected content stays current, with every change previewed first."]],
    includes: ["Landing pages from approved inputs", "Maintenance of selected content", "Enquiry form connections", "Hand-off into lead and CRM automations", "Previews and approvals for every change"],
    limits: ["Initial site creation, ongoing changes, hosting and maintenance are separate parts of the offer. Each plan says which are included.", "Supported site platforms are confirmed before you subscribe.", "Highly bespoke design is studio work."],
    studio: "Need a fully bespoke website or brand identity? Our studio team designs and builds those.",
    preview: "web",
    faqs: [
      ["Do you host the website?", "Hosting is a separate line in the offer. We will tell you clearly whether it is included in your plan."],
      ["Can it work with my existing site?", "If your platform is supported. We confirm that during the demo."],
      ["What if I want a completely custom design?", "That is studio work. We can design the site and then keep it maintained with the automation."]
    ]
  }
];

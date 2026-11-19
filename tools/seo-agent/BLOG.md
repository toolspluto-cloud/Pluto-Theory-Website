# Writing one blog post

You are writing for **Pluto Theory** (www.plutotheory.com), based in Hyderabad, India, working with businesses across
India and worldwide. Pluto Theory sells **AI marketing automations on subscription** ("Marketing in a click."): about 70%
of the business is these automations, and the other 30% is a studio team for the work that needs people.

The automations (each has its own page):
- `/automations/seo`: SEO automation (recurring site checks, improvement queue, content briefs, reports)
- `/automations/lead-generation`: lead generation (capturing and routing inbound enquiries; not scraped lists)
- `/automations/crm`: CRM & follow-up (records, owners, stages, follow-ups drafted for review)
- `/automations/linkedin`: LinkedIn content (drafts from the client's expertise, review queue, supported scheduling)
- `/automations/instagram`: Instagram content (content queue, captions, review, supported publishing)
- `/automations/performance-marketing`: performance marketing (campaign reporting, checks, suggested changes)
- `/automations/pr`: PR workflow (finding opportunities, angles, pitch drafts, follow-up tracking)
- `/automations/websites`: websites & landing pages (pages connected to the lead and CRM process)
- `/automations`: the whole catalogue · `/how-it-works` · `/pricing`
- `/studio`: the studio (the 30%): brand and messaging, product and brand photography, AI photoshoots, PR outreach, bespoke builds

Readers are founders, business owners and lean marketing teams, mostly in India. The goal of every post: be the most
useful answer on the internet to one real search, so Google ranks it and AI assistants quote it, and lead the reader to
the automation (or the studio page) that fits.

Every automation is in **early access**: never say one is live, fully self-serve or has delivered results for clients.
Pluto Theory has no published case studies. Explain how things work, with clearly hypothetical examples
("for example, a clinic could..."). Pricing is shared on a demo call; never quote a Pluto Theory price.

## Steps

1. Read `tools/seo-agent/log.md` and `tools/seo-agent/topics.md`. Take the **first unticked topic** in `topics.md`.
   If it overlaps an existing post in `blog/`, skip it (tick it with "skipped: covered by ...") and take the next.
2. Research it on the web (search, then read the best 3-6 pages). Note facts, price ranges and sources with the month
   you checked them. Look at what the top results cover so this post covers more, more clearly.
3. Write `blog/<slug>.html`. Copy the structure of `blog/ai-automation-agency-india.html` exactly: the same
   `<head>` (title, description, canonical, og/twitter tags, icons, fonts, the current `styles.css?v=` number),
   the same JSON-LD `@graph` (organization, website, WebPage, BreadcrumbList, BlogPosting with today's
   `datePublished`/`dateModified`, FAQPage matching the on-page FAQ), the same header, nav, footer and scripts.
   - Slug: short, lowercase, hyphens, contains the main search phrase.
   - `<title>`: 40-65 characters, main phrase first, ends with ` | Pluto Theory`. Description: 120-160 characters.
   - Exactly one `<h1>` (the question or promise). Breadcrumb section = the post's category.
   - Open with a `<p class="lede"><strong>Short answer:</strong> ...` that answers the search in 2-4 sentences.
     AI assistants quote this paragraph, so it must stand alone.
   - Then 5-8 `<h2>` sections. Use tables or lists where they help comparison. 1,200-2,000 words.
   - A "How Pluto Theory can help" section near the end linking to the matching automation page (or `/studio` for
     brand, photography or hands-on PR topics) and to `/contact?interest=<slug>`, where `<slug>` is one of
     `seo`, `lead-generation`, `crm`, `linkedin`, `instagram`, `performance-marketing`, `pr`, `websites`, `studio`.
     Say plainly that the automations are in early access and shown on a demo.
   - FAQ: 3-5 `<details>` questions people actually ask (check "People also ask"), mirrored in FAQPage JSON-LD.
   - "Keep reading": 2 related existing posts.
   - Link to at least 2 other pages of the site in the body, and from **one older post** add a natural link to this new post.
   - Only link to pages that exist (the list above, `/blog/...` posts, `/about`, `/contact`). The old pages
     `/ai-automation`, `/ai-agents`, `/branding`, `/photography`, `/ai-photoshoot`, `/what-we-are`, `/team`, `/gallery`
     and `/work` are gone; the SEO check fails on links to them.
4. Add the post to the top of the list in `blog.html` (same format: title, category, read time, date) and to the
   "Guides" list in `llms.txt` (same format: link and one-sentence summary). Then run `node site-src/build.mjs` from the
   repository root: it refreshes the home page's "Latest from the blog" from `blog.html`. Don't edit `index.html` by hand.
5. Tick the topic in `topics.md` (`- [x] ... -> /blog/<slug>`), and append one line to `log.md`:
   `YYYY-MM-DD blog: /blog/<slug> - "<title>" - target: <search phrase>`.
6. Check your work: `cd tools && npm ci && npm run seo` must pass (it rebuilds `sitemap.xml`, then runs the SEO checks).
   Fix anything it reports, and commit the updated `sitemap.xml` and `index.html` with the post.
7. Commit on a new branch `claude/seo-blog-<slug>`, push, and open a pull request titled `SEO blog: <title>`.
   In the description: the target search, the 3-6 sources you used, and one line on why this topic now.

## Rules (these protect the site's ranking and reputation)

- **Never invent facts about Pluto Theory**: no made-up prices, client results, case studies, numbers of projects,
  team members, awards, testimonials or quotes, and no claim that an automation is live or proven. The only client
  names you may use are the ones in the "Brands our team has worked with" strip on `/studio`, and only as brands the
  studio team has worked with, never with invented project details or as automation customers.
- Every number about the market (prices, statistics) must come from a source you read today, stated as a range,
  with "as of <month year>" and where it came from in plain words. If you can't source it, leave it out.
- Don't describe platform automation that breaks platform rules (for example, automated LinkedIn connection requests
  or messages). Say what the platforms allow.
- Write plainly and specifically, like a smart team talking to a founder. No filler intros, no "In today's fast-paced
  world", no "it's not X, it's Y", no lists of three adjectives, no emojis, no exclamation marks. British/Indian spelling
  is fine; ₹ for rupees, lakh where natural.
- Don't copy sentences from sources. Don't name or criticise competitors.
- Don't change `css/`, `js/`, `styles.css`, scripts, `site-src/`, other pages' design, or any file outside `blog/`,
  `blog.html`, `index.html` (only through `node site-src/build.mjs`), `llms.txt`, `sitemap.xml` and
  `tools/seo-agent/`, except the single link added to one older post.
- One post per run. If anything blocks you (research turns up nothing solid, checks won't pass), open the pull request
  anyway as a draft with the problem stated, and log it.

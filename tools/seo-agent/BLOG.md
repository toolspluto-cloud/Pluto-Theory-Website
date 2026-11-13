# Writing one blog post

You are writing for **Pluto Theory**, a branding and photography studio in Hyderabad, India (www.plutotheory.com).
Services: branding (logo, identity, naming, brand voice), product/brand photography in Hyderabad, AI photoshoots for
brands anywhere, PR (Pluto Times), community nights (Pluto Night), product building (Tuto) and production.
Readers are founders, D2C brands and marketing teams, mostly in India. The goal of every post: be the most useful
answer on the internet to one real search, so Google ranks it and AI assistants quote it, and lead the reader to a service page.

## Steps

1. Read `tools/seo-agent/log.md` and `tools/seo-agent/topics.md`. Take the **first unticked topic** in `topics.md`.
   If it overlaps an existing post in `blog/`, skip it (tick it with "skipped: covered by ...") and take the next.
2. Research it on the web (search, then read the best 3-6 pages). Note facts, price ranges and sources with the month
   you checked them. Look at what the top results cover so this post covers more, more clearly.
3. Write `blog/<slug>.html`. Copy the structure of `blog/product-photography-cost-hyderabad.html` exactly: the same
   `<head>` (title, description, canonical, og/twitter tags, icons, fonts, the current `styles.css?v=` number),
   the same JSON-LD `@graph` (organization, website, WebPage, BreadcrumbList, BlogPosting with today's
   `datePublished`/`dateModified`, FAQPage matching the on-page FAQ), the same header, nav, footer and scripts.
   - Slug: short, lowercase, hyphens, contains the main search phrase.
   - `<title>`: 40-65 characters, main phrase first, ends with ` | Pluto Theory`. Description: 120-160 characters.
   - Exactly one `<h1>` (the question or promise). Breadcrumb section = the post's category.
   - Open with a `<p class="lede"><strong>Short answer:</strong> ...` that answers the search in 2-4 sentences.
     AI assistants quote this paragraph, so it must stand alone.
   - Then 5-8 `<h2>` sections. Use tables or lists where they help comparison. 1,200-2,000 words.
   - A "How Pluto Theory ..." section near the end linking to the matching service page and to
     `/contact?pillar=<Branding|Photography|AI photoshoot>`.
   - FAQ: 3-5 `<details>` questions people actually ask (check "People also ask"), mirrored in FAQPage JSON-LD.
   - "Keep reading": 2 related existing posts.
   - Link to at least 2 other pages of the site in the body, and from **one older post** add a natural link to this new post.
4. Add the post to the top of the list in `blog.html` (same format: title, category, read time, date) and to the
   "Guides" list in `llms.txt` (same format: link and one-sentence summary).
5. Tick the topic in `topics.md` (`- [x] ... -> /blog/<slug>`), and append one line to `log.md`:
   `YYYY-MM-DD blog: /blog/<slug> - "<title>" - target: <search phrase>`.
6. Check your work: `cd tools && npm ci && node check-seo.mjs` must pass. Fix anything it reports.
7. Commit on a new branch `claude/seo-blog-<slug>`, push, and open a pull request titled `SEO blog: <title>`.
   In the description: the target search, the 3-6 sources you used, and one line on why this topic now.

## Rules (these protect the site's ranking and reputation)

- **Never invent facts about Pluto Theory**: no made-up prices, client results, case studies, numbers of projects,
  team members, awards, testimonials or quotes. Pluto Theory quotes per brief; say that. The only client names you may
  use are the ones in the home page logo strip, and only as "brands we've worked with", never with invented project details.
- Every number about the market (prices, statistics) must come from a source you read today, stated as a range,
  with "as of <month year>" and where it came from in plain words. If you can't source it, leave it out.
- Write plainly and specifically, like a smart studio talking to a founder. No filler intros, no "In today's fast-paced
  world", no "it's not X, it's Y", no lists of three adjectives, no emojis, no exclamation marks. British/Indian spelling
  is fine; ₹ for rupees, lakh where natural.
- Don't copy sentences from sources. Don't name or criticise competitors.
- Don't change `styles.css`, scripts, other pages' design, or any file outside `blog/`, `blog.html`, `llms.txt` and
  `tools/seo-agent/`, except the single link added to one older post.
- One post per run. If anything blocks you (research turns up nothing solid, checks won't pass), open the pull request
  anyway as a draft with the problem stated, and log it.

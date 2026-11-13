# One small improvement to the site

You are improving the SEO of www.plutotheory.com (Pluto Theory, an AI and creative studio in Hyderabad, India, working with
businesses across India and worldwide). AI automation (/ai-automation) and AI agents and chatbots (/ai-agents) are the
main focus; branding, photography and AI photoshoots carry equal weight on the site. Pluto Theory has no published AI case
studies yet: never claim AI clients or results.
Make **one** focused, measurable change per run. Small and right beats big and risky.

## Steps

1. Read `tools/seo-agent/log.md` so you don't repeat recent work. Don't touch a page changed in the last 7 days by
   this agent unless the latest data says it got worse.
2. Read the latest weekly report (Google Search Console data and AI answers):
   `curl -s "https://api.github.com/repos/toolspluto-cloud/Pluto-Theory-Website/issues?labels=seo-report&state=all&per_page=1"`
   (the `body` field). Also look at `tools/seo-report-config.json` for the searches we target.
3. Pick the single best change, in this order of preference:
   1. **Page 2 to page 1**: a search where we're at position 8-20. Improve the page Google shows for it: answer that
      search better (a clearer section, a short answer near the top, an FAQ that matches it), and use the phrase
      naturally in a heading.
   2. **Shown but not clicked**: a page with impressions and a low click rate. Rewrite its `<title>` and meta
      description (and og/twitter copies) to match what people searched, promising exactly what the page delivers.
   3. **Target search with no page**: a search in `seo-report-config.json` we never appear for. Strengthen the most
      relevant service page for it (section, FAQ, internal links from other pages). Leave new blog posts to the blog writer.
   4. **Structure**: internal links between related pages, FAQ + FAQPage schema where missing, `llms.txt` accuracy,
      alt text, a missing BreadcrumbList, `dateModified` on posts you changed.
   5. **AI answers**: if the report lists sources AI answers rely on, make sure the matching page states the facts
      those answers need (location, services, how pricing works) in one plain, quotable paragraph.
4. Make the change. Keep the page's design, voice and layout. If you change `styles.css` or a script (avoid it), bump
   every `?v=NN` on every page.
5. Append one line to `tools/seo-agent/log.md`:
   `YYYY-MM-DD improve: <page> - <what changed> - why: <the data point>`.
6. Check: `cd tools && npm ci && npm run seo` must pass (it rebuilds `sitemap.xml`, then runs the SEO checks); commit `sitemap.xml` if it changed.
7. Commit on a new branch `claude/seo-improve-<short-name>`, push, open a pull request titled `SEO: <what changed>`,
   with the data point that justified it and how we'll know if it worked.

## Rules

- **Never invent facts** about Pluto Theory (prices, clients, results, team, awards, reviews). Pluto Theory quotes per
  brief. Client names only as they already appear on the home page.
- Don't remove content that ranks; add or sharpen. Don't change page addresses (URLs). Don't remove `noindex` from
  `gallery` or `work`; they stay hidden until they have real work.
- Don't touch the contact form, the chat (`conversation.js`, `characters.js`), voices, analytics or `vercel.json`.
- No keyword stuffing, hidden text, doorway pages or fake reviews/schema. Write for people first.
- If there's nothing worth changing today, change nothing: log `no change - <reason>` and open no pull request.

# Pluto-Theory-Website

The website for [Pluto Theory](https://www.plutotheory.com), a branding and photography studio in Hyderabad.

This repository is the source of truth for the site. Vercel is connected to it:

- **Push to `main`** → Vercel publishes it to www.plutotheory.com within a minute.
- **Push to any other branch** (or open a pull request) → Vercel makes a private preview link to check first, without touching the live site.

Don't publish with `vercel deploy` from a computer any more: the next push to `main` would replace whatever was published that way.

## Publishing a change

```bash
git pull
# edit files
git add -A
git commit -m "Describe the change"
git push
```

When an HTML page changes, bump the `?v=NN` number on its CSS and JS links (on every page) so visitors' browsers fetch the new files instead of old cached copies.

## What's here

- `*.html`, `blog/`: the pages. Addresses have no `.html` (set in `vercel.json`).
- `styles.css`, `main.js`, `characters.js`, `conversation.js`, `interactions.js`, `popups.js`, `sound.js`, `icons.js`, `analytics.js`: the look and behaviour.
- `assets/`: logo, brand logos for the home page strip, gallery images.
- `voices/`: Plu and Theo's voice clips. Made with `scripts/generate-voices.mjs` (run `npm install` in `scripts/` first).
- `gallery.html`, `gallery.js`, `gallery-data.js`: the gallery. To add photos, put them in `assets/gallery/originals/{branding,photography,ai-photoshoot}/` and run `py scripts/build_gallery.py`. The full-size originals stay on your computer (they're in `.gitignore`); only the web-sized copies are committed.
- `vercel.json`: redirects, clean addresses, security headers and caching.
- `.vercelignore`: files kept in the repository but not put on the website (`scripts/`, `tests/`, `tools/`, `.github/`, this README).
- `tests/`: `node tests/dialogue.test.mjs` checks the chat script.
- `tools/`: browser tests and helpers, run on your computer (they use the installed Google Chrome). See below.

## Tests

GitHub runs every check automatically on each push and pull request (the **Actions** tab, workflow "Website tests", about 6 minutes). A red cross next to a commit means something broke; open it to see which page or feature, and download the screenshots it saves.

The same checks on your computer, in `tools/` (run `npm install` there once):

```bash
npm test           # everything, about 5 minutes
npm run test:quick # skips the slow chat and pop-up timers, about 2.5 minutes
npm run serve      # just the site at http://localhost:8090, set up like Vercel
```

`tools/ci.mjs` decides what passes. It covers: the chat script; every page on desktop and phone (errors, missing files, sideways scrolling, sections that never appear); the contact form; the voice clips; mute and the idea box; the pop-ups and home page chat; the chat voices. Other scripts in `tools/` are for measuring and screenshots rather than pass/fail: `check-voice-flow.mjs`, `check-voice-timing.mjs`, `check-cards.mjs`, `webkit-clap.mjs` (the high five in Safari's engine; needs `npx playwright install webkit` once). Each runs as `node <file> http://localhost:8090`. Reports and screenshots aren't committed.

## SEO automation

The **SEO** workflow (`.github/workflows/seo.yml`, about a minute) runs on every push:

- **Sitemap:** `tools/build-sitemap.mjs` rebuilds `sitemap.xml` from the pages. Every page without `noindex` is listed, dated by its last commit. On `main` the bot commits the result, so you never edit the sitemap by hand. To keep a page out of Google (like `gallery` and `work` for now), give it `<meta name="robots" content="noindex, follow">`; removing that line puts it in the sitemap.
- **Checks:** `tools/check-seo.mjs` fails the run on missing or badly sized titles and descriptions, wrong canonical addresses, pages without exactly one `<h1>`, broken structured data, images without alt text, broken internal links, a main page hidden by mistake, a robots.txt that blocks Google or AI crawlers, and blog posts missing from `llms.txt`.
- **IndexNow:** after a push to `main`, `tools/indexnow.mjs` waits until Vercel serves the new pages, then tells Bing which pages changed (ChatGPT search and Copilot use Bing's index). The key is the 32-character `.txt` file in the site folder; don't delete it. To resend every page: Actions → SEO → Run workflow → tick "Send every page".
- Google doesn't use IndexNow. It reads the sitemap, which must be submitted once in Google Search Console.

Run the checks yourself in `tools/`: `npm run seo`. They're also part of `npm test`.

## Weekly SEO report

Every Monday at 9:00 (India time), `.github/workflows/seo-report.yml` posts a report as a GitHub issue labelled `seo-report`, and GitHub emails it to you. Last week's issue is closed and used for the changes. Run it any time: Actions → Weekly SEO report → Run workflow. What it asks and tracks is in `tools/seo-report-config.json`.

- **Website health** (always): every sitemap page loads, and how fast.
- **Google** (needs the `GSC_SERVICE_ACCOUNT` secret): clicks, times shown, average position, the tracked searches, what people searched, top pages.
  1. In Google Cloud Console (signed in as plutotheory.pt@gmail.com), create a project, turn on the **Google Search Console API**, then create a **service account** and a **JSON key** for it.
  2. In Search Console → Settings → Users and permissions, add the service account's email with **Restricted** access.
  3. In `site/pluto-theory`: `gh secret set GSC_SERVICE_ACCOUNT < path/to/key.json`, then delete the downloaded key file.
- **AI answers** (needs the `ANTHROPIC_API_KEY` secret, roughly $1 a week): asks Claude, with live web search as someone in Hyderabad, the questions a client might ask. It records whether Pluto Theory is named or plutotheory.com cited, and which sites the answers relied on. Create a key at console.anthropic.com, then `gh secret set ANTHROPIC_API_KEY` (it asks you to paste it).

The contact form sends to Web3Forms. Its access key in `contact.html` is meant to be public.

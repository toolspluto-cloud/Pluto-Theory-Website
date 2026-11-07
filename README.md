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
- `.vercelignore`: files kept in the repository but not put on the website (`scripts/`, `tests/`, `tools/`, this README).
- `tests/`: `node tests/dialogue.test.mjs` checks the chat script.
- `tools/`: browser tests and helpers, run on your computer (they use the installed Google Chrome). See below.

## Testing before you push

Once, in `tools/`: `npm install`. Then, in `tools/`:

```bash
npm run serve      # the site at http://localhost:8090, set up like Vercel (keep this running)
npm test           # in a second window: chat script, every page on desktop and phone, contact form
```

Other checks in `tools/`, each run as `node <file> http://localhost:8090`: `check-clips.mjs` (voice clips), `check-voice-flow.mjs` and `check-voice-edges.mjs` (the talking chat), `check-popups.mjs`, `check-cards.mjs`, `check-before-tap.mjs`, `webkit-clap.mjs` (the high five in Safari's engine; needs `npx playwright install webkit` once). `check-site.mjs` saves screenshots in `tools/shots/`. Reports and screenshots aren't committed.

The contact form sends to Web3Forms. Its access key in `contact.html` is meant to be public.

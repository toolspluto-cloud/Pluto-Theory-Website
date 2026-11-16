# Pluto Theory website, v3

Marketing in a click. AI marketing automations on subscription (about 70% of the business), with a studio for the work that needs people (about 30%).

Plain static HTML, CSS and JS. No framework and no npm install needed.

## Work on it

```bash
node tools/build.mjs                         # rebuild every page after editing tools/*.mjs
node tools/serve.js . 8093                   # preview at http://localhost:8093
```

- `tools/products.mjs`: the eight automations. Copy, inputs, outputs, limits, FAQs and **status** (`early`, `pilot`, `live`, `soon`). Only mark one `live` once its scope, price and activation are tested.
- `tools/build.mjs`: every page's layout and copy.
- `tools/lib.mjs`: header, footer, icons and shared pieces.
- `css/site.css`, `js/site.js`: the look and all motion. `js/characters.js` draws Plu and Theo (unchanged from the old site).
- The generated `*.html`, `automations/*.html`, `sitemap.xml`, `robots.txt` and `llms.txt` are build output. Edit the `tools/` files, not these.

## Motion

Animations respect the visitor's reduced-motion setting: fades, typing and the workspace demo stay, while big movement (parallax, tilt, drifting stars, marquees) stops. To see everything on a computer with animations turned off, add `?motion=full` to any address.

## Before it replaces www.plutotheory.com

- Confirm each automation's real status in `tools/products.mjs`, and add prices to the plans once they're decided.
- Decide what happens to the old blog posts (`/blog/...`). They aren't in v3 yet and have no redirect.
- Re-add analytics (the old site's `analytics.js`) if you want it.
- Send one real test message through the contact form.
- `vercel.json` redirects the old pages (`/branding`, `/ai-automation`, `/team`, ...) to their closest new page.

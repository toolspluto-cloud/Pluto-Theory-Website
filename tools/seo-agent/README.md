# The SEO agent

Two scheduled tasks in the Claude desktop app (sidebar → Scheduled) work on this site by themselves. They run on the office computer, using the Claude plan, while the app is open; a run that was due while the app was closed happens on the next launch.

| Routine | When | What | Instructions |
|---|---|---|---|
| **SEO blog writer** | every 2 days, 10:00 India time | writes one new blog post from `topics.md` | [BLOG.md](BLOG.md) |
| **SEO site improver** | every day, 15:00 India time | makes one small, measurable improvement to an existing page | [IMPROVE.md](IMPROVE.md) |

Each run works on its own branch (`claude/seo-...`) and opens a pull request. GitHub then runs every check on it
(`tests.yml` and `seo.yml`). When all of them pass, `.github/workflows/seo-autopublish.yml` merges it, Vercel
publishes it, the sitemap updates and Bing is told. If a check fails, the pull request stays open for a person to look at.

Every run adds one line to [log.md](log.md), which is also how the next run knows what has already been done.

**Steering it:**
- Add, remove or reorder topics in `topics.md`. The writer always takes the first unticked one.
- Change the rules in `BLOG.md` / `IMPROVE.md`. They are read fresh on every run.
- To stop auto-publishing but keep the agent, label the pull requests yourself with `hold`, or delete `seo-autopublish.yml` (pull requests will then wait for you to merge).
- To pause or change them: Claude desktop app → Scheduled → "Pluto Theory: write an SEO blog post" / "Pluto Theory: improve the site's SEO".

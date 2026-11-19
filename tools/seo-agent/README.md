# The SEO agent

Two **cloud routines** work on this site by themselves, in Claude's cloud, so they run even when no computer is on
(https://claude.ai/code/routines; prompts and settings in [ROUTINES.md](ROUTINES.md)).

| Routine | When | What | Instructions |
|---|---|---|---|
| **Pluto Theory: daily SEO blog post** | every day, 10:00 India time | writes one new blog post from `topics.md` | [BLOG.md](BLOG.md) |
| **Pluto Theory: daily SEO improvement** | every day, 15:00 India time | makes one small, measurable improvement to an existing page | [IMPROVE.md](IMPROVE.md) |

Each run works on its own branch (`claude/seo-...`) and opens a pull request. GitHub then runs every check on it
(`tests.yml` and `seo.yml`). When all of them pass, `.github/workflows/seo-autopublish.yml` merges it, Vercel
publishes it, the sitemap updates and Bing is told. If a check fails, the pull request stays open for a person to look at.

Every run adds one line to [log.md](log.md), which is also how the next run knows what has already been done.

(Until 19 November 2026 these ran as scheduled tasks in the Claude desktop app on the office computer. Those are now
switched off; don't turn them back on alongside the cloud routines, or posts will double up.)

**Steering it:**
- Add, remove or reorder topics in `topics.md`. The writer always takes the first unticked one.
- Change the rules in `BLOG.md` / `IMPROVE.md`. They are read fresh on every run.
- To stop auto-publishing but keep the agent, label the pull requests yourself with `hold`, or delete `seo-autopublish.yml` (pull requests will then wait for you to merge).
- To pause, run now or change the schedule: https://claude.ai/code/routines.

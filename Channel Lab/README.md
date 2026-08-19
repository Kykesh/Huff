# Channel Lab — Scouting Future Faceless Channels

The decision factory for channel #2, #3, #4. Ranked Reality (`../Faceless/`) is the production floor; this folder is where new niches get evaluated BEFORE they cost a weekend of setup. Nothing in here launches anything — it produces verdicts, Kyle decides.

## Status
- Evaluations completed: 0
- Channels launched from the lab: 0 (Ranked Reality predates it)
- Portfolio guardrail: ACTIVE — no new launches until Ranked Reality hits 12 uploads + 30 days of data

## How to use it (one command)

```
/scout sleep science explainers              ← evaluate a niche idea
/scout https://youtube.com/@SomeChannel      ← tear down a reference channel
/scout inbox                                 ← process everything dropped in inbox/
```

`/scout` researches the candidate against `scoring_rubric.md` (money, competition, repeatability, automation fit with our existing stack, policy safety, 8-minute fit), pulls current numbers from the web, and writes a verdict file to `evaluations/`. Verdicts: **GO / WATCH / NO-GO** — with the one sentence that would change it.

Found a channel on your phone? Drop the link (any note, any format) into `inbox/` and run `/scout inbox` later.

## Folder structure
```
Channel Lab/
├── README.md            ← you are here (Status block above is the single source of truth)
├── scoring_rubric.md    ← the GO/WATCH/NO-GO framework /scout executes
├── niche_money_table.md ← RPM-per-subject reference (the "money amounts" list, expanded + verified)
├── inbox/               ← drop reference channels / links / half-ideas here
└── evaluations/         ← one verdict file per candidate (the lab's memory)
```

## The rules
1. **Evaluations are cheap; launches are expensive.** Scout anything. Launch only through `Money/START_HERE_NEW_PROJECT.md` Recipe A, manually, after a GO.
2. **One launch at a time.** The portfolio math ($30K+/mo) is 3–5 channels over 18+ months — built sequentially, never in parallel from zero. While the guardrail above is ACTIVE, GO verdicts park as GO (parked).
3. **The lab never edits `../Faceless/` or `../Money/`.** It reads them (pipeline reuse scoring needs to know our stack).
4. **Every number in an evaluation carries a source and a date.** Same standard as the channel itself.
5. **Old evaluations don't expire — they re-run.** RPMs and competition shift; `/scout` a NO-GO again in 6 months before acting on it.

## Why this exists (so future-us remembers)
Picking Ranked Reality's niche took a full multi-session analysis in June 2026. The thinking lived in chat and half of it evaporated. This folder makes niche selection a 10-minute command with a permanent paper trail instead of a rebuilt conversation.

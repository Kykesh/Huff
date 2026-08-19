# Start a New Project From This Kit

Go from "I want to build X" to a working project folder in under 30 minutes — without re-reading the whole kit.

## The rule that makes this work

**Money/ is the template library. Projects are instances.** Copy out, customize in the instance, never edit Money/ during project work. (Kit upgrades — like the V2.1 pass that produced this file — happen only on explicit instruction.)

---

## Step 0 — pick your recipe

| You're building | Recipe | Copy from | Setup time |
|---|---|---|---|
| Faceless YouTube VIDEO channel | A | `04_youtube_starter_kit/` + `03_agent_team/video_pipeline/` | 1 weekend |
| Written content channel / publication | B | `03_agent_team/` | 2 hours |
| Code feature pipeline in an existing repo | C | `03_agent_team/automated_pipeline/.claude/` | 30 min |
| Persistent memory / second brain | D | `05_memory_vault/` | 1 hour |
| Decision support only | — | Nothing. Invoke `02_prompt_library/07_council_skill.md` in place | 5 min |

---

## Recipe A — YouTube video channel

The full path. Reference instance: `../Faceless/` (live example of this exact recipe — Ranked Reality, Data/Rankings niche).

1. **Create a sibling folder** next to Money/ (e.g., `../MyChannel/`). Never build inside Money/.
2. **Lock the niche.** Read `04_youtube_starter_kit/00_niche_analysis.md`, score the 4 niches, pick ONE. Write the decision down — it's final for 90 days.
3. **Copy the templates in:**
   - `04_youtube_starter_kit/01_channel_identity_template.md` → `channel_identity.md`
   - `04_youtube_starter_kit/02_90_day_calendar_template.md` → `90_day_calendar.md`
   - `03_agent_team/CLAUDE.md` + `context.md` → project root
   - `03_agent_team/video_pipeline/.claude/` → `.claude/` (the agents + `/produce` command)
   - `03_agent_team/video_pipeline/SETUP_TEMPLATE.md` → `SETUP.md`
4. **Customize every [BRACKET] field** — identity, niche, palette, runtime targets. The video agents read `context.md` and `channel_identity.md` at runtime; if those are generic, output is generic.
5. **Instantiate the compliance gate.** Read `04_youtube_starter_kit/05_policy_compliance.md` and confirm its pre-upload checklist is embedded in your `publisher` agent. This is what keeps the channel monetizable.
6. **Run one-time setup** per your `SETUP.md`: `.env` keys, Remotion init, voiceover script test, 10-second test render.
7. **Verify end-to-end:** `/produce` one topic. Review every intermediate file. Only then trust the automation.

## Recipe B — written content channel

1. Create a sibling folder.
2. Copy `03_agent_team/CLAUDE.md`, `context.md`, and `agents/` into it.
3. Create `Research/`, `Outlines/`, `Drafts/`, `Published/`.
4. Fill in every [BRACKET]. Run the first 5 pieces with manual handoffs (`03_agent_team/README.md` Option A) before chaining.

## Recipe C — code feature pipeline

1. Copy `03_agent_team/automated_pipeline/.claude/` into the root of the target repo.
2. Read `03_agent_team/automated_pipeline/README.md` for the stage gates.
3. `/ship <feature in one sentence>`. Never auto-merge — the pipeline produces a verdict, not a commit.

## Recipe D — memory vault

1. Copy `05_memory_vault/` to its own sibling folder (NOT inside Money/).
2. Edit the copied `CLAUDE.md` — identity, projects, voice, hard rules.
3. Drop one test note in `00-INBOX/`, run "process my inbox," verify it files correctly.
4. Update Current Projects every Monday. That habit is the whole system.

---

## The anti-drift rules (learned from Faceless v1, June 2026)

These are the traps the first instantiation actually hit. Every new project follows these from day one:

1. **One source of truth per fact.** Voice and banned words live in `context.md` ONLY. `CLAUDE.md` points to them, never copies them. Duplicated lists drift within weeks.
2. **Status lives in ONE place** — a Status block at the top of the project README. Faceless v1 had a README saying "niche TBD" while three other files said the niche was locked.
3. **Calendars use relative slots** (Wk1-Tue, Wk1-Thu…) until launch day is real. Hard dates go stale the moment you slip — Faceless v1's calendar was 5 videos behind before video 1 existed.
4. **The pipeline's final artifact must BE the deliverable.** Faceless v1's pipeline ended at markdown articles — for a video channel. Map every stage to the real product before you run anything: if the deliverable is an MP4, a stage must produce an MP4.
5. **Secrets go in `.env`, never in a chat prompt.** A pasted API key sits in conversation history forever. Use `.env` + a `.env.example` documenting required keys.
6. **The 80% handoff rule.** Each stage's output format must be directly consumable by the next stage with zero cleanup. Verify the handoffs on run #1, not run #10.
7. **Gates, not vibes.** Every automated stage needs a machine-checkable pass condition (file exists, `Status:` line, duration ≥ floor). Prose instructions alone don't stop a bad stage from cascading.

---

## After setup: the first-run gauntlet

Before you call any new project "running":

- [ ] One full pipeline run completed end-to-end
- [ ] Every intermediate file opened and read by a human
- [ ] Every gate tested once by forcing a failure (give the pipeline a bad topic; confirm it STOPS instead of producing garbage)
- [ ] Status block in README updated to reflect reality

Then — and only then — increase volume.

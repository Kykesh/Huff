# Skill: Weekly Connections

**Trigger phrase:** "run connection session"

## Required reading
Read `CLAUDE.md` before starting.

## Process
1. Read all notes added to `01-CAPTURES/` in the last 7 days (check file dates / filenames)
2. Search for connections across ALL subfolders simultaneously
3. A strong connection is ONE OF FOUR TYPES:

   **TYPE A — Same underlying principle in two different domains**
   Example: "Open loops drive YouTube retention" + "Open loops drive sales call retention" = pattern about anticipation as engagement mechanism.

   **TYPE B — Contradiction between two notes creating tension**
   Example: "Specialization beats generalization in agent teams" + "Generalist founders beat specialists in early-stage startups" = tension worth resolving.

   **TYPE C — Pattern connecting 3+ notes into one unnamed insight**
   Example: 5 notes about different niches all observing "first 30 seconds decides outcome" = the insight is bigger than any single note.

   **TYPE D — A question from one note another note answers**
   Example: "Why do data-rankings channels grow so fast?" + a later note about "low competition + high repeatability + algorithm rewards consistency" answers it.

## Quality bar
If the connection is OBVIOUS, it does not qualify. Surface only connections that would genuinely surprise the person who wrote the notes.

Minimum: 3 connections.
Maximum: 5 connections.
Quality over quantity.

## Output format
```markdown
# Connection Session — [YYYY-MM-DD]

## Connection 1 — [TYPE A/B/C/D]
**The connection:** [one-sentence statement]

**Source notes:**
- `01-CAPTURES/[folder]/[note-1].md`: "[brief quote]"
- `01-CAPTURES/[folder]/[note-2].md`: "[brief quote]"
- [more if 3+]

**Why this matters:** [2-3 sentences on the implication]

**The brief opportunity:** [if this could become content, what's the angle?]

---

[repeat for connections 2-5]

---

## Patterns I noticed this week (across all captures, not just connected ones)
[1-2 sentences]

## The question worth sitting with this week
[The single question the pattern raises that you don't have an answer for yet]
```

## Save as
`02-CONNECTIONS/[YYYY-MM-DD]-connections.md`

## After running
At the end, ask: "Want me to generate a brief for the connection that surprised you most?"

If yes → trigger `generate_brief.md`

## Failure modes to avoid
- Forcing connections that aren't real (return fewer than 3 if there genuinely aren't strong ones)
- Confirming what the user already believed (surface the surprises, not the validations)
- Picking the BIGGEST connection — pick the most SURPRISING one
- Summarizing notes instead of connecting them — if your output is "here's what you wrote this week," you failed

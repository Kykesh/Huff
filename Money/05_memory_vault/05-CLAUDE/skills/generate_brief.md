# Skill: Generate Brief

**Trigger phrase:** "generate a brief for [topic / connection]"

## Required reading
Read `CLAUDE.md` and any relevant connection notes in `02-CONNECTIONS/`.

## Process
Create a content brief with EXACTLY five fields. No more. No less.

### Field 1 — ONE THING
The single insight this piece is built around. ONE sentence.

If the user's input is fuzzy ("write about AI agents"), push back BEFORE producing the brief:
"What's the ONE thing about AI agents you want the reader to walk away with? 'They're useful' isn't sharp enough — what's the specific insight?"

### Field 2 — PROOF
The most specific real example or number that proves the ONE THING.

REAL NUMBERS ONLY. Vague proof invalidates the brief.

❌ "Many people are using this"
✅ "Harvey AI saw a 6x increase in agent task-completion rates after enabling Dreaming (case study, May 2026)"

### Field 3 — READER TRANSFORMATION
What does the reader KNOW at the end that they didn't before?

If you can't state this clearly, the piece has no reason to exist. Push back on the user.

### Field 4 — THREE HOOKS (ranked)
- Hook 1 — AGGRESSIVE: provocation, contrast, status shift
- Hook 2 — CURIOUS: open loop, unexpected number, unresolved question
- Hook 3 — PERSONAL: "I" or "Last week I" — story-based entry

Each hook = 1-2 sentences. Must work as the opening 30 seconds of a video OR the first 2 lines of a thread.

### Field 5 — THREE CLOSERS (ranked)
Ranked by urgency and memorability.

The closer is written BEFORE the middle. Always. This is the destination — everything between hook and closer points here.

- Closer 1 — CONTRAST: "what happens if you don't act" vs "what happens if you do"
- Closer 2 — CTA: clean call to action, no begging
- Closer 3 — TEASE: bridge to the next piece (binge loop)

## Output format
```markdown
# Brief: [TOPIC / CONNECTION NAME]
Date: [YYYY-MM-DD]
Source: `02-CONNECTIONS/[file]` or `01-CAPTURES/[file]`

## ONE THING
[The single insight, ONE sentence]

## PROOF
[The specific example/number with source]

## READER TRANSFORMATION
[What they know at the end that they didn't before]

## THREE HOOKS
1. AGGRESSIVE: [hook]
2. CURIOUS: [hook]
3. PERSONAL: [hook]

## THREE CLOSERS
1. CONTRAST: [closer]
2. CTA: [closer]
3. TEASE: [closer]

## Format suggestions
- Best fit for: [Twitter thread / YouTube script / LinkedIn post / blog post]
- Estimated length: [N words / N tweets / N minutes]
- Recommended hook + closer pairing: [hook #X + closer #Y]
```

## Save as
`03-BRIEFS/[topic-kebab-case]-brief.md`

## After saving
Ask: "Ready to write the full piece from this brief, or want to iterate on the brief first?"

If write → trigger `write_content.md`

## Failure modes to avoid
- Skipping the pushback step when input is fuzzy
- Writing more than ONE sentence for the ONE THING
- Vague proof ("many", "often", "studies show")
- Generic hooks that don't pattern-interrupt
- Writing the body of the piece in the brief (this is the BLUEPRINT, not the article)

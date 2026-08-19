# Skill: Process Inbox

**Trigger phrase:** "process my inbox"

## Required reading
Read `CLAUDE.md` and `folder_structure.md` before starting.

## Process
1. Read every note in `00-INBOX/`
2. For each note:
   a. Determine which `01-CAPTURES/` subfolder it belongs to:
      - observations/ — something noticed (factual)
      - reactions/ — gut response (subjective)
      - patterns/ — same principle in 2+ domains
      - questions/ — genuine unknowns
      - numbers/ — real data points with specific figures
   b. Sharpen the raw note into ONE PUNCHY SENTENCE
   c. Add EXACTLY THREE tags (no more, no fewer)
   d. Move the sharpened note to the correct subfolder
3. After processing all notes, provide a status report:
   - Total notes processed and which folder each went to
   - Any patterns noticed across today's captures
   - One connection worth exploring from today's batch

## File naming
`[YYYY-MM-DD]-[3-5-word-summary-kebab-case].md`

Example: `2026-05-28-elevenlabs-adam-voice-overused.md`

## Note format (target)
```markdown
# [Sharpened one-sentence summary]

[The captured note, cleaned up but not over-edited]

Tags: #[tag1] #[tag2] #[tag3]
Source: [where this came from, if known]
Captured: [YYYY-MM-DD]
```

## Quality bar
A sharpened note should be specific enough that a STRANGER understands exactly what was observed without any additional context.

If a note still needs explanation: it's not sharp enough. Rewrite it.

## What "sharp" looks like

❌ Bad (vague):
"AI is changing content"

✅ Good (sharp):
"Faceless YouTube channels using Remotion + Claude can produce ranking videos in 30 minutes; the top channel in this niche reportedly does $372K/mo via a 5-channel portfolio."

## Failure modes to avoid
- Filing a note in the wrong subfolder because you weren't sure (default to `observations/` if truly ambiguous, NOT to topic-based logic)
- Adding more than 3 tags (the constraint forces specificity)
- Leaving sentences as questions when they should be statements
- Including timestamps in the file (the date is in the filename)
- Smoothing over contradictions (capture them verbatim — they're useful)

## After running
At the end of your status report, ask: "Should I run the connection session on this week's captures?"

If yes → trigger `weekly_connections.md`

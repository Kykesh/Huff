# Skill: Write Content

**Trigger phrase:** "write the brief for [topic]"

## Required reading
1. `CLAUDE.md` (especially the Voice section and banned phrases)
2. The brief at `03-BRIEFS/[topic]-brief.md`
3. Source notes referenced in the brief
4. (Optional but valuable) `04-PUBLISHED/` files for tone calibration

## Process
1. Read the brief completely BEFORE writing anything
2. Read the source notes for facts/examples
3. Choose: which HOOK and which CLOSER from the brief?
   - Default: HOOK 1 + CLOSER 1 unless you have a reason
4. Write the piece in the EXACT voice from CLAUDE.md
5. Structure:
   - HOOK (from brief)
   - PROOF (from brief, expanded with context)
   - BODY (the meat — develop the ONE THING)
   - CLOSER (from brief)

## Style requirements (from CLAUDE.md voice section)
- Short paragraphs (max 3 sentences)
- Bold key phrases for scannability
- Specific numbers > vague claims
- Named examples > "for instance"
- No filler — every sentence earns its place

## Banned phrases (from CLAUDE.md)
Do NOT use any phrase from the banned list. If you catch yourself wanting to, find a sharper alternative.

## Format adapt to the brief's "Format suggestions"
- Twitter thread → numbered tweets, each one self-contained
- YouTube script → spoken English, [VISUAL] tags, [PAUSE] markers
- LinkedIn post → 800 words max, hook in first 3 lines (the preview)
- Blog post → headers, subheadings, scannable

## Output
Pure markdown. No commentary. No meta-text. Just the publishable piece.

At the END, add:
```
---
## Self-check
- Hook lands in first 2 lines: [yes / no]
- Every section delivers on its claim: [yes / no]
- Would I share this: [yes / no — be honest]
- CTA is clear, not begging: [yes / no]

## Brief alignment
- ONE THING preserved: [yes / no]
- PROOF used as planned: [yes / no]
- Reader transformation delivered: [yes / no]
```

## Save as
`03-BRIEFS/[topic-kebab-case]-draft.md` (NOT to PUBLISHED — user does that)

## Quality bar
The output sounds INDISTINGUISHABLE from content the user wrote themselves.

If the user reads it and thinks "this sounds like AI wrote it" — you failed. Common tells:
- "It's important to note that"
- "the key takeaway is"
- Excessive transition words ("Furthermore", "Moreover", "Additionally")
- Repeating the same point in different words
- Generic structure ("First, we'll discuss... Second...")

## Failure modes to avoid
- Adding hedges to confident statements ("perhaps", "it could be argued")
- Re-writing the brief inside the piece (the reader doesn't need to see the brief structure)
- Padding to hit a word count (write less, hit the target with quality)
- Breaking voice for "clarity" (the voice IS the clarity)
- Writing in PUBLISHED instead of BRIEFS (user must explicitly approve to move to published)

# Prompting Frameworks — Complete Notes

## The 5 anchors of every strong prompt
1. **Role** — precise, not generic ("Senior YouTube scriptwriter for faceless educational channels," not "writer")
2. **Context** — what you're working on, who the audience is
3. **Numbered instructions** — explicit steps, not vibes
4. **Output format** — locked structure ("Deliver in this exact format: Executive Summary → Insight Table → Recommendations → Open Questions")
5. **Quality bar** — what makes the output excellent vs. mediocre

Bad prompt: "Explain APIs"
Good prompt: "Explain how REST APIs handle authentication. Give a real example with code. Assume I'm a junior developer."

## The Layered Expert Review pattern
For high-stakes work, assign Claude temporary roles INSIDE one prompt:

```
First act as Video Insight Extractor on the transcript.
Then switch to PDF Data Miner on the uploaded files.
Finally become a Strategy Synthesizer and combine everything into recommendations.
```

Each role focuses on its strength before the merge. Output is noticeably richer because the model isn't juggling everything at once.

## The Three Cross-Analysis Patterns (YouTube + PDF)

### Pattern 1: Video-First Breakdown
Video = primary source. PDF = validation material.
- Paste clean transcript first
- Upload PDF second
- Prompt Claude to extract speaker's main claims, check against document, highlight gaps
- Output: clean validation report

### Pattern 2: Balanced Cross-Check
Both equal weight, different angles.
- Upload PDF(s) first so Claude indexes them
- Paste transcript next
- Ask for side-by-side analysis: PDF arguments vs video real-world examples
- Output: comparison tables, merged insights

### Pattern 3: Layered Expert Review
(see above)

## The 5 Pitfalls
1. **Pasting transcripts with timestamps** — strip them; they eat context
2. **Generic prompts ("analyze everything")** — spell out exact goal and format
3. **Uploading 100-page PDFs without direction** — tell Claude which sections matter
4. **Starting new chats and losing context** — stay in thread or paste recap + re-upload
5. **Tackling ultra-long videos (>90 min) in one go** — process in chapters first, then synthesize

## The 7 Decision Intelligence Frameworks

| Framework | When to use |
|-----------|-------------|
| First Principles Thinking | Stuck on convention; need to rebuild from fundamentals |
| Inversion | Want to identify failure modes before they happen |
| The 5 Whys | Recurring problem; need root cause, not symptom |
| Second-Order Thinking | Major decision; need to see consequences 3 levels deep |
| Regret Minimization | Major life/career choice; 80-year-old test |
| Opportunity Cost Analysis | Evaluating a commitment; invisible tradeoffs |
| Pre-Mortem Analysis | About to start a project; want to surface risks early |

Full prompts in `02_prompt_library/03_decision_intelligence.md`.

## The Script DNA framework (for any content)

### The Hook
- First 30 seconds = whether the algorithm pushes
- Pattern interrupt (not "hey guys welcome back")
- Open loop: tease the payoff early, deliver later
- Use spoken English, not essay English

### The Stakes
- Why does the reader/viewer care?
- What happens if they don't keep watching?

### The Payoff
- The concrete answer or insight
- Specific numbers > vague claims
- Real examples > hypotheticals

### The CTA
- Soft, not begging
- Tease next piece (binge loop)

## The 5-Field Brief format (the foundation of every piece)

Used by the 4-agent team. Before writing anything:

1. **ONE THING** — the single insight this piece is built around (one sentence)
2. **PROOF** — the most specific real example or number that proves the one thing
3. **READER TRANSFORMATION** — what does the reader know at the end they didn't before?
4. **THREE HOOKS (ranked)** — aggressive / curious / personal
5. **THREE CLOSERS (ranked)** — by urgency and memorability

Write the closer BEFORE the middle. Always.

## Where the prompts live in this kit

- `02_prompt_library/01_youtube_prompts.md` — niche, identity, calendar, script, SEO, monetization
- `02_prompt_library/02_social_media_prompts.md` — strategy, pillars, calendar, posts, viral scripts
- `02_prompt_library/03_decision_intelligence.md` — 7 frameworks
- `02_prompt_library/04_video_editing_prompts.md` — script, retention, style, technical export
- `02_prompt_library/05_content_creation_prompts.md` — research, cross-analysis, channel cloning

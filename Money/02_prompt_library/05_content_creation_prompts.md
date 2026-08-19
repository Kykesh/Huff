# Content Creation & Analysis Prompts

## 1. The Channel Clone Engine
```
I want to reverse engineer a YouTube channel that's already working in [SOURCE NICHE] and rebuild its formula for a new account in [TARGET NICHE].

Analyze the source channel. Break down:
- the HOOK structure (what they do in first 30 seconds)
- the PACING (average cut length, energy curve)
- the TITLE structure (formula, common words, numbers)
- the THUMBNAIL style (colors, faces, text)
- the CADENCE (how often they post, what days)
- the SCRIPT DNA (problem → agitation → solution → loop)

Then rebuild the same formula for my target niche. Output:
- 10 video ideas in target niche using the source's formula
- Title templates
- Thumbnail concept descriptions
- Script structure template
- Upload schedule

Source channel: [URL or DESCRIPTION]
Target niche: [NICHE]
```

## 2. Video-First PDF Cross-Analysis
```
You are a precision research analyst. I've provided a YouTube transcript and a PDF document.

Treat the video as the primary source. Treat the PDF as validation material.

Process:
1. Extract the speaker's 5 main claims from the transcript
2. For each claim, check the PDF for: supporting evidence, contradicting evidence, or silence
3. Highlight gaps where the video makes a claim the PDF can't validate
4. Highlight surprising supporting stats from the PDF the video didn't mention
5. Deliver a clean validation report

Output format:
- Executive Summary (4 bullets)
- Claim Validation Table (claim | PDF support | confidence 1-10)
- Surprising additions from PDF
- 3 follow-up questions worth investigating
```

## 3. Balanced PDF/Video Cross-Check
```
You are a research analyst. I've uploaded PDF(s) and pasted a YouTube transcript. Both carry equal weight but approach the topic differently.

Process:
1. Extract the key arguments from the PDF(s)
2. Extract the real-world examples and tone from the video
3. Build a side-by-side comparison table
4. Flag where the video adds fresh context the document missed
5. Flag where the PDF contradicts the speaker's framing

Output format:
- Comparison Table (PDF argument | Video framing | Tension / Alignment)
- Synthesis: where they agree, where they don't
- 3 conclusions stronger than either source alone
```

## 4. Layered Expert Review
```
You will perform a three-role analysis on the materials I've provided.

ROLE 1 — Video Insight Extractor
Read the transcript. Extract: the 5 main claims, the 3 most surprising facts, the speaker's underlying thesis.

ROLE 2 — PDF Data Miner
Read the PDF(s). Extract: the 10 most specific numbers, the 3 strongest arguments, the 3 weakest assumptions.

ROLE 3 — Strategy Synthesizer
Combine both. Output:
- The thesis statement the combined evidence supports
- The 3 highest-confidence conclusions
- The 3 follow-up questions worth investigating
- The 1 actionable recommendation
```

## 5. Research Agent Prompt (standalone)
```
You are my Content Research Agent.

Your job: research any topic I give you and produce a structured research brief.

Process:
1. Identify the 5 most important subtopics
2. For each, find key facts, statistics, expert opinions
3. Identify contradictions or debates within the topic
4. Summarize findings in a structured document
5. Include a "Key Takeaways" section with 3-5 actionable insights

Output: clean document saved as [topic-name]-research.md in /Research folder.

Quality bar:
- Every claim specific. No filler.
- If you can't find reliable info, say so rather than making it up.
- Professional but accessible tone.

Topic: [TOPIC]
Target audience: [AUDIENCE]
```

## 6. Outline Agent Prompt (standalone)
```
You are my Content Outline Agent.

Your job: take a research brief and turn it into a detailed content outline.

Process:
1. Read research brief completely
2. Identify the strongest angle for the audience
3. Create a headline (must include a specific number and a curiosity hook)
4. Build section-by-section outline with:
   - section headline
   - 3-5 key points per section
   - specific examples or data to include
   - estimated word count
5. Write the opening paragraph (the hook)
6. Write the closing paragraph (the CTA)

Save as [topic-name]-outline.md in /Outlines folder.

The outline must be detailed enough that someone else could write the full article from it without asking questions.

Research brief: [PASTE or REFERENCE]
```

## 7. Writer Agent Prompt (standalone)
```
You are my Content Writer Agent.

Your job: take an outline and produce a complete, polished article.

Process:
1. Read the outline completely before writing anything
2. Write the full article following the outline structure exactly
3. Use short paragraphs (max 3 sentences each)
4. Bold key phrases for scannability
5. Include all specific numbers and examples from the outline
6. Maintain consistent tone throughout

Style: Direct, conversational, zero fluff. Smart friend, not lecturing classroom.

Does NOT sound like: generic AI writing, corporate blog, LinkedIn influencer, academic paper.

Save as [topic-name]-draft.md in /Drafts folder.

Outline: [PASTE or REFERENCE]
```

## 8. Editor Agent Prompt (standalone)
```
You are my Content Editor Agent.

Your job: review a draft article and improve it to publication quality.

Process:
1. Read entire draft first
2. Check: factual accuracy, logical flow, tone consistency, redundant content
3. Improve: weak openings, vague statements, missing transitions, anticlimactic endings
4. Enforce: short paragraphs, bold key phrases, specific numbers over vague claims
5. Cut: any sentence that doesn't add value
6. Produce final polished version

Quality check:
- Does opening hook grab attention in first 2 lines?
- Does every section deliver on its headline?
- Would I share this? Would I save this?
- Is the CTA clear and compelling?

Save as [topic-name]-final.md in /Published folder.

Draft: [PASTE or REFERENCE]
```

## 9. Brief Generator (5-Field Format)
```
Generate a content brief for: [TOPIC]

Use exactly five fields:

ONE THING — the single insight this piece is built around. Must be one sentence. Push back if it's fuzzy.

PROOF — the most specific real example or number that proves the one thing. Real numbers only.

READER TRANSFORMATION — what does the reader know at the end they didn't before? If you can't state this clearly, the piece has no reason to exist.

THREE HOOKS (ranked) — hook one aggressive, hook two curious, hook three personal.

THREE CLOSERS (ranked) — by urgency and memorability. The closer is written before the middle. Always.
```

## 10. Performance / Trend Prediction
```
Act like a YouTube growth strategist with access to current platform trends. Analyze my niche: [NICHE]. Identify:
- rising topics before saturation
- high-retention video angles
- formats trending right now
- titles that are working
- titles to avoid (overused)

Give me 5 specific video concepts I should produce in the next 30 days based on this analysis, ranked by expected ROI (effort vs likely views).
```

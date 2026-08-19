# Scoring Rubric — GO / WATCH / NO-GO

Extends the 4-factor framework in `Money/04_youtube_starter_kit/00_niche_analysis.md` with what we learned building Ranked Reality: policy safety and pipeline reuse decide more than raw RPM does.

## The 6 dimensions (score each 0–10, with evidence)

| # | Dimension | Weight | 10 looks like | 0 looks like |
|---|-----------|--------|---------------|--------------|
| 1 | **Money** | 25% | RPM ≥ $15 AND realistic 500K+ views/mo at scale | RPM < $3 or tiny view ceiling |
| 2 | **Competition gap** | 15% | Demand is proven but top channels are lazy (stock maps, robot voices) — beatable with our quality bar | 5+ entrenched channels doing exactly our format well |
| 3 | **Repeatability** | 15% | One template → 100+ videos (rankings, comparisons, evolutions) | Every video is a bespoke production |
| 4 | **Automation fit** | 20% | Our EXISTING stack (research → script → ElevenLabs → Remotion data-viz) produces it end-to-end, today | Needs filming, gameplay, animation styles, or licensed footage we don't have |
| 5 | **Policy safety** | 15% | Original-data + custom-viz model applies cleanly; no disclosure burden; no YMYL exposure | Kids content, medical/financial advice, scraped-clip dependence |
| 6 | **8-minute fit** | 10% | Topics naturally sustain 9–10 min (countdowns, head-to-heads, timelines) | Format exhausts itself at 3–4 min, padding required |

**Weighted score = Σ(score × weight).** Evidence required per dimension — a score without a sourced number or named example doesn't count.

## Verdict bands

- **GO:** weighted ≥ 7.0 AND no hard gate tripped. While the portfolio guardrail in README is ACTIVE → record as **GO (parked)**.
- **WATCH:** 5.5–6.9, or a GO blocked by one fixable factor (name it + the re-check date).
- **NO-GO:** < 5.5, or any hard gate. Write the one sentence that would flip it.

## Hard gates (trip any → capped at WATCH or NO-GO regardless of score)

1. **Kids/family content** → NO-GO (policy ban risk is existential — see kill list in `Money/04_youtube_starter_kit/05_policy_compliance.md`)
2. **YMYL advice** (medical, financial, legal advice framing) → cap at WATCH; data-ABOUT-money (rankings, net worths, costs) is fine — telling people what to DO with money/health is not
3. **Depends on scraped clips or licensed footage** → NO-GO (the inauthentic-content kill pattern, and not our moat)
4. **Can't hit 8:01 naturally** → NO-GO for the main-channel model (Shorts-only economics are a different business)
5. **Needs a production capability we don't have** → cap at WATCH until the build is costed in the evaluation

## The Ranked Reality baseline (calibrate against this)

Data/Rankings scored ~8.3 on this rubric: Money 6 ($5–15 RPM but huge view scale), Competition gap 8, Repeatability 9, Automation fit 10, Policy safety 9, 8-min fit 9. A candidate that can't beat ~7 isn't worth splitting attention for.

## Required evaluation format → `evaluations/YYYY-MM-DD-<slug>.md`

```markdown
# Evaluation: [NICHE or CHANNEL]
Date: YYYY-MM-DD · Input: [idea / URL / inbox note]
## VERDICT: GO | GO (parked) | WATCH | NO-GO — weighted [N.N]/10
One-line reason: [...]
What would change it: [the single sentence]

## Scores (evidence per line)
[the 6 dimensions: score, weight, 2–3 lines of sourced evidence each]

## Money math
RPM [low–high] (source, date) × realistic views month 6 [N] = $[range]/mo AdSense
[+ non-AdSense layers if real: affiliate, sponsors]

## Competition scan
[top 3–5 channels: name, subs, cadence, video length, what they do badly]

## Reference-channel teardown (if input was a URL)
Niche · cadence · avg length · est. views/mo → est. revenue (via niche_money_table.md)
What they do well · what our stack does better · originality/policy read

## Pipeline reuse
[% of the Faceless pipeline that transfers as-is; what's new; build cost estimate]

## Re-check date: [when to /scout this again]
```

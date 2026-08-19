# Faceless YouTube Automation — Complete Notes

## The thesis
A faceless YouTube channel is a production system, not a creator. You pick a niche based on math (RPM × competition × repeatability), then run a pipeline that converts ideas to uploaded videos in 20–90 minutes per video. The money compounds because: (a) videos run forever, (b) the algorithm rewards consistency, and (c) one workflow scales to multiple channels.

## The math behind the income

| Niche | RPM (per 1000 views) | Notes |
|-------|----------------------|-------|
| Finance / Investing | $15 – $50 | Highest, but saturated |
| AI / Tech | $12 – $30 | High, growing fast |
| Health / Wellness | $10 – $25 | Steady evergreen |
| Data / Rankings | $5 – $15 | Lower RPM, but massive view scale |
| True Crime / Stories | $5 – $15 | Mid |
| Kids (Animated) | $2 – $8 | Low RPM, but absurd watch time multipliers |
| General Entertainment | $3 – $8 | Don't bother |

At 500K views/month × $20 RPM = $10,000/month from AdSense alone, before affiliate, sponsorship, or product layers.

## The full pipeline (idea → upload)

```
Topic idea
  → Claude: research + outline
  → Claude: full script with [VISUAL] tags
  → ElevenLabs: voiceover from script
  → CapCut / Canva / Remotion: video assembly
  → Claude: title + description + tags + chapters
  → TubeBuddy / VidIQ: keyword check
  → Upload + schedule
```

Total time per video once dialed in: 45–90 minutes. The bottleneck is video assembly (the one step AI doesn't fully replace yet).

## The 4 niche-specific workflows

Each niche needs a different tool stack. Details in `04_youtube_starter_kit/`:

1. **AI / Tech / Productivity** — Claude + ElevenLabs + CapCut + Canva thumbnails. Talking-head style without showing face (B-roll + text overlay).
2. **Finance / Investing** — Same stack + stock charts (TradingView screenshots) + heavy SEO focus.
3. **Data / Rankings** — Claude + Remotion (programmatic motion graphics) + ElevenLabs. The $372K/mo model.
4. **Kids (Animated)** — Claude + Kling 3.0 or Runway + Suno (music). Highest watch-time multiplier but YouTube Kids policy risk.

## The single most important variable: the hook
First 30 seconds decides whether the algorithm pushes or buries the video. Bad hook = no views, no matter how good the rest is. Every script in this kit uses a pattern-interrupt hook: no intro, no "hey guys welcome back," straight into the curiosity gap.

## The 7 mistakes that kill new channels
1. **Niche with low RPM.** Views don't pay if RPM is $2.
2. **Skipping the hook.** First 30 seconds is everything.
3. **Posting 5 videos and waiting.** Algorithm needs 20–30 videos before it pushes.
4. **Copy-pasting competitor structures.** YouTube detects duplicates.
5. **Using free default ElevenLabs voices.** Your channel sounds like every other AI channel.
6. **Ignoring analytics.** The data tells you exactly what to make next.
7. **Building too slow.** Consistency > perfection for the first 90 days.

The most expensive mistake is #3. Most quit at video 8. Most channels start moving at video 24.

## The 90-day plan

- **Days 1–7:** Niche selection, channel identity, 12 video ideas, first video shipped
- **Days 8–30:** 3 videos/week, test 4 different content formats, don't optimize yet
- **Days 31–60:** Identify top 20% performing videos, double down on that format
- **Days 61–90:** Add monetization layer 1 (affiliate), prep for YPP eligibility (1K subs, 4K watch hours)

## Tools & costs

| Tool | Cost | What it does |
|------|------|--------------|
| Claude Pro | $20/mo | Everything text + planning |
| ElevenLabs | $5–$22/mo | Voiceover |
| CapCut | Free | Video editing |
| Canva | Free–$15/mo | Thumbnails |
| Remotion | Free (open source) | Programmatic motion graphics |
| WaveSpeed AI | ~$10/mo | Image generation (for visuals) |
| Kling 3.0 | varies | AI video generation (for kids/animated) |
| Suno | $8/mo | AI music |
| VidIQ / TubeBuddy | Free tier | SEO + keyword research |
| Pexels / Pixabay | Free | Stock footage |

**Minimum monthly cost: ~$30. Realistic operating cost: $50–$150/mo.**

## What's actually in `04_youtube_starter_kit/`
- `niche_analysis.md` — full comparison of the 4 niches with decision criteria
- `channel_identity_template.md` — fill-in-the-blanks for naming, branding, audience persona
- `90_day_calendar_template.md` — 12 video ideas + posting schedule
- `script_template.md` — the hook-stakes-payoff-CTA structure
- `seo_metadata_template.md` — title, description, tags, thumbnail copy generator
- `workflow_ai_tech.md`, `workflow_finance.md`, `workflow_data_rankings.md`, `workflow_kids.md` — niche-specific pipelines

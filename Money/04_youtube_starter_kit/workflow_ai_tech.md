# Workflow — AI / Tech / Productivity Niche

The full production pipeline for a faceless AI/tech channel. Talking-head style WITHOUT showing face: screen recording, stock B-roll, animated text, voiceover.

## Tools

| Tool | Cost | Purpose |
|------|------|---------|
| Claude Pro | $20/mo | Scripts, titles, descriptions |
| ElevenLabs | $5–$22/mo | Voiceover |
| CapCut | Free | Editing (timeline + auto captions) |
| Canva | Free / $15/mo | Thumbnails, channel art |
| Pexels / Pixabay | Free | Stock B-roll footage |
| OBS Studio | Free | Screen recording (for Claude/ChatGPT demos) |
| TubeBuddy | Free tier | SEO + keyword research |

**Monthly total: $25–$60**

## The pipeline (per video)

```
Step 1 — Topic + research (Claude, 15 min)
   ↓
Step 2 — Script (Claude with 03_script_template.md, 20 min)
   ↓
Step 3 — Voiceover (ElevenLabs, 5 min)
   ↓
Step 4 — Screen recording / B-roll collection (OBS + Pexels, 30 min)
   ↓
Step 5 — Assembly (CapCut, 30 min)
   ↓
Step 6 — Auto-captions (CapCut, 5 min)
   ↓
Step 7 — Thumbnail (Canva, 10 min)
   ↓
Step 8 — Metadata (Claude with 04_seo_metadata_template.md, 10 min)
   ↓
Step 9 — Upload + schedule (YouTube Studio, 10 min)
```

**Total per video: 2–2.5 hours once dialed in.**

## Step-by-step

### Step 1 — Topic + research
Use the Research Agent from `03_agent_team/` OR the Semantic Niche Matrix prompt from `02_prompt_library/01_youtube_prompts.md`.

### Step 2 — Script
Use the master script prompt from `03_script_template.md`.

### Step 3 — Voiceover
ElevenLabs setup:
- Voice: pick a clear, mid-tone voice (NOT the default Adam — too overused)
- **Recommended voices for this niche:** Antoni (deep authoritative) or a custom-cloned voice
- Settings:
  - Stability: 0.40 (slightly more variation)
  - Similarity: 0.85
  - Style: 0.35
  - Speaker boost: ON
- Pace through script, including [PAUSE] markers — replace each with an actual pause in the audio editor
- Export as MP3 at 192kbps minimum

### Step 4 — Screen recording / B-roll
For screen demos (e.g. "I asked Claude X"):
- OBS Studio, 1080p, 60fps
- Hide notifications, close personal tabs
- Record in clean increments — easier to edit
- 1.5x or 2x screen recordings to keep pace energetic

For B-roll:
- Pexels and Pixabay: search for niche-relevant keywords
- 5–10 second clips per scene
- Mix: 60% screen recording, 30% B-roll, 10% animated text overlays

### Step 5 — Assembly in CapCut
Template setup (do once):
- 1920x1080 canvas
- Audio track 1: voiceover
- Audio track 2: background music (Pexels free music library)
- Video track 1: main visual (screen recording / B-roll)
- Video track 2: text overlays
- Pre-saved title cards for openings

Workflow:
1. Drop voiceover into Audio 1
2. Auto-caption (CapCut handles this — review for errors)
3. Cut B-roll to match voiceover pacing
4. Add background music at -18dB
5. Hard cuts every 2-3 seconds (modern pacing)
6. Text overlays for key claims/numbers — appear with the audio

### Step 6 — Captions
CapCut auto-captions are 95% accurate. Review for:
- Brand names (Claude, Cursor, etc.)
- Specific numbers (8% becomes "eight percent" — fix to "8%")
- Acronyms (CTR, SEO, etc.)

Style: bold sans-serif, white text with black outline. Size: 80–100pt. Position: lower-middle.

### Step 7 — Thumbnail
Canva template (save and reuse):
- 1280x720
- 2 colors max (from your channel identity)
- Text: 3-5 words MAX, in 200pt+ font
- Visual: one clear focal point
- Mobile preview: zoom to 20% — is the text still readable? If not, redo.

A/B test 2 variations using TubeBuddy.

### Step 8 — Metadata
Use `04_seo_metadata_template.md`.

### Step 9 — Upload
- Set as Public (don't schedule unless you have data showing schedule helps your channel)
- End screen: subscribe button + next video card
- Cards: at the 30-50% mark, link to a related video

## Posting schedule (recommended for AI/tech)

| Day | Time (your audience's timezone) | Why |
|-----|--------------------------------|-----|
| Tuesday | 9am | Business hours start — high CTR |
| Thursday | 9am | Mid-week peak |
| Saturday | 11am | Weekend leisure browsing |

3x/week for 4 weeks = 12 videos to start the algorithm.

## What "working" looks like in this niche

| Week | Realistic |
|------|-----------|
| 1 | 50–500 views per video |
| 4 | 200–2K views per video |
| 8 | 1K–10K views per video; one video hits 20K (the signal) |
| 12 | One video over 50K; YPP qualified |
| 24 | $500–$3K/month |

If you have NO videos over 2K by week 8, the issue is one of: (a) niche too saturated, (b) hooks too weak, (c) thumbnails not standing out. Use the Channel Clone Engine prompt to fix.

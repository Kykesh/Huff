# Workflow — Data / Rankings Niche (the $372K/mo model)

This is the most technically demanding workflow but has the lowest competition and highest repeatability. Once Remotion is set up, you can produce a polished 8-to-10-minute video in under an hour — long enough to unlock mid-roll ads (the 8:00 floor), which typically pay 2–3x per view.

**Before your first upload, read `05_policy_compliance.md`** — original data viz is exempt from the AI-disclosure label and survives the inauthentic-content policy, but only if you keep the original-commentary layer. **For one-command-per-video automation, install `03_agent_team/video_pipeline/`** (Researcher → Scripter → Producer → Publisher, `/produce`).

## Tools

| Tool | Cost | Purpose |
|------|------|---------|
| Claude Pro | $20/mo | Scripts, data research, Remotion code |
| ElevenLabs | $5–$22/mo | Voiceover |
| WaveSpeed AI | $10/mo | Background image generation |
| Remotion | Free | Programmatic motion graphics |
| Node.js + Git | Free | Required for Remotion |
| Canva | Free | Channel art, thumbnails |
| Claude Desktop / Claude Code | Free with Pro | The IDE for Remotion projects |

**Monthly total: $35–$75. Real-world with iteration: $150–$200 first 1-2 months.**

## One-time setup (one weekend, 4-6 hours)

### Step 1 — Brand and channel
- Channel name: data-driven ("Ranked Data", "World by Numbers", "The Numbers", "Real Data Compare")
- Logo: 1 color, geometric, Canva (15 min)
- Banner: center-zone text "We rank the world. New videos weekly."

### Step 2 — Install Claude Desktop + Claude Code
- Download from claude.ai/download
- Create folder: `~/youtube-channel/`
- Open in Claude Code (NOT Chat, NOT Cowork)
- Set model: Claude Sonnet 4.6 (or newer)
- Mode: Accept Edit

### Step 3 — Install Node.js + Git
- Node.js: download LTS version (must be v18+)
- Git: download for your OS
- Both: click Next on installer

### Step 4 — Install Remotion via Claude Code
Paste this prompt:
```
Install the Remotion skill and set it up on my system.
If it's already installed, confirm it's ready to use.
If you need permissions to install dependencies or access the web, please ask me.
```
Approve permissions. Wait for confirmation.

### Step 5 — Test animation (no APIs needed)
Paste:
```
Create a 30-second Remotion animation ranking the top 10 most populated countries in the world.

Requirements:
- Show each country's name, flag, and population number
- Use a bar chart that grows from left to right
- Color scheme: dark background (#0a0a0a), red bars (#e85d26), white text
- Animate each country appearing one at a time with a 0.3 second delay between entries
- Add a title card at the start: "World's Most Populated Countries"
- End with a summary showing all 10 at once
- Export as MP4 at 1920x1080

Use real 2026 population data.
```
Wait 1-3 minutes for the localhost preview link. Open in browser.

If the result is wrong, tell Claude what to fix specifically:
- "The bars are overlapping — add vertical spacing"
- "The font is too small — increase to 48pt"

### Step 6 — Connect ElevenLabs API (via .env — NEVER paste keys into chat)
1. elevenlabs.io → Developer → API Keys → Create
2. Create a `.env` file in your project folder **in your text editor** (not through Claude) and add:
```
ELEVENLABS_API_KEY=your-key-here
ELEVENLABS_VOICE_ID=your-chosen-voice-id
```
3. Then tell Claude Code: "Read API keys from .env (never echo them). Confirm ELEVENLABS_API_KEY is set."

A key pasted into chat sits in conversation history forever. `.env` keeps it on disk, out of transcripts, and out of any future git history (add `.env` to `.gitignore`).

### Step 7 — Connect WaveSpeed API (optional, same pattern)
1. wavespeed.ai → profile → API Keys → Create
2. Add to the same `.env` in your editor:
```
WAVESPEED_API_KEY=your-key-here
```
Heads up: WaveSpeed generates photorealistic imagery. If a video uses AI-photorealistic scenes of real places, the upload needs the "Altered content" disclosure ticked — see `05_policy_compliance.md`. Pure charts and motion graphics don't.

## The per-video pipeline (30-60 minutes once set up)

### The master video prompt
```
Create a complete YouTube video using Remotion, ElevenLabs, and WaveSpeed.

VIDEO TOPIC: [e.g. Top 10 Countries by GDP 2026]

REQUIREMENTS:
- Length: 9–10 minutes (NEVER under 8:01 — that's the mid-roll ad floor; verify the RENDERED duration with ffprobe, not the script estimate)
- Narration: 1,400–1,600 words (~150 wpm lands this in range)
- Include a "why it ranks here" commentary line for every item (bare stats are the demonetization pattern — see 05_policy_compliance.md)
- Resolution: 1920x1080
- Style: [Dark background, gold accents, clean modern typography]

VOICEOVER:
- ElevenLabs voice: [pick one — confident, clear]
- Tone: informative but punchy
- Pace: medium-fast
- Script: write based on data — include 2 surprising facts per country

VISUALS:
- WaveSpeed: generate unique background per country (cinematic skyline / landmark, 8k)
- Each section: flag, number, animated bar, WaveSpeed background
- Smooth transitions

MOTION GRAPHICS:
- Opening title card (2 sec entrance animation)
- Each country revealed one at a time with bar animation
- Progress indicator ("7 of 10")
- Closing summary showing all 10 ranked

OUTPUT:
- Render as MP4
- Preview link first for review
```

5-10 minutes of render time. Review preview. Iterate if needed.

## High-volume content ideas

| Format | Examples |
|--------|----------|
| Country rankings | GDP, population, military, area, birth rate, life expectancy |
| Comparison videos | USA vs China across N dimensions; iPhone vs Android (every metric) |
| Historical evolution | Top 10 [thing] every decade since 1900 |
| Counterfactuals | "What if X disappeared?", "What if X happened?" |
| Tallest / biggest / oldest | Buildings, animals, companies, etc. |

The "Real Data" channels produce 3-5 videos per week using variations of these 5 formats. The repeatability is the moat.

## Posting frequency

Aggressive: 5 videos/week (the $372K/mo model creators do this)
Sustainable: 3 videos/week
Minimum: 2 videos/week

The algorithm rewards consistency at this density more than any other niche.

## What "working" looks like

| Week | Realistic |
|------|-----------|
| 1-4 | 100-2K views per video |
| 5-12 | 1K-50K views per video, first video over 100K |
| 13-26 | 100K-500K views per video, $500–$3K/month |
| 27-52 | Sustained 1M+ view videos, $3K–$15K/month |

The compounding works because every video stays evergreen — "Top 10 Countries by GDP 2024" is still getting views in 2026. Each new video adds to the back catalog.

## The path to portfolio (the $372K/mo math)

Year 1: One channel, hit $5K/month
Year 2: Launch channel 2, hit $10K/month combined  
Year 3: 3-5 channels running same Remotion templates, $30K-$70K/month
Year 4+: Portfolio of channels, with the top tier hitting $300K+/month

This isn't a "year one" goal. It's an 18-month minimum to portfolio.

# SETUP.md — One-Time Setup (copy into your channel project and fill brackets)

Run this once before the first `/produce`. Every step is verifiable; don't move on until the step's check passes. Total time: 30–60 minutes.

## 1. Prerequisites

- Node.js ≥ 18 (`node --version`)
- Claude Code running in this folder

## 2. Secrets — `.env` (NEVER paste keys into chat)

```bash
cp .env.example .env
```

Then edit `.env` in your editor (not via Claude) and fill:

```
ELEVENLABS_API_KEY=     # elevenlabs.io → Developer → API Keys
ELEVENLABS_VOICE_ID=    # the voice you picked for the channel: [VOICE NAME]
WAVESPEED_API_KEY=      # optional — only if using AI background imagery
```

**Check:** `.env` exists and is listed in `.gitignore` if this folder is ever git-initialized.

## 3. Remotion project

Ask Claude (in this folder):

> Initialize a Remotion project in `remotion/` using the blank/hello-world template. Confirm `npx remotion studio` starts and renders the sample composition.

**Check:** `remotion/package.json` exists; studio opens; sample renders.

## 4. Voiceover script

Ask Claude:

> Create `scripts/voiceover.mjs`: reads a beats JSON (array of `{id, narration}`), calls the ElevenLabs text-to-speech API per beat using ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID from `.env`, writes one MP3 per beat to the given output dir plus a `durations.json` mapping beat id → audio seconds. Then test it on a single 10-word beat and play me the result.

**Check:** test MP3 exists, sounds right, `durations.json` has a sane duration.

## 5. Test render with audio

Ask Claude:

> Build a 15-second Remotion composition: title card in the channel palette ([BG HEX] background, [ACCENT HEX] accent, [FONT] type) with the test voiceover from step 4 as the audio track. Render it to MP4 and verify duration with ffprobe.

**Check:** MP4 plays with synced audio, palette and type match `channel_identity.md`.

## 6. First real run

```
/produce [VIDEO 1 TITLE FROM YOUR CALENDAR]
```

Review EVERY intermediate file on this first run: research brief, script, production log, QC report. Watch the full render. Only after video 1 passes your own eyeball do you trust the gates.

## Acceptance checklist

- [ ] `.env` filled, never pasted in chat
- [ ] Remotion sample renders
- [ ] Voiceover test beat plays
- [ ] Test render: synced audio + correct palette
- [ ] Video 1 produced end-to-end and human-reviewed

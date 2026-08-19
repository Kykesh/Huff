# Video Pipeline — One Command Per Video

The third agent team in this kit. Same architecture as `automated_pipeline/` (`/ship`), applied to faceless video production: **Researcher → Scripter → Producer → Publisher**, chained by one `/produce` command, with file-based handoffs and machine-checkable gates at every stage.

This exists because the original content team (`03_agent_team/`) ends at a markdown article — and a video channel's deliverable is an MP4. This pipeline ends at a render plus a ready-to-upload package.

## How it differs from the other two teams

| | Content team (manual) | Automated pipeline (`/ship`) | Video pipeline (`/produce`) |
|---|---|---|---|
| Stages | Research → Outline → Write → Edit | Planner → Coder → Tester → Reviewer | Researcher → Scripter → Producer → Publisher |
| Deliverable | Markdown article | Code + verdict | Rendered MP4 + upload package |
| Handoff | Copy/paste | `.pipeline/` files | Working folders per stage |
| External deps | None | Your repo | Remotion, ElevenLabs, `.env` keys |

## File structure

```
video_pipeline/
├── README.md                    ← you are here
├── SETUP_TEMPLATE.md            ← copy to project as SETUP.md, run once
└── .claude/
    ├── agents/
    │   ├── researcher.md        ← Stage 1: verified, sourced dataset + original angle (Sonnet)
    │   ├── scripter.md          ← Stage 2: 8-min-plus retention script + beat sheet (Opus)
    │   ├── producer.md          ← Stage 3: voiceover + Remotion render (Sonnet)
    │   └── publisher.md         ← Stage 4: QC + compliance gate + metadata (Opus)
    └── commands/
        └── produce.md           ← the orchestrator
```

The project that installs this also needs working folders: `Research/`, `Scripts/`, `Production/`, `Published/`.

## Install (into a channel project — see `Money/START_HERE_NEW_PROJECT.md`, Recipe A)

1. Copy `.claude/` into the channel folder's root.
2. Copy `SETUP_TEMPLATE.md` → `SETUP.md` and fill the [BRACKETS].
3. Fill every [BRACKET] in the four agent files (niche, palette, runtime, voice).
4. Embed the pre-upload checklist from `04_youtube_starter_kit/05_policy_compliance.md` into `publisher.md` (the template already carries it — verify it survived your edits).
5. Run one-time setup (`SETUP.md`): `.env` keys, Remotion project, voiceover script, test render.
6. `/produce <topic>`.

## The stages and their gates

Every gate is machine-checkable. A stage that can't prove it passed stops the pipeline — no cascading garbage.

| Stage | Output | Gate |
|---|---|---|
| 0 Preflight | — | `.env` keys present, `remotion/` project exists |
| 1 Researcher | `Research/<slug>-research.md` | `Status: COMPLETE` + non-empty `Original angle:` line |
| 2 Scripter | `Scripts/<slug>-script.md` | `Status: COMPLETE`, narration word count in range, estimated runtime ≥ 8:30, zero banned words |
| 3 Producer | `Production/<slug>/video.mp4` + `production-log.md` | `Status: RENDERED`, measured duration ≥ 8:10 |
| 4 Publisher | `Published/<slug>/qc-report.md` + `metadata.md` | `VERDICT: READY / NEEDS WORK / BLOCK` |

## What stays manual (by design)

1. API keys in `.env` (one-time)
2. Watching the final render before upload (the human QC layer — it's also a policy defense, see `05_policy_compliance.md`)
3. The upload click

Everything else — research, script, voiceover, animation, render, metadata, thumbnail spec, compliance check — is the pipeline's job. NEVER wire auto-upload; the kit's hard rule is drafts and verdicts, human publishes.

## Cost per video (rough)

- Researcher (Sonnet + web): ~$0.30–$0.60
- Scripter (Opus): ~$0.50–$1.00
- Producer (Sonnet + render time): ~$0.30–$0.60
- Publisher (Opus): ~$0.40–$0.80
- ElevenLabs voiceover (~1,500 words): creator-plan credits

**~$1.50–$3.00 per video** plus subscriptions. Against 2–4 hours of manual production per video, the math isn't close.

## The architecture lessons baked in (so you don't re-learn them)

- **The final artifact is the deliverable.** Stage 3 produces an MP4, not a description of one.
- **Audio drives timing.** The Producer generates one voiceover segment per beat and times each Remotion sequence to its audio duration. Never hand-time animations to a script estimate.
- **The Publisher judges; it doesn't fix.** Like the `/ship` Reviewer: read-only on upstream artifacts, so it can't paper over problems.
- **Runtime is checked on the rendered file**, not the script estimate — the 8:00 mid-roll floor is a measured fact, not a hope.

Reference instance: `../../Faceless/` in this workspace — Ranked Reality, Data/Rankings niche, the first channel running this pipeline.

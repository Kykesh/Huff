# /produce — Video Pipeline Orchestrator

Produce a complete, upload-ready video for: $ARGUMENTS

($ARGUMENTS is a topic, a video title, or a video number from the project's calendar — resolve numbers via the calendar file first.)

## Execution rules

Run the stages IN ORDER. After each stage, verify its gate before starting the next. If any gate fails, STOP and report — do not improvise, do not skip ahead, do not "fix it up" between stages.

Derive the slug once: `[NN]-[topic-kebab-case]` (NN = calendar video number, or 00 for off-calendar topics). Every stage uses the same slug.

## Stage 0 — Preflight

- `.env` exists with `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID`
- `remotion/` project and `scripts/voiceover.mjs` exist

Missing anything → STOP: tell the human which `SETUP.md` step to run.

## Stage 1 — Researcher

Delegate to the `researcher` subagent with the topic.

**Gate:** `Research/<slug>-research.md` exists, first lines contain `Status: COMPLETE` and a non-empty `Original angle:`.
- `Status: BLOCKED` → STOP, show the human what couldn't be verified.

## Stage 2 — Scripter

Delegate to the `scripter` subagent.

**Gate:** `Scripts/<slug>-script.md` exists with `Status: COMPLETE`; narration word count within the range in `context.md`; estimated runtime ≥ 8:30; grep the script for every banned word in `context.md` — zero hits.
- Any failure → STOP, report which check failed.

## Stage 3 — Producer

Delegate to the `producer` subagent.

**Gate:** `Production/<slug>/video.mp4` exists; `production-log.md` says `Status: RENDERED`; logged duration ≥ 8:10.
- `TOO_SHORT` → STOP. Report the measured duration and route the fix to the Scripter (more script, never padding).
- `FAILED` → STOP, surface the log's error verbatim.

## Stage 4 — Publisher

Delegate to the `publisher` subagent.

**Gate:** `Published/<slug>/qc-report.md` and `metadata.md` exist with a `VERDICT:` line.

## Final report

```
VIDEO PIPELINE COMPLETE
───────────────────────
Topic:    [from $ARGUMENTS]
Slug:     [slug]
Verdict:  READY / NEEDS WORK / BLOCK
Duration: [M:SS measured]
Angle:    [from research brief]

Files for your review:
- Research/<slug>-research.md
- Scripts/<slug>-script.md
- Production/<slug>/video.mp4        ← WATCH THIS before upload
- Published/<slug>/qc-report.md      ← compliance verdict + your pre-upload steps
- Published/<slug>/metadata.md       ← title, description, tags, thumbnail spec

I have NOT uploaded anything. Upload steps are in qc-report.md.
```

## Hard rules

1. **NEVER skip a gate.** A missing handoff file means the stage failed, whatever the subagent said.
2. **NEVER upload, schedule, or touch a YouTube API.** The pipeline ends at files on disk.
3. **NEVER pad a short video.** TOO_SHORT routes back to the script, not to dead air.
4. **NEVER let a stage fix another stage's work.** Researcher owns data, Scripter owns words, Producer owns the render, Publisher owns the verdict.

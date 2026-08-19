# CLAUDE.md — Claude AI Operating Systems Kit

## What this folder IS
A reference + scaffold library for Claude-powered systems. NOT active project work, NOT the user's personal identity file. This folder is the toolbox.

If the user's identity, current projects, or voice rules live in a CLAUDE.md inside a sibling folder, **that one wins** for personal context. Use this folder for the systems, prompts, and templates referenced by name.

## What this folder is NOT
- Not the user's working memory (that's `05_memory_vault/CLAUDE.md`)
- Not a project to modify (templates are meant to be COPIED into project folders, not edited in place)
- Not auto-executable (the agent/skill specs activate only when the user invokes them by name)

## Folder map

```
.
├── 00_MASTER_GUIDE.md              ← read first when routing a request
├── START_HERE_NEW_PROJECT.md       ← copy-out recipes for new projects + anti-drift rules
├── HOW_TO_USE_THIS_KIT.md          ← init prompts for full workspace vs single module
├── 01_notes/                       ← 10 deep-dive concept docs
├── 02_prompt_library/              ← copy/paste prompts (YouTube, social, decision, video, content, Claude Code, council)
├── 03_agent_team/                  ← 4-agent content team (manual handoffs)
│   ├── automated_pipeline/         ← Planner→Coder→Tester→Reviewer + /ship command (code shipping)
│   └── video_pipeline/             ← Researcher→Scripter→Producer→Publisher + /produce command (video production)
├── 04_youtube_starter_kit/         ← niche analysis + 4 niche workflows + templates + policy compliance
└── 05_memory_vault/                ← Obsidian-style memory scaffold (user customizes CLAUDE.md inside)
```

## Routing rules

When the user asks for something, route to the smallest useful subset of files:

| Request shape | Read |
|---------------|------|
| "Explain [concept]" | `01_notes/` (the relevant deep-dive) |
| "Give me a prompt for X" | `02_prompt_library/` (specific file) |
| "Write a piece about X" | `03_agent_team/` (the 4-stage content team) |
| "Ship a feature" / "implement X" | `03_agent_team/automated_pipeline/` (`/ship` command) |
| "Start a new project from the kit" | `START_HERE_NEW_PROJECT.md` (pick the recipe) |
| "Produce a video" / video automation | `03_agent_team/video_pipeline/` (`/produce` command) |
| "YouTube policy / monetization / AI-content rules" | `04_youtube_starter_kit/05_policy_compliance.md` |
| "Set up a YouTube channel" | `04_youtube_starter_kit/README.md` → niche analysis first |
| "Process my inbox" / "run connection session" | `05_memory_vault/05-CLAUDE/skills/` |
| "Council this: [decision]" | `02_prompt_library/07_council_skill.md` |
| "What multi-agent paradigm fits this?" | `01_notes/10_multi_agent_systems.md` (decision tree) |
| "Audit this workflow before automating" | `01_notes/08_company_brain_architecture.md` (6-question audit) |
| Anything else | `00_MASTER_GUIDE.md` (the index) |

Default behavior when ambiguous: read `00_MASTER_GUIDE.md` first, confirm the module with the user, then proceed.

## Voice rules
This folder doesn't override the user's voice. Defer to:
1. The voice block in the user's main CLAUDE.md (sibling folder)
2. `03_agent_team/context.md` if used inside an agent team task
3. `05_memory_vault/CLAUDE.md` voice block if working from the vault

Default voice if none is loaded: short punchy sentences, real numbers beat vague claims, no filler, smart-friend tone, no emojis.

## Hard rules
- NEVER edit files in this folder during a task — COPY templates into the user's project folder and edit there (deliberate kit upgrades happen only on the user's explicit instruction, like the V2.1 pass of June 2026)
- NEVER auto-merge code, auto-publish content, or auto-send anything; the kit produces drafts and verdicts, the user approves
- NEVER spawn `/ship` or Dynamic Workflows on a task that fits in one agent — wasteful
- ALWAYS read `00_MASTER_GUIDE.md` before routing if you're unsure which module fits
- ALWAYS prefer the user's main CLAUDE.md for identity/projects/voice over anything in this folder
- If the user's request requires a module's full context, load the README.md for that module first, then drill in

## How to use with sibling folders
If this folder is one of several in a shared workspace:
- **Sibling folders that contain active project work** → those CLAUDE.md files own the project context (current sprint, decisions, codebase conventions)
- **This folder** → owns the systems and reference material
- When a user request spans both, read the sibling project's CLAUDE.md FIRST, then pull templates/prompts from here as needed

## The shortest possible router
If everything else fails: ask the user which module to use, or read `00_MASTER_GUIDE.md` and propose one. Don't guess silently.

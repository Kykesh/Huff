# 4-Agent Content Production Team

A drop-in scaffold for the canonical Research → Outline → Write → Edit pipeline. Each agent has one job, a precise output format, and a clear handoff to the next.

## What's in here

```
03_agent_team/
├── README.md                   ← you are here
├── CLAUDE.md                   ← identity + projects, loaded every session
├── context.md                  ← voice, audience, hard rules
├── folder_structure.md         ← Research/Outlines/Drafts/Published explained
└── agents/
    ├── 01_research_agent.md
    ├── 02_outline_agent.md
    ├── 03_writer_agent.md
    └── 04_editor_agent.md
```

## How to use it

### Option A: Manual handoff (the safe starting point)
1. Open Claude. Paste `CLAUDE.md` + `context.md` + `agents/01_research_agent.md` as the system prompt.
2. Ask: "Research [topic]"
3. Take the output. Open a new chat. Paste `CLAUDE.md` + `context.md` + `agents/02_outline_agent.md`.
4. Paste the research brief. Ask: "Create an outline from this research brief."
5. Repeat for Writer and Editor.

This is slower but you see every step. Use this for the first 5 articles to verify quality.

### Option B: Claude Projects (recommended after first 5 runs)
1. Create 4 separate Projects, each named after the agent.
2. Each Project's custom instructions = `CLAUDE.md` + `context.md` + that agent's file.
3. Hand off between projects by copy-pasting the output.

### Option C: Full automation (once dialed in)
Chain everything in a single prompt:
```
Take the topic "[TOPIC]". Run the full pipeline:
1. Act as Research Agent → produce research brief
2. Act as Outline Agent → produce outline
3. Act as Writer Agent → produce draft
4. Act as Editor Agent → produce final
Save each intermediate to its folder. Deliver final to /Published.
```

## Setup checklist
- [ ] Edit `CLAUDE.md` — fill in your identity, projects, voice
- [ ] Edit `context.md` — your audience, niche, words to never use
- [ ] Create folders on your machine: `/Research`, `/Outlines`, `/Drafts`, `/Published`
- [ ] Test with one topic end-to-end before changing anything

## The handoff rule
The output of each agent MUST be in a format the next agent can consume without cleanup. If a Research brief lands without clear sections, the Outline Agent will produce a weak outline. **Spend 80% of refinement effort on handoff quality** — that's what compounds.

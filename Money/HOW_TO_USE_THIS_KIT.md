# How to Use This Kit — The Initialization Prompts

Two modes: **(A) all files in one workspace**, or **(B) one module at a time.**

---

## A) ALL FILES IN ONE WORKSPACE (recommended)

Drop the entire `outputs/` folder into a Claude Project (or Claude Code workspace, or Cowork folder).

### The master init prompt (paste at start of EVERY session)

```
Read /00_MASTER_GUIDE.md first — that's your routing index for this kit.

Treat this workspace as my Claude operating system. When I ask for something, route to the relevant module:
- 01_notes/ → for concepts and frameworks
- 02_prompt_library/ → copy-paste prompts
- 03_agent_team/ → content production (manual) OR automated_pipeline/ (/ship command for code)
- 04_youtube_starter_kit/ → channel setup and workflows
- 05_memory_vault/ → persistent context and skills

Before responding to anything else:
1. Read 00_MASTER_GUIDE.md
2. Read 05_memory_vault/CLAUDE.md (my identity + current projects)
3. Tell me which module(s) you'll use for my task and confirm before executing

Match my voice from 03_agent_team/context.md. Use the banned phrases list. Push back when my input is fuzzy instead of producing weak output.
```

### Then for specific tasks (after init)

**Decision / strategy (5-advisor council):**
```
council this: [your decision]

Use the skill spec at 02_prompt_library/07_council_skill.md. Spawn 5 advisors in parallel, anonymize their responses, peer-review them, then synthesize a chairman verdict.
```

**Launch a faceless YouTube channel:**
```
Walk me through 04_youtube_starter_kit/ in order. Start with 00_niche_analysis.md and ask me the scoring questions one at a time. After I pick a niche, move to channel identity, then the 90-day calendar. Don't skip ahead.
```

**Write a piece using the content team:**
```
Run the 4-agent content team in 03_agent_team/ on this topic: [topic]

Execute all 4 stages in sequence (research → outline → write → edit) using the agent specs in agents/. Read CLAUDE.md and context.md first. Save intermediate files to /Research, /Outlines, /Drafts, /Published.
```

**Ship a feature with the automated pipeline:**
```
Run /ship using the pipeline at 03_agent_team/automated_pipeline/

Feature: [describe the feature in 1-2 sentences]

Follow the orchestrator at .claude/commands/ship.md exactly. Stop if the Planner returns OPEN QUESTIONS. Stop if the Tester returns FAIL. Don't auto-merge.
```

**Set up the memory vault:**
```
Help me customize 05_memory_vault/CLAUDE.md. Ask me one question at a time for each section (Identity, Current Projects, Voice, Hard Rules). After we finish, drop a test note into 00-INBOX/ and run the process_inbox skill on it.
```

**Run a decision framework:**
```
Apply [First Principles / Inversion / 5 Whys / Second-Order / Regret Min / Opportunity Cost / Pre-Mortem] from 02_prompt_library/03_decision_intelligence.md to this problem: [problem]
```

**Audit a recurring workflow before automating it:**
```
Run the 6-question Company Brain audit from 01_notes/08_company_brain_architecture.md on this workflow: [workflow name + description]

Ask me each question one at a time. If I can't answer cleanly, tell me — don't help me automate something I haven't understood yet.
```

**Pick a multi-agent paradigm:**
```
Read 01_notes/10_multi_agent_systems.md and apply the decision tree to this task: [task]

Tell me which paradigm fits (single / subagents / agent teams / dynamic workflows) and why. Push back if I'm reaching for a swarm when a single agent would do.
```

---

## B) ONE MODULE AT A TIME (lighter setup, narrower context)

Use these when you only want one piece of the kit loaded — keeps context small, runs cheaper.

### Agent team (content production)

Paste these three files into Claude as the system prompt:
- `03_agent_team/CLAUDE.md`
- `03_agent_team/context.md`
- One of `03_agent_team/agents/0X_*.md` (the specific role you want)

Then:
```
You are my [Research / Outline / Writer / Editor] Agent. Read CLAUDE.md and context.md first. Then handle this task: [task].
```

### Automated pipeline (code shipping)

In Claude Code, inside your repo with `.claude/agents/` and `.claude/commands/ship.md` installed:
```
/ship [feature description in one sentence]
```

That's the entire prompt. The `/ship` command file does the orchestration.

### Memory vault (standalone)

Load just `05_memory_vault/CLAUDE.md` and `05_memory_vault/05-CLAUDE/skills/` into a Claude Project. Then:
```
You are my second brain. Read CLAUDE.md first. When I say "process my inbox" or "run connection session" or "generate a brief for X" — execute the matching skill from 05-CLAUDE/skills/.

Today's task: [process my inbox / run connection session / generate a brief for X]
```

### YouTube starter kit (standalone)

Load `04_youtube_starter_kit/` files. Then:
```
You are my faceless YouTube channel strategist. Read README.md first, then 00_niche_analysis.md.

I want to: [pick a niche / build channel identity / generate a 90-day calendar / write a script / generate SEO metadata for an upload].

Walk me through the relevant template file. Ask one question at a time when I'm stuck.
```

### Just a prompt from the library

If you only need one prompt, copy it directly. No init needed:
```
[Paste any prompt from 02_prompt_library/0X_*.md, fill in the brackets]
```

### Council skill alone

If you only want the council and nothing else:
```
[Paste the skill spec block from 02_prompt_library/07_council_skill.md]

Now: council this — [your question + full context]
```

---

## The "session opener" cheat sheet

Pick the right opener based on what you're doing:

| Doing | First prompt |
|-------|--------------|
| Just answering a question | (no init — direct ask) |
| Writing content | Init the content team agent files |
| Shipping code | `/ship [feature]` (pipeline must be installed) |
| Hard decision | `council this: [decision]` |
| Daily memory ritual | `process my inbox` → `run connection session` |
| Setting up YouTube | Init full workspace + ask for `04_youtube_starter_kit/` walkthrough |
| New project setup | Run `/init` in Claude Code (writes CLAUDE.md for that repo) |

---

## The reusable upgrades (add to ANY of the above)

Append any of these to your prompt for higher-quality output:

```
Continuously ask me questions until you're 95% confident you understand what I need.
```

```
Use plan mode. Don't write anything until I approve the plan.
```

```
ultrathink
```

```
Use subagents in parallel for the research step.
```

```
Add verification steps to the todo list. Don't move to the next todo until 95% confident the current one is good.
```

---

## The one rule

**Don't init the whole workspace for tasks that only need one module.** It eats tokens you don't have to spend.

- Quick question → no init, just ask
- One module worth of work → init only that module (Mode B)
- Multi-module project (e.g., "research a topic with the memory vault, then write it with the agent team, then make a YouTube video about it") → init the full workspace (Mode A)

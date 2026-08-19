# AI Agent Teams — Complete Notes

## What an AI agent actually is
An AI agent is a system that takes a goal, breaks it into steps, executes those steps, and delivers a result without you micromanaging each step. A chatbot waits for instructions. An agent figures out the process.

Difference: "book me a flight" vs "go to this site, type this, click that." Delegation vs babysitting.

## The four pieces of every agent

1. **Role** — one specific job. Not "AI that does stuff." "AI that does research on a topic and produces a 5-section brief."
2. **Instructions** — the process, quality standard, and output format. The more specific, the better.
3. **Tools** — what it can access: web search, your files, email, calendar, code execution.
4. **Memory** — how it remembers across sessions. Without memory, every run starts cold.

That's it. Role. Instructions. Tools. Memory.

## The 4-agent content production team (the canonical example)

This is the team in `03_agent_team/`. It runs the workflow:

```
Topic → [Research Agent] → research brief
              ↓
       [Outline Agent] → detailed outline + hook + CTA
              ↓
       [Writer Agent] → full polished draft
              ↓
       [Editor Agent] → publication-ready piece
```

Each agent handles one step. Output of one is input for the next. Full article from raw topic to published in under 30 minutes.

### Agent 1: Research Agent
- Identifies 5 most important subtopics
- For each: key facts, stats, expert opinions
- Flags contradictions and debates
- Outputs structured brief with "Key Takeaways" section
- Quality bar: every claim specific, no filler

### Agent 2: Outline Agent
- Takes research brief, picks strongest angle
- Creates headline (must include specific number + curiosity hook)
- Section-by-section outline with key points and word counts
- Writes opening hook and closing CTA
- Outline must be detailed enough that someone else could write the article without questions

### Agent 3: Writer Agent
- Takes outline, writes full draft
- Short paragraphs (max 3 sentences)
- Bold key phrases for scannability
- Includes specific numbers from outline
- Voice: "smart friend, not lecturing classroom"
- Does NOT sound like: generic AI, corporate blog, LinkedIn influencer, academic paper

### Agent 4: Editor Agent
- Reads entire draft first
- Checks: accuracy, flow, tone consistency, redundancy
- Improves: weak openings, vague statements, missing transitions
- Enforces: short paragraphs, bold key phrases, specific numbers
- Cuts: anything that doesn't add value

## Three more agent team templates

### Business Intelligence Team
- Data Collection Agent → gathers metrics from your tools
- Analysis Agent → identifies trends, anomalies, opportunities
- Report Agent → compiles findings into exec summary
- Recommendation Agent → proposes actions

### Customer Research Team
- Survey Agent → designs research questions
- Data Processing Agent → organizes raw feedback
- Pattern Detection Agent → finds recurring themes
- Insight Agent → translates patterns into product recs

### Social Media Team
- Trend Agent → monitors what's performing in your niche
- Content Planning Agent → builds weekly content calendars
- Writing Agent → drafts posts per platform
- Optimization Agent → reviews and improves before publishing

## Advanced techniques

### 1. Scheduled workflows
Use `/schedule` to automate agents on a timer. Every Monday 7am: Research Agent pulls trending topics. 8am: Outline Agent creates 3 outlines. You review and pick one.

### 2. Context files for consistency
Create `context.md` (in this kit as `03_agent_team/context.md`). Every agent reads it before any task. Defines audience, tone, words to never use, format rules. Ensures consistency across the whole team.

### 3. Feedback loops
After every output, give specific feedback. "The research focused too much on theory — next time prioritize real-world case studies." Each correction makes future output better.

### 4. Multi-step chains
"Take topic X, run the full pipeline: research → outline → write → edit. Save all intermediate files. Deliver final to /Published." Claude handles end-to-end. You come back to a finished article.

## The handoff principle
The hardest part of agent teams is **clean handoffs**. Each agent's output must be in a format the next agent can consume. That's why every agent in this kit specifies exact output format and file path. Without that, you'll constantly be cleaning up between agents.

## What's actually in `03_agent_team/`
- `CLAUDE.md` — system identity + project context, read by every agent
- `context.md` — voice, audience, hard rules
- `agents/01_research_agent.md` — full instructions
- `agents/02_outline_agent.md`
- `agents/03_writer_agent.md`
- `agents/04_editor_agent.md`
- `folder_structure.md` — Research/Outlines/Drafts/Published folders explained

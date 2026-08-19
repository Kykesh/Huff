# Claude Memory System — Complete Notes

## The problem
Every Claude chat starts from zero. It doesn't know your name, projects, past corrections, or preferences. Each session rediscovers everything. For a chatbot, fine. For an agent running real work, it's the single biggest reason your setup plateaus.

## The four memory layers

| Layer | What it is | Persistence | Effort |
|-------|------------|-------------|--------|
| 1. Instructions | What you write (role, prefs, standards) | Static | Manual setup |
| 2. Auto Memory | Notes Claude writes from your corrections | Session-spanning | Toggle on |
| 3. Persistent Store | Structured knowledge across sessions/weeks/projects | Permanent | Build it |
| 4. Dreaming | Agent rewrites its own memory between sessions | Self-improving | Advanced (API only) |

More autonomous → more powerful → more setup.

---

## Layer 1: Instructions (the sticky note)

### Chat Memory (free, automatic since March 2026)
1. Profile icon → Settings → Capabilities → Memory section
2. Toggle "Generate memory from chat history" ON
3. Claude synthesizes your conversations into a profile ~once every 24 hours

### Don't wait — seed it directly:
```
Remember the following about me for future conversations:
- I work in [field], main projects are [X, Y]
- I prefer [direct prose / no bullet points / short replies]
- My writing style is [describe it]
- Never [the thing you always have to correct]
```

### Projects (the workspace)
- Projects → New Project
- Name it after the job ("Weekly Recap Writer"), not the topic
- Fill custom instructions box with role, standards, constraints
- Every chat inside the Project inherits them

**WARNING:** Projects persist instructions, NOT conversation memory. Each new chat in a Project loses prior conversation history. This is the #1 thing people get burned by.

---

## Layer 2: Auto Memory (Claude Code)
- `/memory` toggle in session
- Or set `autoMemoryEnabled` in project settings
- Claude writes notes to itself from your corrections
- Loads them at start of every session
- Lightweight self-documentation

---

## Layer 3: Persistent Store (CLAUDE.md)

The simplest persistent memory that works: a single file the agent reads at start and appends to at end.

### Structure that stays useful
```markdown
## Preferences
- Bullet summaries over prose for status updates
- Always cite source file for any claim

## Decisions
- 2026-04-18 — chose Postgres over Mongo (relational reporting)

## Known workarounds
- Export tool chokes on files >50MB; split first

## Recurring mistakes to avoid
- Do not auto-approve PRs touching the auth module
```

### The discipline
- Keep it LEAN — a fresh session can spend 20K tokens loading instructions
- Don't dump everything — only store what would change future behavior
- If `/init` generates a starter file, delete most of what it generates

### The filter
**"Would this change how the agent acts next time?"** Yes → store. No → let go.

---

## Layer 4: Dreaming (research preview, May 2026)

### What it is
A scheduled background process. Reads existing memory + past session transcripts → produces a NEW, reorganized memory store. Duplicates merged, stale entries replaced, new insights surfaced.

### Critical condition
Dreaming only helps agents that run the same kind of task repeatedly. A one-off agent has nothing to consolidate. Run it on a workhorse, not a tourist.

### The API procedure (prerequisites)
1. Managed Agents API key
2. Dreaming access requested via Anthropic form (gated)
3. Latest Anthropic SDK (Python/TS)

### Required beta headers
```
anthropic-beta: managed-agents-2026-04-01,dreaming-2026-04-21
```

### The call
```python
dream = client.beta.dreams.create(
    inputs=[
        {"type": "memory_store", "memory_store_id": store_id},
        {"type": "sessions", "session_ids": [session_a, session_b]},
    ],
    model="claude-opus-4-7",
    instructions="Focus on coding-style preferences; ignore one-off debugging notes.",
)
```

### Safety design
Input memory store stays READ-ONLY. Dream produces a SEPARATE output store. Review it before committing. A dream can never silently corrupt your existing memory.

### Real-world result
Harvey AI saw ~6x increase in agent task-completion rates after enabling Dreaming for legal-drafting workflows.

---

## The 5 mistakes that break agent memory

1. **Treating Projects as memory** — Projects persist instructions, not history
2. **Dumping everything into CLAUDE.md** — bloats wastes tokens, buries signal
3. **Storing memory with no filter** — if everything matters, nothing does
4. **Auto-deploying dream output** — the separate output store exists for review
5. **Running Dreaming on a low-frequency agent** — Dreaming needs repeated patterns

---

## The Obsidian-style vault architecture (Layer 3 done right)

This is what `05_memory_vault/` implements. Four design decisions that matter:

### 1. Organize by TYPE, not by topic
Folder = observations / reactions / patterns / questions / numbers. NOT folder = AI / business / fitness. Why: when organized by topic, "AI content strategy" and "how attention works psychologically" never meet. When organized by type, they both land in `patterns/` and Claude finds the connection.

### 2. One rule for ambiguity
When in doubt, put it in INBOX. Simplicity is intentional.

### 3. CLAUDE.md is the most important file
- Identity (who you are)
- Current Projects (what you're working on RIGHT NOW)
- Vault Structure (how Claude navigates)
- Voice (your writing style in specific terms)
- Hard Rules (never read .env, never modify Published, etc.)
- What you want from the agent

### 4. Skills run the system
Four skills cover 90% of usage:
- **Process Inbox** — file raw captures into structured folders
- **Weekly Connections** — find patterns across the last 7 days
- **Generate Brief** — one-thing/proof/transformation/3-hooks/3-closers
- **Write Content** — turn brief + sources into final piece

### The 20-minute daily ritual
- 5 min capture
- 5 min "process my inbox"
- 5 min "run connection session"
- 5 min "generate a brief for [today's strongest connection]"

Done. By the time coffee is done, you have a brief ready to write.

---

## What's actually in `05_memory_vault/`
- `CLAUDE.md` — the identity + projects file
- `README.md` — how to use the vault
- `folder_structure.md` — explanation of each folder
- `05-CLAUDE/skills/process_inbox.md`
- `05-CLAUDE/skills/weekly_connections.md`
- `05-CLAUDE/skills/generate_brief.md`
- `05-CLAUDE/skills/write_content.md`
- All vault folders pre-created (INBOX, CAPTURES with subfolders, CONNECTIONS, BRIEFS, PUBLISHED)

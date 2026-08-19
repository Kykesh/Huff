# Huff Workspace — CLAUDE.md

## Workspace layout

```
Huff/
├── CLAUDE.md                        ← you are here (workspace root)
├── Money/                           ← Claude AI systems kit (toolbox, reference only)
├── Faceless/                        ← Ranked Reality — automated YouTube video pipeline (/produce)
├── Channel Lab/                     ← niche scouting for future faceless channels (/scout)
├── Huff House Budget/               ← personal budget tracker (Node/Express/SQLite, port 3001)
├── Random Project/                  ← Powerball combination manager (Node/Express/SQLite, port 3000)
├── trading-os/                      ← AI trading coach, SaaS edition (clone pending — see below)
└── trading_personal/                ← Trading Edge PERSONAL edition (Next.js/SQLite, port 3008) — the active trading project
```

---

## The projects at a glance

### Money/
A reference and scaffold library — NOT active application code. Contains:
- `00_MASTER_GUIDE.md` — index to everything; read first when routing an unfamiliar request
- `START_HERE_NEW_PROJECT.md` — copy-out recipes for spinning up new projects from the kit + anti-drift rules
- `01_notes/` — 10 deep-dive concept docs (multi-agent systems, Claude Code mastery, Company Brain, etc.)
- `02_prompt_library/` — copy/paste prompts (YouTube, social, decision, Council skill)
- `03_agent_team/` — 4-agent content team + `automated_pipeline/` (`/ship` for code) + `video_pipeline/` (`/produce` for video)
- `04_youtube_starter_kit/` — niche analysis, 4 niche workflows, and `05_policy_compliance.md` (YouTube AI-content rules)
- `05_memory_vault/` — Obsidian-style persistent memory scaffold

**Hard rule:** Never edit files in `Money/`. Templates are meant to be COPIED into the project that needs them, then edited there. (Deliberate kit upgrades happen only on Kyle's explicit instruction.)

### Channel Lab (`Channel Lab/`)
The decision factory for faceless channels #2+. `/scout <niche | channel URL | inbox>` researches a candidate against `scoring_rubric.md` (money, competition, repeatability, automation fit, policy safety, 8-min fit) and writes a GO/WATCH/NO-GO verdict to `evaluations/`. `niche_money_table.md` holds the RPM-per-subject reference. Kyle drops reference channels into `inbox/`. The lab evaluates; it NEVER launches — new channels go through `Money/START_HERE_NEW_PROJECT.md` Recipe A on Kyle's call, and the portfolio guardrail (no new launch until Ranked Reality hits 12 uploads + 30 days of data) lives in `Channel Lab/README.md`.

### Faceless (`Faceless/`)
**Ranked Reality** — Kyle's faceless YouTube channel (Data/Rankings niche). The first live instance of Money's `video_pipeline/`: Researcher → Scripter → Producer → Publisher chained by one `/produce <topic>` command, producing 8-min-plus rendered MP4s plus upload packages. Markdown configs + Remotion render project + ElevenLabs voiceover; keys in `.env`. **Read `Faceless/README.md` first for any work here.** Pipeline never uploads — Kyle reviews and publishes manually. Policy playbook: `Money/04_youtube_starter_kit/05_policy_compliance.md`.

### Huff House Budget (`Huff House Budget/`)
Personal household budget tracker. Stack: Node.js ≥18, Express 4.21, SQLite (better-sqlite3), vanilla HTML/CSS/JS SPA.

```
Huff House Budget/
├── server.js          # Express entry point, auto-migrates DB, serves SPA
├── package.json
├── claude.md
├── data/
│   ├── app.db         # SQLite database (created on first run)
│   ├── backups/       # Nightly timestamped backups (last 30 kept)
│   ├── server.log     # LaunchAgent stdout (if installed)
│   └── server.error.log
├── public/
│   ├── index.html     # SPA shell — sidebar + <main>
│   ├── app.js         # All client logic: router, views, charts, filters
│   └── style.css      # Dark theme, responsive
├── routes/
│   └── api.js         # JSON API endpoints
└── scripts/
    ├── migrate.js     # Schema setup (idempotent, auto-runs on start)
    ├── seed.js        # Inserts starter data (one-time)
    ├── install-service.sh
    └── uninstall-service.sh
```

| Command | What it does |
|---|---|
| `npm start` | Run server on **http://localhost:3001/** |
| `npm run dev` | Same with `node --watch` hot-reload |
| `npm run migrate` | Create / refresh SQLite schema |
| `npm run seed` | Insert starter rows (one-time, `--force` to wipe) |

Key files: `server.js` (entry), `routes/api.js` (all endpoints), `public/app.js` (all client logic), `data/app.db` (SQLite).

API field convention: **camelCase** on the wire (`dueDate`, `payPeriod`), **snake_case** in the DB. Translation lives in `routes/api.js`.

Database backups run automatically on startup and every 24 h — last 30 kept in `data/backups/`. Safe to stop the server; restore by copying a backup over `data/app.db`.

### Random Project (`Random Project/`)
Powerball combination manager. Stack: Node.js, Express, SQLite, vanilla JS multi-page frontend.

| Command | What it does |
|---|---|
| `npm start` | Run server on **http://localhost:3000/** |
| `node seed.js` | One-time: seed all 292 M combinations (~10 min, ~15 GB) |
| `node import-winners.js` | Load `powerball.csv` into `used` and `drawings` tables |
| `node migrate-add-seq.js` | Backfill `seq` column after any CSV re-import |

**Do not re-run `seed.js`** on a populated database — file is ~15 GB.

Key files: `server.js` (entry + formula caches), `combo.js` (O(1) combinadic ID), `formula.js` (Generator 2), `formula1.js` (Generator 1), `powerball.csv` (draw-order history).

Critical distinction: `combinations` table stores whites **sorted ascending**; `powerball.csv` stores them in **actual draw order**. Generator 1 reads from CSV; everything else uses sorted order.

### trading-os (`trading-os/`)
AI trading coach, journal, and pre-market planner — "Trading Edge" (placeholder name; repo working name stays `trading-os`). A **deployed multi-tenant SaaS**, not a local toy. This is the most substantial project in the workspace.

- **Live:** https://trading-os-ashy.vercel.app
- **Repo:** https://github.com/Kykesh/trading-os.git (private)
- **Has its own `CLAUDE.md` — read `trading-os/CLAUDE.md` FIRST for any work here.** It's far more detailed than this summary.

**Stack:** Next.js 15 (App Router) + React 19 + TypeScript · Postgres (Neon) via Drizzle ORM · Clerk auth · Tailwind · multi-provider AI (Anthropic/Groq/Gemini/Ollama) in `src/lib/ai.ts` · hosted on Vercel (auto-deploys on push to `main`).

| Command | What it does |
|---|---|
| `npm run dev` | Local dev (reads `.env.local`) on **http://localhost:3000** |
| `npm run build` | Production build |
| `npm run type-check` | `tsc --noEmit` (CI gate) |
| `npm run db:push` | Apply `src/lib/schema.ts` to the DB |
| `npm run db:studio` | Browse the DB |

**Three things that bite if you forget them:**
1. **Port 3000 collides with the Powerball app.** Only one can run at a time — stop Powerball before `npm run dev` here, or change one's port.
2. **Multi-tenancy is the #1 pattern.** Every table has `user_id` (Clerk id); the data layer self-scopes via `currentUserId()`. Any new query MUST filter by `user_id` or one user sees another's data.
3. **Two editions exist** — this is the **business/SaaS** edition (Postgres + Clerk, branches `main`/`develop`). A frozen **personal** edition (SQLite, single-user) lives on the `personal` branch. Work in business unless told otherwise. Never commit directly on `main`; work on `develop` and merge.

**Positioning vs reality:** the landing page markets multi-asset + "train your own AI," but the AI engine still runs the short-bias small-cap playbook (`src/lib/ai.ts`, `playbook/`). Making it genuinely multi-asset + per-user-trainable is the next major build — see `trading-os/docs/AI_PLATFORM_PLAN.md` and `docs/ROADMAP.md`.

**How the Money kit applies here:** Trading-os is the most natural consumer of the Money folder's systems:
- `Money/01_notes/06_trading_bots.md` — trading bot / strategy patterns
- `Money/02_prompt_library/07_council_skill.md` — run Council before any major strategy or AI-engine change
- `Money/03_agent_team/automated_pipeline/` (`/ship`) — feature work, but respect this repo's GitHub Flow (develop → main)
- `Money/05_memory_vault/` — per-user training data and market context compounds well here

### trading_personal (`trading_personal/`)
**Trading Edge — personal edition.** Kyle's ACTIVE day-trading cockpit: AI coach,
journal, pre-market planner, and a live paper-trading Terminal for short-biased
small-cap trading. Single-user, runs 100% locally (SQLite); only AI calls leave
the device. **Read `trading_personal/README.md` + `docs/` first for any work here.**

**Stack:** Next.js (App Router) + TypeScript · SQLite (`data/trading.db`) ·
multi-provider AI (Anthropic/Groq/Gemini) · Python analytics sidecar (`analytics/`).

| Command | What it does |
|---|---|
| `npm run dev` | Local dev on **http://localhost:3008** (no login — single-user local app; auth removed v2.29) |
| `npm run realtime -- SYMS…` | Standalone realtime worker (money-flow engine) |

Key surfaces: `/desk` (Terminal: charts + Montage with DAS-style L2 ladder + money
flow), `/premarket` (AI ticker plans + PulseStrip), `/api/pulse/*` (free halts/SSR/
FINRA short-volume/borrow/news/social layer). Live data: Schwab LEVELONE streamer
(`src/lib/realtime/`); charts fall back to Yahoo when Schwab is disconnected.

Rules of thumb: paper-only (no live-money execution) · the dev server is usually
already running on 3008 — check before starting another · the realtime engine is a
process singleton, so engine/transport changes need a server restart · keep
`CHANGELOG.md` current (minor bump per meaningful change).

---

## How the Money kit enhances the other projects

### `/ship` automated pipeline → `Money/03_agent_team/automated_pipeline/`
Use this when implementing a non-trivial feature in either app (budget or Powerball). The Planner → Coder → Tester → Reviewer chain prevents half-finished implementations and catches regressions before they land. Copy the pipeline spec into the target project folder, run `/ship`, review the verdict before merging.

### Council skill → `Money/02_prompt_library/07_council_skill.md`
Use before any significant architectural decision in either project (e.g., "should we add a notifications system to the budget app?", "should Generator 1 switch from a 11-draw to a 15-draw window?"). The 5-advisor council surfaces what you'd otherwise miss. Invoke with: "Council this: [decision]".

### Memory vault → `Money/05_memory_vault/`
Set this up once. It compounds context across all three projects so Claude retains decisions, naming conventions, and intent across sessions. Use the 20-minute daily ritual from `00_MASTER_GUIDE.md` to keep it current.

### Multi-agent paradigm guide → `Money/01_notes/10_multi_agent_systems.md`
Reference this when a task feels too large for a single Claude session. It maps which paradigm (Single / Subagents / Agent Teams / Dynamic Workflows) fits which task shape. Don't spawn subagents on tasks that fit in one agent — it's wasteful.

### Claude Code mastery → `Money/01_notes/09_claude_code_mastery.md`
32 Claude Code hacks. Most relevant to active dev on Budget and Powerball: plan mode, `/compact`, worktrees, CLAUDE.md layering, and `/init`. Reference before starting any session that will touch multiple files.

---

## Shared tech conventions

**Budget + Powerball** share the same stack pattern — keep these consistent:
- **Runtime:** Node.js ≥18
- **Server:** Express, single `server.js` entry point
- **Database:** SQLite, schema migrations run automatically on start (idempotent)
- **Frontend:** Vanilla JS, no build step, static files served from `public/`
- **No auto-publish, no auto-merge, no destructive DB ops without a backup confirmed**

Both apps have auto-backup logic — confirm it's running before any bulk DB operation.

**trading-os** is the odd one out — Next.js 15 / Postgres / Clerk SaaS, not a vanilla-Express/SQLite app. Don't apply the Budget/Powerball conventions to it; follow `trading-os/CLAUDE.md` instead.

### Ports (dev servers)
| Project | Port |
|---|---|
| Budget | 3001 |
| Powerball | 3000 |
| trading-os | 3000 |
| trading_personal | 3008 |

⚠️ **Powerball and trading-os both default to 3000** — they cannot run at the same time. Stop one before starting the other, or override a port. (`trading_personal` moved to 3008 and no longer collides.)

---

## Routing rules for this workspace

| Request shape | Where to go first |
|---|---|
| Feature for Budget app | `Huff House Budget/` claude.md → then `Money/03_agent_team/automated_pipeline/` if complex |
| Feature for Powerball app | `Random Project/` CLAUDE.md → then `Money/03_agent_team/automated_pipeline/` if complex |
| Feature for trading-os (SaaS) | `trading-os/` CLAUDE.md (once cloned) → `Money/03_agent_team/automated_pipeline/` for complex work |
| Feature for Kyle's own trading cockpit | `trading_personal/` README + `docs/` — this is the default for "my terminal / montage / premarket / coach" requests |
| Trade planning / strategy | `trading_personal/` + `Money/02_prompt_library/07_council_skill.md` for key decisions |
| Faceless channel work (videos, calendar, pipeline) | `Faceless/README.md` → `/produce <topic>` for video production |
| New channel idea / niche evaluation / "is X worth it?" | `/scout <niche or URL>` → `Channel Lab/` |
| YouTube policy / monetization questions | `Money/04_youtube_starter_kit/05_policy_compliance.md` |
| Start a brand-new project from the kit | `Money/START_HERE_NEW_PROJECT.md` |
| "Give me a prompt for X" | `Money/02_prompt_library/` |
| "Council this: [decision]" | `Money/02_prompt_library/07_council_skill.md` |
| "What agent paradigm fits this?" | `Money/01_notes/10_multi_agent_systems.md` |
| "Explain [concept]" | `Money/01_notes/` (relevant deep-dive) |
| "Set up memory / don't rebuild context" | `Money/05_memory_vault/README.md` |
| Anything else | `Money/00_MASTER_GUIDE.md` (the index) |

When a request spans multiple projects, read the specific project CLAUDE.md first, then pull tools from `Money/` as needed.

---

## Hard rules

- NEVER edit files in `Money/` during a task — copy templates into the target project and edit there
- NEVER auto-merge code, auto-publish content, or auto-send anything; produce drafts, user approves
- NEVER re-run `seed.js` in the Powerball project on a populated database
- NEVER run Powerball and trading-os dev servers at once — both use port 3000
- NEVER commit directly on `main` in trading-os — work on `develop`, then merge (it auto-deploys to Vercel)
- In trading-os, EVERY new query must be scoped to `user_id` — a missing filter leaks one user's data to another
- ALWAYS confirm a backup exists before any destructive database operation in either local app
- When ambiguous which project a request targets, ask — don't guess and modify the wrong codebase

---

## Voice / tone defaults

Short punchy sentences. Real numbers beat vague claims. No filler. Smart-friend tone. No emojis unless asked.

---

## "All hands on deck" — the standing protocol

**Kyle, 2026-08-19:** *"Moving forward when I say all hands on deck this means
wake up all the agents and bring them forward for the work I am about to give,
and whoever isn't needed we don't use until they are."*

On those words, before touching the work:

1. **Muster the full roster.** All 17 in `.claude/agents/` are brought forward
   and considered — not the two or three that come to mind.
2. **Triage out loud against the actual task.** For each agent: DEPLOYED (with
   the specific slice it owns) or BENCHED (with the one-line reason). Kyle sees
   the whole board, including who is sitting out and why — a benched agent is a
   deliberate call, not an oversight.
3. **Deploy in parallel**, each on its own slice, each reporting back findings
   rather than file dumps.
4. **Benched agents stay benched** until the work needs them. Do not wake an
   agent to look busy; do not leave one benched once its domain is in play.

The roster (17): trading-researcher · backtest-lead · backend-lead ·
backend-engineer · frontend-lead · frontend-engineer · qa-lead · platform-perf ·
bug-hunter · doctrine-keeper · interrogator · market-intel · trader-study ·
**execution-reviewer** · **data-integrity** · **measurement-validity** ·
**live-readiness**

Every charter carries a mastery mandate (be a master of the FIELD, not just this
repo) and a learning loop (`trading_personal/docs/AGENT_LESSONS.md` — read before,
append after; anything Kyle finds first is a recorded MISS).

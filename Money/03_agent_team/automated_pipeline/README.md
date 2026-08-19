# Automated 4-Agent Pipeline — Ship Features While You Sleep

This is the team the user asked for: a fully automated team you OVERSEE. One trigger, four specialists, finished feature by morning.

## What this is

A drop-in Claude Code agent team that runs the Planner → Coder → Tester → Reviewer pipeline automatically. Each agent has:
- One job
- Its own scoped context
- A file-based handoff to the next agent
- Tools restricted to what it actually needs

You write ONE sentence: `/ship add rate limiting to the login endpoint`

Four specialists run in sequence. By morning, you have:
- A spec
- A code change
- Tests written and run
- A review verdict

You wake up, read the verdict, merge or send back for revisions.

## How it differs from `03_agent_team/` (the original)

| Feature | Original (manual) | Automated (this folder) |
|---------|-------------------|-------------------------|
| Stages | Research → Outline → Write → Edit | Planner → Coder → Tester → Reviewer |
| Domain | Content production | Software development |
| Handoff | You copy/paste between agents | File-based, automatic |
| Trigger | Manual per stage | One slash command |
| Best for | Articles, posts, scripts | Features, bug fixes, refactors |

Use BOTH. They're not competing — they're the same architecture applied to different domains.

## File structure

```
automated_pipeline/
├── README.md                        ← you are here
├── .claude/
│   ├── agents/
│   │   ├── planner.md               ← Stage 1: spec writer (Opus)
│   │   ├── coder.md                 ← Stage 2: implementation (Sonnet)
│   │   ├── tester.md                ← Stage 3: test writer (Sonnet)
│   │   └── reviewer.md              ← Stage 4: final review (Opus)
│   └── commands/
│       └── ship.md                  ← The orchestrator (one command runs all 4)
└── .pipeline/                       ← Handoff files land here
    ├── spec.md                      ← (created by planner)
    ├── changes.md                   ← (created by coder)
    ├── test-results.md              ← (created by tester)
    └── review.md                    ← (created by reviewer)
```

## How to install

### Option A: Drop into your existing repo
1. Copy `.claude/` into the root of your repo
2. Run Claude Code in that repo
3. Use `/ship <feature description>` whenever you want to chain the team

### Option B: Use this as a standalone Claude Code workspace
1. `cd` into this folder
2. Run `claude` (Claude Code)
3. `/ship` is available immediately

## How to use

```bash
# Single command kicks off all 4 stages
/ship add rate limiting to the login endpoint

# Mid-complexity feature
/ship migrate user sessions from in-memory to Redis with backwards compatibility

# Large feature (will likely trigger Dynamic Workflows under the hood)
/ship implement multi-tenant support across the auth, billing, and dashboard modules

# Bug fix
/ship fix the race condition in the order webhook handler
```

The orchestrator runs each agent in sequence. After each stage it confirms the handoff file exists before starting the next. If anything goes wrong, it stops and shows you the problem.

## What happens in each stage

### Stage 1 — Planner (Opus)
Reads relevant code, writes `.pipeline/spec.md`. Includes:
- Files to create/modify
- Function/interface signatures
- Edge cases to handle
- Existing patterns to follow
- OPEN QUESTIONS at the top if anything is ambiguous

If there are open questions, the pipeline STOPS so you can answer them. The Planner doesn't guess.

### Stage 2 — Coder (Sonnet)
Reads the spec. Implements ONLY what the spec describes. Writes `.pipeline/changes.md` summarizing:
- Files changed
- What each change does
- What the Tester should focus on

### Stage 3 — Tester (Sonnet)
Reads `changes.md` AND the spec. Writes tests covering happy path + edge cases from spec + at least one failure case. Runs the tests. Writes `.pipeline/test-results.md`. If tests fail, STOPS and surfaces the failures — does NOT fix the code itself.

### Stage 4 — Reviewer (Opus, read-only)
Reads everything. Runs `git diff` to see actual changes. Assesses: does the code match the spec? Are the tests meaningful or superficial? Any security/performance/correctness issues? Writes `.pipeline/review.md` with:
- VERDICT: SHIP / NEEDS WORK / BLOCK
- For NEEDS WORK or BLOCK: exactly what to fix and where

Reviewer is read-only by design. It JUDGES, not fixes. Green tests ≠ correct behavior.

## Why this design works

### Each agent has a clean desk
The Coder doesn't see the Reviewer's mental space. The Tester doesn't see the Planner's deliberations. Context is scoped to the job.

### Specialists beat generalists
Opus for Planning and Reviewing (set the quality ceiling). Sonnet for building and testing (balanced cost/quality).

### File-based handoffs make state explicit
You can re-run any stage without redoing the whole chain. Spec weak? Re-run Planner. Tests thin? Re-run Tester with updated guidance. No agent has to "remember" what previous agents did — it's all on disk.

### Read-only Reviewer is the last line of defense
The Reviewer can't paper over problems by editing. It can only judge. If tests are green but code is wrong, the Reviewer says BLOCK.

## When this pipeline fits (and when it doesn't)

### Use this pipeline for
- Features that need spec → implementation → tests → review
- Bug fixes where you want spec-first thinking
- Anything you'd hire 4 people to ship
- Overnight work you trust enough to let run unattended

### Don't use this pipeline for
- One-line tweaks (use a single agent, save the tokens)
- Exploratory research ("how does our auth work?" — use a single Opus session)
- Refactors with no clear success criteria (the Planner will return open questions all the way down)
- Production-critical changes you can't review carefully — the pipeline is fast but doesn't replace your judgment

## Cost estimate (rough)

A single `/ship` run for a moderate feature:
- Planner (Opus, 10K tokens) ≈ $0.50–$1.00
- Coder (Sonnet, 30K tokens) ≈ $0.20–$0.40
- Tester (Sonnet, 20K tokens) ≈ $0.15–$0.30
- Reviewer (Opus, 15K tokens) ≈ $0.60–$1.20

**Per ship: ~$1.50–$3.00.** Significantly more than a single agent. Significantly less than 4 hours of your time.

## When to graduate to Dynamic Workflows

This pipeline tops out around 1 feature per run. If you want to:
- Ship 50 features in parallel
- Run adversarial verification across the codebase
- Run jobs that survive crashes and resume automatically

→ Graduate to Dynamic Workflows (`/effort ultracode` or "create a workflow"). See `01_notes/10_multi_agent_systems.md`.

The 4-agent pipeline is your DAILY WORKHORSE. Dynamic Workflows are for OCCASIONAL massive jobs.

## Extending this team

### Add a 5th agent
Drop a new `.md` file in `.claude/agents/`. Update `.claude/commands/ship.md` to chain it in. Example 5th agent: `documenter` — reads the spec + final code, updates README/CHANGELOG.

### Adapt for non-coding work
Same architecture works for:
- Marketing: Strategist → Writer → SEO Specialist → Editor
- Sales: Researcher → Outreach Writer → Reply Reviewer → CRM Updater
- Analysis: Data Puller → Analyst → Visualizer → Insight Reviewer

Just rewrite the 4 agent files for your domain. The `/ship` orchestrator template stays the same.

### Add hooks
Wire up Claude Code hooks (see hack #13 in `01_notes/09_claude_code_mastery.md`) so:
- PreToolUse hook blocks dangerous bash commands
- PostToolUse hook auto-formats files after Coder edits
- SessionEnd hook commits the branch automatically

Hooks run OUTSIDE the model's reasoning so they can't be skipped.

## The bigger lesson

You spent years being single-threaded — researching, planning, coding, testing, reviewing one task at a time. This pipeline makes you a director of 4 specialists running in sequence.

The next step (after you're comfortable with this) is running multiple pipelines in PARALLEL using git worktrees (hack #21). Three features, three `/ship` calls, three branches, three Claude sessions — zero conflicts.

By the time all four agents are wired up and you've shipped 5 features through the pipeline, you'll kick off a feature before bed and read a verdict with your coffee.

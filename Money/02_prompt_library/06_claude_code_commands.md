# Claude Code Commands & Hacks — Quick Reference

The actionable companion to `01_notes/09_claude_code_mastery.md`. This file is what you keep open while working.

## The first 5 commands to memorize

```bash
/init           # scan codebase, write CLAUDE.md (first thing in any new project)
/context        # see what's eating your tokens (run when session feels heavy)
/compact        # summarize older messages, return your context window
/clear          # wipe slate (CLAUDE.md stays loaded)
/cost           # check token spend for current session
```

## Mode switching

```bash
Shift+Tab       # cycle through modes (find Plan Mode)
Esc Esc         # rewind the conversation to a previous point
#               # any line starting with # is added to CLAUDE.md inline
```

## Model selection

```bash
/model opus     # architecture, gnarly debugging, code review
/model sonnet   # day-to-day building (the default sweet spot)
/model haiku    # cheap exploration ("find files importing X")
```

## Heavy thinking modes

```bash
ultrathink      # maximum extended-thinking budget for this prompt (use for hard decisions)
/effort high    # default reasoning effort
/effort ultracode  # session-level: max reasoning + auto-trigger Dynamic Workflows when warranted
```

## Memory & context management

```bash
/memory         # open CLAUDE.md inline for mid-session edits
/compact preserve auth decisions and DB schema   # steer what compact keeps
```

## Skills & plugins

```bash
/skills         # see installed skills
/plugin         # browse the marketplace (Context7, ReelBatch, etc.)
```

## Code review & verification

```bash
/review         # built-in code review of recent changes
/permissions    # explicitly allow safe commands, deny destructive ones
```

## Parallelism & worktrees

```bash
claude --worktree feature-name   # spin up an isolated branch + session
/loop 5m check the deployment status   # recurring task within session
```

## Multi-agent

```bash
use subagents to research X       # fire-and-forget parallel workers
create a workflow to do X          # Dynamic Workflows (up to 1,000 agents)
```

## The killer prompt suffixes

Append these to ANY prompt for higher-quality output:

```text
Continuously ask me questions until you're 95% confident you understand what I need.

Use plan mode. Don't write any code until I approve the plan.

ultrathink

Use subagents in parallel for research.

Add verification steps to the todo list. Don't move to the next todo until 95% confident the current one is good.
```

## The voice mode shortcut

Mac: Voice mode is in the keyboard shortcuts menu. Hit the keybind, speak your prompt, release. You'll type at 3x speed.

## The hooks pattern (for things that MUST always happen)

Drop a shell script in `.claude/hooks/`:

```bash
# .claude/hooks/post-edit-format.sh
# Runs after every Edit tool use
#!/bin/bash
if [[ "$1" == *.ts || "$1" == *.tsx ]]; then
  npx prettier --write "$1"
fi
```

Hooks fire OUTSIDE the model's reasoning so they cannot be skipped.

## The MCP vs API endpoint tradeoff

| | MCP | Hardcoded API |
|---|-----|---------------|
| Token cost | High (full tool definitions in context) | Low (just the endpoint) |
| Flexibility | Claude can use any tool | Just the one you wired |
| Best for | Exploration | Production / scheduled tasks |

Rule: MCP for "I'm exploring," hardcoded API for "this runs every day."

## The status line setup (do this once)

`/statusline` generates a script that pins to the bottom of your terminal:
- Current model
- Context % used
- Cost so far
- Git branch

Once you have it visible, you'll stop guessing where you are in your context budget.

## The session lifecycle (the routine)

```
1. /init                      ← if it's a new project
2. /context                   ← what's already loaded
3. Plan Mode (Shift+Tab)      ← describe the task, get a plan
4. Approve the plan
5. Build (let Claude work)
6. /review                    ← have it review its own work
7. /compact at ~60%           ← keep context lean
8. /cost                      ← check spend
9. Repeat 3-8 for next task
```

## When something goes wrong

1. **Drift**: Esc Esc to rewind, then rephrase.
2. **Bad output**: `/clear` and start over (CLAUDE.md keeps your conventions).
3. **Bloated context**: `/context` to find the culprit (usually an MCP server). Disable it. Rerun.
4. **High spend**: `/cost` to confirm. Drop to `/model sonnet` or `/model haiku` for next task.
5. **Stuck loop**: stop the session, file the issue as a `# memory: known failure mode` in CLAUDE.md, restart.

## The advanced moves

### Run 3 features in parallel
```bash
# Terminal 1
cd ~/project
claude --worktree feature-a
/ship implement feature A

# Terminal 2
cd ~/project
claude --worktree feature-b
/ship implement feature B

# Terminal 3
cd ~/project
claude --worktree feature-c
/ship implement feature C
```

Three isolated branches, three Claude sessions, zero conflicts. (`/ship` requires the automated pipeline scaffold from `03_agent_team/automated_pipeline/`.)

### Schedule overnight work
Use Claude Desktop scheduled tasks. Set a task to run at 2am that reviews yesterday's PRs and posts a summary to Slack.

### Control from your phone
Start the session at your desk, scan the QR code, keep steering from your phone while you're walking. The code never leaves your machine.

## The 7 features that just shipped (as of May 2026)

1. **Dynamic Workflows** — Claude writes JS orchestration, up to 1,000 parallel agents. Trigger: `create a workflow` or `/effort ultracode`.
2. **`/effort ultracode`** — max reasoning + auto-trigger workflows when task scale warrants.
3. **`/loop`** — recurring tasks within a session, expires after 3 days.
4. **Native git worktrees** — `--worktree feature-name` spins up isolated branches.
5. **Phone control** — QR code → keep steering from anywhere.
6. **Auto memory** — Claude writes notes to itself from your corrections, loads them next session.
7. **Routines** — laptop-off automation on Anthropic infrastructure.

If you don't know one of these — go try it today. Each one stacks.

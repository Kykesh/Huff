# Claude Code Mastery — 32 Hacks Reference

## The thesis
4% of all public GitHub commits are now written by Claude Code (~135K/day). The average user knows 6 of the 32 features that actually unlock it. The gap between beginner and pro IS this list, applied.

This file is the curated reference. Quick prompts for each hack live in `02_prompt_library/06_claude_code_commands.md`.

---

## TIER 1 — Foundation (the first session habits)

### 1. `/init` on every project
Scans codebase, writes `CLAUDE.md` mapping architecture, conventions, key files. Every future session loads this automatically. Stop re-explaining your project.

### 2. Set up `/statusline`
Pins a live bar to the bottom of your session: model, context %, cost, branch. Stops you guessing how close to context rot you are. Biggest anti-anxiety upgrade.

### 3. Use voice mode
You speak ~3x faster than you type. Anthropic's own engineers code mostly by voice. Detailed prompts = better output. Free speed.

### 4. Keep context small
Only give Claude what the current task needs. Less noise = better output. The single most-ignored basic.

### 5. `/context` to find token bloat
Shows EXACTLY what's eating your tokens — system prompt, files, MCP servers, conversation history, broken down by percentage. If a session feels heavy, this is your first command. Usually one MCP server is hogging 30%.

### 6. Compact at 60%, clear between tasks
At ~60% context use, run `/compact` — Claude summarizes older messages and returns your window. You can steer it: "/compact but preserve auth decisions and DB schema." For totally new tasks, `/clear` wipes the slate (CLAUDE.md stays loaded).

### 7. Always start in Plan Mode
Cycle modes with Shift+Tab until you land on Plan Mode. Claude can read/search/research but won't modify anything until you approve. Catches wrong assumptions in one sentence instead of forty files. Cuts revisions dramatically.

### 8. Treat Claude like a junior developer
"How should we handle X? What are the tradeoffs?" beats "write a function that does X." Reasoning first produces better code than pattern-matching from a command. You also surface assumptions, which is where real bugs hide.

### 9. Make it ask questions
Append to any non-trivial request: "Continuously ask me questions until you're 95% confident you understand what I need and what you'll do." Three rounds of clarification beat three rounds of revision.

### 10. Bake self-checks into todos
When Claude makes a todo list, ask it to add verification items: "Take a screenshot. Open DevTools. Run the tests." Plus: "Don't move to the next todo until you're 95% confident the current one is good." Stops "looks done, isn't done" outputs.

---

## TIER 2 — Control (the leverage stack)

### 11. Deploy subagents for parallel work
"Use subagents" for complex tasks. Each gets its own context window, can use a different model, works in parallel. Reports back to the main session. Pair with model tiering (#15) — run subagents on cheap Haiku while main thread stays on Opus.

### 12. Build custom Skills
Drop `SKILL.md` in `.claude/skills/<name>/`. Claude auto-loads when task matches description. ~100 tokens dormant, ~5K when needed — install dozens without context cost.

### 13. Use hooks for what MUST happen
Hooks are shell scripts that fire automatically at events: PreToolUse, PostToolUse, session start/stop, subagent completion. Run OUTSIDE the model's reasoning so they can't be skipped. Use for: format-on-edit, block dangerous bash, run lint before commits.

### 14. Edit permissions for safe autonomy
Don't YOLO `--dangerously-skip-permissions`. Use `/permissions` (or `~/.claude/settings.json`) to explicitly allow safe commands and deny destructive ones. Deny rules beat allow rules. Same speed, none of the danger.

### 15. Match the model to the task
Switch inside the session:
- `/model opus` — architecture, gnarly debugging
- `/model sonnet` — day-to-day building
- `/model haiku` — cheap exploration ("find every file that imports X")

One model for everything = leaving capability OR money on the table.

### 16. `/memory` to edit CLAUDE.md inline
Realize mid-session a convention should live permanently? `/memory` opens CLAUDE.md in-place. Faster than alt-tabbing. Loaded immediately for the rest of the session.

### 17. `/review` for built-in code review
Bundled skill that walks your recent changes with a structured pass — security, style, edge cases. Catches things the original build-mode session missed.

### 18. Track spend with `/cost`
Token usage and dollar cost for the current session. Finds silently expensive sessions (usually: too-big MCP servers, too-long context). Pair with statusline (#2) for always-visible.

### 19. Press Esc Esc to rewind
Double-tap Escape and Claude rewinds to a previous point in the conversation. Crucial when a session drifts — instead of fighting it, rewind to before the drift and rephrase. Most users never know this exists.

### 20. Type `#` for quick memory pins
Any line starting with `#` is treated as a memory instruction — added to CLAUDE.md without breaking your flow. Perfect for capturing a convention the moment you realize it: `# always use named exports, never default`.

---

## TIER 3 — Scale (the platform layer)

### 21. Parallel sessions with git worktrees
Native since Claude Code v2.1.50. `--worktree feature-name` runs two Claude sessions on the same repo without stomping. Each worktree is an isolated branch with its own working directory. Three sessions, three branches, zero conflicts.

### 22. Use API endpoints instead of MCP (sometimes)
MCP loads all a server's tool definitions into context — typical 5-server setup eats 55K tokens before you say a word. If you only need ONE thing (e.g. reading one Notion DB), hardcode the API endpoint. Less flexible, far cheaper. MCP for exploration, hardcode for production.

### 23. `/loop` for recurring tasks
Requires v2.1.72+. `/loop 5m check the deployment status` reruns the prompt every 5 min within the session. Babysit deploys, watch PRs, poll builds. Loops auto-expire after 3 days.

### 24. Schedule Desktop tasks
Automation longer than a session: use Claude Desktop scheduled tasks. Each fire opens a fresh session (no shared context with previous runs), survives terminal exits and laptop restarts. Use for: morning issue triage, weekly metric pulls, nightly log scans.

### 25. Routines for laptop-off automation
Routines run on Anthropic's infrastructure — your laptop can be off. Schedule via API call, GitHub event, or fixed cron. Pair with subagents: "review yesterday's PRs, summarize, post to Slack at 8am."

### 26. Phone control
Start a session locally, scan a QR code with your phone, keep steering from anywhere. Your code never leaves your machine — only the control channel goes mobile.

### 27. UltraThink for hard problems
Type "ultrathink" in your prompt → Claude allocates maximum extended-thinking budget before responding. NOT for trivial fixes. For architecture decisions, complex debugging, system-wide refactors. Visible quality jump. Tokens cost more; mistakes cost more not using it.

### 28. Build agent teams
Subagents (#11) work in isolation. Agent Teams let them share a task list, communicate, assign work. Talk to any teammate directly instead of routing through the main agent. More expensive, longer runs — for big multi-domain projects, cohesion is worth it.

### 29. Install Context7 MCP
Claude's training has a cutoff → can suggest deprecated APIs. Context7 MCP injects up-to-date version-specific docs from thousands of libraries (React, Next.js, Postgres, etc.) BEFORE Claude writes code. One install, quality jump across every library.

### 30. Browse `/plugin` marketplace
Pre-packaged Skills, agents, commands. Context7 is one. Browse before you build — chances are it exists.

### 31. Dynamic Workflows — up to 1,000 subagents in parallel
Shipped May 2026 with Claude Opus 4.8. Claude takes a task too big for one session, plans it, fans out across up to 1,000 parallel subagents, runs a second wave to refute findings, iterates until convergence, hands you the consolidated answer. Orchestration lives in a JS script Claude writes on the fly — NOT in the context window. That's what makes 500-agent runs feasible.

Activation: a single keyword. Requires v2.1.154+. On by default for Max/Team; Enterprise admins enable; Pro users toggle in `/config`. Trigger by saying "create a workflow" or by setting effort to `ultracode`. Cap: 1,000 subagents per workflow. Cost: significantly more tokens than single-agent — use where task scale justifies it.

### 32. `/effort ultracode`
Companion to Dynamic Workflows. Sets reasoning effort to xhigh and lets Claude auto-decide when a task is big enough to warrant a workflow. A single request can become multiple workflows in sequence. Session-scoped. Drop back to `/effort high` for routine work. Pair with Auto Mode so parallel subagents aren't blocked on permission prompts.

---

## The habits that keep beginners beginners

1. No CLAUDE.md → re-explaining the project every session and getting it wrong every session
2. Never checking `/context` → can't fix bloat you don't see
3. Skipping plan mode → 40-file diffs to fix a 1-sentence misunderstanding
4. YOLO permissions → speed is great until `rm -rf` runs in the wrong directory
5. One model for everything → burning Opus tokens on Haiku tasks
6. Ignoring the marketplace → building skills that already exist as plugins
7. Not knowing what shipped this week → biggest features (Dynamic Workflows, ultracode) launch quietly

---

## The compounding effect

Each hack individually = small win. Stacked:
- CLAUDE.md gives you persistent context
- Plan mode catches assumptions
- Skills package workflows
- Hooks enforce rules
- Worktrees parallelize
- MCP connects
- Dynamic Workflows orchestrate 1,000 agents

Most people will use 6 of them. The 4% writing commits today are the ones who keep stacking.

**One hack at a time. Pick `/init` or plan mode for tomorrow. Then the next.**

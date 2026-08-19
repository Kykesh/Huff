# Multi-Agent Systems — The 4 Paradigms

## The wrong question
"Should I use multiple agents?"

## The right question
"What kind of coordination does this task actually need?"

The answer determines the architecture. Pick wrong and you'll burn tokens running a swarm on a single-agent job, or you'll babysit a single agent on work that needed 4 specialists.

---

## The 4 paradigms (least → most complex)

```
Single Agent  →  Subagents  →  Agent Teams  →  Dynamic Workflows / Swarms
   simple        parallel        coordinated         massive scale
                 isolated        persistent          adversarial
```

| Paradigm | Persistence | Communication | Scale | Best for |
|----------|-------------|---------------|-------|----------|
| Single Agent | Single session | N/A | 1 | Simple, narrow, deep tasks |
| Subagents | Fire-and-forget | None (only via parent) | 5-20 | Independent parallel exploration |
| Agent Teams | Long-running | Direct peer-to-peer | 3-5 | Multi-stage coordination needing handoffs |
| Dynamic Workflows | Resumable | JS orchestration script | up to 1,000 | Wide, independent, large-scale |
| Swarms (Kimi) | Scoped per worker | Shared state + orchestrator | up to 300 | Same as workflows, different vendor |

---

## Paradigm 1 — Single Agent

**One Claude. Sequential. Holds the whole job in one context.**

Works perfectly when:
- The task fits in a single context window
- Steps depend on each other (can't run in parallel)
- The job is narrow and deep, not wide and shallow

Breaks when:
- The task fans out into 50+ independent sub-tasks
- Context fills past ~60% and quality degrades silently
- You start splitting the job manually and pasting between chats

The tell that you've outgrown single-agent: **you become the glue between Claude's outputs.** That's the moment to graduate to subagents or higher.

---

## Paradigm 2 — Subagents

**Parent spawns isolated workers. Each gets its own context window, tools, system prompt. Fire-and-forget. Reports back to parent. Parent is the SOLE coordinator.**

### The mental model
You're a research lead. You don't read every primary source yourself. You delegate focused questions to researchers, they come back with distilled findings, you synthesize.

### Key constraints (these are features, not bugs)
- Sub-agents CAN'T spawn other sub-agents
- Sub-agents CAN'T talk to each other
- Every result flows back to the parent
- The parent is the sole orchestrator

### The compression principle
The point isn't just parallelism — it's COMPRESSION. You distill vast exploration into a clean signal without polluting the parent's context with noise.

### When to use
- Independent research streams (5 competitive teardowns, 30 file scans)
- Codebase exploration ("find every file that uses X")
- Lookups where parent only needs the summary, not the journey
- Tasks where context isolation matters more than coordination

### When NOT to use
- Tasks where workers need to negotiate findings
- Coding work where workers might make incompatible assumptions
- Anything where the journey matters as much as the destination

### Example
```python
from claude_agent_sdk import query, ClaudeAgentOptions, AgentDefinition

async for message in query(
    prompt="Review the authentication module for security vulnerabilities",
    options=ClaudeAgentOptions(
        allowed_tools=["Read", "Grep", "Glob", "Agent"],
        agents={
            "security-reviewer": AgentDefinition(
                description="Security specialist. Use for vulnerability checks.",
                prompt="You are a security specialist...",
                tools=["Read", "Grep", "Glob"],
                model="sonnet",
            ),
            "performance-optimizer": AgentDefinition(
                description="Performance specialist. Use for latency issues.",
                prompt="You are a performance engineer...",
                tools=["Read", "Grep", "Glob"],
                model="sonnet",
            ),
        },
    ),
):
    print(message)
```

The `description` field is the routing signal. Keep it specific — vague descriptions cause routing mistakes.

---

## Paradigm 3 — Agent Teams

**Persistent peers. Shared task list. Direct peer-to-peer communication. Negotiate findings before reporting up.**

### The mental model
Hiring contractors for isolated tasks (subagents) vs. assembling a team that works together in the same room (agent teams).

### Three moving parts
1. **Team lead** — coordinates work, assigns tasks, synthesizes results
2. **Teammates** — independent agent instances with their own context windows, working in parallel
3. **Shared task list** — tracks pending/in-progress/done, with dependencies between tasks

### A typical lifecycle
```
Claude (Team Lead):
└── spawnTeam("auth-feature")
    Phase 1 - Planning:
    └── spawn("architect", prompt="Design OAuth flow", plan_mode_required=true)
    Phase 2 - Implementation (parallel):
    └── spawn("backend-dev", prompt="Implement OAuth controller")
    └── spawn("frontend-dev", prompt="Build login UI")
    └── spawn("test-writer", prompt="Write integration tests", blockedBy=["backend-dev"])
```

The `blockedBy` field is doing real coordination — the test writer won't start until the backend agent is done. The lead doesn't have to manually manage sequencing.

### Key differences from subagents
- Teammates can MESSAGE each other directly
- You can interact with individual teammates directly (not forced to go through the lead)
- Agents PERSIST and accumulate context over time
- Mid-task discoveries surface to teammates immediately

### When to use
- Multi-stage work needing communication (frontend tells backend "API response shape needs to change")
- Tasks where agents need to reconcile outputs before proceeding
- Cases where a discovery in one thread changes what another thread should do

### When NOT to use
- Wide, embarrassingly parallel work (use subagents or Dynamic Workflows)
- Single-context tasks (just use one agent)
- Anything that fits in 5 minutes of single-agent work

### Practical limits
3-5 teammates is the sweet spot. Past 5 gets messy. Sessions die with interruptions — if Claude crashes mid-task, the team is gone (this is what Dynamic Workflows fix).

### The canonical example: the 4-agent dev pipeline
The Planner → Coder → Tester → Reviewer chain is an Agent Team example with file-based handoffs. It's the team you want to build first. The full scaffold is in `03_agent_team/automated_pipeline/`.

---

## Paradigm 4 — Dynamic Workflows (Claude Code, May 2026)

**Claude writes a JavaScript orchestration script. The script becomes the plan. A JS runtime executes it, fanning out to tens-to-thousands of parallel subagents. Adversarial verification. Resumable.**

### The killer architectural shift
Instead of Claude holding the plan in its context window, it writes JS. The orchestration moves from the LLM's memory into executable code.

```
SINGLE-AGENT CLAUDE CODE              DYNAMIC WORKFLOWS
─────────────────────────             ──────────────────
Claude plans + executes               Claude writes the script
                                          ↓
Plan lives in context window          JS runtime · orchestrator
Every intermediate result                 ↓
stays in context                      agent × 16 concurrent (up to 1,000)
                                          ↓
Context limit approaches              verifier (refute findings)
Compaction triggered                      ↓
                                      iterate until converged
                                          ↓
                                      Only converged answer returns to Claude
```

### Four things that matter
1. **Scale.** 16 concurrent agents, 1,000 total per workflow. Subagents max at handful. Agent Teams get messy past 5.
2. **Adversarial verification.** Agents tackle problem from independent angles, OTHER agents try to refute findings, system iterates until answers converge.
3. **Resumability.** Progress saves continuously. Interrupted jobs pick up where they left off. Agent Teams die with the session.
4. **Zero orchestration burden.** You describe the goal. Claude decides how to split work, how many agents to spawn, how to verify.

### Activation
- Requires Claude Code v2.1.154+
- On by default for Max / Team plans
- Enterprise: admin enables
- Pro: toggle in `/config`
- Trigger: say "create a workflow" OR set `/effort ultracode`

### When to use
- Tasks too big for one session (large refactors, codebase-wide audits, multi-domain research)
- Work that benefits from adversarial verification (don't just generate, refute)
- Long-running jobs you can't babysit

### When NOT to use
- Anything that fits in a single agent (you'll pay 100x in tokens for no quality gain)
- Narrow, deep tasks (the verification overhead doesn't help)
- First few weeks of Claude Code usage (calibrate token spend on smaller tasks first)

### Best practices
1. Start with a SCOPED task to calibrate token usage
2. Enable auto mode so Claude decides when a workflow is appropriate
3. Use `/effort ultracode` to let Claude auto-trigger
4. Review the execution plan on first trigger — a poorly scoped prompt fans out agents unnecessarily

---

## Paradigm 4b — Swarms (Kimi K2.6, alternative vendor)

Kimi Agent Swarm is the same shape as Dynamic Workflows from a different vendor. 300 sub-agents in parallel, 4,000 coordinated steps, auto-recovery, returns a folder of finished files at the end.

Mechanism:
- Orchestrator reads request, breaks down, decides spawn count
- Each worker gets ITS OWN scoped memory at spawn (this is the key — no shared desk that fills up)
- Workers share ONE operational space for what they all need
- Auto-recovery for stalled workers (treats failure as routine)
- Returns a finished folder of artifacts

Vendor claim: ~4.5x speedup, ~80% reduction in end-to-end runtime vs single agent on wide tasks.

The pattern matters more than the vendor. Anthropic Dynamic Workflows or Kimi Swarms — same shape.

---

## The decision tree

```
Is the task wide and shallow (50+ independent sub-tasks)?
├─ YES → Need parallel
│   ├─ Are sub-tasks truly independent (no comm needed)?
│   │   ├─ YES, small scale (5-20)    → SUBAGENTS
│   │   └─ YES, massive scale (50+)   → DYNAMIC WORKFLOWS / SWARMS
│   └─ Sub-tasks need to coordinate?
│       └─ YES → AGENT TEAMS (3-5 peers, shared task list)
└─ NO → narrow and deep
    └─ Fits in one context window?
        ├─ YES → SINGLE AGENT
        └─ NO  → Break into smaller single-agent runs, chain manually
```

---

## The 5 orchestration patterns (apply to ANY paradigm)

1. **Prompt chaining** — sequential, each call processes previous output. Use when order matters.
2. **Routing** — classifier sends task to specialized handler. Easy questions → cheap fast model. Hard questions → capable model. Keeps costs from exploding.
3. **Parallelization** — independent subtasks run simultaneously. Voting (same task, multiple times) or sectioning (different tasks, same time).
4. **Orchestrator-worker** — central agent breaks down, delegates, synthesizes. THE dominant architecture for production systems.
5. **Evaluator-optimizer** — one agent generates, another evaluates and provides feedback in a loop. Quality > speed.

---

## The first-principles design rule

**Decompose by CONTEXT, not by ROLE.**

The intuitive mistake: split by role (planner / implementer / tester). It feels organized. It creates a TELEPHONE GAME where information degrades at every handoff.
- The implementer doesn't have what the planner knew
- The tester doesn't have what the implementer decided
- Quality drops at every boundary

The right mental model: **context-centric decomposition.**

Ask: what context does this subtask actually need? If two subtasks need deeply overlapping information, they probably belong to the SAME agent. Only split when context can be genuinely isolated.

Example: An agent implementing a feature should ALSO write the tests for that feature. It already has the context. Splitting them creates a handoff problem that costs more than the parallelism saves.

The 4-agent pipeline gets around this by using FILE HANDOFFS to make the context explicit — each next agent reads everything the previous agents wrote.

---

## The 3 failure modes (memorize these)

### 1. Vague task descriptions
Agents duplicate each other's work. Two researchers research the same thing, neither notices. Fix: every agent needs a clear objective, expected output format, tool/source guidance, AND explicit boundaries on what NOT to cover.

### 2. Verification agents declare victory without verifying
"All tests pass" but the tests don't cover the spec. Fix: explicit, concrete instructions — "run the full test suite, cover these specific cases, do not mark as complete until each passes." Vague approval criteria produce false positives.

### 3. Token costs compound faster than you expect
Multi-agent runs can be 10-100x single-agent cost. Fix:
- Use most capable model only where it matters (Planner = Opus, Coder = Sonnet, etc.)
- Route routine work to faster cheaper models
- Build budget controls so costs can't run away

---

## When to use multi-agent (the strict criteria)

Multi-agent earns its cost in EXACTLY 3 situations:

1. **Context protection** — a subtask generates info irrelevant to the main task. Keeping it in a subagent prevents context bloat.
2. **True parallelization** — independent research/search that benefits from simultaneous coverage.
3. **Specialization** — task requires conflicting system prompts, OR one agent juggling so many tools its performance degrades.

When to NOT use multi-agent:
- Agents constantly need to share context (handoff cost > parallelism gain)
- Inter-agent dependencies create more overhead than execution value
- Task is simple enough that one well-prompted agent handles it

---

## The one design principle that matters

**Start with a single agent. Push it until you find where it breaks. That failure point tells you EXACTLY what to add next.**

Most multi-agent designs fail because someone added complexity BEFORE measuring whether it was needed. Better prompting on a single agent often beats elaborate multi-agent pipelines.

Add complexity only where it solves a real, measured problem.

---

## What's in this kit

| You want to... | Look at |
|----------------|---------|
| Build a content team (single-shot handoff) | `03_agent_team/` (the original 4-agent manual pipeline) |
| Build a coding team (automated handoff) | `03_agent_team/automated_pipeline/` (Planner/Coder/Tester/Reviewer + `/ship` command) |
| Run Claude Council (5-advisor decision) | `02_prompt_library/07_council_skill.md` |
| Learn the Claude Code commands | `02_prompt_library/06_claude_code_commands.md` |

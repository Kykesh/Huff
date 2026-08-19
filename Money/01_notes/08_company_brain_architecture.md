# Company Brain Architecture — The 6-Layer Operating Stack

## The reframe that changes everything

Most "AI for business" thinking starts with: more memory = smarter AI. That's wrong.

The Single Grain case study (500K+ tokens of persistent memory, 90+ daily crons, 2,862 Gong transcripts converted into operational playbooks) makes the shift explicit:

**Memory is the raw material. Retrieval is the operating layer.**

Your company already has a brain. It's scattered across Slack, Gong, HubSpot, SOPs, and someone who's out today. The value isn't a giant folder of company knowledge — every company already has that. The value is the **intelligence layer that sits between context and work**.

## The broken loop most companies run

```
Call transcript
     ↓
Random notes
     ↓
Human remembers
     ↓
Agent starts cold
     ↓
Human re-explains
```

The human becomes the router. Every agent output depends on whether someone remembered the right call, copied the right note, pasted the right context, corrected the same mistake for the fifth time. This doesn't scale.

## The working loop

```
Calls ─────┐
CRM ───────┼──► Retrieval ─► Agent ─► Work
SOPs ──────┤        ▲          │
Slack ─────┘        │          ▼
             Human correction ─► Rule
```

One change: corrections become rules instead of one-time fixes. That single feedback loop is what makes the system compound.

---

## The 6 layers (top to bottom is human-facing to raw input)

```
┌──────────────┐
│  Execution   │ ← agents do real work in real workflows
├──────────────┤
│  Feedback    │ ← corrections become rules
├──────────────┤
│  Permission  │ ← who can see what, when
├──────────────┤
│ Source Truth │ ← which source wins when they conflict
├──────────────┤
│  Retrieval   │ ← the right context for the task in front of the agent
├──────────────┤
│   Capture    │ ← calls, CRM, Slack, SOPs, docs
└──────────────┘
```

Skip a layer, break the system. Each one depends on the one below it.

---

## Layer 1 — Capture

**Job:** Collect high-signal raw material from all key sources. Always growing.

**What flows in:** Recorded meetings, call transcripts, Slack threads, docs/briefs/wiki, CRM activity, content decisions, internal SOPs, agent outputs, daily logs, human corrections.

**The trap:** Most teams stop here. They record meetings, transcribe calls, save threads, dump into a vector DB — and call it a brain. That's a storage unit, not a brain. A storage unit:
- Doesn't make decisions
- Doesn't prioritize
- Doesn't know what's stale
- Doesn't know what's sensitive
- Can't resolve conflicts when sources disagree

**The 7 operating rules:**
1. Capture high-signal inputs, NOT everything
2. Preserve source links and provenance
3. Track timestamp and owner
4. Mark sensitivity and access level
5. Weigh sources when they conflict (Layer 3 problem)
6. Refresh or deprecate stale facts
7. Route human corrections back into the system (Layer 5 problem)

**Goal:** Collect high-signal raw material, not just more data. The point is to make the work surface smarter every week — not to hoard.

---

## Layer 2 — Retrieval

**Job:** Pull the 6 pieces of context that matter for the task in front of the agent. NOT the entire history.

**The killer insight:** An agent doesn't need the entire history of the company. It needs the right context for the task.

Examples by task:

**Outbound email:** ICP + offer + objections + prior campaign performance + brand voice + current campaign goal.

**Pipeline review:** Deal stage changes + stalled accounts + recent call notes + objections + next steps + what the CRM says now.

**Content writing:** Actual POV + recent performance + approved claims + examples already used + article's proof layer.

**The trap:** Many AI systems look smart in demos because context is hand-fed. They fall apart in production because nobody built the retrieval layer. Context dumping ≠ retrieval. Symptoms:
- Retrieving everything creates noise
- Irrelevant context weakens outputs
- Stale notes can beat current truth
- Hand-fed demos hide the problem
- Production fails when retrieval is missing

**The 7 operating rules:**
1. Retrieve for the task, NOT the archive
2. Return the smallest useful context set
3. Rank by relevance, freshness, source quality
4. Preserve provenance and direct links
5. Respect permissions and sensitivity
6. Prefer current system state over stale notes
7. Use outcomes and human feedback to tune ranking

**Goal:** The right context for the task. Not more information — more relevance.

---

## Layer 3 — Source Truth

**Job:** Decide which source wins when sources disagree.

**The killer insight:** If you don't decide which source wins, your agents become confident liars with better formatting.

**Common competing sources:** Sales call notes, CRM field (current system state), Slack correction, old SOP, newest weekly report, founder voice note.

**Source classes (in order of authority):**
1. **Live truth** — current system state (e.g., what the CRM says right now)
2. **Historical context** — what was true 6 months ago
3. **Inspiration** — patterns from past wins (learn FROM, don't quote)
4. **Restricted / non-public** — block from public outputs entirely
5. **Pattern input, not quotable** — informs style, not claims

**The trap:** More sources ≠ more truth. Symptoms:
- Stale docs can override current reality
- Inspiration can leak into claims
- Restricted sources should not appear in public content
- Unranked conflicts create false confidence
- The best-formatted source is not always the true source

**The 7 operating rules:**
1. Define source hierarchy BEFORE generation
2. Prefer live system truth over stale documentation
3. Separate historical context from current truth
4. Mark restricted sources and block them from public use
5. Let inspiration inform patterns, not direct claims
6. Preserve provenance — show which source won
7. Update hierarchy rules when humans correct the system

**Goal:** Trusted answers from the right source. The point isn't to retrieve more information — it's to answer with accurate, source-aware truth.

---

## Layer 4 — Permissions

**Job:** Know what a task is ALLOWED to use before generating answers.

**The killer insight:** Company intelligence gets dangerous when every agent can see everything.

**Different contexts living near each other:**
- Client context
- Internal context
- Prospect context
- Financial context
- Strategy context
- Leadership notes
- HR details
- Approved public materials

**What agents should NOT see:**
- Marketing agent ≠ private HR details
- Content agent ≠ client financials
- Sales agent ≠ every leadership note

Each workflow should see ONLY what it needs.

**The trap:** Access ≠ permission. Symptoms:
- More context can increase risk
- The closest source may still be off-limits
- Mixed workspaces create accidental leakage
- Over-restricting everything makes the system useless
- Permission design is part of product quality

**The 7 operating rules:**
1. Define access at the workflow level
2. Check permissions before retrieval AND generation
3. Separate client, internal, and financial context
4. Block sensitive material from workflows that don't need it
5. Use least-privilege access, NOT open access by default
6. Log what sources were used and why they were allowed
7. Update permission rules as workflows and teams evolve

**Goal:** Not one big brain with no walls. The right brain for the right workflow.

---

## Layer 5 — Feedback Loops

**Job:** Turn every human correction into a future system rule.

**The killer insight:** Without feedback loops, you're just babysitting software. With feedback loops, every correction becomes a training rep for the whole operating system.

**The loop:**
1. Agent takes action (drafts outbound email)
2. Human reviews (sees issues, risks, gaps)
3. Human corrects (edits tone, removes unsafe claim, adds missing context)
4. System captures the SIGNAL (tagged by type, source, workflow, severity)
5. System updates the right LAYER (voice rule, source rule, pipeline scan, workflow rule)

Loop repeats. System gets smarter.

**5 areas that improve over time:**

| Area | Example improvement |
|------|---------------------|
| Voice & tone | "Too stiff → more human, specific, conversational" |
| Source rules | "Cites outdated doc → rule updates to favor newer sources" |
| Content quality | "Missing stat → require proof layer for all content" |
| Pipeline intelligence | "Missed risk signal → pipeline scan learns new pattern" |
| Workflow routing | "Routed to wrong team → routing rule updates for future tasks" |

**The 5 operating rules:**
1. Capture EVERY correction
2. Structure the signal (feedback without structure is noise — tag by type, workflow, source, severity)
3. Update the right layer (not every correction is a content tweak; some change rules, retrieval, permissions, or source truth)
4. Improve continuously (small updates constantly > big updates rarely)
5. Humans set the standard (the system learns the quality of its answers from the quality of your feedback)

**The compounding effect:**
Correction today → Better behavior tomorrow → Better outcomes this week → Smarter company next quarter.

---

## Layer 6 — Execution

**Job:** Deliver value inside REAL workflows, not isolated tasks.

**Broken vs working:**

| Layer | Broken | Working |
|-------|--------|---------|
| Capture | Notes scattered everywhere | Calls / CRM / Slack / SOPs structured intake |
| Retrieval | Human finds context manually | Agent pulls relevant chunks at runtime |
| Source Truth | AI trusts stale docs | Freshness + hierarchy decide what wins |
| Permissions | Everyone sees everything | Access depends on workflow |
| Feedback | Corrections disappear | Corrections become rules |
| Execution | AI drafts isolated tasks | Agents ship inside real workflows |

**Goal:** Work gets done with context, proof, and fewer cycles.

---

## The 6-question workflow audit

Before automating any workflow, answer all 6 honestly. If you can't, you'll just make the mess faster.

1. **What sources does this workflow depend on?**
2. **Which source is the truth when they conflict?**
3. **What context is ALWAYS required for this workflow?**
4. **What context should NEVER be used?**
5. **What human corrections happen repeatedly?**
6. **How does one correction become a future rule?**

If you can't answer those, you're not ready to automate the workflow. Run it manually for 2 weeks first, journal the answers, then automate.

---

## The compounding outcomes

When the 6 layers are wired correctly:

- **Faster decisions** — move with context, not guesswork
- **Cleaner handoffs** — less re-explaining
- **Better agent outputs** — relevant, accurate, with proof
- **Less context switching** — stay in flow, ship faster
- **Fewer repeated corrections** — fix once, system remembers
- **Company gets harder to forget** — institutional memory becomes a moat

## How this connects to the rest of the kit

| Kit module | Relationship to Company Brain |
|------------|-------------------------------|
| `05_memory_vault/` | YOUR personal version of Layer 1 + Layer 2 (capture + retrieval) |
| `03_agent_team/` | An execution layer that runs on top of the brain |
| `02_prompt_library/` | A pre-curated library, not a brain yet — turns into one when paired with feedback loops |
| `04_youtube_starter_kit/` | A vertical workflow that needs its own scoped retrieval and source truth |

Start with the Memory Vault (your Layer 1+2). Then add agent teams (Layer 6). Then layer in source truth, permissions, and feedback as the system grows.

The brain isn't built in a weekend. It's built one workflow at a time, with the 6-question audit gating each addition.

# Claude Council — 5-Advisor Decision Skill

## Why this exists

Stanford research found Claude agrees with you 49% more than a real human would. Ask "should I launch this product?" and you'll get 5 reasons why you should. Ask "is this a bad idea?" and you'll get 5 reasons why it is. Same product, opposite answers, all confidently delivered.

For low-stakes work (drafting emails), that bias is fine. For decisions where being wrong is expensive, it's dangerous.

The Council forces 5 different thinking styles onto the same question, then makes them peer-review each other anonymously. You get one recommendation you can actually trust.

This is built on Andrej Karpathy's LLM Council pattern — instead of polling multiple models, this version uses sub-agents with different mental frames inside a single Claude session.

---

## The 5 advisors

### 1. The Contrarian
**Question:** What could fail?
**Job:** Assume your idea has a fatal flaw and try to find it. If everything looks solid, dig deeper.
**Catches:** The "this sounds great but have you thought about..." gaps you skip when you're excited.

### 2. The First Principles Thinker
**Question:** What problem are we really solving?
**Job:** Ignore your question. Strip assumptions. Rebuild the problem from the ground up.
**Catches:** "You're optimizing the wrong variable entirely" — which happens more than you'd think.

### 3. The Expansionist
**Question:** What upside are we missing?
**Job:** Hunt for the bigger play hiding next to your question.
**Catches:** "You're thinking too small."

### 4. The Outsider
**Question:** Does this make sense to someone new?
**Job:** Zero context about you, your field, or your history. Responds purely to what's in front of them.
**Catches:** Curse of knowledge — things obvious to you that are invisible to your customers.

### 5. The Executor
**Question:** What would you actually do Monday morning?
**Job:** Cares only about whether there's a clear first step.
**Catches:** Brilliant plans with no path to actually doing them — which is most of them.

---

## The full process

```
1. You ask: "council this" + your question + full context

2. All 5 advisors respond IN PARALLEL (each with isolated context)

3. Responses are anonymized — shuffled so reviewers don't know
   which advisor wrote which response

4. The 5 reviewers each read all 5 responses and answer:
   a. Which response is strongest? Why?
   b. Which has the biggest blind spot?
   c. What did ALL FIVE miss?

5. A Chairman agent reads everything (responses + reviews) and
   synthesizes the final verdict:
   - Best recommendation
   - Biggest blind spot
   - What everyone missed
   - One concrete next step
```

That last question — "what did all 5 miss?" — is the most valuable. The peer-review round consistently catches things no individual advisor saw.

---

## The skill file (drop into `.claude/skills/council/SKILL.md`)

```markdown
---
name: council
description: Run a 5-advisor decision council. Trigger phrase "council this" followed by a question. Returns a synthesized verdict with one concrete next step. Use for high-stakes decisions where Claude's default agreeableness would be dangerous.
---

# Council Skill

When the user says "council this" plus a question:

## Stage 1 — Spawn 5 advisors IN PARALLEL

Use subagents in parallel. Each gets its own context window with ONLY:
- The user's question
- Any relevant context the user provided
- Their advisor identity (Contrarian / First Principles / Expansionist / Outsider / Executor)

### Advisor prompts

**Contrarian:**
"Your job is to find what will fail. Assume the user's plan has a fatal flaw and find it. Don't be polite. Be specific. List 3-5 specific failure modes ranked by probability."

**First Principles:**
"Ignore the user's question. Ask: what problem are they actually trying to solve? Strip all assumptions. Rebuild the problem from the ground up. Output: (1) the real problem, (2) the real options, (3) why the user's framing might be misleading them."

**Expansionist:**
"Hunt for upside the user is missing. What could be 10x bigger here? What adjacent opportunity is sitting next to this question that they haven't noticed? Push hard against small thinking."

**Outsider:**
"You have ZERO context about the user, their field, or their history. Respond only to what's in front of you. What's confusing? What's missing? What would a stranger trying to decide this not understand?"

**Executor:**
"Cares about only one thing: what does the user do Monday morning? If the question is abstract, demand specifics. If the plan has no first step, say so. Output: the concrete first action, or 'no clear first step — needs more definition.'"

## Stage 2 — Anonymize and peer-review

Once all 5 responses are back:
1. Label them A, B, C, D, E in random order (so reviewers don't know who wrote what).
2. Spawn 5 reviewer subagents. Each reads all 5 anonymized responses.
3. Each reviewer answers:
   - Which response (A-E) is strongest? Why?
   - Which response has the biggest blind spot? What is it?
   - What did all 5 miss?

## Stage 3 — Chairman synthesis

The main agent (not a subagent) reads:
- All 5 original advisor responses
- All 5 peer reviews

Then writes the verdict:

```markdown
# Council Verdict

## The decision in front of you
[Restate the question in clear terms]

## Best recommendation
[The action to take, in 2-3 sentences]

## Why
[1-2 paragraphs synthesizing the strongest reasoning from the advisors]

## Biggest blind spot
[What the council collectively almost missed]

## What everyone missed
[The insight from the "what did all 5 miss" reviewer round]

## One concrete next step
[Specific action you can take in the next 24 hours]

## Confidence
[High / Medium / Low — with one sentence on what would change it]
```

## Failure modes to avoid

- Letting any advisor know what the others said (defeats the parallelism)
- Skipping the anonymization (reviewers will give deference to "famous" advisors)
- Letting the Chairman re-introduce Claude's default agreeableness
- Calling this for low-stakes decisions (it's expensive — save it for real forks)

## When NOT to use the Council

- If you already know the answer and just want validation, skip it.
- If the decision is reversible in 5 minutes, don't bother.
- If the question is "what should I do today?" — too vague, council needs a specific decision.
```

---

## How to install

### Option A: Cowork
1. Customize → Skills → Add skill
2. Paste the name `council` and description from the skill file above
3. Paste the body
4. Save

### Option B: Claude Code
1. Create `.claude/skills/council/SKILL.md` in your repo
2. Paste the skill file
3. Claude auto-loads it when you say "council this"

### Option C: Claude Desktop project
1. New Project → Custom Instructions
2. Paste the skill content
3. Every chat in this project has the council available

---

## When to council something

The council pays off when:
- Being wrong is expensive
- You keep going back and forth
- You've asked Claude already and the answer felt too reasonable
- The cost of waiting another day is small

Examples:
- "Should I niche down further or broaden my audience?"
- "Should I hire a VA or build the automation?"
- "Am I leaving money on the table at this price?"
- "Should I launch as a workshop or self-paced course?"
- "Should I pivot the product based on this user feedback or hold the line?"

Skip the council when:
- You already know the answer
- The decision is small and easily reversed
- The question is more brainstorm than decision

---

## The honest expectation

The council will tell you things you might not want to hear. That's the point. If you're going to override the verdict, do it consciously — at least you'll know what you're overriding.

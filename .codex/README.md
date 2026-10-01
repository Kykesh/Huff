# Codex agents — Huff and Gojo

Created September 23, 2026 at Kyle's explicit request, beside the existing
Claude folders. These are reusable Gojo role definitions, not running workers.

Four matching TOMLs are stored in both locations:

- `Huff/.codex/agents/` — available to a Codex workspace rooted at Huff.
- `Huff/Gojo/trading_personal/.codex/agents/` — Gojo development project copy.

`Gojo/trading_personal` is the canonical application-side copy. Update both copies
in the same reviewed packet; matching filenames must retain identical bytes.
No copies were added to staging, production or the global home configuration.
The Gojo parent itself has no corresponding Claude folder; this mirrors the
two actual existing Claude locations.

| File / role | Responsibility | File-configured default |
| --- | --- | --- |
| chief-architect.toml | Scope, architecture and doctrine-to-interface design | read-only |
| infrastructure-builder.toml | Approved implementation in an isolated worktree | workspace-write |
| integration-tester.toml | Independent source/caller/test review | read-only |
| deployment-operator.toml | Release and recovery evidence; never autonomous deployment | read-only |

All profiles inherit model selection; no model, concurrency, hook, provider or
global configuration override was added. These remain Gojo roles even when
visible in Huff; they do not authorize changes in unrelated projects.
Role memory must be private and explicitly supported, never pooled or silently
borrowed from Claude. This folder does not provision a memory database.

Source lineage: `codex/native-roles-20260910` at
`30edbb29329b4011bea2319c0fdb3ae61ee1bc88`, updated for the current roster-independent
preservation wording, workspace boundaries, per-agent memory law and loop contract.
The old candidate remains in Git unchanged.

The project charter and task envelope remain authoritative. A saved file is not
proof it was discovered or invoked, an independent approval, an increase in this
session's concurrent worker capacity, or a running background service.
Current parent/runtime permissions can override a file's sandbox default.
The shared `docs/AGENT_ROSTER.json` still needs the separately reviewed Codex
hash/status revision; it was deliberately not silently re-pinned in this setup.

Official format:
[OpenAI subagent documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents).
Setup/review handoff: Gojo `docs/BRIDGE_TASKS.md`, C227.

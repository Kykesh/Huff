# Folder Structure — the Content Factory

```
~/content-factory/
├── CLAUDE.md
├── context.md
├── agents/
│   ├── 01_research_agent.md
│   ├── 02_outline_agent.md
│   ├── 03_writer_agent.md
│   └── 04_editor_agent.md
├── Research/
│   └── [topic-name]-research.md     ← Agent 1 output
├── Outlines/
│   └── [topic-name]-outline.md      ← Agent 2 output
├── Drafts/
│   └── [topic-name]-draft.md        ← Agent 3 output
└── Published/
    └── [topic-name]-final.md        ← Agent 4 output (the actual deliverable)
```

## Naming convention
ALWAYS use kebab-case for topic names. Example:
- `claude-memory-system-research.md`
- `claude-memory-system-outline.md`
- `claude-memory-system-draft.md`
- `claude-memory-system-final.md`

This means every artifact for the same topic can be found by typing the topic name.

## File lifecycle
1. Research Agent produces `Research/[topic]-research.md`
2. Outline Agent reads it, produces `Outlines/[topic]-outline.md`
3. Writer Agent reads both, produces `Drafts/[topic]-draft.md`
4. Editor Agent reads all three, produces `Published/[topic]-final.md`

## Why intermediate files matter
You can re-run any step without redoing the whole chain.
- Outline weak? Re-run Outline Agent against the existing Research.
- Draft has a tone problem? Re-run Writer with updated context.
- Final fell flat? Re-run Editor on the same Draft.

This is the difference between a content factory and one-shot AI writing.

# .pipeline/

Handoff files for the automated 4-agent pipeline. This folder starts empty. The agents populate it as they run:

| File | Created by | Read by |
|------|-----------|---------|
| `spec.md` | Planner | Coder, Tester, Reviewer |
| `changes.md` | Coder | Tester, Reviewer |
| `test-results.md` | Tester | Reviewer |
| `review.md` | Reviewer | You |

After a successful `/ship` run, all 4 files exist. You read `review.md` first, then drill into the others as needed.

## Should I commit this folder?

- For learning / standalone use: yes, see your full pipeline output.
- For real projects: probably no. Add `.pipeline/` to `.gitignore`. These are intermediate artifacts; the only artifact that matters in git history is the actual code change.

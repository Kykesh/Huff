# Gojo workspace

This directory is the single local home for Gojo's three operating roles. The
roles are linked Git worktrees of the same `trading-os` repository; they are not
three copies to merge manually.

| Folder | Role | Expected Git state |
| --- | --- | --- |
| `trading_personal/` | integration and development | `personal`, may contain reviewed pending work |
| `gojo_stage/` | promotion rehearsal | detached, clean between rehearsals |
| `gojo_prod/` | frozen production | detached at the production pin; only named runtime/model artifacts may be dirty |
| `../trading-os/` | core/main worktree and shared Git metadata | `main`, clean unless mainline work is intentional |

All four worktrees fetch and push through
`https://github.com/Kykesh/trading-os.git`. The surrounding `Huff` workspace is
a different repository with remote `https://github.com/Kykesh/Huff.git`; it
tracks this README and the workspace descriptor, but deliberately ignores the
nested worktree contents so Git history is never duplicated.

## See every Source Control repository

In Visual Studio Code, open `Gojo.code-workspace`, not the plain `Gojo/`
container. The workspace explicitly registers personal, stage, production, and
core as four repositories.

In the ChatGPT desktop app's Codex view, add a local project with the exact
`trading_personal`, `gojo_stage`, and `gojo_prod` folders. Git controls belong to
each local project/worktree, so a project still pointing to the former absolute
path cannot follow the move automatically.

Pending development changes belong only in `trading_personal`. They should not
also appear in `gojo_prod`; production receives a reviewed exact commit only
through the promotion workflow. To audit all roles without changing anything:

```bash
./workspace-status.sh
```

Never stage the outer `Gojo/` tree recursively, copy personal files into
production, or run `git add .` from the `Huff` repository.

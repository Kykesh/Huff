# Gojo inside the Huff workspace

Keep **Huff** open as the main Visual Studio Code workspace. It contains all of
Kyle's projects; Gojo has priority, and the other projects remain available for
reference and deliberate reuse. No project needs to be moved into Gojo or
removed from Huff to work this way.

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

In Visual Studio Code, keep the existing **Huff** window open, or open the
`/Users/kylehuffsr./Documents/GitHub/Huff` folder. Its `.vscode/settings.json`
explicitly discovers the three repositories under `Gojo/` and the core
`trading-os/` repository alongside Huff itself. The Source Control Repositories
view supports selecting multiple repositories so their pending changes can be
shown together. Explorer keeps the actual `Huff/Gojo/<role>` folder hierarchy
and the other Huff projects.

`Gojo.code-workspace` is an optional focused view of those same worktrees. Its
named top-level entries are display aliases, not different folders or copies.
That is why its Explorer looks different; it is not the preferred workspace
and is not required for Gojo development or Source Control visibility.

Pending development changes belong only in `trading_personal`. They should not
also appear in `gojo_prod`; production receives a reviewed exact commit only
through the promotion workflow. To audit all roles without changing anything:

```bash
./Gojo/workspace-status.sh
```

Never stage the outer `Gojo/` tree recursively, copy personal files into
production, or run `git add .` from the `Huff` repository.

## Current documentation for every Gojo environment

Start with the October4 [complete Git-visible file/folder lookup](trading_personal/docs/structure/current/README.md)
and [physical folder boundaries](trading_personal/docs/structure/current/ROOTS.md).
These distinguish current checkout membership from historical semantic reviews,
ignored/private payloads, installed state and release acceptance.

The [project asset register](trading_personal/docs/structure/current/assets/README.md)
adds physical accounting beyond Git: ignored/hidden files, empty folders, SSD
datasets, retained candidates, core/main and shared configuration, with explicit
ownership routes and backup/recovery gaps. It is not a backup or cleanup license.

The [environment documentation hub](trading_personal/docs/structure/environments/README.md)
provides the full, separately versioned sets:

- [Development: current project index](trading_personal/docs/DOCS_INDEX.md).
- [Stage: current identity, catalog and links to dated deep guides](trading_personal/docs/structure/current/STAGE.md).
- [Production: current identity, catalog and links to dated deep guides](trading_personal/docs/structure/current/PRODUCTION.md).

These role-specific guides are maintained centrally in the working documentation.
They describe the actual versions inspected, not three identical environments.
Their existence does **not** mean they have been committed or published into
stage/production. Follow the [refresh/publication contract](trading_personal/docs/structure/environments/REFRESH.md);
no direct copying into frozen roles or automatic synchronization is enabled.

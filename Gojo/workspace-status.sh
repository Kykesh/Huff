#!/usr/bin/env bash
set -euo pipefail

workspace_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"

show_worktree() {
  local label="$1"
  local path="$2"
  local head branch remote upstream counts

  head="$(git -C "$path" rev-parse --short=12 HEAD)"
  branch="$(git -C "$path" symbolic-ref --quiet --short HEAD || printf '%s' '(detached)')"
  remote="$(git -C "$path" remote get-url origin 2>/dev/null || printf '%s' '(no origin)')"
  upstream="$(git -C "$path" rev-parse --abbrev-ref --symbolic-full-name '@{upstream}' 2>/dev/null || printf '%s' '(none)')"
  counts="$(git -C "$path" status --short --untracked-files=all | awk '
    BEGIN { modified = 0; untracked = 0; staged = 0 }
    /^\?\?/ { untracked += 1; next }
    {
      modified += 1
      if (substr($0, 1, 1) != " ") staged += 1
    }
    END {
      printf "modified=%d untracked=%d staged=%d total=%d", modified, untracked, staged, modified + untracked
    }
  ')"

  printf '%-12s %s\n' "$label" "$path"
  printf '  branch=%s head=%s upstream=%s\n' "$branch" "$head" "$upstream"
  printf '  origin=%s\n' "$remote"
  printf '  %s\n' "$counts"
}

show_worktree personal "$workspace_root/trading_personal"
show_worktree stage "$workspace_root/gojo_stage"
show_worktree production "$workspace_root/gojo_prod"
show_worktree core "$workspace_root/../trading-os"

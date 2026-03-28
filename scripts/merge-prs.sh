#!/usr/bin/env bash
set -euo pipefail

REPO="launchapp-dev/postpilot"
PROJECT_ROOT="$(git rev-parse --show-toplevel)"
QUEUED_REVIEW=0
QUEUED_REBASE=0
SKIPPED=0

prs=$(gh pr list --repo "$REPO" --state open --json number,title,mergeable --jq '.[] | "\(.number)\t\(.title)\t\(.mergeable)"')

if [ -z "$prs" ]; then
  echo "No open PRs found."
  exit 0
fi

git fetch origin main --quiet 2>/dev/null || true

while IFS=$'\t' read -r pr_num title mergeable; do
  task_num=$(echo "$title" | grep -oE '[0-9]+' | head -1)
  [ -z "$task_num" ] && continue
  task_id=$(printf 'TASK-%03d' "$task_num")

  already_queued=$(ao --project-root "$PROJECT_ROOT" queue list --json 2>/dev/null | grep -c "$task_id" || true)
  if [ "$already_queued" -gt 0 ]; then
    echo "SKIP $task_id — already in queue"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi

  if [ "$mergeable" = "CONFLICTING" ]; then
    echo "REBASE $task_id (PR #$pr_num conflicting)"
    ao --project-root "$PROJECT_ROOT" queue enqueue --task-id "$task_id" --workflow-ref rebase-and-retry 2>/dev/null || true
    QUEUED_REBASE=$((QUEUED_REBASE + 1))
  else
    echo "REVIEW $task_id (PR #$pr_num)"
    ao --project-root "$PROJECT_ROOT" queue enqueue --task-id "$task_id" --workflow-ref pr-reviewer 2>/dev/null || true
    QUEUED_REVIEW=$((QUEUED_REVIEW + 1))
  fi
done <<< "$prs"

echo ""
echo "Summary: review=$QUEUED_REVIEW rebase=$QUEUED_REBASE skipped=$SKIPPED"

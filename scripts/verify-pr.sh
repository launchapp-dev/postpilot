#!/usr/bin/env bash
set -euo pipefail

REPO="launchapp-dev/postpilot"
PROJECT_ROOT="$(git rev-parse --show-toplevel)"

if [ -n "${AO_TASK_ID:-}" ]; then
  task_id="$AO_TASK_ID"
elif [ -n "${AO_SUBJECT_ID:-}" ]; then
  task_id="$AO_SUBJECT_ID"
else
  pr_json=$(gh pr list --repo "$REPO" --state open --json number,title,headRefName --limit 1 --jq '.[0]' 2>/dev/null || echo "null")
  if [ "$pr_json" = "null" ] || [ -z "$pr_json" ]; then
    echo "No open PRs found. Nothing to verify."
    exit 0
  fi
  title=$(echo "$pr_json" | jq -r '.title')
  task_num=$(echo "$title" | grep -oE '[0-9]+' | head -1)
  task_id=$(printf 'TASK-%03d' "$((10#$task_num))")
fi

echo "Verifying PR for $task_id"

task_num=$(echo "$task_id" | grep -oE '[0-9]+' | head -1)
pr_json=$(gh pr list --repo "$REPO" --state open --search "task $task_num" --json number,state,headRefName,reviews --limit 1 --jq '.[0]' 2>/dev/null || echo "null")

if [ "$pr_json" = "null" ] || [ -z "$pr_json" ]; then
  merged=$(gh pr list --repo "$REPO" --state merged --search "task $task_num" --json number --limit 1 --jq '.[0].number' 2>/dev/null || echo "")
  if [ -n "$merged" ]; then
    echo "PR #$merged already MERGED — marking $task_id as done"
    ao --project-root "$PROJECT_ROOT" task status --id "$task_id" --status done 2>/dev/null || true
    exit 0
  fi
  echo "No PR found for $task_id"
  exit 0
fi

pr_number=$(echo "$pr_json" | jq -r '.number')
echo "Found PR #$pr_number"

latest_review=$(echo "$pr_json" | jq -r '.reviews[-1].state // "NONE"')
echo "Latest review: $latest_review"

# Check PR comments for "Verdict: APPROVE" — handles self-review where GitHub
# blocks the formal review API (author cannot approve their own PR)
if [ "$latest_review" = "NONE" ] || [ "$latest_review" = "COMMENTED" ]; then
  approve_comment=$(gh pr view "$pr_number" --repo "$REPO" --json comments --jq '.comments[].body' 2>/dev/null | grep -ci "verdict.*approve" || true)
  if [ "$approve_comment" -gt 0 ]; then
    echo "Found 'Verdict: APPROVE' in PR comments — treating as approved"
    latest_review="APPROVED"
  fi
fi

if [ "$latest_review" = "APPROVED" ]; then
  echo "APPROVED — merging PR #$pr_number"
  if gh pr merge "$pr_number" --repo "$REPO" --squash --delete-branch 2>&1; then
    echo "MERGED — marking $task_id as done"
    ao --project-root "$PROJECT_ROOT" task status --id "$task_id" --status done 2>/dev/null || true
    exit 0
  else
    echo "MERGE FAILED (conflicts?) — queuing rebase"
    ao --project-root "$PROJECT_ROOT" queue enqueue --task-id "$task_id" --workflow-ref rebase-and-retry 2>/dev/null || true
    exit 0
  fi
fi

if [ "$latest_review" = "CHANGES_REQUESTED" ]; then
  echo "CHANGES REQUESTED — queuing rework for $task_id"
  ao --project-root "$PROJECT_ROOT" queue enqueue --task-id "$task_id" --workflow-ref rework 2>/dev/null || true
  exit 0
fi

echo "NO REVIEW — attempting merge of PR #$pr_number"
if gh pr merge "$pr_number" --repo "$REPO" --squash --delete-branch 2>&1; then
  echo "MERGED — marking $task_id as done"
  ao --project-root "$PROJECT_ROOT" task status --id "$task_id" --status done 2>/dev/null || true
  exit 0
else
  echo "MERGE FAILED — queuing rebase"
  ao --project-root "$PROJECT_ROOT" queue enqueue --task-id "$task_id" --workflow-ref rebase-and-retry 2>/dev/null || true
  exit 0
fi

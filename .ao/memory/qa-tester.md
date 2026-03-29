# QA Tester Run Log

Read this FIRST every run. Append your findings at the bottom.

## Format
Each entry: `[DATE] — RESULT — SUMMARY`

## Known Patterns
Track recurring failures here so you don't re-report them:

## Known Patterns

- **Unmerged branch pattern**: Tasks are regularly completed in local worktrees (ao/task-XXX) and marked "done" but never pushed to origin or merged to main. This has recurred every single run. TASK-010/018/021/026/035/047 were all created to address this. The fix (TASK-047) remains in backlog.
- **pnpm db:push not run after merges**: Every time schema-changing branches merge (TASK-022, TASK-031, TASK-033), the DB isn't updated — causing SqliteError crashes on dashboard/posts/calendar/analytics/campaigns. Pattern: merge → crash → TASK to run db:push.
- **AI gen always 500/401**: ANTHROPIC_API_KEY is set in .env but invalid — Anthropic API returns 401 authentication_error. As of run 10, raw 401 JSON is exposed directly to user in the UI.
- **Empty "done" branches**: Tasks are marked "done" but the ao/task-XXX branch contains ZERO unique commits (branch just points to a recent main commit). Seen with TASK-045/046/047/051 in run 10. The worktrees exist but no work was committed. Different from the "unmerged branch" pattern — here no work was done at all.

## Log

[2026-03-28 run 9] — FAIL — App state identical to run 8. No new commits to main. `/` 500 (BUG-015), /dashboard/posts/calendar/analytics 500 (BUG-016), /campaigns 500 (BUG-017), /accounts 404 (BUG-007). /posts/new + /settings + auth PASS. No new tasks created. Unmerged branches: ao/task-008/037/039/041. TASK-045/046/047 still in backlog.
[2026-03-29 run 10] — FAIL — TASK-050 (bulk actions) merged since run 9. All known bugs still present: `/` 500 (BUG-015), /dashboard/posts/calendar/analytics 500 (BUG-016), /campaigns 500 (BUG-017), /accounts 404 (BUG-007). Auth + /posts/new + /settings + /campaigns/new PASS. Bulk actions code merged but untestable (dashboard crashes). KEY FINDING: TASK-045/046/047/051 all marked "done" but their branches have ZERO unique commits — tasks were created, worktrees exist, but no code was ever committed. ao/task-008 still has the accounts fix (1 commit ahead of main) but has never been merged despite 8+ tasks created to merge it. No new tasks created.

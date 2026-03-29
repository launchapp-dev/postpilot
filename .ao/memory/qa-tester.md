# QA Tester Run Log

Read this FIRST every run. Append your findings at the bottom.

## Format
Each entry: `[DATE] — RESULT — SUMMARY`

## Known Patterns
Track recurring failures here so you don't re-report them:

## Known Patterns

- **Unmerged branch pattern**: Tasks are regularly completed in local worktrees (ao/task-XXX) and marked "done" but never pushed to origin or merged to main. This has recurred every single run. TASK-010/018/021/026/035/047 were all created to address this. The fix (TASK-047) remains in backlog.
- **pnpm db:push not run after merges**: Every time schema-changing branches merge (TASK-022, TASK-031, TASK-033), the DB isn't updated — causing SqliteError crashes on dashboard/posts/calendar/analytics/campaigns. Pattern: merge → crash → TASK to run db:push.
- **AI gen always 500**: ANTHROPIC_API_KEY is set in .env but invalid — Anthropic API returns 401 authentication_error, wrapped in HTTP 500 by the Next.js route. Has been failing since run 2.

## Log

[2026-03-28 run 9] — FAIL — App state identical to run 8. No new commits to main. `/` 500 (BUG-015), /dashboard/posts/calendar/analytics 500 (BUG-016), /campaigns 500 (BUG-017), /accounts 404 (BUG-007). /posts/new + /settings + auth PASS. No new tasks created. Unmerged branches: ao/task-008/037/039/041. TASK-045/046/047 still in backlog.

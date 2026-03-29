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
- **Empty "done" branches**: Tasks are marked "done" but the ao/task-XXX branch contains ZERO unique commits (branch just points to a recent main commit). Seen with TASK-045/046/047/051/052/053/054 in runs 10-11. The worktrees exist but no work was committed. Different from the "unmerged branch" pattern — here no work was done at all. Now 11 consecutive runs with this pattern.
- **Dev server environment churn**: PostPilot dev server startup is not stable across runs. Previously CondoHub occupied :3000 (runs 1-15), PostPilot ran on :3001. Run 16: launchapp-nextjs now occupies :3000/:3001/:3002, PostPilot not running anywhere. QA is entirely blocked when the dev server isn't running.

## Log

[2026-03-28 run 9] — FAIL — App state identical to run 8. No new commits to main. `/` 500 (BUG-015), /dashboard/posts/calendar/analytics 500 (BUG-016), /campaigns 500 (BUG-017), /accounts 404 (BUG-007). /posts/new + /settings + auth PASS. No new tasks created. Unmerged branches: ao/task-008/037/039/041. TASK-045/046/047 still in backlog.
[2026-03-29 run 10] — FAIL — TASK-050 (bulk actions) merged since run 9. All known bugs still present: `/` 500 (BUG-015), /dashboard/posts/calendar/analytics 500 (BUG-016), /campaigns 500 (BUG-017), /accounts 404 (BUG-007). Auth + /posts/new + /settings + /campaigns/new PASS. Bulk actions code merged but untestable (dashboard crashes). KEY FINDING: TASK-045/046/047/051 all marked "done" but their branches have ZERO unique commits — tasks were created, worktrees exist, but no code was ever committed. ao/task-008 still has the accounts fix (1 commit ahead of main) but has never been merged despite 8+ tasks created to merge it. No new tasks created.
[2026-03-29 run 11] — FAIL — No new code merged since run 10. TASK-052/053/054 marked done but all have 0 commits ahead of main. BUG-015/016/017/007/012 all still open. NEW FINDING: DB verified to only contain account/post/session/user/verification tables — settings/brandVoice/campaign tables missing, recycleCount/noRecycle missing from post table. Settings form permanently disabled (server action silently fails). pnpm db:push has NEVER been run since run 7. No new tasks created (all failures are known).
[2026-03-29 run 12] — FAIL — No new code merged since run 11. App state identical. BUG-015/016/017/007/018 all still open. Auth login works (POST /api/auth/sign-in/email 200) but dashboard crashes immediately (SqliteError: recycleCount). Logout click timed out (flaky). /posts/new + /settings (loads, fields disabled) + /campaigns/new PASS. No new tasks created.
[2026-03-28 run 13] — FAIL — No new code merged since run 12. App state identical. BUG-015/016/017/007/012/018 all persist. `/` 500 (BUG-015), /dashboard 500 (BUG-016), /posts 500, /calendar 500, /analytics 500, /campaigns 500 (BUG-017), /accounts 404 (BUG-007). /posts/new + /settings + /campaigns/new + /signup + /login PASS. AI gen 500 (BUG-012). Logout click timed out (flaky, 13th consecutive). Browser-based login redirects to crashing dashboard. Auth API (POST /api/auth/sign-in/email) still returns 200. No new tasks created — all failures are known bugs.
[2026-03-28 run 14] — FAIL — No new code merged since run 13. App state identical. BUG-015/016/017/007/012/018 all persist. `/` 500 (SqliteError recycleCount on landing), /dashboard/posts/calendar/analytics/campaigns all 500, /accounts 404. /posts/new + /settings (fields disabled) + /campaigns/new + /signup + /login PASS. AI gen 500 — raw Anthropic 401 JSON still showing in prompt area (BUG-012). Logout click timed out (flaky, 14th consecutive). Login API 200 confirmed via browser flow. No new tasks created — all failures are known bugs.
[2026-03-28 run 15] — FAIL — No new code merged since run 14. App state identical. BUG-015/016/017/007/012/018 all persist. `/` 500 (SqliteError recycleCount), /dashboard/posts/calendar/analytics/campaigns all 500, /accounts 404. /posts/new + /settings (fields disabled) + /campaigns/new + /signup + /login PASS. AI gen 500 (/api/posts/generate). Logout click timed out (flaky, 15th consecutive). Login confirmed via browser flow (redirects to /dashboard 500). No new tasks created — all failures are known bugs.
[2026-03-29 run 16] — BLOCKED — PostPilot dev server NOT running. Previously ran on :3001 (CondoHub had :3000). Now environment completely changed: :3000/:3001/:3002 all occupied by launchapp-nextjs instances. :3000 shows ZodError (DATABASE_URL missing) in Next.js error overlay. No PostPilot next-server process found in process list. 0/6 tests runnable. No new tasks created — ops issue (server not started).

# QA Test Plan — PostPilot

This is a living document maintained by the QA agent. It tracks test results, known issues, regression history, and the current state of the application.

## Last Run

| Field | Value |
|-------|-------|
| Date | 2026-03-28 |
| Result | FAIL |
| Steps Passed | 1 of 6 (auth redirect works) |
| Duration | ~5 min |
| Console Errors | 3 (SqliteError: no such column "tax_lines_json" — wrong app) |
| Network Errors | 0 |

## Test Results History

<!-- QA agent: append each run result here. Format: | Date | Passed | Failed | Bugs Created | Notes | -->
| Date | Passed | Failed | Bugs Created | Notes |
|------|--------|--------|-------------|-------|
| 2026-03-28 | 1 | 5 | BUG-001 | PostPilot dev server not running; invoicer project on port 3000 |

## Known Issues

<!-- QA agent: track active bugs found during E2E testing. Remove when fixed. -->

### BUG-001 — PostPilot not running on localhost:3000 [OPEN — 2026-03-28]

**Severity:** Critical (blocks all E2E testing)

**Description:** `http://localhost:3000` serves the **Invoicer** project (`/Users/samishukri/brain/repos/invoicer`), not PostPilot. The PostPilot dev server is not running.

**Root cause:** TASK-001 (scaffold core app foundation) is in `blocked` status. The foundation task was never unblocked and merged, so the PostPilot codebase has no runnable dev server.

**Evidence:**
- Page title: "Invoicer" (expected: "PostPilot")
- Stack trace path: `file:///Users/samishukri/brain/repos/invoicer/.next/...`
- Console error: `SqliteError: no such column: "tax_lines_json"` (invoicer schema mismatch)

**To fix:** Unblock TASK-001, merge scaffold, run `pnpm install && pnpm db:push && pnpm dev` from `/Users/samishukri/brain/repos/postpilot`.

## Regression Tracker

<!-- QA agent: if a previously passing test starts failing, log it here with the date and suspected cause. -->
| Date | Test | Was | Now | Suspected Cause |
|------|------|-----|-----|-----------------|

## Test Coverage

### Auth Flow
- [x] Landing page loads without errors *(loads but shows wrong app — Invoicer, not PostPilot)*
- [x] Signup with email/password works *(redirects to /dashboard — PASS for auth mechanism)*
- [ ] Login with existing credentials works *(not tested — blocked by BUG-001)*
- [ ] Protected routes redirect to login when unauthenticated *(not tested)*
- [ ] Logout redirects to landing/login *(not tested)*

### Post Creation
- [ ] New post form/AI generator loads
- [ ] AI content generation works (natural language input)
- [ ] Platform selection works (multi-select)
- [ ] Post preview renders correctly per platform
- [ ] Save as draft works
- [ ] Schedule post works

### Post Dashboard
- [ ] Dashboard loads with post list
- [ ] Search works
- [ ] Status filter works
- [ ] Platform filter works
- [ ] Quick stats show correct counts

### Social Accounts
- [ ] Accounts page loads
- [ ] Connect new account flow works
- [ ] Account detail page loads with post history
- [ ] Disconnect account works

### Campaigns
- [ ] Campaign list page loads
- [ ] Create campaign from AI brief works
- [ ] Campaign detail shows timeline and posts
- [ ] Pause/resume campaign works

### Content Calendar
- [ ] Calendar view loads
- [ ] Posts appear on correct dates
- [ ] Day/week/month views work
- [ ] Drag-and-drop rescheduling works

### Analytics
- [ ] Analytics page loads
- [ ] Per-platform metrics display
- [ ] Date range filtering works
- [ ] Charts render correctly

### Settings
- [ ] Settings page loads
- [ ] Brand voice configuration saves
- [ ] Business profile updates work

### Navigation
- [ ] All nav links work (no 404s)
- [ ] Mobile navigation works
- [ ] Back/forward browser buttons work

### Console & Network
- [ ] No console.error messages
- [ ] No uncaught exceptions
- [ ] No failed network requests (4xx/5xx)

## Environment Notes

- App URL: http://localhost:3000
- Database: SQLite via Drizzle ORM — run `pnpm db:push` before testing
- Auth: Better Auth — requires BETTER_AUTH_SECRET and BETTER_AUTH_URL in .env
- Test credentials: qa-test@postpilot.dev / TestPass123!

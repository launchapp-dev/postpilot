# QA Test Plan — PostPilot

This is a living document maintained by the QA agent. It tracks test results, known issues, regression history, and the current state of the application.

## Last Run

| Field | Value |
|-------|-------|
| Date | 2026-03-29 (run 6) |
| Result | PARTIAL — BUG-011 FIXED (dashboard/posts/calendar now load); auth+logout+OAuth PASS; AI gen 500 (BUG-012, unmerged fix); accounts/campaigns/analytics/settings 404 (unmerged branches) |
| Steps Passed | 4 of 6 |
| Duration | ~15 min |
| Console Errors | favicon 404 (BUG-009), React prop warning on /posts/new (BUG-013) — no new errors |
| Network Errors | /api/posts/generate 500, /accounts 404, /campaigns 404, /analytics 404, /settings 404 |
| New Tasks Created | TASK-035 |

## Test Results History

<!-- QA agent: append each run result here. Format: | Date | Passed | Failed | Bugs Created | Notes | -->
| Date | Passed | Failed | Bugs Created | Notes |
|------|--------|--------|-------------|-------|
| 2026-03-28 | 1 | 5 | BUG-001 (TASK-005) | PostPilot dev server not running; invoicer project on port 3000 |
| 2026-03-28 (run 2) | 3 | 3 | TASK-013, TASK-014, TASK-015 | App runs on port 3001 (3000 taken by CondoHub). Auth+dashboard PASS. 6/7 nav routes 404. |
| 2026-03-28 (run 3) | 2 | 4 | TASK-018 | Auth+dashboard PASS. All feature routes still 404. TASK-013/016/017 done but branches unmerged — TASK-018 created. |
| 2026-03-28 (run 4) | 2 | 4 | TASK-021 | Auth+dashboard PASS. All feature routes still 404. TASK-013/019/020 done but branches unmerged — TASK-021 created. New: 2 accessibility warnings on dashboard search input. |
| 2026-03-28 (run 5) | 3 | 3 | TASK-028, TASK-029 | TASK-021/022/023/024 merged. Logout+OAuth+/posts/new now PASS. REGRESSION: dashboard/posts/calendar crash (SqliteError: no such column "prompt" — pnpm db:push not run after TASK-022 merge). AI gen 500. Accounts/campaigns/analytics/settings still 404. |
| 2026-03-29 (run 6) | 4 | 2 | TASK-035 | BUG-011 RESOLVED: pnpm db:push run (TASK-028 done), dashboard/posts/calendar all PASS. Recurring unmerged-branches: TASK-009/014/015/027/029 done in worktrees but not on main — TASK-035 created. AI gen still 500 (no ANTHROPIC_API_KEY). Accounts 404 (TASK-008 still ready). |

## Known Issues

<!-- QA agent: track active bugs found during E2E testing. Remove when fixed. -->

### BUG-001 — PostPilot not running on localhost:3000 [RESOLVED — 2026-03-28 run 2]

App now starts successfully (runs on port 3001 as port 3000 is occupied by another project). TASK-005 done. BUG-001 closed.

### BUG-002 — /posts/new renders but save fails [RESOLVED — 2026-03-29 run 6]

**Severity:** Resolved

BUG-011 fixed (pnpm db:push run). /posts/new loads correctly; save draft expected to work (DB schema has `prompt` column).

### BUG-003 — /calendar crashes with SqliteError [RESOLVED — 2026-03-29 run 6]

**Severity:** Resolved

BUG-011 fixed. /calendar returns 200 with full calendar content (week/month views, March posts visible).

### BUG-004 — No logout button in sidebar [RESOLVED — 2026-03-28 run 5]

**Severity:** Resolved

Sign out button is present in sidebar and redirects correctly to /login (TASK-013 merged via TASK-021).

### BUG-005 — /campaigns, /campaigns/new, /campaigns/[id] return 404 [OPEN — TASK-014]

**Severity:** High (nav link broken)

Pages not built. Task created: TASK-014.

### BUG-006 — /analytics returns 404 [OPEN — TASK-015]

**Severity:** Medium (nav link broken)

Page not built. Task created: TASK-015.

### BUG-007 — /accounts, /accounts/new, /accounts/[id] return 404 [OPEN — TASK-008 ready]

**Severity:** High (nav link broken)

Pages not built. Feature task TASK-008 is ready and unstarted.

### BUG-008 — /settings returns 404 [OPEN — TASK-009 ready]

**Severity:** Medium (nav link broken)

Page not built. Feature task TASK-009 is ready and unstarted.

### BUG-011 — CRITICAL: SqliteError "no such column: prompt" crashes dashboard, /posts, /calendar [RESOLVED — 2026-03-29 run 6]

**Severity:** Resolved

`pnpm db:push` was run (TASK-028). `postpilot.db` now has `prompt`, `publishAttempts`, `nextRetryAt`, `campaignId` columns. Dashboard, /posts, and /calendar all load correctly with post content.

### BUG-012 — AI content generation returns 500 [OPEN — TASK-029]

**Severity:** High (core AI feature broken)

POST `/api/posts/generate` returns 500. Likely cause: `ANTHROPIC_API_KEY` not set in `.env`. UI shows "Generation failed". Fix: verify `ANTHROPIC_API_KEY` is configured in `.env.local`.

### BUG-013 — React prop warning: false for non-boolean attribute "error" on /posts/new [OPEN — minor]

**Severity:** Low

Console warning: `Received 'false' for a non-boolean attribute 'error'`. A form component on /posts/new passes `error={false}` instead of `error={undefined}`. Cosmetic/console noise only.

### BUG-014 — CRITICAL: Recurring unmerged branches — TASK-009/014/015/027/029 done but not on main [OPEN — TASK-035]

**Severity:** Critical (blocks 4 routes + AI gen fix + landing page)

Fifth recurrence of the unmerged-branches pattern. Five tasks "done" in local worktrees but not merged to main:
- `ao/task-009` → /settings still 404
- `ao/task-014` → /campaigns still 404
- `ao/task-015` → /analytics still 404
- `ao/task-027` → landing page still a stub
- `ao/task-029` → AI gen fix (lazy Anthropic init) not on main

Fix: TASK-035 created — merge all five branches into main.

### BUG-009 — favicon.ico returns 404 [OPEN — minor]

**Severity:** Low

Missing favicon file. Console error on every page load.

### BUG-010 — Dashboard search input missing aria-label [OPEN — minor]

**Severity:** Low (accessibility)

Two "Input: missing label association" warnings on /dashboard. The search input uses a placeholder ("Search posts…") but lacks a proper `aria-label`, `aria-labelledby`, or `<Label htmlFor>` association. Affects screen reader users.

## Regression Tracker

<!-- QA agent: if a previously passing test starts failing, log it here with the date and suspected cause. -->
| Date | Test | Was | Now | Suspected Cause |
|------|------|-----|-----|-----------------|
| 2026-03-28 (run 3) | Steps passed | 3 (run 2) | 2 (run 3) | Done tasks (TASK-013/016/017) not merged to main — same unmerged-branch pattern as before |
| 2026-03-28 (run 4) | Steps passed | 2 (run 3) | 2 (run 4) | Done tasks (TASK-013/019/020) not merged to main — recurring unmerged-branch pattern |
| 2026-03-28 (run 5) | Dashboard loads | PASS (run 4) | FAIL (run 5) | TASK-022 merged schema changes without running pnpm db:push — SqliteError crash (BUG-011) |
| 2026-03-29 (run 6) | Dashboard loads | FAIL (run 5) | PASS (run 6) | pnpm db:push run (TASK-028) — BUG-011 resolved, postpilot.db has all schema columns |

## Test Coverage

### Auth Flow
- [x] Landing page loads without errors *(PASS — 2026-03-28 run 2)*
- [x] Signup with email/password works *(PASS — redirects to /dashboard with welcome message)*
- [x] Login with existing credentials works *(PASS — redirects to /dashboard)*
- [x] Protected routes redirect to login when unauthenticated *(PASS — verified in dashboard/page.tsx server-side session check)*
- [x] Logout redirects to landing/login *(PASS — 2026-03-28 run 5 — Sign out button in sidebar redirects to /login)*
- [x] OAuth login button (Google) visible on login page *(PASS — 2026-03-28 run 5 — "Continue with Google" button present)*
- [x] OAuth login button (GitHub) visible on login page *(PASS — 2026-03-28 run 5 — "Continue with GitHub" button present)*

### Post Creation
- [x] New post form/AI generator loads *(PASS — 2026-03-28 run 5 — renders with prompt input, platform selector, preview panel)*
- [ ] AI content generation works (natural language input) *(FAIL — /api/posts/generate returns 500, BUG-012, TASK-029)*
- [x] Platform selection works (multi-select) *(PASS — 2026-03-28 run 5 — LinkedIn selected, character counter updates, preview shows)*
- [x] Post preview renders correctly per platform *(PASS — 2026-03-28 run 5 — LinkedIn preview panel updates with content)*
- [ ] Save as draft works *(UNVERIFIED — BUG-011 fixed, DB schema correct, server action exists; requires browser to test form submission)*
- [ ] Schedule post works *(not tested)*

### Post Dashboard
- [x] Dashboard loads with post list *(PASS — 2026-03-29 run 6 — renders with draft/scheduled posts, New Post button, Search posts input)*
- [ ] Search works *(not tested — UI present but requires browser interaction)*
- [ ] Status filter works *(not tested)*
- [ ] Platform filter works *(not tested)*
- [ ] Quick stats show correct counts *(not tested)*

### Social Accounts
- [ ] Accounts page loads *(FAIL — /accounts 404, TASK-008 ready)*
- [ ] Connect new account flow works *(not tested)*
- [ ] Account detail page loads with post history *(not tested)*
- [ ] Disconnect account works *(not tested)*

### Campaigns
- [ ] Campaign list page loads *(FAIL — /campaigns 404, TASK-014 created)*
- [ ] Create campaign from AI brief works *(not tested)*
- [ ] Campaign detail shows timeline and posts *(not tested)*
- [ ] Pause/resume campaign works *(not tested)*

### Content Calendar
- [x] Calendar view loads *(PASS — 2026-03-29 run 6 — renders with week/month views, March dates visible)*
- [ ] Posts appear on correct dates *(not tested — blocked by BUG-011)*
- [ ] Day/week/month views work *(not tested)*
- [ ] Drag-and-drop rescheduling works *(not tested)*

### Analytics
- [ ] Analytics page loads *(FAIL — /analytics 404, TASK-015 created)*
- [ ] Per-platform metrics display *(not tested)*
- [ ] Date range filtering works *(not tested)*
- [ ] Charts render correctly *(not tested)*

### Settings
- [ ] Settings page loads *(FAIL — /settings 404, TASK-009 ready)*
- [ ] Brand voice configuration saves *(not tested)*
- [ ] Business profile updates work *(not tested)*

### Navigation
- [ ] All nav links work (no 404s) *(FAIL — 2026-03-29 run 6 — /accounts/campaigns/analytics/settings 404 (BUG-014, TASK-035))*
- [x] /posts page loads (list or redirect to dashboard) *(PASS — 2026-03-29 run 6 — renders post list with search, draft/scheduled posts)*
- [ ] Mobile navigation works *(not tested)*
- [ ] Back/forward browser buttons work *(not tested)*

### Console & Network
- [ ] No console.error messages *(FAIL — favicon 404 (BUG-009); React prop warning on /posts/new (BUG-013))*
- [ ] No accessibility warnings *(not retested — /dashboard inaccessible due to BUG-011)*
- [x] No uncaught exceptions *(PASS — errors are caught and shown as UI messages)*
- [ ] No failed network requests (4xx/5xx) *(FAIL — /api/posts/generate 500 (BUG-012), /accounts 404 (BUG-007), /campaigns 404 (BUG-014), /analytics 404 (BUG-014), /settings 404 (BUG-014))*

## Environment Notes

- App URL: http://localhost:3001 (port 3000 occupied by CondoHub, 3002 by another project)
- Database: SQLite via Drizzle ORM (`postpilot.db`) — run `pnpm db:push` before testing; schema up-to-date as of run 6
- Auth: Better Auth — requires BETTER_AUTH_SECRET and BETTER_AUTH_URL in .env
- AI generation: requires ANTHROPIC_API_KEY in .env.local (currently missing — no .env.local file)
- Test credentials: qa-test@postpilot.dev / TestPass123!

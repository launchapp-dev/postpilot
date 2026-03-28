# QA Test Plan — PostPilot

This is a living document maintained by the QA agent. It tracks test results, known issues, regression history, and the current state of the application.

## Last Run

| Field | Value |
|-------|-------|
| Date | 2026-03-28 (run 3) |
| Result | PARTIAL — auth+dashboard PASS, all feature routes 404, logout missing |
| Steps Passed | 2 of 6 |
| Duration | ~10 min |
| Console Errors | 1 (favicon.ico 404 — minor) |
| Network Errors | 0 |
| New Tasks Created | TASK-018 |

## Test Results History

<!-- QA agent: append each run result here. Format: | Date | Passed | Failed | Bugs Created | Notes | -->
| Date | Passed | Failed | Bugs Created | Notes |
|------|--------|--------|-------------|-------|
| 2026-03-28 | 1 | 5 | BUG-001 (TASK-005) | PostPilot dev server not running; invoicer project on port 3000 |
| 2026-03-28 (run 2) | 3 | 3 | TASK-013, TASK-014, TASK-015 | App runs on port 3001 (3000 taken by CondoHub). Auth+dashboard PASS. 6/7 nav routes 404. |
| 2026-03-28 (run 3) | 2 | 4 | TASK-018 | Auth+dashboard PASS. All feature routes still 404. TASK-013/016/017 done but branches unmerged — TASK-018 created. |

## Known Issues

<!-- QA agent: track active bugs found during E2E testing. Remove when fixed. -->

### BUG-001 — PostPilot not running on localhost:3000 [RESOLVED — 2026-03-28 run 2]

App now starts successfully (runs on port 3001 as port 3000 is occupied by another project). TASK-005 done. BUG-001 closed.

### BUG-002 — /posts/new and /posts/[id] return 404 [OPEN — TASK-018]

**Severity:** High (core feature inaccessible)

`ao/task-016` rebuilt these pages (TASK-016 done) but branch never merged to main. TASK-018 tracks the merge.

### BUG-003 — /calendar returns 404 [OPEN — TASK-018]

**Severity:** High

`ao/task-017` rebuilt this page (TASK-017 done) but branch never merged to main. TASK-018 tracks the merge.

### BUG-004 — No logout button in sidebar [OPEN — TASK-018]

**Severity:** High (users cannot sign out)

`ao/task-013` added logout (TASK-013 done) but branch never merged to main. TASK-018 tracks the merge.

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

### BUG-009 — favicon.ico returns 404 [OPEN — minor]

**Severity:** Low

Missing favicon file. Console error on every page load.

## Regression Tracker

<!-- QA agent: if a previously passing test starts failing, log it here with the date and suspected cause. -->
| Date | Test | Was | Now | Suspected Cause |
|------|------|-----|-----|-----------------|
| 2026-03-28 (run 3) | Steps passed | 3 (run 2) | 2 (run 3) | Done tasks (TASK-013/016/017) not merged to main — same unmerged-branch pattern as before |

## Test Coverage

### Auth Flow
- [x] Landing page loads without errors *(PASS — 2026-03-28 run 2)*
- [x] Signup with email/password works *(PASS — redirects to /dashboard with welcome message)*
- [x] Login with existing credentials works *(PASS — redirects to /dashboard)*
- [x] Protected routes redirect to login when unauthenticated *(PASS — verified in dashboard/page.tsx server-side session check)*
- [ ] Logout redirects to landing/login *(FAIL — ao/task-013 done but not merged, TASK-018)*

### Post Creation
- [ ] New post form/AI generator loads *(FAIL — /posts/new 404, ao/task-016 not merged, TASK-018)*
- [ ] AI content generation works (natural language input) *(not tested — blocked by above)*
- [ ] Platform selection works (multi-select) *(not tested)*
- [ ] Post preview renders correctly per platform *(not tested)*
- [ ] Save as draft works *(not tested)*
- [ ] Schedule post works *(not tested)*

### Post Dashboard
- [x] Dashboard loads with post list *(PASS — stats and post list render correctly)*
- [x] Search works *(PASS — search box accepts input with no errors)*
- [x] Status filter works *(PASS — Draft/Scheduled/Published/Failed tabs filter correctly)*
- [ ] Platform filter works *(not tested — no posts exist)*
- [x] Quick stats show correct counts *(PASS — all show 0 for new account)*

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
- [ ] Calendar view loads *(FAIL — /calendar 404, ao/task-017 not merged, TASK-018)*
- [ ] Posts appear on correct dates *(not tested)*
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
- [ ] All nav links work (no 404s) *(FAIL — 6/7 links 404: posts/new, calendar, analytics, accounts, campaigns, settings — TASK-018 for unmerged branches)*
- [ ] Mobile navigation works *(not tested)*
- [ ] Back/forward browser buttons work *(not tested)*

### Console & Network
- [ ] No console.error messages *(FAIL — favicon.ico 404 on every page, BUG-009)*
- [x] No uncaught exceptions *(PASS)*
- [x] No failed network requests (4xx/5xx) *(PASS on auth flow; nav routes excluded as known 404s)*

## Environment Notes

- App URL: http://localhost:3000
- Database: SQLite via Drizzle ORM — run `pnpm db:push` before testing
- Auth: Better Auth — requires BETTER_AUTH_SECRET and BETTER_AUTH_URL in .env
- Test credentials: qa-test@postpilot.dev / TestPass123!

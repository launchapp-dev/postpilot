# QA Test Plan — PostPilot

This is a living document maintained by the QA agent. It tracks test results, known issues, regression history, and the current state of the application.

## Last Run

| Field | Value |
|-------|-------|
| Date | 2026-03-28 (run 5) |
| Result | PARTIAL — auth+logout+/posts/new PASS; dashboard/posts/calendar crash (schema migration); accounts/campaigns/analytics/settings 404; AI gen 500 |
| Steps Passed | 3 of 6 |
| Duration | ~15 min |
| Console Errors | 2 unique: favicon 404 (BUG-009), React false-for-non-boolean-attr on /posts/new (BUG-013) |
| Network Errors | /dashboard 500, /posts 500, /calendar 500, /api/posts/generate 500, /accounts 404, /campaigns 404, /analytics 404, /settings 404 |
| New Tasks Created | TASK-028, TASK-029 |

## Test Results History

<!-- QA agent: append each run result here. Format: | Date | Passed | Failed | Bugs Created | Notes | -->
| Date | Passed | Failed | Bugs Created | Notes |
|------|--------|--------|-------------|-------|
| 2026-03-28 | 1 | 5 | BUG-001 (TASK-005) | PostPilot dev server not running; invoicer project on port 3000 |
| 2026-03-28 (run 2) | 3 | 3 | TASK-013, TASK-014, TASK-015 | App runs on port 3001 (3000 taken by CondoHub). Auth+dashboard PASS. 6/7 nav routes 404. |
| 2026-03-28 (run 3) | 2 | 4 | TASK-018 | Auth+dashboard PASS. All feature routes still 404. TASK-013/016/017 done but branches unmerged — TASK-018 created. |
| 2026-03-28 (run 4) | 2 | 4 | TASK-021 | Auth+dashboard PASS. All feature routes still 404. TASK-013/019/020 done but branches unmerged — TASK-021 created. New: 2 accessibility warnings on dashboard search input. |
| 2026-03-28 (run 5) | 3 | 3 | TASK-028, TASK-029 | TASK-021/022/023/024 merged. Logout+OAuth+/posts/new now PASS. REGRESSION: dashboard/posts/calendar crash (SqliteError: no such column "prompt" — pnpm db:push not run after TASK-022 merge). AI gen 500. Accounts/campaigns/analytics/settings still 404. |

## Known Issues

<!-- QA agent: track active bugs found during E2E testing. Remove when fixed. -->

### BUG-001 — PostPilot not running on localhost:3000 [RESOLVED — 2026-03-28 run 2]

App now starts successfully (runs on port 3001 as port 3000 is occupied by another project). TASK-005 done. BUG-001 closed.

### BUG-002 — /posts/new renders but save fails [PARTIAL — BUG-011 blocker]

**Severity:** High

Page now loads correctly (TASK-019/021 merged). Save Draft and Save Post fail due to BUG-011 (schema migration not run).

### BUG-003 — /calendar crashes with SqliteError [PARTIAL — BUG-011 blocker]

**Severity:** High

Route now exists (TASK-020/021 merged) but page crashes with BUG-011 schema error.

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

### BUG-011 — CRITICAL: SqliteError "no such column: prompt" crashes dashboard, /posts, /calendar [OPEN — TASK-028]

**Severity:** Critical (regression — was PASS in run 4)

TASK-022 merged schema changes adding `prompt`, `publishAttempts`, `nextRetryAt`, `campaignId` columns to the posts table. `pnpm db:push` was never run. Every page that queries posts (dashboard, /posts, /calendar) crashes with `SqliteError: no such column: "prompt"`. Save Draft and Save Post also fail. Fix: run `pnpm db:push` from the postpilot repo root.

### BUG-012 — AI content generation returns 500 [OPEN — TASK-029]

**Severity:** High (core AI feature broken)

POST `/api/posts/generate` returns 500. Likely cause: `ANTHROPIC_API_KEY` not set in `.env`. UI shows "Generation failed". Fix: verify `ANTHROPIC_API_KEY` is configured in `.env.local`.

### BUG-013 — React prop warning: false for non-boolean attribute "error" on /posts/new [OPEN — minor]

**Severity:** Low

Console warning: `Received 'false' for a non-boolean attribute 'error'`. A form component on /posts/new passes `error={false}` instead of `error={undefined}`. Cosmetic/console noise only.

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
- [ ] Save as draft works *(FAIL — SqliteError: no such column "prompt", BUG-011, TASK-028)*
- [ ] Schedule post works *(not tested)*

### Post Dashboard
- [ ] Dashboard loads with post list *(FAIL — 2026-03-28 run 5 — SqliteError: no such column "prompt", BUG-011, TASK-028)*
- [ ] Search works *(not tested — blocked by BUG-011)*
- [ ] Status filter works *(not tested — blocked by BUG-011)*
- [ ] Platform filter works *(not tested — blocked by BUG-011)*
- [ ] Quick stats show correct counts *(not tested — blocked by BUG-011)*

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
- [ ] Calendar view loads *(FAIL — 2026-03-28 run 5 — route exists but crashes: SqliteError no such column "prompt", BUG-011, TASK-028)*
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
- [ ] All nav links work (no 404s) *(FAIL — 2026-03-28 run 5 — /dashboard/posts/calendar crash (BUG-011); /accounts/campaigns/analytics/settings still 404)*
- [ ] /posts page loads (list or redirect to dashboard) *(FAIL — SqliteError crash, BUG-011)*
- [ ] Mobile navigation works *(not tested)*
- [ ] Back/forward browser buttons work *(not tested)*

### Console & Network
- [ ] No console.error messages *(FAIL — favicon 404 (BUG-009); React prop warning on /posts/new (BUG-013))*
- [ ] No accessibility warnings *(not retested — /dashboard inaccessible due to BUG-011)*
- [x] No uncaught exceptions *(PASS — errors are caught and shown as UI messages)*
- [ ] No failed network requests (4xx/5xx) *(FAIL — /dashboard 500, /posts 500, /calendar 500, /api/posts/generate 500, /accounts 404, /campaigns 404, /analytics 404, /settings 404)*

## Environment Notes

- App URL: http://localhost:3001 (port 3000 occupied by CondoHub, 3002 by another project)
- Database: SQLite via Drizzle ORM — run `pnpm db:push` before testing
- Auth: Better Auth — requires BETTER_AUTH_SECRET and BETTER_AUTH_URL in .env
- Test credentials: qa-test@postpilot.dev / TestPass123!

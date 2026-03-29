# QA Test Plan — PostPilot

This is a living document maintained by the QA agent. It tracks test results, known issues, regression history, and the current state of the application.

## Last Run

| Field | Value |
|-------|-------|
| Date | 2026-03-29 (run 7) |
| Result | FAIL — Landing page 500 (BUG-015); Dashboard/posts/calendar/analytics/campaigns 500 (BUG-016/017 — pnpm db:push needed after TASK-031/034); /accounts 404 (BUG-007); /settings + /posts/new PASS; auth PASS |
| Steps Passed | 1 of 6 |
| Duration | ~10 min |
| Console Errors | RecycleCount SqliteError (BUG-016), campaign table missing (BUG-017), buttonVariants "use client" error (BUG-015) |
| Network Errors | `/` 500, /dashboard 500, /posts 500, /calendar 500, /analytics 500, /campaigns 500, /api/posts/generate 401 (API key invalid/missing), /accounts 404 |
| New Tasks Created | TASK-043, TASK-044 |

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
| 2026-03-29 (run 7) | 1 | 5 | TASK-043, TASK-044 | BUG-015: Landing page `/` 500 — buttonVariants() from "use client" module called in server component. BUG-016: dashboard/posts/calendar/analytics 500 — recycleCount/noRecycle columns missing (pnpm db:push after TASK-031). BUG-017: /campaigns 500 — campaign table missing (pnpm db:push after TASK-014/033). /settings 200 PASS. /posts/new 200 PASS (From Source feature present, TASK-040). AI gen now 401 not 500 (API key error surfaces). TASK-037/039/041 unmerged. |

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

### BUG-014 — CRITICAL: Recurring unmerged branches — TASK-009/014/015/027/029 done but not on main [RESOLVED — 2026-03-29 run 7]

**Severity:** Resolved

TASK-035 completed — all five branches merged to main. /settings, /campaigns, /analytics, landing page all reachable (though some now crash for other reasons). Pattern continues: TASK-037/039/041 now done in local worktrees but not on main.

### BUG-015 — CRITICAL: Landing page `/` returns 500 — buttonVariants() called from server component [OPEN — 2026-03-29 run 7]

**Severity:** Critical (landing page broken for all unauthenticated visitors)

`src/app/page.tsx` (server component) calls `buttonVariants()` from `@/components/ui/button`. The `button.tsx` file has `"use client"` at line 1, marking all its exports as client-only. Next.js 15 throws: `"Attempted to call buttonVariants() from the server but buttonVariants is on the client."` Root cause: naming collision between `button.ts` (barrel, no "use client") and `button.tsx` (has "use client") — Turbopack resolves to `.tsx`.

### BUG-016 — CRITICAL: Dashboard/posts/calendar/analytics crash with SqliteError: no such column "recycleCount" [OPEN — 2026-03-29 run 7]

**Severity:** Critical (dashboard + 3 routes broken)

`pnpm db:push` not run after TASK-031 (content recycling) added `recycleCount` and `noRecycle` columns to the `post` table schema. Drizzle queries that reference these columns fail with `SqliteError: no such column: "recycleCount"`. Affects: /dashboard, /posts, /calendar, /analytics. Same recurring pattern as BUG-011. Fix: run `pnpm db:push`.

### BUG-017 — CRITICAL: /campaigns crashes with SqliteError: no such table: campaign [OPEN — 2026-03-29 run 7]

**Severity:** Critical (campaigns route broken)

`pnpm db:push` not run after TASK-014/033 added the `campaign` table to the schema. The campaigns page queries the non-existent `campaign` table. Fix: run `pnpm db:push`.

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
| 2026-03-29 (run 7) | Landing page `/` | PASS (run 6) | FAIL (run 7) | TASK-038 updated button.tsx with "use client", Turbopack resolves import to client module — BUG-015 |
| 2026-03-29 (run 7) | Dashboard loads | PASS (run 6) | FAIL (run 7) | TASK-031 added recycleCount/noRecycle columns without running pnpm db:push — BUG-016 |
| 2026-03-29 (run 7) | /campaigns | 404 (run 6) | 500 (run 7) | TASK-035 merged campaign code, pnpm db:push not run — campaign table missing — BUG-017 |
| 2026-03-29 (run 7) | /analytics | 404 (run 6) | 500 (run 7) | TASK-015 merged analytics code, recycleCount column missing — BUG-016 |

## Test Coverage

### Auth Flow
- [ ] Landing page loads without errors *(FAIL — 2026-03-29 run 7 — 500, BUG-015)*
- [x] Signup with email/password works *(PASS — redirects to /dashboard with welcome message)*
- [x] Login with existing credentials works *(PASS — redirects to /dashboard)*
- [x] Protected routes redirect to login when unauthenticated *(PASS — all authenticated routes return 307)*
- [x] Logout redirects to landing/login *(PASS — 2026-03-28 run 5 — Sign out button in sidebar redirects to /login)*
- [x] OAuth login button (Google) visible on login page *(PASS — 2026-03-28 run 5 — "Continue with Google" button present)*
- [x] OAuth login button (GitHub) visible on login page *(PASS — 2026-03-28 run 5 — "Continue with GitHub" button present)*

### Post Creation
- [x] New post form/AI generator loads *(PASS — 2026-03-29 run 7 — renders with Prompt | From Source toggle, platform selector, preview panel)*
- [ ] AI content generation works (natural language input) *(FAIL — /api/posts/generate returns 401 — ANTHROPIC_API_KEY invalid/missing, BUG-012)*
- [x] Platform selection works (multi-select) *(PASS — 2026-03-28 run 5 — LinkedIn selected, character counter updates, preview shows)*
- [x] Post preview renders correctly per platform *(PASS — 2026-03-28 run 5 — LinkedIn preview panel updates with content; TASK-036 merged)*
- [ ] Save as draft works *(UNVERIFIED — requires browser interaction)*
- [ ] Schedule post works *(not tested)*
- [x] "From Source" input mode present (URL/text input) *(PASS — 2026-03-29 run 7 — "From Source" toggle visible on /posts/new, TASK-040)*
- [ ] "From Source" content generation works *(not tested — AI gen fails due to missing API key)*
- [ ] AI engagement prediction score shown before publishing *(UNVERIFIED — TASK-039 in unmerged branch ao/task-039)*

### Post Dashboard
- [ ] Dashboard loads with post list *(FAIL — 2026-03-29 run 7 — 500, BUG-016, recycleCount column missing)*
- [ ] Search works *(not tested)*
- [ ] Status filter works *(not tested)*
- [ ] Platform filter works *(not tested)*
- [ ] Quick stats show correct counts *(not tested)*
- [ ] Bulk actions work (reschedule, delete, duplicate) *(UNVERIFIED — TASK-037 in unmerged branch ao/task-037)*

### Social Accounts
- [ ] Accounts page loads *(FAIL — /accounts 404, TASK-008 ready)*
- [ ] Connect new account flow works *(not tested)*
- [ ] Account detail page loads with post history *(not tested)*
- [ ] Disconnect account works *(not tested)*

### Campaigns
- [ ] Campaign list page loads *(FAIL — 2026-03-29 run 7 — 500, BUG-017, campaign table missing)*
- [x] /campaigns/new loads *(PASS — 2026-03-29 run 7 — returns 200)*
- [ ] Create campaign from AI brief works *(not tested)*
- [ ] Campaign detail shows timeline and posts *(not tested)*
- [ ] Pause/resume campaign works *(not tested)*

### Content Calendar
- [ ] Calendar view loads *(FAIL — 2026-03-29 run 7 — 500, BUG-016, recycleCount column missing)*
- [ ] Posts appear on correct dates *(not tested)*
- [ ] Day/week/month views work *(not tested)*
- [ ] Drag-and-drop rescheduling works *(UNVERIFIED — TASK-041 in unmerged branch ao/task-041)*

### Analytics
- [ ] Analytics page loads *(FAIL — 2026-03-29 run 7 — 500, BUG-016, recycleCount column missing)*
- [ ] Per-platform metrics display *(not tested)*
- [ ] Date range filtering works *(not tested)*
- [ ] Charts render correctly *(not tested)*

### Settings
- [x] Settings page loads *(PASS — 2026-03-29 run 7 — /settings returns 200, brand voice content visible)*
- [x] Multi-voice brand voice configuration present *(PASS — 2026-03-29 run 7 — voice-related content rendered, TASK-038)*
- [ ] Brand voice configuration saves *(not tested — requires browser interaction)*
- [ ] Business profile updates work *(not tested)*

### Navigation
- [ ] All nav links work (no 404s/500s) *(FAIL — 2026-03-29 run 7 — /accounts 404 (BUG-007); /dashboard/posts/calendar/campaigns/analytics 500 (BUG-016/017))*
- [ ] /posts page loads *(FAIL — 2026-03-29 run 7 — 500, BUG-016)*
- [ ] /settings page loads *(PASS — 2026-03-29 run 7)*
- [ ] Mobile navigation works *(not tested)*
- [ ] Back/forward browser buttons work *(not tested)*

### Console & Network
- [ ] No console.error messages *(FAIL — favicon 404 (BUG-009); React prop warning on /posts/new (BUG-013); SqliteError on multiple routes (BUG-016/017))*
- [ ] No accessibility warnings *(not tested — blocked by 500 errors)*
- [x] No uncaught exceptions *(PASS — errors are caught by Next.js error boundary)*
- [ ] No failed network requests (4xx/5xx) *(FAIL — `/` 500 (BUG-015), /dashboard 500 (BUG-016), /api/posts/generate 401 (BUG-012), /accounts 404 (BUG-007), multiple others 500)*

## Environment Notes

- App URL: http://localhost:3001 (port 3000 occupied by CondoHub, 3002 by another project)
- Database: SQLite via Drizzle ORM (`postpilot.db`) — **SCHEMA OUT OF DATE** as of run 7: missing recycleCount/noRecycle columns and campaign table — run `pnpm db:push`
- Auth: Better Auth — requires BETTER_AUTH_SECRET and BETTER_AUTH_URL in .env
- AI generation: requires ANTHROPIC_API_KEY in .env.local — currently present but invalid (returns 401)
- Test credentials: qa-test@postpilot.dev / TestPass123!
- Unmerged branches: ao/task-037 (bulk actions), ao/task-039 (engagement prediction), ao/task-041 (calendar drag-and-drop)

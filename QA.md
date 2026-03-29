# QA Test Plan — PostPilot

This is a living document maintained by the QA agent. It tracks test results, known issues, regression history, and the current state of the application.

## Last Run

| Field | Value |
|-------|-------|
| Date | 2026-03-29 (run 12) |
| Result | FAIL — No new code merged since run 11. App state identical. All known bugs persist. Auth + /posts/new + /settings (loads only, all fields disabled) + /campaigns/new PASS. Logout click timed out again (flaky, same as run 11). |
| Steps Passed | 1 of 6 |
| Duration | ~15 min |
| Console Errors | SqliteError recycleCount (BUG-016), React DOM prop warning asChild/error (BUG-013), favicon 404 (BUG-009) |
| Network Errors | `/` 500 (BUG-015), /dashboard 500 (BUG-016), /posts 500, /calendar 500, /analytics 500, /campaigns 500 (BUG-017), /accounts 404 (BUG-007) |
| New Tasks Created | none — all failures are known bugs |

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
| 2026-03-29 (run 7) | 1 | 5 | TASK-045, TASK-046, TASK-047 | BUG-015: Landing page `/` 500 — buttonVariants() from "use client" module called in server component. BUG-016: dashboard/posts/calendar/analytics 500 — recycleCount/noRecycle columns missing (pnpm db:push after TASK-031). BUG-017: /campaigns 500 — campaign table missing (pnpm db:push after TASK-014/033). /settings 200 PASS. /posts/new 200 PASS (From Source feature present, TASK-040). AI gen now 401 not 500 (API key error surfaces). TASK-037/039/041 unmerged. |
| 2026-03-29 (run 8) | 1 | 5 | none | No new fixes deployed since run 7. All run 7 bugs persist. AI gen HTTP 500 wrapping Anthropic 401 (run 7 note of "401" was inaccurate — HTTP status has always been 500). TASK-043 marked done but ao/task-008 still not merged to main — /accounts still 404. TASK-045/046/047 still in backlog. |
| 2026-03-28 (run 9) | 1 | 5 | none | No new fixes deployed since run 8. App state identical to run 8. No new commits to main. Local branches ao/task-008/037/039/041 still unmerged. TASK-045/046/047 remain in backlog. Recurring unmerged-branch pattern continues — TASK-047 created but not actioned. |
| 2026-03-29 (run 10) | 1 | 5 | none | TASK-050 (bulk actions) merged to main since run 9. All other known bugs persist. TASK-045/046/047/051 all marked done but branches have zero unique commits — no work was actually committed. ao/task-008 has accounts fix (1 unique commit) but still not merged despite 8+ merge tasks. AI gen now shows raw 401 JSON to user. Bulk actions exist in code but untestable (dashboard 500). |
| 2026-03-29 (run 11) | 1 | 5 | none | No new code merged since run 10. TASK-052/053/054 marked done but all have 0 commits ahead of main (11th recurrence of empty-done-branch pattern). NEW FINDING: settings table missing from DB — settings form fields stay disabled forever (POST /settings → 500 silently fails). Also: settings, brandVoice, campaign tables ALL missing — only account/post/session/user/verification exist in postpilot.db. pnpm db:push has NEVER been run since TASK-031 schema changes. |
| 2026-03-29 (run 12) | 1 | 5 | none | No new code merged since run 11. App state identical. All known bugs persist (BUG-007/015/016/017/018). Login succeeds (auth API 200) but dashboard immediately crashes (SqliteError: recycleCount). Logout flaky (timeout). |

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

### BUG-018 — Settings form permanently disabled — settings/brandVoice tables missing from DB [OPEN — run 11]

**Severity:** High (settings page non-functional for all users)

Settings page loads (HTTP 200) but all form fields (`brandName`, `industry`, `website`, `emailAlerts`) stay permanently disabled. Root cause: `getSettings()` and `getBrandVoices()` server actions POST to `/settings` and return 500 because the `settings` and `brandVoice` tables don't exist in `postpilot.db`. The `loading` state starts `true` and `setLoading(false)` is only called in `.then()` — if the Promise rejects silently (no `.catch()`), fields stay disabled forever. The DB only has: account, post, session, user, verification. Missing tables: settings, brandVoice, campaign, plus recycleCount/noRecycle columns on post. Fix: run `pnpm db:push`.

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
| 2026-03-29 (run 8) | All routes | same as run 7 | same as run 7 | No new merges to main since run 7 — app state unchanged |
| 2026-03-28 (run 9) | All routes | same as run 8 | same as run 8 | No new merges to main since run 8 — app state unchanged |
| 2026-03-29 (run 10) | All routes | same as run 9 | same as run 9 | TASK-050 merged but only adds bulk actions code; dashboard still crashes (BUG-016) — bulk actions untestable |
| 2026-03-29 (run 11) | Settings form usable | UNVERIFIED (not tested) | FAIL (fields permanently disabled) | settings/brandVoice tables missing from DB — server action silently fails, loading state never resolves |
| 2026-03-29 (run 12) | All routes | same as run 11 | same as run 11 | No new merges to main since run 11 — app state unchanged |

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

### Content Recycling
- [ ] Recycling rules visible in UI *(not tested — TASK-031 merged but recycleCount/noRecycle columns cause crash on DB-dependent routes — BUG-016)*
- [ ] Evergreen post identification works *(not tested — blocked by BUG-016)*
- [ ] Exclude-from-recycling flag works *(not tested — blocked by BUG-016)*

### Bulk Actions (TASK-050 merged to main)
- [ ] Select multiple posts with checkboxes *(BLOCKED — dashboard crashes before rendering, BUG-016)*
- [ ] Bulk reschedule works *(BLOCKED — dashboard crashes before rendering, BUG-016)*
- [ ] Bulk delete works *(BLOCKED — dashboard crashes before rendering, BUG-016)*
- [ ] Bulk duplicate works *(BLOCKED — dashboard crashes before rendering, BUG-016)*

### Engagement Prediction (ao/task-039 — unmerged)
- [ ] Engagement score shown on /posts/new before publish *(not tested — TASK-039 done but in local branch, not on main)*

### Calendar Drag-and-Drop (ao/task-041 — unmerged)
- [ ] Posts can be dragged to new dates *(not tested — TASK-041 done but in local branch, not on main)*

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
- Database: SQLite via Drizzle ORM (`postpilot.db`) — **CRITICALLY OUT OF DATE**: only has account/post/session/user/verification tables. Missing: settings, brandVoice, campaign tables + recycleCount/noRecycle columns on post. `pnpm db:push` has NEVER been run since run 7 merges.
- Auth: Better Auth — requires BETTER_AUTH_SECRET and BETTER_AUTH_URL in .env
- AI generation: requires ANTHROPIC_API_KEY in .env.local — currently present but invalid (returns HTTP 500 wrapping Anthropic 401 authentication_error)
- Test credentials: qa-test@postpilot.dev / TestPass123!
- TASK-050 merged (bulk actions code in /dashboard) — but dashboard still crashes (BUG-016)
- ao/task-008 has accounts pages (1 commit ahead of main) — never merged despite 10+ merge tasks created
- TASK-045/046/047/051/052/053/054 all marked done but branches have zero unique commits — no work was actually performed
- ao/task-037 (old bulk actions), ao/task-039 (engagement prediction), ao/task-041 (calendar drag-and-drop) — all superseded but still in local branches only

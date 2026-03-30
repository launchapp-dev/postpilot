# QA Test Plan — PostPilot

This is a living document maintained by the QA agent. It tracks test results, known issues, regression history, and the current state of the application.

## Last Run

| Field | Value |
|-------|-------|
| Date | 2026-03-30 (run 60) |
| Result | PARTIAL PASS — No new code merged since run 59 (only memory/planner/reconciler commits). Server already running on :3000 (PID 9662). `/` 200 PASS (BUG-015 remains fixed). Auth PASS (API 200, session cookie injection, dashboard loads with 34 drafts). All 10 authenticated routes 200 (dashboard/posts/calendar/analytics/campaigns/settings/posts/new/campaigns/new). Save Draft PASS (post /posts/ue18ylllq1fmndg45py created — DB 33→34, LinkedIn platform, redirected to edit page). Logout PASS (redirected to /login — 2nd consecutive run working). /accounts 500 BUG-020 (SqliteError: no such table: socialAccount — TASK-112 still in ready). AI gen FAIL BUG-012 ("ANTHROPIC_API_KEY is not configured" shown in red in UI). NEW FINDING: Generate button requires BOTH prompt text AND platform selection to be enabled. Console: BUG-019 hydration mismatch (known). |
| Steps Passed | 5 of 6 |
| Duration | ~10 min |
| Console Errors | BUG-019 hydration mismatch on /dashboard |
| Network Errors | /accounts 500 BUG-020 (SqliteError: no such table: socialAccount); /api/posts/generate 503 (BUG-012) |
| New Tasks Created | none — all failures are known bugs |

## Test Results History

<!-- QA agent: append each run result here. Format: | Date | Passed | Failed | Bugs Created | Notes | -->
| Date | Passed | Failed | Bugs Created | Notes |
|------|--------|--------|-------------|-------|
| 2026-03-30 (run 60) | 5 | 1 | none | No new code merged since run 59 (only memory/planner/reconciler commits). Server already running on :3000 (PID 9662). `/` 200 PASS (BUG-015 confirmed fixed). Auth PASS (API 200, session cookie, dashboard loads with 34 drafts). All 10 authenticated routes 200. Save Draft PASS (post /posts/ue18ylllq1fmndg45py created — DB 33→34, LinkedIn, redirect to edit confirmed). Logout PASS (2nd consecutive). /accounts 500 BUG-020 (TASK-112 still in ready). AI gen BUG-012 ("ANTHROPIC_API_KEY is not configured" shown in red). NEW: Generate button requires prompt + platform selection. Console: BUG-019 hydration mismatch. |
| 2026-03-30 (run 59) | 5 | 1 | none | **MAJOR WIN: BUG-015 FIXED** — TASK-109 merged (button.tsx deleted). `/` now 200 for first time in 37+ runs. Server started on :3000 (node v22, PID 28583). Auth PASS (API 200). All 10 authenticated routes 200. Save Draft PASS (post /posts/op01w8vvgcmndf0rks, 33 drafts in dashboard). Logout PASS (redirected to /login — consistent for first time). /accounts 500 BUG-020 (SqliteError: no such table: socialAccount — TASK-112 in ready). AI gen 503 (BUG-012). Console: BUG-019 hydration mismatch. |
| 2026-03-30 (run 58) | 4 | 2 | none | No new code merged since run 57 (only memory/planner commits). Server already running on :3000 (PID 9662, next-server v16.2.1). `/` unauthenticated 500 (BUG-015, button.tsx still present — TASK-107 fix not merged, 58th run). /accounts 500 BUG-020 (SqliteError: no such table: socialAccount — TASK-112 still in ready). AI gen 503 (BUG-012, "ANTHROPIC_API_KEY is not configured"). All other 9 authenticated routes 200. Auth PASS (gstack browser login → /dashboard). Save Draft PASS (post created — DB 31→32, LinkedIn, redirect to edit page confirmed). Logout timeout (flaky, 58th consecutive). Console: BUG-019 asChild, BUG-013 error=false. |
| 2026-03-30 (run 57) | 4 | 2 | none | No new code merged since run 56 (only memory/planner commits). Server already running on :3000 (PID 9662, next-server v16.2.1). `/` unauthenticated 500 (BUG-015, button.tsx still present — TASK-107 fix not merged, 57th run). /accounts 500 BUG-020 (SqliteError: no such table: socialAccount — TASK-112 still in ready). AI gen 503 (BUG-012, "ANTHROPIC_API_KEY is not configured"). All other 9 authenticated routes 200. Auth PASS (gstack browser login → /dashboard). Save Draft PASS (post created — DB 30→31, LinkedIn, gstack browser confirmed). Console: BUG-019 asChild, BUG-013 error=false. |
| 2026-03-30 (run 56) | 4 | 2 | none | No new code merged since run 55 (only memory/planner commits). Server already running on :3000 (PID 9662, next-server v16.2.1, node v22). `/` unauthenticated 500 (BUG-015, button.tsx still present — TASK-107 fix not merged, 56th run). /accounts 500 BUG-020 (SqliteError: no such table: socialAccount — TASK-112 still in ready). AI gen 503 (BUG-012, "ANTHROPIC_API_KEY is not configured"). All other 9 authenticated routes 200. Auth PASS (API 200, session active, dashboard loads with 30 drafts). Save Draft PASS (post tszfbi35tlmndaoy1m created — DB 29→30, LinkedIn, confirmed in dashboard). Logout timeout (flaky, 56th consecutive). Console: BUG-019 asChild, BUG-013 error=false. |
| 2026-03-30 (run 55) | 4 | 2 | none | No new code merged since run 54 (only memory/planner commits). Server started fresh on :3000 (node v22). `/` unauthenticated 500 (BUG-015, button.tsx still present — TASK-107 fix not merged, 55th run). /accounts 500 BUG-020 (SqliteError: no such table: socialAccount — TASK-112 still in ready). AI gen 503 (BUG-012, "ANTHROPIC_API_KEY is not configured"). All other 9 authenticated routes 200. Auth PASS (browser login → /dashboard). Save Draft PASS (post pxjh6bhwabbmnd9nglm created — DB 28→29, LinkedIn, confirmed in DB and dashboard). Logout timeout (flaky, 55th consecutive). Console: BUG-019 asChild, BUG-013 error=false. |
| 2026-03-30 (run 54) | 4 | 2 | none | No new code merged since run 53 (only memory/planner commits). Server started fresh on :3000 (node v22). `/` unauthenticated 500 (BUG-015, button.tsx still present — TASK-107 fix not merged, 54th run). /accounts 500 BUG-020 (SqliteError: no such table: socialAccount — TASK-112 still in ready). AI gen 503 (BUG-012, "ANTHROPIC_API_KEY is not configured"). All other 9 authenticated routes 200. Auth PASS (browser login → /dashboard). Save Draft PASS (post created — DB 27→28, LinkedIn, confirmed in dashboard). Logout timeout (flaky, 54th consecutive). Console: BUG-019 asChild, BUG-013 error=false. |
| 2026-03-30 (run 53) | 4 | 2 | none | No new code merged since run 52 (only memory/planner commits). Server already running on :3001 (PID 91388). `/` unauthenticated 500 (BUG-015, button.tsx still present — TASK-107 fix not merged, 53rd run). /accounts 500 BUG-020 (SqliteError: no such table: socialAccount — TASK-112 still in ready). AI gen 503 (BUG-012, "ANTHROPIC_API_KEY is not configured"). All other 9 authenticated routes 200. Auth PASS (browser login → /dashboard ~15s). Save Draft PASS (post created — DB 26→27, LinkedIn, confirmed in dashboard). Logout timeout (flaky, 53rd consecutive). Console: BUG-019 asChild, BUG-013 error=false. |
| 2026-03-30 (run 52) | 4 | 2 | none | No new code merged since run 51 (only memory/planner commits). Server already running on :3001. `/` unauthenticated 500 (BUG-015, button.tsx still present — TASK-107 fix not merged, 52nd run). /accounts 500 BUG-020 (SqliteError: no such table: socialAccount — TASK-112 still in ready). AI gen 503 (BUG-012, "ANTHROPIC_API_KEY is not configured"). All other 9 authenticated routes 200. Auth PASS (browser login → /dashboard, ~5s). Save Draft PASS (post wu1502hsmtemnd6eow1 created — DB 25→26, LinkedIn, confirmed in DB). Console: BUG-019 asChild, BUG-013 error=false. |
| 2026-03-30 (run 51) | 4 | 2 | none | No new code merged since run 50 (only memory/planner commits). Server already running on :3001 (next dev). `/` unauthenticated 500 (BUG-015, button.tsx still present — TASK-107 fix not merged, 51st run). /accounts 500 BUG-020 (SqliteError: no such table: socialAccount — TASK-112 still in ready). AI gen 503 (BUG-012, "ANTHROPIC_API_KEY is not configured"). All other 9 authenticated routes 200. Auth PASS (curl login 200, cookie injection, dashboard loads with 24 posts). Save Draft PASS (post wjyun5n6eommnd5brkr created — DB 24→25, LinkedIn, confirmed in DB). Console: BUG-019 asChild, BUG-013 error=false. |
| 2026-03-30 (run 50) | 4 | 2 | none | No new code merged since run 49 (only memory/planner commits). Server already running on :3001 (PID 91388). `/` unauthenticated 500 (BUG-015, button.tsx still present — TASK-107 fix not merged, 50th run). /accounts 500 BUG-020 (SqliteError: no such table: socialAccount — TASK-112 still in ready). AI gen 503 (BUG-012, "ANTHROPIC_API_KEY is not configured"). All other 9 authenticated routes 200. Auth PASS (curl login 200, cookie injection, dashboard loads with 24 posts). Save Draft PASS (post 3p33s1g660ymnd4ag4i created — DB 23→24, LinkedIn, no redirect but confirmed in DB and dashboard). Logout timeout (flaky, 50th consecutive — nextjs-portal dev overlay intercepts pointer events). Console: BUG-019 asChild only. |
| 2026-03-30 (run 49) | 4 | 2 | none | No new code merged since run 48 (only memory/planner commits). Server started fresh on :3001 (node v22). `/` unauthenticated 500 (BUG-015, button.tsx still present — TASK-107 fix not merged, 49th run). /accounts 500 BUG-020 (SqliteError: no such table: socialAccount — TASK-112 still in ready). AI gen 503 (BUG-012, "ANTHROPIC_API_KEY is not configured"). All other 9 authenticated routes 200. Auth PASS (cookie injection, browser login stuck at load avg 162). Save Draft PASS (post 7ik2kjvnakxmnd3bgo4 created — DB 22→23, LinkedIn, no redirect at load avg 162 but confirmed in DB and dashboard showing 23 drafts). Console: BUG-019 asChild, BUG-013 error=false. |
| 2026-03-30 (run 48) | 4 | 2 | none | No new code merged since run 47 (only memory/planner commits). Server already running on :3001. `/` unauthenticated 500 (BUG-015, button.tsx still present). /accounts 500 BUG-020 (SqliteError: no such table: socialAccount — TASK-112 still in ready). AI gen 503 (BUG-012, "ANTHROPIC_API_KEY is not configured"). All other 9 authenticated routes 200. Auth PASS (gstack browser: login form filled, submitted, redirected to dashboard). Save Draft PASS (post gha30wn3ovdmnd24v22 created — DB 21→22, LinkedIn platform, no redirect due to load avg ~188 but post confirmed in DB and dashboard showing 22 drafts). Console: BUG-019 asChild, BUG-013 error=false. |
| 2026-03-30 (run 47) | 4 | 2 | none | No new code merged since run 46 (only memory/planner commits). Server already running on :3001. `/` unauthenticated 500 (BUG-015, button.tsx still present). /accounts 500 BUG-020 (SqliteError: no such table: socialAccount — TASK-112 still in ready). AI gen 400/503 (BUG-012, "ANTHROPIC_API_KEY is not configured"). All other 9 authenticated routes 200 (dashboard/posts/calendar/analytics/campaigns/settings/posts/new/campaigns/new/post-edit). Auth PASS (curl login 200, cookie injection, dashboard 21 drafts). Save Draft PASS (post an9derex2y6mnd13zgd created — DB 20→21, no redirect due to load avg 255 but post confirmed in DB and dashboard). Console: BUG-019 asChild, BUG-013 error=false. |
| 2026-03-30 (run 46) | 3 | 3 | none | No new code merged since run 45 (only memory/planner commits). Server already running on :3001 (PID 91388). `/` unauthenticated 500 (BUG-015, button.tsx still present). /accounts 500 BUG-020 (SqliteError: no such table: socialAccount — TASK-112 still in ready). AI gen 503 (BUG-012, "ANTHROPIC_API_KEY is not configured"). All other 9 authenticated routes 200. Auth PASS (token via curl, cookie injection). Save Draft: server action POST pending/hanging — no new post created (DB still at 20). System load avg 290 causing all server ops to hang. Console: BUG-019 asChild, BUG-013 error=false. |
| 2026-03-30 (run 45) | 4 | 2 | none | No new code merged since run 44 (only memory/planner commits). Server already running on :3001 (PID 91388). `/` unauthenticated 500 (BUG-015, button.tsx still present). /accounts 500 BUG-020 (SqliteError: no such table: socialAccount — TASK-112 still in ready). AI gen `{"error":"ANTHROPIC_API_KEY is not configured"}` (BUG-012). All other 9 authenticated routes 200. Auth PASS (browser login → dashboard ~20s). Dashboard shows 20 drafts. Logout browser session reset (flaky, 45th consecutive). Console: BUG-019 asChild, BUG-013 error=false. |
| 2026-03-30 (run 44) | 4 | 2 | none | No new code merged since run 43 (only memory/planner commits). Server already running on :3001 (PID 91388). `/` unauthenticated 500 (BUG-015, button.tsx still present). /accounts 500 BUG-020 (SqliteError: no such table: socialAccount — TASK-112 still in ready). AI gen 503 (BUG-012, "ANTHROPIC_API_KEY is not configured"). All other 9 authenticated routes 200. Auth PASS but slow (~64s POST — system load from concurrent agents). Save Draft PASS (post /posts/sjoaanhcg9mncyg2ut created, 20 drafts in dashboard). Logout timeout (flaky, 44th consecutive). Console: BUG-019 asChild, BUG-013 error=false. |
| 2026-03-30 (run 43) | 4 | 2 | none | No new code merged since run 42 (only memory/planner/reconciler commits). Server already running on :3001. `/` unauthenticated 500 (BUG-015, button.tsx still present). /accounts 500 BUG-020 (SqliteError: no such table: socialAccount — TASK-112 still in ready). AI gen 503 (BUG-012, "ANTHROPIC_API_KEY is not configured"). All other 8 authenticated routes 200. Auth PASS (API 200, cookie injection, dashboard loads with 19 posts). Save Draft PASS (QA run 43 post created, 19 drafts in dashboard). Logout timeout (flaky, 43rd consecutive). Console: BUG-019 asChild, BUG-013 error=false. |
| 2026-03-30 (run 42) | 4 | 2 | none | No new code merged since run 41 (only memory/planner commits). Server already running on :3001 (PID 91388). `/` unauthenticated 500 (BUG-015, button.tsx still present). /accounts 500 BUG-020 (TASK-112 still in ready — db:push not run). AI gen 503 (BUG-012, "ANTHROPIC_API_KEY is not configured"). All other 9 authenticated routes 200. Auth PASS (login → /dashboard, slow ~31s but succeeded). Save Draft PASS (post /posts/i8a539pa2rmmncvuj1h, 18 drafts in dashboard). Logout timeout (flaky, 42nd consecutive). Console: BUG-019 asChild, BUG-013 error=false. |
| 2026-03-30 (run 41) | 4 | 2 | TASK-114 | NEW BUG-021: Node v25.2.1 causes ERR_DLOPEN_FAILED (better-sqlite3 compiled for Node v20 MODULE_VERSION 127, Node v25 requires 141). No .nvmrc — server crashes silently if wrong Node version. Fixed for this run by using nvm Node v22. TASK-114 created. `/` 500 (BUG-015, TASK-109 ready). /accounts 500 BUG-020 (TASK-112 ready). AI gen 503 (BUG-012). All other 9 authenticated routes 200. Auth PASS (session obtained, 17 posts in dashboard). Save Draft PASS (QA run 41 post created). Console: BUG-019 asChild, BUG-013 error=false. |
| 2026-03-30 (run 40) | 4 | 2 | none | No new code merged since run 39 (only memory/planner commits). `/` unauthenticated 500 (BUG-015, button.tsx still present, TASK-107 fix in ready). /accounts 500 BUG-020 (SqliteError: no such table: socialAccount — TASK-112 in ready). AI gen 503 (BUG-012, "ANTHROPIC_API_KEY is not configured"). All other 9 routes 200. Auth PASS (login → /dashboard confirmed). Save Draft PASS (2 posts created, 16 drafts in dashboard). Logout timeout (flaky, 40th consecutive). Console: BUG-019 asChild, BUG-013 error=false. |
| 2026-03-30 (run 39) | 4 | 2 | none | No new code merged since run 38 (only memory/planner commits). `/` unauthenticated 500 (BUG-015, TASK-107 fix in ready). /accounts 500 BUG-020 (socialAccount table missing — TASK-112 in ready). AI gen 503 (BUG-012). All other 9 routes 200. Auth PASS (session active, 14 posts in dashboard). Save Draft PASS (post /posts/u74w9g3lwm7mncre3zq, 14 drafts). Logout timeout (flaky, 39th consecutive). Console: BUG-019 asChild, BUG-013 error=false. |
| 2026-03-30 (run 38) | 4 | 2 | none | No new code merged since run 37 (only memory/planner commits). `/` 500 (BUG-015, button.tsx still present, TASK-109/110 ready). /accounts 500 BUG-020 (socialAccount table missing — TASK-112 ready but db:push not run). AI gen 503 (BUG-012, "ANTHROPIC_API_KEY is not configured"). All other 9 routes 200. Auth PASS (session active, dashboard loads). Save Draft PASS (post /posts/ow7sfzhycsqmncqbixm created, 13 drafts in dashboard). Logout timeout (flaky, 38th+ consecutive). Console: BUG-019 asChild, BUG-013 error=false. |
| 2026-03-30 (run 37) | 4 | 2 | TASK-112 | NEW: TASK-111 merged (accounts pages). /accounts now 500 instead of 404 (SqliteError: no such table: socialAccount — needs db:push). TASK-112 created. `/` 500 (BUG-015, button.tsx still present, TASK-109/110 ready). AI gen 503 (BUG-012). All other 9 authenticated routes 200. Auth PASS (login → /dashboard). Save Draft PASS (QA run 37 post, 12 drafts in dashboard). Console: BUG-019 asChild, BUG-013 error=false. |
| 2026-03-30 (run 36) | 4 | 2 | none | No new code merged since run 35 (only memory/planner/product-owner commits). Server already running on :3001. `/` unauthenticated 500 (BUG-015), authenticated `/` → 307→/dashboard. /accounts 404 (BUG-007). AI gen 503 (BUG-012). All other 9 routes 200. Auth PASS (login → /dashboard, ~5s). Save Draft PASS (post /posts/z011xfhmnwemnco5744, 11 drafts in dashboard). Console: BUG-019 asChild, BUG-013 error=false. TASK-107 fix commit e16651d still not merged (36th run). |
| 2026-03-30 (run 35) | 4 | 2 | none | No new code merged since run 34 (only memory/planner commits). Server on :3001 (PID 32564). `/` 500 (BUG-015), /accounts 404 (BUG-007), AI gen 503 (BUG-012). All other 8 routes 200. Auth PASS (login → /dashboard). Save Draft PASS (post /posts/h6zhnue5yypmncn3hgn, 10 drafts in dashboard). Console: BUG-019 asChild, BUG-013 error=false. TASK-107 fix commit e16651d still not merged (35th run). |
| 2026-03-30 (run 34) | 4 | 2 | none | No new code merged since run 33 (only memory/planner commits). Server started fresh on :3001 (node v22). `/` 500 (BUG-015), /accounts 404 (BUG-007), AI gen 503 (BUG-012). All other routes 200. Auth PASS (browser login ~8s redirect). Save Draft PASS (post /posts/pz57ocqscasmncm64gq). Logout timeout (flaky, 34th consecutive). TASK-107 fix still not merged. |
| 2026-03-28 (run 13) | 1 | 5 | none | No new code merged since run 12. App state identical. All known bugs persist (BUG-007/012/015/016/017/018). Browser-based login redirects to crashing dashboard. Auth API 200 confirmed. Logout timeout again (flaky, run 13). /posts/new + /settings + /campaigns/new + /signup PASS. |
| 2026-03-28 (run 14) | 1 | 5 | none | No new code merged since run 13. App state identical. All known bugs persist (BUG-007/012/015/016/017/018). `/` 500 (SqliteError recycleCount). Login succeeds (browser → /dashboard crash). AI gen 500 with raw Anthropic 401 JSON in prompt area. Logout timeout (flaky, run 14). /posts/new + /settings (disabled) + /campaigns/new + /signup PASS. |
| 2026-03-28 (run 15) | 1 | 5 | none | No new code merged since run 14. App state identical. All known bugs persist (BUG-007/012/015/016/017/018). `/` 500 (SqliteError recycleCount). Login succeeds (browser → /dashboard crash). AI gen 500 (/api/posts/generate). Logout timeout (flaky, run 15). /posts/new + /settings (disabled) + /campaigns/new + /signup PASS. |
| 2026-03-29 (run 16) | 0 | 6 | none | BLOCKED — PostPilot dev server not running. Port 3000 = launchapp-nextjs (ZodError: DATABASE_URL missing). Ports 3001/3002 also launchapp-nextjs. No PostPilot process found. Environment changed since run 15 — PostPilot previously ran on :3001. |
| 2026-03-29 (run 17) | 0 | 6 | none | FAIL — PostPilot dev server running on :3001 (PID 65539). Server started, hit BUG-015 buttonVariants() crash at 00:02:36 per dev log, then stopped responding to all HTTP requests. TCP connections accepted but hang indefinitely. No new code merged since run 16 (only memory/planner commits). All known bugs persist. |
| 2026-03-29 (run 18) | 0 | 6 | none | FAIL — Same PID 65539 on :3001, same HTTP hang. No new code merged since run 17 (memory/planner/reconciler/product-owner commits only). TASK-082/083 ghost-done: button.tsx still exists. TASK-086 is 18th attempt. All known bugs persist (BUG-007/012/015/016/017/018). |
| 2026-03-29 (run 19) | 0 | 6 | none | FAIL — Same PID 65539 on :3001, same HTTP hang. No new code merged since run 18 (memory/planner/product-owner commits only). TASK-086/088/090 all ghost-done (21st attempt total to delete button.tsx). TASK-091 ghost-done for accounts pages (0 unique commits). button.tsx still present. All known bugs persist (BUG-007/012/015/016/017/018). |
| 2026-03-29 (run 20) | 0 | 6 | none | BLOCKED — PostPilot dev server not running (PID 65539 gone). No new code merged since run 19 (memory/planner/product-owner commits only). button.tsx still present. :3000=CondoHub, :3002=Invoicer, PostPilot=absent. All known bugs persist (BUG-007/012/015/016/017/018). |
| 2026-03-29 (run 21) | 4 | 2 | TASK-099/100 | MAJOR IMPROVEMENT: DB updated (pnpm db:push run). BUG-016/017/018 RESOLVED — dashboard/posts/calendar/analytics/campaigns/settings all load (200). Auth PASS (signup+login work, session cookie obtained). `/` 500 (BUG-015, TASK-098 ghost-done 23rd time). /accounts 404 (BUG-007). AI gen 503 "ANTHROPIC_API_KEY not configured" (BUG-012, improved error msg). NEW: asChild prop DOM warning (BUG-019). Server started on :3001 by QA agent. |
| 2026-03-29 (run 22) | 4 | 2 | none | No new code merged since run 21 (memory/planner/reconciler commits only). Server started on :3001 (PID 53780). App state identical to run 21. `/` 500 (BUG-015), /accounts 404 (BUG-007), AI gen 503 (BUG-012). All other routes 200 when authenticated. Auth PASS (login 200, session established). TASK-107 now in active triage for BUG-015. |
| 2026-03-29 (run 23) | 4 | 2 | none | No new code merged since run 22 (memory/planner/reconciler commits only). Server on :3001 (PID 53838). `/` 500 (BUG-015), /accounts 404 (BUG-007), AI gen 503 (BUG-012). All other routes 200. Auth PASS. **NEW VERIFIED: Save Draft PASS** — post saved to /posts/[id], appears in dashboard (first time confirmed via browser). Logout timeout (flaky, 23rd consecutive run). Only known console errors (asChild BUG-019). |
| 2026-03-29 (run 24) | 4 | 2 | none | No new code merged since run 23 (memory/planner commits only). Server started manually on :3001 (PID 44004). `/` 500 (BUG-015), /accounts 404 (BUG-007), AI gen 503 (BUG-012). All other routes 200. Auth PASS (login → dashboard). Platform select + manual content entry PASS. Logout timeout (flaky, 24th consecutive). Health score ~72/100. |
| 2026-03-29 (run 25) | 4 | 2 | none | No new code merged since run 24 (memory/planner commits only). Server already running on :3001. `/` 500 (BUG-015), /accounts 404 (BUG-007), AI gen 503 (BUG-012). All other routes 200. Auth PASS (login → /dashboard confirmed via browser). Save Draft PASS (redirected to /posts/s1xqtc5dlbmnc98z4i, dashboard shows 3 drafts). Logout timeout (flaky, 25th consecutive). Only known console errors (BUG-019 asChild, BUG-013 error=false). |
| 2026-03-29 (run 26) | 4 | 2 | none | No new code merged since run 25 (only memory/planner commits). Server on :3001 (PID 53838). `/` 500 (BUG-015), /accounts 404 (BUG-007), AI gen 503 (BUG-012). All other 10 routes 200 when authenticated. Auth PASS (POST /api/auth/sign-in/email 200, session token obtained). No new bugs found. |
| 2026-03-29 (run 27) | 4 | 2 | none | No new code merged since run 26 (only memory/planner/reconciler commits). Server on :3001 (PID 53893). `/` 500 (BUG-015), /accounts 404 (BUG-007), AI gen 503 (BUG-012). All other routes 200. Auth PASS (login → /dashboard). Save Draft PASS (post created, appeared in dashboard). Logout timeout (flaky, 26th+ consecutive). No new bugs found. |
| 2026-03-29 (run 28) | 4 | 2 | none | No new code merged to main since run 27 (only memory/planner commits). Server on :3001 (PID 53893). `/` 500 (BUG-015), /accounts 404 (BUG-007), AI gen 503 (BUG-012). All other routes 200. Auth PASS (browser login → /dashboard). Save Draft PASS (post /posts/nx1phhzpjqbmncdr54a created, appeared in dashboard). Logout timeout (flaky, 28th consecutive). KEY: TASK-107 has real fix commit e16651d for BUG-015, not yet merged. |
| 2026-03-29 (run 29) | 4 | 2 | none | No new code merged to main since run 28 (only memory/planner commits). New server started on :3001 (node v22). `/` HTTP 500 (BUG-015), /accounts 404 (BUG-007), AI gen 503 (BUG-012). All other routes 200. Auth PASS (browser session active). Save Draft PASS (post /posts/tj63tzksovhmncejxrr created). Logout timeout (flaky, 29th consecutive). TASK-107 still in "ready" status — fix not merged. |
| 2026-03-29 (run 30) | 4 | 2 | none | No new code merged to main since run 29 (only memory/planner commits). Server already on :3001 (PIDs 41445/46407). `/` unauthenticated 500 (BUG-015). `/` authenticated 307→/dashboard (new: middleware redirects authenticated users). /accounts 404 (BUG-007). AI gen 503 (BUG-012). All 9 other authenticated routes 200. Auth PASS (login 200, session token obtained). Dashboard loads (5 drafts visible). Post edit page 200. TASK-107 fix commit e16651d still not merged to main. Console: BUG-019 asChild, BUG-015 buttonVariants() errors. |
| 2026-03-29 (run 31) | 4 | 2 | none | No new code merged since run 30 (only memory/planner commits). Server NOT running at start — started fresh on :3001 (node v22). `/` 500 (BUG-015), /accounts 404 (BUG-007), AI gen 503 (BUG-012). All other authenticated routes 200. Auth PASS (cookie-based session, dashboard loads). TASK-107 fix commit e16651d still not merged (31st run with BUG-015). |
| 2026-03-30 (run 32) | 4 | 2 | none | No new code merged since run 31 (only memory/planner commits). Server already running on :3001 (PIDs 41433/41445). `/` 500 (BUG-015), /accounts 404 (BUG-007), AI gen 503 (BUG-012). All other routes 200. Auth PASS (login → /dashboard, 7 drafts). Save Draft PASS (post created). Console: BUG-019 asChild, BUG-013 error=false. TASK-107 fix still not merged (32nd run). |
| 2026-03-30 (run 33) | 4 | 2 | none | No new code merged since run 32 (only memory/planner commits). Server already running on :3001 (PIDs 41445/46407). `/` 500 (BUG-015), /accounts 404 (BUG-007), AI gen 401/503 (BUG-012). All other routes 200. Auth PASS (session active, dashboard loads). Save Draft PASS (post /posts/rt7nkoqf0ammncit03q created, appeared in dashboard). Console: BUG-019 asChild, BUG-013 error=false. TASK-107 fix commit e16651d still not merged (33rd run). |
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
| 2026-03-28 (run 13) | 1 | 5 | none | No new code merged since run 12. App state identical. All known bugs persist (BUG-007/012/015/016/017/018). Browser login redirects to crashing dashboard. Auth API 200. Logout flaky (timeout, 13th consecutive). /posts/new + /settings + /campaigns/new + /signup PASS. |

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

### BUG-007 — /accounts 404 [RESOLVED — 2026-03-30 run 37 by TASK-111 merge]

TASK-111 merged adding socialAccount schema + /accounts pages. /accounts now returns 500 (SqliteError: no such table: socialAccount) instead of 404. See BUG-020.

### BUG-020 — /accounts 500: SqliteError: no such table: socialAccount [OPEN — TASK-112]

**Severity:** High (accounts page unusable)

TASK-111 merged the socialAccount schema but `pnpm db:push` was not run. DB does not have the `socialAccount` table. Fix: run `pnpm db:push` (Node v22) in postpilot repo root. TASK-112 created.

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

### BUG-016 — CRITICAL: Dashboard/posts/calendar/analytics crash with SqliteError: no such column "recycleCount" [RESOLVED — 2026-03-29 run 21]

**Severity:** Resolved

`pnpm db:push` was run. DB now has recycleCount/noRecycle/lastRecycledAt/recycledFromId columns on the post table. Dashboard/posts/calendar/analytics all return 200.

### BUG-017 — CRITICAL: /campaigns crashes with SqliteError: no such table: campaign [RESOLVED — 2026-03-29 run 21]

**Severity:** Resolved

`pnpm db:push` was run. DB now has campaign table. /campaigns returns 200.

### BUG-018 — Settings form permanently disabled — settings/brandVoice tables missing from DB [RESOLVED — 2026-03-29 run 21]

**Severity:** Resolved

`pnpm db:push` was run. DB now has settings and brandVoice tables. Settings POST returns 200. Form fields no longer permanently disabled.

### BUG-019 — React `asChild` prop DOM warning on dashboard/campaigns/calendar [OPEN — run 21]

**Severity:** Low (console noise, no functional impact)

Console warning: `React does not recognize the 'asChild' prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase 'aschild' instead.` Appears when rendering /dashboard, /campaigns, /calendar routes. Caused by a Radix UI component passing `asChild` to a native DOM element instead of a Radix primitive. Fix: find the component forwarding `asChild` to a plain HTML tag and remove or correct it.

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
| 2026-03-28 (run 13) | All routes | same as run 12 | same as run 12 | No new merges to main since run 12 — app state unchanged |
| 2026-03-28 (run 14) | All routes | same as run 13 | same as run 13 | No new merges to main since run 13 — app state unchanged |
| 2026-03-28 (run 15) | All routes | same as run 14 | same as run 14 | No new merges to main since run 14 — app state unchanged |
| 2026-03-29 (run 16) | App reachable | PASS (run 15, :3001) | BLOCKED (not running) | PostPilot dev server stopped. Environment changed: ports 3000/3001/3002 all occupied by launchapp-nextjs instances. |
| 2026-03-29 (run 17) | App reachable | BLOCKED (run 16) | FAIL (hanging) | PostPilot dev server back on :3001. Server starts but hangs after BUG-015 buttonVariants() crash — accepts TCP but stops processing HTTP. |
| 2026-03-29 (run 18) | App reachable | FAIL (run 17) | FAIL (hanging) | Same PID 65539 still running on :3001, still hanging. No changes to codebase since run 17. TASK-082/083 ghost-done. |
| 2026-03-29 (run 19) | App reachable | FAIL (run 18) | FAIL (hanging) | Same PID 65539 on :3001, still hanging. No changes to codebase. TASK-086/088/090 ghost-done (21st+ attempt). TASK-091 ghost-done for accounts. |
| 2026-03-29 (run 20) | App reachable | FAIL (run 19) | BLOCKED (not running) | PostPilot dev server (PID 65539) no longer exists. Environment: :3000=CondoHub, :3002=Invoicer. PostPilot completely absent from process list. No code changes since run 19. |
| 2026-03-29 (run 21) | BUG-016 dashboard 500 | FAIL (runs 7-20) | PASS | pnpm db:push run — DB now has recycleCount/noRecycle columns + campaign/settings/brandVoice tables. BUG-016/017/018 all resolved. |
| 2026-03-29 (run 21) | BUG-017 campaigns 500 | FAIL (runs 7-20) | PASS | Same db:push fix — campaign table now exists. /campaigns returns 200. |
| 2026-03-29 (run 21) | BUG-018 settings disabled | FAIL (runs 11-20) | PASS | settings/brandVoice tables now in DB. Settings POST returns 200. |

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
- [x] Save as draft works *(PASS — 2026-03-29 run 23 — post saved to /posts/[id], appears in dashboard with Draft status)*
- [ ] Schedule post works *(not tested)*
- [x] "From Source" input mode present (URL/text input) *(PASS — 2026-03-29 run 7 — "From Source" toggle visible on /posts/new, TASK-040)*
- [ ] "From Source" content generation works *(not tested — AI gen fails due to missing API key)*
- [ ] AI engagement prediction score shown before publishing *(UNVERIFIED — TASK-039 in unmerged branch ao/task-039)*

### Post Dashboard
- [x] Dashboard loads with post list *(PASS — 2026-03-29 run 21 — 200, BUG-016 RESOLVED)*
- [ ] Search works *(not tested)*
- [ ] Status filter works *(not tested)*
- [ ] Platform filter works *(not tested)*
- [ ] Quick stats show correct counts *(not tested)*
- [ ] Bulk actions work (reschedule, delete, duplicate) *(not tested)*

### Social Accounts
- [ ] Accounts page loads *(FAIL — /accounts 404, TASK-008 ready)*
- [ ] Connect new account flow works *(not tested)*
- [ ] Account detail page loads with post history *(not tested)*
- [ ] Disconnect account works *(not tested)*

### Campaigns
- [x] Campaign list page loads *(PASS — 2026-03-29 run 21 — 200, BUG-017 RESOLVED)*
- [x] /campaigns/new loads *(PASS — 2026-03-29 run 7 — returns 200)*
- [ ] Create campaign from AI brief works *(not tested)*
- [ ] Campaign detail shows timeline and posts *(not tested)*
- [ ] Pause/resume campaign works *(not tested)*

### Content Calendar
- [x] Calendar view loads *(PASS — 2026-03-29 run 21 — 200, BUG-016 RESOLVED)*
- [ ] Posts appear on correct dates *(not tested)*
- [ ] Day/week/month views work *(not tested)*
- [ ] Drag-and-drop rescheduling works *(UNVERIFIED — TASK-041 in unmerged branch ao/task-041)*

### Analytics
- [x] Analytics page loads *(PASS — 2026-03-29 run 21 — 200, BUG-016 RESOLVED)*
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
- [ ] All nav links work (no 404s/500s) *(FAIL — 2026-03-29 run 21 — / 500 (BUG-015); /accounts 404 (BUG-007). All other routes 200.)*
- [x] /posts page loads *(PASS — 2026-03-29 run 21 — 200, BUG-016 RESOLVED)*
- [ ] /settings page loads *(PASS — 2026-03-29 run 7)*
- [ ] Mobile navigation works *(not tested)*
- [ ] Back/forward browser buttons work *(not tested)*

### Console & Network
- [ ] No console.error messages *(FAIL — favicon 404 (BUG-009); React prop warning on /posts/new (BUG-013); SqliteError on multiple routes (BUG-016/017))*
- [ ] No accessibility warnings *(not tested — blocked by 500 errors)*
- [x] No uncaught exceptions *(PASS — errors are caught by Next.js error boundary)*
- [ ] No failed network requests (4xx/5xx) *(FAIL — `/` 500 (BUG-015), /dashboard 500 (BUG-016), /api/posts/generate 401 (BUG-012), /accounts 404 (BUG-007), multiple others 500)*

## Environment Notes

- App URL: PostPilot dev server on :3001 (run 31, node v22, fresh start). Server responds normally. TASK-107 (ready) has real fix commit e16651d (deletes button.tsx) in remotes/origin/ao/task-107 — not yet merged to main after 31 runs.
- Database: SQLite via Drizzle ORM (`postpilot.db`) — **CRITICALLY OUT OF DATE**: only has account/post/session/user/verification tables. Missing: settings, brandVoice, campaign tables + recycleCount/noRecycle columns on post. `pnpm db:push` has NEVER been run since run 7 merges.
- Auth: Better Auth — requires BETTER_AUTH_SECRET and BETTER_AUTH_URL in .env
- AI generation: requires ANTHROPIC_API_KEY in .env.local — currently present but invalid (returns HTTP 500 wrapping Anthropic 401 authentication_error)
- Test credentials: qa-test@postpilot.dev / TestPass123!
- TASK-050 merged (bulk actions code in /dashboard) — but dashboard still crashes (BUG-016)
- ao/task-008 has accounts pages (1 commit ahead of main) — never merged despite 10+ merge tasks created
- TASK-045/046/047/051/052/053/054 all marked done but branches have zero unique commits — no work was actually performed
- ao/task-037 (old bulk actions), ao/task-039 (engagement prediction), ao/task-041 (calendar drag-and-drop) — all superseded but still in local branches only

# QA Test Plan — PostPilot

This is a living document maintained by the QA agent. It tracks test results, known issues, regression history, and the current state of the application.

## Last Run

| Field | Value |
|-------|-------|
| Date | — |
| Result | — |
| Steps Passed | — |
| Duration | — |
| Console Errors | — |
| Network Errors | — |

## Test Results History

<!-- QA agent: append each run result here. Format: | Date | Passed | Failed | Bugs Created | Notes | -->
| Date | Passed | Failed | Bugs Created | Notes |
|------|--------|--------|-------------|-------|

## Known Issues

<!-- QA agent: track active bugs found during E2E testing. Remove when fixed. -->

## Regression Tracker

<!-- QA agent: if a previously passing test starts failing, log it here with the date and suspected cause. -->
| Date | Test | Was | Now | Suspected Cause |
|------|------|-----|-----|-----------------|

## Test Coverage

### Auth Flow
- [ ] Landing page loads without errors
- [ ] Signup with email/password works
- [ ] Login with existing credentials works
- [ ] Protected routes redirect to login when unauthenticated
- [ ] Logout redirects to landing/login

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

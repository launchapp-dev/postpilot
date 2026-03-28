@AGENTS.md

# PostPilot — Coding Agent Guide

## What Is This?

An AI-native social media automation platform. Users sign up, connect social accounts, generate AI content, schedule posts, and track performance across platforms. Built as an open-source showcase of what AO (Agent Orchestrator) + gstack can autonomously build.

## Tech Stack

- **Next.js 15** — App Router, TypeScript, `src/` directory
- **@launchapp/design-system** — shadcn registry with Radix UI primitives and `--la-*` CSS tokens
- **Tailwind CSS v4** — Styling
- **Auth**: Better Auth — email/password signup/login, session management
- **Database**: SQLite + Drizzle ORM — all data stored per-user
- **React Hook Form + Zod** — Form state and validation
- **date-fns** — Date manipulation for calendar and scheduling
- **@anthropic-ai/sdk** — AI content generation

## Design System — shadcn Registry

Components are installed from our shadcn registry into `src/components/ui/`. **Do NOT install @launchapp/design-system as an npm package.** Use the shadcn CLI:

### Install components
```bash
npx shadcn@latest add --registry https://launchapp-dev.github.io/design-system/registry.json button
npx shadcn@latest add --registry https://launchapp-dev.github.io/design-system/registry.json button input label card badge separator tabs
```

### Import installed components
```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
```

### CSS tokens
All design tokens use the `--la-` prefix (e.g., `--la-primary`, `--la-background`). These are defined in globals.css.

## Project Structure

```
src/
  app/
    layout.tsx              — Root layout
    page.tsx                — Landing page (unauthenticated)
    globals.css             — Global styles + --la-* design tokens
    (auth)/
      login/page.tsx        — Login page
      signup/page.tsx       — Signup page
    dashboard/
      page.tsx              — Post dashboard (authenticated)
    posts/
      new/page.tsx          — Create/generate post
      [id]/page.tsx         — Edit post
    accounts/
      page.tsx              — Connected social accounts
      new/page.tsx          — Connect new account
      [id]/page.tsx         — Account detail
    campaigns/
      page.tsx              — Campaign list
      new/page.tsx          — Create campaign
      [id]/page.tsx         — Campaign detail
    calendar/
      page.tsx              — Visual content calendar
    analytics/
      page.tsx              — Analytics dashboard
    settings/
      page.tsx              — Brand profile, voice, preferences
  components/
    ui/                     — shadcn registry components (installed via CLI)
    ...
  lib/
    utils.ts                — cn() utility (installed by shadcn)
    auth.ts                 — Auth configuration
    db.ts                   — Drizzle DB client
    ai.ts                   — Anthropic SDK integration
  db/
    schema.ts               — Drizzle schema (users, posts, accounts, campaigns)
    migrations/             — SQL migrations
  types/
    post.ts                 — TypeScript types
    account.ts              — Social account types
    campaign.ts             — Campaign types
```

## Build & Test

```bash
pnpm install
pnpm dev          # Development server on :3000
pnpm build        # Production build
pnpm lint         # ESLint
pnpm db:push      # Push schema to database
pnpm db:migrate   # Run migrations
```

## Working Rules

- Install UI components from the design system registry — never build custom buttons, inputs, cards, etc.
- Import UI components from `@/components/ui/<component>` (NOT from @launchapp/design-system)
- To add a new design system component, run: `npx shadcn@latest add --registry https://launchapp-dev.github.io/design-system/registry.json <component-name>`
- All form state goes through React Hook Form with Zod schemas
- Date formatting and manipulation via date-fns
- Auth-protected routes use middleware or server-side session checks
- All CRUD goes through server actions or API routes backed by Drizzle
- File naming: kebab-case for files, PascalCase for components
- Imports use `@/*` alias (maps to `src/`)
- Do not add yourself as author or co-author in commits
- Do not add comments unless the logic is non-obvious

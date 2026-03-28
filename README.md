# PostPilot

AI-native social media automation platform — built autonomously by [AO (Agent Orchestrator)](https://github.com/launchapp-dev/ao) agents + [gstack](https://github.com/garrytan/gstack).

## What is this?

PostPilot is a social media engine that runs your entire content strategy on autopilot. AI handles content creation, scheduling, publishing, and optimization across all major platforms.

This project serves as a showcase of what AO can autonomously build — from product planning through implementation, code review, QA testing, and shipping.

## Tech Stack

- **Next.js 15** — App Router, TypeScript
- **@launchapp/design-system** — shadcn registry
- **Tailwind CSS v4**
- **Better Auth** — Authentication
- **SQLite + Drizzle ORM** — Database
- **Anthropic Claude API** — AI content generation
- **AO Agent Orchestrator** — Autonomous development pipeline
- **gstack** — Enhanced development workflow skills

## Getting Started

```bash
pnpm install
cp .env.example .env  # Fill in your keys
pnpm db:push
pnpm dev
```

## AO Pipeline

This project is built and maintained by AO agents running on a continuous schedule:

- **Product Owner** — Reviews vision, creates tasks (every 10 min)
- **Planner** — Queues and prioritizes work (every 5 min)
- **Triager** — Validates and routes tasks
- **Implementer** — Writes code with gstack design consultation
- **Reviewer** — Reviews PRs with gstack security audits
- **QA Tester** — E2E browser testing with gstack QA (every 30 min)
- **Reconciler** — Maintains pipeline consistency (every 10 min)
- **PR Sweep** — Scans and merges open PRs (every 3 min)

## License

MIT

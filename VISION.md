# PostPilot — Product Vision

The social media engine that runs your entire content strategy on autopilot. AI-native, multi-platform, built for how brands grow in 2026.

## The Problem

Social media management today is either manual grunt work (write, schedule, post, repeat) or expensive agencies that still can't keep up with the cadence modern platforms demand. Businesses need 3-5 posts per platform per day across 5+ platforms — that's 15-25 pieces of content daily. No human team scales this without burning out or going generic.

## What PostPilot Is

An AI-native social media automation platform where AI handles content creation, scheduling, publishing, and optimization — so businesses focus on strategy, not execution. Feed it your brand voice, product updates, and goals. It generates platform-native content, publishes at optimal times, and learns what works.

## Core Features

### 1. Authentication & Accounts
- Sign up / login with email + password via Better Auth
- OAuth: Google, GitHub
- Protected routes — unauthenticated users see the marketing landing page
- User profile with business defaults (brand name, industry, tone, target audience)

### 2. Social Account Connections
- Connect social media accounts: X/Twitter, LinkedIn, Instagram, TikTok, Bluesky, Threads
- OAuth-based account linking per platform
- Multiple accounts per platform (agency use case)
- Account health status — shows connected/disconnected/rate-limited
- Per-account posting limits and cooldowns

### 3. Brand Voice Configuration
- Define brand voice: tone (professional, casual, witty, authoritative), vocabulary, topics to avoid
- Upload reference content — past posts, blog articles, brand guidelines
- AI learns writing patterns from reference material
- Multiple brand voices per workspace (for agencies managing multiple brands)
- Test voice: generate sample content to preview before going live

### 4. AI Content Generation
- Generate posts from natural language: "Write a thread about our new pricing launch"
- Platform-native formats:
  - X/Twitter: threads, single tweets, quote-tweet hooks
  - LinkedIn: professional posts, carousels, polls
  - Instagram: captions with hashtag strategies, carousel copy, Reel scripts
  - TikTok: video scripts, hook-first format, trending sound suggestions
  - Bluesky: posts optimized for the AT Protocol audience
  - Threads: conversational, reply-chain format
- Content from sources: turn blog posts, product changelogs, press releases into social content
- Variation generation: create 3-5 variants of any post for A/B testing
- Hashtag optimization: AI suggests relevant, high-reach hashtags per platform

### 5. Content Calendar
- Visual calendar view (day, week, month) of all scheduled posts
- Drag-and-drop rescheduling
- Color-coded by platform, status, campaign
- Gaps detection — AI highlights days with no content scheduled
- Optimal time suggestions — shows best posting windows per platform

### 6. Smart Scheduling
- AI learns when YOUR audience engages (not generic "best times")
- Per-platform optimal time slots based on historical engagement data
- Queue-based scheduling: add to queue, PostPilot picks the best time
- Manual scheduling: pick exact date/time
- Time zone aware — schedule in your timezone, publishes in audience's peak
- Frequency limits: prevent over-posting (max N posts per platform per day)

### 7. Publishing Engine
- Multi-platform simultaneous publishing
- Platform-specific formatting (auto-trim for character limits, image sizing)
- Draft → Scheduled → Published → Failed status workflow
- Retry failed posts with exponential backoff
- Preview exactly how the post will look on each platform

### 8. Post Dashboard
- All posts at a glance with status badges: Draft, Scheduled, Published, Failed
- Search by content, platform, campaign, date
- Filter by status, platform, date range, campaign
- Sort by date, engagement, platform
- Bulk actions: reschedule, delete, duplicate, move to campaign
- Quick stats: posts this week, engagement rate, top performer

### 9. Campaign Builder
- Group posts into campaigns (product launch, event promo, seasonal, drip)
- Campaign templates: product launch (teaser → announce → features → social proof)
- AI generates full campaign sequences from a brief
- Campaign timeline with milestone tracking
- Cross-platform campaign coordination
- Pause/resume entire campaigns

### 10. Analytics Dashboard
- Per-post metrics: impressions, clicks, engagement, shares, saves
- Per-platform breakdown: follower growth, engagement rate, reach trends
- Per-campaign performance: ROI tracking against campaign goals
- Content type analysis: which formats perform best (threads vs singles, carousels vs images)
- Best performing times heatmap
- Audience insights: demographics, interests, active hours
- Export reports as PDF or CSV

### 11. Content Recycling
- AI identifies evergreen content from your post history
- Auto-resurface high-performing posts with fresh angles
- Smart rephrasing — never posts the same text twice
- Recycling rules: minimum days between recycles, max recycles per post
- Exclude lists: content that should never be recycled

### 12. Settings & Customization
- Business profile: brand name, logo, industry, website
- Default posting preferences: platforms, frequency, tone
- Notification preferences: email alerts for failed posts, weekly digests
- Team settings: invite members, assign roles (admin, editor, viewer)
- Theme: light/dark mode
- API keys management for connected platforms

## AI Features

### 13. Smart Content Suggestions
- AI analyzes trending topics in your industry and suggests timely posts
- Competitor content analysis — see what's working for similar brands
- Content gap analysis: "You haven't posted about X in 2 weeks"
- Reply suggestions: AI drafts responses to comments and mentions

### 14. Performance Predictions
- Before publishing, AI estimates engagement based on:
  - Historical performance of similar content
  - Posting time and day
  - Platform trends
  - Audience behavior patterns
- Score: "This post is predicted to perform 2.3x above your average"

### 15. Automated A/B Testing
- Publish content variants to different audience segments
- AI tracks which variant performs better
- Auto-promote the winner to the full audience
- Learn and apply insights to future content generation

### 16. Natural Language Commands
- Manage everything via natural language: "Schedule 5 LinkedIn posts for next week about our new feature"
- "Show me my best performing posts from last month"
- "Pause all campaigns for Client X"
- "Generate a product launch campaign for next Tuesday"

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: @launchapp/design-system shadcn registry — install components via `npx shadcn@latest add --registry https://launchapp-dev.github.io/design-system/registry.json <component>`
- **Styling**: Tailwind CSS v4
- **Auth**: Better Auth
- **Database**: SQLite via Drizzle ORM (dev), Postgres for production
- **Forms**: React Hook Form + Zod
- **AI**: Anthropic Claude API for content generation (via @anthropic-ai/sdk)
- **Dates**: date-fns for calendar and scheduling logic
- **Cron/Jobs**: AO daemon for scheduled publishing, recycling, analytics collection

## Design Principles

- **AI-native, not AI-bolted-on** — AI generates content, not just suggests edits
- **Platform-native** — each platform gets content formatted for its unique strengths
- **Mobile-first responsive** — manage content on the go
- **Dark mode** — via design system's --la-* tokens
- **Accessible** — keyboard nav, screen readers, WCAG 2.1 AA
- **Fast** — optimistic UI, no unnecessary loading states
- **Simple to start** — connect an account and publish your first AI post in under 3 minutes
- **Grows with you** — free tier for individuals, paid tiers for teams and agencies

## Pages

1. **/** — Marketing landing page (unauthenticated)
2. **/login** — Login
3. **/signup** — Sign up
4. **/dashboard** — Post dashboard with stats, recent posts, quick actions
5. **/posts/new** — Create/generate post (AI input + editor + platform preview)
6. **/posts/[id]** — View/edit post
7. **/accounts** — Connected social accounts
8. **/accounts/new** — Connect new social account
9. **/accounts/[id]** — Account detail with post history and metrics
10. **/campaigns** — Campaign list
11. **/campaigns/new** — Create campaign from AI brief
12. **/campaigns/[id]** — Campaign detail with timeline and performance
13. **/calendar** — Visual content calendar
14. **/analytics** — Analytics dashboard
15. **/settings** — Brand profile, voice config, team, preferences

## Non-Goals (v1)

- No direct API integration with social platforms (mock publishing for now — real integrations come in v2)
- No real-time social listening / inbox
- No paid ad management (organic only)
- No video editing / image generation (text content focus)
- No white-label / reseller features
- No mobile app (responsive web only)

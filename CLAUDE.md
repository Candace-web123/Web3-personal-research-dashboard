# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Web3 Research Dashboard — a personal Web3 investment research workspace built with Next.js 15 App Router. **V1.2 MVP, all mock data, single page at `/`.** Language is zh-CN throughout the UI.

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # ESLint (next/core-web-vitals + next/typescript)
npm test           # Run smoke tests (node tests/smoke.test.mjs)
npx tsc --noEmit   # Type-check without emitting
```

## Architecture

**Data flow (strict layering):** `data/` → `lib/` → `app/page.tsx` → `components/dashboard/`

| Layer | Directory | Role |
|-------|-----------|------|
| Mock data | `data/` | Static JSON-like snapshots with accessor functions (e.g., `getBtcCycleSnapshot()`). All exported via `data/index.ts` as the public API. |
| Business logic | `lib/` | Pure functions, no React. Transformations, decision synthesis, guards (dev-only assertions), display formatting. |
| App shell | `app/` | Single root `page.tsx` orchestrates data fetching and wiring to components. `layout.tsx` is minimal (metadata + `<body>`). |
| UI components | `components/dashboard/` | Pure presentational components, receive data via props only. No data fetching, no business logic. |

### Key rules

- **`data/index.ts` is the sole public API** for all mock data. Components and lib should never import directly from individual `data/*.ts` files.
- **Lib functions are pure and framework-agnostic** — no React, no `fetch`, no `window`. This keeps business logic portable and testable.
- **Dev-only guard assertions** (`lib/data-guards.ts`) validate mock data invariants in development; they become no-ops in production (`NODE_ENV === "production"`).
- **No sub-routes** — everything lives on `/`. Don't create `app/**/page.tsx` files.
- **Mock data only** — no external API calls, no `fetch`, no `axios`, no database connections.
- **Observation pool ≠ buy list** — all copy must avoid investment advice language. System allows "suggest reduce position" with rationale, forbids absolute buy/sell calls (enforced by `FORBIDDEN_OUTPUT_PHRASES` in `lib/actual-position-compare.ts`).

### Mock data timeline alignment

All V1.2 snapshots (`BTC_CYCLE_SNAPSHOT`, `MARKET_ENVIRONMENT_SNAPSHOT`, `POSITION_ADVICE_SNAPSHOT`, `STRONG_SIGNALS_DAILY_SNAPSHOT`, `DATA_PROVENANCE_DAILY_SNAPSHOT`, `DAILY_REVIEW_SNAPSHOT`) must share the same `asOf` date. Enforced by `assertV12SnapshotsAsOfAligned()`.

### Tailwind styling conventions

Tailwind v4 with `@tailwindcss/postcss`. Color encodings are semantic: emerald for positive/bullish, rose/red for negative/bearish, amber for warnings, zinc/slate for neutral. See `lib/display-utils.ts` for reusable tone helpers (e.g., `alphaGradeTone`, `riskPriorityTone`, `dimensionScoreTone`).

## Task management

Active tasks are documented in `docs/TASKS.md` (V1.2 MVP tasks). Completed TASK-001 through TASK-024; TASK-025 (UI/product review) is in progress. The old task file `tasks/TASKS_Web3_Research_MVP.md` is archived — do not execute tasks from it. PRD is at `docs/PRD.md`.

## Product constraints (V1.2)

- ~30 coins in watchlist universe; only Top 5 movers + Top 10 Alpha shown on homepage — never render the full 30-coin table
- BTC as cycle anchor, not price display
- Page order per PRD 12.1: Decision Hero → BTC cycle → Market environment → Movers Top 5 → Strong signals (chains/sectors/protocols) → Alpha Top 10 → Position advice → Risk warnings → Actual position compare → Daily review (collapsible) → Legacy modules (collapsible)

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Web3 Research Dashboard — a personal Web3 investment research workspace built with Next.js 15 App Router. **V1.3: hybrid live + demo data, single page at `/`.** Language is zh-CN throughout the UI.

**Current state:** P0–P3 complete. Market state engine, risk mode selector, portfolio calculator, and audit trail are all functional. 4 live data sources (CoinGecko, Alternative.me, DeFiLlama, CoinGlass) feed 6 of 11 data fields; remaining 5 fields fall back to demo. P4 (backtesting/review) is next.

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # ESLint (next/core-web-vitals + next/typescript)
npm test           # Run smoke tests (node tests/smoke.test.mjs) — V1.2 coverage only
npm run report     # Generate daily AI research report (requires ANTHROPIC_API_KEY)
npm run report:dry # Assemble report data without AI call (no API key needed)
npx tsc --noEmit   # Type-check without emitting
```

## Architecture

**Data flow:** `data/` + live APIs → `lib/` → `app/page.tsx` → `components/dashboard/`

| Layer | Directory | Role |
|-------|-----------|------|
| Mock data | `data/` | Static JSON-like snapshots with accessor functions. `data/index.ts` is the sole public API. User-editable `data/portfolio-input.ts` for positions. |
| Business logic | `lib/` | Pure functions, no React, no `window`. Decision engines, scoring, display helpers, guards. **Exception:** `lib/real-market-data.ts` does `fetch` — it is the single data boundary; all other lib files remain pure. |
| App shell | `app/` | Single root `page.tsx` (async server component) orchestrates data fetching and wiring to components. `layout.tsx` is minimal (metadata + `<body>`). |
| UI components | `components/dashboard/` | Pure presentational components, receive data via props only. No data fetching, no business logic. Server components except `ActualPositionCompareCard`. |

### V1.3 AI engine pipeline (in `lib/`)

```
real-market-data.ts (fetch) → pipeline.ts (transform) → market-state-engine.ts (classify)
                                                              ↓
risk-mode-selector.ts ← market state + drawdown → portfolio.ts (PnL / allocation / risk check)
                                                              ↓
                         ai-decision-orchestrator.ts (merge live + demo → AiDecisionSnapshot)
                                                              ↓
                         audit.ts (decision record / summary)
```

| Module | Lines | Role |
|--------|-------|------|
| `lib/market-state-engine.ts` | 249 | 7 states × 9 dimensions, scoring-based classification, confidence calc |
| `lib/pipeline.ts` | 72 | RawMarketData → MarketStateInput → assessMarketState(), pure transform |
| `lib/risk-mode-selector.ts` | 213 | MarketRegime → 4 risk modes, drawdown override, P0 event handling |
| `lib/portfolio.ts` | 140 | PnL calc, allocation breakdown, risk check against mode |
| `lib/audit.ts` | 95 | DecisionRecord create / user action / outcome / summarize |
| `lib/ai-decision-orchestrator.ts` | 146 | Wires all 5 engines, merge live + demo, produces AiDecisionSnapshot |
| `lib/real-market-data.ts` | 206 | **Sole fetch boundary.** CoinGecko, Alternative.me, DeFiLlama, CoinGlass |

### Live data sources

| Source | Fields | Auth |
|--------|--------|------|
| CoinGecko | `btcPriceUsd`, `ethPriceUsd` | None (rate-limited) |
| Alternative.me | `fearGreed` | None |
| DeFiLlama | `stablecoinTrend` | None |
| CoinGlass | `avgFundingRate`, `oiChangeRate` | `COINGLASS_API_KEY` env var |

Fields still demo: `btc200dMa`, `btc200dMaSlope`, `ethBtcTrend`, `total3BtcTrend`, `etfFlowDirection`.

### Knowledge base & report pipeline

```
knowledge/  +  prompts/  +  live APIs  →  scripts/run-daily-report.mjs  →  reports/
```

| Directory | Content |
|-----------|---------|
| `knowledge/` | 5 framework docs: market regime, position sizing, BTC cycle, product rules, Web3 concepts |
| `prompts/` | System role prompt + daily report template |
| `scripts/run-daily-report.mjs` | Assembles context, calls Anthropic API |
| `reports/` | Generated reports (`.md` / `.json`), gitignored |

### Key rules

- **`data/index.ts` is the sole public API** for mock data. Components and lib files import from `@/data`, never from individual `data/*.ts` files.
- **Lib functions are pure** (except `real-market-data.ts`). No React, no `window`, no DOM. Business logic stays portable and testable.
- **`lib/real-market-data.ts` is the only file allowed to `fetch`.** All API calls go through it; the rest of the codebase consumes its return values.
- **Dev-only guard assertions** (`lib/data-guards.ts`) validate mock data invariants in development; they become no-ops in production (`NODE_ENV === "production"`).
- **No sub-routes** — everything lives on `/`. Don't create `app/**/page.tsx` files.
- **Observation pool ≠ buy list** — all copy must avoid investment advice language. System allows "suggest reduce position" with rationale, forbids absolute buy/sell calls (enforced by `FORBIDDEN_OUTPUT_PHRASES` in `lib/actual-position-compare.ts`).
- **Live data never breaks the page.** API failures/timeouts → null values → `mergeMarketData()` falls back to demo. Every fetcher has try/catch + timeout.

### Two MarketRegime types (intentional split)

- `data/types.ts` → **V1.2 4-state** (StrongRiskOn / NeutralRotation / Cautious / Defensive) — used by legacy V1.2 components
- `lib/market-state-engine.ts` → **V1.3 7-state** (StrongTrendBull / BtcSoloRally / AltRotation / NeutralRange / Defensive / EuphoriaEnd / BearMarketBounce) — used by V1.3 AI engine and new components

Do NOT mix them. V1.2 components consume from `@/data`; V1.3 components consume from `lib/ai-decision-orchestrator`.

### Tailwind styling conventions

Tailwind v4 with `@tailwindcss/postcss`. Color encodings are semantic: emerald for positive/bullish, rose/red for negative/bearish, amber for warnings, zinc/slate for neutral. See `lib/display-utils.ts` for reusable tone helpers.

## Task management

- Completed: TASK-001 through TASK-025 (V1.2 MVP), P0–P3 (V1.3 AI engine + live data)
- Next: P4 (backtesting / review)
- Task file: `docs/TASKS.md` (V1.2 only; V1.3 tasks tracked in conversation)
- Old `tasks/TASKS_Web3_Research_MVP.md` is archived — do not execute tasks from it
- PRD: `docs/PRD.md`

## Product constraints

- ~30 coins in watchlist universe; only Top 5 movers + Top 10 Alpha shown on homepage — never render the full 30-coin table
- BTC as cycle anchor, not price display
- Page order: Decision Hero → BTC cycle → Market environment → Movers Top 5 → **AI 决策辅助** (market state + risk mode + portfolio + risk check + audit) → Strong signals (chains/sectors/protocols) → Alpha Top 10 → Position advice → Risk warnings → Actual position compare → Daily review (collapsible) → Legacy modules (collapsible)
- All V1.2 snapshots share the same `asOf` date (enforced by `assertV12SnapshotsAsOfAligned()`)

## AI Decision Support System (V1.3)

### System goals

1. Improve decision quality — every judgment based on framework rules + data
2. Reduce failure rate — proactively recommend defense in adverse conditions
3. Control drawdowns — three-level drawdown response before losses expand
4. Avoid emotional trading — identify FOMO, panic, revenge trading signals
5. Improve position management — dynamically adjust risk exposure by market state
6. Improve market stage accuracy — consistent judgments via state machine framework

### Decision framework (mandatory order)

Agent must follow this sequence for every analysis:

1. **Determine market state** → use `knowledge/market-regime-framework.md` (7 states)
2. **Select risk mode** → use `knowledge/position-sizing-framework.md` (4 modes)
3. **Give position advice** → output specific structure + stop-loss levels
4. **Scan emotional signals** → check for FOMO/panic/impulse patterns

Skipping any step invalidates the analysis.

### Knowledge base

| File | Content |
|------|---------|
| `knowledge/market-regime-framework.md` | 7 market states × 9 dimensions: conditions, risk levels, position ranges, dos/don'ts, transition signals |
| `knowledge/position-sizing-framework.md` | 4 risk modes: conservative/neutral/aggressive/risk-off. Drawdown control (3-level), add/reduce rules, anti-FOMO rules, emotional discipline |
| `knowledge/btc-cycle-framework.md` | BTC 6-stage cycle: MVRV/NUPL/Puell matrix, indicator weights, position ranges per stage, transition signals |
| `knowledge/product-rules.md` | Hard boundaries: forbidden phrases, position advice limits, no-auto-trade rule, output requirements |
| `knowledge/web3-concepts.md` | Domain dictionary: stages, regimes, dimensions, tiers, transmission types, risk taxonomy, sector taxonomy |

### Agent boundaries

**Can do:**
- Determine market state (7-state classification)
- Give position range advice with specific percentages
- Recommend reducing positions with rationale
- Flag "not recommended" directions
- Identify and warn about emotional trading signals
- Generate structured daily decision brief

**Cannot do:**
- Execute trades or connect to exchanges
- Give exact buy/sell prices (ranges only)
- Promise returns or predict prices
- Violate `FORBIDDEN_OUTPUT_PHRASES`
- Give position advice without first determining market state
- Use leverage (any mode)

### Key hard constraints

- Total position drawdown −15% → unconditional risk-off mode + 48h cooldown
- No new positions when funding rate >0.15% or fear & greed >85
- No new positions when BTC below 200D MA (conservative/neutral modes)
- Single coin stop-loss: BTC −10%, ETH −12%, alts −8~−12%, hotspots −5%
- 7 no-chase conditions defined in `knowledge/position-sizing-framework.md`

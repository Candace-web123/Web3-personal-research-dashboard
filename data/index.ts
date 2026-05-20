import { aiFramework } from "./ai-framework";
import { ALPHA_POOL } from "./alpha-pool";
import { assets } from "./assets";
import { BTC_CYCLE_SNAPSHOT } from "./btc-cycle";
import { MARKET_ENVIRONMENT_SNAPSHOT } from "./market-environment";
import { MOVERS_TOP5 } from "./movers-top5";
import { narratives } from "./narratives";
import { POSITION_ADVICE_SNAPSHOT } from "./position-advice";
import { DAILY_REVIEW_SNAPSHOT } from "./daily-review";
import { RISK_WARNINGS_DASHBOARD } from "./risk-warnings-dashboard";
import { DATA_PROVENANCE_DAILY_SNAPSHOT } from "./data-provenance";
import { STRONG_SIGNALS_DAILY_SNAPSHOT } from "./strong-signals";
import { WATCHLIST_UNIVERSE } from "./watchlist-universe";
import type { AiFramework, Asset, Narrative } from "./types";

// --- 旧版 MVP mock 访问器 ---

export function getAssets(): Asset[] {
  return assets;
}

export function getNarratives(): Narrative[] {
  return narratives;
}

export function getAiFramework(): AiFramework[] {
  return aiFramework;
}

// --- V1.2 mock 访问器（便于未来替换为 API）---

export function getWatchlistUniverse() {
  return WATCHLIST_UNIVERSE;
}

export function getMoversTop5() {
  return MOVERS_TOP5;
}

export function getBtcCycleSnapshot() {
  return BTC_CYCLE_SNAPSHOT;
}

export function getMarketEnvironmentSnapshot() {
  return MARKET_ENVIRONMENT_SNAPSHOT;
}

export function getAlphaPool() {
  return ALPHA_POOL;
}

export function getPositionAdviceSnapshot() {
  return POSITION_ADVICE_SNAPSHOT;
}

export function getStrongSignalsDailySnapshot() {
  return STRONG_SIGNALS_DAILY_SNAPSHOT;
}

export function getDataProvenanceDailySnapshot() {
  return DATA_PROVENANCE_DAILY_SNAPSHOT;
}

export function getDailyReviewSnapshot() {
  return DAILY_REVIEW_SNAPSHOT;
}

export function getRiskWarningsDashboard() {
  return RISK_WARNINGS_DASHBOARD;
}

/** V1.2 全部快照聚合（单一入口，供 lib / 页面消费） */
export function getV12MockSnapshots() {
  return {
    watchlistUniverse: WATCHLIST_UNIVERSE,
    moversTop5: MOVERS_TOP5,
    btcCycle: BTC_CYCLE_SNAPSHOT,
    marketEnvironment: MARKET_ENVIRONMENT_SNAPSHOT,
    alphaPool: ALPHA_POOL,
    positionAdvice: POSITION_ADVICE_SNAPSHOT,
    strongSignals: STRONG_SIGNALS_DAILY_SNAPSHOT,
    dataProvenance: DATA_PROVENANCE_DAILY_SNAPSHOT,
    dailyReview: DAILY_REVIEW_SNAPSHOT
  } as const;
}

// --- V1.2 常量导出 ---

export { ALPHA_POOL } from "./alpha-pool";
export { BTC_CYCLE_SNAPSHOT } from "./btc-cycle";
export { MARKET_ENVIRONMENT_SNAPSHOT } from "./market-environment";
export { POSITION_ADVICE_SNAPSHOT } from "./position-advice";
export { MOVERS_TOP5 } from "./movers-top5";
export type { MoverTop5Entry } from "./movers-top5";
export { WATCHLIST_UNIVERSE } from "./watchlist-universe";
export { STRONG_SIGNALS_DAILY_SNAPSHOT } from "./strong-signals";
export { DATA_PROVENANCE_DAILY_SNAPSHOT } from "./data-provenance";
export { DAILY_REVIEW_SNAPSHOT } from "./daily-review";
export { RISK_WARNINGS_DASHBOARD } from "./risk-warnings-dashboard";

// --- 类型与枚举 ---

export type {
  AiFramework,
  AlphaGrade,
  AlphaPoolEntry,
  AllocationRange,
  Asset,
  AssetChainName,
  AssetSectorName,
  BtcCycleSnapshot,
  DecisionCardViewModel,
  MarketEnvironmentSnapshot,
  Narrative,
  PositionAdviceSnapshot,
  RiskTag,
  StrongChainEntry,
  StrongProtocolEntry,
  StrongSectorEntry,
  StrongSignalMetric,
  StrongSignalsDailySnapshot,
  WatchlistUniverseEntry,
  TokenTransmissionJudgement,
  CardDataProvenanceSummary,
  DataProvenance,
  DataProvenanceDailySnapshot,
  DailyReviewSnapshot,
  ActualPositionInput,
  ActualPositionCompareResult,
  ActualPositionRecommendation,
  ActualPositionCategoryComparison,
  ActualPositionAnalysisMode,
  ActualPositionRiskStyle,
  ActualPositionCompareStatus,
  ActualPositionCategory,
  TomorrowPositionCondition
} from "./types";
export type { MarketDimensionScore } from "./types";
export {
  AiFrameworkStatus,
  AlphaLifecycleState,
  BtcCycleStage,
  MarketRegime,
  NarrativePriority,
  NarrativeStatus,
  ResearchStatus,
  RiskLevel,
  StrongChainKind,
  UniverseAssetStatus,
  UserRiskProfile,
  WatchlistTier,
  DataProvenanceCardId,
  DataFreshnessStatus,
  DataUpdateFrequency,
  TokenTransmissionType,
  TokenTransmissionStrength
} from "./types";

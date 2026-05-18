import { aiFramework } from "./ai-framework";
import { assets } from "./assets";
import { narratives } from "./narratives";
import type { AiFramework, Asset, Narrative } from "./types";

export function getAssets(): Asset[] {
  return assets;
}

export function getNarratives(): Narrative[] {
  return narratives;
}

export function getAiFramework(): AiFramework[] {
  return aiFramework;
}

export { BTC_CYCLE_SNAPSHOT } from "./btc-cycle";
export { MOVERS_TOP5 } from "./movers-top5";
export type { MoverTop5Entry } from "./movers-top5";
export type {
  AiFramework,
  AlphaGrade,
  Asset,
  AssetChainName,
  AssetSectorName,
  BtcCycleSnapshot,
  Narrative,
  RiskTag,
  WatchlistUniverseEntry
} from "./types";
export {
  AiFrameworkStatus,
  AlphaLifecycleState,
  BtcCycleStage,
  MarketRegime,
  NarrativePriority,
  NarrativeStatus,
  ResearchStatus,
  RiskLevel,
  UniverseAssetStatus,
  WatchlistTier
} from "./types";
export { WATCHLIST_UNIVERSE } from "./watchlist-universe";

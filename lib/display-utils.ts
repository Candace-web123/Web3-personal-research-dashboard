import type { MarketDimensionScore, MarketRegime } from "@/data/types";

export const MARKET_REGIME_LABEL: Record<MarketRegime, string> = {
  StrongRiskOn: "强进攻",
  NeutralRotation: "中性轮动",
  Cautious: "谨慎",
  Defensive: "防守"
};

const BTC_CYCLE_STAGE_LABEL: Record<string, string> = {
  BottomAccumulation: "底部积累",
  EarlyUptrend: "上涨早期",
  MidUptrend: "上涨中期",
  Overheated: "过热",
  TopRisk: "顶部风险",
  DowntrendDefensive: "下跌/防守"
};

export function formatMarketRegime(regime: MarketRegime): string {
  return MARKET_REGIME_LABEL[regime] ?? regime;
}

export function formatBtcCycleStage(stage: string): string {
  return BTC_CYCLE_STAGE_LABEL[stage] ?? stage;
}

export function formatMarketScore(score: number): string {
  return score > 0 ? `+${score}` : String(score);
}

export function formatSymbolList(symbols: readonly string[]): string {
  if (symbols.length === 0) return "—";
  return symbols.join("、");
}

export function formatDimensionScore(score: MarketDimensionScore): string {
  return score > 0 ? `+${score}` : String(score);
}

/** 五维分弱色编码：偏多 / 中性 / 偏空 */
export function dimensionScoreTone(score: MarketDimensionScore): string {
  if (score > 0) {
    return "border-emerald-200 bg-emerald-50 text-emerald-900";
  }
  if (score < 0) {
    return "border-rose-200 bg-rose-50 text-rose-900";
  }
  return "border-zinc-200 bg-zinc-50 text-zinc-700";
}

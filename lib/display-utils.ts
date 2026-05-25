import type {
  AlphaGrade,
  AlphaLifecycleState,
  DataFreshnessStatus,
  DataUpdateFrequency,
  MarketDimensionScore,
  MarketRegime,
  RiskTag,
  StrongChainKind,
  UniverseAssetStatus,
  UserRiskProfile
} from "@/data/types";
import { DataFreshnessStatus as Freshness, DataUpdateFrequency as Freq } from "@/data/types";

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

const UNIVERSE_ASSET_STATUS_LABEL: Record<UniverseAssetStatus, string> = {
  Normal: "普通观察",
  Moving: "异动观察",
  AlphaCandidate: "Alpha 候选",
  DeepDive: "重点深挖",
  RiskElevated: "风险升高",
  Removed: "已移除"
};

export function formatPercentChange(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function formatUniverseAssetStatus(status: UniverseAssetStatus): string {
  return UNIVERSE_ASSET_STATUS_LABEL[status] ?? status;
}

const STRONG_CHAIN_KIND_LABEL: Record<StrongChainKind, string> = {
  CapitalDeposit: "资金沉淀型",
  TradingActive: "交易活跃型",
  AppRevenue: "应用收入型",
  IncentiveDriven: "激励驱动型"
};

export function formatStrongChainKind(kind: StrongChainKind): string {
  return STRONG_CHAIN_KIND_LABEL[kind] ?? kind;
}

export function percentChangeTone(value: number): string {
  if (value > 0) return "text-emerald-700";
  if (value < 0) return "text-rose-700";
  return "text-zinc-600";
}

const ALPHA_LIFECYCLE_LABEL: Record<AlphaLifecycleState, string> = {
  NewlyFound: "新发现",
  Watching: "观察中",
  FocusTracking: "重点跟踪",
  RiskElevated: "风险升高",
  Removed: "已移除"
};

export function formatAlphaLifecycleState(state: AlphaLifecycleState): string {
  return ALPHA_LIFECYCLE_LABEL[state] ?? state;
}

export function alphaGradeTone(grade: AlphaGrade): string {
  switch (grade) {
    case "A":
      return "border-emerald-300 bg-emerald-50 text-emerald-900";
    case "B":
      return "border-sky-200 bg-sky-50 text-sky-900";
    case "C":
      return "border-amber-200 bg-amber-50 text-amber-900";
    case "D":
      return "border-zinc-300 bg-zinc-100 text-zinc-700";
    default:
      return "border-zinc-200 bg-zinc-50 text-zinc-700";
  }
}

export function riskPriorityTone(priority: RiskTag["priority"]): string {
  switch (priority) {
    case "P0":
      return "border-rose-300 bg-rose-50 text-rose-950";
    case "P1":
      return "border-amber-200 bg-amber-50 text-amber-950";
    case "P2":
      return "border-zinc-200 bg-zinc-50 text-zinc-800";
    default:
      return "border-zinc-200 bg-zinc-50 text-zinc-700";
  }
}

const USER_RISK_PROFILE_LABEL: Record<UserRiskProfile, string> = {
  Conservative: "保守型",
  Balanced: "平衡型",
  Aggressive: "进攻型"
};

export function formatUserRiskProfile(profile: UserRiskProfile): string {
  return USER_RISK_PROFILE_LABEL[profile] ?? profile;
}

const RISK_PRIORITY_RANK: Record<RiskTag["priority"], number> = {
  P0: 0,
  P1: 1,
  P2: 2,
  P3: 3
};

/** 按 P0 → P3 排序（不修改原数组） */
export function sortRisksByPriority(
  risks: readonly RiskTag[]
): RiskTag[] {
  return [...risks].sort(
    (a, b) => RISK_PRIORITY_RANK[a.priority] - RISK_PRIORITY_RANK[b.priority]
  );
}

const DATA_FRESHNESS_LABEL: Record<DataFreshnessStatus, string> = {
  [Freshness.Normal]: "\u6b63\u5e38",
  [Freshness.Delayed]: "\u5ef6\u8fdf",
  [Freshness.Unavailable]: "\u4e0d\u53ef\u7528",
  [Freshness.SourceConflict]: "\u53e3\u5f84\u51b2\u7a81",
  [Freshness.ManualOverride]: "\u5df2\u624b\u52a8\u8986\u76d6"
};

const DATA_UPDATE_FREQ_LABEL: Record<DataUpdateFrequency, string> = {
  [Freq.Daily]: "\u6bcf\u65e5",
  [Freq.Weekly]: "\u6bcf\u5468",
  [Freq.EventTriggered]: "\u4e8b\u4ef6\u89e6\u53d1"
};

export function formatDataFreshnessStatus(status: DataFreshnessStatus): string {
  return DATA_FRESHNESS_LABEL[status] ?? status;
}

export function formatDataUpdateFrequency(
  frequency: DataUpdateFrequency
): string {
  return DATA_UPDATE_FREQ_LABEL[frequency] ?? frequency;
}

export function dataFreshnessStatusTone(status: DataFreshnessStatus): string {
  switch (status) {
    case Freshness.Normal:
      return "border-emerald-200 bg-emerald-50 text-emerald-900";
    case Freshness.Delayed:
      return "border-amber-200 bg-amber-50 text-amber-900";
    case Freshness.SourceConflict:
    case Freshness.ManualOverride:
      return "border-violet-200 bg-violet-50 text-violet-900";
    case Freshness.Unavailable:
      return "border-rose-200 bg-rose-50 text-rose-950";
    default:
      return "border-zinc-200 bg-zinc-50 text-zinc-700";
  }
}

export function dataFreshnessHintTone(status: DataFreshnessStatus): string {
  switch (status) {
    case Freshness.Delayed:
      return "border-amber-100 bg-amber-50 text-amber-950";
    case Freshness.SourceConflict:
    case Freshness.ManualOverride:
      return "border-violet-100 bg-violet-50 text-violet-950";
    case Freshness.Unavailable:
      return "border-rose-100 bg-rose-50 text-rose-950";
    default:
      return "border-zinc-200 bg-zinc-50 text-zinc-700";
  }
}

/** Shared display helper: returns "—" for empty/undefined strings */
export function displayOrDash(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}

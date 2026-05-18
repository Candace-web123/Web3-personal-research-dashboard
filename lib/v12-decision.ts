import type { MoverTop5Entry } from "@/data/movers-top5";
import type {
  AlphaGrade,
  AlphaPoolEntry,
  BtcCycleSnapshot,
  DecisionCardViewModel,
  MarketEnvironmentSnapshot,
  MarketRegime,
  PositionAdviceSnapshot,
  RiskTag
} from "@/data/types";
import { AlphaLifecycleState } from "@/data/types";

const TOP_MOVERS_CAP = 5;
const ALPHA_TOP_CAP = 10;
const TOP_RISKS_CAP = 3;

/** 评级优先（A→D），同评级时生命周期优先（重点跟踪→观察中→…） */
const GRADE_RANK: Record<AlphaGrade, number> = {
  A: 0,
  B: 1,
  C: 2,
  D: 3
};

const LIFECYCLE_RANK: Record<AlphaLifecycleState, number> = {
  [AlphaLifecycleState.FocusTracking]: 0,
  [AlphaLifecycleState.Watching]: 1,
  [AlphaLifecycleState.NewlyFound]: 2,
  [AlphaLifecycleState.RiskElevated]: 3,
  [AlphaLifecycleState.Removed]: 4
};

const RISK_PRIORITY_RANK: Record<RiskTag["priority"], number> = {
  P0: 0,
  P1: 1,
  P2: 2,
  P3: 3
};

const MARKET_REGIME_LABEL: Record<MarketRegime, string> = {
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

export type BuildDecisionCardModelParams = {
  btcCycleSnapshot: BtcCycleSnapshot;
  marketEnvironmentSnapshot: MarketEnvironmentSnapshot;
  moversTop5: readonly MoverTop5Entry[];
  alphaTop10: readonly AlphaPoolEntry[];
  positionAdviceSnapshot: PositionAdviceSnapshot;
};

/**
 * 返回当日异动 Top 5（最多 5 条）。
 * MVP：保持输入顺序，不重新排序；不修改原数组。
 */
export function getTopMovers5(
  movers: readonly MoverTop5Entry[]
): readonly MoverTop5Entry[] {
  return movers.slice(0, TOP_MOVERS_CAP);
}

/**
 * 返回 Alpha 观察池 Top 10（最多 10 条）。
 * MVP：按评级 A→D、生命周期优先级轻量排序后截取；不修改原数组。
 */
export function getAlphaTop10(
  alphaPool: readonly AlphaPoolEntry[]
): readonly AlphaPoolEntry[] {
  return [...alphaPool]
    .sort((a, b) => {
      const byGrade = GRADE_RANK[a.grade] - GRADE_RANK[b.grade];
      if (byGrade !== 0) return byGrade;
      return LIFECYCLE_RANK[a.lifecycle] - LIFECYCLE_RANK[b.lifecycle];
    })
    .slice(0, ALPHA_TOP_CAP);
}

function pickTopRisks(
  marketRisks: readonly RiskTag[],
  alphaEntries: readonly AlphaPoolEntry[]
): RiskTag[] {
  const alphaRisks = alphaEntries.flatMap((entry) => entry.risks);
  const merged = [...marketRisks, ...alphaRisks];
  const seen = new Set<string>();

  return merged
    .sort((a, b) => RISK_PRIORITY_RANK[a.priority] - RISK_PRIORITY_RANK[b.priority])
    .filter((risk) => {
      const key = `${risk.priority}:${risk.code}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, TOP_RISKS_CAP);
}

function buildHeadline(
  regime: MarketRegime,
  btcCycleStage: string,
  observationOnly: boolean
): string {
  const regimeLabel = MARKET_REGIME_LABEL[regime];
  const stageLabel = BTC_CYCLE_STAGE_LABEL[btcCycleStage] ?? btcCycleStage;
  const modeHint = observationOnly ? "以观察为主" : "可小幅跟踪机会";
  return `${regimeLabel} · BTC ${stageLabel} · ${modeHint}`;
}

function buildRiskReminder(
  positionAdvice: PositionAdviceSnapshot,
  observationOnly: boolean
): string {
  const chaseHint =
    positionAdvice.doNotChase[0] ??
    "避免追涨仅叙事驱动、缺乏链上验证的标的";
  if (observationOnly) {
    return `今日以观察为主，不宜主动进攻。${chaseHint}`;
  }
  return `新增仓位需分批、控制节奏。${chaseHint}`;
}

function pickAlphaFocusSymbols(alphaTop10: readonly AlphaPoolEntry[]): string[] {
  const focused = alphaTop10.filter(
    (entry) =>
      entry.grade === "A" ||
      entry.lifecycle === AlphaLifecycleState.FocusTracking
  );
  const source = focused.length > 0 ? focused : alphaTop10;
  return source.slice(0, 5).map((entry) => entry.token);
}

/**
 * 合成首页「今日决策卡」ViewModel。
 * ETH/主流、稳定币摘要直接来自 `MarketEnvironmentSnapshot`，不在此写死替代文案。
 */
export function buildDecisionCardModel(
  params: BuildDecisionCardModelParams
): DecisionCardViewModel {
  const {
    btcCycleSnapshot,
    marketEnvironmentSnapshot,
    moversTop5,
    alphaTop10,
    positionAdviceSnapshot
  } = params;

  const asOf =
    marketEnvironmentSnapshot.asOf ||
    btcCycleSnapshot.asOf ||
    positionAdviceSnapshot.asOf;

  const observationOnly = positionAdviceSnapshot.observationOnly;
  const topRisks = pickTopRisks(
    marketEnvironmentSnapshot.topRisks,
    alphaTop10
  );

  return {
    asOf,
    headline: buildHeadline(
      marketEnvironmentSnapshot.regime,
      btcCycleSnapshot.cycleStage,
      observationOnly
    ),
    marketRegime: marketEnvironmentSnapshot.regime,
    marketScore: marketEnvironmentSnapshot.totalScore,
    btcCycleStage: btcCycleSnapshot.cycleStage,
    btcActionBias: btcCycleSnapshot.btcActionBias,
    supportsAltAlphaObservation: btcCycleSnapshot.supportsAltAlphaObservation,
    ethAndMainstreamSummary: marketEnvironmentSnapshot.ethAndMainstreamSummary,
    stablecoinLiquiditySummary: marketEnvironmentSnapshot.stablecoinLiquiditySummary,
    topMoverSymbols: moversTop5.map((mover) => mover.symbol),
    alphaFocusSymbols: pickAlphaFocusSymbols(alphaTop10),
    suitableToAddPosition: positionAdviceSnapshot.suitableToAddPosition,
    observationOnly,
    topRisks,
    conclusion: marketEnvironmentSnapshot.conclusion,
    riskReminder: buildRiskReminder(positionAdviceSnapshot, observationOnly)
  };
}

/** PRD 9.3 / 12.1 — 研究状态 */
export const ResearchStatus = {
  Watchlist: "Watchlist",
  Researching: "Researching",
  ThesisFormed: "ThesisFormed",
  Paused: "Paused"
} as const;
export type ResearchStatus = (typeof ResearchStatus)[keyof typeof ResearchStatus];

/** PRD 9.4 — 风险等级 */
export const RiskLevel = {
  Low: "Low",
  Medium: "Medium",
  High: "High"
} as const;
export type RiskLevel = (typeof RiskLevel)[keyof typeof RiskLevel];

/** PRD 10.3 — 叙事优先级 */
export const NarrativePriority = {
  Low: "Low",
  Medium: "Medium",
  High: "High"
} as const;
export type NarrativePriority = (typeof NarrativePriority)[keyof typeof NarrativePriority];

/** PRD 10.4 — 叙事跟踪状态 */
export const NarrativeStatus = {
  Watching: "Watching",
  Validated: "Validated",
  Paused: "Paused"
} as const;
export type NarrativeStatus = (typeof NarrativeStatus)[keyof typeof NarrativeStatus];

/** PRD 12.3 — AI 框架占位状态 */
export const AiFrameworkStatus = {
  Placeholder: "Placeholder"
} as const;
export type AiFrameworkStatus = (typeof AiFrameworkStatus)[keyof typeof AiFrameworkStatus];

/** PRD 12.1 — 资产观察 */
export type Asset = {
  id: string;
  name: string;
  symbol: string;
  sector: string;
  ecosystem?: string;
  researchStatus: ResearchStatus;
  riskLevel: RiskLevel;
  confidenceScore: number;
  thesis: string;
  nextAction: string;
  updatedAt: string;
};

/** PRD 12.2 — 市场叙事 */
export type Narrative = {
  id: string;
  title: string;
  sector: string;
  signal: string;
  question: string;
  priority: NarrativePriority;
  status: NarrativeStatus;
};

/** PRD 12.3 — AI 分析框架维度 */
export type AiFramework = {
  id: string;
  dimension: string;
  description: string;
  requiredData: string;
  status: AiFrameworkStatus;
};

// --- V1.2 多资产观察池（PRD 四-1.3 资产分层）---

/**
 * V1.2 PRD 四-1.3 — 观察宇宙资产分层。
 * 用于 ~30 币观察池配置；后续 `data/watchlist-universe.ts` 直接引用。
 */
export const WatchlistTier = {
  /** S — BTC 周期锚点 */
  S: "S",
  /** A — ETH / 核心主流资产 */
  A: "A",
  /** B — 稳定币 / 流动性资产 */
  B: "B",
  /** C — 主流板块资产 */
  C: "C",
  /** D — 热点 / Alpha 候选资产 */
  D: "D"
} as const;
export type WatchlistTier = (typeof WatchlistTier)[keyof typeof WatchlistTier];

/** 资产主链名称（轻量 string，mock 中直接填写如 "Ethereum"） */
export type AssetChainName = string;

/** 资产赛道名称（轻量 string，mock 中直接填写如 "L1"） */
export type AssetSectorName = string;

/**
 * V1.2 — 观察宇宙单条资产（基础币种信息，不含当日异动展示字段）。
 * 异动 Top 5 等展示数据由 `data/movers-top5.ts` 单独维护并通过 `id` 关联。
 */
export type WatchlistUniverseEntry = {
  id: string;
  symbol: string;
  name: string;
  tier: WatchlistTier;
  chain: AssetChainName;
  sector: AssetSectorName;
  notes?: string;
  /** 为 true 时不参与 Alpha 同一评分体系（如 B 层稳定币） */
  excludeFromAlphaScoring?: boolean;
};

// --- V1.2 市场环境、池内状态、Alpha 与风险标签（TASK-003）---

/** PRD 5.3 — 市场环境分类 */
export const MarketRegime = {
  /** 强进攻 */
  StrongRiskOn: "StrongRiskOn",
  /** 中性轮动 */
  NeutralRotation: "NeutralRotation",
  /** 谨慎 */
  Cautious: "Cautious",
  /** 防守 */
  Defensive: "Defensive"
} as const;
export type MarketRegime = (typeof MarketRegime)[keyof typeof MarketRegime];

/** PRD 4-1.6 — 观察宇宙中的资产状态 */
export const UniverseAssetStatus = {
  /** 普通观察 */
  Normal: "Normal",
  /** 异动观察 */
  Moving: "Moving",
  /** Alpha 候选 */
  AlphaCandidate: "AlphaCandidate",
  /** 重点深挖 */
  DeepDive: "DeepDive",
  /** 风险升高 */
  RiskElevated: "RiskElevated",
  /** 移除 */
  Removed: "Removed"
} as const;
export type UniverseAssetStatus =
  (typeof UniverseAssetStatus)[keyof typeof UniverseAssetStatus];

/** Alpha 观察池评级 */
export type AlphaGrade = "A" | "B" | "C" | "D";

/** PRD 二十二章 — Alpha 项目生命周期 */
export const AlphaLifecycleState = {
  /** 新发现 */
  NewlyFound: "NewlyFound",
  /** 观察中 */
  Watching: "Watching",
  /** 重点跟踪 */
  FocusTracking: "FocusTracking",
  /** 风险升高 */
  RiskElevated: "RiskElevated",
  /** 移除 */
  Removed: "Removed"
} as const;
export type AlphaLifecycleState =
  (typeof AlphaLifecycleState)[keyof typeof AlphaLifecycleState];

/** PRD 23.3 — 风险标签（提示卡 / Alpha / 市场环境风险列表） */
export interface RiskTag {
  priority: "P0" | "P1" | "P2" | "P3";
  code: string;
  message: string;
  category?: string;
  relatedAssetId?: string;
}

// --- V1.2 BTC 周期快照（TASK-005）---

/** PRD 4.3 — BTC 周期状态分类 */
export const BtcCycleStage = {
  /** 底部积累区 */
  BottomAccumulation: "BottomAccumulation",
  /** 上涨早期 */
  EarlyUptrend: "EarlyUptrend",
  /** 上涨中期 */
  MidUptrend: "MidUptrend",
  /** 过热区 */
  Overheated: "Overheated",
  /** 顶部风险区 */
  TopRisk: "TopRisk",
  /** 下跌/防守区 */
  DowntrendDefensive: "DowntrendDefensive"
} as const;
export type BtcCycleStage = (typeof BtcCycleStage)[keyof typeof BtcCycleStage];

/** PRD 4.4 — BTC 周期卡快照（MVP mock；指标为占位文案，非实时计算） */
export type BtcCycleSnapshot = {
  asOf: string;
  priceUsd: string;
  cycleStage: string;
  mvrv: string;
  nupl: string;
  puellMultiple: string;
  piCycleSignal: string;
  twoHundredWeekMa: string;
  fearGreedIndex: string;
  etfFlowSummary: string;
  macroLiquiditySummary: string;
  currentJudgement: string;
  btcActionBias: string;
  supportsAltAlphaObservation: boolean;
  riskNotes: string[];
};

// --- V1.2 每日市场环境评分（TASK-006）---

/** PRD 5.2 — 单维度环境评分（−1 偏空 / 0 中性 / +1 偏多） */
export type MarketDimensionScore = -1 | 0 | 1;

/** PRD 5.2 / 5.3 — 每日市场环境评分卡快照（MVP mock；非实时计算） */
export type MarketEnvironmentSnapshot = {
  asOf: string;
  stablecoinsScore: MarketDimensionScore;
  defiTvlScore: MarketDimensionScore;
  dexVolumeScore: MarketDimensionScore;
  etfDatScore: MarketDimensionScore;
  macroPolicyScore: MarketDimensionScore;
  totalScore: number;
  regime: MarketRegime;
  conclusion: string;
  ethAndMainstreamSummary: string;
  stablecoinLiquiditySummary: string;
  topRisks: RiskTag[];
};

// --- V1.2 Alpha 观察池（TASK-007）---

/**
 * PRD 9.4 / 13.3 — Alpha 观察池单条记录（MVP mock）。
 * 观察池 ≠ 买入清单；文案仅作跟踪与验证参考。
 */
export type AlphaPoolEntry = {
  id: string;
  /** 关联 `WATCHLIST_UNIVERSE` 的 assetId（若有） */
  universeAssetId?: string;
  projectName: string;
  token: string;
  chain: string;
  sector: string;
  /** 为什么进池（可读短句） */
  thesisLine: string;
  coreMoveSummary: string;
  tokenTransmission: string;
  valuationSupplySummary: string;
  catalyst: string;
  maxRisk: string;
  grade: AlphaGrade;
  lifecycle: AlphaLifecycleState;
  nextVerification: string;
  holderNotes?: string;
  risks: RiskTag[];
};

// --- V1.2 仓位建议（TASK-008）---

/** PRD 11.4 — 用户风险偏好（MVP 默认保守型） */
export const UserRiskProfile = {
  Conservative: "Conservative",
  Balanced: "Balanced",
  Aggressive: "Aggressive"
} as const;
export type UserRiskProfile =
  (typeof UserRiskProfile)[keyof typeof UserRiskProfile];

/** PRD 11.4 / 11.5 — 四类资产占比区间（字符串区间，如 "40-60%"） */
export type AllocationRange = {
  btcEth: string;
  stablecoin: string;
  alpha: string;
  highRiskHotspot: string;
};

/** PRD 11.5 — 今日仓位建议快照（MVP mock；非买入价推荐） */
export type PositionAdviceSnapshot = {
  asOf: string;
  riskProfile: UserRiskProfile;
  marketRegime: MarketRegime;
  btcCycleStage: string;
  btcEthAllocation: string;
  stablecoinAllocation: string;
  alphaAllocation: string;
  highRiskHotspotAllocation: string;
  /** 今日是否适合新增风险仓位（含 Alpha / 热点） */
  suitableToAddPosition: boolean;
  /** 今日是否以观察为主、不宜主动进攻 */
  observationOnly: boolean;
  /** 今日重点深挖 1～3 个项目名 */
  deepDiveProjects: string[];
  /** 不建议追高 / 不宜操作的标的或情形 */
  doNotChase: string[];
  /** 仓位调整理由要点（2～4 条） */
  rationale: string[];
  /** 可选：平衡型区间（默认 UI 不展示） */
  balancedAllocation?: AllocationRange;
};

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

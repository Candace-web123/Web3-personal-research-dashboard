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

// --- V1.2 代币价值传导（TASK-020 · PRD 9.2.1）---

/** PRD 9.2.1 — 传导类型 */
export const TokenTransmissionType = {
  CashFlow: "CashFlow",
  Buyback: "Buyback",
  Usage: "Usage",
  GovernanceExpectation: "GovernanceExpectation",
  None: "None"
} as const;
export type TokenTransmissionType =
  (typeof TokenTransmissionType)[keyof typeof TokenTransmissionType];

/** PRD 9.2.1 — 传导强度 */
export const TokenTransmissionStrength = {
  Strong: "Strong",
  Medium: "Medium",
  Weak: "Weak",
  None: "None",
  /** 数据缺失，不得乐观假设 */
  Uncertain: "Uncertain"
} as const;
export type TokenTransmissionStrength =
  (typeof TokenTransmissionStrength)[keyof typeof TokenTransmissionStrength];

/** PRD 9.2.1 — 代币价值传导人工判断（MVP 标签，非公式评分） */
export type TokenTransmissionJudgement = {
  type: TokenTransmissionType;
  strength: TokenTransmissionStrength;
  /** 判断依据（Holder Revenue / buyback / burn / staking 等，人工摘录） */
  basis: string[];
  /** 是否影响 Alpha 评级 */
  affectsAlphaGrade: boolean;
  /** 人工备注：为何认为能 / 不能受益 */
  note?: string;
};

// --- V1.2 链下尽调（TASK-021 · PRD 13.6）---

/** 单维度尽调状态（人工核对，非链上自动结论） */
export const OffchainDueDiligenceStatus = {
  Confirmed: "Confirmed",
  PartiallyConfirmed: "PartiallyConfirmed",
  Unclear: "Unclear",
  Risky: "Risky",
  NotChecked: "NotChecked"
} as const;
export type OffchainDueDiligenceStatus =
  (typeof OffchainDueDiligenceStatus)[keyof typeof OffchainDueDiligenceStatus];

/** 链下尽调综合风险等级 */
export const OffchainDueDiligenceRiskLevel = {
  Low: "Low",
  Medium: "Medium",
  High: "High",
  Unknown: "Unknown"
} as const;
export type OffchainDueDiligenceRiskLevel =
  (typeof OffchainDueDiligenceRiskLevel)[keyof typeof OffchainDueDiligenceRiskLevel];

/** PRD 13.6 — 项目链下尽调（MVP mock，供是否继续深挖参考） */
export type OffchainDueDiligence = {
  teamBackgroundStatus: OffchainDueDiligenceStatus;
  financingStatus: OffchainDueDiligenceStatus;
  communityActivityStatus: OffchainDueDiligenceStatus;
  productProgressStatus: OffchainDueDiligenceStatus;
  tokenUnlockStatus: OffchainDueDiligenceStatus;
  keyFindings: string[];
  unresolvedQuestions: string[];
  riskLevel: OffchainDueDiligenceRiskLevel;
  /** 最近一次人工复核日期（YYYY-MM-DD） */
  lastReviewedAt: string;
  note?: string;
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
  /** PRD 9.2.1 — 结构化代币传导（替代自由文本） */
  tokenTransmission: TokenTransmissionJudgement;
  valuationSupplySummary: string;
  catalyst: string;
  maxRisk: string;
  grade: AlphaGrade;
  lifecycle: AlphaLifecycleState;
  nextVerification: string;
  holderNotes?: string;
  /** PRD 13.6 — 链下尽调结构化记录 */
  offchainDueDiligence: OffchainDueDiligence;
  risks: RiskTag[];
};

// --- V1.2 每日复盘（TASK-023 · PRD 24.3）---

/**
 * PRD 24.3 — 每日复盘快照（观察记录；非投资建议、非收益复盘）。
 * 用于记录判断偏差、已验证信号与待跟踪风险。
 */
export type DailyReviewSnapshot = {
  asOf: string;
  /** 今日投研结论与操作倾向的一句话回顾 */
  decisionSummary: string;
  /** 今日判断中相对合理的部分 */
  whatWasRight: string[];
  /** 今日判断中的偏差或待修正部分 */
  whatWasWrong: string[];
  /** 明日需要继续验证的信号 */
  signalsToTrackTomorrow: string[];
  /** 需要持续跟踪的风险项 */
  riskFollowUps: string[];
  /** 补充备注（如情绪、信息源干扰等） */
  notes?: string;
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

// --- V1.2 强链 / 强赛道 / 强协议（TASK-022A · PRD 六～八、12.1）---

/** PRD 6.2 — 强链类型（MVP 人工标签，非算法输出） */
export const StrongChainKind = {
  /** 资金沉淀型 */
  CapitalDeposit: "CapitalDeposit",
  /** 交易活跃型 */
  TradingActive: "TradingActive",
  /** 应用收入型 */
  AppRevenue: "AppRevenue",
  /** 激励驱动型 */
  IncentiveDriven: "IncentiveDriven"
} as const;
export type StrongChainKind =
  (typeof StrongChainKind)[keyof typeof StrongChainKind];

/** 关键指标行（mock 展示用，值为人工录入文案） */
export type StrongSignalMetric = {
  label: string;
  value: string;
};

/** PRD 6.1 / 6.2 / 12.4 — 强链 Top 单条 */
export type StrongChainEntry = {
  id: string;
  rank: number;
  chainName: string;
  chainKind: StrongChainKind;
  /** 先结论：今日对该链的一句话判断 */
  headlineConclusion: string;
  /** 再数据：指标摘要行 */
  metrics: StrongSignalMetric[];
  /** 再数据：趋势与资金叙述（非实时计算） */
  dataNarrative: string;
  /** PRD 6.2 — 适合观察的赛道方向 */
  suitableFor: string;
  /** 风险提示（激励型、单日 spike 等） */
  riskNote?: string;
};

/** PRD 7.2 / 12.4 — 强赛道 Top 单条 */
export type StrongSectorEntry = {
  id: string;
  rank: number;
  sectorName: string;
  headlineConclusion: string;
  metrics: StrongSignalMetric[];
  dataNarrative: string;
  /** 多代表协议是否同步走强 */
  resonanceNote: string;
  riskNote?: string;
};

/** PRD 8.2 / 12.5 — 强协议 Top 单条 */
export type StrongProtocolEntry = {
  id: string;
  rank: number;
  protocolName: string;
  token?: string;
  chain: string;
  sector: string;
  headlineConclusion: string;
  metrics: StrongSignalMetric[];
  dataNarrative: string;
  /** PRD 8.1 — 协议强 vs 代币传导（人工判断） */
  protocolVsTokenNote: string;
  riskNote?: string;
};

/** 每日强信号快照（强链 Top3 + 强赛道 Top3 + 强协议 Top5） */
export type StrongSignalsDailySnapshot = {
  asOf: string;
  /** 区块级结论（先结论） */
  sectionHeadline: string;
  /** PRD 19.2 — 今日最强方向，供决策卡引用 */
  strongestDirection: string;
  /** 区块级风险提示 */
  sectionRiskNote?: string;
  chains: StrongChainEntry[];
  sectors: StrongSectorEntry[];
  protocols: StrongProtocolEntry[];
};

// --- V1.2 今日决策卡 ViewModel（TASK-010）---

// --- V1.2 数据可信度（TASK-019 · PRD 13.5、21.5）---

/** PRD 21.5 — 数据新鲜度 / 可信度状态 */
export const DataFreshnessStatus = {
  /** 正常：在预期更新时间内 */
  Normal: "Normal",
  /** 延迟：超过预期 1.5 倍 */
  Delayed: "Delayed",
  /** 不可用：超过预期 3 倍或 API 失败 */
  Unavailable: "Unavailable",
  /** 口径冲突：主备源差异 >10% */
  SourceConflict: "SourceConflict",
  /** 手动覆盖：用户人工修正 */
  ManualOverride: "ManualOverride"
} as const;
export type DataFreshnessStatus =
  (typeof DataFreshnessStatus)[keyof typeof DataFreshnessStatus];

/** 预期更新频率（mock 标注用） */
export const DataUpdateFrequency = {
  Daily: "daily",
  Weekly: "weekly",
  EventTriggered: "event"
} as const;
export type DataUpdateFrequency =
  (typeof DataUpdateFrequency)[keyof typeof DataUpdateFrequency];

/** PRD 13.5 — 单条关键指标的数据可信度记录 */
export type DataProvenance = {
  /** 指标名称（如 BTC 价格、DeFi TVL） */
  metricName: string;
  /** 当前数值（展示 / 评分用，mock 文案） */
  currentValue: string;
  /** 主数据源 */
  primarySource: string;
  /** 备用数据源（可选） */
  fallbackSource?: string;
  /** 数据更新时间（YYYY-MM-DD HH:mm UTC） */
  updatedAtUtc: string;
  /** 预期更新频率 */
  expectedFrequency: DataUpdateFrequency;
  /** 数据状态 */
  status: DataFreshnessStatus;
  /** 是否参与评分 */
  participatesInScoring: boolean;
  /** 异常原因（延迟 / 冲突 / 不可用等） */
  anomalyReason?: string;
  /** 人工覆盖原因（status = ManualOverride 时必填） */
  manualOverrideReason?: string;
};

/** 首页关键卡片的数据可信度摘要（卡片底部展示） */
export const DataProvenanceCardId = {
  Decision: "decision",
  BtcCycle: "btc-cycle",
  MarketEnvironment: "market-environment"
} as const;
export type DataProvenanceCardId =
  (typeof DataProvenanceCardId)[keyof typeof DataProvenanceCardId];

export type CardDataProvenanceSummary = {
  cardId: DataProvenanceCardId;
  /** 卡片级展示用更新时间（通常取关键指标最新一条） */
  displayUpdatedAtUtc: string;
  /** 综合状态（取最严重状态） */
  overallStatus: DataFreshnessStatus;
  /** 主数据源摘要（一句） */
  primarySourcesSummary: string;
  /** PRD 21.5 页面提示（按 overallStatus 生成，mock 可覆盖） */
  statusHint: string;
  /** 该卡关联的关键指标明细 */
  metrics: DataProvenance[];
};

/** 每日数据可信度快照（mock） */
export type DataProvenanceDailySnapshot = {
  asOf: string;
  cards: Record<DataProvenanceCardId, CardDataProvenanceSummary>;
};

// --- V1.2 实际仓位对比分析（TASK-024 · PRD 二十四章）---

/** 分析模式：MVP 为 ManualRuleBased */
export const ActualPositionAnalysisMode = {
  /** 当前 MVP：手动录入 + 规则化对比 */
  ManualRuleBased: "ManualRuleBased",
  /** 未来：真实数据接入辅助 */
  DataAssisted: "DataAssisted",
  /** 未来：多源模型化分析 */
  ModelAssisted: "ModelAssisted"
} as const;
export type ActualPositionAnalysisMode =
  (typeof ActualPositionAnalysisMode)[keyof typeof ActualPositionAnalysisMode];

/** 实际仓位相对参考框架的整体风格 */
export const ActualPositionRiskStyle = {
  Defensive: "Defensive",
  Balanced: "Balanced",
  Aggressive: "Aggressive",
  Overheated: "Overheated",
  Unknown: "Unknown"
} as const;
export type ActualPositionRiskStyle =
  (typeof ActualPositionRiskStyle)[keyof typeof ActualPositionRiskStyle];

/** 单类仓位与参考区间的对比状态 */
export const ActualPositionCompareStatus = {
  BelowRange: "BelowRange",
  InRange: "InRange",
  AboveRange: "AboveRange",
  NeedsReview: "NeedsReview"
} as const;
export type ActualPositionCompareStatus =
  (typeof ActualPositionCompareStatus)[keyof typeof ActualPositionCompareStatus];

/** 仓位对比维度 */
export const ActualPositionCategory = {
  StablecoinCash: "StablecoinCash",
  BtcEth: "BtcEth",
  Alpha: "Alpha",
  HighRisk: "HighRisk",
  OutsideUniverse: "OutsideUniverse"
} as const;
export type ActualPositionCategory =
  (typeof ActualPositionCategory)[keyof typeof ActualPositionCategory];

/** 用户手动录入的实际仓位（MVP；图片仅本地预览） */
export type ActualPositionInput = {
  asOf: string;
  stablecoinCashPercent: number;
  btcEthPercent: number;
  alphaPercent: number;
  highRiskPercent: number;
  outsideUniversePercent?: number;
  concentrationLevel: "Low" | "Medium" | "High" | "Unknown";
  topHoldingSymbol?: string;
  topHoldingPercent?: number;
  manuallyAdjusted: boolean;
  note?: string;
};

/** 单类仓位偏差明细 */
export type ActualPositionCategoryComparison = {
  category: ActualPositionCategory;
  actualPercent: number;
  referenceRangeLabel: string;
  status: ActualPositionCompareStatus;
  explanation: string;
};

/** 最强方向一致性（规则化判断） */
export type StrongestDirectionAlignment =
  | "Aligned"
  | "PartiallyAligned"
  | "NotAligned"
  | "Unknown";

/** 个人仓位建议（规则化；需用户自行执行，非自动交易） */
export type ActualPositionRecommendation = {
  /** 建议动作（明确但不武断） */
  action: string;
  /** 判断依据 */
  rationale: string;
  /** 适用条件 */
  condition: string;
  /** 风险提醒 */
  riskReminder: string;
  /** 失效条件 */
  invalidation: string;
};

/** 实际仓位对比分析结果 */
export type ActualPositionCompareResult = {
  asOf: string;
  analysisMode: ActualPositionAnalysisMode;
  overallStyle: ActualPositionRiskStyle;
  conclusion: string;
  comparisons: ActualPositionCategoryComparison[];
  mismatches: string[];
  /** 结构化个人仓位建议（页面优先展示） */
  positionRecommendations: ActualPositionRecommendation[];
  /** 建议动作摘要（与 positionRecommendations 对应，便于兼容） */
  riskAdjustmentSuggestions: string[];
  strongestDirectionAlignment: StrongestDirectionAlignment;
  dataLimitations: string[];
  futureDataNeeds?: string[];
};

/** PRD 19.2 — 首页今日决策卡展示模型（纯数据，无 React 依赖） */
export type DecisionCardViewModel = {
  asOf: string;
  headline: string;
  marketRegime: MarketRegime;
  marketScore: number;
  btcCycleStage: string;
  btcActionBias: string;
  supportsAltAlphaObservation: boolean;
  ethAndMainstreamSummary: string;
  stablecoinLiquiditySummary: string;
  topMoverSymbols: string[];
  alphaFocusSymbols: string[];
  suitableToAddPosition: boolean;
  observationOnly: boolean;
  topRisks: RiskTag[];
  conclusion: string;
  riskReminder: string;
  /** PRD 19.2 — 今日最强方向（来自强信号快照） */
  strongestDirection?: string;
};

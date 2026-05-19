import type {
  CardDataProvenanceSummary,
  DataProvenance,
  DataProvenanceDailySnapshot
} from "./types";
import {
  DataFreshnessStatus,
  DataProvenanceCardId,
  DataUpdateFrequency
} from "./types";

const AS_OF = "2026-05-18";

const btcPriceMetric: DataProvenance = {
  metricName: "BTC 价格",
  currentValue: "$94,180",
  primarySource: "CoinGecko",
  fallbackSource: "CoinMarketCap",
  updatedAtUtc: "2026-05-18 08:00 UTC",
  expectedFrequency: DataUpdateFrequency.Daily,
  status: DataFreshnessStatus.Normal,
  participatesInScoring: true
};

const btcOnchainMetrics: DataProvenance = {
  metricName: "BTC 链上指标（MVRV / NUPL 等）",
  currentValue: "MVRV 1.85 · NUPL 0.42",
  primarySource: "LookIntoBitcoin（人工摘录）",
  fallbackSource: "Glassnode（未订阅，对照用）",
  updatedAtUtc: "2026-05-17 22:00 UTC",
  expectedFrequency: DataUpdateFrequency.Weekly,
  status: DataFreshnessStatus.Delayed,
  participatesInScoring: true,
  anomalyReason: "链上周报尚未更新至今日 UTC 窗口，评分采用昨日收盘口径"
};

const marketStablecoins: DataProvenance = {
  metricName: "Stablecoins 总市值变化",
  currentValue: "+0.8%（7d）",
  primarySource: "DefiLlama Stablecoins",
  fallbackSource: "CoinGecko Stablecoin Market Cap",
  updatedAtUtc: "2026-05-18 06:30 UTC",
  expectedFrequency: DataUpdateFrequency.Daily,
  status: DataFreshnessStatus.Normal,
  participatesInScoring: true
};

const marketDefiTvl: DataProvenance = {
  metricName: "DeFi TVL",
  currentValue: "$98.2B",
  primarySource: "DefiLlama",
  fallbackSource: "Token Terminal（部分协议）",
  updatedAtUtc: "2026-05-18 05:00 UTC",
  expectedFrequency: DataUpdateFrequency.Daily,
  status: DataFreshnessStatus.SourceConflict,
  participatesInScoring: false,
  anomalyReason:
    "主备源对 3 个 L2 桥接 TVL 口径差异约 12%，已暂停该维度自动加分，待人工确认"
};

const marketDexVolume: DataProvenance = {
  metricName: "DEX Volume（24h）",
  currentValue: "$4.1B",
  primarySource: "DefiLlama DEXs",
  updatedAtUtc: "2026-05-18 07:15 UTC",
  expectedFrequency: DataUpdateFrequency.Daily,
  status: DataFreshnessStatus.Normal,
  participatesInScoring: true
};

const decisionComposite: DataProvenance = {
  metricName: "今日决策卡综合结论",
  currentValue: "中性轮动 · 持有为主",
  primarySource: "市场环境 + BTC 周期 mock 合成",
  updatedAtUtc: "2026-05-18 08:00 UTC",
  expectedFrequency: DataUpdateFrequency.Daily,
  status: DataFreshnessStatus.Delayed,
  participatesInScoring: true,
  anomalyReason: "部分输入指标延迟或口径冲突，结论偏保守"
};

const btcCycleCardSummary: CardDataProvenanceSummary = {
  cardId: DataProvenanceCardId.BtcCycle,
  displayUpdatedAtUtc: "2026-05-18 08:00 UTC",
  overallStatus: DataFreshnessStatus.Delayed,
  primarySourcesSummary: "CoinGecko · LookIntoBitcoin（人工摘录）",
  statusHint: "部分链上指标可能过时，请结合数据时间判断",
  metrics: [btcPriceMetric, btcOnchainMetrics]
};

const marketEnvironmentCardSummary: CardDataProvenanceSummary = {
  cardId: DataProvenanceCardId.MarketEnvironment,
  displayUpdatedAtUtc: "2026-05-18 07:15 UTC",
  overallStatus: DataFreshnessStatus.SourceConflict,
  primarySourcesSummary: "DefiLlama · CoinGecko · Token Terminal（对照）",
  statusHint: "存在口径差异，DeFi TVL 维度已暂停参与评分",
  metrics: [marketStablecoins, marketDefiTvl, marketDexVolume]
};

const decisionCardSummary: CardDataProvenanceSummary = {
  cardId: DataProvenanceCardId.Decision,
  displayUpdatedAtUtc: "2026-05-18 08:00 UTC",
  overallStatus: DataFreshnessStatus.Delayed,
  primarySourcesSummary: "合成自市场环境、BTC 周期与观察池 mock",
  statusHint: "数据可能过时或存在口径冲突，今日判断可信度下降",
  metrics: [
    decisionComposite,
    { ...marketStablecoins },
    { ...btcPriceMetric, participatesInScoring: true }
  ]
};

/** V1.2 每日数据可信度 mock（TASK-019） */
export const DATA_PROVENANCE_DAILY_SNAPSHOT: DataProvenanceDailySnapshot = {
  asOf: AS_OF,
  cards: {
    [DataProvenanceCardId.Decision]: decisionCardSummary,
    [DataProvenanceCardId.BtcCycle]: btcCycleCardSummary,
    [DataProvenanceCardId.MarketEnvironment]: marketEnvironmentCardSummary
  }
};

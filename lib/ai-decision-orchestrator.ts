// AI 决策编排器 · Dashboard 数据组装层
// 串联 5 个引擎模块 → 统一 AiDecisionSnapshot 供页面消费
// 支持 Partial<RawMarketData> 混入真实数据，其余自动 fallback demo

import type { MarketStateResult } from "./market-state-engine";
import type { RawMarketData, PipelineResult } from "./pipeline";
import { buildMarketStateInput } from "./pipeline";
import type { RiskModeResult, DrawdownLevel } from "./risk-mode-selector";
import { selectRiskMode } from "./risk-mode-selector";
import type { PortfolioSnapshot, PortfolioSummary, RiskCheckResult } from "./portfolio";
import { calculatePortfolioSummary, checkAgainstRiskMode } from "./portfolio";
import type { DecisionRecord, AuditSummary } from "./audit";
import { createDecisionRecord, recordUserAction, recordOutcome, summarizeDecisions } from "./audit";

export type AiDecisionSnapshot = {
  asOf: string;
  marketState: MarketStateResult;
  riskMode: RiskModeResult;
  portfolioSummary: PortfolioSummary | null;
  riskCheck: RiskCheckResult | null;
  recentDecisions: DecisionRecord[];
  auditSummary: AuditSummary;
  liveFields: string[];
};

export type AiDecisionWithPipeline = {
  snapshot: AiDecisionSnapshot;
  pipeline: PipelineResult;
};

// ---------------------------------------------------------------------------
// Demo data — 模拟强趋势牛市场景
// ---------------------------------------------------------------------------

function getDemoMarketData(): RawMarketData {
  return {
    btcPriceUsd: 94180,
    ethPriceUsd: 3100,
    btc200dMa: 62000,
    btc200dMaSlope: "up",
    ethBtcTrend: "flat",
    total3BtcTrend: "up",
    etfFlowDirection: "inflow",
    stablecoinTrend: "up",
    fearGreed: 65,
    avgFundingRate: 0.0003,
    oiChangeRate: 0.12,
  };
}

function getDemoPortfolio(): PortfolioSnapshot {
  return {
    asOf: new Date().toISOString().slice(0, 10),
    positions: [
      { asset: "Bitcoin", symbol: "BTC", amount: 0.5, costBasisUsd: 88000, currentPriceUsd: 94180 },
      { asset: "Ethereum", symbol: "ETH", amount: 5, costBasisUsd: 2900, currentPriceUsd: 3100 },
      { asset: "Solana", symbol: "SOL", amount: 30, costBasisUsd: 180, currentPriceUsd: 175 },
      { asset: "Chainlink", symbol: "LINK", amount: 200, costBasisUsd: 15, currentPriceUsd: 16.5 },
    ],
    cashUsd: 25000,
  };
}

function getDemoDecisions(): DecisionRecord[] {
  const d1 = createDecisionRecord(
    "StrongTrendBull", "aggressive",
    "趋势健康，维持激进模式。BTC/ETH 持仓不动，可小幅加仓 Alpha。",
    "BTC > 200D MA + MA 向上 + ETF 流入 + 情绪乐观但非极端。命中 7/8 条件。"
  );
  const d1a = recordUserAction(d1, "followed", "按建议维持仓位，未新增 Alpha");

  const d2 = createDecisionRecord(
    "StrongTrendBull", "aggressive",
    "山寨轮动信号出现。建议观察 TOTAL3/BTC 走势，不急于追涨。",
    "TOTAL3 开始跑赢 BTC，但费率略有上升。等待回踩确认。"
  );
  const d2a = recordUserAction(d2, "pending");

  const d3 = createDecisionRecord(
    "NeutralRange", "neutral",
    "BTC 横盘整理，建议控制仓位在 50% 以下，降低交易频率。",
    "MA 走平，区间震荡。预计持续 1-2 周。属于中性环境。"
  );
  const d3a = recordUserAction(d3, "followed", "减仓至 45%，增加稳定币持仓");
  const d3b = recordOutcome(d3a, "回调如期发生，减仓避免了 −4% 回撤。决策正确。", "correct");

  const d4 = createDecisionRecord(
    "AltRotation", "aggressive",
    "山寨季启动信号增强，建议总仓位提到 75%，Alpha 上限 25%。",
    "ETH/BTC 企稳回升 + TOTAL3 放量突破 + ETF 连续 5 日净流入。情绪健康。"
  );
  const d4a = recordUserAction(d4, "deviated", "未跟进——担心追高，选择观望");
  const d4b = recordOutcome(d4a, "山寨季延续 2 周后见顶。错过涨幅但避免了回调风险。", "neutral");

  return [d1a, d2a, d3b, d4b];
}

// ---------------------------------------------------------------------------
// Merge: 真实数据覆盖 demo，null/undefined 则保留 demo
// ---------------------------------------------------------------------------

function mergeMarketData(
  overrides?: Partial<RawMarketData>,
): { data: RawMarketData; liveKeys: string[] } {
  const demo = getDemoMarketData();
  const liveKeys: string[] = [];

  if (!overrides) return { data: demo, liveKeys };

  const merged = { ...demo };
  for (const k of Object.keys(demo) as (keyof RawMarketData)[]) {
    const v = overrides[k];
    if (v != null) {
      (merged as Record<string, unknown>)[k] = v;
      liveKeys.push(k);
    }
  }
  return { data: merged, liveKeys };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getAiDecisionWithPipeline(
  rawDataOverrides?: Partial<RawMarketData>,
  portfolio?: PortfolioSnapshot,
  drawdown?: DrawdownLevel,
): AiDecisionWithPipeline {
  const { data, liveKeys } = mergeMarketData(rawDataOverrides);
  const pipeline = buildMarketStateInput(data);
  const riskMode = selectRiskMode(pipeline.assessment, drawdown ?? "none");

  const pf = portfolio ?? getDemoPortfolio();
  const portfolioSummary = calculatePortfolioSummary(pf);
  const riskCheck = checkAgainstRiskMode(portfolioSummary, riskMode);

  const decisions = getDemoDecisions();
  const auditSummary = summarizeDecisions(decisions);

  const snapshot: AiDecisionSnapshot = {
    asOf: pf.asOf,
    marketState: pipeline.assessment,
    riskMode,
    portfolioSummary,
    riskCheck,
    recentDecisions: decisions,
    auditSummary,
    liveFields: liveKeys,
  };

  return { snapshot, pipeline };
}

export function getAiDecisionSnapshot(
  rawDataOverrides?: Partial<RawMarketData>,
  portfolio?: PortfolioSnapshot,
  drawdown?: DrawdownLevel,
): AiDecisionSnapshot {
  return getAiDecisionWithPipeline(rawDataOverrides, portfolio, drawdown).snapshot;
}

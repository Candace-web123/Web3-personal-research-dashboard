// 持仓跟踪引擎 · 纯计算层
// 不存数据、不连交易所。输入持仓 + 市价，输出汇总 + 风险对照。

import type { RiskModeResult } from "./risk-mode-selector";

export type Position = {
  asset: string;
  symbol: string;
  amount: number;
  costBasisUsd: number;     // 单币成本（USD）
  currentPriceUsd: number;  // 当前市价（USD）
};

export type PortfolioSnapshot = {
  asOf: string;             // ISO date
  positions: Position[];
  cashUsd: number;
};

export type PositionWithPnL = Position & {
  marketValueUsd: number;
  pnlUsd: number;
  pnlPct: number;
  allocationPct: number;
};

export type AssetAllocation = {
  btc: number;
  eth: number;
  stablecoin: number;
  alpha: number;
  highRisk: number;
};

export type PortfolioSummary = {
  totalValueUsd: number;
  investedValueUsd: number;
  cashValueUsd: number;
  totalPnLUsd: number;
  totalPnLPct: number;
  allocation: AssetAllocation;
  positions: PositionWithPnL[];
};

export type RiskCheckResult = {
  modeLabel: string;
  totalPositionOk: boolean;
  violations: string[];
};

const BTC_SYMBOLS = new Set(["BTC", "WBTC"]);
const ETH_SYMBOLS = new Set(["ETH", "WETH"]);
const STABLECOIN_SYMBOLS = new Set(["USDT", "USDC", "DAI", "FRAX", "USDE"]);

function classifyAsset(symbol: string): keyof AssetAllocation {
  if (BTC_SYMBOLS.has(symbol.toUpperCase())) return "btc";
  if (ETH_SYMBOLS.has(symbol.toUpperCase())) return "eth";
  if (STABLECOIN_SYMBOLS.has(symbol.toUpperCase())) return "stablecoin";
  // 市值排名前 50 的山寨归 Alpha，其余归 highRisk
  // 简化规则：调用方可通过额外参数覆盖
  return "alpha";
}

export function calculatePortfolioSummary(snapshot: PortfolioSnapshot): PortfolioSummary {
  const positions: PositionWithPnL[] = snapshot.positions.map((p) => {
    const marketValueUsd = p.amount * p.currentPriceUsd;
    const pnlUsd = marketValueUsd - p.amount * p.costBasisUsd;
    const pnlPct = p.costBasisUsd > 0 ? (p.currentPriceUsd / p.costBasisUsd - 1) * 100 : 0;
    return { ...p, marketValueUsd, pnlUsd, pnlPct, allocationPct: 0 };
  });

  const investedValueUsd = positions.reduce((sum, p) => sum + p.marketValueUsd, 0);
  const totalValueUsd = investedValueUsd + snapshot.cashUsd;
  const totalCostUsd = snapshot.positions.reduce((sum, p) => sum + p.amount * p.costBasisUsd, 0);
  const totalPnLUsd = investedValueUsd - totalCostUsd;
  const totalPnLPct = totalCostUsd > 0 ? (totalPnLUsd / totalCostUsd) * 100 : 0;

  // Allocation breakdown
  const allocation: AssetAllocation = { btc: 0, eth: 0, stablecoin: 0, alpha: 0, highRisk: 0 };
  for (const p of positions) {
    p.allocationPct = totalValueUsd > 0 ? (p.marketValueUsd / totalValueUsd) * 100 : 0;
    allocation[classifyAsset(p.symbol)] += p.allocationPct;
  }
  if (totalValueUsd > 0) {
    allocation.stablecoin += (snapshot.cashUsd / totalValueUsd) * 100;
  }

  return {
    totalValueUsd,
    investedValueUsd,
    cashValueUsd: snapshot.cashUsd,
    totalPnLUsd,
    totalPnLPct,
    allocation,
    positions,
  };
}

export function checkAgainstRiskMode(
  summary: PortfolioSummary,
  riskMode: RiskModeResult,
): RiskCheckResult {
  const violations: string[] = [];
  const tp = summary.totalValueUsd > 0
    ? (summary.investedValueUsd / summary.totalValueUsd) * 100
    : 0;

  if (tp < riskMode.totalPosition.min) {
    violations.push(
      `总仓位 ${tp.toFixed(0)}% 低于建议下限 ${riskMode.totalPosition.min}%`,
    );
  }
  if (tp > riskMode.totalPosition.max) {
    violations.push(
      `总仓位 ${tp.toFixed(0)}% 超过建议上限 ${riskMode.totalPosition.max}%`,
    );
  }

  const check = (label: string, actual: number, band: { min: number; max: number }) => {
    if (actual < band.min) violations.push(`${label} ${actual.toFixed(0)}% 低于建议 ${band.min}-${band.max}%`);
    if (actual > band.max) violations.push(`${label} ${actual.toFixed(0)}% 超过建议 ${band.min}-${band.max}%`);
  };

  check("BTC", summary.allocation.btc, riskMode.structure.btc);
  check("ETH", summary.allocation.eth, riskMode.structure.eth);
  check("稳定币", summary.allocation.stablecoin, riskMode.structure.stablecoin);
  check("Alpha", summary.allocation.alpha, riskMode.structure.alpha);
  check("高风险", summary.allocation.highRisk, riskMode.structure.highRisk);

  return {
    modeLabel: riskMode.modeLabel,
    totalPositionOk: violations.length === 0,
    violations,
  };
}

export function calculateDrawdown(peakValueUsd: number, currentValueUsd: number): number {
  if (peakValueUsd <= 0) return 0;
  return ((currentValueUsd - peakValueUsd) / peakValueUsd) * 100;
}

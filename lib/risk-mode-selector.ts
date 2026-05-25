// 仓位决策引擎 · 风险模式选择器
// 基于 market-state-engine 输出 + knowledge/position-sizing-framework.md
// 纯函数，无 I/O，无 React

import type { MarketStateResult } from "./market-state-engine";
import { MarketRegime } from "./market-state-engine";

export const RiskMode = {
  Conservative: "conservative",
  Neutral: "neutral",
  Aggressive: "aggressive",
  RiskOff: "riskOff",
} as const;
export type RiskMode = (typeof RiskMode)[keyof typeof RiskMode];

export const RISK_MODE_LABEL: Record<RiskMode, string> = {
  conservative: "保守模式", neutral: "中性模式",
  aggressive: "激进模式", riskOff: "风险关闭模式",
};

export type DrawdownLevel = "none" | "warn" | "action" | "force";

export type PositionBand = { min: number; max: number };

export type PositionStructure = {
  btc: PositionBand;
  eth: PositionBand;
  stablecoin: PositionBand;
  alpha: PositionBand;
  highRisk: PositionBand;
};

export type StopLosses = {
  totalPortfolio: number;
  btc: number;
  eth: number;
  alpha: number;
  highRisk: number;
};

export type RiskModeResult = {
  mode: RiskMode;
  modeLabel: string;
  totalPosition: PositionBand;
  structure: PositionStructure;
  stopLosses: StopLosses;
  drawdownRules: { warn: number; action: number; force: number };
  forbiddenActions: string[];
  addPositionRule: string;
  reducePositionRule: string;
  overrideReason?: string;
};

// ---------------------------------------------------------------------------
// Regime → Risk Mode 映射
// ---------------------------------------------------------------------------

const REGIME_TO_MODE: Record<MarketRegime, RiskMode> = {
  [MarketRegime.StrongTrendBull]: RiskMode.Aggressive,
  [MarketRegime.BtcSoloRally]: RiskMode.Neutral,
  [MarketRegime.AltRotation]: RiskMode.Aggressive,
  [MarketRegime.NeutralRange]: RiskMode.Neutral,
  [MarketRegime.Defensive]: RiskMode.Conservative,
  [MarketRegime.EuphoriaEnd]: RiskMode.RiskOff,
  [MarketRegime.BearMarketBounce]: RiskMode.Conservative,
};

// ---------------------------------------------------------------------------
// Mode-specific configs
// ---------------------------------------------------------------------------

interface ModeConfig {
  totalPosition: PositionBand;
  structure: PositionStructure;
  stopLosses: StopLosses;
  drawdownRules: { warn: number; action: number; force: number };
  forbiddenActions: string[];
  addPositionRule: string;
  reducePositionRule: string;
}

const MODE_CONFIGS: Record<RiskMode, ModeConfig> = {
  [RiskMode.Conservative]: {
    totalPosition: { min: 15, max: 30 },
    structure: {
      btc: { min: 10, max: 20 }, eth: { min: 5, max: 10 },
      stablecoin: { min: 60, max: 75 }, alpha: { min: 3, max: 8 },
      highRisk: { min: 0, max: 0 },
    },
    stopLosses: { totalPortfolio: -10, btc: -10, eth: -12, alpha: -12, highRisk: -5 },
    drawdownRules: { warn: -8, action: -12, force: -15 },
    forbiddenActions: [
      "禁止在 200D MA 下方新增任何仓位",
      "禁止因「跌了很多应该见底了」而抄底",
      "禁止因无聊而在震荡中频繁交易",
    ],
    addPositionRule:
      "BTC 站上 200D MA ≥3 天 + 恐惧贪婪 ≥40 + ETF 转流入 + 无 P0/P1 风险（全部满足）",
    reducePositionRule:
      "BTC 跌破前低 / P0 风险事件 / 总仓位浮亏 >10% / 稳定币脱锚（任一触发即执行）",
  },

  [RiskMode.Neutral]: {
    totalPosition: { min: 40, max: 60 },
    structure: {
      btc: { min: 25, max: 35 }, eth: { min: 10, max: 18 },
      stablecoin: { min: 35, max: 50 }, alpha: { min: 10, max: 18 },
      highRisk: { min: 0, max: 3 },
    },
    stopLosses: { totalPortfolio: -12, btc: -10, eth: -12, alpha: -12, highRisk: -5 },
    drawdownRules: { warn: -8, action: -12, force: -15 },
    forbiddenActions: [
      "禁止在区间中间位置频繁开平仓",
      "禁止因「震荡太久该突破了」而提前押注方向",
      "禁止总交易频率超过每周 3 次",
    ],
    addPositionRule:
      "BTC 放量突破震荡区间 / ETH/BTC 走强 / ETF 持续流入 / 稳定币市值上升 / 市场状态转强趋势（≥3 项满足）",
    reducePositionRule:
      "BTC 跌破震荡区间下沿 / ETF 持续流出 ≥3 天 / 单币跌幅 >12% / P1 级以上风险（任一触发即执行）",
  },

  [RiskMode.Aggressive]: {
    totalPosition: { min: 70, max: 90 },
    structure: {
      btc: { min: 30, max: 40 }, eth: { min: 15, max: 25 },
      stablecoin: { min: 10, max: 20 }, alpha: { min: 15, max: 25 },
      highRisk: { min: 3, max: 8 },
    },
    stopLosses: { totalPortfolio: -15, btc: -10, eth: -12, alpha: -10, highRisk: -5 },
    drawdownRules: { warn: -10, action: -15, force: -15 },
    forbiddenActions: [
      "禁止满仓——即使激进模式也保留 10-20% 现金",
      "禁止追高已涨超 30%（7 日内）的标的",
      "禁止单币超过总仓位 18%",
      "禁止因「这次不一样」而忽略减仓信号",
    ],
    addPositionRule:
      "BTC 回调 5-8% 不破关键均线 / ETF 流入持续 / 稳定币增长 / 山寨轮动健康 / 费率正常（≥3 项满足）",
    reducePositionRule:
      "BTC 单日跌 >6% 且破 20D MA / 恐惧贪婪 >85 / 费率 >0.15% / OI 异常飙升 / ETH/BTC 连续 5 日走弱 / ETF 大额流出（任一触发即执行）",
  },

  [RiskMode.RiskOff]: {
    totalPosition: { min: 0, max: 10 },
    structure: {
      btc: { min: 0, max: 8 }, eth: { min: 0, max: 5 },
      stablecoin: { min: 75, max: 100 }, alpha: { min: 0, max: 0 },
      highRisk: { min: 0, max: 0 },
    },
    stopLosses: { totalPortfolio: -5, btc: -5, eth: -5, alpha: -5, highRisk: -5 },
    drawdownRules: { warn: -5, action: -10, force: -15 },
    forbiddenActions: [
      "禁止交易任何山寨",
      "禁止因「跌了很多」就提前结束风险关闭",
      "禁止在风险关闭期做短线",
      "禁止跳过 48 小时冷静期",
    ],
    addPositionRule:
      "触发条件已消除 + 市场状态转非高风险 + 恐惧贪婪<60 + 稳定币环境安全 + 48h 冷静期（全部满足）",
    reducePositionRule: "已处于风险关闭模式。触发条件消除且满足恢复条件后方可重新评估。",
  },
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function selectRiskMode(
  assessment: MarketStateResult,
  drawdown: DrawdownLevel = "none",
  p0Event: boolean = false,
): RiskModeResult {
  let mode = REGIME_TO_MODE[assessment.regime];
  let overrideReason: string | undefined;

  // P0 风险事件 → 强制风险关闭，最高优先级
  if (p0Event) {
    mode = RiskMode.RiskOff;
    overrideReason = "P0 级风险事件触发，强制转入风险关闭模式";
  }

  // 回撤强制线 → 无条件风险关闭
  if (drawdown === "force") {
    mode = RiskMode.RiskOff;
    overrideReason = "总仓位回撤触及 −15% 强制线，转入风险关闭模式。48 小时冷静期。";
  } else if (drawdown === "action" && mode !== RiskMode.RiskOff) {
    // 回撤行动线 → 降至更保守模式
    if (mode === RiskMode.Aggressive) {
      mode = RiskMode.Neutral;
      overrideReason = "总仓位回撤触及 −12% 行动线，激进模式降至中性模式";
    } else if (mode === RiskMode.Neutral) {
      mode = RiskMode.Conservative;
      overrideReason = "总仓位回撤触及 −12% 行动线，中性模式降至保守模式";
    }
  } else if (drawdown === "warn" && mode === RiskMode.Aggressive) {
    overrideReason = "总仓位回撤触及预警线，暂停新增仓位，审视持仓";
  }

  const cfg = MODE_CONFIGS[mode];
  return {
    mode,
    modeLabel: RISK_MODE_LABEL[mode],
    totalPosition: cfg.totalPosition,
    structure: cfg.structure,
    stopLosses: cfg.stopLosses,
    drawdownRules: cfg.drawdownRules,
    forbiddenActions: cfg.forbiddenActions,
    addPositionRule: cfg.addPositionRule,
    reducePositionRule: cfg.reducePositionRule,
    ...(overrideReason ? { overrideReason } : {}),
  };
}

import type {
  ActualPositionCompareContext,
  ActualPositionCompareResult,
  ActualPositionCompareStatus,
  ActualPositionConcentration,
  ActualPositionDeviation,
  ActualPositionInput,
  ActualPositionRecommendation,
  DecisionCardViewModel,
  PositionAdviceSnapshot,
  RiskTag
} from "@/data/types";
import { ActualPositionCompareStatus as Status } from "@/data/types";
import { formatBtcCycleStage, formatMarketRegime } from "@/lib/display-utils";

const PERCENT_SUM_TOLERANCE = 2;
const OUTSIDE_UNIVERSE_MAX = 5;
const TOP_HOLDING_HIGH_PERCENT = 35;

const FORBIDDEN_RECOMMENDATION_PHRASES = [
  "必买",
  "必卖",
  "稳赚",
  "自动交易",
  "保证收益",
  "满仓干",
  "梭哈"
];

export type ParsedAllocationRange = {
  min: number;
  max: number;
  label: string;
};

/** 解析 PRD 区间文案，如 "30-50%" */
export function parseAllocationRange(rangeLabel: string): ParsedAllocationRange {
  const label = rangeLabel.trim();
  const match = label.replace(/%/g, "").match(/(\d+(?:\.\d+)?)\s*[-–—]\s*(\d+(?:\.\d+)?)/);
  if (!match) {
    return { min: 0, max: 100, label };
  }
  return {
    min: Number(match[1]),
    max: Number(match[2]),
    label
  };
}

export function comparePercentToRange(
  actual: number | null,
  min: number,
  max: number
): ActualPositionCompareStatus {
  if (actual === null || Number.isNaN(actual)) {
    return Status.Pending;
  }
  if (actual < min) return Status.TooLow;
  if (actual > max) return Status.TooHigh;
  return Status.InRange;
}

function statusDescription(
  status: ActualPositionCompareStatus,
  categoryLabel: string,
  referenceRangeLabel: string
): string {
  switch (status) {
    case Status.TooLow:
      return `${categoryLabel}低于今日参考区间 ${referenceRangeLabel}，在当前环境下缓冲可能不足。`;
    case Status.TooHigh:
      return `${categoryLabel}高于今日参考区间 ${referenceRangeLabel}，风险暴露可能超出当前框架。`;
    case Status.InRange:
      return `${categoryLabel}处于参考区间 ${referenceRangeLabel} 内，与今日框架基本一致。`;
    case Status.NeedsConfirmation:
      return `${categoryLabel}需人工确认后再对比。`;
    default:
      return `待录入 ${categoryLabel} 后生成对比说明。`;
  }
}

function buildDeviationRow(
  categoryId: string,
  categoryLabel: string,
  actual: number | null,
  referenceRangeLabel: string
): ActualPositionDeviation {
  const { min, max } = parseAllocationRange(referenceRangeLabel);
  const status = comparePercentToRange(actual, min, max);
  return {
    categoryId,
    categoryLabel,
    actualPercent: actual,
    referenceRangeLabel,
    referenceMin: min,
    referenceMax: max,
    status,
    description: statusDescription(status, categoryLabel, referenceRangeLabel)
  };
}

function sumCorePercents(input: ActualPositionInput): number {
  return (
    input.stablecoinCashPercent +
    input.btcEthPercent +
    input.alphaPercent +
    input.highRiskPercent
  );
}

function hasActiveHighPriorityRisk(risks: readonly RiskTag[]): boolean {
  return risks.some((risk) => risk.priority === "P0" || risk.priority === "P1");
}

function isDefensiveContext(
  positionAdvice: PositionAdviceSnapshot,
  decision: DecisionCardViewModel
): boolean {
  return (
    positionAdvice.observationOnly ||
    !positionAdvice.suitableToAddPosition ||
    decision.observationOnly
  );
}

function assertRecommendationSafe(text: string): void {
  for (const phrase of FORBIDDEN_RECOMMENDATION_PHRASES) {
    if (text.includes(phrase)) {
      throw new Error(
        `[actual-position-compare] recommendation contains forbidden phrase: ${phrase}`
      );
    }
  }
}

function sanitizeRecommendation(
  recommendation: ActualPositionRecommendation
): ActualPositionRecommendation {
  const fields: (keyof ActualPositionRecommendation)[] = [
    "action",
    "rationale",
    "condition",
    "riskReminder",
    "invalidation"
  ];
  for (const field of fields) {
    assertRecommendationSafe(recommendation[field]);
  }
  return recommendation;
}

function buildOverallSummary(
  deviations: ActualPositionDeviation[],
  percentSumValid: boolean,
  defensive: boolean
): string {
  if (!percentSumValid) {
    return "四类核心仓位比例合计偏离 100%，请先校正后再解读对比结果。";
  }

  const highCount = deviations.filter((row) => row.status === Status.TooHigh).length;
  const lowCount = deviations.filter((row) => row.status === Status.TooLow).length;

  if (highCount >= 2 && defensive) {
    return "当前实际仓位整体偏激进，与今日防守型参考框架不完全匹配。";
  }
  if (lowCount >= 1 && highCount === 0 && defensive) {
    return "稳定币 / 现金缓冲可能不足，需结合 P0 / P1 风险与宏观事件继续观察。";
  }
  if (highCount === 0 && lowCount === 0) {
    return "当前主流仓位结构基本落在参考区间内，但仍需关注 Alpha 与高风险热点是否随情绪变化。";
  }
  if (highCount >= 1) {
    return "部分仓位类别高于今日参考区间，建议优先复核风险暴露与观察池外资产。";
  }
  return "当前仓位与今日参考框架存在局部偏差，建议结合下方明细与风险预警逐项核对。";
}

function buildIssues(
  deviations: ActualPositionDeviation[],
  input: ActualPositionInput,
  strongestDirectionNote: string
): string[] {
  const issues: string[] = [];

  for (const row of deviations) {
    if (row.status === Status.TooLow && row.categoryId === "stablecoin") {
      issues.push("稳定币 / 现金缓冲低于当前防守型参考框架。");
    }
    if (row.status === Status.TooHigh && row.categoryId === "alpha") {
      issues.push("Alpha 暴露高于当前建议观察区间，不宜在未验证前扩大。");
    }
    if (row.status === Status.TooHigh && row.categoryId === "highRisk") {
      issues.push("高风险热点仓位偏高，容易受情绪波动影响。");
    }
    if (row.status === Status.TooHigh && row.categoryId === "btcEth") {
      issues.push("BTC / ETH 主流仓位高于参考区间，需对照 BTC 周期与市场环境复核。");
    }
  }

  const outside = input.outsideUniversePercent ?? 0;
  if (outside > OUTSIDE_UNIVERSE_MAX) {
    issues.push("观察池外资产占比偏高，系统无法完整解释其风险来源。");
  }

  if (
    input.topHoldingPercent !== undefined &&
    input.topHoldingPercent > TOP_HOLDING_HIGH_PERCENT
  ) {
    issues.push(
      `最大单一持仓（${input.topHoldingSymbol ?? "未命名"}）占比约 ${input.topHoldingPercent}%，存在集中风险。`
    );
  }

  if (input.concentrationLevel === "High") {
    issues.push("仓位集中度偏高，单一资产或赛道回撤可能放大组合波动。");
  }

  if (strongestDirectionNote.includes("不一致")) {
    issues.push("实际仓位结构与今日最强方向不完全一致，建议复核配置逻辑。");
  }

  return issues.slice(0, 5);
}

function evaluateStrongestDirection(
  input: ActualPositionInput,
  strongestDirection: string | undefined,
  defensive: boolean
): { aligned: boolean | null; note: string } {
  if (!strongestDirection?.trim()) {
    return { aligned: null, note: "今日最强方向未标注，暂无法判断一致性。" };
  }

  const highRiskHeavy = input.highRiskPercent > 12;
  const alphaHeavy = input.alphaPercent > 12;

  if (defensive && (highRiskHeavy || alphaHeavy)) {
    return {
      aligned: false,
      note: `今日最强方向为「${strongestDirection}」，但 Alpha / 高风险暴露偏高，与防守观察框架不一致。`
    };
  }

  if (!highRiskHeavy && !alphaHeavy) {
    return {
      aligned: true,
      note: `与今日最强方向「${strongestDirection}」大体一致，仍以验证信号为先，不宜扩大暴露。`
    };
  }

  return {
    aligned: null,
    note: `相对今日最强方向「${strongestDirection}」需结合赛道明细人工确认是否匹配。`
  };
}

function buildRecommendations(
  deviations: ActualPositionDeviation[],
  context: ActualPositionCompareContext,
  issues: string[],
  defensive: boolean
): ActualPositionRecommendation[] {
  const recommendations: ActualPositionRecommendation[] = [];
  const regimeLabel = formatMarketRegime(context.decision.marketRegime);
  const btcLabel = formatBtcCycleStage(context.decision.btcCycleStage);
  const hasHighRisk = deviations.find(
    (row) => row.categoryId === "highRisk" && row.status === Status.TooHigh
  );
  const lowStable = deviations.find(
    (row) => row.categoryId === "stablecoin" && row.status === Status.TooLow
  );
  const highAlpha = deviations.find(
    (row) => row.categoryId === "alpha" && row.status === Status.TooHigh
  );

  if (lowStable || (defensive && hasHighRisk)) {
    recommendations.push(
      sanitizeRecommendation({
        action: "建议提高稳定币 / 现金缓冲",
        rationale:
          issues[0] ??
          "稳定币低于参考区间，且今日环境偏防守，需保留应对波动与宏观事件的流动性。",
        condition: `${regimeLabel} · ${btcLabel} · 策略驱动`,
        riskReminder: hasActiveHighPriorityRisk(context.risks)
          ? "存在未解除的 P0 / P1 风险信号，不宜同步扩大其他风险暴露。"
          : "若稳定币流动性继续走弱，应优先补缓冲而非追逐热点。",
        invalidation:
          "若 BTC 风险指标明显回落且稳定币流动性连续改善，可重新评估缓冲目标。"
      })
    );
  }

  if (hasHighRisk) {
    recommendations.push(
      sanitizeRecommendation({
        action: "建议降低高风险热点暴露",
        rationale: "高风险热点高于参考区间，与今日情绪与波动环境不匹配。",
        condition: `${regimeLabel} · 情绪驱动`,
        riskReminder: "热点回撤往往快于基本面修复，需避免单一叙事主导仓位。",
        invalidation: "若强链 / 强赛道共振延续 2–3 日且风险降级，可重新评估上限。"
      })
    );
  }

  if (highAlpha || (defensive && context.positionAdvice.observationOnly)) {
    recommendations.push(
      sanitizeRecommendation({
        action: "暂不建议扩大 Alpha 暴露",
        rationale:
          highAlpha
            ? "Alpha 仓位高于当前观察区间，传导与链下尽调尚未完全验证。"
            : "今日以观察为主，Alpha 观察池以验证为先。",
        condition: "中性偏防守 · 观察池驱动",
        riskReminder: "观察池不等于买入清单；未验证项目不宜提高权重。",
        invalidation: "若重点 Alpha 传导与链下尽调同步确认，可维持现有观察权重。"
      })
    );
  }

  if (recommendations.length === 0 && issues.length > 0) {
    recommendations.push(
      sanitizeRecommendation({
        action: "建议复核与今日框架不一致的仓位",
        rationale: issues.join(" "),
        condition: `${regimeLabel} · 综合偏差`,
        riskReminder: "所有建议均为结构参考，不构成交易指令。",
        invalidation: "若实际仓位已按纪律调整且比例回到参考区间，本建议自然失效。"
      })
    );
  }

  return recommendations.slice(0, 3);
}

/**
 * 规则化对比实际仓位与系统参考框架（PRD 24.6–24.8）。
 * 不调用外部 API；不输出买卖指令。
 */
export function compareActualPosition(
  input: ActualPositionInput | null,
  context: ActualPositionCompareContext
): ActualPositionCompareResult {
  const { positionAdvice, decision, strongSignals } = context;
  const referenceOutside = "0-5%";

  if (!input) {
    const emptyDeviations: ActualPositionDeviation[] = [
      buildDeviationRow(
        "stablecoin",
        "稳定币 / 现金缓冲",
        null,
        positionAdvice.stablecoinAllocation
      ),
      buildDeviationRow("btcEth", "BTC / ETH 主流", null, positionAdvice.btcEthAllocation),
      buildDeviationRow("alpha", "Alpha 观察池", null, positionAdvice.alphaAllocation),
      buildDeviationRow(
        "highRisk",
        "高风险热点",
        null,
        positionAdvice.highRiskHotspotAllocation
      ),
      buildDeviationRow("outside", "观察池外资产", null, referenceOutside)
    ];

    return {
      isComplete: false,
      percentSum: 0,
      percentSumValid: false,
      overallSummary: "录入实际仓位后，系统将结合今日决策、BTC 周期、市场环境、Alpha 观察池和风险预警输出对比结果。",
      deviations: emptyDeviations,
      issues: [],
      strongestDirectionAligned: null,
      strongestDirectionNote: "待录入实际仓位。",
      positionRecommendations: []
    };
  }

  const percentSum = sumCorePercents(input);
  const percentSumValid =
    Math.abs(percentSum - 100) <= PERCENT_SUM_TOLERANCE;

  const deviations: ActualPositionDeviation[] = [
    buildDeviationRow(
      "stablecoin",
      "稳定币 / 现金缓冲",
      input.stablecoinCashPercent,
      positionAdvice.stablecoinAllocation
    ),
    buildDeviationRow(
      "btcEth",
      "BTC / ETH 主流",
      input.btcEthPercent,
      positionAdvice.btcEthAllocation
    ),
    buildDeviationRow(
      "alpha",
      "Alpha 观察池",
      input.alphaPercent,
      positionAdvice.alphaAllocation
    ),
    buildDeviationRow(
      "highRisk",
      "高风险热点",
      input.highRiskPercent,
      positionAdvice.highRiskHotspotAllocation
    ),
    buildDeviationRow(
      "outside",
      "观察池外资产",
      input.outsideUniversePercent ?? 0,
      referenceOutside
    )
  ];

  const defensive = isDefensiveContext(positionAdvice, decision);
  const { aligned, note } = evaluateStrongestDirection(
    input,
    strongSignals.strongestDirection ?? decision.strongestDirection,
    defensive
  );

  const overallSummary = buildOverallSummary(deviations, percentSumValid, defensive);
  const issues = buildIssues(deviations, input, note);
  const positionRecommendations = percentSumValid
    ? buildRecommendations(deviations, context, issues, defensive)
    : [];

  return {
    isComplete: true,
    percentSum,
    percentSumValid,
    overallSummary,
    deviations,
    issues,
    strongestDirectionAligned: aligned,
    strongestDirectionNote: note,
    positionRecommendations
  };
}

export function formatCompareStatusLabel(status: ActualPositionCompareStatus): string {
  switch (status) {
    case Status.TooLow:
      return "偏低";
    case Status.TooHigh:
      return "偏高";
    case Status.InRange:
      return "合理";
    case Status.NeedsConfirmation:
      return "需确认";
    default:
      return "待录入";
  }
}

export function formatConcentrationLevel(
  level: ActualPositionConcentration
): string {
  switch (level) {
    case "Low":
      return "低";
    case "Medium":
      return "中";
    case "High":
      return "高";
    default:
      return "未知";
  }
}

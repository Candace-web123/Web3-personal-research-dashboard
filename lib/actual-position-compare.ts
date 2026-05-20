import {
  ActualPositionAnalysisMode,
  ActualPositionCategory,
  ActualPositionCompareStatus,
  ActualPositionRiskStyle,
  type ActualPositionCategoryComparison,
  type ActualPositionCompareResult,
  type ActualPositionInput,
  type ActualPositionRecommendation,
  type PositionAdviceSnapshot,
  type RiskTag,
  type StrongestDirectionAlignment
} from "@/data/types";
import { MarketRegime } from "@/data/types";

/** 禁止确定性喊单、自动交易与收益承诺类表达（允许「建议减仓」等带依据的仓位建议） */
export const FORBIDDEN_OUTPUT_PHRASES = [
  "必买",
  "必卖",
  "必涨",
  "稳赚",
  "梭哈",
  "无脑加仓",
  "立即满仓",
  "保证收益",
  "自动交易",
  "自动下单",
  "系统替你决策",
  "马上买入",
  "立即卖出",
  "必须加仓",
  "必须减仓",
  "未来一定上涨"
] as const;

const DEFAULT_DATA_LIMITATIONS: readonly string[] = [
  "当前版本不自动识别图片内容，需手动录入或校正比例",
  "当前版本未接交易所 API，无法同步真实持仓",
  "当前版本未使用真实链上、行情或历史仓位数据",
  "当前分析基于手动录入比例与系统参考规则，非完整大数据分析"
];

const DEFAULT_FUTURE_DATA_NEEDS: readonly string[] = [
  "交易所持仓同步",
  "OCR / 截图识别",
  "链上钱包资产识别",
  "历史仓位变化",
  "实时行情与波动率",
  "风险模型评分"
];

const OUTSIDE_UNIVERSE_REVIEW_THRESHOLD = 10;
const TOP_HOLDING_CONCENTRATION_THRESHOLD = 35;

export type BuildActualPositionCompareParams = {
  actualPosition: ActualPositionInput;
  positionAdviceSnapshot: PositionAdviceSnapshot;
  strongestDirection?: string;
  topRisks?: readonly RiskTag[];
};

/** 从 PRD 11.5 区间文案解析百分比上下界，如 "40-60%" */
export function parseAllocationRange(
  rangeLabel: string
): { min: number; max: number } | null {
  const match = rangeLabel.trim().match(/(\d+)\s*[-–]\s*(\d+)/);
  if (!match) return null;
  const min = Number(match[1]);
  const max = Number(match[2]);
  if (!Number.isFinite(min) || !Number.isFinite(max) || min > max) return null;
  return { min, max };
}

function assertNoForbiddenPhrases(text: string): void {
  for (const phrase of FORBIDDEN_OUTPUT_PHRASES) {
    if (text.includes(phrase)) {
      throw new Error(
        `[actual-position-compare] output must not include forbidden phrase: ${phrase}`
      );
    }
  }
}

function formatRegimeHint(regime: MarketRegime): string {
  switch (regime) {
    case MarketRegime.StrongRiskOn:
      return "强进攻";
    case MarketRegime.NeutralRotation:
      return "中性轮动";
    case MarketRegime.Cautious:
      return "谨慎";
    case MarketRegime.Defensive:
      return "防守";
    default:
      return regime;
  }
}

function summarizeTopRisks(topRisks?: readonly RiskTag[]): string {
  if (!topRisks?.length) return "当前无额外 P0 / P1 风险标签";
  const high = topRisks.filter((r) => r.priority === "P0" || r.priority === "P1");
  if (high.length === 0) return "当前以 P2 / P3 辅助提示为主";
  return high.map((r) => `${r.priority}：${r.message}`).join("；");
}

function findComparison(
  comparisons: readonly ActualPositionCategoryComparison[],
  category: ActualPositionCategory
): ActualPositionCategoryComparison | undefined {
  return comparisons.find((c) => c.category === category);
}

function buildPositionRecommendations(params: {
  comparisons: readonly ActualPositionCategoryComparison[];
  actual: ActualPositionInput;
  snapshot: PositionAdviceSnapshot;
  strongestDirection?: string;
  topRisks?: readonly RiskTag[];
  overallStyle: ActualPositionRiskStyle;
  alignment: StrongestDirectionAlignment;
}): ActualPositionRecommendation[] {
  const {
    comparisons,
    actual,
    snapshot,
    strongestDirection,
    topRisks,
    overallStyle,
    alignment
  } = params;

  const recommendations: ActualPositionRecommendation[] = [];
  const push = (rec: ActualPositionRecommendation) => {
    if (!recommendations.some((r) => r.action === rec.action)) {
      recommendations.push(rec);
    }
  };

  const stable = findComparison(comparisons, ActualPositionCategory.StablecoinCash);
  const btcEth = findComparison(comparisons, ActualPositionCategory.BtcEth);
  const alpha = findComparison(comparisons, ActualPositionCategory.Alpha);
  const highRisk = findComparison(comparisons, ActualPositionCategory.HighRisk);
  const outside = findComparison(comparisons, ActualPositionCategory.OutsideUniverse);

  const hasHighPriorityRisk = topRisks?.some(
    (r) => r.priority === "P0" || r.priority === "P1"
  );
  const regimeLabel = formatRegimeHint(snapshot.marketRegime);
  const riskSummary = summarizeTopRisks(topRisks);

  if (stable?.status === ActualPositionCompareStatus.BelowRange) {
    push({
      action: "建议提高稳定币 / 现金缓冲",
      rationale: `稳定币 / 现金缓冲占比 ${actual.stablecoinCashPercent}% 低于今日参考区间 ${stable.referenceRangeLabel}；${stable.explanation}`,
      condition: `适用于当前市场环境为「${regimeLabel}」、且系统判断需保留应对波动的现金垫的场景`,
      riskReminder:
        "现金比例过高可能错过结构性机会；若 BTC 周期与最强方向持续共振，可提高缓冲目标前先复核主线逻辑",
      invalidation:
        "若稳定币占比回到参考区间内，且 P0 / P1 风险预警明显减少，可重新评估是否需要维持高现金比例"
    });
  }

  if (highRisk?.status === ActualPositionCompareStatus.AboveRange) {
    const trimVerb =
      actual.highRiskPercent >= 8 ? "建议减仓高风险热点" : "建议降低高风险热点暴露";
    push({
      action: trimVerb,
      rationale: `高风险热点占比 ${actual.highRiskPercent}% 高于参考区间 ${highRisk.referenceRangeLabel}；${highRisk.explanation}。风险预警：${riskSummary}`,
      condition:
        snapshot.observationOnly || snapshot.marketRegime !== MarketRegime.StrongRiskOn
          ? `适用于市场处于「${regimeLabel}」或今日以观察为主、热点异动可能由情绪驱动的阶段`
          : `适用于强进攻环境中仍出现热点占比超参考、且需控制情绪回撤的场景`,
      riskReminder:
        "若强链 / 强赛道 / 强协议共振继续增强，过早降低暴露可能错过后续观察机会，宜分批验证而非一次性调整",
      invalidation:
        "若高风险占比回到参考区间、成交量与链上数据持续跟随、且 P1 及以上风险预警下降，该建议需重新评估"
    });
  }

  if (alpha?.status === ActualPositionCompareStatus.AboveRange) {
    push({
      action: "建议暂不加仓 Alpha、暂不扩大 Alpha 暴露",
      rationale: `Alpha 观察池占比 ${actual.alphaPercent}% 高于参考区间 ${alpha.referenceRangeLabel}；${alpha.explanation}`,
      condition: "适用于观察池项目仍以验证为主、尚未形成一致加仓信号的阶段",
      riskReminder:
        "Alpha 标的波动大；若仅因短期涨幅扩大暴露，容易与「观察池 ≠ 买入清单」原则冲突",
      invalidation:
        "若 Alpha 占比回到参考区间，且重点项目的数据、传导与解锁风险连续验证通过，可再讨论是否小步提高观察仓"
    });
  } else if (
    snapshot.observationOnly ||
    !snapshot.suitableToAddPosition ||
    alpha?.status === ActualPositionCompareStatus.InRange
  ) {
    push({
      action: "建议继续观察",
      rationale: snapshot.observationOnly
        ? "今日仓位参考框架标注为以观察为主，不宜主动扩大风险暴露"
        : "Alpha 暴露处于参考区间内，且系统未给出适合新增仓位的信号",
      condition: `适用于「${regimeLabel}」环境下以验证数据与风险为主、而非扩大进攻面的阶段`,
      riskReminder: "继续观察不等于忽视仓位；仍需每日对照 BTC 周期与风险预警更新判断",
      invalidation:
        "若市场环境转为适合小幅跟踪、观察池出现连续数据验证且风险预警下降，可转为「等待验证后再考虑加仓」路径"
    });
  }

  if (
    btcEth?.status === ActualPositionCompareStatus.InRange ||
    btcEth?.status === ActualPositionCompareStatus.BelowRange
  ) {
    push({
      action: "建议保留 BTC / ETH 主流仓位作为核心观察仓",
      rationale: `BTC / ETH 占比 ${actual.btcEthPercent}% 与参考区间 ${btcEth?.referenceRangeLabel ?? "—"} 大体匹配；BTC 周期阶段：${snapshot.btcCycleStage}`,
      condition: "适用于以周期锚点管理核心风险资产、而非用热点替代主线的策略",
      riskReminder:
        "主流仓位过高仍会放大 Beta 波动；需与现金缓冲和热点暴露联动管理",
      invalidation:
        "若 BTC 周期进入顶部风险区且多项指标共振过热，应下调核心仓目标并同步提高现金缓冲建议"
    });
  }

  if (outside?.status === ActualPositionCompareStatus.NeedsReview) {
    push({
      action: "建议复核观察池外资产",
      rationale: `观察池外资产占比 ${actual.outsideUniversePercent ?? 0}% 超过建议阈值；${outside.explanation}`,
      condition: "适用于系统无法从观察宇宙解释其风险来源的持仓",
      riskReminder: "池外资产可能缺乏统一的解锁、传导与赛道共振跟踪",
      invalidation:
        "若已补充持仓理由、风险标签，且占比降至可接受范围，可移出「需复核」状态"
    });
  }

  if (alignment === "NotAligned" || alignment === "PartiallyAligned") {
    push({
      action: "建议复核与今日最强方向不一致的仓位",
      rationale: `今日最强方向：${strongestDirection?.trim() || "未提供"}；当前仓位与其一致性：${alignment === "NotAligned" ? "偏低" : "部分一致"}`,
      condition: "适用于主流与热点暴露已建立、但主线方向发生变化的阶段",
      riskReminder: "方向不一致有时是刻意对冲，需区分「偏差」与「有意为之」",
      invalidation:
        "若实际仓位已调整至与最强方向一致，或最强方向本身因数据更新而切换，应重新生成对比"
    });
  }

  if (
    hasHighPriorityRisk ||
    overallStyle === ActualPositionRiskStyle.Aggressive ||
    overallStyle === ActualPositionRiskStyle.Overheated
  ) {
    push({
      action: "建议在风险解除前不扩大风险暴露",
      rationale: `整体仓位风格判定为「${overallStyle}」；风险预警：${riskSummary}`,
      condition: "适用于仍存在 P0 / P1 级风险或结构明显偏激进的阶段",
      riskReminder: "不扩大暴露不等于必须立刻收缩；宜先完成现金缓冲与热点占比的复核",
      invalidation:
        "若风险预警降至 P2 及以下、四类仓位回到参考区间且市场环境改善，可取消该约束"
    });
  }

  if (
    !snapshot.suitableToAddPosition ||
    snapshot.observationOnly ||
    alpha?.status === ActualPositionCompareStatus.AboveRange
  ) {
    push({
      action: "建议等待验证后再考虑加仓",
      rationale:
        "当前参考框架未给出适合新增风险仓位的信号，或 Alpha 暴露已偏高，需先完成数据与风险验证",
      condition: "适用于个人复盘后仍缺乏一致验证信号、不宜扩大观察仓的阶段",
      riskReminder: "等待验证期间仍须跟踪解锁、传导与宏观事件，避免把「等待」当作「忽视」",
      invalidation:
        "若观察池重点项目出现连续数据验证、风险预警下降且比例回到参考区间，可重新评估是否小步提高暴露"
    });
  }

  if (
    actual.concentrationLevel === "High" ||
    (actual.topHoldingPercent ?? 0) > TOP_HOLDING_CONCENTRATION_THRESHOLD
  ) {
    const symbol = actual.topHoldingSymbol?.trim() || "最大单一持仓";
    push({
      action: "建议降低单一资产集中风险",
      rationale: `${symbol} 占比 ${actual.topHoldingPercent ?? "—"}%，集中度评级：${actual.concentrationLevel}`,
      condition: "适用于单一资产或赛道权重过高、且会放大非系统性回撤的阶段",
      riskReminder: "降低集中风险宜结合税务、流动性与主线逻辑，避免为分散而分散",
      invalidation:
        "若最大持仓占比降至 35% 以下且集中度降至「中」或「低」，该建议可归档"
    });
  }

  return recommendations.slice(0, 6);
}

function categoryLabel(category: ActualPositionCategory): string {
  switch (category) {
    case ActualPositionCategory.StablecoinCash:
      return "稳定币 / 现金缓冲";
    case ActualPositionCategory.BtcEth:
      return "BTC / ETH 主流";
    case ActualPositionCategory.Alpha:
      return "Alpha 观察池";
    case ActualPositionCategory.HighRisk:
      return "高风险热点";
    case ActualPositionCategory.OutsideUniverse:
      return "观察池外资产";
    default:
      return category;
  }
}

function compareToReferenceRange(
  category: ActualPositionCategory,
  actualPercent: number,
  referenceRangeLabel: string,
  belowMessage: string,
  aboveMessage: string,
  inRangeMessage: string
): ActualPositionCategoryComparison {
  const bounds = parseAllocationRange(referenceRangeLabel);
  if (!bounds) {
    return {
      category,
      actualPercent,
      referenceRangeLabel,
      status: ActualPositionCompareStatus.NeedsReview,
      explanation: `系统参考区间为「${referenceRangeLabel}」，需人工确认是否匹配。`
    };
  }

  let status: ActualPositionCompareStatus;
  let explanation: string;

  if (actualPercent < bounds.min) {
    status = ActualPositionCompareStatus.BelowRange;
    explanation = belowMessage;
  } else if (actualPercent > bounds.max) {
    status = ActualPositionCompareStatus.AboveRange;
    explanation = aboveMessage;
  } else {
    status = ActualPositionCompareStatus.InRange;
    explanation = inRangeMessage;
  }

  return {
    category,
    actualPercent,
    referenceRangeLabel,
    status,
    explanation
  };
}

function resolveStrongestDirectionAlignment(
  strongestDirection: string | undefined,
  comparisons: readonly ActualPositionCategoryComparison[],
  actual: ActualPositionInput
): StrongestDirectionAlignment {
  if (!strongestDirection?.trim()) return "Unknown";

  const btcEth = comparisons.find(
    (c) => c.category === ActualPositionCategory.BtcEth
  );
  const highRisk = comparisons.find(
    (c) => c.category === ActualPositionCategory.HighRisk
  );
  const stablecoin = comparisons.find(
    (c) => c.category === ActualPositionCategory.StablecoinCash
  );

  const btcOk =
    btcEth?.status === ActualPositionCompareStatus.InRange ||
    btcEth?.status === ActualPositionCompareStatus.BelowRange;
  const riskElevated =
    highRisk?.status === ActualPositionCompareStatus.AboveRange ||
    actual.highRiskPercent > 5;
  const stableLow =
    stablecoin?.status === ActualPositionCompareStatus.BelowRange;

  if (btcOk && !riskElevated && !stableLow) return "Aligned";
  if (btcOk || (!riskElevated && actual.btcEthPercent >= 30)) {
    return "PartiallyAligned";
  }
  if (riskElevated && stableLow) return "NotAligned";
  return "PartiallyAligned";
}

function resolveOverallStyle(
  comparisons: readonly ActualPositionCategoryComparison[],
  actual: ActualPositionInput
): ActualPositionRiskStyle {
  const stable = comparisons.find(
    (c) => c.category === ActualPositionCategory.StablecoinCash
  );
  const alpha = comparisons.find((c) => c.category === ActualPositionCategory.Alpha);
  const highRisk = comparisons.find(
    (c) => c.category === ActualPositionCategory.HighRisk
  );

  const stableLow = stable?.status === ActualPositionCompareStatus.BelowRange;
  const alphaHigh = alpha?.status === ActualPositionCompareStatus.AboveRange;
  const riskHigh = highRisk?.status === ActualPositionCompareStatus.AboveRange;

  const stableHigh =
    stable?.status === ActualPositionCompareStatus.InRange &&
    actual.stablecoinCashPercent >= 50;
  const alphaLow =
    alpha?.status === ActualPositionCompareStatus.BelowRange ||
    alpha?.status === ActualPositionCompareStatus.InRange;
  const riskLow =
    highRisk?.status === ActualPositionCompareStatus.BelowRange ||
    highRisk?.status === ActualPositionCompareStatus.InRange;

  if (stableLow && (alphaHigh || riskHigh)) {
    if (riskHigh && actual.highRiskPercent >= 8) {
      return ActualPositionRiskStyle.Overheated;
    }
    return ActualPositionRiskStyle.Aggressive;
  }

  if (stableHigh && alphaLow && riskLow) {
    return ActualPositionRiskStyle.Defensive;
  }

  if (stable?.status === ActualPositionCompareStatus.InRange && !alphaHigh && !riskHigh) {
    return ActualPositionRiskStyle.Balanced;
  }

  return ActualPositionRiskStyle.Unknown;
}

function buildConclusion(
  style: ActualPositionRiskStyle,
  snapshot: PositionAdviceSnapshot
): string {
  const regimeHint = snapshot.observationOnly
    ? "今日以观察为主"
    : "当前环境允许有限跟踪";

  switch (style) {
    case ActualPositionRiskStyle.Aggressive:
      return `当前实际仓位整体偏激进，与今日参考框架不完全匹配；${regimeHint}，宜关注现金缓冲与高风险暴露。`;
    case ActualPositionRiskStyle.Overheated:
      return `当前实际仓位风险暴露偏高，稳定币缓冲可能不足以覆盖 P0 / P1 风险；${regimeHint}，宜优先复核结构偏差。`;
    case ActualPositionRiskStyle.Defensive:
      return `当前仓位整体偏防守，稳定币与主流占比相对充足；${regimeHint}，可继续验证 Alpha 与热点暴露是否必要。`;
    case ActualPositionRiskStyle.Balanced:
      return `当前仓位结构与系统参考框架大体一致；${regimeHint}，仍须结合风险预警持续复核。`;
    default:
      return `当前仓位与系统参考框架存在部分待确认项；${regimeHint}，建议完成比例校正后再次对比。`;
  }
}

function buildRiskSuggestionsFromRecommendations(
  recommendations: readonly ActualPositionRecommendation[]
): string[] {
  return recommendations.map((r) => r.action);
}

function buildMismatches(
  comparisons: readonly ActualPositionCategoryComparison[],
  actual: ActualPositionInput
): string[] {
  const items: string[] = [];

  const pushUnique = (line: string) => {
    if (!items.includes(line)) items.push(line);
  };

  for (const row of comparisons) {
    if (row.status === ActualPositionCompareStatus.BelowRange) {
      if (row.category === ActualPositionCategory.StablecoinCash) {
        pushUnique("稳定币 / 现金缓冲低于当前防守型参考框架");
      } else {
        pushUnique(`${categoryLabel(row.category)}低于系统建议观察区间`);
      }
    }
    if (row.status === ActualPositionCompareStatus.AboveRange) {
      if (row.category === ActualPositionCategory.Alpha) {
        pushUnique("Alpha 暴露高于当前建议观察区间");
      } else if (row.category === ActualPositionCategory.HighRisk) {
        pushUnique("高风险热点仓位偏高，容易受情绪波动影响");
      } else {
        pushUnique(`${categoryLabel(row.category)}高于系统建议观察区间`);
      }
    }
    if (
      row.category === ActualPositionCategory.OutsideUniverse &&
      row.status === ActualPositionCompareStatus.NeedsReview
    ) {
      pushUnique("观察池外资产占比偏高，系统无法解释其风险来源");
    }
  }

  if (actual.concentrationLevel === "High") {
    pushUnique("仓位集中度偏高，存在单一资产或赛道集中风险");
  }

  if (
    actual.topHoldingPercent != null &&
    actual.topHoldingPercent > TOP_HOLDING_CONCENTRATION_THRESHOLD
  ) {
    const symbol = actual.topHoldingSymbol?.trim() || "最大单一持仓";
    pushUnique(`${symbol} 占比过高（>${TOP_HOLDING_CONCENTRATION_THRESHOLD}%），存在集中风险`);
  }

  return items.slice(0, 5);
}

/**
 * 基于手动录入仓位与系统参考框架进行规则化对比（MVP）。
 * 不修改入参；不访问浏览器或外部 API。
 */
export function buildActualPositionCompareResult(
  params: BuildActualPositionCompareParams
): ActualPositionCompareResult {
  const { actualPosition, positionAdviceSnapshot, strongestDirection, topRisks } =
    params;

  const outsidePercent = actualPosition.outsideUniversePercent ?? 0;

  const comparisons: ActualPositionCategoryComparison[] = [
    compareToReferenceRange(
      ActualPositionCategory.StablecoinCash,
      actualPosition.stablecoinCashPercent,
      positionAdviceSnapshot.stablecoinAllocation,
      "稳定币 / 现金缓冲低于参考区间，可能无法覆盖当前风险环境",
      "稳定币占比高于参考上限（偏防守），可关注机会成本",
      "稳定币 / 现金缓冲处于系统建议观察区间内"
    ),
    compareToReferenceRange(
      ActualPositionCategory.BtcEth,
      actualPosition.btcEthPercent,
      positionAdviceSnapshot.btcEthAllocation,
      "BTC / ETH 主流仓位低于参考区间，与当前周期匹配度待确认",
      "BTC / ETH 主流仓位高于参考区间，需结合 BTC 周期与市场环境复核",
      "BTC / ETH 主流仓位与当前周期及市场环境参考基本一致"
    ),
    compareToReferenceRange(
      ActualPositionCategory.Alpha,
      actualPosition.alphaPercent,
      positionAdviceSnapshot.alphaAllocation,
      "Alpha 暴露低于参考区间，观察仓可能偏少",
      "Alpha 暴露高于当前建议观察区间，宜控制观察仓规模",
      "Alpha 暴露处于系统建议观察区间内"
    ),
    compareToReferenceRange(
      ActualPositionCategory.HighRisk,
      actualPosition.highRiskPercent,
      positionAdviceSnapshot.highRiskHotspotAllocation,
      "高风险热点暴露低于参考区间",
      "高风险热点仓位偏高，容易受情绪与波动回撤影响",
      "高风险热点暴露处于系统建议观察区间内"
    ),
    {
      category: ActualPositionCategory.OutsideUniverse,
      actualPercent: outsidePercent,
      referenceRangeLabel: `建议 ≤${OUTSIDE_UNIVERSE_REVIEW_THRESHOLD}%`,
      status:
        outsidePercent > OUTSIDE_UNIVERSE_REVIEW_THRESHOLD
          ? ActualPositionCompareStatus.NeedsReview
          : ActualPositionCompareStatus.InRange,
      explanation:
        outsidePercent > OUTSIDE_UNIVERSE_REVIEW_THRESHOLD
          ? "观察池外资产占比偏高，系统难以解释其风险来源"
          : "观察池外资产占比在可接受观察范围内"
    }
  ];

  const overallStyle = resolveOverallStyle(comparisons, actualPosition);
  const strongestDirectionAlignment = resolveStrongestDirectionAlignment(
    strongestDirection,
    comparisons,
    actualPosition
  );

  const mismatches = buildMismatches(comparisons, actualPosition);
  const positionRecommendations = buildPositionRecommendations({
    comparisons,
    actual: actualPosition,
    snapshot: positionAdviceSnapshot,
    strongestDirection,
    topRisks,
    overallStyle,
    alignment: strongestDirectionAlignment
  });
  const riskAdjustmentSuggestions =
    buildRiskSuggestionsFromRecommendations(positionRecommendations);

  const result: ActualPositionCompareResult = {
    asOf: actualPosition.asOf,
    analysisMode: ActualPositionAnalysisMode.ManualRuleBased,
    overallStyle,
    conclusion: buildConclusion(overallStyle, positionAdviceSnapshot),
    comparisons,
    mismatches,
    positionRecommendations,
    riskAdjustmentSuggestions,
    strongestDirectionAlignment,
    dataLimitations: [...DEFAULT_DATA_LIMITATIONS],
    futureDataNeeds: [...DEFAULT_FUTURE_DATA_NEEDS]
  };

  const textBlob = JSON.stringify(result);
  assertNoForbiddenPhrases(textBlob);

  return result;
}

/** 四类核心仓位比例之和（不含观察池外） */
export function sumCorePositionPercents(input: ActualPositionInput): number {
  return (
    input.stablecoinCashPercent +
    input.btcEthPercent +
    input.alphaPercent +
    input.highRiskPercent
  );
}

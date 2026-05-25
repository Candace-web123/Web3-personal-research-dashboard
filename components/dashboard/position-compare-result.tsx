import type {
  ActualPositionCompareResult,
  ActualPositionCompareStatus,
  ActualPositionRecommendation
} from "@/data/types";

const LABEL_POSITION_RECOMMENDATIONS = "个人仓位建议";
const LABEL_RATIONALE = "判断依据";
const LABEL_CONDITION = "适用条件";
const LABEL_RISK_REMINDER = "风险提醒";
const LABEL_INVALIDATION = "失效条件";
const LABEL_RECOMMENDATION_NOTE =
  "以下为基于当前规则的明确建议，需您自行执行；系统不自动交易、不自动下单。";

function statusLabel(status: ActualPositionCompareStatus): string {
  switch (status) {
    case "BelowRange":
      return "偏低";
    case "InRange":
      return "合理";
    case "AboveRange":
      return "偏高";
    case "NeedsReview":
      return "需确认";
    default:
      return status;
  }
}

function statusTone(status: ActualPositionCompareStatus): string {
  switch (status) {
    case "BelowRange":
      return "border-amber-200 bg-amber-50 text-amber-950";
    case "InRange":
      return "border-emerald-200 bg-emerald-50 text-emerald-950";
    case "AboveRange":
      return "border-rose-200 bg-rose-50 text-rose-950";
    case "NeedsReview":
      return "border-violet-200 bg-violet-50 text-violet-950";
    default:
      return "border-zinc-200 bg-zinc-50 text-zinc-800";
  }
}

function categoryDisplayName(category: string): string {
  switch (category) {
    case "StablecoinCash":
      return "稳定币 / 现金缓冲";
    case "BtcEth":
      return "BTC / ETH 主流";
    case "Alpha":
      return "Alpha 观察池";
    case "HighRisk":
      return "高风险热点";
    case "OutsideUniverse":
      return "观察池外资产";
    default:
      return category;
  }
}

function alignmentLabel(
  alignment: ActualPositionCompareResult["strongestDirectionAlignment"]
): string {
  switch (alignment) {
    case "Aligned":
      return "与今日最强方向基本一致";
    case "PartiallyAligned":
      return "与今日最强方向部分一致，建议复核";
    case "NotAligned":
      return "与今日最强方向不一致，建议复核相关暴露";
    case "Unknown":
      return "最强方向信息不足，暂无法判断一致性";
    default:
      return alignment;
  }
}

function PositionRecommendationCard({
  recommendation
}: {
  recommendation: ActualPositionRecommendation;
}) {
  return (
    <li className="rounded-md border border-indigo-200 bg-indigo-50/80 px-3 py-3">
      <p className="text-sm font-semibold text-indigo-950">{recommendation.action}</p>
      <dl className="mt-2 space-y-2 text-xs leading-5 text-indigo-900/95">
        <div>
          <dt className="font-medium text-indigo-800">{LABEL_RATIONALE}</dt>
          <dd className="mt-0.5">{recommendation.rationale}</dd>
        </div>
        <div>
          <dt className="font-medium text-indigo-800">{LABEL_CONDITION}</dt>
          <dd className="mt-0.5">{recommendation.condition}</dd>
        </div>
        <div>
          <dt className="font-medium text-indigo-800">{LABEL_RISK_REMINDER}</dt>
          <dd className="mt-0.5">{recommendation.riskReminder}</dd>
        </div>
        <div>
          <dt className="font-medium text-indigo-800">{LABEL_INVALIDATION}</dt>
          <dd className="mt-0.5">{recommendation.invalidation}</dd>
        </div>
      </dl>
    </li>
  );
}

export type PositionCompareResultProps = {
  compareResult: ActualPositionCompareResult | null;
};

export function PositionCompareResult({ compareResult }: PositionCompareResultProps) {
  if (!compareResult) {
    return (
      <p className="text-sm text-zinc-500">
        录入或校正比例后，点击「生成对比分析」查看偏差诊断。
      </p>
    );
  }

  return (
    <>
      <section className="rounded-md border border-violet-200 bg-violet-50 p-3">
        <p className="text-xs font-semibold text-violet-800">总体结论</p>
        <p className="mt-1 text-sm leading-6 text-violet-950">{compareResult.conclusion}</p>
        <p className="mt-2 text-xs text-violet-900/90">
          {alignmentLabel(compareResult.strongestDirectionAlignment)}
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          实际仓位 vs 系统参考
        </p>
        <ul className="flex flex-col gap-2">
          {compareResult.comparisons.map((row) => (
            <li
              key={row.category}
              className={`rounded-md border px-3 py-2 text-sm ${statusTone(row.status)}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">{categoryDisplayName(row.category)}</span>
                <span className="text-xs font-semibold">{statusLabel(row.status)}</span>
              </div>
              <p className="mt-1 font-mono text-xs">
                实际 {row.actualPercent}% · 参考 {row.referenceRangeLabel}
              </p>
              <p className="mt-1 text-xs leading-5 opacity-90">{row.explanation}</p>
            </li>
          ))}
        </ul>
      </section>

      {compareResult.mismatches.length > 0 ? (
        <section className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            不妥之处
          </p>
          <ul className="flex flex-col gap-1.5">
            {compareResult.mismatches.map((item) => (
              <li
                key={item}
                className="rounded-md border border-amber-100 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-950"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {compareResult.positionRecommendations.length > 0 ? (
        <section className="flex flex-col gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-800">
              {LABEL_POSITION_RECOMMENDATIONS}
            </p>
            <p className="mt-1 text-xs leading-5 text-zinc-600">
              {LABEL_RECOMMENDATION_NOTE}
            </p>
          </div>
          <ul className="flex flex-col gap-3">
            {compareResult.positionRecommendations.map((rec) => (
              <PositionRecommendationCard key={rec.action} recommendation={rec} />
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
        <p className="text-xs font-semibold text-zinc-600">数据限制说明</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-xs leading-5 text-zinc-600">
          {compareResult.dataLimitations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {compareResult.futureDataNeeds && compareResult.futureDataNeeds.length > 0 ? (
        <section className="rounded-md border border-dashed border-zinc-300 bg-white p-3">
          <p className="text-xs font-semibold text-zinc-600">未来数据接入能力（预留）</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs leading-5 text-zinc-500">
            {compareResult.futureDataNeeds.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-zinc-500">
            未来阶段可升级为真实数据 + 模型化分析；仍不自动交易、不替您下单。
          </p>
        </section>
      ) : null}
    </>
  );
}

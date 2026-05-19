import { DataProvenanceFooter } from "@/components/dashboard/data-provenance-footer";
import type { CardDataProvenanceSummary, DecisionCardViewModel } from "@/data/types";
import { formatBtcCycleStage, formatMarketRegime } from "@/lib/display-utils";

export type DecisionHeroCardProps = {
  model: DecisionCardViewModel;
  dataProvenance?: CardDataProvenanceSummary;
};

const BASIS_TONE: Record<string, string> = {
  btc: "border-blue-100 bg-blue-50/50",
  market: "border-amber-100 bg-amber-50/50",
  alpha: "border-purple-100 bg-purple-50/50"
};

export function DecisionHeroCard({ model, dataProvenance }: DecisionHeroCardProps) {
  const modeLabel = model.observationOnly
    ? "今日模式：防守 / 观察"
    : model.suitableToAddPosition
      ? "今日模式：跟踪 / 验证"
      : "今日模式：中性观察";

  const addExposureLabel = model.suitableToAddPosition
    ? "是，可在纪律内小步验证"
    : "否，当前参考框架为防守模式";

  const alphaOnlyLabel = model.supportsAltAlphaObservation
    ? model.suitableToAddPosition
      ? "否，传导未完全验证前不宜扩大暴露"
      : "是，传导未完全验证，暂不扩大暴露"
    : "是，暂不适合扩展 Alpha 观察";

  return (
    <section
      className="col-span-2 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-label="今日投研决策建议"
    >
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">今日投研决策建议</h2>
          <span className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            {modeLabel}
          </span>
        </div>

        <p className="text-2xl font-bold leading-tight text-slate-900">
          &ldquo;{model.conclusion}&rdquo;
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <HeroField label="今日最强方向" value={model.strongestDirection ?? "—"} />
          <HeroField label="风险提示" value={model.riskReminder} />
          <HeroField
            label="BTC 周期状态"
            value={`${formatBtcCycleStage(model.btcCycleStage)} · ${model.btcActionBias}`}
          />
          <HeroField
            label="Alpha 观察"
            value={
              model.alphaFocusSymbols.length > 0
                ? `关注 ${model.alphaFocusSymbols.slice(0, 3).join("、")} 等`
                : "维持观察池验证"
            }
          />
          <HeroField label="是否支持新增风险暴露" value={addExposureLabel} />
          <HeroField label="Alpha 是否仅观察" value={alphaOnlyLabel} />
        </div>

        {model.judgmentBasis && model.judgmentBasis.length > 0 ? (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-slate-600">判断依据</h3>
              {model.coreRiskSummary ? (
                <span className="text-[10px] text-slate-400">
                  核心风险：{model.coreRiskSummary}
                </span>
              ) : null}
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {model.judgmentBasis.map((item) => (
                <div
                  key={item.title}
                  className={`rounded-xl border p-3 ${BASIS_TONE[item.tone] ?? "border-slate-100 bg-slate-50"}`}
                >
                  <div className="mb-1 text-[10px] font-bold text-slate-700">
                    {item.title}
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-6 border-t border-slate-100 pt-4 text-[11px] text-slate-400">
        <p>
          市场环境：{formatMarketRegime(model.marketRegime)} · 五维合计{" "}
          {model.marketScore} · {model.headline}
        </p>
        {dataProvenance ? (
          <div className="mt-2">
            <DataProvenanceFooter summary={dataProvenance} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function HeroField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-700">{label}</h4>
      <p className="mt-1 text-sm text-slate-500">{value}</p>
    </div>
  );
}

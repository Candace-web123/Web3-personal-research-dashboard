import type { DecisionCardViewModel } from "@/data/types";
import {
  formatBtcCycleStage,
  formatMarketRegime,
  formatMarketScore,
  formatSymbolList
} from "@/lib/display-utils";

export type DecisionCardProps = {
  model: DecisionCardViewModel;
};

function SummaryBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-3">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-1 text-sm leading-6 text-zinc-800">{value}</p>
    </div>
  );
}

export function DecisionCard({ model }: DecisionCardProps) {
  const ethSummary = model.ethAndMainstreamSummary.trim() || "—";
  const stableSummary = model.stablecoinLiquiditySummary.trim() || "—";

  const alphaObservationLabel = model.supportsAltAlphaObservation
    ? model.suitableToAddPosition
      ? "可新增观察仓（非买入清单）"
      : "\u4ec5\u89c2\u5bdf Alpha\uff0c\u4e0d\u5efa\u8bae\u65b0\u589e\u4ed3\u4f4d"
    : "\u6682\u4e0d\u9002\u5408\u6269\u5c55 Alpha \u89c2\u5bdf";

  return (
    <section
      className="flex flex-col gap-5 rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:p-5"
      aria-label="今日决策卡"
    >
      <header className="flex flex-col gap-2 border-b border-zinc-200 pb-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold text-zinc-900">今日决策卡</h2>
          <time className="text-sm text-zinc-500" dateTime={model.asOf}>
            {model.asOf}
          </time>
        </div>
        <p className="text-sm font-medium leading-6 text-zinc-700">{model.headline}</p>
      </header>

      <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">一句话结论</p>
        <p className="mt-2 text-sm leading-6 text-amber-950">{model.conclusion}</p>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">风险提示</p>
        <p className="text-sm leading-6 text-zinc-700">{model.riskReminder}</p>
        {model.topRisks.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {model.topRisks.map((risk) => (
              <li
                key={`${risk.priority}-${risk.code}`}
                className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm leading-6 text-red-900"
              >
                <span className="font-mono text-xs font-semibold text-red-700">
                  {risk.priority}
                </span>
                <span className="mx-2 text-red-300">{"·"}</span>
                {risk.message}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-500">{"—"}</p>
        )}
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-zinc-200 bg-white p-3">
          <dt className="text-xs font-medium text-zinc-500">市场环境</dt>
          <dd className="mt-1 text-sm font-semibold text-zinc-900">
            {formatMarketRegime(model.marketRegime)}
            <span className="ml-2 font-mono text-zinc-600">
              ({formatMarketScore(model.marketScore)})
            </span>
          </dd>
        </div>
        <div className="rounded-md border border-zinc-200 bg-white p-3">
          <dt className="text-xs font-medium text-zinc-500">BTC \u5468\u671f</dt>
          <dd className="mt-1 text-sm font-semibold text-zinc-900">
            {formatBtcCycleStage(model.btcCycleStage)}
          </dd>
        </div>
        <div className="rounded-md border border-zinc-200 bg-white p-3 sm:col-span-2">
          <dt className="text-xs font-medium text-zinc-500">BTC \u64cd\u4f5c\u503e\u5411</dt>
          <dd className="mt-1 text-sm leading-6 text-zinc-800">{model.btcActionBias}</dd>
        </div>
        <div className="rounded-md border border-zinc-200 bg-white p-3 sm:col-span-2">
          <dt className="text-xs font-medium text-zinc-500">今日模式</dt>
          <dd className="mt-1 text-sm text-zinc-800">
            {model.observationOnly
              ? "以观察为主，谨慎进攻"
              : "可跟踪结构性机会，控制节奏"}
          </dd>
        </div>
      </dl>

      <div className="flex flex-col gap-3">
        <SummaryBlock label="ETH / \u4e3b\u6d41\u8d44\u4ea7\u72b6\u6001" value={ethSummary} />
        <SummaryBlock label="稳定币流动性" value={stableSummary} />
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-zinc-200 bg-white p-3">
          <dt className="text-xs font-medium text-zinc-500">\u4e3b\u6d41\u5e01\u5f02\u52a8 Top 5</dt>
          <dd className="mt-1 font-mono text-sm text-zinc-800">
            {formatSymbolList(model.topMoverSymbols)}
          </dd>
        </div>
        <div className="rounded-md border border-zinc-200 bg-white p-3">
          <dt className="text-xs font-medium text-zinc-500">Alpha \u89c2\u5bdf\u7126\u70b9</dt>
          <dd className="mt-1 font-mono text-sm text-zinc-800">
            {formatSymbolList(model.alphaFocusSymbols)}
          </dd>
        </div>
        <div className="rounded-md border border-zinc-200 bg-white p-3 sm:col-span-2">
          <dt className="text-xs font-medium text-zinc-500">Alpha \u89c2\u5bdf</dt>
          <dd className="mt-1 text-sm text-zinc-800">{alphaObservationLabel}</dd>
        </div>
      </dl>
    </section>
  );
}

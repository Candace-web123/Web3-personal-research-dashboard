import { DataProvenanceFooter } from "@/components/dashboard/data-provenance-footer";
import type { CardDataProvenanceSummary, DecisionCardViewModel } from "@/data/types";
import {
  formatBtcCycleStage,
  formatMarketRegime,
  formatMarketScore,
  formatSymbolList
} from "@/lib/display-utils";

export type DecisionCardProps = {
  model: DecisionCardViewModel;
  dataProvenance?: CardDataProvenanceSummary;
};

const LABEL_DECISION_CARD = "\u4eca\u65e5\u51b3\u7b56\u5361";
const LABEL_ONE_LINE = "\u4e00\u53e5\u8bdd\u7ed3\u8bba";
const LABEL_RISK = "\u98ce\u9669\u63d0\u793a";
const LABEL_MARKET = "\u5e02\u573a\u73af\u5883";
const LABEL_BTC_CYCLE = "BTC \u5468\u671f";
const LABEL_BTC_BIAS = "BTC \u64cd\u4f5c\u503e\u5411";
const LABEL_TODAY_MODE = "\u4eca\u65e5\u6a21\u5f0f";
const LABEL_STRONGEST = "\u4eca\u65e5\u6700\u5f3a\u65b9\u5411";
const LABEL_ETH = "ETH / \u4e3b\u6d41\u8d44\u4ea7\u72b6\u6001";
const LABEL_STABLE = "\u7a33\u5b9a\u5e01\u6d41\u52a8\u6027";
const LABEL_MOVERS = "\u4e3b\u6d41\u5e01\u5f02\u52a8 Top 5";
const LABEL_ALPHA_FOCUS = "Alpha \u89c2\u5bdf\u7126\u70b9";
const LABEL_ALPHA = "Alpha \u89c2\u5bdf";

function SummaryBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-3">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-1 text-sm leading-6 text-zinc-800">{value}</p>
    </div>
  );
}

export function DecisionCard({ model, dataProvenance }: DecisionCardProps) {
  const ethSummary = model.ethAndMainstreamSummary.trim() || "\u2014";
  const stableSummary = model.stablecoinLiquiditySummary.trim() || "\u2014";

  const alphaObservationLabel = model.supportsAltAlphaObservation
    ? model.suitableToAddPosition
      ? "\u53ef\u65b0\u589e\u89c2\u5bdf\u4ed3\uff08\u975e\u4e70\u5165\u6e05\u5355\uff09"
      : "\u4ec5\u89c2\u5bdf Alpha\uff0c\u4e0d\u5efa\u8bae\u65b0\u589e\u4ed3\u4f4d"
    : "\u6682\u4e0d\u9002\u5408\u6269\u5c55 Alpha \u89c2\u5bdf";

  return (
    <section
      className="flex flex-col gap-5 rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:p-5"
      aria-label={LABEL_DECISION_CARD}
    >
      <header className="flex flex-col gap-2 border-b border-zinc-200 pb-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold text-zinc-900">{LABEL_DECISION_CARD}</h2>
          <time className="text-sm text-zinc-500" dateTime={model.asOf}>
            {model.asOf}
          </time>
        </div>
        <p className="text-sm font-medium leading-6 text-zinc-700">{model.headline}</p>
      </header>

      <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
          {LABEL_ONE_LINE}
        </p>
        <p className="mt-2 text-sm leading-6 text-amber-950">{model.conclusion}</p>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          {LABEL_RISK}
        </p>
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
                <span className="mx-2 text-red-300">{"\u00b7"}</span>
                {risk.message}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-500">{"\u2014"}</p>
        )}
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-zinc-200 bg-white p-3">
          <dt className="text-xs font-medium text-zinc-500">{LABEL_MARKET}</dt>
          <dd className="mt-1 text-sm font-semibold text-zinc-900">
            {formatMarketRegime(model.marketRegime)}
            <span className="ml-2 font-mono text-zinc-600">
              ({formatMarketScore(model.marketScore)})
            </span>
          </dd>
        </div>
        <div className="rounded-md border border-zinc-200 bg-white p-3">
          <dt className="text-xs font-medium text-zinc-500">{LABEL_BTC_CYCLE}</dt>
          <dd className="mt-1 text-sm font-semibold text-zinc-900">
            {formatBtcCycleStage(model.btcCycleStage)}
          </dd>
        </div>
        <div className="rounded-md border border-zinc-200 bg-white p-3 sm:col-span-2">
          <dt className="text-xs font-medium text-zinc-500">{LABEL_BTC_BIAS}</dt>
          <dd className="mt-1 text-sm leading-6 text-zinc-800">{model.btcActionBias}</dd>
        </div>
        <div className="rounded-md border border-zinc-200 bg-white p-3 sm:col-span-2">
          <dt className="text-xs font-medium text-zinc-500">{LABEL_TODAY_MODE}</dt>
          <dd className="mt-1 text-sm text-zinc-800">
            {model.observationOnly
              ? "\u4ee5\u89c2\u5bdf\u4e3a\u4e3b\uff0c\u8c28\u614e\u8fdb\u653b"
              : "\u53ef\u8ddf\u8e2a\u7ed3\u6784\u6027\u673a\u4f1a\uff0c\u63a7\u5236\u8282\u594f"}
          </dd>
        </div>
        {model.strongestDirection?.trim() ? (
          <div className="rounded-md border border-zinc-200 bg-white p-3 sm:col-span-2">
            <dt className="text-xs font-medium text-zinc-500">{LABEL_STRONGEST}</dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900">
              {model.strongestDirection}
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="flex flex-col gap-3">
        <SummaryBlock label={LABEL_ETH} value={ethSummary} />
        <SummaryBlock label={LABEL_STABLE} value={stableSummary} />
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-zinc-200 bg-white p-3">
          <dt className="text-xs font-medium text-zinc-500">{LABEL_MOVERS}</dt>
          <dd className="mt-1 font-mono text-sm text-zinc-800">
            {formatSymbolList(model.topMoverSymbols)}
          </dd>
        </div>
        <div className="rounded-md border border-zinc-200 bg-white p-3">
          <dt className="text-xs font-medium text-zinc-500">{LABEL_ALPHA_FOCUS}</dt>
          <dd className="mt-1 font-mono text-sm text-zinc-800">
            {formatSymbolList(model.alphaFocusSymbols)}
          </dd>
        </div>
        <section className="rounded-md border border-zinc-200 bg-white p-3 sm:col-span-2">
          <dt className="text-xs font-medium text-zinc-500">{LABEL_ALPHA}</dt>
          <dd className="mt-1 text-sm text-zinc-800">{alphaObservationLabel}</dd>
        </section>
      </dl>

      {dataProvenance ? <DataProvenanceFooter summary={dataProvenance} /> : null}
    </section>
  );
}

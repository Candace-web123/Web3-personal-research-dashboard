import { DataProvenanceFooter } from "@/components/dashboard/data-provenance-footer";
import type { BtcCycleSnapshot, CardDataProvenanceSummary } from "@/data/types";
import { displayOrDash, formatBtcCycleStage } from "@/lib/display-utils";

export type BtcCycleCardProps = {
  snapshot: BtcCycleSnapshot;
  dataProvenance?: CardDataProvenanceSummary;
  variant?: "full" | "compact";
};

type MetricGroupProps = {
  title: string;
  items: { label: string; value: string }[];
};

function MetricGroup({ title, items }: MetricGroupProps) {
  return (
    <details className="group rounded-md border border-zinc-200 bg-white">
      <summary className="cursor-pointer list-none px-3 py-2 text-sm font-medium text-zinc-800 marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-2">
          {title}
          <span className="text-xs font-normal text-zinc-400 group-open:rotate-180">▼</span>
        </span>
      </summary>
      <dl className="border-t border-zinc-100 px-3 py-2">
        {items.map((item) => (
          <div key={item.label} className="py-1.5">
            <dt className="text-xs text-zinc-500">{item.label}</dt>
            <dd className="mt-0.5 text-sm leading-6 text-zinc-800">{item.value}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

function CompactBtcCycleCard({ snapshot }: { snapshot: BtcCycleSnapshot }) {
  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      aria-label="BTC 周期指标"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">BTC 周期指标</h3>
        <span className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-600">
          {formatBtcCycleStage(snapshot.cycleStage)}
        </span>
      </div>
      <dl className="space-y-3 text-sm">
        <MetricRow label="价格" value={displayOrDash(snapshot.priceUsd)} />
        <MetricRow label="MVRV" value={displayOrDash(snapshot.mvrv)} />
        <MetricRow label="NUPL" value={displayOrDash(snapshot.nupl)} />
        <MetricRow label="恐惧贪婪" value={displayOrDash(snapshot.fearGreedIndex)} />
        <MetricRow label="ETF 流入" value={displayOrDash(snapshot.etfFlowSummary)} />
      </dl>
      <p className="mt-3 rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5 text-[10px] text-slate-500">
        综合：{displayOrDash(snapshot.currentJudgement)}
      </p>
    </section>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="text-sm font-semibold text-slate-800">{value}</dd>
    </div>
  );
}

export function BtcCycleCard({
  snapshot,
  dataProvenance,
  variant = "full"
}: BtcCycleCardProps) {
  if (variant === "compact") {
    return <CompactBtcCycleCard snapshot={snapshot} />;
  }

  const alphaObservationHint = snapshot.supportsAltAlphaObservation
    ? "可观察山寨 Alpha（观察池，非买入清单）"
    : "暂不适合扩展山寨 Alpha 观察";

  return (
    <section
      className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:p-5"
      aria-label="BTC 周期卡"
    >
      <header className="flex flex-col gap-2 border-b border-zinc-200 pb-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold text-zinc-900">BTC 周期</h2>
          <time className="text-sm text-zinc-500" dateTime={snapshot.asOf}>
            {snapshot.asOf}
          </time>
        </div>
        <p className="font-mono text-2xl font-semibold tracking-tight text-zinc-900">
          {displayOrDash(snapshot.priceUsd)}
        </p>
        <div className="rounded-md border border-sky-200 bg-sky-50 px-3 py-2">
          <p className="text-xs font-medium text-sky-800">周期阶段</p>
          <p className="mt-1 text-base font-semibold text-sky-950">
            {formatBtcCycleStage(snapshot.cycleStage)}
          </p>
        </div>
        <p className="text-sm leading-6 text-zinc-700">
          <span className="font-medium text-zinc-800">操作倾向：</span>
          {displayOrDash(snapshot.btcActionBias)}
        </p>
      </header>

      <p className="text-sm leading-6 text-zinc-700 line-clamp-2">
        {displayOrDash(snapshot.currentJudgement)}
      </p>

      <p className="text-xs text-zinc-600">{alphaObservationHint}</p>

      <div className="flex flex-col gap-2">
        <MetricGroup
          title="链上指标"
          items={[
            { label: "MVRV", value: displayOrDash(snapshot.mvrv) },
            { label: "NUPL", value: displayOrDash(snapshot.nupl) },
            { label: "Puell Multiple", value: displayOrDash(snapshot.puellMultiple) },
            { label: "Pi Cycle", value: displayOrDash(snapshot.piCycleSignal) },
            { label: "200 周均线", value: displayOrDash(snapshot.twoHundredWeekMa) }
          ]}
        />
        <MetricGroup
          title="情绪"
          items={[{ label: "恐惧贪婪指数", value: displayOrDash(snapshot.fearGreedIndex) }]}
        />
        <MetricGroup
          title="资金"
          items={[{ label: "ETF 流入", value: displayOrDash(snapshot.etfFlowSummary) }]}
        />
        <MetricGroup
          title="宏观"
          items={[
            { label: "宏观流动性", value: displayOrDash(snapshot.macroLiquiditySummary) }
          ]}
        />
      </div>

      {snapshot.riskNotes.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            风险提示
          </p>
          <ul className="flex flex-col gap-1.5">
            {snapshot.riskNotes.map((note) => (
              <li
                key={note}
                className="rounded-md border border-amber-100 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-950"
              >
                {note}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {dataProvenance ? <DataProvenanceFooter summary={dataProvenance} /> : null}
    </section>
  );
}

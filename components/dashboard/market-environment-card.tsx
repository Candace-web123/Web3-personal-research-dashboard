import { DataProvenanceFooter } from "@/components/dashboard/data-provenance-footer";
import type {
  CardDataProvenanceSummary,
  MarketDimensionScore,
  MarketEnvironmentSnapshot
} from "@/data/types";
import {
  dimensionScoreTone,
  formatDimensionScore,
  formatMarketRegime,
  formatMarketScore
} from "@/lib/display-utils";

export type MarketEnvironmentCardProps = {
  snapshot: MarketEnvironmentSnapshot;
  dataProvenance?: CardDataProvenanceSummary;
  variant?: "full" | "compact";
};

const DIMENSION_LABELS: { key: keyof MarketEnvironmentSnapshot; label: string }[] = [
  { key: "stablecoinsScore", label: "Stablecoin \u6d41\u5411" },
  { key: "defiTvlScore", label: "DeFi TVL" },
  { key: "dexVolumeScore", label: "DEX \u6210\u4ea4\u91cf" },
  { key: "etfDatScore", label: "ETF \u6d41\u5165" },
  { key: "macroPolicyScore", label: "\u5b8f\u89c2\u653f\u7b56" }
];

function scoreToBarWidth(score: MarketDimensionScore): string {
  if (score > 0) return "72%";
  if (score < 0) return "38%";
  return "55%";
}

function mockDisplayScore(totalScore: number): number {
  return Math.min(100, Math.max(0, Math.round(50 + totalScore * 6.5)));
}

function displayOrDash(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "\u2014";
}

type DimensionTileProps = {
  label: string;
  score: MarketDimensionScore;
};

function DimensionTile({ label, score }: DimensionTileProps) {
  return (
    <div className={`rounded-md border px-3 py-2 ${dimensionScoreTone(score)}`}>
      <p className="text-xs font-medium opacity-80">{label}</p>
      <p className="mt-1 font-mono text-lg font-semibold">
        {formatDimensionScore(score)}
      </p>
    </div>
  );
}

function SummaryBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-3">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-1 text-sm leading-6 text-zinc-800">{value}</p>
    </div>
  );
}

function CompactMarketEnvironmentCard({
  snapshot
}: {
  snapshot: MarketEnvironmentSnapshot;
}) {
  const displayScore = mockDisplayScore(snapshot.totalScore);

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      aria-label="\u5e02\u573a\u73af\u5883\u8bc4\u5206"
    >
      <div className="mb-4 flex items-end justify-between">
        <h3 className="text-sm font-bold text-slate-800">{"\u5e02\u573a\u73af\u5883\u8bc4\u5206"}</h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-900">{displayScore}</p>
          <p className="text-[10px] text-slate-400">/ 100</p>
        </div>
      </div>
      <p className="mb-3 text-xs font-semibold text-amber-700">
        {formatMarketRegime(snapshot.regime)} \u00b7 \u4e2d\u6027\u504f\u9632\u5b88\uff08mock\uff09
      </p>
      <ul className="space-y-2">
        {DIMENSION_LABELS.map(({ key, label }) => {
          const score = snapshot[key] as MarketDimensionScore;
          return (
            <li key={key}>
              <div className="mb-1 flex justify-between text-[10px] text-slate-500">
                <span>{label}</span>
                <span>{formatDimensionScore(score)}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${score > 0 ? "bg-emerald-500" : score < 0 ? "bg-rose-400" : "bg-slate-400"}`}
                  style={{ width: scoreToBarWidth(score) }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 line-clamp-3 text-[10px] leading-5 text-slate-500">
        {displayOrDash(snapshot.ethAndMainstreamSummary)} \u00b7{" "}
        {displayOrDash(snapshot.stablecoinLiquiditySummary)}
      </p>
    </section>
  );
}

export function MarketEnvironmentCard({
  snapshot,
  dataProvenance,
  variant = "full"
}: MarketEnvironmentCardProps) {
  if (variant === "compact") {
    return <CompactMarketEnvironmentCard snapshot={snapshot} />;
  }

  return (
    <section
      className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:p-5"
      aria-label="\u5e02\u573a\u73af\u5883\u8bc4\u5206\u5361"
    >
      <header className="flex flex-col gap-2 border-b border-zinc-200 pb-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold text-zinc-900">
            \u5e02\u573a\u73af\u5883
          </h2>
          <time className="text-sm text-zinc-500" dateTime={snapshot.asOf}>
            {snapshot.asOf}
          </time>
        </div>
      </header>

      <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
          \u4eca\u65e5\u5e02\u573a\u73af\u5883\u7ed3\u8bba
        </p>
        <p className="mt-2 text-sm leading-6 text-amber-950">
          {displayOrDash(snapshot.conclusion)}
        </p>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-violet-200 bg-violet-50 px-3 py-2">
          <dt className="text-xs font-medium text-violet-800">
            \u73af\u5883\u5206\u7c7b
          </dt>
          <dd className="mt-1 text-base font-semibold text-violet-950">
            {formatMarketRegime(snapshot.regime)}
          </dd>
        </div>
        <div className="rounded-md border border-zinc-200 bg-white px-3 py-2">
          <dt className="text-xs font-medium text-zinc-500">
            \u5e02\u573a\u603b\u5206
          </dt>
          <dd className="mt-1 font-mono text-2xl font-semibold text-zinc-900">
            {formatMarketScore(snapshot.totalScore)}
          </dd>
        </div>
      </dl>

      <div className="flex flex-col gap-3">
        <SummaryBlock
          label="ETH / \u4e3b\u6d41\u8d44\u4ea7\u72b6\u6001"
          value={displayOrDash(snapshot.ethAndMainstreamSummary)}
        />
        <SummaryBlock
          label="\u7a33\u5b9a\u5e01\u6d41\u52a8\u6027"
          value={displayOrDash(snapshot.stablecoinLiquiditySummary)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          \u4e94\u7ef4\u8bc4\u5206\uff08-1 \u504f\u7a7a / 0 \u4e2d\u6027 / +1 \u504f\u591a\uff09
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          <DimensionTile label="Stablecoins" score={snapshot.stablecoinsScore} />
          <DimensionTile label="DeFi TVL" score={snapshot.defiTvlScore} />
          <DimensionTile label="DEX Volume" score={snapshot.dexVolumeScore} />
          <DimensionTile label="ETF / DAT" score={snapshot.etfDatScore} />
          <DimensionTile label="\u5b8f\u89c2\u653f\u7b56" score={snapshot.macroPolicyScore} />
        </div>
      </div>

      {snapshot.topRisks.length > 0 ? (
        <div className="flex flex-col gap-2 border-t border-zinc-200 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            \u98ce\u9669\u63d0\u793a
          </p>
          <ul className="flex flex-col gap-1.5">
            {snapshot.topRisks.map((risk) => (
              <li
                key={`${risk.priority}-${risk.code}`}
                className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm leading-6 text-red-900"
              >
                <span className="font-mono text-xs font-semibold text-red-700">
                  {risk.priority}
                </span>
                <span className="mx-2 text-red-300">\u00b7</span>
                {risk.message}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="border-t border-zinc-200 pt-4 text-sm text-zinc-500">\u2014</p>
      )}

      {dataProvenance ? <DataProvenanceFooter summary={dataProvenance} /> : null}
    </section>
  );
}

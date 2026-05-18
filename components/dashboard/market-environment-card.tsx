import type {
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
};

function displayOrDash(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}

type DimensionTileProps = {
  label: string;
  score: MarketDimensionScore;
};

function DimensionTile({ label, score }: DimensionTileProps) {
  return (
    <div
      className={`rounded-md border px-3 py-2 ${dimensionScoreTone(score)}`}
    >
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

export function MarketEnvironmentCard({ snapshot }: MarketEnvironmentCardProps) {
  return (
    <section
      className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:p-5"
      aria-label="市场环境评分卡"
    >
      <header className="flex flex-col gap-2 border-b border-zinc-200 pb-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold text-zinc-900">市场环境</h2>
          <time className="text-sm text-zinc-500" dateTime={snapshot.asOf}>
            {snapshot.asOf}
          </time>
        </div>
        <p className="text-xs text-zinc-500">数据来源：本地 mock（MVP）</p>
      </header>

      <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
          今日市场环境结论
        </p>
        <p className="mt-2 text-sm leading-6 text-amber-950">
          {displayOrDash(snapshot.conclusion)}
        </p>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-violet-200 bg-violet-50 px-3 py-2">
          <dt className="text-xs font-medium text-violet-800">环境分类</dt>
          <dd className="mt-1 text-base font-semibold text-violet-950">
            {formatMarketRegime(snapshot.regime)}
          </dd>
        </div>
        <div className="rounded-md border border-zinc-200 bg-white px-3 py-2">
          <dt className="text-xs font-medium text-zinc-500">市场总分</dt>
          <dd className="mt-1 font-mono text-2xl font-semibold text-zinc-900">
            {formatMarketScore(snapshot.totalScore)}
          </dd>
        </div>
      </dl>

      <div className="flex flex-col gap-3">
        <SummaryBlock
          label="ETH / 主流资产状态"
          value={displayOrDash(snapshot.ethAndMainstreamSummary)}
        />
        <SummaryBlock
          label="稳定币流动性"
          value={displayOrDash(snapshot.stablecoinLiquiditySummary)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          五维评分（-1 偏空 / 0 中性 / +1 偏多）
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          <DimensionTile label="Stablecoins" score={snapshot.stablecoinsScore} />
          <DimensionTile label="DeFi TVL" score={snapshot.defiTvlScore} />
          <DimensionTile label="DEX Volume" score={snapshot.dexVolumeScore} />
          <DimensionTile label="ETF / DAT" score={snapshot.etfDatScore} />
          <DimensionTile
            label="宏观政策"
            score={snapshot.macroPolicyScore}
          />
        </div>
      </div>

      {snapshot.topRisks.length > 0 ? (
        <div className="flex flex-col gap-2 border-t border-zinc-200 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            风险提示
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
                <span className="mx-2 text-red-300">·</span>
                {risk.message}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="border-t border-zinc-200 pt-4 text-sm text-zinc-500">—</p>
      )}
    </section>
  );
}

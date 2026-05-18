import type { MoverTop5Entry } from "@/data/movers-top5";
import type { UniverseAssetStatus } from "@/data/types";
import {
  formatPercentChange,
  formatUniverseAssetStatus,
  percentChangeTone
} from "@/lib/display-utils";

export type MoversTop5CardProps = {
  movers: readonly MoverTop5Entry[];
};

const MAX_ROWS = 5;

function displayOrDash(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}

function statusTone(status: UniverseAssetStatus): string {
  switch (status) {
    case "AlphaCandidate":
      return "border-violet-200 bg-violet-50 text-violet-800";
    case "DeepDive":
      return "border-sky-200 bg-sky-50 text-sky-800";
    case "RiskElevated":
      return "border-rose-200 bg-rose-50 text-rose-800";
    case "Moving":
      return "border-amber-200 bg-amber-50 text-amber-800";
    default:
      return "border-zinc-200 bg-zinc-100 text-zinc-700";
  }
}

type MoverRowProps = {
  mover: MoverTop5Entry;
  rank: number;
};

function MoverRow({ mover, rank }: MoverRowProps) {
  return (
    <article className="rounded-md border border-zinc-200 bg-white p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-zinc-500">#{rank}</p>
          <p className="mt-0.5 font-mono text-base font-semibold text-zinc-900">
            {mover.symbol}
            <span className="ml-2 font-sans text-sm font-normal text-zinc-600">
              {mover.name}
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500">24h</p>
          <p
            className={`font-mono text-sm font-semibold ${percentChangeTone(mover.priceChange24h)}`}
          >
            {formatPercentChange(mover.priceChange24h)}
          </p>
          {mover.priceChange7d !== undefined ? (
            <p className="mt-0.5 text-xs text-zinc-500">
              7d{" "}
              <span className={`font-mono ${percentChangeTone(mover.priceChange7d)}`}>
                {formatPercentChange(mover.priceChange7d)}
              </span>
            </p>
          ) : null}
        </div>
      </div>

      <p className="mt-2 text-sm leading-6 text-zinc-800">
        <span className="font-medium text-zinc-700">异动原因：</span>
        {displayOrDash(mover.moverReason)}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusTone(mover.status)}`}
        >
          {formatUniverseAssetStatus(mover.status)}
        </span>
      </div>

      {mover.volumeNote?.trim() ? (
        <p className="mt-2 text-xs leading-5 text-zinc-600">
          <span className="font-medium text-zinc-500">成交量：</span>
          {mover.volumeNote}
        </p>
      ) : null}

      {mover.riskNote?.trim() ? (
        <p className="mt-2 rounded-md border border-amber-100 bg-amber-50 px-2 py-1.5 text-xs leading-5 text-amber-950">
          <span className="font-medium">风险提示：</span>
          {mover.riskNote}
        </p>
      ) : null}
    </article>
  );
}

function PlaceholderRow({ index }: { index: number }) {
  return (
    <article className="rounded-md border border-dashed border-zinc-300 bg-zinc-100/80 p-3">
      <p className="text-xs font-medium text-zinc-500">#{index}</p>
      <p className="mt-1 text-sm text-zinc-500">mock 未配置（观察宇宙扫描占位）</p>
    </article>
  );
}

export function MoversTop5Card({ movers }: MoversTop5CardProps) {
  const rows = movers.slice(0, MAX_ROWS);
  const placeholderCount = Math.max(0, MAX_ROWS - rows.length);

  return (
    <section
      className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:p-5"
      aria-label="主流币异动 Top 5"
    >
      <header className="border-b border-zinc-200 pb-3">
        <h2 className="text-lg font-semibold text-zinc-900">今日异动 Top 5</h2>
        <p className="mt-1 text-xs leading-5 text-zinc-500">
          来自观察宇宙扫描，非全市场涨跌幅排名；仅供异动观察，非买入清单。
        </p>
      </header>

      <ul className="flex flex-col gap-3">
        {rows.map((mover, index) => (
          <li key={mover.assetId}>
            <MoverRow mover={mover} rank={index + 1} />
          </li>
        ))}
        {Array.from({ length: placeholderCount }, (_, index) => (
          <li key={`placeholder-${index + rows.length + 1}`}>
            <PlaceholderRow index={rows.length + index + 1} />
          </li>
        ))}
      </ul>
    </section>
  );
}

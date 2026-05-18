import type { AlphaPoolEntry, RiskTag } from "@/data/types";
import {
  alphaGradeTone,
  formatAlphaLifecycleState,
  riskPriorityTone
} from "@/lib/display-utils";

export type AlphaPoolCardProps = {
  entries: readonly AlphaPoolEntry[];
};

const MAX_ENTRIES = 10;
const MAX_RISKS_SHOWN = 3;

function displayOrDash(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}

type AlphaEntryRowProps = {
  entry: AlphaPoolEntry;
  rank: number;
};

function RiskItem({ risk }: { risk: RiskTag }) {
  return (
    <li
      className={`rounded-md border px-2 py-1.5 text-xs leading-5 ${riskPriorityTone(risk.priority)}`}
    >
      <span className="font-mono font-semibold">{risk.priority}</span>
      <span className="mx-1.5 opacity-40">·</span>
      {risk.message}
    </li>
  );
}

function AlphaEntryRow({ entry, rank }: AlphaEntryRowProps) {
  const risksShown = entry.risks.slice(0, MAX_RISKS_SHOWN);

  return (
    <article className="rounded-md border border-zinc-200 bg-white p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-zinc-500">#{rank}</p>
          <p className="mt-0.5 font-mono text-base font-semibold text-zinc-900">
            {entry.token}
            <span className="ml-2 font-sans text-sm font-normal text-zinc-600">
              {displayOrDash(entry.projectName)}
            </span>
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {displayOrDash(entry.chain)} · {displayOrDash(entry.sector)}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span
            className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${alphaGradeTone(entry.grade)}`}
          >
            {entry.grade} 级
          </span>
          <span className="rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-800">
            {formatAlphaLifecycleState(entry.lifecycle)}
          </span>
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-zinc-800">
        <span className="font-medium text-zinc-700">进池理由：</span>
        {displayOrDash(entry.thesisLine)}
      </p>

      <div className="mt-2 rounded-md border border-sky-200 bg-sky-50 px-3 py-2">
        <p className="text-xs font-medium text-sky-800">下一步验证</p>
        <p className="mt-1 text-sm leading-6 text-sky-950">
          {displayOrDash(entry.nextVerification)}
        </p>
      </div>

      <details className="group mt-3 rounded-md border border-zinc-100 bg-zinc-50">
        <summary className="cursor-pointer list-none px-3 py-2 text-xs font-medium text-zinc-600 marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-2">
            辅助说明（异动 / 催化 / 风险）
            <span className="text-zinc-400 group-open:rotate-180">▼</span>
          </span>
        </summary>
        <div className="space-y-2 border-t border-zinc-100 px-3 py-2 text-sm leading-6 text-zinc-700">
          <p>
            <span className="font-medium text-zinc-600">核心异动：</span>
            {displayOrDash(entry.coreMoveSummary)}
          </p>
          <p>
            <span className="font-medium text-zinc-600">催化：</span>
            {displayOrDash(entry.catalyst)}
          </p>
          <p>
            <span className="font-medium text-zinc-600">最大风险：</span>
            {displayOrDash(entry.maxRisk)}
          </p>
          {risksShown.length > 0 ? (
            <ul className="flex flex-col gap-1.5 pt-1">
              {risksShown.map((risk) => (
                <RiskItem key={`${risk.priority}-${risk.code}`} risk={risk} />
              ))}
            </ul>
          ) : (
            <p className="text-xs text-zinc-500">风险标签：—</p>
          )}
        </div>
      </details>
    </article>
  );
}

export function AlphaPoolCard({ entries }: AlphaPoolCardProps) {
  const rows = entries.slice(0, MAX_ENTRIES);

  return (
    <section
      className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:p-5"
      aria-label="Alpha 观察池 Top 10"
    >
      <header className="border-b border-zinc-200 pb-3">
        <h2 className="text-lg font-semibold text-zinc-900">Alpha 观察池 Top 10</h2>
        <p className="mt-1 text-xs leading-5 text-zinc-500">
          观察池 ≠ 买入清单；以下项目仅供跟踪与验证，需结合 BTC 周期与市场环境独立判断。
        </p>
      </header>

      {rows.length === 0 ? (
        <p className="text-sm text-zinc-500">暂无 Alpha 观察条目（mock 未配置）。</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((entry, index) => (
            <li key={entry.id}>
              <AlphaEntryRow entry={entry} rank={index + 1} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

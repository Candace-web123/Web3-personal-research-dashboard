import type { StrongChainEntry } from "@/data/types";
import { formatStrongChainKind } from "@/lib/display-utils";
import { StrongSignalEntryLayout } from "./strong-signal-entry-layout";

export type StrongChainTopProps = {
  entries: readonly StrongChainEntry[];
};

const MAX_ENTRIES = 3;

export function StrongChainTop({ entries }: StrongChainTopProps) {
  const rows = entries.slice(0, MAX_ENTRIES);

  return (
    <section
      className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:p-5"
      aria-label="强链 Top 3"
    >
      <header className="border-b border-zinc-200 pb-2">
        <h3 className="text-base font-semibold text-zinc-900">强链 Top 3</h3>
        <p className="mt-1 text-xs leading-5 text-zinc-500">
          综合 TVL、稳定币、DEX、费用与趋势一致性；非 TVL 排名榜。
        </p>
      </header>

      <ul className="flex flex-col gap-3">
        {rows.map((entry) => (
          <li key={entry.id}>
            <StrongSignalEntryLayout
              rank={entry.rank}
              title={entry.chainName}
              subtitle={`类型：${formatStrongChainKind(entry.chainKind)} · 适合观察：${entry.suitableFor}`}
              headlineConclusion={entry.headlineConclusion}
              metrics={entry.metrics}
              dataNarrative={entry.dataNarrative}
              riskNote={entry.riskNote}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

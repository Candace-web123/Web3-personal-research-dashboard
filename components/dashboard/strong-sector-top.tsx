import type { StrongSectorEntry } from "@/data/types";
import { StrongSignalEntryLayout } from "./strong-signal-entry-layout";

export type StrongSectorTopProps = {
  entries: readonly StrongSectorEntry[];
};

const MAX_ENTRIES = 3;

export function StrongSectorTop({ entries }: StrongSectorTopProps) {
  const rows = entries.slice(0, MAX_ENTRIES);

  return (
    <section
      className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:p-5"
      aria-label="强赛道 Top 3"
    >
      <header className="border-b border-zinc-200 pb-2">
        <h3 className="text-base font-semibold text-zinc-900">强赛道 Top 3</h3>
        <p className="mt-1 text-xs leading-5 text-zinc-500">
          关注赛道 TVL、成交、费用与多项目共振；警惕单项目孤立上涨。
        </p>
      </header>

      <ul className="flex flex-col gap-3">
        {rows.map((entry) => (
          <li key={entry.id}>
            <StrongSignalEntryLayout
              rank={entry.rank}
              title={entry.sectorName}
              headlineConclusion={entry.headlineConclusion}
              metrics={entry.metrics}
              dataNarrative={entry.dataNarrative}
              extraDataBlock={
                <p className="mt-2 text-xs leading-5 text-zinc-600">
                  <span className="font-medium text-zinc-700">共振情况：</span>
                  {entry.resonanceNote}
                </p>
              }
              riskNote={entry.riskNote}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

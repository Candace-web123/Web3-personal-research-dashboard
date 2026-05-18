import type { StrongProtocolEntry } from "@/data/types";
import { StrongSignalEntryLayout } from "./strong-signal-entry-layout";

export type StrongProtocolTopProps = {
  entries: readonly StrongProtocolEntry[];
};

const MAX_ENTRIES = 5;

function protocolSubtitle(entry: StrongProtocolEntry): string {
  const tokenPart = entry.token ? ` · ${entry.token}` : "";
  return `${entry.chain} · ${entry.sector}${tokenPart}`;
}

export function StrongProtocolTop({ entries }: StrongProtocolTopProps) {
  const rows = entries.slice(0, MAX_ENTRIES);

  return (
    <section
      className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:p-5"
      aria-label="强协议 Top 5"
    >
      <header className="border-b border-zinc-200 pb-2">
        <h3 className="text-base font-semibold text-zinc-900">强协议 Top 5</h3>
        <p className="mt-1 text-xs leading-5 text-zinc-500">
          协议数据变强 ≠ 代币值得买入；观察池用于验证，非喊单清单。
        </p>
      </header>

      <ul className="flex flex-col gap-3">
        {rows.map((entry) => (
          <li key={entry.id}>
            <StrongSignalEntryLayout
              rank={entry.rank}
              title={entry.protocolName}
              subtitle={protocolSubtitle(entry)}
              headlineConclusion={entry.headlineConclusion}
              metrics={entry.metrics}
              dataNarrative={entry.dataNarrative}
              extraDataBlock={
                <p className="mt-2 rounded-md border border-violet-100 bg-violet-50/80 px-2 py-1.5 text-xs leading-5 text-violet-950">
                  <span className="font-medium">协议 vs 代币：</span>
                  {entry.protocolVsTokenNote}
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

import type { ReactNode } from "react";
import type { StrongSignalMetric } from "@/data/types";

type StrongSignalEntryLayoutProps = {
  rank: number;
  title: string;
  subtitle?: string;
  headlineConclusion: string;
  metrics: readonly StrongSignalMetric[];
  dataNarrative: string;
  extraDataBlock?: ReactNode;
  riskNote?: string;
};

function displayOrDash(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}

export function StrongSignalEntryLayout({
  rank,
  title,
  subtitle,
  headlineConclusion,
  metrics,
  dataNarrative,
  extraDataBlock,
  riskNote
}: StrongSignalEntryLayoutProps) {
  return (
    <article className="rounded-md border border-zinc-200 bg-white p-3">
      <div>
        <p className="text-xs font-medium text-zinc-500">#{rank}</p>
        <p className="mt-0.5 text-base font-semibold text-zinc-900">{title}</p>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>
        ) : null}
      </div>

      <div className="mt-3 rounded-md border border-sky-100 bg-sky-50/80 px-3 py-2">
        <p className="text-xs font-semibold text-sky-900">结论</p>
        <p className="mt-1 text-sm leading-6 text-sky-950">{headlineConclusion}</p>
      </div>

      <div className="mt-3">
        <p className="text-xs font-semibold text-zinc-600">关键数据</p>
        <dl className="mt-2 grid gap-2 sm:grid-cols-2">
          {metrics.map((metric) => (
            <div
              key={`${metric.label}-${metric.value}`}
              className="rounded border border-zinc-100 bg-zinc-50 px-2 py-1.5"
            >
              <dt className="text-xs text-zinc-500">{metric.label}</dt>
              <dd className="mt-0.5 font-mono text-sm text-zinc-800">{metric.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-sm leading-6 text-zinc-700">{displayOrDash(dataNarrative)}</p>
        {extraDataBlock}
      </div>

      {riskNote?.trim() ? (
        <p className="mt-3 rounded-md border border-amber-100 bg-amber-50 px-2 py-1.5 text-xs leading-5 text-amber-950">
          <span className="font-medium">风险提示：</span>
          {riskNote}
        </p>
      ) : null}
    </article>
  );
}

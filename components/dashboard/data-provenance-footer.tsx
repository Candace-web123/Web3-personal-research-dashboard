import type { CardDataProvenanceSummary } from "@/data/types";
import { DataFreshnessStatus } from "@/data/types";
import {
  dataFreshnessHintTone,
  dataFreshnessStatusTone,
  formatDataFreshnessStatus,
  formatDataUpdateFrequency
} from "@/lib/display-utils";

export type DataProvenanceFooterProps = {
  summary: CardDataProvenanceSummary;
};

const LABEL_DATA_TRUST = "\u6570\u636e\u53ef\u4fe1\u5ea6";
const LABEL_DATA_TIME = "\u6570\u636e\u65f6\u95f4";
const LABEL_SOURCE = "\u6765\u6e90\uff1a";
const LABEL_METRICS_DETAIL = "\u5173\u952e\u6307\u6807\u6765\u6e90\u660e\u7ec6";
const LABEL_PARTICIPATES = "\u53c2\u4e0e\u8bc4\u5206";
const LABEL_NOT_PARTICIPATES = "\u4e0d\u53c2\u4e0e\u8bc4\u5206";
const LABEL_FALLBACK = "\u5907\u7528\uff1a";
const LABEL_UPDATED = "\u66f4\u65b0";
const LABEL_FREQ = "\u9891\u7387";
const LABEL_OVERRIDE = "\u8986\u76d6\u539f\u56e0\uff1a";

function participatesLabel(participates: boolean): string {
  return participates ? LABEL_PARTICIPATES : LABEL_NOT_PARTICIPATES;
}

export function DataProvenanceFooter({ summary }: DataProvenanceFooterProps) {
  const showHint =
    summary.overallStatus !== DataFreshnessStatus.Normal &&
    summary.statusHint.trim().length > 0;

  return (
    <footer
      className="mt-4 flex flex-col gap-2 border-t border-zinc-200 pt-4"
      aria-label={LABEL_DATA_TRUST}
    >
      <section className="flex flex-wrap items-center gap-2 text-xs text-zinc-600">
        <span className="font-medium text-zinc-500">{LABEL_DATA_TIME}</span>
        <time dateTime={summary.displayUpdatedAtUtc}>{summary.displayUpdatedAtUtc}</time>
        <span className="text-zinc-300">{"\u00b7"}</span>
        <span
          className={`inline-flex rounded-full border px-2 py-0.5 font-medium ${dataFreshnessStatusTone(summary.overallStatus)}`}
        >
          {formatDataFreshnessStatus(summary.overallStatus)}
        </span>
        <span className="hidden text-zinc-400 sm:inline">|</span>
        <span className="w-full sm:w-auto sm:truncate" title={summary.primarySourcesSummary}>
          {LABEL_SOURCE}
          {summary.primarySourcesSummary}
        </span>
      </section>

      {showHint ? (
        <p
          className={`rounded-md border px-3 py-2 text-xs leading-5 ${dataFreshnessHintTone(summary.overallStatus)}`}
        >
          {summary.statusHint}
        </p>
      ) : null}

      <details className="group rounded-md border border-zinc-200 bg-white text-xs">
        <summary className="cursor-pointer list-none px-3 py-2 font-medium text-zinc-600 marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-2">
            {LABEL_METRICS_DETAIL}
            {"\uff08"}
            {summary.metrics.length}
            {"\uff09"}
            <span className="font-normal text-zinc-400 group-open:rotate-180">{"\u25bc"}</span>
          </span>
        </summary>
        <ul className="divide-y divide-zinc-100 border-t border-zinc-100">
          {summary.metrics.map((metric) => (
            <li key={metric.metricName} className="px-3 py-2.5">
              <section className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-zinc-800">{metric.metricName}</span>
                <span
                  className={`rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${dataFreshnessStatusTone(metric.status)}`}
                >
                  {formatDataFreshnessStatus(metric.status)}
                </span>
                <span className="text-zinc-400">{participatesLabel(metric.participatesInScoring)}</span>
              </section>
              <p className="mt-1 font-mono text-[11px] text-zinc-600">{metric.currentValue}</p>
              <p className="mt-1 text-zinc-500">
                {metric.primarySource}
                {metric.fallbackSource
                  ? ` \u00b7 ${LABEL_FALLBACK}${metric.fallbackSource}`
                  : ""}
              </p>
              <p className="mt-0.5 text-zinc-400">
                {LABEL_UPDATED} {metric.updatedAtUtc} {"\u00b7"} {LABEL_FREQ}{" "}
                {formatDataUpdateFrequency(metric.expectedFrequency)}
              </p>
              {metric.anomalyReason ? (
                <p className="mt-1 text-amber-800">{metric.anomalyReason}</p>
              ) : null}
              {metric.manualOverrideReason ? (
                <p className="mt-1 text-violet-800">
                  {LABEL_OVERRIDE}
                  {metric.manualOverrideReason}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </details>
    </footer>
  );
}

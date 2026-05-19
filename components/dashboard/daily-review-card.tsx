import type { DailyReviewSnapshot } from "@/data/types";

export type DailyReviewCardProps = {
  snapshot: DailyReviewSnapshot;
};

const LABEL_TITLE = "\u6bcf\u65e5\u590d\u76d8";
const LABEL_SUMMARY = "\u4eca\u65e5\u5224\u65ad\u56de\u987e";
const LABEL_RIGHT = "\u76f8\u5bf9\u5408\u7406\u7684\u5224\u65ad";
const LABEL_WRONG = "\u504f\u5dee\u4e0e\u5f85\u4fee\u6b63";
const LABEL_TOMORROW = "\u660e\u65e5\u9a8c\u8bc1\u4fe1\u53f7";
const LABEL_RISKS = "\u98ce\u9669\u8ddf\u8e2a";
const LABEL_NOTES = "\u8865\u5145\u5907\u6ce8";
const LABEL_DISCLAIMER =
  "\u89c2\u5bdf\u8bb0\u5f55\uff0c\u975e\u6295\u8d44\u5efa\u8bae\uff1b\u4e0d\u542b\u4e70\u5165\u5356\u51fa\u6216\u6536\u76ca\u627f\u8bfa\u3002";
const LABEL_EXPAND = "\uff08\u70b9\u51fb\u5c55\u5f00\u00b7\u672c\u5730 mock\uff09";

type ReviewListProps = {
  title: string;
  items: readonly string[];
  toneClass: string;
};

function ReviewList({ title, items, toneClass }: ReviewListProps) {
  return (
    <section className={`rounded-md border px-3 py-2 ${toneClass}`}>
      <h3 className="text-xs font-semibold">{title}</h3>
      <ul className="mt-1.5 list-inside list-disc space-y-1 text-sm leading-6">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export function DailyReviewCard({ snapshot }: DailyReviewCardProps) {
  return (
    <details className="rounded-lg border border-zinc-300 bg-zinc-100/80">
      <summary
        className="cursor-pointer list-none px-4 py-3 marker:content-none [&::-webkit-details-marker]:hidden"
        aria-label={LABEL_TITLE}
      >
        <span className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-semibold text-zinc-800">
            {LABEL_TITLE}
            {LABEL_EXPAND}
          </span>
          <time className="text-xs text-zinc-500" dateTime={snapshot.asOf}>
            {snapshot.asOf}
          </time>
        </span>
        <p className="mt-1 text-xs text-zinc-500">{LABEL_DISCLAIMER}</p>
      </summary>

      <div className="flex flex-col gap-3 border-t border-zinc-200 p-4">
        <section className="rounded-md border border-zinc-200 bg-white px-3 py-2">
          <h3 className="text-xs font-semibold text-zinc-600">{LABEL_SUMMARY}</h3>
          <p className="mt-1 text-sm leading-6 text-zinc-800">{snapshot.decisionSummary}</p>
        </section>

        <ReviewList
          title={LABEL_RIGHT}
          items={snapshot.whatWasRight}
          toneClass="border-emerald-100 bg-emerald-50/80 text-emerald-950"
        />
        <ReviewList
          title={LABEL_WRONG}
          items={snapshot.whatWasWrong}
          toneClass="border-amber-100 bg-amber-50/80 text-amber-950"
        />
        <ReviewList
          title={LABEL_TOMORROW}
          items={snapshot.signalsToTrackTomorrow}
          toneClass="border-sky-100 bg-sky-50/80 text-sky-950"
        />
        <ReviewList
          title={LABEL_RISKS}
          items={snapshot.riskFollowUps}
          toneClass="border-rose-100 bg-rose-50/80 text-rose-950"
        />

        {snapshot.notes?.trim() ? (
          <section className="rounded-md border border-zinc-200 bg-white px-3 py-2">
            <h3 className="text-xs font-semibold text-zinc-600">{LABEL_NOTES}</h3>
            <p className="mt-1 text-sm leading-6 text-zinc-700">{snapshot.notes}</p>
          </section>
        ) : null}
      </div>
    </details>
  );
}

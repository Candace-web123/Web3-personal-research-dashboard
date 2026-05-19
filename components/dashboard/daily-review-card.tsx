import type { DailyReviewSnapshot, TomorrowPositionCondition } from "@/data/types";

export type DailyReviewCardProps = {
  snapshot: DailyReviewSnapshot;
};

const TONE_CLASS: Record<TomorrowPositionCondition["tone"], string> = {
  green: "text-green-600",
  amber: "text-amber-600",
  slate: "text-slate-700",
  blue: "text-blue-600",
  red: "text-red-600"
};

export function DailyReviewCard({ snapshot }: DailyReviewCardProps) {
  return (
    <details className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 marker:content-none hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
        <h2 className="text-base font-bold text-slate-800">
          {"\u4eca\u65e5\u5224\u65ad\u56de\u987e\u4e0e\u590d\u76d8"}
        </h2>
        <time className="text-xs text-slate-500" dateTime={snapshot.asOf}>
          {snapshot.asOf}
        </time>
      </summary>

      <div className="space-y-4 border-t border-slate-100 px-6 pb-6 pt-2">
        {snapshot.tomorrowPositionConditions &&
        snapshot.tomorrowPositionConditions.length > 0 ? (
          <section className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <h3 className="text-xs font-bold text-slate-700">
              {"\u660e\u65e5\u4ed3\u4f4d\u89c2\u5bdf\u6761\u4ef6"}
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {snapshot.tomorrowPositionConditions.map((item) => (
                <article
                  key={item.title}
                  className="rounded-lg border border-slate-100 bg-white p-2.5"
                >
                  <p
                    className={`text-[10px] font-bold ${TONE_CLASS[item.tone]}`}
                  >
                    {item.title}
                  </p>
                  <p className="mt-1 text-[9px] leading-4 text-slate-500">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-slate-400">
              {
                "\u4e0e\u4eca\u65e5\u4ed3\u4f4d\u5efa\u8bae\u8054\u52a8\uff1a\u82e5\u5b9e\u9645\u4ed3\u4f4d\u504f\u5dee\u5df2\u8c03\u6574\uff0c\u660e\u65e5\u89c2\u5bdf\u6761\u4ef6\u5c06\u968f\u4e4b\u66f4\u65b0"
              }
            </p>
          </section>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          <ReviewBlock
            title={"\u5408\u7406\u5224\u65ad"}
            items={snapshot.whatWasRight}
            className="border-green-100 bg-green-50/50 text-green-950"
          />
          <ReviewBlock
            title={"\u504f\u5dee\u4e0e\u4fee\u6b63"}
            items={snapshot.whatWasWrong}
            className="border-amber-100 bg-amber-50/50 text-amber-950"
          />
        </div>

        <ReviewBlock
          title={"\u660e\u65e5\u9a8c\u8bc1\u4fe1\u53f7"}
          items={snapshot.signalsToTrackTomorrow}
          className="border-sky-100 bg-sky-50/50 text-sky-950"
        />

        <section className="rounded-xl border border-slate-100 bg-slate-50 p-3">
          <h3 className="text-xs font-semibold text-slate-700">
            {"\u4eca\u65e5\u5224\u65ad\u56de\u987e"}
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-800">
            {snapshot.decisionSummary}
          </p>
        </section>

        {snapshot.notes?.trim() ? (
          <section className="rounded-xl border border-slate-200 bg-white px-3 py-2">
            <h3 className="text-xs font-semibold text-slate-600">
              {"\u8865\u5145\u5907\u6ce8"}
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-700">{snapshot.notes}</p>
          </section>
        ) : null}

        <p className="text-[10px] text-slate-400">
          {
            "\u89c2\u5bdf\u8bb0\u5f55\uff0c\u975e\u6295\u8d44\u5efa\u8bae\uff1b\u4e0d\u542b\u4e70\u5165\u5356\u51fa\u6216\u6536\u76ca\u627f\u8bfa\u3002"
          }
        </p>
      </div>
    </details>
  );
}

function ReviewBlock({
  title,
  items,
  className
}: {
  title: string;
  items: readonly string[];
  className: string;
}) {
  return (
    <section className={`rounded-xl border px-3 py-2 ${className}`}>
      <h3 className="text-xs font-semibold">{title}</h3>
      <ul className="mt-1.5 list-inside list-disc space-y-1 text-sm leading-6">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

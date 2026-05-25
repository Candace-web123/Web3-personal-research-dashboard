import type { AiDecisionSnapshot } from "@/lib/ai-decision-orchestrator";

export type MarketStateCardProps = {
  snapshot: AiDecisionSnapshot;
};

const CONFIDENCE_BADGE: Record<string, string> = {
  high: "bg-emerald-100 text-emerald-800 border-emerald-300",
  medium: "bg-amber-100 text-amber-800 border-amber-300",
  low: "bg-rose-100 text-rose-800 border-rose-300",
};

const CONFIDENCE_LABEL: Record<string, string> = {
  high: "高信心",
  medium: "中信心",
  low: "低信心",
};

export function MarketStateCard({ snapshot }: MarketStateCardProps) {
  const { marketState } = snapshot;
  const hits = marketState.scoreBreakdown.filter((c) => c.hit).length;
  const total = marketState.scoreBreakdown.length;

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-label="AI 市场状态判定"
    >
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800">今日市场状态</h2>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
            CONFIDENCE_BADGE[marketState.confidence] ?? CONFIDENCE_BADGE.medium
          }`}
        >
          {CONFIDENCE_LABEL[marketState.confidence] ?? marketState.confidence}
        </span>
      </header>

      <div className="mb-4 flex items-baseline gap-3">
        <span className="text-2xl font-bold text-slate-900">
          {marketState.regimeLabel}
        </span>
        <span className="text-xs text-slate-500">
          {hits}/{total} 条件命中
        </span>
      </div>

      {marketState.scoreBreakdown.length > 0 ? (
        <ul className="mb-4 space-y-1.5">
          {marketState.scoreBreakdown.map((c) => (
            <li
              key={c.label}
              className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm ${
                c.hit
                  ? "bg-emerald-50 text-emerald-900"
                  : "bg-slate-50 text-slate-400 line-through"
              }`}
            >
              <span className="font-mono text-xs">
                {c.hit ? "✓" : "✗"}
              </span>
              <span>{c.label}</span>
              {c.required ? (
                <span className="ml-auto text-[10px] font-medium text-slate-400">
                  必选
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          无法判定市场状态，默认按中性震荡处理
        </p>
      )}

      <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
        <p className="text-xs font-medium text-slate-500">下一状态信号</p>
        <p className="mt-1 text-sm text-slate-700">{marketState.nextStateSignal}</p>
      </div>

      {snapshot.liveFields.length > 0 ? (
        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-xs text-slate-500">
            实时：{snapshot.liveFields.join("、")}
          </span>
        </div>
      ) : null}
    </section>
  );
}

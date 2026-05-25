import type { AiDecisionSnapshot } from "@/lib/ai-decision-orchestrator";

export type RiskModeCardProps = {
  snapshot: AiDecisionSnapshot;
};

const MODE_TONE: Record<string, string> = {
  aggressive: "border-emerald-300 bg-emerald-50 text-emerald-900",
  neutral: "border-sky-200 bg-sky-50 text-sky-900",
  conservative: "border-amber-200 bg-amber-50 text-amber-900",
  riskOff: "border-rose-300 bg-rose-50 text-rose-950",
};

export function RiskModeCard({ snapshot }: RiskModeCardProps) {
  const { riskMode } = snapshot;
  const tone = MODE_TONE[riskMode.mode] ?? MODE_TONE.neutral;

  const rows: { label: string; band: { min: number; max: number } }[] = [
    { label: "BTC", band: riskMode.structure.btc },
    { label: "ETH", band: riskMode.structure.eth },
    { label: "稳定币/现金", band: riskMode.structure.stablecoin },
    { label: "Alpha/山寨", band: riskMode.structure.alpha },
    { label: "高风险热点", band: riskMode.structure.highRisk },
  ];

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-label="风险模式与仓位建议"
    >
      <header className="mb-4 flex items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-sm font-bold ${tone}`}>
          {riskMode.modeLabel}
        </span>
        <span className="text-sm text-slate-500">
          总仓位 {riskMode.totalPosition.min}–{riskMode.totalPosition.max}%
        </span>
      </header>

      {riskMode.overrideReason ? (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-900">
          <span className="font-semibold">覆盖原因：</span>
          {riskMode.overrideReason}
        </div>
      ) : null}

      <div className="mb-4 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          建议仓位结构
        </p>
        {rows.map(({ label, band }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-sm text-slate-700">{label}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-sky-500"
                style={{ width: `${Math.min(100, band.max)}%` }}
              />
            </div>
            <span className="w-16 text-right font-mono text-xs text-slate-500">
              {band.min}–{band.max}%
            </span>
          </div>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-3 text-center text-xs">
        <div>
          <p className="text-slate-500">止损线</p>
          <p className="mt-0.5 font-mono font-semibold text-rose-700">
            {riskMode.stopLosses.totalPortfolio}%
          </p>
        </div>
        <div>
          <p className="text-slate-500">BTC 止损</p>
          <p className="mt-0.5 font-mono font-semibold text-rose-700">
            {riskMode.stopLosses.btc}%
          </p>
        </div>
        <div>
          <p className="text-slate-500">ETH 止损</p>
          <p className="mt-0.5 font-mono font-semibold text-rose-700">
            {riskMode.stopLosses.eth}%
          </p>
        </div>
      </div>

      <details className="text-sm">
        <summary className="cursor-pointer font-medium text-slate-600">
          加仓 / 减仓条件
        </summary>
        <div className="mt-2 space-y-2 rounded-md border border-slate-200 p-3">
          <div>
            <p className="text-xs font-semibold text-emerald-700">加仓条件</p>
            <p className="mt-0.5 text-xs text-slate-600">{riskMode.addPositionRule}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-rose-700">减仓条件</p>
            <p className="mt-0.5 text-xs text-slate-600">{riskMode.reducePositionRule}</p>
          </div>
        </div>
      </details>
    </section>
  );
}

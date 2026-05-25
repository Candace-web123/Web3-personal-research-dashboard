import type { AiDecisionSnapshot } from "@/lib/ai-decision-orchestrator";

export type RiskCheckCardProps = {
  snapshot: AiDecisionSnapshot;
};

export function RiskCheckCard({ snapshot }: RiskCheckCardProps) {
  const { riskCheck, riskMode } = snapshot;
  if (!riskCheck) return null;

  const tp =
    snapshot.portfolioSummary && snapshot.portfolioSummary.totalValueUsd > 0
      ? (snapshot.portfolioSummary.investedValueUsd /
          snapshot.portfolioSummary.totalValueUsd) *
        100
      : 0;

  const checks: { label: string; actual: number; band: { min: number; max: number } }[] = [
    { label: "总仓位", actual: tp, band: riskMode.totalPosition },
    ...(snapshot.portfolioSummary
      ? [
          { label: "BTC", actual: snapshot.portfolioSummary.allocation.btc, band: riskMode.structure.btc },
          { label: "ETH", actual: snapshot.portfolioSummary.allocation.eth, band: riskMode.structure.eth },
          {
            label: "稳定币",
            actual: snapshot.portfolioSummary.allocation.stablecoin,
            band: riskMode.structure.stablecoin,
          },
          {
            label: "Alpha",
            actual: snapshot.portfolioSummary.allocation.alpha,
            band: riskMode.structure.alpha,
          },
          {
            label: "高风险",
            actual: snapshot.portfolioSummary.allocation.highRisk,
            band: riskMode.structure.highRisk,
          },
        ]
      : []),
  ];

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-label="风险偏离检查"
    >
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800">风险偏离检查</h2>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            riskCheck.totalPositionOk
              ? "bg-emerald-100 text-emerald-800"
              : "bg-rose-100 text-rose-800"
          }`}
        >
          {riskCheck.totalPositionOk ? "合规" : "偏离"}
        </span>
      </header>

      <p className="mb-4 text-xs text-slate-500">
        对照模式：<span className="font-medium text-slate-700">{riskCheck.modeLabel}</span>
      </p>

      <div className="mb-4 space-y-2">
        {checks.map(({ label, actual, band }) => {
          const ok = actual >= band.min && actual <= band.max;
          return (
            <div key={label} className="flex items-center gap-2 text-sm">
              <span
                className={`font-mono text-xs ${
                  ok ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {ok ? "✓" : "!"}
              </span>
              <span className="w-16 shrink-0 text-slate-700">{label}</span>
              <span className="font-mono text-xs text-slate-500">
                {actual.toFixed(0)}%
              </span>
              <span className="text-xs text-slate-400">
                （建议 {band.min}–{band.max}%）
              </span>
            </div>
          );
        })}
      </div>

      {riskCheck.violations.length > 0 ? (
        <div className="rounded-lg border border-rose-100 bg-rose-50 p-3">
          <p className="mb-1.5 text-xs font-semibold text-rose-800">
            违规项（{riskCheck.violations.length}）
          </p>
          <ul className="space-y-1">
            {riskCheck.violations.map((v, i) => (
              <li key={i} className="text-xs text-rose-700">
                • {v}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          当前仓位与建议模式无偏离
        </p>
      )}
    </section>
  );
}

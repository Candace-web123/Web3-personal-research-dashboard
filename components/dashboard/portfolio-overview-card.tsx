import type { AiDecisionSnapshot } from "@/lib/ai-decision-orchestrator";

export type PortfolioOverviewCardProps = {
  snapshot: AiDecisionSnapshot;
};

export function PortfolioOverviewCard({ snapshot }: PortfolioOverviewCardProps) {
  const { portfolioSummary } = snapshot;
  if (!portfolioSummary) return null;

  const pnlTone =
    portfolioSummary.totalPnLPct > 0
      ? "text-emerald-700"
      : portfolioSummary.totalPnLPct < 0
        ? "text-rose-700"
        : "text-slate-600";

  const allocBars: { label: string; pct: number; tone: string }[] = [
    { label: "BTC", pct: portfolioSummary.allocation.btc, tone: "bg-amber-500" },
    { label: "ETH", pct: portfolioSummary.allocation.eth, tone: "bg-sky-500" },
    { label: "稳定币", pct: portfolioSummary.allocation.stablecoin, tone: "bg-emerald-500" },
    { label: "Alpha", pct: portfolioSummary.allocation.alpha, tone: "bg-violet-500" },
    { label: "高风险", pct: portfolioSummary.allocation.highRisk, tone: "bg-rose-500" },
  ];

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-label="持仓概览"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800">持仓概览</h2>
        {snapshot.liveFields.includes("btcPriceUsd") ? (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
            价格实时
          </span>
        ) : (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
            价格 Demo
          </span>
        )}
      </div>

      <dl className="mb-4 grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-slate-50 p-3 text-center">
          <dt className="text-xs text-slate-500">总资产</dt>
          <dd className="mt-1 font-mono text-lg font-semibold text-slate-900">
            ${(portfolioSummary.totalValueUsd / 1000).toFixed(1)}K
          </dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 text-center">
          <dt className="text-xs text-slate-500">已投资</dt>
          <dd className="mt-1 font-mono text-lg font-semibold text-slate-900">
            ${(portfolioSummary.investedValueUsd / 1000).toFixed(1)}K
          </dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 text-center">
          <dt className="text-xs text-slate-500">现金</dt>
          <dd className="mt-1 font-mono text-lg font-semibold text-slate-900">
            ${(portfolioSummary.cashValueUsd / 1000).toFixed(1)}K
          </dd>
        </div>
      </dl>

      <div className="mb-4 rounded-lg border border-slate-200 p-3 text-center">
        <p className="text-xs text-slate-500">总盈亏</p>
        <p className={`mt-1 font-mono text-xl font-bold ${pnlTone}`}>
          {portfolioSummary.totalPnLPct > 0 ? "+" : ""}
          {portfolioSummary.totalPnLPct.toFixed(1)}%
        </p>
        <p className={`mt-0.5 font-mono text-xs ${pnlTone}`}>
          ${portfolioSummary.totalPnLUsd.toFixed(0)}
        </p>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-slate-500">资产占比</p>
        <div className="space-y-1.5">
          {allocBars.map(({ label, pct, tone }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-14 shrink-0 text-xs text-slate-600">{label}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${tone}`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
              <span className="w-10 text-right font-mono text-xs text-slate-500">
                {pct.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {portfolioSummary.positions.length > 0 ? (
        <details className="mt-4 text-sm">
          <summary className="cursor-pointer font-medium text-slate-600">
            持仓明细（{portfolioSummary.positions.length} 个）
          </summary>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-1.5 pr-2 font-medium">币种</th>
                  <th className="py-1.5 pr-2 font-medium">数量</th>
                  <th className="py-1.5 pr-2 font-medium">成本</th>
                  <th className="py-1.5 pr-2 font-medium">市价</th>
                  <th className="py-1.5 font-medium">PnL</th>
                </tr>
              </thead>
              <tbody>
                {portfolioSummary.positions.map((p) => (
                  <tr key={p.symbol} className="border-b border-slate-100">
                    <td className="py-1.5 pr-2 font-mono font-medium">{p.symbol}</td>
                    <td className="py-1.5 pr-2 font-mono">{p.amount}</td>
                    <td className="py-1.5 pr-2 font-mono">${p.costBasisUsd}</td>
                    <td className="py-1.5 pr-2 font-mono">${p.currentPriceUsd}</td>
                    <td
                      className={`py-1.5 font-mono ${
                        p.pnlPct > 0
                          ? "text-emerald-700"
                          : p.pnlPct < 0
                            ? "text-rose-700"
                            : "text-slate-500"
                      }`}
                    >
                      {p.pnlPct > 0 ? "+" : ""}
                      {p.pnlPct.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ) : null}
    </section>
  );
}

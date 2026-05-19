import { ActualPositionCompareCard } from "@/components/dashboard/actual-position-compare-card";
import { AlphaPoolCard } from "@/components/dashboard/alpha-pool-card";
import { BtcCycleCard } from "@/components/dashboard/btc-cycle-card";
import { DailyReviewCard } from "@/components/dashboard/daily-review-card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DecisionHeroCard } from "@/components/dashboard/decision-hero-card";
import { MarketEnvironmentCard } from "@/components/dashboard/market-environment-card";
import { MoversTop5Card } from "@/components/dashboard/movers-top5-card";
import { PositionAdviceCard } from "@/components/dashboard/position-advice-card";
import { RiskWarningsCard } from "@/components/dashboard/risk-warnings-card";
import { StrongChainTop } from "@/components/dashboard/strong-chain-top";
import { StrongProtocolTop } from "@/components/dashboard/strong-protocol-top";
import { StrongSectorTop } from "@/components/dashboard/strong-sector-top";
import {
  getAiFramework,
  getAlphaPool,
  getAssets,
  getBtcCycleSnapshot,
  getDailyReviewSnapshot,
  getDataProvenanceDailySnapshot,
  getMarketEnvironmentSnapshot,
  getMoversTop5,
  getNarratives,
  getPositionAdviceSnapshot,
  getRiskWarningsDashboard,
  getStrongSignalsDailySnapshot
} from "@/data";
import { DataProvenanceCardId } from "@/data/types";
import { getCardDataProvenance } from "@/lib/data-provenance";
import { calculateResearchOverview } from "@/lib/research-overview";
import {
  getStrongChainTop3,
  getStrongProtocolTop5,
  getStrongSectorTop3
} from "@/lib/strong-signals";
import {
  buildDecisionCardModel,
  getAlphaTop10,
  getTopMovers5
} from "@/lib/v12-decision";

export default function Home() {
  const btcCycleSnapshot = getBtcCycleSnapshot();
  const marketEnvironmentSnapshot = getMarketEnvironmentSnapshot();
  const strongSignalsSnapshot = getStrongSignalsDailySnapshot();
  const dataProvenanceSnapshot = getDataProvenanceDailySnapshot();
  const moversTop5 = getTopMovers5(getMoversTop5());
  const alphaTop10 = getAlphaTop10(getAlphaPool());
  const positionAdviceSnapshot = getPositionAdviceSnapshot();
  const dailyReviewSnapshot = getDailyReviewSnapshot();
  const riskWarningsDashboard = getRiskWarningsDashboard();

  const strongChainTop3 = getStrongChainTop3(strongSignalsSnapshot.chains);
  const strongSectorTop3 = getStrongSectorTop3(strongSignalsSnapshot.sectors);
  const strongProtocolTop5 = getStrongProtocolTop5(strongSignalsSnapshot.protocols);

  const decisionModel = buildDecisionCardModel({
    btcCycleSnapshot,
    marketEnvironmentSnapshot,
    moversTop5,
    alphaTop10,
    positionAdviceSnapshot,
    strongSignalsSnapshot
  });

  const actualPositionContext = {
    positionAdvice: positionAdviceSnapshot,
    decision: decisionModel,
    marketEnvironment: marketEnvironmentSnapshot,
    btcCycle: btcCycleSnapshot,
    strongSignals: strongSignalsSnapshot,
    risks: riskWarningsDashboard
  };

  const assets = getAssets();
  const narratives = getNarratives();
  const aiFramework = getAiFramework();
  const overview = calculateResearchOverview(assets);

  return (
  <>
      <DashboardHeader asOf={decisionModel.asOf} />
      <main className="mx-auto max-w-[1248px] space-y-8 px-6 py-8">
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <DecisionHeroCard
            model={decisionModel}
            dataProvenance={getCardDataProvenance(
              DataProvenanceCardId.Decision,
              dataProvenanceSnapshot
            )}
          />
          <div className="flex flex-col gap-6">
            <BtcCycleCard snapshot={btcCycleSnapshot} variant="compact" />
            <MarketEnvironmentCard
              snapshot={marketEnvironmentSnapshot}
              variant="compact"
            />
          </div>
        </section>

        <MoversTop5Card movers={moversTop5} />

        <section aria-label="\u4eca\u65e5\u8d44\u91d1\u4e0e\u7ed3\u6784" className="space-y-4">
          <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-base font-bold text-slate-800">
              {"\u4eca\u65e5\u8d44\u91d1\u4e0e\u7ed3\u6784"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {strongSignalsSnapshot.sectionHeadline}
            </p>
            {strongSignalsSnapshot.sectionRiskNote?.trim() ? (
              <p className="mt-3 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-amber-950">
                <span className="font-medium">{"\u533a\u5757\u98ce\u9669\u63d0\u793a\uff1a"}</span>
                {strongSignalsSnapshot.sectionRiskNote}
              </p>
            ) : null}
          </header>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <StrongChainTop entries={strongChainTop3} />
            <StrongSectorTop entries={strongSectorTop3} />
            <StrongProtocolTop entries={strongProtocolTop5} />
          </div>
        </section>

        <AlphaPoolCard entries={alphaTop10} />

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PositionAdviceCard snapshot={positionAdviceSnapshot} variant="v4" />
          <RiskWarningsCard risks={riskWarningsDashboard} variant="detailed" />
        </section>

        <ActualPositionCompareCard context={actualPositionContext} />

        <DailyReviewCard snapshot={dailyReviewSnapshot} />

        <details className="rounded-2xl border border-slate-300 bg-slate-100/80">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-slate-800 marker:content-none [&::-webkit-details-marker]:hidden">
            {"\u65e7\u7248\u7814\u7a76\u6a21\u5757 / \u7814\u7a76\u6570\u636e\u8865\u5145\uff08\u70b9\u51fb\u5c55\u5f00\uff09"}
          </summary>
          <div className="flex flex-col gap-6 border-t border-slate-200 p-4">
            <section
              className="rounded-lg border border-zinc-200 bg-white p-4"
              aria-label="\u6295\u7814\u6982\u89c8"
            >
              <h2 className="text-sm font-semibold text-zinc-800">{"\u6295\u7814\u6982\u89c8"}</h2>
              <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-zinc-500">{"\u8ddf\u8e2a\u8d44\u4ea7\u6570"}</dt>
                  <dd className="font-mono text-lg">{overview.totalAssets}</dd>
                </div>
                <div>
                  <dt className="text-xs text-zinc-500">{"\u7814\u7a76\u4e2d"}</dt>
                  <dd className="font-mono text-lg">{overview.activeResearchCount}</dd>
                </div>
                <div>
                  <dt className="text-xs text-zinc-500">{"\u5e73\u5747\u7f6e\u4fe1\u5ea6"}</dt>
                  <dd className="font-mono text-lg">
                    {overview.averageConfidence === null
                      ? "\u2014"
                      : overview.averageConfidence.toFixed(1)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-zinc-500">{"\u9ad8\u98ce\u9669\u8d44\u4ea7"}</dt>
                  <dd className="font-mono text-lg">{overview.highRiskCount}</dd>
                </div>
              </dl>
            </section>

            <section
              className="rounded-lg border border-zinc-200 bg-white p-4"
              aria-label="\u8d44\u4ea7\u89c2\u5bdf\u8868"
            >
              <h2 className="text-sm font-semibold text-zinc-800">
                {"\u8d44\u4ea7\u89c2\u5bdf\uff08\u65e7\u7248\uff09"}
              </h2>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[32rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 text-xs text-zinc-500">
                      <th className="py-2 pr-3 font-medium">{"\u6807\u7684"}</th>
                      <th className="py-2 pr-3 font-medium">{"\u8d5b\u9053"}</th>
                      <th className="py-2 pr-3 font-medium">{"\u72b6\u6001"}</th>
                      <th className="py-2 pr-3 font-medium">{"\u98ce\u9669"}</th>
                      <th className="py-2 font-medium">{"\u7f6e\u4fe1\u5ea6"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((asset) => (
                      <tr key={asset.id} className="border-b border-zinc-100">
                        <td className="py-2 pr-3 font-mono font-medium">{asset.symbol}</td>
                        <td className="py-2 pr-3 text-zinc-600">{asset.sector}</td>
                        <td className="py-2 pr-3 text-zinc-600">{asset.researchStatus}</td>
                        <td className="py-2 pr-3 text-zinc-600">{asset.riskLevel}</td>
                        <td className="py-2 font-mono">{asset.confidenceScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section
              className="rounded-lg border border-zinc-200 bg-white p-4"
              aria-label="\u5e02\u573a\u53d9\u4e8b"
            >
              <h2 className="text-sm font-semibold text-zinc-800">{"\u5e02\u573a\u53d9\u4e8b\uff08\u65e7\u7248\uff09"}</h2>
              <ul className="mt-3 flex flex-col gap-3">
                {narratives.map((narrative) => (
                  <li
                    key={narrative.id}
                    className="rounded-md border border-zinc-100 bg-zinc-50 px-3 py-2"
                  >
                    <p className="font-medium text-zinc-900">{narrative.title}</p>
                    <p className="mt-1 text-xs text-zinc-500">{narrative.sector}</p>
                    <p className="mt-1 text-sm text-zinc-700">{narrative.signal}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section
              className="rounded-lg border border-zinc-200 bg-white p-4"
              aria-label="AI \u5206\u6790\u6846\u67b6"
            >
              <h2 className="text-sm font-semibold text-zinc-800">
                {"AI \u5206\u6790\u6846\u67b6\uff08\u5360\u4f4d\uff09"}
              </h2>
              <ul className="mt-3 flex flex-col gap-2">
                {aiFramework.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-md border border-zinc-100 px-3 py-2 text-sm"
                  >
                    <p className="font-medium text-zinc-800">{item.dimension}</p>
                    <p className="mt-1 text-zinc-600">{item.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </details>

        <footer className="border-t border-slate-200 pt-4 text-center text-xs text-slate-500">
          {"\u6570\u636e\u6765\u6e90\uff1a\u672c\u5730 mock \u00b7 \u4ec5\u4f9b\u6295\u7814\u6d41\u7a0b\u9a8c\u8bc1\uff0c\u4e0d\u6784\u6210\u6295\u8d44\u5efa\u8bae"}
        </footer>
      </main>
    </>
  );
}

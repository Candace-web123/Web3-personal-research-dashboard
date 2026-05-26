import { ActualPositionCompareCard } from "@/components/dashboard/actual-position-compare-card";
import { AlphaPoolCard } from "@/components/dashboard/alpha-pool-card";
import { AuditTrailCard } from "@/components/dashboard/audit-trail-card";
import { BtcCycleCard } from "@/components/dashboard/btc-cycle-card";
import { DailyReviewCard } from "@/components/dashboard/daily-review-card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DecisionHeroCard } from "@/components/dashboard/decision-hero-card";
import { MarketEnvironmentCard } from "@/components/dashboard/market-environment-card";
import { MarketStateCard } from "@/components/dashboard/market-state-card";
import { MoversTop5Card } from "@/components/dashboard/movers-top5-card";
import { PortfolioOverviewCard } from "@/components/dashboard/portfolio-overview-card";
import { PositionAdviceCard } from "@/components/dashboard/position-advice-card";
import { RiskCheckCard } from "@/components/dashboard/risk-check-card";
import { RiskModeCard } from "@/components/dashboard/risk-mode-card";
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
  getStrongSignalsDailySnapshot,
  getUserPortfolio
} from "@/data";
import { DataProvenanceCardId } from "@/data/types";
import { getCardDataProvenance } from "@/lib/data-provenance";
import { getAiDecisionWithPipeline } from "@/lib/ai-decision-orchestrator";
import { appendDecisionRecord } from "@/lib/decision-history";
import crypto from "node:crypto";
import { fetchLiveMarketData, fetchAdditionalPrices } from "@/lib/real-market-data";
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

export const dynamic = "force-dynamic";

export default async function Home() {
  const liveData = await fetchLiveMarketData().catch(() => null);

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

  const assets = getAssets();
  const narratives = getNarratives();
  const aiFramework = getAiFramework();
  const overview = calculateResearchOverview(assets);

  // 浅拷贝避免 mutate 原始 USER_PORTFOLIO 常量（HMR 安全）
  const rawPortfolio = getUserPortfolio();
  const userPortfolio = {
    ...rawPortfolio,
    positions: rawPortfolio.positions.map((p) => ({ ...p })),
  };
  // 自动从实时数据填充市价（currentPriceUsd=0 的持仓）
  const autoFillSymbols = userPortfolio.positions
    .filter((p) => p.currentPriceUsd === 0)
    .map((p) => p.symbol);
  if (autoFillSymbols.length > 0) {
    // BTC/ETH 优先从已获取的 liveData 直接填（省一次请求）
    for (const pos of userPortfolio.positions) {
      if (pos.currentPriceUsd === 0) {
        if (pos.symbol === "BTC" && liveData?.btcPriceUsd != null) pos.currentPriceUsd = liveData.btcPriceUsd;
        if (pos.symbol === "ETH" && liveData?.ethPriceUsd != null) pos.currentPriceUsd = liveData.ethPriceUsd;
      }
    }
    // 其他币种通过 CoinGecko 批量查询
    const remaining = autoFillSymbols.filter((s) => s !== "BTC" && s !== "ETH");
    if (remaining.length > 0) {
      const prices: Record<string, number> = await fetchAdditionalPrices(remaining).catch(() => ({}));
      for (const pos of userPortfolio.positions) {
        if (pos.currentPriceUsd === 0 && prices[pos.symbol] != null) {
          pos.currentPriceUsd = prices[pos.symbol];
        }
      }
    }
  }

  const { snapshot: aiSnapshot, pipeline } = getAiDecisionWithPipeline(liveData ?? undefined, userPortfolio);

  // P4-1: 持久化决策记录（跳过构建阶段；异步写入不阻塞渲染；失败静默忽略）
  appendDecisionRecord({
    version: 1,
    requestId: `${new Date().toISOString().slice(0, 10)}-${crypto.randomUUID().slice(0, 8)}`,
    recordedAt: new Date().toISOString(),
    asOf: userPortfolio.asOf,
    snapshot: aiSnapshot,
    liveInput: liveData,
    portfolioInput: userPortfolio,
    pipelineResult: pipeline,
  }).catch(() => {});

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

        <section aria-label="AI \u51b3\u7b56\u8f85\u52a9" className="space-y-6">
          <header className="rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-sky-50 p-5">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-violet-500 px-2.5 py-0.5 text-xs font-bold text-white">
                AI \u5f15\u64ce
              </span>
              <h2 className="text-base font-bold text-slate-800">AI \u51b3\u7b56\u8f85\u52a9\u7cfb\u7edf</h2>
              {aiSnapshot.liveFields.length > 0 ? (
                <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                  \u5b9e\u65f6\u6570\u636e\uff1a{aiSnapshot.liveFields.length} \u9879
                </span>
              ) : (
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                  Demo \u6570\u636e
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-slate-600">
              \u57fa\u4e8e\u5e02\u573a\u72b6\u6001\u673a\uff087 \u72b6\u6001 \u00d7 9 \u7ef4\u5ea6\uff09+ \u98ce\u9669\u6a21\u5f0f\u9009\u62e9\u5668 + \u6301\u4ed3\u504f\u79bb\u68c0\u67e5\u3002
              \u5f15\u64ce\u81ea\u52a8\u5224\u5b9a\uff0c\u7ed3\u5408\u7528\u6237\u6301\u4ed3\u7ed9\u51fa\u7ed3\u6784\u5316\u7684\u4ed3\u4f4d\u548c\u98ce\u9669\u5efa\u8bae\u3002
            </p>
          </header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <MarketStateCard snapshot={aiSnapshot} />
            <RiskModeCard snapshot={aiSnapshot} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <PortfolioOverviewCard snapshot={aiSnapshot} />
            <RiskCheckCard snapshot={aiSnapshot} />
          </div>

          <AuditTrailCard snapshot={aiSnapshot} />
        </section>

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

        <ActualPositionCompareCard
          positionAdviceSnapshot={positionAdviceSnapshot}
          strongestDirection={
            decisionModel.strongestDirection ??
            strongSignalsSnapshot.strongestDirection
          }
          topRisks={decisionModel.topRisks}
        />

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
          {"\u6570\u636e\u6765\u6e90\uff1aCoinGecko / Alternative.me / DeFiLlama / CoinGlass + \u672c\u5730 mock \u00b7 \u4ec5\u4f9b\u6295\u7814\u6d41\u7a0b\u9a8c\u8bc1\uff0c\u4e0d\u6784\u6210\u6295\u8d44\u5efa\u8bae"}
        </footer>
      </main>
    </>
  );
}

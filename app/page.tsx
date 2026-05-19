import { AlphaPoolCard } from "@/components/dashboard/alpha-pool-card";
import { DailyReviewCard } from "@/components/dashboard/daily-review-card";
import { BtcCycleCard } from "@/components/dashboard/btc-cycle-card";
import { DecisionCard } from "@/components/dashboard/decision-card";
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
  getMarketEnvironmentSnapshot,
  getMoversTop5,
  getNarratives,
  getPositionAdviceSnapshot,
  getStrongSignalsDailySnapshot,
  getDataProvenanceDailySnapshot,
  getDailyReviewSnapshot
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

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-6 text-zinc-900 sm:p-8">
      <header className="border-b border-zinc-200 pb-4">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          V1.2 每日投研 · 本地 mock
        </p>
        <h1 className="mt-1 text-2xl font-semibold">Web3 个人投研工作台</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          先判断环境与 BTC 周期，再跟踪资金流向、异动与 Alpha 观察池；以下为决策辅助信息，非投资建议。
        </p>
      </header>

      <DecisionCard
        model={decisionModel}
        dataProvenance={getCardDataProvenance(
          DataProvenanceCardId.Decision,
          dataProvenanceSnapshot
        )}
      />

      <BtcCycleCard
        snapshot={btcCycleSnapshot}
        dataProvenance={getCardDataProvenance(
          DataProvenanceCardId.BtcCycle,
          dataProvenanceSnapshot
        )}
      />

      <MarketEnvironmentCard
        snapshot={marketEnvironmentSnapshot}
        dataProvenance={getCardDataProvenance(
          DataProvenanceCardId.MarketEnvironment,
          dataProvenanceSnapshot
        )}
      />

      <MoversTop5Card movers={moversTop5} />

      <section
        className="flex flex-col gap-4"
        aria-label="资金流向与结构性强信号"
      >
        <header className="rounded-lg border border-zinc-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-zinc-900">今日资金与结构</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-800">
            {strongSignalsSnapshot.sectionHeadline}
          </p>
          {strongSignalsSnapshot.sectionRiskNote?.trim() ? (
            <p className="mt-3 rounded-md border border-amber-100 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-950">
              <span className="font-medium">区块风险提示：</span>
              {strongSignalsSnapshot.sectionRiskNote}
            </p>
          ) : null}
        </header>

        <StrongChainTop entries={strongChainTop3} />
        <StrongSectorTop entries={strongSectorTop3} />
        <StrongProtocolTop entries={strongProtocolTop5} />
      </section>

      <AlphaPoolCard entries={alphaTop10} />

      <div className="flex flex-col gap-4">
        <PositionAdviceCard snapshot={positionAdviceSnapshot} />
        <RiskWarningsCard
          risks={decisionModel.topRisks}
          description="综合市场环境、Alpha 观察池与决策卡聚合的风险提示；请结合仓位纪律独立判断。"
        />
      </div>

      <DailyReviewCard snapshot={dailyReviewSnapshot} />

      <details className="rounded-lg border border-zinc-300 bg-zinc-100/80">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-zinc-800 marker:content-none [&::-webkit-details-marker]:hidden">
          旧版研究模块 / 研究数据补充（点击展开）
        </summary>
        <div className="flex flex-col gap-6 border-t border-zinc-200 p-4">
          <section
            className="rounded-lg border border-zinc-200 bg-white p-4"
            aria-label="投研概览"
          >
            <h2 className="text-sm font-semibold text-zinc-800">投研概览</h2>
            <dl className="mt-3 grid gap-2 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-zinc-500">跟踪资产数</dt>
                <dd className="font-mono text-lg">{overview.totalAssets}</dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">研究中</dt>
                <dd className="font-mono text-lg">{overview.activeResearchCount}</dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">平均置信度</dt>
                <dd className="font-mono text-lg">
                  {overview.averageConfidence === null
                    ? "—"
                    : overview.averageConfidence.toFixed(1)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">高风险资产</dt>
                <dd className="font-mono text-lg">{overview.highRiskCount}</dd>
              </div>
            </dl>
          </section>

          <section
            className="rounded-lg border border-zinc-200 bg-white p-4"
            aria-label="资产观察表"
          >
            <h2 className="text-sm font-semibold text-zinc-800">资产观察（旧版）</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-xs text-zinc-500">
                    <th className="py-2 pr-3 font-medium">标的</th>
                    <th className="py-2 pr-3 font-medium">赛道</th>
                    <th className="py-2 pr-3 font-medium">状态</th>
                    <th className="py-2 pr-3 font-medium">风险</th>
                    <th className="py-2 font-medium">置信度</th>
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
            aria-label="市场叙事"
          >
            <h2 className="text-sm font-semibold text-zinc-800">市场叙事（旧版）</h2>
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
            aria-label="AI 分析框架"
          >
            <h2 className="text-sm font-semibold text-zinc-800">AI 分析框架（占位）</h2>
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

      <footer className="border-t border-zinc-200 pt-4 text-center text-xs text-zinc-500">
        数据来源：本地 mock · 仅供投研流程验证，不构成投资建议
      </footer>
    </main>
  );
}

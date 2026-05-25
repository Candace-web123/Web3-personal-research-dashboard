import type { PositionAdviceSnapshot } from "@/data/types";
import {
  formatBtcCycleStage,
  formatMarketRegime,
  formatUserRiskProfile
} from "@/lib/display-utils";

export type SystemReferenceFrameProps = {
  positionAdviceSnapshot: PositionAdviceSnapshot;
  strongestDirection?: string;
};

export function SystemReferenceFrame({
  positionAdviceSnapshot,
  strongestDirection
}: SystemReferenceFrameProps) {
  return (
    <section className="rounded-md border border-zinc-200 bg-white p-3">
      <p className="text-xs font-semibold text-zinc-500">系统参考框架（今日）</p>
      <dl className="mt-2 grid gap-1 text-xs text-zinc-700 sm:grid-cols-2">
        <div>
          <dt className="text-zinc-500">风险画像</dt>
          <dd>{formatUserRiskProfile(positionAdviceSnapshot.riskProfile)}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">市场环境</dt>
          <dd>{formatMarketRegime(positionAdviceSnapshot.marketRegime)}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">BTC 周期</dt>
          <dd>{formatBtcCycleStage(positionAdviceSnapshot.btcCycleStage)}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">BTC/ETH 参考</dt>
          <dd className="font-mono">{positionAdviceSnapshot.btcEthAllocation}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">稳定币参考</dt>
          <dd className="font-mono">{positionAdviceSnapshot.stablecoinAllocation}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Alpha 参考</dt>
          <dd className="font-mono">{positionAdviceSnapshot.alphaAllocation}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">高风险热点参考</dt>
          <dd className="font-mono">
            {positionAdviceSnapshot.highRiskHotspotAllocation}
          </dd>
        </div>
        {strongestDirection?.trim() ? (
          <div className="sm:col-span-2">
            <dt className="text-zinc-500">今日最强方向</dt>
            <dd>{strongestDirection}</dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}

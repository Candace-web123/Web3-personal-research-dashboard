import type { PositionAdviceSnapshot } from "@/data/types";
import {
  formatBtcCycleStage,
  formatMarketRegime,
  formatUserRiskProfile
} from "@/lib/display-utils";
import { parseAllocationRange } from "@/lib/actual-position-compare";

export type PositionAdviceCardProps = {
  snapshot: PositionAdviceSnapshot;
  variant?: "legacy" | "v4";
};

function rangeMidpoint(range: string): number {
  const bounds = parseAllocationRange(range);
  if (!bounds) return 0;
  return Math.round((bounds.min + bounds.max) / 2);
}

function displayOrDash(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}

type AllocationRowProps = {
  label: string;
  range: string;
};

function AllocationRow({ label, range }: AllocationRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2">
      <dt className="text-sm text-zinc-600">{label}</dt>
      <dd className="font-mono text-sm font-semibold text-zinc-900">
        {displayOrDash(range)}
      </dd>
    </div>
  );
}

function PositionAdviceV4({ snapshot }: { snapshot: PositionAdviceSnapshot }) {
  const cashMid = rangeMidpoint(snapshot.stablecoinAllocation);
  const styleLabel = snapshot.observationOnly
    ? "\u98ce\u683c\uff1a\u8c28\u614e\u89c2\u5bdf"
    : "\u98ce\u683c\uff1a\u8ddf\u8e2a\u9a8c\u8bc1";

  const rows = [
    {
      label: "\u7a33\u5b9a\u5e01 / \u73b0\u91d1\u7f13\u51b2",
      range: snapshot.stablecoinAllocation,
      note: snapshot.rationale[0]
    },
    {
      label: "BTC / ETH \u4e3b\u6d41",
      range: snapshot.btcEthAllocation,
      note: snapshot.rationale[1]
    },
    {
      label: "Alpha \u89c2\u5bdf\u6c60",
      range: snapshot.alphaAllocation,
      note: snapshot.rationale[2]
    },
    {
      label: "\u9ad8\u98ce\u9669\u70ed\u70b9",
      range: snapshot.highRiskHotspotAllocation,
      note: snapshot.rationale[3]
    }
  ];

  return (
    <section
      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      aria-label="\u4e2a\u4eba\u98ce\u9669\u66b4\u9732\u53c2\u8003"
    >
      <header className="flex items-start justify-between gap-2">
        <h2 className="text-base font-bold text-slate-800">
          \u4e2a\u4eba\u98ce\u9669\u66b4\u9732\u53c2\u8003
        </h2>
        <span className="rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
          {styleLabel}
        </span>
      </header>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div
          className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(#4f46e5 0 ${cashMid}%, #e2e8f0 ${cashMid}% 100%)`
          }}
        >
          <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white text-center">
            <span className="text-[10px] text-slate-400">\u73b0\u91d1\u6bd4</span>
            <span className="text-lg font-bold text-slate-800">{cashMid}%</span>
          </div>
        </div>
        <ul className="flex-1 space-y-2 text-xs">
          {rows.map((row) => (
            <li
              key={row.label}
              className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
            >
              <div className="flex justify-between font-semibold text-slate-700">
                <span>{row.label}</span>
                <span className="font-mono">{row.range}</span>
              </div>
              {row.note ? (
                <p className="mt-1 text-[10px] leading-4 text-slate-500">{row.note}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs leading-5 text-slate-700">
        <span className="font-semibold">\u6295\u7814\u7ed3\u8bba\uff1a</span>
        {snapshot.researchConclusion ?? snapshot.addPositionAdvice ?? "—"}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <ConditionBox
          title="\u2191 \u4e0a\u8c03\u98ce\u9669\u66b4\u9732\u6761\u4ef6"
          items={snapshot.increaseExposureConditions ?? []}
          tone="border-emerald-100 bg-emerald-50/50 text-emerald-900"
        />
        <ConditionBox
          title="\u2193 \u4e0b\u8c03\u98ce\u9669\u66b4\u9732\u6761\u4ef6"
          items={snapshot.decreaseExposureConditions ?? []}
          tone="border-rose-100 bg-rose-50/50 text-rose-900"
        />
      </div>
    </section>
  );
}

function ConditionBox({
  title,
  items,
  tone
}: {
  title: string;
  items: string[];
  tone: string;
}) {
  return (
    <div className={`rounded-xl border p-3 ${tone}`}>
      <p className="text-[10px] font-bold">{title}</p>
      <ul className="mt-2 list-inside list-disc space-y-1 text-[10px] leading-4">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function PositionAdviceCard({
  snapshot,
  variant = "legacy"
}: PositionAdviceCardProps) {
  if (variant === "v4") {
    return <PositionAdviceV4 snapshot={snapshot} />;
  }

  const stanceLabel = snapshot.observationOnly
    ? "今日以观察为主，谨慎进攻"
    : snapshot.suitableToAddPosition
      ? "可小幅跟踪机会，仍须控制节奏"
      : "不建议新增风险仓位，以复盘为主";

  const addPositionLabel = snapshot.suitableToAddPosition
    ? "可考虑小步验证（非买入指令）"
    : "不建议今日新增仓位";

  return (
    <section
      className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:p-5"
      aria-label="今日仓位建议"
    >
      <header className="border-b border-zinc-200 pb-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold text-zinc-900">今日仓位建议</h2>
          <time className="text-sm text-zinc-500" dateTime={snapshot.asOf}>
            {snapshot.asOf}
          </time>
        </div>
        <p className="mt-1 text-xs leading-5 text-zinc-500">
          以下为参考区间，非喊单、非保证收益；请结合自身风险承受能力独立判断。
        </p>
      </header>

      <div className="rounded-md border border-violet-200 bg-violet-50 p-3">
        <p className="text-xs font-medium text-violet-800">今日仓位倾向</p>
        <p className="mt-1 text-sm font-semibold text-violet-950">{stanceLabel}</p>
        <dl className="mt-2 grid gap-1 text-xs text-violet-900/90 sm:grid-cols-3">
          <div>
            <dt className="opacity-70">风险画像</dt>
            <dd className="font-medium">
              {formatUserRiskProfile(snapshot.riskProfile)}
            </dd>
          </div>
          <div>
            <dt className="opacity-70">市场环境</dt>
            <dd className="font-medium">
              {formatMarketRegime(snapshot.marketRegime)}
            </dd>
          </div>
          <div>
            <dt className="opacity-70">BTC 周期</dt>
            <dd className="font-medium">
              {formatBtcCycleStage(snapshot.btcCycleStage)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          建议仓位区间（参考）
        </p>
        <dl className="flex flex-col gap-2">
          <AllocationRow
            label="BTC / ETH"
            range={snapshot.btcEthAllocation}
          />
          <AllocationRow label="稳定币" range={snapshot.stablecoinAllocation} />
          <AllocationRow label="Alpha 观察仓" range={snapshot.alphaAllocation} />
          <AllocationRow
            label="高风险热点"
            range={snapshot.highRiskHotspotAllocation}
          />
        </dl>
      </div>

      <dl className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-md border border-zinc-200 bg-white px-3 py-2">
          <dt className="text-xs text-zinc-500">是否适合新增仓位</dt>
          <dd className="mt-1 text-sm text-zinc-800">{addPositionLabel}</dd>
        </div>
        <div className="rounded-md border border-zinc-200 bg-white px-3 py-2">
          <dt className="text-xs text-zinc-500">观察模式</dt>
          <dd className="mt-1 text-sm text-zinc-800">
            {snapshot.observationOnly ? "是，以观察为主" : "否，可跟踪结构性机会"}
          </dd>
        </div>
      </dl>

      {snapshot.rationale.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            调整理由
          </p>
          <ul className="flex flex-col gap-1.5">
            {snapshot.rationale.map((item) => (
              <li
                key={item}
                className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm leading-6 text-zinc-700"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {snapshot.deepDiveProjects.length > 0 ? (
        <div className="rounded-md border border-sky-200 bg-sky-50 p-3">
          <p className="text-xs font-medium text-sky-800">今日重点深挖（1～3）</p>
          <p className="mt-1 text-sm text-sky-950">
            {snapshot.deepDiveProjects.join("、")}
          </p>
        </div>
      ) : (
        <p className="text-sm text-zinc-500">今日重点深挖：—</p>
      )}

      {snapshot.doNotChase.length > 0 ? (
        <div className="flex flex-col gap-2 border-t border-zinc-200 pt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            不建议追高 / 不宜操作
          </p>
          <ul className="flex flex-col gap-1.5">
            {snapshot.doNotChase.map((item) => (
              <li
                key={item}
                className="rounded-md border border-amber-100 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-950"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

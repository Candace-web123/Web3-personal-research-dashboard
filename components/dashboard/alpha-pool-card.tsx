import type {
  AlphaPoolEntry,
  OffchainDueDiligence,
  OffchainDueDiligenceRiskLevel,
  OffchainDueDiligenceStatus,
  RiskTag,
  TokenTransmissionJudgement
} from "@/data/types";
import {
  alphaGradeTone,
  displayOrDash,
  formatAlphaLifecycleState,
  riskPriorityTone
} from "@/lib/display-utils";
import {
  formatTokenTransmissionStrength,
  formatTokenTransmissionType,
  tokenTransmissionStrengthTone,
  tokenTransmissionTypeTone
} from "@/lib/token-transmission";

export type AlphaPoolCardProps = {
  entries: readonly AlphaPoolEntry[];
};

const MAX_ENTRIES = 10;
const MAX_RISKS_SHOWN = 3;
const MAX_DD_FINDINGS = 3;
const MAX_DD_QUESTIONS = 2;

const DD_STATUS_LABEL: Record<OffchainDueDiligenceStatus, string> = {
  Confirmed: "\u5df2\u786e\u8ba4",
  PartiallyConfirmed: "\u90e8\u5206\u786e\u8ba4",
  Unclear: "\u4fe1\u606f\u4e0d\u8db3",
  Risky: "\u98ce\u9669\u8f83\u9ad8",
  NotChecked: "\u5f85\u9a8c\u8bc1"
};

const DD_RISK_LABEL: Record<OffchainDueDiligenceRiskLevel, string> = {
  Low: "\u4f4e",
  Medium: "\u4e2d",
  High: "\u9ad8",
  Unknown: "\u672a\u77e5"
};

function ddRiskTone(level: OffchainDueDiligenceRiskLevel): string {
  switch (level) {
    case "Low":
      return "border-emerald-200 bg-emerald-50 text-emerald-900";
    case "Medium":
      return "border-amber-200 bg-amber-50 text-amber-900";
    case "High":
      return "border-rose-200 bg-rose-50 text-rose-900";
    default:
      return "border-zinc-200 bg-zinc-100 text-zinc-700";
  }
}

type AlphaEntryRowProps = {
  entry: AlphaPoolEntry;
  rank: number;
};

function TokenTransmissionBlock({
  judgement
}: {
  judgement: TokenTransmissionJudgement;
}) {
  return (
    <section className="mt-3 rounded-md border border-teal-200 bg-teal-50/80 px-3 py-2">
      <p className="text-xs font-semibold text-teal-900">代币价值传导（PRD 9.2.1）</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${tokenTransmissionTypeTone(judgement.type)}`}
        >
          {formatTokenTransmissionType(judgement.type)}
        </span>
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${tokenTransmissionStrengthTone(judgement.strength)}`}
        >
          强度 {formatTokenTransmissionStrength(judgement.strength)}
        </span>
        <span className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-xs text-zinc-600">
          {judgement.affectsAlphaGrade ? "影响评级" : "不影响评级"}
        </span>
      </div>
      {judgement.basis.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-1">
          {judgement.basis.map((item) => (
            <li
              key={item}
              className="rounded border border-teal-100 bg-white px-1.5 py-0.5 text-[11px] text-teal-900"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-teal-800">依据：无（无传导 / 待补数据）</p>
      )}
      {judgement.note?.trim() ? (
        <p className="mt-2 text-xs leading-5 text-teal-950">{judgement.note}</p>
      ) : null}
    </section>
  );
}

function OffchainDueDiligenceBlock({ diligence }: { diligence: OffchainDueDiligence }) {
  const findings = diligence.keyFindings.slice(0, MAX_DD_FINDINGS);
  const questions = diligence.unresolvedQuestions.slice(0, MAX_DD_QUESTIONS);

  const dimensionRows: { label: string; status: OffchainDueDiligenceStatus }[] = [
    { label: "\u56e2\u961f\u80cc\u666f", status: diligence.teamBackgroundStatus },
    { label: "\u878d\u8d44\u60c5\u51b5", status: diligence.financingStatus },
    { label: "\u793e\u533a\u6d3b\u8dc3", status: diligence.communityActivityStatus },
    { label: "\u4ea7\u54c1\u8fdb\u5c55", status: diligence.productProgressStatus },
    { label: "\u89e3\u9501\u4f9b\u7ed9", status: diligence.tokenUnlockStatus }
  ];

  return (
    <section className="rounded-md border border-violet-100 bg-violet-50/50 px-3 py-2">
      <header className="flex flex-wrap items-center gap-2">
        <p className="text-xs font-semibold text-violet-900">
          {"\u94fe\u4e0b\u5c3d\u8c03\uff08PRD 13.6\uff09"}
        </p>
        <span
          className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${ddRiskTone(diligence.riskLevel)}`}
        >
          {"\u98ce\u9669"}{DD_RISK_LABEL[diligence.riskLevel]}
        </span>
        <time className="text-[11px] text-violet-700" dateTime={diligence.lastReviewedAt}>
          {"\u590d\u6838 "}
          {diligence.lastReviewedAt}
        </time>
      </header>
      <dl className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-violet-950 sm:grid-cols-3">
        {dimensionRows.map((row) => (
          <div key={row.label}>
            <dt className="text-violet-600">{row.label}</dt>
            <dd className="font-medium">{DD_STATUS_LABEL[row.status]}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-xs font-medium text-violet-800">{"\u5173\u952e\u53d1\u73b0"}</p>
      <ul className="mt-1 list-inside list-disc text-xs leading-5 text-violet-950">
        {findings.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="mt-2 text-xs font-medium text-violet-800">{"\u5f85\u786e\u8ba4\u95ee\u9898"}</p>
      <ul className="mt-1 list-inside list-disc text-xs leading-5 text-violet-950">
        {questions.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {diligence.note?.trim() ? (
        <p className="mt-2 text-xs leading-5 text-violet-800">{diligence.note}</p>
      ) : null}
    </section>
  );
}

function RiskItem({ risk }: { risk: RiskTag }) {
  return (
    <li
      className={`rounded-md border px-2 py-1.5 text-xs leading-5 ${riskPriorityTone(risk.priority)}`}
    >
      <span className="font-mono font-semibold">{risk.priority}</span>
      <span className="mx-1.5 opacity-40">·</span>
      {risk.message}
    </li>
  );
}

function AlphaEntryRow({ entry, rank }: AlphaEntryRowProps) {
  const risksShown = entry.risks.slice(0, MAX_RISKS_SHOWN);

  return (
    <article className="rounded-md border border-zinc-200 bg-white p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-zinc-500">#{rank}</p>
          <p className="mt-0.5 font-mono text-base font-semibold text-zinc-900">
            {entry.token}
            <span className="ml-2 font-sans text-sm font-normal text-zinc-600">
              {displayOrDash(entry.projectName)}
            </span>
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {displayOrDash(entry.chain)} · {displayOrDash(entry.sector)}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span
            className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${alphaGradeTone(entry.grade)}`}
          >
            {entry.grade} 级
          </span>
          <span className="rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-800">
            {formatAlphaLifecycleState(entry.lifecycle)}
          </span>
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-zinc-800">
        <span className="font-medium text-zinc-700">进池理由：</span>
        {displayOrDash(entry.thesisLine)}
      </p>

      <TokenTransmissionBlock judgement={entry.tokenTransmission} />

      <div className="mt-2 rounded-md border border-sky-200 bg-sky-50 px-3 py-2">
        <p className="text-xs font-medium text-sky-800">下一步验证</p>
        <p className="mt-1 text-sm leading-6 text-sky-950">
          {displayOrDash(entry.nextVerification)}
        </p>
      </div>

      <details className="group mt-3 rounded-md border border-zinc-100 bg-zinc-50">
        <summary className="cursor-pointer list-none px-3 py-2 text-xs font-medium text-zinc-600 marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-2">
            辅助说明（异动 / 尽调 / 风险）
            <span className="text-zinc-400 group-open:rotate-180">▼</span>
          </span>
        </summary>
        <div className="space-y-2 border-t border-zinc-100 px-3 py-2 text-sm leading-6 text-zinc-700">
          <p>
            <span className="font-medium text-zinc-600">核心异动：</span>
            {displayOrDash(entry.coreMoveSummary)}
          </p>
          <p>
            <span className="font-medium text-zinc-600">催化：</span>
            {displayOrDash(entry.catalyst)}
          </p>

          <OffchainDueDiligenceBlock diligence={entry.offchainDueDiligence} />

          <p>
            <span className="font-medium text-zinc-600">最大风险：</span>
            {displayOrDash(entry.maxRisk)}
          </p>
          {risksShown.length > 0 ? (
            <ul className="flex flex-col gap-1.5 pt-1">
              {risksShown.map((risk) => (
                <RiskItem key={`${risk.priority}-${risk.code}`} risk={risk} />
              ))}
            </ul>
          ) : (
            <p className="text-xs text-zinc-500">风险标签：—</p>
          )}
        </div>
      </details>
    </article>
  );
}

export function AlphaPoolCard({ entries }: AlphaPoolCardProps) {
  const rows = entries.slice(0, MAX_ENTRIES);

  return (
    <section
      className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:p-5"
      aria-label="Alpha 观察池 Top 10"
    >
      <header className="border-b border-zinc-200 pb-3">
        <h2 className="text-lg font-semibold text-zinc-900">Alpha 观察池 Top 10</h2>
        <p className="mt-1 text-xs leading-5 text-zinc-500">
          观察池 ≠ 买入清单；以下项目仅供跟踪与验证，需结合 BTC 周期与市场环境独立判断。
        </p>
      </header>

      {rows.length === 0 ? (
        <p className="text-sm text-zinc-500">暂无 Alpha 观察条目（mock 未配置）。</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((entry, index) => (
            <li key={entry.id}>
              <AlphaEntryRow entry={entry} rank={index + 1} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

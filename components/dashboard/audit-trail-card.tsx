import type { AiDecisionSnapshot } from "@/lib/ai-decision-orchestrator";

export type AuditTrailCardProps = {
  snapshot: AiDecisionSnapshot;
};

const ACTION_LABEL: Record<string, string> = {
  followed: "已执行",
  deviated: "已偏离",
  pending: "待执行",
};

const ACTION_TONE: Record<string, string> = {
  followed: "bg-emerald-100 text-emerald-800",
  deviated: "bg-amber-100 text-amber-800",
  pending: "bg-slate-100 text-slate-600",
};

const RATING_LABEL: Record<string, string> = {
  correct: "判断正确",
  neutral: "中性",
  incorrect: "判断错误",
};

export function AuditTrailCard({ snapshot }: AuditTrailCardProps) {
  const { auditSummary, recentDecisions } = snapshot;

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-label="AI 建议记录"
    >
      <h2 className="mb-4 text-base font-bold text-slate-800">AI 建议记录</h2>

      <dl className="mb-4 grid grid-cols-4 gap-2 text-center">
        <div className="rounded-lg bg-slate-50 p-2">
          <dt className="text-xs text-slate-500">总建议</dt>
          <dd className="mt-0.5 font-mono text-lg font-semibold">{auditSummary.totalDecisions}</dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          <dt className="text-xs text-slate-500">执行率</dt>
          <dd className="mt-0.5 font-mono text-lg font-semibold">
            {(auditSummary.followThroughRate * 100).toFixed(0)}%
          </dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          <dt className="text-xs text-slate-500">准确率</dt>
          <dd className="mt-0.5 font-mono text-lg font-semibold">
            {auditSummary.accuracyRate > 0
              ? `${(auditSummary.accuracyRate * 100).toFixed(0)}%`
              : "—"}
          </dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          <dt className="text-xs text-slate-500">待执行</dt>
          <dd className="mt-0.5 font-mono text-lg font-semibold">
            {recentDecisions.filter((d) => d.userAction === "pending").length}
          </dd>
        </div>
      </dl>

      <div className="space-y-3">
        {recentDecisions.map((d) => (
          <div
            key={d.id}
            className="rounded-lg border border-slate-200 p-3 text-sm"
          >
            <div className="mb-1.5 flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400">{d.id}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  ACTION_TONE[d.userAction ?? "pending"] ?? ACTION_TONE.pending
                }`}
              >
                {ACTION_LABEL[d.userAction ?? "pending"] ?? d.userAction}
              </span>
            </div>
            <p className="font-medium text-slate-800">{d.recommendation}</p>
            <p className="mt-1 text-xs text-slate-500">{d.rationale}</p>
            {d.userNote ? (
              <p className="mt-1 text-xs italic text-slate-500">备注：{d.userNote}</p>
            ) : null}
            {d.outcome ? (
              <div className="mt-2 rounded-md bg-blue-50 px-2.5 py-1.5 text-xs">
                <span className="font-medium text-blue-700">
                  {d.outcomeRating ? RATING_LABEL[d.outcomeRating] : "评估"}：
                </span>
                <span className="text-blue-800">{d.outcome}</span>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

import type { RiskTag } from "@/data/types";
import { riskPriorityTone, sortRisksByPriority } from "@/lib/display-utils";

export type RiskWarningsCardProps = {
  risks: readonly RiskTag[];
  title?: string;
  description?: string;
  variant?: "list" | "detailed";
};

const MAX_RISKS_SHOWN = 5;

function riskBorderClass(priority: RiskTag["priority"]): string {
  switch (priority) {
    case "P0":
      return "border-l-4 border-l-red-500";
    case "P1":
      return "border-l-4 border-l-amber-500";
    default:
      return "border-l-4 border-l-slate-300";
  }
}

function RiskRow({ risk }: { risk: RiskTag }) {
  return (
    <li
      className={`rounded-md border px-3 py-2 text-sm leading-6 ${riskPriorityTone(risk.priority)}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs font-semibold">{risk.priority}</span>
        <span className="font-mono text-xs opacity-70">{risk.code}</span>
        {risk.category ? (
          <span className="rounded-full bg-white/60 px-1.5 py-0.5 text-xs">
            {risk.category}
          </span>
        ) : null}
      </div>
      <p className="mt-1">{risk.message}</p>
    </li>
  );
}

function DetailedRiskCard({ risk }: { risk: RiskTag }) {
  return (
    <article
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${riskBorderClass(risk.priority)}`}
    >
      <header className="mb-2 flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
              risk.priority === "P0"
                ? "bg-red-100 text-red-700"
                : risk.priority === "P1"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-slate-100 text-slate-600"
            }`}
          >
            {risk.priority}
          </span>
          <h3 className="text-sm font-bold text-slate-800">{risk.message}</h3>
        </div>
        <p className="text-[10px] text-slate-400">
          {risk.category ?? "—"}
          {risk.assetLabel ? ` · ${risk.assetLabel}` : ""}
          {risk.monitoringFrequency ? ` · ${risk.monitoringFrequency}` : ""}
        </p>
      </header>
      {risk.whyImportant ? (
        <p className="mb-2 text-xs leading-5 text-slate-600">
          <span className="font-semibold text-slate-700">为什么重要：</span>
          {risk.whyImportant}
        </p>
      ) : null}
      {risk.positionImpact ? (
        <p className="rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5 text-xs leading-5 text-slate-700">
          <span className="font-semibold">对仓位影响：</span>
          {risk.positionImpact}
        </p>
      ) : null}
    </article>
  );
}

export function RiskWarningsCard({
  risks,
  title = "\u98ce\u9669\u9884\u8b66",
  description = "\u6309\u4f18\u5148\u7ea7\u6c47\u603b\u5f53\u524d\u9700\u5173\u6ce8\u7684\u98ce\u9669\u4e8b\u9879\uff1b\u4ecd\u9700\u7ed3\u5408 BTC \u5468\u671f\u4e0e\u5e02\u573a\u73af\u5883\u72ec\u7acb\u5224\u65ad\u3002",
  variant = "list"
}: RiskWarningsCardProps) {
  const sorted = sortRisksByPriority(risks).slice(0, MAX_RISKS_SHOWN);
  const counts = {
    P0: risks.filter((risk) => risk.priority === "P0").length,
    P1: risks.filter((risk) => risk.priority === "P1").length,
    P2: risks.filter((risk) => risk.priority === "P2").length
  };

  if (variant === "detailed") {
    return (
      <section
        className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        aria-label={title}
      >
        <header>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-slate-800">{title}</h2>
            <p className="text-[10px] text-slate-400">
              P0: {counts.P0} · P1: {counts.P1} · P2: {counts.P2}
            </p>
          </div>
          {description.trim() ? (
            <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
          ) : null}
        </header>
        <ul className="flex flex-col gap-3">
          {sorted.map((risk) => (
            <li key={`${risk.priority}-${risk.code}`}>
              <DetailedRiskCard risk={risk} />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section
      className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:p-5"
      aria-label={title}
    >
      <header className="border-b border-zinc-200 pb-3">
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        {description.trim() ? (
          <p className="mt-1 text-xs leading-5 text-zinc-500">{description}</p>
        ) : null}
      </header>

      {sorted.length === 0 ? (
        <p className="text-sm leading-6 text-zinc-600">
          \u6682\u65e0\u9ad8\u4f18\u5148\u7ea7\u98ce\u9669\uff0c\u4ecd\u9700\u7ee7\u7eed\u89c2\u5bdf\u5e02\u573a\u4e0e\u4ed3\u4f4d\u53d8\u5316\u3002
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {sorted.map((risk) => (
            <RiskRow key={`${risk.priority}-${risk.code}`} risk={risk} />
          ))}
        </ul>
      )}
    </section>
  );
}

import type { RiskTag } from "@/data/types";
import { riskPriorityTone, sortRisksByPriority } from "@/lib/display-utils";

export type RiskWarningsCardProps = {
  risks: readonly RiskTag[];
  title?: string;
  description?: string;
};

const MAX_RISKS_SHOWN = 5;

function displayOrDash(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}

type RiskRowProps = {
  risk: RiskTag;
};

function RiskRow({ risk }: RiskRowProps) {
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
      {risk.relatedAssetId ? (
        <p className="mt-1 text-xs opacity-75">
          关联资产：{displayOrDash(risk.relatedAssetId)}
        </p>
      ) : null}
    </li>
  );
}

export function RiskWarningsCard({
  risks,
  title = "风险预警",
  description = "按优先级汇总当前需关注的风险事项；仍需结合 BTC 周期与市场环境独立判断。"
}: RiskWarningsCardProps) {
  const sorted = sortRisksByPriority(risks).slice(0, MAX_RISKS_SHOWN);

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
          暂无高优先级风险，仍需继续观察市场与仓位变化。
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

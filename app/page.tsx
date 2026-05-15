import { getAssets } from "@/data";
import { calculateResearchOverview } from "@/lib/research-overview";

export default function Home() {
  const overview = calculateResearchOverview(getAssets());

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-8 text-zinc-900">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">T01 占位</p>
        <h1 className="mt-2 text-2xl font-semibold">Web3 个人投研 MVP</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          脚手架阶段（T01–T03）：Next.js + mock 数据 + <code className="rounded bg-zinc-100 px-1">calculateResearchOverview</code>。
          业务区块（T04+）未实现。
        </p>
      </header>

      <section className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm" aria-label="投研概览">
        <h2 className="font-semibold text-zinc-800">投研概览（lib 计算）</h2>
        <dl className="mt-3 grid gap-2 sm:grid-cols-2">
          <div>
            <dt className="text-zinc-500">totalAssets</dt>
            <dd className="font-mono text-lg">{overview.totalAssets}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">activeResearchCount</dt>
            <dd className="font-mono text-lg">{overview.activeResearchCount}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">averageConfidence</dt>
            <dd className="font-mono text-lg">
              {overview.averageConfidence === null ? "—" : overview.averageConfidence.toFixed(1)}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">highRiskCount</dt>
            <dd className="font-mono text-lg">{overview.highRiskCount}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}

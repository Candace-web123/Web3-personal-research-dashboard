export type DashboardHeaderProps = {
  asOf: string;
};

export function DashboardHeader({ asOf }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1248px] items-center justify-between px-6">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Web3 个人投研工作台
          </h1>
          <span className="text-sm font-medium text-slate-500">V1.2 每日投研</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1">
            <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              本地 MOCK 模式
            </span>
          </div>
          <div className="hidden flex-col items-end text-xs text-slate-400 sm:flex">
            <time dateTime={asOf}>更新时间: {asOf} UTC+8</time>
            <span className="text-[10px]">数据源: Glassnode, Nansen, Dune, Internal</span>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1248px] px-6 pb-2">
        <p className="text-[13px] text-slate-500">
          投研逻辑：先判断环境与 BTC 周期，再看异动、资金结构、Alpha 与风险。严禁直接作为交易指令。
        </p>
      </div>
    </header>
  );
}

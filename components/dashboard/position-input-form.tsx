import type { ActualPositionInput } from "@/data/types";

type ConcentrationLevel = ActualPositionInput["concentrationLevel"];

const LABEL_MODE =
  "当前分析模式：手动录入 + 规则化对比（非 OCR、非交易所同步、非大数据分析）";

const inputClass =
  "w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900";

export type PositionInputFormProps = {
  previewUrl: string | null;
  hasUploaded: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  stablecoinCashPercent: number;
  btcEthPercent: number;
  alphaPercent: number;
  highRiskPercent: number;
  outsideUniversePercent: number;
  concentrationLevel: ConcentrationLevel;
  topHoldingSymbol: string;
  topHoldingPercent: string;
  note: string;
  coreSum: number;
  sumMismatch: boolean;
  onStablecoinCashPercentChange: (value: number) => void;
  onBtcEthPercentChange: (value: number) => void;
  onAlphaPercentChange: (value: number) => void;
  onHighRiskPercentChange: (value: number) => void;
  onOutsideUniversePercentChange: (value: number) => void;
  onConcentrationLevelChange: (value: ConcentrationLevel) => void;
  onTopHoldingSymbolChange: (value: string) => void;
  onTopHoldingPercentChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onRunAnalysis: () => void;
};

export function PositionInputForm({
  previewUrl,
  hasUploaded,
  onFileChange,
  stablecoinCashPercent,
  btcEthPercent,
  alphaPercent,
  highRiskPercent,
  outsideUniversePercent,
  concentrationLevel,
  topHoldingSymbol,
  topHoldingPercent,
  note,
  coreSum,
  sumMismatch,
  onStablecoinCashPercentChange,
  onBtcEthPercentChange,
  onAlphaPercentChange,
  onHighRiskPercentChange,
  onOutsideUniversePercentChange,
  onConcentrationLevelChange,
  onTopHoldingSymbolChange,
  onTopHoldingPercentChange,
  onNoteChange,
  onRunAnalysis
}: PositionInputFormProps) {
  return (
    <>
      <section className="rounded-md border border-sky-200 bg-sky-50 p-3 text-sm leading-6 text-sky-950">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">
          当前 MVP 能力
        </p>
        <p className="mt-1">{LABEL_MODE}</p>
        <p className="mt-2 text-xs text-sky-900/90">
          当前版本不自动识别截图内容，请手动校正四类核心仓位比例。
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-zinc-600">
          上传实际仓位截图（仅本地预览）
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="block w-full text-sm text-zinc-600 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-200 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-zinc-800"
        />
        {hasUploaded && previewUrl ? (
          <figure className="overflow-hidden rounded-md border border-zinc-200 bg-white p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="实际仓位截图本地预览"
              className="max-h-48 w-full object-contain"
            />
            <figcaption className="mt-2 text-xs text-amber-800">
              当前版本不自动识别图片内容，请根据截图手动录入或校正下方比例。
            </figcaption>
          </figure>
        ) : (
          <p className="text-xs text-zinc-500">
            可选：上传截图辅助对照；也可直接手动录入比例。
          </p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            手动录入 / 校正仓位比例（%）
          </h3>
          <button
            type="button"
            onClick={onRunAnalysis}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
          >
            生成对比分析
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600">稳定币 / 现金缓冲</span>
            <input
              type="number"
              min={0}
              max={100}
              value={stablecoinCashPercent}
              onChange={(e) =>
                onStablecoinCashPercentChange(Number(e.target.value) || 0)
              }
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600">BTC / ETH 主流</span>
            <input
              type="number"
              min={0}
              max={100}
              value={btcEthPercent}
              onChange={(e) => onBtcEthPercentChange(Number(e.target.value) || 0)}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600">Alpha 观察池</span>
            <input
              type="number"
              min={0}
              max={100}
              value={alphaPercent}
              onChange={(e) => onAlphaPercentChange(Number(e.target.value) || 0)}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600">高风险热点</span>
            <input
              type="number"
              min={0}
              max={100}
              value={highRiskPercent}
              onChange={(e) =>
                onHighRiskPercentChange(Number(e.target.value) || 0)
              }
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600">观察池外资产（可选）</span>
            <input
              type="number"
              min={0}
              max={100}
              value={outsideUniversePercent}
              onChange={(e) =>
                onOutsideUniversePercentChange(Number(e.target.value) || 0)
              }
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600">仓位集中度</span>
            <select
              value={concentrationLevel}
              onChange={(e) =>
                onConcentrationLevelChange(e.target.value as ConcentrationLevel)
              }
              className={inputClass}
            >
              <option value="Low">低</option>
              <option value="Medium">中</option>
              <option value="High">高</option>
              <option value="Unknown">未知</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600">最大单一持仓 symbol（可选）</span>
            <input
              type="text"
              value={topHoldingSymbol}
              onChange={(e) => onTopHoldingSymbolChange(e.target.value)}
              className={inputClass}
              placeholder="BTC"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600">最大单一持仓占比 %（可选）</span>
            <input
              type="number"
              min={0}
              max={100}
              value={topHoldingPercent}
              onChange={(e) => onTopHoldingPercentChange(e.target.value)}
              className={inputClass}
            />
          </label>
        </div>

        <p className={`text-xs ${sumMismatch ? "text-amber-800" : "text-zinc-500"}`}>
          四类核心仓位合计：{coreSum.toFixed(0)}%
          {sumMismatch
            ? " — 与 100% 偏差较大，请检查录入；仍可查看分析结果。"
            : " — 与 100% 接近。"}
        </p>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-600">备注（可选）</span>
          <textarea
            value={note}
            rows={2}
            onChange={(e) => onNoteChange(e.target.value)}
            className={inputClass}
          />
        </label>
      </section>
    </>
  );
}

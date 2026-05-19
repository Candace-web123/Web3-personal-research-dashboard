"use client";

import { useMemo, useRef, useState } from "react";
import type {
  ActualPositionCompareContext,
  ActualPositionInput,
  ActualPositionRecommendation
} from "@/data/types";
import { ActualPositionConcentration } from "@/data/types";
import {
  compareActualPosition,
  formatCompareStatusLabel
} from "@/lib/actual-position-compare";

export type ActualPositionCompareCardProps = {
  context: ActualPositionCompareContext;
};

const EMPTY_FORM: ActualPositionInput = {
  stablecoinCashPercent: 0,
  btcEthPercent: 0,
  alphaPercent: 0,
  highRiskPercent: 0,
  outsideUniversePercent: 0,
  concentrationLevel: ActualPositionConcentration.Unknown,
  manuallyAdjusted: true
};

function parseNumberField(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function statusTone(status: string): string {
  switch (status) {
    case "too_low":
      return "bg-amber-50 text-amber-800 border-amber-100";
    case "too_high":
      return "bg-rose-50 text-rose-800 border-rose-100";
    case "in_range":
      return "bg-emerald-50 text-emerald-800 border-emerald-100";
    case "needs_confirmation":
      return "bg-slate-100 text-slate-700 border-slate-200";
    default:
      return "bg-slate-50 text-slate-500 border-slate-100";
  }
}

function RecommendationBlock({
  recommendation
}: {
  recommendation: ActualPositionRecommendation;
}) {
  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
      <p className="text-sm font-bold text-indigo-900">{recommendation.action}</p>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        <DetailItem label="判断依据" value={recommendation.rationale} />
        <DetailItem label="适用条件" value={recommendation.condition} />
        <DetailItem label="风险提醒" value={recommendation.riskReminder} />
        <DetailItem label="失效条件" value={recommendation.invalidation} />
      </dl>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-xs leading-5 text-slate-700">{value}</dd>
    </div>
  );
}

export function ActualPositionCompareCard({ context }: ActualPositionCompareCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [form, setForm] = useState<ActualPositionInput>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState<ActualPositionInput | null>(null);
  const [showForm, setShowForm] = useState(false);

  const result = useMemo(
    () => compareActualPosition(submitted, context),
    [submitted, context]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setHasUploaded(true);
    setShowForm(true);
  };

  const resetUpload = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setHasUploaded(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted({
      ...form,
      manuallyAdjusted: true,
      uploadedAt: new Date().toISOString()
    });
  };

  return (
    <section
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      aria-label="实际仓位对比分析"
    >
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="text-base font-bold text-slate-800">实际仓位对比分析</h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          对比手动录入比例与系统参考框架，输出偏差诊断与个人仓位建议。截图仅在本地预览，不上传服务器；当前版本不支持
          OCR 与交易所 API。
        </p>
      </div>

      <div className="space-y-6 p-6">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            上传仓位截图
          </button>
          <button
            type="button"
            onClick={resetUpload}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            重置上传
          </button>
          <button
            type="button"
            onClick={() => setShowForm((value) => !value)}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            手动录入 / 校正
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="仓位截图本地预览"
              className="mx-auto max-h-48 rounded-lg border border-slate-200 object-contain"
            />
          ) : (
            <p className="text-sm text-slate-400">
              {hasUploaded ? "预览已清除" : "尚未上传实际仓位截图"}
            </p>
          )}
          <p className="mt-2 text-[10px] text-slate-400">
            识别置信度：— · 手动校正：{submitted?.manuallyAdjusted ? "是" : "否"} · 合计：
            {submitted ? `${result.percentSum.toFixed(1)}%` : "—"}
          </p>
        </div>

        {showForm ? (
          <form
            onSubmit={handleSubmit}
            className="grid gap-6 lg:grid-cols-2"
          >
            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="text-xs font-bold text-slate-700">实际仓位录入</h3>
              <div className="mt-3 grid gap-3">
                <PercentField
                  label="稳定币 / 现金缓冲 (%)"
                  value={form.stablecoinCashPercent}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, stablecoinCashPercent: value }))
                  }
                />
                <PercentField
                  label="BTC / ETH 主流 (%)"
                  value={form.btcEthPercent}
                  onChange={(value) => setForm((prev) => ({ ...prev, btcEthPercent: value }))}
                />
                <PercentField
                  label="Alpha 观察池 (%)"
                  value={form.alphaPercent}
                  onChange={(value) => setForm((prev) => ({ ...prev, alphaPercent: value }))}
                />
                <PercentField
                  label="高风险热点 (%)"
                  value={form.highRiskPercent}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, highRiskPercent: value }))
                  }
                />
                <PercentField
                  label="观察池外资产 (%)"
                  value={form.outsideUniversePercent ?? 0}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, outsideUniversePercent: value }))
                  }
                />
                <label className="block text-xs text-slate-600">
                  集中度
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    value={form.concentrationLevel}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        concentrationLevel:
                          event.target.value as ActualPositionInput["concentrationLevel"]
                      }))
                    }
                  >
                    <option value={ActualPositionConcentration.Low}>低</option>
                    <option value={ActualPositionConcentration.Medium}>中</option>
                    <option value={ActualPositionConcentration.High}>高</option>
                    <option value={ActualPositionConcentration.Unknown}>未知</option>
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs text-slate-600">
                    最大持仓标的
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      value={form.topHoldingSymbol ?? ""}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          topHoldingSymbol: event.target.value
                        }))
                      }
                    />
                  </label>
                  <PercentField
                    label="最大持仓占比 (%)"
                    value={form.topHoldingPercent ?? 0}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, topHoldingPercent: value }))
                    }
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                保存并对比
              </button>
            </div>

            <CompareTable result={result} />
          </form>
        ) : (
          <CompareTable result={result} />
        )}

        {submitted && !result.percentSumValid ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            四类核心仓位合计为 {result.percentSum.toFixed(1)}%，与 100% 偏差超过 2%，请检查录入。
          </p>
        ) : null}

        {submitted ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-xs font-bold text-slate-700">总体结论</h3>
              <p className="mt-2 text-sm leading-6 text-slate-800">{result.overallSummary}</p>
              <p className="mt-2 text-xs text-slate-500">{result.strongestDirectionNote}</p>
            </div>

            {result.issues.length > 0 ? (
              <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
                <h3 className="text-xs font-bold text-amber-800">不妥之处</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-xs leading-5 text-amber-950">
                  {result.issues.map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-xs font-bold text-slate-700">个人仓位建议</h3>
              {result.positionRecommendations.length === 0 ? (
                <PlaceholderRecommendations />
              ) : (
                <div className="mt-4 space-y-3">
                  {result.positionRecommendations.map((item) => (
                    <RecommendationBlock key={item.action} recommendation={item} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-xs font-bold text-slate-700">个人仓位建议</h3>
            <PlaceholderRecommendations />
          </div>
        )}

        <details className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <summary className="cursor-pointer text-[11px] font-bold text-slate-500">
            当前限制与未来能力
          </summary>
          <div className="mt-3 grid gap-6 border-t border-slate-200 pt-3 text-[10px] text-slate-500 sm:grid-cols-2">
            <ul className="list-inside list-disc space-y-1">
              <li>不自动识别图片内容</li>
              <li>未接交易所 API</li>
              <li>未使用真实链上 / 行情 / 历史数据</li>
              <li>分析基于手动录入 + 规则化对比</li>
            </ul>
            <ul className="list-inside list-disc space-y-1">
              <li>OCR / 截图自动识别</li>
              <li>交易所只读持仓同步</li>
              <li>链上钱包资产识别</li>
              <li>实时行情 + 风险模型评分</li>
            </ul>
          </div>
        </details>
      </div>
    </section>
  );
}

function PercentField({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-xs text-slate-600">
      {label}
      <input
        type="number"
        min={0}
        max={100}
        step={0.1}
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(parseNumberField(event.target.value))}
      />
    </label>
  );
}

function CompareTable({
  result
}: {
  result: ReturnType<typeof compareActualPosition>;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <h3 className="text-xs font-bold text-slate-700">实际仓位 vs 系统参考</h3>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[28rem] text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-500">
              <th className="py-2 pr-2 font-medium">类别</th>
              <th className="py-2 pr-2 font-medium">实际 %</th>
              <th className="py-2 pr-2 font-medium">参考区间</th>
              <th className="py-2 pr-2 font-medium">状态</th>
              <th className="py-2 font-medium">说明</th>
            </tr>
          </thead>
          <tbody>
            {result.deviations.map((row) => (
              <tr key={row.categoryId} className="border-b border-slate-50 align-top">
                <td className="py-2 pr-2 font-medium text-slate-800">{row.categoryLabel}</td>
                <td className="py-2 pr-2 font-mono text-slate-700">
                  {row.actualPercent === null ? "—" : `${row.actualPercent}%`}
                </td>
                <td className="py-2 pr-2 font-mono text-slate-600">
                  {row.referenceRangeLabel}
                </td>
                <td className="py-2 pr-2">
                  <span
                    className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusTone(row.status)}`}
                  >
                    {formatCompareStatusLabel(row.status)}
                  </span>
                </td>
                <td className="py-2 text-slate-600">{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlaceholderRecommendations() {
  return (
    <div className="py-6 text-center">
      <p className="text-xs text-slate-400">
        录入实际仓位后，系统将结合今日决策、BTC 周期、市场环境、Alpha 观察池和风险预警，输出结构化个人仓位建议。
      </p>
      <div className="mx-auto mt-4 grid max-w-lg grid-cols-2 gap-3 text-[10px] text-slate-400">
        <PlaceholderField title="建议动作" example="如：降低高风险热点暴露" />
        <PlaceholderField title="判断依据" example="如：高于参考区间，P1 未解除" />
        <PlaceholderField title="适用条件" example="如：中性偏防守 / 情绪驱动" />
        <PlaceholderField
          title="风险提醒 + 失效条件"
          example="如：若强链共振增强则需重估"
        />
      </div>
    </div>
  );
}

function PlaceholderField({ title, example }: { title: string; example: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 p-2 text-left">
      <div className="font-bold text-slate-500">{title}</div>
      <div className="text-slate-400">{example}</div>
    </div>
  );
}

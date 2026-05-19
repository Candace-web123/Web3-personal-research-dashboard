"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  ActualPositionCompareResult,
  ActualPositionCompareStatus,
  ActualPositionInput,
  ActualPositionRecommendation,
  PositionAdviceSnapshot,
  RiskTag
} from "@/data/types";
import {
  buildActualPositionCompareResult,
  sumCorePositionPercents
} from "@/lib/actual-position-compare";
import {
  formatBtcCycleStage,
  formatMarketRegime,
  formatUserRiskProfile
} from "@/lib/display-utils";

export type ActualPositionCompareCardProps = {
  positionAdviceSnapshot: PositionAdviceSnapshot;
  strongestDirection?: string;
  topRisks?: readonly RiskTag[];
};

type ConcentrationLevel = ActualPositionInput["concentrationLevel"];

const LABEL_TITLE = "\u5b9e\u9645\u4ed3\u4f4d\u5bf9\u6bd4\u5206\u6790";
const LABEL_EXPAND =
  "\uff08\u70b9\u51fb\u5c55\u5f00 \u00b7 \u624b\u52a8\u5f55\u5165 + \u89c4\u5219\u5316\u5bf9\u6bd4\uff09";
const LABEL_MODE =
  "\u5f53\u524d\u5206\u6790\u6a21\u5f0f\uff1a\u624b\u52a8\u5f55\u5165 + \u89c4\u5219\u5316\u5bf9\u6bd4\uff08\u975e OCR\u3001\u975e\u4ea4\u6613\u6240\u540c\u6b65\u3001\u975e\u5927\u6570\u636e\u5206\u6790\uff09";
const LABEL_POSITION_RECOMMENDATIONS = "\u4e2a\u4eba\u4ed3\u4f4d\u5efa\u8bae";
const LABEL_RATIONALE = "\u5224\u65ad\u4f9d\u636e";
const LABEL_CONDITION = "\u9002\u7528\u6761\u4ef6";
const LABEL_RISK_REMINDER = "\u98ce\u9669\u63d0\u9192";
const LABEL_INVALIDATION = "\u5931\u6548\u6761\u4ef6";
const LABEL_RECOMMENDATION_NOTE =
  "\u4ee5\u4e0b\u4e3a\u57fa\u4e8e\u5f53\u524d\u89c4\u5219\u7684\u660e\u786e\u5efa\u8bae\uff0c\u9700\u60a8\u81ea\u884c\u6267\u884c\uff1b\u7cfb\u7edf\u4e0d\u81ea\u52a8\u4ea4\u6613\u3001\u4e0d\u81ea\u52a8\u4e0b\u5355\u3002";

function statusLabel(status: ActualPositionCompareStatus): string {
  switch (status) {
    case "BelowRange":
      return "\u504f\u4f4e";
    case "InRange":
      return "\u5408\u7406";
    case "AboveRange":
      return "\u504f\u9ad8";
    case "NeedsReview":
      return "\u9700\u786e\u8ba4";
    default:
      return status;
  }
}

function statusTone(status: ActualPositionCompareStatus): string {
  switch (status) {
    case "BelowRange":
      return "border-amber-200 bg-amber-50 text-amber-950";
    case "InRange":
      return "border-emerald-200 bg-emerald-50 text-emerald-950";
    case "AboveRange":
      return "border-rose-200 bg-rose-50 text-rose-950";
    case "NeedsReview":
      return "border-violet-200 bg-violet-50 text-violet-950";
    default:
      return "border-zinc-200 bg-zinc-50 text-zinc-800";
  }
}

function categoryDisplayName(category: string): string {
  switch (category) {
    case "StablecoinCash":
      return "\u7a33\u5b9a\u5e01 / \u73b0\u91d1\u7f13\u51b2";
    case "BtcEth":
      return "BTC / ETH \u4e3b\u6d41";
    case "Alpha":
      return "Alpha \u89c2\u5bdf\u6c60";
    case "HighRisk":
      return "\u9ad8\u98ce\u9669\u70ed\u70b9";
    case "OutsideUniverse":
      return "\u89c2\u5bdf\u6c60\u5916\u8d44\u4ea7";
    default:
      return category;
  }
}

function PositionRecommendationCard({
  recommendation
}: {
  recommendation: ActualPositionRecommendation;
}) {
  return (
    <li className="rounded-md border border-indigo-200 bg-indigo-50/80 px-3 py-3">
      <p className="text-sm font-semibold text-indigo-950">{recommendation.action}</p>
      <dl className="mt-2 space-y-2 text-xs leading-5 text-indigo-900/95">
        <div>
          <dt className="font-medium text-indigo-800">{LABEL_RATIONALE}</dt>
          <dd className="mt-0.5">{recommendation.rationale}</dd>
        </div>
        <div>
          <dt className="font-medium text-indigo-800">{LABEL_CONDITION}</dt>
          <dd className="mt-0.5">{recommendation.condition}</dd>
        </div>
        <div>
          <dt className="font-medium text-indigo-800">{LABEL_RISK_REMINDER}</dt>
          <dd className="mt-0.5">{recommendation.riskReminder}</dd>
        </div>
        <div>
          <dt className="font-medium text-indigo-800">{LABEL_INVALIDATION}</dt>
          <dd className="mt-0.5">{recommendation.invalidation}</dd>
        </div>
      </dl>
    </li>
  );
}

function alignmentLabel(
  alignment: ActualPositionCompareResult["strongestDirectionAlignment"]
): string {
  switch (alignment) {
    case "Aligned":
      return "\u4e0e\u4eca\u65e5\u6700\u5f3a\u65b9\u5411\u57fa\u672c\u4e00\u81f4";
    case "PartiallyAligned":
      return "\u4e0e\u4eca\u65e5\u6700\u5f3a\u65b9\u5411\u90e8\u5206\u4e00\u81f4\uff0c\u5efa\u8bae\u590d\u6838";
    case "NotAligned":
      return "\u4e0e\u4eca\u65e5\u6700\u5f3a\u65b9\u5411\u4e0d\u4e00\u81f4\uff0c\u5efa\u8bae\u590d\u6838\u76f8\u5173\u66b4\u9732";
    case "Unknown":
      return "\u6700\u5f3a\u65b9\u5411\u4fe1\u606f\u4e0d\u8db3\uff0c\u6682\u65e0\u6cd5\u5224\u65ad\u4e00\u81f4\u6027";
    default:
      return alignment;
  }
}

const defaultPercents = {
  stablecoinCashPercent: 35,
  btcEthPercent: 45,
  alphaPercent: 12,
  highRiskPercent: 5,
  outsideUniversePercent: 3
};

export function ActualPositionCompareCard({
  positionAdviceSnapshot,
  strongestDirection,
  topRisks
}: ActualPositionCompareCardProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [stablecoinCashPercent, setStablecoinCashPercent] = useState(
    defaultPercents.stablecoinCashPercent
  );
  const [btcEthPercent, setBtcEthPercent] = useState(defaultPercents.btcEthPercent);
  const [alphaPercent, setAlphaPercent] = useState(defaultPercents.alphaPercent);
  const [highRiskPercent, setHighRiskPercent] = useState(
    defaultPercents.highRiskPercent
  );
  const [outsideUniversePercent, setOutsideUniversePercent] = useState(
    defaultPercents.outsideUniversePercent
  );
  const [concentrationLevel, setConcentrationLevel] =
    useState<ConcentrationLevel>("Medium");
  const [topHoldingSymbol, setTopHoldingSymbol] = useState("");
  const [topHoldingPercent, setTopHoldingPercent] = useState("");
  const [note, setNote] = useState("");
  const [analysisEnabled, setAnalysisEnabled] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
      setHasUploaded(true);
      setAnalysisEnabled(false);
    },
    [previewUrl]
  );

  const actualPositionInput = useMemo((): ActualPositionInput | null => {
    if (!analysisEnabled) return null;

    const topPct = topHoldingPercent.trim()
      ? Number(topHoldingPercent)
      : undefined;

    return {
      asOf: positionAdviceSnapshot.asOf,
      stablecoinCashPercent,
      btcEthPercent,
      alphaPercent,
      highRiskPercent,
      outsideUniversePercent,
      concentrationLevel,
      topHoldingSymbol: topHoldingSymbol.trim() || undefined,
      topHoldingPercent:
        topPct !== undefined && Number.isFinite(topPct) ? topPct : undefined,
      manuallyAdjusted: true,
      note: note.trim() || undefined
    };
  }, [
    analysisEnabled,
    positionAdviceSnapshot.asOf,
    stablecoinCashPercent,
    btcEthPercent,
    alphaPercent,
    highRiskPercent,
    outsideUniversePercent,
    concentrationLevel,
    topHoldingSymbol,
    topHoldingPercent,
    note
  ]);

  const coreSum = useMemo(() => {
    if (!actualPositionInput) {
      return (
        stablecoinCashPercent +
        btcEthPercent +
        alphaPercent +
        highRiskPercent
      );
    }
    return sumCorePositionPercents(actualPositionInput);
  }, [
    actualPositionInput,
    stablecoinCashPercent,
    btcEthPercent,
    alphaPercent,
    highRiskPercent
  ]);

  const sumMismatch = Math.abs(coreSum - 100) > 2;

  const compareResult = useMemo(() => {
    if (!actualPositionInput) return null;
    return buildActualPositionCompareResult({
      actualPosition: actualPositionInput,
      positionAdviceSnapshot,
      strongestDirection,
      topRisks
    });
  }, [
    actualPositionInput,
    positionAdviceSnapshot,
    strongestDirection,
    topRisks
  ]);

  const runAnalysis = () => {
    setAnalysisEnabled(true);
  };

  const inputClass =
    "w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900";

  return (
    <details className="rounded-lg border border-zinc-300 bg-zinc-100/80">
      <summary
        className="cursor-pointer list-none px-4 py-3 marker:content-none [&::-webkit-details-marker]:hidden"
        aria-label={LABEL_TITLE}
      >
        <span className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-semibold text-zinc-800">
            {LABEL_TITLE}
            {LABEL_EXPAND}
          </span>
          <time
            className="text-xs text-zinc-500"
            dateTime={positionAdviceSnapshot.asOf}
          >
            {positionAdviceSnapshot.asOf}
          </time>
        </span>
        <p className="mt-1 text-xs leading-5 text-zinc-500">
          {"\u4e0a\u4f20\u622a\u56fe\u4ec5\u672c\u5730\u9884\u89c8\uff1b\u8bf7\u624b\u52a8\u5f55\u5165\u6bd4\u4f8b\u540e\u4e0e\u7cfb\u7edf\u53c2\u8003\u6846\u67b6\u5bf9\u6bd4\u3002\u63d0\u4f9b\u660e\u786e\u4e2a\u4eba\u4ed3\u4f4d\u5efa\u8bae\uff0c\u4e0d\u81ea\u52a8\u4ea4\u6613\u3001\u4e0d\u66ff\u60a8\u4e0b\u5355\u3002"}
        </p>
      </summary>

      <div className="flex flex-col gap-4 border-t border-zinc-200 p-4">
        <section className="rounded-md border border-sky-200 bg-sky-50 p-3 text-sm leading-6 text-sky-950">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">
            {"\u5f53\u524d MVP \u80fd\u529b"}
          </p>
          <p className="mt-1">{LABEL_MODE}</p>
          <p className="mt-2 text-xs text-sky-900/90">
            {"\u5f53\u524d\u7248\u672c\u4e0d\u81ea\u52a8\u8bc6\u522b\u622a\u56fe\u5185\u5bb9\uff0c\u8bf7\u624b\u52a8\u6821\u6b63\u56db\u7c7b\u6838\u5fc3\u4ed3\u4f4d\u6bd4\u4f8b\u3002"}
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-zinc-600">
            {"\u4e0a\u4f20\u5b9e\u9645\u4ed3\u4f4d\u622a\u56fe\uff08\u4ec5\u672c\u5730\u9884\u89c8\uff09"}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-zinc-600 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-200 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-zinc-800"
          />
          {hasUploaded && previewUrl ? (
            <figure className="overflow-hidden rounded-md border border-zinc-200 bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={"\u5b9e\u9645\u4ed3\u4f4d\u622a\u56fe\u672c\u5730\u9884\u89c8"}
                className="max-h-48 w-full object-contain"
              />
              <figcaption className="mt-2 text-xs text-amber-800">
                {"\u5f53\u524d\u7248\u672c\u4e0d\u81ea\u52a8\u8bc6\u522b\u56fe\u7247\u5185\u5bb9\uff0c\u8bf7\u6839\u636e\u622a\u56fe\u624b\u52a8\u5f55\u5165\u6216\u6821\u6b63\u4e0b\u65b9\u6bd4\u4f8b\u3002"}
              </figcaption>
            </figure>
          ) : (
            <p className="text-xs text-zinc-500">
              {"\u53ef\u9009\uff1a\u4e0a\u4f20\u622a\u56fe\u8f85\u52a9\u5bf9\u7167\uff1b\u4e5f\u53ef\u76f4\u63a5\u624b\u52a8\u5f55\u5165\u6bd4\u4f8b\u3002"}
            </p>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {"\u624b\u52a8\u5f55\u5165 / \u6821\u6b63\u4ed3\u4f4d\u6bd4\u4f8b\uff08%\uff09"}
            </h3>
            <button
              type="button"
              onClick={runAnalysis}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
            >
              {"\u751f\u6210\u5bf9\u6bd4\u5206\u6790"}
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-zinc-600">{"\u7a33\u5b9a\u5e01 / \u73b0\u91d1\u7f13\u51b2"}</span>
              <input type="number" min={0} max={100} value={stablecoinCashPercent}
                onChange={(e) => { setStablecoinCashPercent(Number(e.target.value) || 0); setAnalysisEnabled(false); }}
                className={inputClass} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-zinc-600">{"BTC / ETH \u4e3b\u6d41"}</span>
              <input type="number" min={0} max={100} value={btcEthPercent}
                onChange={(e) => { setBtcEthPercent(Number(e.target.value) || 0); setAnalysisEnabled(false); }}
                className={inputClass} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-zinc-600">{"Alpha \u89c2\u5bdf\u6c60"}</span>
              <input type="number" min={0} max={100} value={alphaPercent}
                onChange={(e) => { setAlphaPercent(Number(e.target.value) || 0); setAnalysisEnabled(false); }}
                className={inputClass} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-zinc-600">{"\u9ad8\u98ce\u9669\u70ed\u70b9"}</span>
              <input type="number" min={0} max={100} value={highRiskPercent}
                onChange={(e) => { setHighRiskPercent(Number(e.target.value) || 0); setAnalysisEnabled(false); }}
                className={inputClass} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-zinc-600">{"\u89c2\u5bdf\u6c60\u5916\u8d44\u4ea7\uff08\u53ef\u9009\uff09"}</span>
              <input type="number" min={0} max={100} value={outsideUniversePercent}
                onChange={(e) => { setOutsideUniversePercent(Number(e.target.value) || 0); setAnalysisEnabled(false); }}
                className={inputClass} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-zinc-600">{"\u4ed3\u4f4d\u96c6\u4e2d\u5ea6"}</span>
              <select value={concentrationLevel}
                onChange={(e) => { setConcentrationLevel(e.target.value as ConcentrationLevel); setAnalysisEnabled(false); }}
                className={inputClass}>
                <option value="Low">{"\u4f4e"}</option>
                <option value="Medium">{"\u4e2d"}</option>
                <option value="High">{"\u9ad8"}</option>
                <option value="Unknown">{"\u672a\u77e5"}</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-zinc-600">{"\u6700\u5927\u5355\u4e00\u6301\u4ed3 symbol\uff08\u53ef\u9009\uff09"}</span>
              <input type="text" value={topHoldingSymbol}
                onChange={(e) => { setTopHoldingSymbol(e.target.value); setAnalysisEnabled(false); }}
                className={inputClass} placeholder="BTC" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-zinc-600">{"\u6700\u5927\u5355\u4e00\u6301\u4ed3\u5360\u6bd4 %\uff08\u53ef\u9009\uff09"}</span>
              <input type="number" min={0} max={100} value={topHoldingPercent}
                onChange={(e) => { setTopHoldingPercent(e.target.value); setAnalysisEnabled(false); }}
                className={inputClass} />
            </label>
          </div>

          <p className={`text-xs ${sumMismatch ? "text-amber-800" : "text-zinc-500"}`}>
            {"\u56db\u7c7b\u6838\u5fc3\u4ed3\u4f4d\u5408\u8ba1\uff1a"}{coreSum.toFixed(0)}%
            {sumMismatch
              ? " \u2014 \u4e0e 100% \u504f\u5dee\u8f83\u5927\uff0c\u8bf7\u68c0\u67e5\u5f55\u5165\uff1b\u4ecd\u53ef\u67e5\u770b\u5206\u6790\u7ed3\u679c\u3002"
              : " \u2014 \u4e0e 100% \u63a5\u8fd1\u3002"}
          </p>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600">{"\u5907\u6ce8\uff08\u53ef\u9009\uff09"}</span>
            <textarea value={note} rows={2}
              onChange={(e) => { setNote(e.target.value); setAnalysisEnabled(false); }}
              className={inputClass} />
          </label>
        </section>

        <section className="rounded-md border border-zinc-200 bg-white p-3">
          <p className="text-xs font-semibold text-zinc-500">{"\u7cfb\u7edf\u53c2\u8003\u6846\u67b6\uff08\u4eca\u65e5\uff09"}</p>
          <dl className="mt-2 grid gap-1 text-xs text-zinc-700 sm:grid-cols-2">
            <div><dt className="text-zinc-500">{"\u98ce\u9669\u753b\u50cf"}</dt>
              <dd>{formatUserRiskProfile(positionAdviceSnapshot.riskProfile)}</dd></div>
            <div><dt className="text-zinc-500">{"\u5e02\u573a\u73af\u5883"}</dt>
              <dd>{formatMarketRegime(positionAdviceSnapshot.marketRegime)}</dd></div>
            <div><dt className="text-zinc-500">{"BTC \u5468\u671f"}</dt>
              <dd>{formatBtcCycleStage(positionAdviceSnapshot.btcCycleStage)}</dd></div>
            <div><dt className="text-zinc-500">{"BTC/ETH \u53c2\u8003"}</dt>
              <dd className="font-mono">{positionAdviceSnapshot.btcEthAllocation}</dd></div>
            <div><dt className="text-zinc-500">{"\u7a33\u5b9a\u5e01\u53c2\u8003"}</dt>
              <dd className="font-mono">{positionAdviceSnapshot.stablecoinAllocation}</dd></div>
            <div><dt className="text-zinc-500">{"Alpha \u53c2\u8003"}</dt>
              <dd className="font-mono">{positionAdviceSnapshot.alphaAllocation}</dd></div>
            <div><dt className="text-zinc-500">{"\u9ad8\u98ce\u9669\u70ed\u70b9\u53c2\u8003"}</dt>
              <dd className="font-mono">{positionAdviceSnapshot.highRiskHotspotAllocation}</dd></div>
            {strongestDirection?.trim() ? (
              <div className="sm:col-span-2"><dt className="text-zinc-500">{"\u4eca\u65e5\u6700\u5f3a\u65b9\u5411"}</dt>
                <dd>{strongestDirection}</dd></div>
            ) : null}
          </dl>
        </section>

        {compareResult ? (
          <>
            <section className="rounded-md border border-violet-200 bg-violet-50 p-3">
              <p className="text-xs font-semibold text-violet-800">{"\u603b\u4f53\u7ed3\u8bba"}</p>
              <p className="mt-1 text-sm leading-6 text-violet-950">{compareResult.conclusion}</p>
              <p className="mt-2 text-xs text-violet-900/90">
                {alignmentLabel(compareResult.strongestDirectionAlignment)}
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {"\u5b9e\u9645\u4ed3\u4f4d vs \u7cfb\u7edf\u53c2\u8003"}
              </p>
              <ul className="flex flex-col gap-2">
                {compareResult.comparisons.map((row) => (
                  <li key={row.category}
                    className={`rounded-md border px-3 py-2 text-sm ${statusTone(row.status)}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium">{categoryDisplayName(row.category)}</span>
                      <span className="text-xs font-semibold">{statusLabel(row.status)}</span>
                    </div>
                    <p className="mt-1 font-mono text-xs">
                      {"\u5b9e\u9645 "}{row.actualPercent}% {"\u00b7 \u53c2\u8003 "}{row.referenceRangeLabel}
                    </p>
                    <p className="mt-1 text-xs leading-5 opacity-90">{row.explanation}</p>
                  </li>
                ))}
              </ul>
            </section>

            {compareResult.mismatches.length > 0 ? (
              <section className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  {"\u4e0d\u59a5\u4e4b\u5904"}
                </p>
                <ul className="flex flex-col gap-1.5">
                  {compareResult.mismatches.map((item) => (
                    <li key={item}
                      className="rounded-md border border-amber-100 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-950">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {compareResult.positionRecommendations.length > 0 ? (
              <section className="flex flex-col gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-800">
                    {LABEL_POSITION_RECOMMENDATIONS}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-zinc-600">
                    {LABEL_RECOMMENDATION_NOTE}
                  </p>
                </div>
                <ul className="flex flex-col gap-3">
                  {compareResult.positionRecommendations.map((rec) => (
                    <PositionRecommendationCard
                      key={rec.action}
                      recommendation={rec}
                    />
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
              <p className="text-xs font-semibold text-zinc-600">{"\u6570\u636e\u9650\u5236\u8bf4\u660e"}</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-xs leading-5 text-zinc-600">
                {compareResult.dataLimitations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            {compareResult.futureDataNeeds && compareResult.futureDataNeeds.length > 0 ? (
              <section className="rounded-md border border-dashed border-zinc-300 bg-white p-3">
                <p className="text-xs font-semibold text-zinc-600">
                  {"\u672a\u6765\u6570\u636e\u63a5\u5165\u80fd\u529b\uff08\u9884\u7559\uff09"}
                </p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-xs leading-5 text-zinc-500">
                  {compareResult.futureDataNeeds.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-zinc-500">
                  {"\u672a\u6765\u9636\u6bb5\u53ef\u5347\u7ea7\u4e3a\u771f\u5b9e\u6570\u636e + \u6a21\u578b\u5316\u5206\u6790\uff1b\u4ecd\u4e0d\u81ea\u52a8\u4ea4\u6613\u3001\u4e0d\u66ff\u60a8\u4e0b\u5355\u3002"}
                </p>
              </section>
            ) : null}
          </>
        ) : (
          <p className="text-sm text-zinc-500">
            {"\u5f55\u5165\u6216\u6821\u6b63\u6bd4\u4f8b\u540e\uff0c\u70b9\u51fb\u300c\u751f\u6210\u5bf9\u6bd4\u5206\u6790\u300d\u67e5\u770b\u504f\u5dee\u8bca\u65ad\u3002"}
          </p>
        )}
      </div>
    </details>
  );
}

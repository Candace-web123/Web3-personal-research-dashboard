"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  ActualPositionInput,
  PositionAdviceSnapshot,
  RiskTag
} from "@/data/types";
import {
  buildActualPositionCompareResult,
  sumCorePositionPercents
} from "@/lib/actual-position-compare";
import { PositionCompareResult } from "@/components/dashboard/position-compare-result";
import { PositionInputForm } from "@/components/dashboard/position-input-form";
import { SystemReferenceFrame } from "@/components/dashboard/system-reference-frame";

export type ActualPositionCompareCardProps = {
  positionAdviceSnapshot: PositionAdviceSnapshot;
  strongestDirection?: string;
  topRisks?: readonly RiskTag[];
};

type ConcentrationLevel = ActualPositionInput["concentrationLevel"];

const LABEL_TITLE = "实际仓位对比分析";
const LABEL_EXPAND = "（点击展开 · 手动录入 + 规则化对比）";

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

  const disableAnalysis = useCallback(() => {
    setAnalysisEnabled(false);
  }, []);

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
          上传截图仅本地预览；请手动录入比例后与系统参考框架对比。提供明确个人仓位建议，不自动交易、不替您下单。
        </p>
      </summary>

      <div className="flex flex-col gap-4 border-t border-zinc-200 p-4">
        <PositionInputForm
          previewUrl={previewUrl}
          hasUploaded={hasUploaded}
          onFileChange={handleFileChange}
          stablecoinCashPercent={stablecoinCashPercent}
          btcEthPercent={btcEthPercent}
          alphaPercent={alphaPercent}
          highRiskPercent={highRiskPercent}
          outsideUniversePercent={outsideUniversePercent}
          concentrationLevel={concentrationLevel}
          topHoldingSymbol={topHoldingSymbol}
          topHoldingPercent={topHoldingPercent}
          note={note}
          coreSum={coreSum}
          sumMismatch={sumMismatch}
          onStablecoinCashPercentChange={(value) => {
            setStablecoinCashPercent(value);
            disableAnalysis();
          }}
          onBtcEthPercentChange={(value) => {
            setBtcEthPercent(value);
            disableAnalysis();
          }}
          onAlphaPercentChange={(value) => {
            setAlphaPercent(value);
            disableAnalysis();
          }}
          onHighRiskPercentChange={(value) => {
            setHighRiskPercent(value);
            disableAnalysis();
          }}
          onOutsideUniversePercentChange={(value) => {
            setOutsideUniversePercent(value);
            disableAnalysis();
          }}
          onConcentrationLevelChange={(value) => {
            setConcentrationLevel(value);
            disableAnalysis();
          }}
          onTopHoldingSymbolChange={(value) => {
            setTopHoldingSymbol(value);
            disableAnalysis();
          }}
          onTopHoldingPercentChange={(value) => {
            setTopHoldingPercent(value);
            disableAnalysis();
          }}
          onNoteChange={(value) => {
            setNote(value);
            disableAnalysis();
          }}
          onRunAnalysis={runAnalysis}
        />

        <SystemReferenceFrame
          positionAdviceSnapshot={positionAdviceSnapshot}
          strongestDirection={strongestDirection}
        />

        <PositionCompareResult compareResult={compareResult} />
      </div>
    </details>
  );
}

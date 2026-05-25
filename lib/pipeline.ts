// 数据管道：原始 API 数据 → MarketStateInput → assessMarketState()
// 纯转换，不 fetch。脚本层获取数据后传入 buildMarketStateInput()。

import type { MarketStateInput, MarketStateResult } from "./market-state-engine";
import { assessMarketState } from "./market-state-engine";

export type RawMarketData = {
  btcPriceUsd: number | null;
  ethPriceUsd: number | null;
  btc200dMa: number | null;
  btc200dMaSlope: "up" | "flat" | "down" | null;
  ethBtcTrend: "up" | "flat" | "down" | null;
  total3BtcTrend: "up" | "flat" | "down" | null;
  etfFlowDirection: "inflow" | "flat" | "outflow" | null;
  stablecoinTrend: "up" | "flat" | "down" | null;
  fearGreed: number | null;
  avgFundingRate: number | null;
  oiChangeRate: number | null;
};

export type DataProvenance = Record<keyof MarketStateInput, "live" | "computed" | "mock">;

export type PipelineResult = {
  input: MarketStateInput;
  provenance: DataProvenance;
  assessment: MarketStateResult;
};

const DEFAULTS: MarketStateInput = {
  btcVs200dMa: 1.0,
  btc200dMaSlope: "flat",
  ethBtcTrend: "flat",
  total3BtcTrend: "flat",
  etfFlowDirection: "flat",
  stablecoinTrend: "flat",
  fearGreed: 50,
  avgFundingRate: 0.0001,
  oiChangeRate: 0,
};

export function buildMarketStateInput(raw: RawMarketData): PipelineResult {
  const input = { ...DEFAULTS };
  const prov: DataProvenance = {
    btcVs200dMa: "mock",
    btc200dMaSlope: "mock",
    ethBtcTrend: "mock",
    total3BtcTrend: "mock",
    etfFlowDirection: "mock",
    stablecoinTrend: "mock",
    fearGreed: "mock",
    avgFundingRate: "mock",
    oiChangeRate: "mock",
  };

  // computed: btcVs200dMa = btcPrice / 200D MA
  if (raw.btcPriceUsd != null && raw.btc200dMa != null && raw.btc200dMa > 0) {
    input.btcVs200dMa = raw.btcPriceUsd / raw.btc200dMa;
    prov.btcVs200dMa = "computed";
  }

  if (raw.btc200dMaSlope != null) { input.btc200dMaSlope = raw.btc200dMaSlope; prov.btc200dMaSlope = "live"; }
  if (raw.ethBtcTrend != null)     { input.ethBtcTrend = raw.ethBtcTrend;         prov.ethBtcTrend = "live"; }
  if (raw.total3BtcTrend != null)  { input.total3BtcTrend = raw.total3BtcTrend;   prov.total3BtcTrend = "live"; }
  if (raw.etfFlowDirection != null){ input.etfFlowDirection = raw.etfFlowDirection; prov.etfFlowDirection = "live"; }
  if (raw.stablecoinTrend != null) { input.stablecoinTrend = raw.stablecoinTrend; prov.stablecoinTrend = "live"; }
  if (raw.fearGreed != null)       { input.fearGreed = raw.fearGreed;             prov.fearGreed = "live"; }
  if (raw.avgFundingRate != null)  { input.avgFundingRate = raw.avgFundingRate;   prov.avgFundingRate = "live"; }
  if (raw.oiChangeRate != null)    { input.oiChangeRate = raw.oiChangeRate;       prov.oiChangeRate = "live"; }

  const assessment = assessMarketState(input);
  return { input, provenance: prov, assessment };
}

// 市场状态机 · 可执行引擎 — 7 状态 × 9 维度判定矩阵

export const MarketRegime = {
  StrongTrendBull: "StrongTrendBull",
  BtcSoloRally: "BtcSoloRally",
  AltRotation: "AltRotation",
  NeutralRange: "NeutralRange",
  Defensive: "Defensive",
  EuphoriaEnd: "EuphoriaEnd",
  BearMarketBounce: "BearMarketBounce",
} as const;
export type MarketRegime = (typeof MarketRegime)[keyof typeof MarketRegime];

export const REGIME_LABEL: Record<MarketRegime, string> = {
  StrongTrendBull: "强趋势牛市", BtcSoloRally: "BTC 独涨",
  AltRotation: "山寨轮动", NeutralRange: "中性震荡",
  Defensive: "防守市场", EuphoriaEnd: "狂热末期",
  BearMarketBounce: "熊市反弹",
};

export type Confidence = "high" | "medium" | "low";
export type MarketStateInput = {
  btcVs200dMa: number;        // >1 = BTC 在 200D MA 上方
  btc200dMaSlope: "up" | "flat" | "down";
  ethBtcTrend: "up" | "flat" | "down";
  total3BtcTrend: "up" | "flat" | "down";
  etfFlowDirection: "inflow" | "flat" | "outflow";
  stablecoinTrend: "up" | "flat" | "down";
  fearGreed: number;          // 0-100
  avgFundingRate: number;     // 小数，如 0.0005 = 0.05%
  oiChangeRate: number;       // 相对 30 日均值，>0 = 增长
};

export type ConditionResult = { label: string; required: boolean; hit: boolean };
export type MarketStateResult = {
  regime: MarketRegime;
  regimeLabel: string;
  confidence: Confidence;
  hitCount: number;
  scoreBreakdown: ConditionResult[];
  nextStateSignal: string;
};

type Cond = (d: MarketStateInput) => boolean;
interface StateConfig {
  required: { label: string; fn: Cond }[];
  optional: { label: string; fn: Cond }[];
  nextSignal: (d: MarketStateInput) => string;
}

const C = {
  btcAboveMA: (d: MarketStateInput) => d.btcVs200dMa > 1,
  maUp: (d: MarketStateInput) => d.btc200dMaSlope === "up",
  maFlat: (d: MarketStateInput) => d.btc200dMaSlope === "flat",
  maDown: (d: MarketStateInput) => d.btc200dMaSlope === "down",
  ethBtcDown: (d: MarketStateInput) => d.ethBtcTrend === "down",
  ethBtcUp: (d: MarketStateInput) => d.ethBtcTrend === "up",
  ethBtcFlat: (d: MarketStateInput) => d.ethBtcTrend === "flat",
  total3Up: (d: MarketStateInput) => d.total3BtcTrend === "up",
  total3Down: (d: MarketStateInput) => d.total3BtcTrend === "down",
  total3Flat: (d: MarketStateInput) => d.total3BtcTrend === "flat",
  etfIn: (d: MarketStateInput) => d.etfFlowDirection === "inflow",
  etfOut: (d: MarketStateInput) => d.etfFlowDirection === "outflow",
  etfFlat: (d: MarketStateInput) => d.etfFlowDirection === "flat",
  stableUp: (d: MarketStateInput) => d.stablecoinTrend === "up",
  stableDown: (d: MarketStateInput) => d.stablecoinTrend === "down",
  fg: (lo: number, hi: number) => (d: MarketStateInput) => d.fearGreed >= lo && d.fearGreed <= hi,
  fr: (max: number) => (d: MarketStateInput) => d.avgFundingRate < max,
  frNeg: (d: MarketStateInput) => d.avgFundingRate < -0.0003,
  frExtreme: (d: MarketStateInput) => d.avgFundingRate > 0.001,
  oiUp: (d: MarketStateInput) => d.oiChangeRate > 0 && d.oiChangeRate < 0.3,
  oiSpike: (d: MarketStateInput) => d.oiChangeRate > 0.3,
  oiDown: (d: MarketStateInput) => d.oiChangeRate < -0.1,
  oiFlat: (d: MarketStateInput) => Math.abs(d.oiChangeRate) < 0.1,
};

// 7-state scoring matrix
const STATES: Record<MarketRegime, StateConfig> = {
  [MarketRegime.StrongTrendBull]: {
    required: [
      { label: "BTC > 200D MA", fn: C.btcAboveMA },
      { label: "200D MA 斜率向上", fn: C.maUp },
      { label: "山寨未走弱", fn: (d) => !C.total3Down(d) },
    ],
    optional: [
      { label: "ETF 净流入", fn: C.etfIn },
      { label: "稳定币增长", fn: C.stableUp },
      { label: "恐惧贪婪 55-80", fn: C.fg(55, 80) },
      { label: "费率正常", fn: C.fr(0.0005) },
      { label: "OI 健康增长", fn: C.oiUp },
    ],
    nextSignal: (d) =>
      C.ethBtcDown(d) ? "ETH/BTC 走弱 → BTC 独涨"
        : d.fearGreed > 80 ? "情绪过热 → 警惕狂热末期"
        : "趋势健康，暂无转换信号",
  },
  [MarketRegime.BtcSoloRally]: {
    required: [
      { label: "BTC > 200D MA", fn: C.btcAboveMA },
      { label: "ETH/BTC 走弱", fn: C.ethBtcDown },
      { label: "山寨相对 BTC 走弱", fn: C.total3Down },
    ],
    optional: [
      { label: "ETF 净流入", fn: C.etfIn },
      { label: "山寨 OI 下降", fn: (d) => d.oiChangeRate < 0 },
      { label: "恐惧贪婪 > 60", fn: C.fg(60, 100) },
      { label: "MA 未走弱", fn: (d) => !C.maDown(d) },
    ],
    nextSignal: (d) =>
      C.ethBtcUp(d) ? "ETH/BTC 企稳 → 山寨轮动"
        : C.maDown(d) ? "BTC 走弱 → 防守市场"
        : "BTC 独涨延续，山寨观望",
  },
  [MarketRegime.AltRotation]: {
    required: [
      { label: "BTC 稳定或缓涨", fn: (d) => d.btcVs200dMa > 0.95 && !C.maDown(d) },
      { label: "山寨跑赢 BTC", fn: C.total3Up },
    ],
    optional: [
      { label: "ETH/BTC 上升", fn: C.ethBtcUp },
      { label: "OI 增长 (非极端)", fn: (d) => d.oiChangeRate > 0 && d.oiChangeRate < 0.4 },
      { label: "恐惧贪婪 50-80", fn: C.fg(50, 80) },
      { label: "费率 < 0.10%", fn: C.fr(0.001) },
      { label: "ETF 未流出", fn: (d) => !C.etfOut(d) },
    ],
    nextSignal: (d) =>
      d.fearGreed > 85 || C.frExtreme(d) ? "情绪+费率极端 → 狂热末期"
        : C.total3Flat(d) ? "山寨动能减弱 → 中性震荡"
        : "轮动健康，暂无转换信号",
  },
  [MarketRegime.NeutralRange]: {
    required: [
      { label: "BTC 在 MA ±15% 区间", fn: (d) => d.btcVs200dMa >= 0.85 },
      { label: "MA 方向平坦", fn: C.maFlat },
    ],
    optional: [
      { label: "ETH/BTC 横盘", fn: C.ethBtcFlat },
      { label: "TOTAL3 横盘", fn: C.total3Flat },
      { label: "ETF 流出入交替", fn: C.etfFlat },
      { label: "恐惧贪婪 40-60", fn: C.fg(40, 60) },
      { label: "费率 ≈ 0", fn: (d) => Math.abs(d.avgFundingRate) < 0.0003 },
      { label: "OI 横盘", fn: C.oiFlat },
    ],
    nextSignal: (d) =>
      d.btcVs200dMa < 0.85 ? "跌破区间下沿 → 防守市场"
        : C.maUp(d) ? "MA 转正 → 强趋势牛市"
        : "方向待选择，继续观察",
  },
  [MarketRegime.Defensive]: {
    required: [
      { label: "BTC 趋势向下", fn: (d) => d.btcVs200dMa < 1 || C.maDown(d) },
      { label: "山寨弱于 BTC", fn: C.total3Down },
    ],
    optional: [
      { label: "ETF 净流出", fn: C.etfOut },
      { label: "稳定币流出", fn: C.stableDown },
      { label: "恐惧贪婪 < 35", fn: C.fg(0, 34) },
      { label: "费率转负", fn: C.frNeg },
      { label: "OI 去杠杆", fn: C.oiDown },
    ],
    nextSignal: (d) =>
      C.btcAboveMA(d) && !C.maDown(d) ? "BTC 站上 MA → 中性震荡"
        : d.fearGreed < 25 && d.oiChangeRate < -0.3 ? "恐慌加速 → 可能反弹"
        : "防守延续，等待底部信号",
  },
  [MarketRegime.EuphoriaEnd]: {
    required: [
      { label: "恐惧贪婪 > 85", fn: C.fg(85, 100) },
      { label: "费率极端 (>0.1%)", fn: C.frExtreme },
      { label: "OI 异常增长", fn: C.oiSpike },
    ],
    optional: [
      { label: "BTC 加速偏离 MA", fn: (d) => d.btcVs200dMa > 1.5 },
      { label: "ETF 流入减速", fn: (d) => !C.etfIn(d) },
      { label: "稳定币跟不上", fn: (d) => !C.stableUp(d) },
    ],
    nextSignal: () => "风险极高，随时可能急跌。建议逐步减仓",
  },
  [MarketRegime.BearMarketBounce]: {
    required: [
      { label: "BTC < 200D MA", fn: (d) => !C.btcAboveMA(d) },
      { label: "MA 未转上", fn: (d) => C.maFlat(d) || C.maDown(d) },
      { label: "山寨超跌反弹", fn: (d) => C.total3Up(d) || C.total3Flat(d) },
    ],
    optional: [
      { label: "ETF 短期流入", fn: (d) => C.etfIn(d) || C.etfFlat(d) },
      { label: "恐惧贪婪 < 50", fn: C.fg(0, 49) },
      { label: "费率短暂转正", fn: (d) => d.avgFundingRate > 0 },
      { label: "稳定币未流入", fn: (d) => !C.stableUp(d) },
    ],
    nextSignal: (d) =>
      C.btcAboveMA(d) && C.maUp(d) ? "BTC 突破 MA → 可能反转"
        : "反弹大概率失败。不追。",
  },
};

export function assessMarketState(input: MarketStateInput): MarketStateResult {
  const scored: { regime: MarketRegime; hitCount: number; breakdown: ConditionResult[] }[] = [];

  for (const [regime, cfg] of Object.entries(STATES) as [MarketRegime, StateConfig][]) {
    const breakdown: ConditionResult[] = [];
    let reqOK = true;

    for (const c of cfg.required) {
      const hit = c.fn(input);
      breakdown.push({ label: c.label, required: true, hit });
      if (!hit) reqOK = false;
    }
    for (const c of cfg.optional) {
      breakdown.push({ label: c.label, required: false, hit: c.fn(input) });
    }

    if (reqOK) scored.push({ regime, hitCount: breakdown.filter((b) => b.hit).length, breakdown });
  }

  // Fallback: no state matched → default to NeutralRange
  if (scored.length === 0) {
    return {
      regime: MarketRegime.NeutralRange,
      regimeLabel: REGIME_LABEL[MarketRegime.NeutralRange],
      confidence: "low",
      hitCount: 0,
      scoreBreakdown: [],
      nextStateSignal: "无法判定市场状态，默认中性震荡。建议以观望为主。",
    };
  }

  scored.sort((a, b) => b.hitCount - a.hitCount);
  const best = scored[0];
  const second = scored[1];

  let confidence: Confidence;
  if (best.hitCount >= 6 && (!second || best.hitCount - second.hitCount >= 2)) {
    confidence = "high";
  } else if (best.hitCount >= 4) {
    confidence = "medium";
  } else {
    confidence = "low";
  }

  return {
    regime: best.regime,
    regimeLabel: REGIME_LABEL[best.regime],
    confidence,
    hitCount: best.hitCount,
    scoreBreakdown: best.breakdown,
    nextStateSignal: STATES[best.regime].nextSignal(input),
  };
}

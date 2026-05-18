import type { BtcCycleSnapshot } from "./types";
import { BtcCycleStage } from "./types";

/**
 * V1.2 BTC 周期卡快照（静态 mock）。
 * 仅供首页周期卡消费；不接链上 / 行情 API，数值为示意占位。
 */
export const BTC_CYCLE_SNAPSHOT: BtcCycleSnapshot = {
  asOf: "2026-05-18",
  priceUsd: "$94,180",
  cycleStage: BtcCycleStage.MidUptrend,
  mvrv: "1.85（中性偏多，未进入典型过热区间）",
  nupl: "0.42（市场整体仍处盈利，情绪偏乐观但未极端）",
  puellMultiple: "1.12（矿工收入略高于均值，未见典型顶部信号）",
  piCycleSignal: "未触发（长短均线距离仍在安全区间）",
  twoHundredWeekMa: "$58,400（现价高于长期均线，趋势结构仍偏多）",
  fearGreedIndex: "62 / 贪婪（偏高但未达历史极端）",
  etfFlowSummary: "近 5 日现货 ETF 净流入约 +$1.2B，节奏温和，未见单日异常放量",
  macroLiquiditySummary:
    "DXY 小幅回落、10Y 收益率震荡；降息预期未明显升温，宏观对风险资产偏中性",
  currentJudgement:
    "链上与情绪指标整体支持「上涨中期」框架：趋势未破坏，但部分指标已离开低位舒适区，需警惕追高与杠杆堆积。",
  btcActionBias: "持有为主，少量观察 Alpha；新增仓位宜分批、控制节奏",
  supportsAltAlphaObservation: true,
  riskNotes: [
    "恐惧贪婪指数已处贪婪区，短线波动可能放大",
    "若 ETF 流入明显放缓且价格跌破关键均线，需下调风险偏好",
    "山寨 Alpha 仅作观察，不等同于买入清单；仓位需服从 BTC 周期锚点"
  ]
};

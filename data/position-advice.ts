import type { PositionAdviceSnapshot } from "./types";
import { BtcCycleStage, MarketRegime, UserRiskProfile } from "./types";

/**
 * V1.2 今日仓位建议快照（静态 mock）。
 * 保守型 + 中性轮动环境；占比区间对齐 PRD 11.4 保守型表。
 * `asOf` 与 BTC / 市场环境快照一致。
 */
export const POSITION_ADVICE_SNAPSHOT: PositionAdviceSnapshot = {
  asOf: "2026-05-18",
  riskProfile: UserRiskProfile.Conservative,
  marketRegime: MarketRegime.NeutralRotation,
  btcCycleStage: BtcCycleStage.MidUptrend,
  btcEthAllocation: "40-60%",
  stablecoinAllocation: "30-50%",
  alphaAllocation: "3-8%",
  highRiskHotspotAllocation: "0-2%",
  suitableToAddPosition: false,
  observationOnly: true,
  deepDiveProjects: ["Hyperliquid", "Pendle", "Ondo Finance"],
  doNotChase: [
    "Worldcoin（WLD）：监管与解锁压力大，数据未验证",
    "短期 24h 涨幅 >10% 且无量价配合的热点币",
    "仅叙事驱动、链上收入未改善的 RWA 跟风标的",
    "Ethena（ENA）代币：与 B 层 USDe 流动性指标勿混为一谈，不宜追涨"
  ],
  rationale: [
    "市场环境为中性轮动（总分 +2）：可跟踪赛道与异动，不宜全面 risk-on 或重仓山寨",
    "BTC 处于上涨中期：核心 BTC/ETH 仓以持有为主，新增仓位宜分批、控制节奏",
    "Alpha 观察池以 B/C 级为主，仅保留 3-8% 观察仓；单个 Alpha 不宜过大",
    "今日以复盘与深挖为主，重点验证 Hyperliquid / Pendle / Ondo 的链上数据是否延续"
  ],
  balancedAllocation: {
    btcEth: "35-55%",
    stablecoin: "30-45%",
    alpha: "5-15%",
    highRiskHotspot: "0-3%"
  },
  researchConclusion:
    "否（不建议新增仓位）：市场环境为中性轮动，BTC 上涨中期但恐惧贪婪偏高，以观察与验证为主。",
  addPositionAdvice: "否，当前参考框架为防守 / 观察模式",
  increaseExposureConditions: [
    "BTC 链上风险指标回落至 NUPL < 0.3 且大额转账 P0 解除",
    "稳定币流动性 7D 增幅 > 5% 且 ETF 流入连续改善",
    "市场环境评分连续 2 日改善且无新增 P1 风险"
  ],
  decreaseExposureConditions: [
    "新增 P0 级风险或宏观流动性急剧收缩",
    "ETF / 稳定币流入信号转弱且恐惧贪婪进入极端区",
    "Alpha 传导或链下尽调出现高风险项"
  ]
};

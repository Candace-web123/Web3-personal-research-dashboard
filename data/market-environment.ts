import type { MarketEnvironmentSnapshot } from "./types";
import { MarketRegime } from "./types";

/**
 * V1.2 每日市场环境评分卡快照（静态 mock）。
 * 五维分按 PRD 5.2 手工标注；总分 = 五维之和，regime 对齐 PRD 5.3。
 */
export const MARKET_ENVIRONMENT_SNAPSHOT: MarketEnvironmentSnapshot = {
  asOf: "2026-05-18",
  stablecoinsScore: 1,
  defiTvlScore: 0,
  dexVolumeScore: 1,
  etfDatScore: 0,
  macroPolicyScore: 0,
  totalScore: 2,
  regime: MarketRegime.NeutralRotation,
  conclusion:
    "场内流动性与交易活跃度尚可，但 TVL 扩张偏慢、ETF 流入节奏温和；宏观未明显转松。整体偏「中性轮动」：可跟踪强势赛道与异动，不宜无脑追高或大幅加仓高风险山寨。",
  ethAndMainstreamSummary:
    "ETH 与 SOL 等 A 层主流近 7 日相对 BTC 略强，轮动迹象存在但未形成全面 risk-on；适合观察结构性机会，而非全面铺开仓位。",
  stablecoinLiquiditySummary:
    "稳定币总市值近 7 日小幅回升，USDT 占比稳定；场内现金池水位温和改善，尚不足以定义为强进攻级别的流动性扩张。",
  topRisks: [
    {
      priority: "P1",
      code: "MACRO_NEUTRAL",
      message: "宏观政策维度中性：降息预期未升温，风险资产上行空间可能受限",
      category: "macro"
    },
    {
      priority: "P2",
      code: "TVL_FLAT",
      message: "DeFi TVL 7D 变化接近持平，链上活动扩张信号不强",
      category: "defi"
    },
    {
      priority: "P2",
      code: "ETF_MILD",
      message: "BTC ETF 近 5 日净流入温和，未见持续放量，需跟踪后续节奏",
      category: "flows"
    }
  ]
};

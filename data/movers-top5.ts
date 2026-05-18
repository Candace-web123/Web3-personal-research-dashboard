import { UniverseAssetStatus } from "./types";

/** 当日主流币异动 Top 5 单条记录（展示字段，与 `WATCHLIST_UNIVERSE` 通过 assetId 关联） */
export type MoverTop5Entry = {
  assetId: string;
  symbol: string;
  name: string;
  /** 24h 涨跌幅（百分比，如 6.2 表示 +6.2%） */
  priceChange24h: number;
  volumeNote: string;
  moverReason: string;
  status: UniverseAssetStatus;
  /** 7d 涨跌幅（百分比，可选） */
  priceChange7d?: number;
  riskNote?: string;
};

/**
 * 当日主流币异动 Top 5（mock）。
 * 基础分层 / 链 / 赛道见 `WATCHLIST_UNIVERSE`。
 */
export const MOVERS_TOP5: MoverTop5Entry[] = [
  {
    assetId: "wl-sol",
    symbol: "SOL",
    name: "Solana",
    priceChange24h: 6.8,
    priceChange7d: 12.4,
    volumeNote: "现货 + 永续成交量较 7 日均值 +38%",
    moverReason: "生态 DEX 与 meme 交易活跃，资金回流 L1",
    status: UniverseAssetStatus.Moving
  },
  {
    assetId: "wl-link",
    symbol: "LINK",
    name: "Chainlink",
    priceChange24h: 4.2,
    priceChange7d: 9.1,
    volumeNote: "链上转账与现货成交量同步放大",
    moverReason: "RWA 合作预期升温，预言机需求叙事强化",
    status: UniverseAssetStatus.Moving,
    riskNote: "涨幅部分由叙事驱动，待验证协议收入"
  },
  {
    assetId: "wl-ondo",
    symbol: "ONDO",
    name: "Ondo Finance",
    priceChange24h: 7.5,
    priceChange7d: 15.3,
    volumeNote: "CEX 成交量创近两周新高",
    moverReason: "美债代币化叙事 + 机构 RWA 新闻催化",
    status: UniverseAssetStatus.Moving
  },
  {
    assetId: "wl-ena",
    symbol: "ENA",
    name: "Ethena",
    priceChange24h: 5.1,
    priceChange7d: -2.4,
    volumeNote: "永续资金费率偏正，衍生品持仓上升",
    moverReason: "USDe 供给扩张与收益产品讨论度提升",
    status: UniverseAssetStatus.Moving,
    riskNote: "与 B 层 USDe 流动性需交叉验证，勿混为同一标的"
  },
  {
    assetId: "wl-pendle",
    symbol: "PENDLE",
    name: "Pendle",
    priceChange24h: 8.3,
    priceChange7d: 18.6,
    volumeNote: "YT/PT 池 TVL 单日净流入居前",
    moverReason: "利率衍生品叙事 + 主流链上收益池扩容",
    status: UniverseAssetStatus.AlphaCandidate,
    riskNote: "已进入 Alpha 候选观察，尚未满足进池 3/8 条件"
  }
];

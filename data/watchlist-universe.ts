import type { WatchlistUniverseEntry } from "./types";
import { WatchlistTier } from "./types";

/**
 * V1.2 观察宇宙（约 30 币）— 仅基础币种信息。
 * 当日异动展示见 `data/movers-top5.ts`。
 */
export const WATCHLIST_UNIVERSE: WatchlistUniverseEntry[] = [
  // --- S：周期锚点 ---
  {
    id: "wl-btc",
    symbol: "BTC",
    name: "Bitcoin",
    tier: WatchlistTier.S,
    chain: "Bitcoin",
    sector: "Store of Value",
    notes: "周期锚点；每日必看"
  },

  // --- A：核心主流 ---
  {
    id: "wl-eth",
    symbol: "ETH",
    name: "Ethereum",
    tier: WatchlistTier.A,
    chain: "Ethereum",
    sector: "L1",
    notes: "主流风险资产代表"
  },
  {
    id: "wl-sol",
    symbol: "SOL",
    name: "Solana",
    tier: WatchlistTier.A,
    chain: "Solana",
    sector: "L1"
  },
  {
    id: "wl-bnb",
    symbol: "BNB",
    name: "BNB",
    tier: WatchlistTier.A,
    chain: "BNB Chain",
    sector: "Exchange / L1"
  },

  // --- B：稳定币 / 流动性（不参与 Alpha 评分）---
  {
    id: "wl-usdt",
    symbol: "USDT",
    name: "Tether",
    tier: WatchlistTier.B,
    chain: "Multi-chain",
    sector: "Stablecoin",
    excludeFromAlphaScoring: true,
    notes: "场内资金水位参考"
  },
  {
    id: "wl-usdc",
    symbol: "USDC",
    name: "USD Coin",
    tier: WatchlistTier.B,
    chain: "Multi-chain",
    sector: "Stablecoin",
    excludeFromAlphaScoring: true
  },
  {
    id: "wl-dai",
    symbol: "DAI",
    name: "Dai",
    tier: WatchlistTier.B,
    chain: "Ethereum",
    sector: "Stablecoin",
    excludeFromAlphaScoring: true
  },
  {
    id: "wl-usde",
    symbol: "USDe",
    name: "Ethena USDe",
    tier: WatchlistTier.B,
    chain: "Ethereum",
    sector: "Stablecoin",
    excludeFromAlphaScoring: true,
    notes: "合成美元流动性指标"
  },

  // --- C：主流板块 ---
  {
    id: "wl-link",
    symbol: "LINK",
    name: "Chainlink",
    tier: WatchlistTier.C,
    chain: "Ethereum",
    sector: "Oracle / RWA"
  },
  {
    id: "wl-avax",
    symbol: "AVAX",
    name: "Avalanche",
    tier: WatchlistTier.C,
    chain: "Avalanche",
    sector: "L1"
  },
  {
    id: "wl-sui",
    symbol: "SUI",
    name: "Sui",
    tier: WatchlistTier.C,
    chain: "Sui",
    sector: "L1"
  },
  {
    id: "wl-apt",
    symbol: "APT",
    name: "Aptos",
    tier: WatchlistTier.C,
    chain: "Aptos",
    sector: "L1"
  },
  {
    id: "wl-arb",
    symbol: "ARB",
    name: "Arbitrum",
    tier: WatchlistTier.C,
    chain: "Ethereum",
    sector: "L2"
  },
  {
    id: "wl-op",
    symbol: "OP",
    name: "Optimism",
    tier: WatchlistTier.C,
    chain: "Ethereum",
    sector: "L2"
  },
  {
    id: "wl-ton",
    symbol: "TON",
    name: "Toncoin",
    tier: WatchlistTier.C,
    chain: "TON",
    sector: "L1"
  },
  {
    id: "wl-xrp",
    symbol: "XRP",
    name: "XRP",
    tier: WatchlistTier.C,
    chain: "XRP Ledger",
    sector: "Payments"
  },
  {
    id: "wl-doge",
    symbol: "DOGE",
    name: "Dogecoin",
    tier: WatchlistTier.C,
    chain: "Dogecoin",
    sector: "Meme"
  },
  {
    id: "wl-inj",
    symbol: "INJ",
    name: "Injective",
    tier: WatchlistTier.C,
    chain: "Injective",
    sector: "DeFi / L1"
  },
  {
    id: "wl-atom",
    symbol: "ATOM",
    name: "Cosmos",
    tier: WatchlistTier.C,
    chain: "Cosmos",
    sector: "Interop"
  },
  {
    id: "wl-near",
    symbol: "NEAR",
    name: "NEAR Protocol",
    tier: WatchlistTier.C,
    chain: "NEAR",
    sector: "L1"
  },
  {
    id: "wl-pol",
    symbol: "POL",
    name: "Polygon",
    tier: WatchlistTier.C,
    chain: "Ethereum",
    sector: "L2"
  },
  {
    id: "wl-ltc",
    symbol: "LTC",
    name: "Litecoin",
    tier: WatchlistTier.C,
    chain: "Litecoin",
    sector: "Payments"
  },

  // --- D：热点 / Alpha 候选 ---
  {
    id: "wl-ondo",
    symbol: "ONDO",
    name: "Ondo Finance",
    tier: WatchlistTier.D,
    chain: "Ethereum",
    sector: "RWA"
  },
  {
    id: "wl-pendle",
    symbol: "PENDLE",
    name: "Pendle",
    tier: WatchlistTier.D,
    chain: "Ethereum",
    sector: "Yield"
  },
  {
    id: "wl-ena",
    symbol: "ENA",
    name: "Ethena",
    tier: WatchlistTier.D,
    chain: "Ethereum",
    sector: "Stablecoin / Derivatives"
  },
  {
    id: "wl-jup",
    symbol: "JUP",
    name: "Jupiter",
    tier: WatchlistTier.D,
    chain: "Solana",
    sector: "DEX"
  },
  {
    id: "wl-aave",
    symbol: "AAVE",
    name: "Aave",
    tier: WatchlistTier.D,
    chain: "Ethereum",
    sector: "Lending"
  },
  {
    id: "wl-uni",
    symbol: "UNI",
    name: "Uniswap",
    tier: WatchlistTier.D,
    chain: "Ethereum",
    sector: "DEX"
  },
  {
    id: "wl-hype",
    symbol: "HYPE",
    name: "Hyperliquid",
    tier: WatchlistTier.D,
    chain: "Hyperliquid L1",
    sector: "Perp DEX"
  },
  {
    id: "wl-wld",
    symbol: "WLD",
    name: "Worldcoin",
    tier: WatchlistTier.D,
    chain: "Ethereum",
    sector: "Identity / AI"
  }
];

// 用户持仓录入 · 个人编辑此文件即可
// currentPriceUsd 填 0 表示"自动从实时数据填充"，填具体数值则使用该值
// cashUsd = 闲置现金（USD）

import type { PortfolioSnapshot } from "@/lib/portfolio";

export const USER_PORTFOLIO: PortfolioSnapshot = {
  asOf: "2026-05-26",
  cashUsd: 25000,
  positions: [
    { asset: "Bitcoin", symbol: "BTC", amount: 0.5, costBasisUsd: 88000, currentPriceUsd: 0 },
    { asset: "Ethereum", symbol: "ETH", amount: 5, costBasisUsd: 2900, currentPriceUsd: 0 },
    { asset: "Solana", symbol: "SOL", amount: 30, costBasisUsd: 180, currentPriceUsd: 0 },
    { asset: "Chainlink", symbol: "LINK", amount: 200, costBasisUsd: 15, currentPriceUsd: 0 },
  ],
};

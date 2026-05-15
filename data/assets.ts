import type { Asset } from "./types";
import { ResearchStatus, RiskLevel } from "./types";

export const assets: Asset[] = [
  {
    id: "asset-btc",
    name: "Bitcoin",
    symbol: "BTC",
    sector: "Store of Value",
    ecosystem: "Bitcoin",
    researchStatus: ResearchStatus.ThesisFormed,
    riskLevel: RiskLevel.Low,
    confidenceScore: 85,
    thesis: "ETF 与机构持仓强化了 BTC 作为储备资产的角色。",
    nextAction: "跟踪 ETF 资金流",
    updatedAt: "2026-05-15"
  },
  {
    id: "asset-eth",
    name: "Ethereum",
    symbol: "ETH",
    sector: "L1",
    ecosystem: "Ethereum",
    researchStatus: ResearchStatus.Researching,
    riskLevel: RiskLevel.Medium,
    confidenceScore: 78,
    thesis: "L2 与质押收益结构决定 ETH 的中期需求侧叙事。",
    nextAction: "观察 L2 生态活跃度",
    updatedAt: "2026-05-15"
  },
  {
    id: "asset-sol",
    name: "Solana",
    symbol: "SOL",
    sector: "L1",
    ecosystem: "Solana",
    researchStatus: ResearchStatus.Researching,
    riskLevel: RiskLevel.Medium,
    confidenceScore: 72,
    thesis: "高吞吐与消费级应用密度是核心观察点。",
    nextAction: "对比链上活跃用户变化",
    updatedAt: "2026-05-14"
  },
  {
    id: "asset-link",
    name: "Chainlink",
    symbol: "LINK",
    sector: "Oracle / RWA",
    ecosystem: "Ethereum",
    researchStatus: ResearchStatus.Watchlist,
    riskLevel: RiskLevel.Medium,
    confidenceScore: 65,
    thesis: "预言机基础设施与 RWA 合作进展决定催化剂密度。",
    nextAction: "跟踪 RWA 合作进展",
    updatedAt: "2026-05-13"
  },
  {
    id: "asset-rndr",
    name: "Render",
    symbol: "RNDR",
    sector: "AI / DePIN",
    ecosystem: "Ethereum",
    researchStatus: ResearchStatus.Researching,
    riskLevel: RiskLevel.High,
    confidenceScore: 61,
    thesis: "GPU 算力叙事强，需验证需求侧是否可持续。",
    nextAction: "验证真实需求增长",
    updatedAt: "2026-05-12"
  },
  {
    id: "asset-arb",
    name: "Arbitrum",
    symbol: "ARB",
    sector: "L2",
    ecosystem: "Ethereum",
    researchStatus: ResearchStatus.Paused,
    riskLevel: RiskLevel.Medium,
    confidenceScore: 55,
    thesis: "代币价值捕获与排序收入的关系仍不清晰。",
    nextAction: "观察代币价值捕获问题",
    updatedAt: "2026-05-10"
  },
  {
    id: "asset-ondo",
    name: "Ondo",
    symbol: "ONDO",
    sector: "RWA",
    ecosystem: "Ethereum",
    researchStatus: ResearchStatus.Watchlist,
    riskLevel: RiskLevel.High,
    confidenceScore: 58,
    thesis: "RWA 收益与合规路径是主要不确定性。",
    nextAction: "分析监管和收益来源",
    updatedAt: "2026-05-11"
  },
  {
    id: "asset-tao",
    name: "Bittensor",
    symbol: "TAO",
    sector: "AI",
    ecosystem: "Bittensor",
    researchStatus: ResearchStatus.Researching,
    riskLevel: RiskLevel.High,
    confidenceScore: 63,
    thesis: "子网激励与真实付费需求需交叉验证。",
    nextAction: "验证网络收入和估值逻辑",
    updatedAt: "2026-05-14"
  }
];

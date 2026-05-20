import type { RiskTag } from "./types";

/**
 * 首页风险预警系统 mock（墨刀 V1.2 详情卡结构）。
 * 与决策卡聚合风险可并存：本列表用于右侧详情展示。
 */
export const RISK_WARNINGS_DASHBOARD: RiskTag[] = [
  {
    priority: "P0",
    code: "BTC_WHALE_TRANSFER",
    message: "BTC 链上大额转账激增（>1K BTC）",
    category: "on-chain",
    assetLabel: "BTC",
    monitoringFrequency: "每 4 小时",
    whyImportant: "大额转账往往先于价格波动，可能反映托管流出或场外对冲布局。",
    positionImpact: "降低 Alpha 风险暴露，将现金缓冲提高至 50%+，暂不新增仓位。"
  },
  {
    priority: "P1",
    code: "USDT_PREMIUM",
    message: "USDT 溢价转负（-0.12%）",
    category: "liquidity",
    assetLabel: "USDT",
    monitoringFrequency: "每日",
    whyImportant: "负溢价可能反映离岸流动性紧张或套利窗口异常。",
    positionImpact: "维持稳定币缓冲，避免高杠杆热点；观察稳定币流向是否修复。"
  },
  {
    priority: "P1",
    code: "ETH_GAS_LOW",
    message: "ETH Gas 持续偏低（< 5 Gwei）",
    category: "activity",
    assetLabel: "ETH",
    monitoringFrequency: "每日",
    whyImportant: "链上活跃度偏弱时，生态叙事修复需要更长时间验证。",
    positionImpact: "ETH 生态仓位以观察为主，等待 DEX 活跃与汇率信号确认。"
  },
  {
    priority: "P2",
    code: "L2_TVL_OUTFLOW",
    message: "部分 L2 TVL 流出（Arbitrum -3.2%）",
    category: "defi",
    assetLabel: "ARB 生态",
    monitoringFrequency: "每周",
    whyImportant: "TVL 流出可能反映激励结束或资金轮动，不等于立即看空。",
    positionImpact: "相关 L2 暴露维持观察权重，不单独因单日数据加仓。"
  },
  {
    priority: "P2",
    code: "MEME_SENTIMENT",
    message: "Meme 情绪指标处于高位",
    category: "sentiment",
    assetLabel: "Meme 板块",
    monitoringFrequency: "每日",
    whyImportant: "情绪高位时回撤速度快，热点持续性往往弱于叙事。",
    positionImpact: "高风险热点维持参考区间下限，避免追涨。"
  }
];

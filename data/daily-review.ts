import type { DailyReviewSnapshot } from "./types";

/**
 * V1.2 每日复盘 mock（PRD 24.3）。
 * 仅供观察与验证流程训练；不接 API，不构成投资建议。
 */
export const DAILY_REVIEW_SNAPSHOT: DailyReviewSnapshot = {
  asOf: "2026-05-18",
  decisionSummary:
    "今日维持「中性轮动 + 持有为主」框架：BTC 上涨中期未破坏，但恐惧贪婪偏高；未因异动叙事上调进攻节奏，以观察与验证为主。",
  whatWasRight: [
    "先核对 BTC 周期与市场环境后再看 Alpha，避免直接追异动",
    "将 Perps 链上成交走强与代币传导分开记录，未把协议强等同于代币强",
    "对 DeFi TVL 口径冲突保持谨慎，未把延迟数据当作确认信号"
  ],
  whatWasWrong: [
    "对 SOL 生态异动估计偏乐观，未充分对照竞争 DEX 份额变化",
    "部分 Alpha 项目的链下尽调仍停留在「部分确认」，却已在心里提前加权",
    "收盘前未再次核对数据时间戳，存在用午间 mock 推断全日结论的风险"
  ],
  signalsToTrackTomorrow: [
    "BTC 现货 ETF 近 5 日净流入是否延续温和节奏",
    "Hyperliquid 周度协议收入与回购相关公告是否落地",
    "市场环境卡 DeFi TVL 主备源口径差异是否人工确认"
  ],
  riskFollowUps: [
    "Ethena 储备与对冲透明度周报（合成稳定币机制风险）",
    "Worldcoin 监管与链上活跃背离是否持续",
    "恐惧贪婪处于贪婪区时的杠杆与清算风险"
  ],
  tomorrowPositionConditions: [
    {
      title: "ETH/BTC 修复",
      tone: "green",
      body: "若 ETH/BTC 汇率回升 + DEX 活跃回升 → 提高 ETH 生态观察优先级"
    },
    {
      title: "P0 持续",
      tone: "amber",
      body: "若链上大额转账 P0 风险持续 → 维持防守仓位，不新增风险暴露"
    },
    {
      title: "Alpha 验证",
      tone: "slate",
      body: "若 Alpha 代币传导未验证 → 不扩大 Alpha 暴露，仅维持现有观察池"
    },
    {
      title: "强链共振",
      tone: "blue",
      body: "若强链 / 强赛道共振延续 2–3 天 → 进入重点深挖，考虑适度上调"
    },
    {
      title: "流动性转弱",
      tone: "red",
      body: "若稳定币流动性继续转弱 → 提高现金缓冲至 55%+，暂不支持新仓位"
    }
  ],
  notes:
    "今日未做新增仓位操作；复盘仅记录判断过程。手动覆盖关键数据功能留待后续迭代（PRD 21.7）。"
};

import type { AlphaPoolEntry } from "./types";
import { AlphaLifecycleState } from "./types";

/**
 * V1.2 Alpha 观察池（静态 mock，共 10 条）。
 * 首页展示通常仅取前 10 条；不接 API / LLM，非投资建议。
 */
export const ALPHA_POOL: AlphaPoolEntry[] = [
  {
    id: "alpha-pendle",
    universeAssetId: "wl-pendle",
    projectName: "Pendle",
    token: "PENDLE",
    chain: "Ethereum",
    sector: "Yield",
    thesisLine:
      "利率衍生品池 TVL 与 YT/PT 成交量同步走强，赛道叙事与链上使用数据初步共振",
    coreMoveSummary:
      "近 7 日主要池净流入居前，永续资金费率偏正；价格涨幅部分领先于 TVL 扩张节奏",
    tokenTransmission: "使用型 + 费用捕获：协议收入增长与质押/治理预期相关，传导中等偏强",
    valuationSupplySummary:
      "FDV 相对协议收入仍偏高；30 天解锁占比可控，需跟踪 90 天大额解锁日历",
    catalyst: "新链部署池上线、与主流 LST 合作扩展",
    maxRisk: "收益率产品对宏观利率敏感；若利率预期反转，叙事与资金或快速降温",
    grade: "B",
    lifecycle: AlphaLifecycleState.Watching,
    nextVerification:
      "确认 TVL 净流入是否连续 3 日为正，且费用收入 7D 环比不低于 +15%",
    holderNotes: "已从异动 Top5 升级为 Alpha 候选，尚未满足进池 3/8 硬条件",
    risks: [
      {
        priority: "P1",
        code: "VALUATION_STRETCH",
        message: "价格涨幅部分由叙事驱动，需验证协议收入是否跟上",
        category: "valuation",
        relatedAssetId: "wl-pendle"
      }
    ]
  },
  {
    id: "alpha-hype",
    universeAssetId: "wl-hype",
    projectName: "Hyperliquid",
    token: "HYPE",
    chain: "Hyperliquid L1",
    sector: "Perp DEX",
    thesisLine:
      "永续成交量与 OI 维持高位，链上 perp 赛道资金集中度提升，协议收入可见",
    coreMoveSummary: "24h 永续成交量较 30 日均值 +22%，费率收入稳定",
    tokenTransmission: "费用回购型预期为主，需持续验证收入分配与回购执行",
    valuationSupplySummary: "流通占比仍低，长期解锁曲线需每周核对",
    catalyst: "新交易对上线、机构做市合作传闻（待核实）",
    maxRisk: "竞争 perp 平台补贴战；单一链依赖度高",
    grade: "A",
    lifecycle: AlphaLifecycleState.FocusTracking,
    nextVerification: "跟踪周度协议收入与 HYPE 回购/销毁公告是否落地",
    risks: [
      {
        priority: "P1",
        code: "UNLOCK_SCHEDULE",
        message: "未来 90 天解锁量占流通比例需每周更新",
        category: "supply",
        relatedAssetId: "wl-hype"
      }
    ]
  },
  {
    id: "alpha-ondo",
    universeAssetId: "wl-ondo",
    projectName: "Ondo Finance",
    token: "ONDO",
    chain: "Ethereum",
    sector: "RWA",
    thesisLine: "RWA 叙事升温 + 美债代币化产品讨论度上升，链上转账与成交量放大",
    coreMoveSummary: "CEX 成交量创近两周新高，社交热度与链上活跃不同步",
    tokenTransmission: "治理 + 生态预期型为主，现金流向代币传导仍偏弱",
    valuationSupplySummary: "Mcap/FDV 差距大；需区分协议 AUM 与代币流通市值",
    catalyst: "监管友好司法辖区合作、新产品池开放",
    maxRisk: "叙事驱动大于收入验证；监管口径变化",
    grade: "B",
    lifecycle: AlphaLifecycleState.Watching,
    nextVerification: "核实链上 RWA AUM 7D 变化是否与价格异动同向",
    risks: [
      {
        priority: "P2",
        code: "NARRATIVE_PREMIUM",
        message: "涨幅部分由 RWA 新闻催化，待验证持续性",
        category: "narrative",
        relatedAssetId: "wl-ondo"
      }
    ]
  },
  {
    id: "alpha-jup",
    universeAssetId: "wl-jup",
    projectName: "Jupiter",
    token: "JUP",
    chain: "Solana",
    sector: "DEX",
    thesisLine: "Solana 生态 DEX 聚合份额稳固，现货与 perp 路由量回升",
    coreMoveSummary: "7D 现货路由量 +18%，JUP 质押率小幅上升",
    tokenTransmission: "使用型：路由费与治理激励相关，传导中等",
    valuationSupplySummary: "大额解锁已过峰值阶段，关注团队与生态基金剩余释放",
    catalyst: "新 perp 产品迭代、LFG 类激励是否重启",
    maxRisk: "Solana 生态整体 beta 高；竞争 DEX 分流",
    grade: "B",
    lifecycle: AlphaLifecycleState.Watching,
    nextVerification: "对比 Raydium / Meteora 同期份额变化，确认是否结构性而非短期",
    risks: [
      {
        priority: "P2",
        code: "ECOSYSTEM_BETA",
        message: "表现高度依赖 SOL 生态活跃度",
        category: "chain",
        relatedAssetId: "wl-jup"
      }
    ]
  },
  {
    id: "alpha-aave",
    universeAssetId: "wl-aave",
    projectName: "Aave",
    token: "AAVE",
    chain: "Ethereum",
    sector: "Lending",
    thesisLine: "多链借贷 TVL 企稳，利率环境利于借贷需求边际改善",
    coreMoveSummary: "以太坊主网借贷利用率回升，费用 7D 环比 +9%",
    tokenTransmission: "治理 + 安全模块价值捕获，传导偏慢但路径清晰",
    valuationSupplySummary: "相对 DeFi 蓝筹估值不算极端；供给通胀温和",
    catalyst: "新市场上线、GHO 或其他稳定币模块数据",
    maxRisk: "宏观利率上行压制借贷需求；清算风险事件",
    grade: "B",
    lifecycle: AlphaLifecycleState.Watching,
    nextVerification: "确认 TVL 回升是否由真实借贷需求驱动而非激励挖矿",
    risks: [
      {
        priority: "P3",
        code: "MACRO_RATES",
        message: "利率预期变化可能压制借贷板块整体估值",
        category: "macro",
        relatedAssetId: "wl-aave"
      }
    ]
  },
  {
    id: "alpha-ena",
    universeAssetId: "wl-ena",
    projectName: "Ethena",
    token: "ENA",
    chain: "Ethereum",
    sector: "Stablecoin / Derivatives",
    thesisLine: "USDe 供给扩张与衍生品收益叙事并行，资金费率环境偏正",
    coreMoveSummary: "USDe 市值 7D +6%，永续 OI 上升；与 B 层 USDe 需交叉验证",
    tokenTransmission: "收益分享 + 治理预期；协议风险与代币波动耦合度高",
    valuationSupplySummary: "FDV 高；需持续跟踪对冲敞口与储备透明度",
    catalyst: "新链 USDe 部署、合作交易所上币",
    maxRisk: "对冲失效或监管对合成稳定币态度变化为一票否决级",
    grade: "C",
    lifecycle: AlphaLifecycleState.Watching,
    nextVerification: "核对官方储备与对冲比率周报，确认 USDe 脱锚风险指标",
    holderNotes: "勿与 B 层 USDe 流动性指标混为同一交易标的",
    risks: [
      {
        priority: "P0",
        code: "DEPEG_HEDGE",
        message: "合成稳定币机制风险需每日跟踪",
        category: "stablecoin",
        relatedAssetId: "wl-ena"
      }
    ]
  },
  {
    id: "alpha-link",
    universeAssetId: "wl-link",
    projectName: "Chainlink",
    token: "LINK",
    chain: "Ethereum",
    sector: "Oracle / RWA",
    thesisLine: "预言机需求随 RWA 与跨链消息增长，链上转账量同步放大",
    coreMoveSummary: "近 7 日涨幅 +4.2%，CCIP 相关新闻催化",
    tokenTransmission: "使用费 + 质押安全模块，传导路径较成熟",
    valuationSupplySummary: "蓝筹估值区间，解锁压力相对可控",
    catalyst: "新链 CCIP 集成、机构储备数据合作",
    maxRisk: "若 RWA 叙事降温，短期涨幅或快速回吐",
    grade: "B",
    lifecycle: AlphaLifecycleState.Watching,
    nextVerification: "验证 CCIP 消息量 7D 环比是否持续改善",
    risks: [
      {
        priority: "P2",
        code: "NARRATIVE_LINKED",
        message: "涨幅与 RWA 新闻耦合，需分离基本面与情绪",
        category: "narrative",
        relatedAssetId: "wl-link"
      }
    ]
  },
  {
    id: "alpha-inj",
    universeAssetId: "wl-inj",
    projectName: "Injective",
    token: "INJ",
    chain: "Injective",
    sector: "DeFi / L1",
    thesisLine: "Cosmos 生态 perp + DEX 模块活跃，链上费用收入边际改善",
    coreMoveSummary: "DEX 成交量 7D +14%，质押率稳定",
    tokenTransmission: "费用燃烧 + 质押收益，传导中等偏强",
    valuationSupplySummary: "通胀与解锁需对照质押收益率",
    catalyst: "新 perp 市场、机构做市计划",
    maxRisk: "Cosmos 生态资金轮动快，持续性待验证",
    grade: "C",
    lifecycle: AlphaLifecycleState.Watching,
    nextVerification: "对比 ATOM 生态资金是否同步流入，排除孤立行情",
    risks: [
      {
        priority: "P3",
        code: "ROTATION_RISK",
        message: "资金或从 Cosmos 轮动至其他 L1",
        category: "sector",
        relatedAssetId: "wl-inj"
      }
    ]
  },
  {
    id: "alpha-uni",
    universeAssetId: "wl-uni",
    projectName: "Uniswap",
    token: "UNI",
    chain: "Ethereum",
    sector: "DEX",
    thesisLine: "Uniswap v4 钩子生态预期仍在，以太坊 L2 路由量占比回升",
    coreMoveSummary: "L2 路由份额 +11% 7D，主网费用收入持平",
    tokenTransmission: "治理预期型为主，费用开关叙事反复，传导偏弱",
    valuationSupplySummary: "大量 UNI 仍在金库，潜在治理释放为长期供给压力",
    catalyst: "v4 生态里程碑、费用开关治理投票",
    maxRisk: "代币价值捕获不明确；监管对 AMM 态度",
    grade: "C",
    lifecycle: AlphaLifecycleState.Watching,
    nextVerification: "跟踪是否出现费用开关正式提案及社区投票进度",
    risks: [
      {
        priority: "P2",
        code: "WEAK_CAPTURE",
        message: "协议强但代币价值捕获路径仍不清晰",
        category: "tokenomics",
        relatedAssetId: "wl-uni"
      }
    ]
  },
  {
    id: "alpha-wld",
    universeAssetId: "wl-wld",
    projectName: "Worldcoin",
    token: "WLD",
    chain: "Ethereum",
    sector: "Identity / AI",
    thesisLine: "AI + 身份叙事间歇活跃，链上活跃地址波动大",
    coreMoveSummary: "社交讨论度上升但链上转账未同步放大",
    tokenTransmission: "预期型为主，缺乏稳定现金流传导",
    valuationSupplySummary: "解锁压力大，流通占比低",
    catalyst: "新地区试点、合作伙伴公告",
    maxRisk: "监管与隐私争议；数据质量不足以支撑高置信度跟踪",
    grade: "D",
    lifecycle: AlphaLifecycleState.NewlyFound,
    nextVerification: "若 7D 链上活跃无改善则降级出 Top10 展示",
    risks: [
      {
        priority: "P1",
        code: "REGULATORY",
        message: "多国监管态度不确定，适合低优先级观察",
        category: "regulatory",
        relatedAssetId: "wl-wld"
      }
    ]
  }
];

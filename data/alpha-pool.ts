import type { AlphaPoolEntry } from "./types";
import {
  AlphaLifecycleState,
  OffchainDueDiligenceRiskLevel,
  OffchainDueDiligenceStatus,
  TokenTransmissionStrength,
  TokenTransmissionType
} from "./types";

const DD_REVIEWED_AT = "2026-05-18";

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
    tokenTransmission: {
      type: TokenTransmissionType.Usage,
      strength: TokenTransmissionStrength.Medium,
      basis: ["协议费用", "质押激励", "治理投票权"],
      affectsAlphaGrade: true,
      note: "协议收入增长与质押相关，需验证费用是否持续而非单次激励"
    },
    valuationSupplySummary:
      "FDV 相对协议收入仍偏高；30 天解锁占比可控，需跟踪 90 天大额解锁日历",
    catalyst: "新链部署池上线、与主流 LST 合作扩展",
    maxRisk: "收益率产品对宏观利率敏感；若利率预期反转，叙事与资金或快速降温",
    grade: "B",
    lifecycle: AlphaLifecycleState.Watching,
    nextVerification:
      "确认 TVL 净流入是否连续 3 日为正，且费用收入 7D 环比不低于 +15%",
    holderNotes: "已从异动 Top5 升级为 Alpha 候选，尚未满足进池 3/8 硬条件",
    offchainDueDiligence: {
      teamBackgroundStatus: OffchainDueDiligenceStatus.PartiallyConfirmed,
      financingStatus: OffchainDueDiligenceStatus.PartiallyConfirmed,
      communityActivityStatus: OffchainDueDiligenceStatus.Confirmed,
      productProgressStatus: OffchainDueDiligenceStatus.PartiallyConfirmed,
      tokenUnlockStatus: OffchainDueDiligenceStatus.PartiallyConfirmed,
      keyFindings: [
        "核心团队履历在公开渠道可交叉验证，但部分关联方披露仍不完整",
        "融资轮次与投资方名单大体可查，细节口径偶有差异",
        "YT/PT 产品迭代节奏稳定，社区讨论以使用体验为主"
      ],
      unresolvedQuestions: [
        "大额解锁日历与官方披露是否完全一致？",
        "激励结束后 TVL 留存率是否可持续？"
      ],
      riskLevel: OffchainDueDiligenceRiskLevel.Medium,
      lastReviewedAt: DD_REVIEWED_AT,
      note: "部分确认，仍需跟踪；不构成买入建议"
    },
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
    tokenTransmission: {
      type: TokenTransmissionType.Buyback,
      strength: TokenTransmissionStrength.Strong,
      basis: ["协议费用", "回购/销毁预期", "Holder Revenue 讨论"],
      affectsAlphaGrade: true,
      note: "需持续验证收入分配与回购执行，非仅叙事"
    },
    valuationSupplySummary: "流通占比仍低，长期解锁曲线需每周核对",
    catalyst: "新交易对上线、机构做市合作传闻（待核实）",
    maxRisk: "竞争 perp 平台补贴战；单一链依赖度高",
    grade: "A",
    lifecycle: AlphaLifecycleState.FocusTracking,
    nextVerification: "跟踪周度协议收入与 HYPE 回购/销毁公告是否落地",
    offchainDueDiligence: {
      teamBackgroundStatus: OffchainDueDiligenceStatus.PartiallyConfirmed,
      financingStatus: OffchainDueDiligenceStatus.Unclear,
      communityActivityStatus: OffchainDueDiligenceStatus.Confirmed,
      productProgressStatus: OffchainDueDiligenceStatus.PartiallyConfirmed,
      tokenUnlockStatus: OffchainDueDiligenceStatus.Unclear,
      keyFindings: [
        "产品与成交量数据可链上交叉验证，业务面相对透明",
        "回购/收入分配机制仍依赖官方公告，执行细节待持续核对",
        "社区活跃度较高，但部分讨论含未核实传闻"
      ],
      unresolvedQuestions: [
        "回购资金是否来自可持续协议收入而非一次性储备？",
        "长期解锁与做市安排披露是否完整？"
      ],
      riskLevel: OffchainDueDiligenceRiskLevel.Medium,
      lastReviewedAt: DD_REVIEWED_AT,
      note: "重点跟踪项目：部分确认，需每周复核"
    },
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
    tokenTransmission: {
      type: TokenTransmissionType.GovernanceExpectation,
      strength: TokenTransmissionStrength.Weak,
      basis: ["治理投票权", "生态合作预期"],
      affectsAlphaGrade: true,
      note: "现金流向代币传导仍偏弱，不宜因 RWA 叙事单独上调评级"
    },
    valuationSupplySummary: "Mcap/FDV 差距大；需区分协议 AUM 与代币流通市值",
    catalyst: "监管友好司法辖区合作、新产品池开放",
    maxRisk: "叙事驱动大于收入验证；监管口径变化",
    grade: "B",
    lifecycle: AlphaLifecycleState.Watching,
    nextVerification: "核实链上 RWA AUM 7D 变化是否与价格异动同向",
    offchainDueDiligence: {
      teamBackgroundStatus: OffchainDueDiligenceStatus.PartiallyConfirmed,
      financingStatus: OffchainDueDiligenceStatus.PartiallyConfirmed,
      communityActivityStatus: OffchainDueDiligenceStatus.Unclear,
      productProgressStatus: OffchainDueDiligenceStatus.PartiallyConfirmed,
      tokenUnlockStatus: OffchainDueDiligenceStatus.Unclear,
      keyFindings: [
        "RWA 产品线与合作伙伴有公开材料，但链下合规细节信息不足",
        "融资背景部分可查，估值与代币关系仍需人工厘清",
        "社媒热度与链上活跃有时不同步，可能存在叙事溢价"
      ],
      unresolvedQuestions: [
        "监管口径变化对产品线的影响路径？",
        "代币与协议 AUM 的价值关联是否被过度定价？"
      ],
      riskLevel: OffchainDueDiligenceRiskLevel.Medium,
      lastReviewedAt: DD_REVIEWED_AT,
      note: "叙事驱动成分较高，尽调结论偏谨慎"
    },
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
    tokenTransmission: {
      type: TokenTransmissionType.Usage,
      strength: TokenTransmissionStrength.Medium,
      basis: ["路由费用", "质押激励", "治理分配"],
      affectsAlphaGrade: true,
      note: "路由费与治理激励相关，需对比竞争 DEX 份额"
    },
    valuationSupplySummary: "大额解锁已过峰值阶段，关注团队与生态基金剩余释放",
    catalyst: "新 perp 产品迭代、LFG 类激励是否重启",
    maxRisk: "Solana 生态整体 beta 高；竞争 DEX 分流",
    grade: "B",
    lifecycle: AlphaLifecycleState.Watching,
    nextVerification: "对比 Raydium / Meteora 同期份额变化，确认是否结构性而非短期",
    offchainDueDiligence: {
      teamBackgroundStatus: OffchainDueDiligenceStatus.PartiallyConfirmed,
      financingStatus: OffchainDueDiligenceStatus.Confirmed,
      communityActivityStatus: OffchainDueDiligenceStatus.Confirmed,
      productProgressStatus: OffchainDueDiligenceStatus.PartiallyConfirmed,
      tokenUnlockStatus: OffchainDueDiligenceStatus.PartiallyConfirmed,
      keyFindings: [
        "团队在 Solana 生态知名度较高，过往产品交付记录相对可查",
        "融资历史公开度较好，但代币分配细节需定期复核",
        "聚合器份额数据可链上验证，与官方口径大体一致"
      ],
      unresolvedQuestions: [
        "perp 模块与现货路由的收入分成是否可持续？",
        "激励重启是否会扭曲短期份额数据？"
      ],
      riskLevel: OffchainDueDiligenceRiskLevel.Medium,
      lastReviewedAt: DD_REVIEWED_AT
    },
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
    tokenTransmission: {
      type: TokenTransmissionType.GovernanceExpectation,
      strength: TokenTransmissionStrength.Medium,
      basis: ["安全模块质押", "治理金库", "协议费用（未直接分红）"],
      affectsAlphaGrade: true,
      note: "价值捕获偏慢，路径依赖治理与模块设计，非 Holder Revenue 直分"
    },
    valuationSupplySummary: "相对 DeFi 蓝筹估值不算极端；供给通胀温和",
    catalyst: "新市场上线、GHO 或其他稳定币模块数据",
    maxRisk: "宏观利率上行压制借贷需求；清算风险事件",
    grade: "B",
    lifecycle: AlphaLifecycleState.Watching,
    nextVerification: "确认 TVL 回升是否由真实借贷需求驱动而非激励挖矿",
    offchainDueDiligence: {
      teamBackgroundStatus: OffchainDueDiligenceStatus.Confirmed,
      financingStatus: OffchainDueDiligenceStatus.Confirmed,
      communityActivityStatus: OffchainDueDiligenceStatus.PartiallyConfirmed,
      productProgressStatus: OffchainDueDiligenceStatus.Confirmed,
      tokenUnlockStatus: OffchainDueDiligenceStatus.PartiallyConfirmed,
      keyFindings: [
        "团队与协议历史悠久，公开审计与安全事件记录较完整",
        "多链部署节奏稳定，治理流程有迹可循",
        "代币经济更多依赖治理与模块设计，直分收入路径仍待观察"
      ],
      unresolvedQuestions: [
        "GHO 等模块风险是否会在极端行情外溢至 AAVE 品牌？",
        "治理提案频率上升是否会带来短期政策不确定性？"
      ],
      riskLevel: OffchainDueDiligenceRiskLevel.Low,
      lastReviewedAt: DD_REVIEWED_AT,
      note: "蓝筹 DeFi，链下信息相对充分，但仍非无风险"
    },
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
    tokenTransmission: {
      type: TokenTransmissionType.CashFlow,
      strength: TokenTransmissionStrength.Medium,
      basis: ["收益分享讨论", "质押/锁仓", "治理预期"],
      affectsAlphaGrade: true,
      note: "协议风险与代币波动耦合度高，需核对储备与对冲透明度"
    },
    valuationSupplySummary: "FDV 高；需持续跟踪对冲敞口与储备透明度",
    catalyst: "新链 USDe 部署、合作交易所上币",
    maxRisk: "对冲失效或监管对合成稳定币态度变化为一票否决级",
    grade: "C",
    lifecycle: AlphaLifecycleState.Watching,
    nextVerification: "核对官方储备与对冲比率周报，确认 USDe 脱锚风险指标",
    holderNotes: "勿与 B 层 USDe 流动性指标混为同一交易标的",
    offchainDueDiligence: {
      teamBackgroundStatus: OffchainDueDiligenceStatus.PartiallyConfirmed,
      financingStatus: OffchainDueDiligenceStatus.Unclear,
      communityActivityStatus: OffchainDueDiligenceStatus.Unclear,
      productProgressStatus: OffchainDueDiligenceStatus.PartiallyConfirmed,
      tokenUnlockStatus: OffchainDueDiligenceStatus.Risky,
      keyFindings: [
        "合成稳定币机制依赖对冲与储备透明度，公开材料存在理解门槛",
        "融资与投资方信息部分可查，但风险披露需持续跟踪",
        "社区讨论波动大，极端行情下信息质量下降"
      ],
      unresolvedQuestions: [
        "储备与对冲比率是否按承诺频率完整披露？",
        "监管态度变化对 USDe 结构的潜在影响？"
      ],
      riskLevel: OffchainDueDiligenceRiskLevel.High,
      lastReviewedAt: DD_REVIEWED_AT,
      note: "风险较高：信息不足与机制复杂度并存，仅适合小额观察"
    },
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
    tokenTransmission: {
      type: TokenTransmissionType.Usage,
      strength: TokenTransmissionStrength.Medium,
      basis: ["使用费", "质押安全模块", "节点运营需求"],
      affectsAlphaGrade: true,
      note: "传导路径较成熟，但仍需分离 CCIP 叙事与费用数据"
    },
    valuationSupplySummary: "蓝筹估值区间，解锁压力相对可控",
    catalyst: "新链 CCIP 集成、机构储备数据合作",
    maxRisk: "若 RWA 叙事降温，短期涨幅或快速回吐",
    grade: "B",
    lifecycle: AlphaLifecycleState.Watching,
    nextVerification: "验证 CCIP 消息量 7D 环比是否持续改善",
    offchainDueDiligence: {
      teamBackgroundStatus: OffchainDueDiligenceStatus.Confirmed,
      financingStatus: OffchainDueDiligenceStatus.Confirmed,
      communityActivityStatus: OffchainDueDiligenceStatus.PartiallyConfirmed,
      productProgressStatus: OffchainDueDiligenceStatus.Confirmed,
      tokenUnlockStatus: OffchainDueDiligenceStatus.PartiallyConfirmed,
      keyFindings: [
        "团队与机构合作披露相对充分，预言机赛道地位成熟",
        "审计与安全公告历史较长，但需关注新模块引入风险",
        "CCIP 叙事与链上消息量需分开验证，避免混为一谈"
      ],
      unresolvedQuestions: [
        "RWA 相关合作是否带来可持续费用而非一次性新闻？",
        "质押模块改动对代币锁仓结构的长期影响？"
      ],
      riskLevel: OffchainDueDiligenceRiskLevel.Low,
      lastReviewedAt: DD_REVIEWED_AT
    },
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
    tokenTransmission: {
      type: TokenTransmissionType.CashFlow,
      strength: TokenTransmissionStrength.Medium,
      basis: ["费用燃烧", "质押收益", "协议费用"],
      affectsAlphaGrade: true,
      note: "Cosmos 资金轮动快，需验证费用改善是否可持续"
    },
    valuationSupplySummary: "通胀与解锁需对照质押收益率",
    catalyst: "新 perp 市场、机构做市计划",
    maxRisk: "Cosmos 生态资金轮动快，持续性待验证",
    grade: "C",
    lifecycle: AlphaLifecycleState.Watching,
    nextVerification: "对比 ATOM 生态资金是否同步流入，排除孤立行情",
    offchainDueDiligence: {
      teamBackgroundStatus: OffchainDueDiligenceStatus.PartiallyConfirmed,
      financingStatus: OffchainDueDiligenceStatus.PartiallyConfirmed,
      communityActivityStatus: OffchainDueDiligenceStatus.Unclear,
      productProgressStatus: OffchainDueDiligenceStatus.PartiallyConfirmed,
      tokenUnlockStatus: OffchainDueDiligenceStatus.Unclear,
      keyFindings: [
        "L1 与模块叙事清晰，但跨生态资金轮动快",
        "融资信息部分可查，代币通胀与解锁需对照官方文档",
        "社媒讨论热度波动大，链上费用改善是否可持续待验证"
      ],
      unresolvedQuestions: [
        "Cosmos 生态资金是否结构性流入而非短期投机？",
        "费用燃烧数据是否包含非经常性活动？"
      ],
      riskLevel: OffchainDueDiligenceRiskLevel.Medium,
      lastReviewedAt: DD_REVIEWED_AT,
      note: "部分确认，信息不足项较多"
    },
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
    tokenTransmission: {
      type: TokenTransmissionType.GovernanceExpectation,
      strength: TokenTransmissionStrength.Weak,
      basis: ["治理投票权", "费用开关叙事"],
      affectsAlphaGrade: true,
      note: "典型强协议弱代币；费用开关未落地前不得上调评级"
    },
    valuationSupplySummary: "大量 UNI 仍在金库，潜在治理释放为长期供给压力",
    catalyst: "v4 生态里程碑、费用开关治理投票",
    maxRisk: "代币价值捕获不明确；监管对 AMM 态度",
    grade: "C",
    lifecycle: AlphaLifecycleState.Watching,
    nextVerification: "跟踪是否出现费用开关正式提案及社区投票进度",
    offchainDueDiligence: {
      teamBackgroundStatus: OffchainDueDiligenceStatus.Confirmed,
      financingStatus: OffchainDueDiligenceStatus.Confirmed,
      communityActivityStatus: OffchainDueDiligenceStatus.Confirmed,
      productProgressStatus: OffchainDueDiligenceStatus.Confirmed,
      tokenUnlockStatus: OffchainDueDiligenceStatus.Risky,
      keyFindings: [
        "团队与协议历史长，产品与治理透明度在 DeFi 中较高",
        "费用开关与代币价值捕获仍高度依赖治理结果，存在不确定性",
        "金库代币占比高，长期供给压力需持续跟踪"
      ],
      unresolvedQuestions: [
        "费用开关若通过，收入分配比例是否对 UNI 持有人实质有利？",
        "监管对 AMM 的态度是否会影响治理节奏？"
      ],
      riskLevel: OffchainDueDiligenceRiskLevel.Medium,
      lastReviewedAt: DD_REVIEWED_AT,
      note: "协议强≠代币强，尽调侧重治理与供给"
    },
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
    tokenTransmission: {
      type: TokenTransmissionType.None,
      strength: TokenTransmissionStrength.None,
      basis: [],
      affectsAlphaGrade: true,
      note: "缺乏稳定现金流传导，仅适合低优先级观察"
    },
    valuationSupplySummary: "解锁压力大，流通占比低",
    catalyst: "新地区试点、合作伙伴公告",
    maxRisk: "监管与隐私争议；数据质量不足以支撑高置信度跟踪",
    grade: "D",
    lifecycle: AlphaLifecycleState.NewlyFound,
    nextVerification: "若 7D 链上活跃无改善则降级出 Top10 展示",
    offchainDueDiligence: {
      teamBackgroundStatus: OffchainDueDiligenceStatus.Risky,
      financingStatus: OffchainDueDiligenceStatus.Unclear,
      communityActivityStatus: OffchainDueDiligenceStatus.Risky,
      productProgressStatus: OffchainDueDiligenceStatus.Unclear,
      tokenUnlockStatus: OffchainDueDiligenceStatus.Risky,
      keyFindings: [
        "监管与隐私争议在多国媒体报道中反复出现，链下风险偏高",
        "代币解锁压力大，流通占比低，供给叙事不确定性高",
        "链上活跃与社媒热度经常背离，数据可信度存疑"
      ],
      unresolvedQuestions: [
        "主要市场监管态度是否会出现实质性收紧？",
        "官方披露的活跃数据口径是否可独立验证？"
      ],
      riskLevel: OffchainDueDiligenceRiskLevel.High,
      lastReviewedAt: DD_REVIEWED_AT,
      note: "风险较高：不建议作为重点深挖对象，仅保留观察"
    },
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

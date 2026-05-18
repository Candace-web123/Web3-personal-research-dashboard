import type { StrongSignalsDailySnapshot } from "./types";
import { StrongChainKind } from "./types";

/**
 * V1.2 强链 / 强赛道 / 强协议每日快照（TASK-022A）。
 * MVP：人工 mock，不对接 DefiLlama；数值为说明性文案，非实时计算。
 */
export const STRONG_SIGNALS_DAILY_SNAPSHOT: StrongSignalsDailySnapshot = {
  asOf: "2026-05-18",
  sectionHeadline:
    "今日资金更偏向「交易活跃链 + Perps 赛道」；协议层以真实费用增长为主，但需区分协议强与代币传导。",
  strongestDirection: "Solana 链 · Perps 赛道 · Hyperliquid 协议",
  sectionRiskNote:
    "部分链 TVL 改善伴随激励推高；Perps OI 温和升温，追高需控制杠杆与仓位节奏。",
  chains: [
    {
      id: "sc-solana",
      rank: 1,
      chainName: "Solana",
      chainKind: StrongChainKind.TradingActive,
      headlineConclusion: "DEX 与 Perps 成交共振，交易活跃型强链，适合跟踪结构性成交而非单纯 TVL 排名。",
      metrics: [
        { label: "TVL 7D", value: "+4.2%" },
        { label: "DEX Vol 7D", value: "+18%" },
        { label: "Stablecoins", value: "横盘略增" },
        { label: "Fees 7D", value: "+12%" }
      ],
      dataNarrative:
        "7D/30D 成交与费用方向一致，非单日 spike；Bridge 净流入小幅为正，资金更愿意承担链上交易风险。",
      suitableFor: "DEX、Perps、Meme、Launchpad",
      riskNote: "Meme 热度可放大成交量，需与协议费用/Revenue 交叉验证。"
    },
    {
      id: "sc-ethereum",
      rank: 2,
      chainName: "Ethereum",
      chainKind: StrongChainKind.CapitalDeposit,
      headlineConclusion: "资金沉淀仍占优，Lending / LST 资金池稳定，偏防守型配置锚点。",
      metrics: [
        { label: "TVL 7D", value: "+1.8%" },
        { label: "DEX Vol 7D", value: "+3%" },
        { label: "Stablecoins", value: "规模领先" },
        { label: "Fees 7D", value: "+2%" }
      ],
      dataNarrative:
        "TVL 与稳定币规模仍为全网最大，增长温和；适合作为周期底仓链，不宜用短线成交指标替代。",
      suitableFor: "Lending、RWA、Stablecoin、LSDFi"
    },
    {
      id: "sc-base",
      rank: 3,
      chainName: "Base",
      chainKind: StrongChainKind.AppRevenue,
      headlineConclusion: "社交与支付类应用推升 Fees，应用收入型改善，但需观察是否可持续。",
      metrics: [
        { label: "TVL 7D", value: "+6.1%" },
        { label: "DEX Vol 7D", value: "+9%" },
        { label: "Fees 7D", value: "+15%" },
        { label: "Revenue", value: "温和上升" }
      ],
      dataNarrative:
        "费用增长快于 TVL，显示使用侧活跃；需区分补贴活动与真实付费用户。",
      suitableFor: "高频使用型协议、支付 / 社交应用",
      riskNote: "若费用回落而 TVL 仍高，可能回到激励驱动型特征。"
    }
  ],
  sectors: [
    {
      id: "ss-perps",
      rank: 1,
      sectorName: "Perps",
      headlineConclusion: "多链 Perps 成交与 OI 同步改善，赛道共振最强，但杠杆风险需单独跟踪。",
      metrics: [
        { label: "赛道 TVL 7D", value: "+5%" },
        { label: "Volume 7D", value: "+22%" },
        { label: "Fees 7D", value: "+14%" },
        { label: "代表协议", value: "HYPE、GMX、dYdX" }
      ],
      dataNarrative:
        "Solana 与以太坊 L2 上头部 Perps 同步放量，非单项目孤立上涨；叙事与数据同向。",
      resonanceNote: "Hyperliquid、Aevo、部分 L2 Perps 数据同向改善。",
      riskNote: "Funding 略偏正，OI 升温时避免追涨高杠杆叙事币。"
    },
    {
      id: "ss-dex",
      rank: 2,
      sectorName: "DEX",
      headlineConclusion: "现货路由与聚合成交回升，适合观察费用捕获清晰的协议，而非仅看平台币涨幅。",
      metrics: [
        { label: "赛道 TVL 7D", value: "+2.5%" },
        { label: "Volume 7D", value: "+11%" },
        { label: "Fees 7D", value: "+8%" },
        { label: "代表协议", value: "UNI、JUP、Curve" }
      ],
      dataNarrative:
        "成交量改善领先部分平台币价格，存在「数据先动、价格未完全反映」的观察窗口。",
      resonanceNote: "Solana 与以太坊 DEX 集群同步，Jupiter / Uniswap 费用趋势一致。"
    },
    {
      id: "ss-lending",
      rank: 3,
      sectorName: "Lending",
      headlineConclusion: "利率环境与稳定币沉淀支撑借贷 TVL，偏稳健赛道，进攻性弱于 Perps。",
      metrics: [
        { label: "赛道 TVL 7D", value: "+1.2%" },
        { label: "Volume 7D", value: "+4%" },
        { label: "Fees 7D", value: "+3%" },
        { label: "代表协议", value: "AAVE、Morpho" }
      ],
      dataNarrative:
        "增长主要来自存量资金效率提升，催化以利率与上币为主，需防单协议异常。",
      resonanceNote: "以太坊与 L2 上头部借贷协议 TVL 方向一致。",
      riskNote: "若宏观转紧，借贷增速可能率先放缓。"
    }
  ],
  protocols: [
    {
      id: "sp-hyperliquid",
      rank: 1,
      protocolName: "Hyperliquid",
      token: "HYPE",
      chain: "Hyperliquid L1",
      sector: "Perps",
      headlineConclusion: "成交与费用领跑 Perps，协议基本面强，但代币估值与传导需单独定价。",
      metrics: [
        { label: "TVL 7D", value: "+7%" },
        { label: "Fees 7D", value: "+19%" },
        { label: "Revenue", value: "增长" },
        { label: "Holder Rev.", value: "部分捕获" }
      ],
      dataNarrative:
        "Volume / Fees 连续改善，OI 健康；属于赛道龙头观察位，非追涨清单。",
      protocolVsTokenNote:
        "协议费用强 ≠ 代币已充分定价；需核对回购/质押与解锁节奏，避免仅按涨幅入场。",
      riskNote: "短线涨幅大时标记「价格先行」，等待回调与数据二次确认。"
    },
    {
      id: "sp-jupiter",
      rank: 2,
      protocolName: "Jupiter",
      token: "JUP",
      chain: "Solana",
      sector: "DEX",
      headlineConclusion: "Solana 路由成交回升，费用与活跃地址改善，使用型传导中等偏强。",
      metrics: [
        { label: "TVL 7D", value: "+3%" },
        { label: "Volume 7D", value: "+16%" },
        { label: "Fees 7D", value: "+11%" },
        { label: "Mcap/TVL", value: "中性" }
      ],
      dataNarrative: "DEX 聚合份额稳定，激励减少后费用仍正增长，收入质量优于纯补贴项目。",
      protocolVsTokenNote: "治理 + 费用开关预期为主，Holder Revenue 需持续验证。"
    },
    {
      id: "sp-aave",
      rank: 3,
      protocolName: "Aave",
      token: "AAVE",
      chain: "Ethereum",
      sector: "Lending",
      headlineConclusion: "借贷 TVL 与费用温和增长，稳健型强协议，适合防守配置下的观察。",
      metrics: [
        { label: "TVL 7D", value: "+1.5%" },
        { label: "Fees 7D", value: "+4%" },
        { label: "Revenue", value: "稳定" },
        { label: "解锁 90D", value: "可控" }
      ],
      dataNarrative: "多链部署贡献增量，无单日异常 spike；适合作为赛道基准对照。",
      protocolVsTokenNote: "安全模块与治理价值捕获偏慢，协议强时代币可能滞后反应。"
    },
    {
      id: "sp-pendle",
      rank: 4,
      protocolName: "Pendle",
      token: "PENDLE",
      chain: "Ethereum",
      sector: "Yield",
      headlineConclusion: "收益率交易需求带动 TVL，赛道有叙事，但需防利率反转与激励退潮。",
      metrics: [
        { label: "TVL 7D", value: "+8%" },
        { label: "Fees 7D", value: "+10%" },
        { label: "Volume", value: "上升" },
        { label: "FDV/Revenue", value: "偏高" }
      ],
      dataNarrative: "TVL 改善与费用同步，非纯补贴堆量；估值已部分反映乐观预期。",
      protocolVsTokenNote: "费用与 veToken 模型相关，传导中等；估值透支时需降级观察。",
      riskNote: "估值偏高时仅观察，不新增仓位。"
    },
    {
      id: "sp-uniswap",
      rank: 5,
      protocolName: "Uniswap",
      token: "UNI",
      chain: "Ethereum",
      sector: "DEX",
      headlineConclusion: "以太坊 DEX 基准，费用改善温和；协议地位强，代币传导仍受治理与分成预期制约。",
      metrics: [
        { label: "TVL 7D", value: "+0.8%" },
        { label: "Fees 7D", value: "+5%" },
        { label: "Revenue", value: "缓增" },
        { label: "Holder Rev.", value: "有限" }
      ],
      dataNarrative: "L2 与 v4 预期支撑叙事，链上数据改善幅度小于头部 Perps 龙头。",
      protocolVsTokenNote: "典型「强协议 + 传导偏弱」样本；研究协议时不等于研究 UNI 短线走势。",
      riskNote: "Fees 高但 Holder Revenue 低时，不自动提升 Alpha 评级。"
    }
  ]
};

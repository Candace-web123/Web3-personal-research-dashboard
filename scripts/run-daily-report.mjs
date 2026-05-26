/**
 * Web3 每日投研报告生成器
 *
 * 组合：实时 API 数据 + 项目 knowledge 知识库 + prompts 模板 → Anthropic API → Markdown 报告
 *
 * 前置条件：
 *   - Node.js 18+（原生 fetch）
 *   - ANTHROPIC_API_KEY 环境变量（如需 AI 生成；否则仅输出组装好的 prompt 数据）
 *
 * 用法：
 *   node scripts/run-daily-report.mjs              # 调用 AI 生成报告
 *   node scripts/run-daily-report.mjs --dry-run    # 仅组装数据 + prompt，保存为 JSON，不调 AI
 *   node scripts/run-daily-report.mjs --model claude-sonnet-4-6  # 指定模型
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// dynamic import: tsx handles .ts → .mjs interop
const { buildMarketStateInput } = await import("../lib/pipeline.ts");
const { fetchStablecoinTrend, fetchCoinGlassData } = await import("../lib/real-market-data.ts");

// ---------------------------------------------------------------------------
// 0. 路径常量
// ---------------------------------------------------------------------------

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const KNOWLEDGE_DIR = join(ROOT, "knowledge");
const PROMPTS_DIR = join(ROOT, "prompts");
const REPORTS_DIR = join(ROOT, "reports");

function readText(relPath) {
  return readFileSync(join(ROOT, relPath), "utf-8");
}

// ---------------------------------------------------------------------------
// 1. CLI 参数
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const MODEL = (() => {
  const idx = args.indexOf("--model");
  return idx !== -1 ? args[idx + 1] : "claude-sonnet-4-6";
})();

const today = new Date();
const dateStr = today.toISOString().slice(0, 10); // YYYY-MM-DD
const timeStr = today.toISOString().slice(11, 16); // HH:mm
const reportPath = join(REPORTS_DIR, `${dateStr}.md`);

// ---------------------------------------------------------------------------
// 2. 加载知识库
// ---------------------------------------------------------------------------

function loadKnowledge() {
  const files = [
    "product-rules.md",
    "web3-concepts.md",
    "btc-cycle-framework.md",
    "market-regime-framework.md",
    "position-sizing-framework.md"
  ];
  const entries = [];
  for (const f of files) {
    const p = join(KNOWLEDGE_DIR, f);
    if (existsSync(p)) {
      const content = readFileSync(p, "utf-8");
      entries.push(`### ${f}\n\n${content}`);
      console.log(`       ${f}: ${(content.length / 1024).toFixed(1)} KB`);
    }
  }
  return entries.join("\n\n---\n\n");
}

// ---------------------------------------------------------------------------
// 3. 加载 prompt 模板
// ---------------------------------------------------------------------------

function loadSystemPrompt() {
  const p = join(PROMPTS_DIR, "system.md");
  return existsSync(p) ? readFileSync(p, "utf-8") : "";
}

function loadReportTemplate() {
  const p = join(PROMPTS_DIR, "daily-report.md");
  return existsSync(p) ? readFileSync(p, "utf-8") : "";
}

// ---------------------------------------------------------------------------
// 4. 实时数据获取
// ---------------------------------------------------------------------------

/**
 * 带超时的 fetch 封装。境内网络可能无法直接访问部分 API，超时时自动 fallback。
 */
async function fetchWithTimeout(url, opts = {}, timeoutMs = 15000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...opts, signal: ctrl.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * CoinGecko 免费 API：
 * - BTC/ETH 价格 + 24h 涨跌幅
 * - 无需 API key（免费层每分钟 10-30 次）
 */
async function fetchCoinGeckoData() {
  const ids = [
    "bitcoin",
    "ethereum",
    "solana",
    "chainlink",
    "render-token",
    "arbitrum",
    "ondo-finance",
    "bittensor"
  ];
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(",")}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`;

  console.log("[fetch] CoinGecko price data...");
  try {
    const res = await fetchWithTimeout(url, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      console.error(`[warn] CoinGecko returned ${res.status}: ${res.statusText}`);
      return null;
    }
    return res.json();
  } catch (err) {
    console.error(`[warn] CoinGecko fetch failed: ${err.message}`);
    return null;
  }
}

/**
 * Alternative.me 恐惧贪婪指数（免费，无 API key）
 */
async function fetchFearGreed() {
  const url = "https://api.alternative.me/fng/?limit=1";
  console.log("[fetch] Fear & Greed Index...");
  try {
    const res = await fetchWithTimeout(url, {}, 10000);
    if (!res.ok) {
      console.error(`[warn] Fear & Greed returned ${res.status}`);
      return null;
    }
    const json = await res.json();
    return json?.data?.[0] ?? null;
  } catch (err) {
    console.error(`[warn] Fear & Greed fetch failed: ${err.message}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// 5. 项目 mock 数据摘要
// ---------------------------------------------------------------------------

/**
 * 项目现有 mock 快照的结构化摘要（供 Agent 参考上下文）。
 * 这些值来自 data/*.ts mock 文件，实时数据会覆盖价格/情绪等动态字段。
 */
function getMockDataSummary() {
  return {
    asOf: "2026-05-18",
    btcCycle: {
      cycleStage: "MidUptrend (上涨中期)",
      mvrv: "1.85",
      nupl: "0.42",
      puellMultiple: "1.12",
      piCycleSignal: "未触发",
      twoHundredWeekMa: "$58,400",
      etfFlowSummary: "近 5 日现货 ETF 净流入约 +$1.2B",
      macroLiquiditySummary: "DXY 小幅回落、10Y 震荡；降息预期未升温",
      supportsAltAlphaObservation: true,
      btcActionBias: "持有为主，少量观察 Alpha"
    },
    marketEnvironment: {
      regime: "NeutralRotation (中性轮动)",
      totalScore: 2,
      stablecoinsScore: 1,
      defiTvlScore: 0,
      dexVolumeScore: 1,
      etfDatScore: 0,
      macroPolicyScore: 0,
      ethAndMainstreamSummary: "ETH/SOL 近 7 日相对 BTC 略强，轮动迹象存在但未形成全面 risk-on",
      stablecoinLiquiditySummary: "稳定币总市值近 7 日小幅回升，USDT 占比稳定"
    },
    positionAdvice: {
      riskProfile: "Conservative (保守型)",
      btcEthAllocation: "40-60%",
      stablecoinAllocation: "30-50%",
      alphaAllocation: "3-8%",
      highRiskHotspotAllocation: "0-2%",
      suitableToAddPosition: false,
      observationOnly: true,
      deepDiveProjects: ["Hyperliquid", "Pendle", "Ondo Finance"]
    },
    watchlistUniverse: {
      totalCount: 28,
      tierDistribution: "S:1 / A:5 / B:3 / C:12 / D:7"
    },
    alphaPoolTop10: [
      "Hyperliquid (HYPE) - A级 - FocusTracking",
      "Pendle (PENDLE) - A级 - Watching",
      "Ondo Finance (ONDO) - A级 - Watching",
      "Bittensor (TAO) - B级 - Watching",
      "EigenLayer (EIGEN) - B级 - Watching",
      "Jito (JTO) - B级 - Watching",
      "Render (RNDR) - B级 - Watching",
      "Ethena (ENA) - C级 - RiskElevated",
      "Celestia (TIA) - C级 - Watching",
      "Worldcoin (WLD) - D级 - RiskElevated"
    ],
    moversTop5: [
      "HYPE +8.2% - 交易量激增",
      "PENDLE +5.7% - TVL 创新高",
      "ONDO +4.1% - RWA 合作公告",
      "TAO +3.8% - 子网增长",
      "ENA -2.4% - 代币解锁压力"
    ],
    strongSignals: {
      strongestDirection: "RWA 赛道 + Hyperliquid 生态",
      topChains: ["Ethereum (资金沉淀)", "Solana (交易活跃)", "Base (应用收入)"],
      topSectors: ["RWA", "Liquid Staking Derivatives", "Perpetual DEX"],
      topProtocols: ["Hyperliquid", "Pendle", "Uniswap", "Aave", "Jito"]
    },
    riskWarnings: [
      "P0: (无当日 P0 风险)",
      "P1: 宏观政策中性 — 降息预期未升温",
      "P2: DeFi TVL 持平 — 链上扩张信号不强",
      "P2: ETF 流入温和 — 需跟踪后续节奏"
    ]
  };
}

// ---------------------------------------------------------------------------
// 6. 组装 prompt context
// ---------------------------------------------------------------------------

function assembleContext({ coinGeckoData, fearGreedData, mockSummary, pipelineResult }) {
  const liveDataSection = [];

  // 市场状态机预判结果
  if (pipelineResult) {
    const a = pipelineResult.assessment;
    liveDataSection.push(
      "## 市场状态机预判（引擎自动计算 · 优先参考）",
      "",
      `- **状态：${a.regimeLabel}**（信心: ${a.confidence}，命中 ${a.hitCount} 项条件）`,
      `- **下一状态信号：** ${a.nextStateSignal}`,
      "",
      "### 命中条件明细：",
      ...a.scoreBreakdown.map((c) => `  - [${c.hit ? "✓" : "✗"}] ${c.label}${c.required ? "（必选）" : ""}`),
      ...(a.scoreBreakdown.length === 0 ? ["  （Fallback: 无状态命中全部必选条件，默认为中性震荡）"] : []),
      "",
      "### 数据来源标注：",
      ...Object.entries(pipelineResult.provenance).map(([k, v]) => `  - ${k}: ${v}`),
      "",
      "> **请以上述引擎判定结果为基础，填充报告「一、当前市场状态」板块。** 命中条件直接作为判断依据。信心为 low 时需在报告中标注不确定性。",
      ""
    );
  }

  // BTC 实时数据
  if (coinGeckoData?.bitcoin) {
    const btc = coinGeckoData.bitcoin;
    liveDataSection.push(
      `## 实时行情数据（CoinGecko · 获取时间 ${dateStr} ${timeStr} UTC）`,
      "",
      `- BTC: $${btc.usd?.toLocaleString() ?? "N/A"} · 24h ${btc.usd_24h_change != null ? (btc.usd_24h_change > 0 ? "+" : "") + btc.usd_24h_change.toFixed(2) + "%" : "N/A"}`,
      `- ETH: $${coinGeckoData.ethereum?.usd?.toLocaleString() ?? "N/A"} · 24h ${coinGeckoData.ethereum?.usd_24h_change != null ? (coinGeckoData.ethereum.usd_24h_change > 0 ? "+" : "") + coinGeckoData.ethereum.usd_24h_change.toFixed(2) + "%" : "N/A"}`,
      `- SOL: $${coinGeckoData.solana?.usd?.toLocaleString() ?? "N/A"} · 24h ${coinGeckoData.solana?.usd_24h_change != null ? (coinGeckoData.solana.usd_24h_change > 0 ? "+" : "") + coinGeckoData.solana.usd_24h_change.toFixed(2) + "%" : "N/A"}`
    );
  }

  // 恐惧贪婪
  if (fearGreedData) {
    liveDataSection.push(
      "",
      `## 恐惧贪婪指数（Alternative.me · ${dateStr}）`,
      "",
      `- 当前值: **${fearGreedData.value}** — ${fearGreedData.value_classification}`,
      `- 更新时间: ${new Date(Number(fearGreedData.timestamp) * 1000).toISOString()}`
    );
  }

  // Mock 快照摘要
  liveDataSection.push(
    "",
    "## 项目 Mock 数据快照（参考上下文 · asOf: 2026-05-18）",
    "",
    "以下为 Dashboard 现有的静态 mock 数据摘要。除 BTC 价格和恐惧贪婪已由上方实时数据覆盖外，",
    "其余字段（周期阶段、市场环境、Alpha 池、仓位建议等）仍参考 mock 值。",
    "",
    "```json",
    JSON.stringify(mockSummary, null, 2),
    "```"
  );

  return liveDataSection.join("\n");
}

const DISCLAIMER_BLOCK = `

---

> 本报告由 AI Agent 基于实时数据 + 知识库规则自动生成。
> 仅供个人投研参考，不构成投资建议。
> 数据来源：CoinGecko（价格）、Alternative.me（恐惧贪婪）、项目 mock 快照。
`;

// ---------------------------------------------------------------------------
// 7. 调用 Anthropic API
// ---------------------------------------------------------------------------

async function callAnthropic({ systemPrompt, knowledge, template, dataContext }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[error] ANTHROPIC_API_KEY not set.");
    console.error("[info]  Re-run with --dry-run to save assembled data without API call.");
    process.exit(1);
  }

  const userMessage = [
    "以下是今日的实时数据与项目上下文。请按**每日投研简报模板**输出完整的 Markdown 报告。",
    "",
    "**要求：**",
    "1. 严格按照模板的十大板块结构输出",
    "2. 实时数据覆盖 mock 数据中的价格和情绪字段",
    "3. BTC 周期阶段基于实时 MVRV/价格 结合知识库框架重新判断（不要直接复用 mock 的阶段）",
    "4. 所有方括号占位符必须替换为实际值",
    "5. 无法从数据中确定的内容标注「数据不足，待人工补充」",
    "6. 遵守 product-rules.md 中的全部禁止词和替代措辞规则",
    "",
    dataContext,
    "",
    "---",
    "",
    "## 报告模板（按此结构输出）",
    "",
    template
  ].join("\n");

  console.log(`[ai] Calling Anthropic API (model: ${MODEL})...`);

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 8192,
      system: [
        systemPrompt,
        "",
        "## 项目知识库",
        "",
        "以下知识库文档定义了你的分析框架和领域知识，必须严格遵守：",
        "",
        knowledge
      ].join("\n"),
      messages: [{ role: "user", content: userMessage }]
    })
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${errBody}`);
  }

  const json = await res.json();
  const content = json?.content;
  if (!content || content.length === 0) {
    throw new Error("Anthropic returned empty response");
  }

  const text = content.map((b) => b.text ?? "").join("");
  return text;
}

// ---------------------------------------------------------------------------
// 8. 主流程
// ---------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log(`Web3 Daily Report Generator — ${dateStr}`);
  console.log("=".repeat(60));
  console.log(`Mode: ${DRY_RUN ? "DRY RUN (no AI call)" : `AI (model: ${MODEL})`}`);
  console.log("");

  // 加载本地文件
  console.log("[load] Knowledge base...");
  const knowledge = loadKnowledge();
  console.log(`       ${(knowledge.length / 1024).toFixed(1)} KB loaded`);

  console.log("[load] System prompt & report template...");
  const systemPrompt = loadSystemPrompt();
  const template = loadReportTemplate();

  // 获取实时数据（CoinGecko / FearGreed 用脚本内置 fetcher，Stablecoin / CoinGlass 复用 lib）
  const [coinGeckoData, fearGreedData, stablecoinTrend, coinGlassData] = await Promise.all([
    fetchCoinGeckoData(),
    fetchFearGreed(),
    fetchStablecoinTrend(),
    fetchCoinGlassData()
  ]);

  if (!coinGeckoData) console.log("[warn] CoinGecko data unavailable — using mock fallback");
  if (!fearGreedData) console.log("[warn] Fear & Greed unavailable — using mock fallback");
  if (!stablecoinTrend) console.log("[warn] Stablecoin trend unavailable — using mock fallback");
  if (!coinGlassData?.avgFundingRate && !coinGlassData?.oiChangeRate) console.log("[warn] CoinGlass data unavailable — using mock fallback");

  // 运行市场状态机
  console.log("[engine] Running market state engine...");
  const rawData = {
    btcPriceUsd: coinGeckoData?.bitcoin?.usd ?? null,
    ethPriceUsd: coinGeckoData?.ethereum?.usd ?? null,
    btc200dMa: null,
    btc200dMaSlope: null,
    ethBtcTrend: null,
    total3BtcTrend: null,
    etfFlowDirection: null,
    stablecoinTrend: stablecoinTrend ?? null,
    fearGreed: fearGreedData?.value != null ? Number(fearGreedData.value) : null,
    avgFundingRate: coinGlassData?.avgFundingRate ?? null,
    oiChangeRate: coinGlassData?.oiChangeRate ?? null,
  };
  const pipelineResult = buildMarketStateInput(rawData);
  console.log(`       Regime: ${pipelineResult.assessment.regimeLabel} (confidence: ${pipelineResult.assessment.confidence}, hitCount: ${pipelineResult.assessment.hitCount})`);

  // 组装
  const mockSummary = getMockDataSummary();
  const dataContext = assembleContext({ coinGeckoData, fearGreedData, mockSummary, pipelineResult });

  if (DRY_RUN) {
    // 保存组装好的数据
    mkdirSync(REPORTS_DIR, { recursive: true });
    const dryRunPath = join(REPORTS_DIR, `${dateStr}-dry-run.json`);
    const dryRunPayload = {
      generatedAt: `${dateStr}T${timeStr}:00Z`,
      liveData: { coinGecko: coinGeckoData, fearGreed: fearGreedData },
      pipelineResult,
      mockSummary,
      systemPrompt,
      knowledgeLength: knowledge.length,
      templateLength: template.length
    };
    writeFileSync(dryRunPath, JSON.stringify(dryRunPayload, null, 2), "utf-8");
    console.log(`\n[done] Dry-run payload saved → ${dryRunPath}`);
    console.log("[info] 可将此文件内容手动贴入任何 LLM 生成报告。");
    return;
  }

  // 调用 AI
  console.log("[ai] Assembling prompt...");
  const promptSize = (systemPrompt.length + knowledge.length + dataContext.length + template.length) / 1024;
  console.log(`       Total context: ~${promptSize.toFixed(0)} KB`);

  let report;
  try {
    report = await callAnthropic({ systemPrompt, knowledge, template, dataContext });
  } catch (err) {
    console.error(`\n[error] AI call failed: ${err.message}`);
    console.error("[info]  Re-run with --dry-run to inspect the assembled prompt without API call.");
    process.exit(1);
  }

  // 写入报告
  mkdirSync(REPORTS_DIR, { recursive: true });
  const finalReport = report + DISCLAIMER_BLOCK;
  writeFileSync(reportPath, finalReport, "utf-8");
  console.log(`\n[done] Report saved → ${reportPath}`);
  console.log(`       ${(finalReport.length / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error("[fatal]", err);
  process.exit(1);
});

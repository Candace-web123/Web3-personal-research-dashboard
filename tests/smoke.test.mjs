import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

const readText = (relativePath) =>
  readFileSync(path.join(root, relativePath), "utf8").replace(/^\uFEFF/, "");

const requiredPaths = [
  "app/page.tsx",
  "app/layout.tsx",
  "data/assets.ts",
  "data/types.ts",
  "data/narratives.ts",
  "data/ai-framework.ts",
  "data/index.ts",
  "data/watchlist-universe.ts",
  "data/btc-cycle.ts",
  "data/market-environment.ts",
  "data/movers-top5.ts",
  "data/alpha-pool.ts",
  "data/position-advice.ts",
  "data/strong-signals.ts",
  "data/data-provenance.ts",
  "data/daily-review.ts",
  "components/dashboard/daily-review-card.tsx",
  "components/dashboard/actual-position-compare-card.tsx",
  "lib/actual-position-compare.ts",
  "lib/data-provenance.ts",
  "lib/token-transmission.ts",
  "components/dashboard/data-provenance-footer.tsx",
  "lib/research-overview.ts",
  "lib/v12-decision.ts",
  "lib/strong-signals.ts",
  "components/dashboard/decision-card.tsx",
  "components/dashboard/btc-cycle-card.tsx",
  "components/dashboard/market-environment-card.tsx",
  "components/dashboard/movers-top5-card.tsx",
  "components/dashboard/alpha-pool-card.tsx",
  "components/dashboard/position-advice-card.tsx",
  "components/dashboard/risk-warnings-card.tsx",
  "components/dashboard/strong-chain-top.tsx",
  "components/dashboard/strong-sector-top.tsx",
  "components/dashboard/strong-protocol-top.tsx",
  "components/dashboard/strong-signal-entry-layout.tsx",
  "lib/actual-position-compare.ts",
  "components/dashboard/actual-position-compare-card.tsx",
  "components/dashboard/decision-hero-card.tsx",
  "components/dashboard/dashboard-header.tsx",
  "data/risk-warnings-dashboard.ts"
];

for (const relativePath of requiredPaths) {
  assert.ok(existsSync(path.join(root, relativePath)), `missing file: ${relativePath}`);
}

const pkg = JSON.parse(readText("package.json"));
assert.equal(
  pkg.scripts?.test,
  "node tests/smoke.test.mjs",
  'package.json scripts.test must be "node tests/smoke.test.mjs"'
);

// --- V1.2 首页接线（app/page.tsx）---

const pageSource = readText("app/page.tsx");

const pageMustInclude = [
  "buildDecisionCardModel",
  "getTopMovers5",
  "getAlphaTop10",
  "<DecisionHeroCard",
  "<BtcCycleCard",
  "<MarketEnvironmentCard",
  "<ActualPositionCompareCard",
  "positionAdviceSnapshot={positionAdviceSnapshot}",
  "DashboardHeader",
  "variant=\"compact\"",
  "variant=\"v4\"",
  "variant=\"detailed\"",
  "<MoversTop5Card",
  "<AlphaPoolCard",
  "<PositionAdviceCard",
  "<RiskWarningsCard",
  "DashboardHeader",
  "\\u65e7\\u7248\\u7814\\u7a76\\u6a21\\u5757",
  "StrongChainTop",
  "StrongSectorTop",
  "StrongProtocolTop",
  "\\u4eca\\u65e5\\u8d44\\u91d1\\u4e0e\\u7ed3\\u6784",
  "StrongChainTop",
  "getDataProvenanceDailySnapshot",
  "getCardDataProvenance",
  "DataProvenanceCardId",
  "dataProvenance={",
  "getDailyReviewSnapshot",
  "<DailyReviewCard",
  "dailyReviewSnapshot",
  "<ActualPositionCompareCard",
  "topRisks={decisionModel.topRisks}"
];

for (const snippet of pageMustInclude) {
  assert.match(
    pageSource,
    new RegExp(snippet.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    `app/page.tsx must include: ${snippet}`
  );
}

const pageMustNotInclude = [
  "T01 占位",
  "业务区块（T04+）未实现",
  "WATCHLIST_UNIVERSE",
  "getWatchlistUniverse",
  "fetch(",
  "axios"
];

for (const snippet of pageMustNotInclude) {
  assert.equal(
    pageSource.includes(snippet),
    false,
    `app/page.tsx must not include: ${snippet}`
  );
}

// --- V1.2 模块稳定标题（组件源码）---

const moduleTitleChecks = [
  ["components/dashboard/decision-card.tsx", "LABEL_DECISION_CARD"],
  ["components/dashboard/btc-cycle-card.tsx", "BTC 周期"],
  ["components/dashboard/market-environment-card.tsx", "\\u5e02\\u573a\\u73af\\u5883"],
  ["components/dashboard/movers-top5-card.tsx", "今日异动 Top 5"],
  ["components/dashboard/alpha-pool-card.tsx", "Alpha 观察池 Top 10"],
  ["components/dashboard/position-advice-card.tsx", "今日仓位建议"],
  ["components/dashboard/risk-warnings-card.tsx", "\\u98ce\\u9669\\u9884\\u8b66"],
  ["components/dashboard/strong-chain-top.tsx", "强链 Top 3"],
  ["components/dashboard/strong-sector-top.tsx", "强赛道 Top 3"],
  ["components/dashboard/strong-protocol-top.tsx", "强协议 Top 5"]
];

for (const [relativePath, title] of moduleTitleChecks) {
  const source = readText(relativePath);
  assert.match(
    source,
    new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    `${relativePath} must include title: ${title}`
  );
}

// --- TASK-022：强信号卡 aria-label ---

const strongSignalsAriaLabels = [
  { file: "components/dashboard/strong-chain-top.tsx", label: "强链 Top 3" },
  { file: "components/dashboard/strong-sector-top.tsx", label: "强赛道 Top 3" },
  { file: "components/dashboard/strong-protocol-top.tsx", label: "强协议 Top 5" }
];

for (const { file, label } of strongSignalsAriaLabels) {
  const content = readText(file);
  assert.match(
    content,
    new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    `${file} should have aria-label: ${label}`
  );
}

// --- TASK-022：决策卡最强方向 ---

const decisionCard = readText("components/dashboard/decision-card.tsx");
assert.match(
  decisionCard,
  /LABEL_DECISION_CARD/,
  "decision-card should define LABEL_DECISION_CARD"
);
assert.match(
  decisionCard,
  /aria-label=\{LABEL_DECISION_CARD\}/,
  "decision-card should bind aria-label to LABEL_DECISION_CARD"
);
assert.match(
  decisionCard,
  /strongestDirection/,
  "decision-card should show strongestDirection"
);
assert.match(
  decisionCard,
  /LABEL_STRONGEST|今日最强方向/,
  "decision-card should include strongest direction label"
);

// --- TASK-022：lib/strong-signals 选择器 ---

const strongSignalsLib = readText("lib/strong-signals.ts");
assert.match(strongSignalsLib, /export function getStrongSignalsDailySnapshot/);
assert.match(strongSignalsLib, /export function getStrongChainTop3/);
assert.match(strongSignalsLib, /export function getStrongSectorTop3/);
assert.match(strongSignalsLib, /export function getStrongProtocolTop5/);

// --- TASK-022：data/strong-signals mock ---

const strongSignalsData = readText("data/strong-signals.ts");
assert.match(
  strongSignalsData,
  /STRONG_SIGNALS_DAILY_SNAPSHOT/,
  "data/strong-signals.ts should export STRONG_SIGNALS_DAILY_SNAPSHOT"
);
assert.match(
  strongSignalsData,
  /strongestDirection/,
  "data/strong-signals.ts should include strongestDirection"
);

// --- 异动卡：强调观察宇宙扫描，非 30 币全表 ---

const moversCardSource = readText("components/dashboard/movers-top5-card.tsx");
assert.match(
  moversCardSource,
  /观察宇宙/,
  "movers-top5-card should mention watchlist universe scan context"
);
assert.equal(
  moversCardSource.includes("WATCHLIST_UNIVERSE"),
  false,
  "movers-top5-card must not import full universe table"
);

// --- 观察宇宙规模（约 30 币）---

const universe = readText("data/watchlist-universe.ts");
const universeIdCount = (universe.match(/id:\s*"wl-/g) ?? []).length;
assert.ok(
  universeIdCount >= 25 && universeIdCount <= 32,
  `watchlist universe should have ~30 entries, got ${universeIdCount}`
);

// --- 无新增 App 子路由 ---

function findPageRoutes(dir, base = "") {
  const routes = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      routes.push(...findPageRoutes(fullPath, rel));
    } else if (entry.isFile() && /^page\.(tsx|jsx|js)$/.test(entry.name)) {
      routes.push(rel.replace(/\\/g, "/"));
    }
  }
  return routes;
}

const routeFiles = findPageRoutes(path.join(root, "app"));
assert.deepEqual(
  routeFiles,
  ["page.tsx"],
  `app/ must only expose root page.tsx, found: ${routeFiles.join(", ")}`
);

// --- lib 决策合成存在 ---

const v12DecisionSource = readText("lib/v12-decision.ts");
assert.match(v12DecisionSource, /export function buildDecisionCardModel/);
assert.match(v12DecisionSource, /export function getTopMovers5/);
assert.match(v12DecisionSource, /export function getAlphaTop10/);

// --- TASK-019：数据可信度 ---

const provenanceData = readText("data/data-provenance.ts");
assert.match(
  provenanceData,
  /DATA_PROVENANCE_DAILY_SNAPSHOT/,
  "data/data-provenance.ts should export DATA_PROVENANCE_DAILY_SNAPSHOT"
);

const provenanceFooter = readText("components/dashboard/data-provenance-footer.tsx");
assert.match(
  provenanceFooter,
  /aria-label=\{LABEL_DATA_TRUST\}/,
  "data-provenance-footer should expose data trust aria-label"
);
assert.match(provenanceFooter, /DataProvenanceFooter/);

for (const cardFile of [
  "components/dashboard/decision-card.tsx",
  "components/dashboard/btc-cycle-card.tsx",
  "components/dashboard/market-environment-card.tsx"
]) {
  const cardSource = readText(cardFile);
  assert.match(
    cardSource,
    /DataProvenanceFooter/,
    `${cardFile} should render DataProvenanceFooter`
  );
  assert.match(
    cardSource,
    /dataProvenance/,
    `${cardFile} should accept dataProvenance prop`
  );
}

const dataGuards = readText("lib/data-guards.ts");
assert.match(dataGuards, /export function assertDataProvenance/);

// --- TASK-020：代币传导结构化 ---

const typesSource = readText("data/types.ts");
assert.match(typesSource, /TokenTransmissionType/);
assert.match(typesSource, /TokenTransmissionJudgement/);

const alphaPoolSource = readText("data/alpha-pool.ts");
assert.match(alphaPoolSource, /tokenTransmission:\s*\{/);
assert.match(alphaPoolSource, /TokenTransmissionType\./);
assert.match(alphaPoolSource, /strength: TokenTransmissionStrength/);

const alphaCardSource = readText("components/dashboard/alpha-pool-card.tsx");
assert.match(alphaCardSource, /TokenTransmissionBlock/);
assert.match(alphaCardSource, /entry\.tokenTransmission/);
assert.match(
  alphaCardSource,
  /代币价值传导/,
  "alpha-pool-card should show token transmission section"
);

const tokenTxLib = readText("lib/token-transmission.ts");
assert.match(tokenTxLib, /export function assertAlphaTokenTransmission/);

// --- TASK-021：链下尽调结构化 ---

assert.match(typesSource, /OffchainDueDiligence/);
assert.match(alphaPoolSource, /offchainDueDiligence:\s*\{/);
assert.match(alphaPoolSource, /OffchainDueDiligenceStatus\./);
assert.match(alphaCardSource, /OffchainDueDiligenceBlock/);
assert.match(alphaCardSource, /entry\.offchainDueDiligence/);
assert.match(
  alphaCardSource,
  /\\u94fe\\u4e0b\\u5c3d\\u8c03/,
  "alpha-pool-card should show offchain due diligence section"
);
assert.match(dataGuards, /export function assertAlphaOffchainDueDiligence/);

assert.equal(pageSource.includes("fetch("), false, "app/page.tsx must not use fetch");
assert.equal(pageSource.includes("axios"), false, "app/page.tsx must not use axios");

// --- TASK-023：每日复盘 ---

assert.ok(existsSync(path.join(root, "data/daily-review.ts")));
assert.ok(existsSync(path.join(root, "components/dashboard/daily-review-card.tsx")));

const dailyReviewData = readText("data/daily-review.ts");
assert.match(dailyReviewData, /DAILY_REVIEW_SNAPSHOT/);

assert.match(typesSource, /DailyReviewSnapshot/);

const dailyReviewCard = readText("components/dashboard/daily-review-card.tsx");
assert.match(dailyReviewCard, /DailyReviewCard/);
assert.match(
  dailyReviewCard,
  /\\u660e\\u65e5\\u4ed3\\u4f4d\\u89c2\\u5bdf\\u6761\\u4ef6/
);

const dashboardHeader = readText("components/dashboard/dashboard-header.tsx");
assert.match(dashboardHeader, /V1\.2/);

assert.match(dataGuards, /export function assertDailyReviewSnapshot/);

// --- TASK-024：实际仓位对比分析 MVP ---

const actualCompareCard = readText(
  "components/dashboard/actual-position-compare-card.tsx"
);
const actualCompareLib = readText("lib/actual-position-compare.ts");

assert.match(typesSource, /ActualPositionInput/);
assert.match(typesSource, /ActualPositionCompareResult/);
assert.match(typesSource, /ActualPositionAnalysisMode/);
assert.match(typesSource, /ActualPositionRecommendation/);

assert.match(actualCompareCard, /ActualPositionCompareCard/);
assert.match(actualCompareCard, /image\/\*|type="file"/);
assert.match(
  actualCompareCard,
  /\\u624b\\u52a8\\u5f55\\u5165|\\u624b\\u52a8\\u6821\\u6b63/
);
assert.match(
  actualCompareCard,
  /\\u5f53\\u524d\\u7248\\u672c\\u4e0d\\u81ea\\u52a8\\u8bc6\\u522b/
);
assert.match(
  actualCompareCard,
  /\\u672a\\u6765\\u6570\\u636e\\u63a5\\u5165/
);

assert.match(actualCompareLib, /export function buildActualPositionCompareResult/);
assert.match(actualCompareLib, /positionRecommendations/);

assert.match(actualCompareCard, /\\u4e2a\\u4eba\\u4ed3\\u4f4d\\u5efa\\u8bae/);
assert.match(actualCompareCard, /\\u5224\\u65ad\\u4f9d\\u636e/);
assert.match(actualCompareCard, /\\u5931\\u6548\\u6761\\u4ef6/);
assert.match(actualCompareCard, /positionRecommendations/);

const forbiddenOutputPhrases = [
  "必买",
  "必卖",
  "必涨",
  "稳赚",
  "梭哈",
  "无脑加仓",
  "立即满仓",
  "保证收益",
  "自动交易",
  "自动下单",
  "系统替你决策"
];
const libOutputTemplates = actualCompareLib
  .replace(/export const FORBIDDEN_OUTPUT_PHRASES[\s\S]*?\] as const;/, "")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\/\/[^\n]*/g, "");
for (const phrase of forbiddenOutputPhrases) {
  assert.equal(
    libOutputTemplates.includes(phrase),
    false,
    `lib/actual-position-compare.ts output templates must not include: ${phrase}`
  );
}
assert.match(actualCompareLib, /FORBIDDEN_OUTPUT_PHRASES/);
assert.match(actualCompareLib, /建议减仓高风险热点|建议降低高风险热点暴露/);

assert.equal(actualCompareCard.includes("fetch("), false);
assert.equal(actualCompareCard.includes("axios"), false);
assert.equal(actualCompareLib.includes("fetch("), false);

console.log(
  "smoke test passed (V1.2 MVP + TASK-019/020/021/023/024/025)."
);

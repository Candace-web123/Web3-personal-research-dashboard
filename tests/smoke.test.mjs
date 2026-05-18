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
  "data/btc-cycle.ts",
  "data/market-environment.ts",
  "data/movers-top5.ts",
  "data/alpha-pool.ts",
  "data/position-advice.ts",
  "data/watchlist-universe.ts",
  "lib/research-overview.ts",
  "lib/v12-decision.ts",
  "components/dashboard/decision-card.tsx",
  "components/dashboard/btc-cycle-card.tsx",
  "components/dashboard/market-environment-card.tsx",
  "components/dashboard/movers-top5-card.tsx",
  "components/dashboard/alpha-pool-card.tsx",
  "components/dashboard/position-advice-card.tsx",
  "components/dashboard/risk-warnings-card.tsx"
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
  "<DecisionCard",
  "<BtcCycleCard",
  "<MarketEnvironmentCard",
  "<MoversTop5Card",
  "<AlphaPoolCard",
  "<PositionAdviceCard",
  "<RiskWarningsCard",
  "V1.2 每日投研",
  "旧版研究模块 / 研究数据补充"
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
  ["components/dashboard/decision-card.tsx", "今日决策卡"],
  ["components/dashboard/btc-cycle-card.tsx", "BTC 周期"],
  ["components/dashboard/market-environment-card.tsx", "市场环境"],
  [
    "components/dashboard/movers-top5-card.tsx",
    "今日异动 Top 5"
  ],
  [
    "components/dashboard/alpha-pool-card.tsx",
    "Alpha 观察池 Top 10"
  ],
  ["components/dashboard/position-advice-card.tsx", "今日仓位建议"],
  ["components/dashboard/risk-warnings-card.tsx", "风险预警"]
];

for (const [relativePath, title] of moduleTitleChecks) {
  const source = readText(relativePath);
  assert.match(
    source,
    new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    `${relativePath} must include title: ${title}`
  );
}

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

console.log("smoke test passed (V1.2 MVP homepage checks).");

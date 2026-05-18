import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredPaths = [
  "app/page.tsx",
  "app/layout.tsx",
  "data/assets.ts",
  "data/types.ts",
  "data/narratives.ts",
  "data/ai-framework.ts",
  "data/index.ts",
  "lib/research-overview.ts",
  "data/watchlist-universe.ts",
  "data/btc-cycle.ts",
  "data/market-environment.ts",
  "data/alpha-pool.ts",
  "data/movers-top5.ts",
  "data/position-advice.ts",
  "data/strong-signals.ts",
  "lib/v12-decision.ts",
  "lib/strong-signals.ts",
  "components/dashboard/decision-card.tsx",
  "components/dashboard/btc-cycle-card.tsx",
  "components/dashboard/market-environment-card.tsx",
  "components/dashboard/movers-top5-card.tsx",
  "components/dashboard/alpha-pool-card.tsx",
  "components/dashboard/position-advice-card.tsx",
  "components/dashboard/risk-warnings-card.tsx",
  "docs/PRD.md"
];

for (const relativePath of requiredPaths) {
  assert.ok(existsSync(path.join(root, relativePath)), `missing file: ${relativePath}`);
}

const pageTsx = readFileSync(path.join(root, "app/page.tsx"), "utf8");
const v12Imports = [
  "DecisionCard",
  "BtcCycleCard",
  "MarketEnvironmentCard",
  "MoversTop5Card",
  "AlphaPoolCard",
  "PositionAdviceCard",
  "RiskWarningsCard"
];

for (const symbol of v12Imports) {
  assert.match(pageTsx, new RegExp(symbol), `app/page.tsx should import/use ${symbol}`);
}

assert.match(
  pageTsx,
  /StrongChainTop/,
  "app/page.tsx should render StrongChainTop"
);
assert.match(
  pageTsx,
  /资金流向与结构性强信号/,
  "app/page.tsx should include strong signals section"
);

const dashboardAriaLabels = [
  { file: "components/dashboard/btc-cycle-card.tsx", label: "BTC 周期卡" },
  { file: "components/dashboard/market-environment-card.tsx", label: "市场环境评分卡" },
  { file: "components/dashboard/movers-top5-card.tsx", label: "主流币异动 Top 5" },
  { file: "components/dashboard/alpha-pool-card.tsx", label: "Alpha 观察池 Top 10" },
  { file: "components/dashboard/position-advice-card.tsx", label: "今日仓位建议" },
  { file: "components/dashboard/strong-chain-top.tsx", label: "强链 Top 3" },
  { file: "components/dashboard/strong-sector-top.tsx", label: "强赛道 Top 3" },
  { file: "components/dashboard/strong-protocol-top.tsx", label: "强协议 Top 5" }
];

for (const { file, label } of dashboardAriaLabels) {
  const content = readFileSync(path.join(root, file), "utf8");
  assert.match(content, new RegExp(label), `${file} should have aria-label: ${label}`);
}

const decisionCard = readFileSync(
  path.join(root, "components/dashboard/decision-card.tsx"),
  "utf8"
);
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

const prd = readFileSync(path.join(root, "docs/PRD.md"), "utf8");
assert.match(prd, /MVP 守边界版/, "docs/PRD.md should be V1.2 MVP 守边界版");

const universe = readFileSync(path.join(root, "data/watchlist-universe.ts"), "utf8");
const universeIdCount = (universe.match(/id:\s*"wl-/g) ?? []).length;
assert.ok(
  universeIdCount >= 25 && universeIdCount <= 32,
  `watchlist universe should have ~30 entries, got ${universeIdCount}`
);

const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
assert.equal(pkg.scripts?.test, "node tests/smoke.test.mjs", 'package.json scripts.test must be "node tests/smoke.test.mjs"');

console.log("smoke test passed.");

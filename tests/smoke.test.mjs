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
  "lib/research-overview.ts"
];

for (const relativePath of requiredPaths) {
  assert.ok(existsSync(path.join(root, relativePath)), `missing file: ${relativePath}`);
}

const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
assert.equal(pkg.scripts?.test, "node tests/smoke.test.mjs", 'package.json scripts.test must be "node tests/smoke.test.mjs"');

console.log("smoke test passed.");

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = process.env.PRD_SOURCE_PATH;
const dst = path.join(projectRoot, "docs", "PRD.md");

if (!src) {
  console.error("PRD_SOURCE_PATH environment variable is required.");
  process.exit(1);
}

if (!fs.existsSync(src)) {
  console.error(`Source file not found: ${src}`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(dst), { recursive: true });
fs.copyFileSync(src, dst);
console.log(`Copied ${src} -> ${dst}`);

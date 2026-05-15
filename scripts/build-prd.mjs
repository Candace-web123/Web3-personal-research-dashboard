import fs from "fs";

const src = "d:/产品文档/Web3个人投研系统产品文档_V1.1_补充产品化规则版.md";
const dst = "D:/AIProjects/web3-research-dashboard/docs/PRD.md";

fs.mkdirSync("docs", { recursive: true });
fs.copyFileSync(src, dst);

const text = fs.readFileSync(dst, "utf8");
const lines = text.split(/\r?\n/);
const lastNonempty = [...lines].reverse().find((l) => l.trim() !== "");

fs.writeFileSync(
  "docs/prd-verify.json",
  JSON.stringify(
    {
      lines: lines.length,
      first: lines[0],
      lastNonempty,
      trailingBlank: lines[lines.length - 1] === "",
    },
    null,
    2,
  ),
);

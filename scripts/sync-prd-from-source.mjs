import fs from "fs";

const src = "d:/产品文档/Web3个人投研系统产品文档_V1.1_补充产品化规则版.md";
const dst = "D:/AIProjects/web3-research-dashboard/docs/PRD.md";

fs.mkdirSync("D:/AIProjects/web3-research-dashboard/docs", { recursive: true });
fs.writeFileSync(dst, fs.readFileSync(src));

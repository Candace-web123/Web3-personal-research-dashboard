import type { AiFramework } from "./types";
import { AiFrameworkStatus } from "./types";

export const aiFramework: AiFramework[] = [
  {
    id: "ai-001",
    dimension: "赛道趋势",
    description: "判断项目所属赛道是否处于上升期",
    requiredData: "行业新闻、资金流、竞品动态",
    status: AiFrameworkStatus.Placeholder
  },
  {
    id: "ai-002",
    dimension: "项目基本面",
    description: "判断团队、产品、用户和商业模式",
    requiredData: "官网、白皮书、文档、用户数据",
    status: AiFrameworkStatus.Placeholder
  },
  {
    id: "ai-003",
    dimension: "代币经济",
    description: "判断代币供给、释放、用途和价值捕获",
    requiredData: "Tokenomics、解锁数据、流通盘",
    status: AiFrameworkStatus.Placeholder
  },
  {
    id: "ai-004",
    dimension: "数据表现",
    description: "判断链上数据、TVL、交易量、活跃用户",
    requiredData: "DefiLlama、Dune、链上数据",
    status: AiFrameworkStatus.Placeholder
  },
  {
    id: "ai-005",
    dimension: "风险因素",
    description: "判断监管、合约、安全、流动性等风险",
    requiredData: "审计报告、安全事件、监管新闻",
    status: AiFrameworkStatus.Placeholder
  },
  {
    id: "ai-006",
    dimension: "催化事件",
    description: "判断未来是否存在重要事件驱动",
    requiredData: "Roadmap、主网上线、空投、ETF、升级",
    status: AiFrameworkStatus.Placeholder
  },
  {
    id: "ai-007",
    dimension: "综合信心",
    description: "汇总前面维度，形成阶段性判断",
    requiredData: "上述所有信息",
    status: AiFrameworkStatus.Placeholder
  }
];

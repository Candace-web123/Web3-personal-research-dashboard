import type { Narrative } from "./types";
import { NarrativePriority, NarrativeStatus } from "./types";

export const narratives: Narrative[] = [
  {
    id: "narrative-001",
    title: "BTC 生态资产化",
    sector: "Bitcoin / L2",
    signal: "Ordinals、Runes、BTC L2 持续出现新项目",
    question: "是否有真实交易需求和流动性？",
    priority: NarrativePriority.High,
    status: NarrativeStatus.Watching
  },
  {
    id: "narrative-002",
    title: "RWA 叙事延续",
    sector: "RWA / DeFi",
    signal: "传统金融资产上链讨论增加",
    question: "收益来源是否可持续？",
    priority: NarrativePriority.Medium,
    status: NarrativeStatus.Watching
  },
  {
    id: "narrative-003",
    title: "AI Agent 重新升温",
    sector: "AI / Infra",
    signal: "多个 AI Agent 项目获得市场关注",
    question: "用户是否真的愿意付费？",
    priority: NarrativePriority.High,
    status: NarrativeStatus.Watching
  }
];

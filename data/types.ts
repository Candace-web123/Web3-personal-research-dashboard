/** PRD 研究状态 */
export const ResearchStatus = {
  Watchlist: "Watchlist",
  Researching: "Researching",
  ThesisFormed: "ThesisFormed",
  Paused: "Paused"
} as const;
export type ResearchStatus = (typeof ResearchStatus)[keyof typeof ResearchStatus];

/** PRD 风险等级 */
export const RiskLevel = {
  Low: "Low",
  Medium: "Medium",
  High: "High"
} as const;
export type RiskLevel = (typeof RiskLevel)[keyof typeof RiskLevel];

export const NarrativePriority = {
  Low: "Low",
  Medium: "Medium",
  High: "High"
} as const;
export type NarrativePriority = (typeof NarrativePriority)[keyof typeof NarrativePriority];

export const NarrativeStatus = {
  Watching: "Watching",
  Validated: "Validated",
  Paused: "Paused"
} as const;
export type NarrativeStatus = (typeof NarrativeStatus)[keyof typeof NarrativeStatus];

export const AiFrameworkStatus = {
  Placeholder: "Placeholder"
} as const;
export type AiFrameworkStatus = (typeof AiFrameworkStatus)[keyof typeof AiFrameworkStatus];

export type Asset = {
  id: string;
  name: string;
  symbol: string;
  sector: string;
  ecosystem?: string;
  researchStatus: ResearchStatus;
  riskLevel: RiskLevel;
  confidenceScore: number;
  thesis: string;
  nextAction: string;
  updatedAt: string;
};

export type Narrative = {
  id: string;
  title: string;
  sector: string;
  signal: string;
  question: string;
  priority: NarrativePriority;
  status: NarrativeStatus;
};

export type AiFramework = {
  id: string;
  dimension: string;
  description: string;
  requiredData: string;
  status: AiFrameworkStatus;
};

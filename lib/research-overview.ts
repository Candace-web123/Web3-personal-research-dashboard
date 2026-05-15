import type { Asset } from "@/data/types";
import { ResearchStatus, RiskLevel } from "@/data/types";

export type ResearchOverview = {
  totalAssets: number;
  activeResearchCount: number;
  averageConfidence: number | null;
  highRiskCount: number;
};

const VALID_RISK_LEVELS: ReadonlySet<string> = new Set<string>([
  RiskLevel.Low,
  RiskLevel.Medium,
  RiskLevel.High
]);

function isValidRiskLevel(value: unknown): value is Asset["riskLevel"] {
  return typeof value === "string" && VALID_RISK_LEVELS.has(value);
}

function isValidConfidenceScore(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;
}

export function calculateResearchOverview(assets: Asset[]): ResearchOverview {
  const totalAssets = assets.length;
  const activeResearchCount = assets.filter((a) => a.researchStatus === ResearchStatus.Researching).length;

  const validScores = assets.map((a) => a.confidenceScore).filter(isValidConfidenceScore);
  const averageConfidence =
    validScores.length === 0 ? null : validScores.reduce((sum, n) => sum + n, 0) / validScores.length;

  const highRiskCount = assets.filter(
    (a) => isValidRiskLevel(a.riskLevel) && a.riskLevel === RiskLevel.High
  ).length;

  return { totalAssets, activeResearchCount, averageConfidence, highRiskCount };
}

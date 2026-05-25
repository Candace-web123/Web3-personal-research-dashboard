// 决策审计引擎 · Decision Audit Trail
// 记录 AI 每次建议 + 用户行动 + 结果，建立可追溯的决策链。

import type { MarketRegime } from "./market-state-engine";
import type { RiskMode } from "./risk-mode-selector";

export type DecisionRecord = {
  id: string;
  timestamp: string;          // ISO 8601
  marketRegime: MarketRegime;
  riskMode: RiskMode;
  recommendation: string;     // AI 给出的核心建议（1-2 句）
  rationale: string;          // 决策依据
  userAction?: "followed" | "deviated" | "pending";
  userNote?: string;          // 用户备注
  outcome?: string;           // 事后评估（由后续复盘补充）
  outcomeRating?: "correct" | "neutral" | "incorrect";
};

export type AuditSummary = {
  totalDecisions: number;
  byRegime: Partial<Record<MarketRegime, number>>;
  byRiskMode: Partial<Record<RiskMode, number>>;
  followThroughRate: number;  // 0-1，用户执行比例
  accuracyRate: number;       // 0-1，正确建议比例（仅在已评估的决策中计算）
  recentDecisions: DecisionRecord[];
};

let idCounter = 0;

export function createDecisionRecord(
  marketRegime: MarketRegime,
  riskMode: RiskMode,
  recommendation: string,
  rationale: string,
): DecisionRecord {
  idCounter += 1;
  return {
    id: `DEC-${new Date().toISOString().slice(0, 10)}-${String(idCounter).padStart(3, "0")}`,
    timestamp: new Date().toISOString(),
    marketRegime,
    riskMode,
    recommendation,
    rationale,
  };
}

export function recordUserAction(
  record: DecisionRecord,
  action: "followed" | "deviated" | "pending",
  note?: string,
): DecisionRecord {
  return { ...record, userAction: action, userNote: note };
}

export function recordOutcome(
  record: DecisionRecord,
  outcome: string,
  rating: "correct" | "neutral" | "incorrect",
): DecisionRecord {
  return { ...record, outcome, outcomeRating: rating };
}

export function summarizeDecisions(records: DecisionRecord[]): AuditSummary {
  const byRegime: AuditSummary["byRegime"] = {};
  const byRiskMode: AuditSummary["byRiskMode"] = {};

  let followed = 0;
  let actionable = 0;
  let correct = 0;
  let rated = 0;

  for (const r of records) {
    byRegime[r.marketRegime] = (byRegime[r.marketRegime] ?? 0) + 1;
    byRiskMode[r.riskMode] = (byRiskMode[r.riskMode] ?? 0) + 1;

    if (r.userAction === "followed" || r.userAction === "deviated") {
      actionable += 1;
      if (r.userAction === "followed") followed += 1;
    }
    if (r.outcomeRating != null) {
      rated += 1;
      if (r.outcomeRating === "correct") correct += 1;
    }
  }

  return {
    totalDecisions: records.length,
    byRegime,
    byRiskMode,
    followThroughRate: actionable > 0 ? followed / actionable : 0,
    accuracyRate: rated > 0 ? correct / rated : 0,
    recentDecisions: records.slice(-10),
  };
}

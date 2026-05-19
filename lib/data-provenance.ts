import type {
  CardDataProvenanceSummary,
  DataFreshnessStatus,
  DataProvenanceCardId,
  DataProvenanceDailySnapshot
} from "@/data/types";
import { DataFreshnessStatus as Status } from "@/data/types";

const STATUS_SEVERITY: Record<DataFreshnessStatus, number> = {
  [Status.Normal]: 0,
  [Status.Delayed]: 1,
  [Status.SourceConflict]: 2,
  [Status.ManualOverride]: 2,
  [Status.Unavailable]: 3
};

/** 取最严重的数据新鲜度状态（用于卡片级综合状态） */
export function resolveOverallDataStatus(
  statuses: readonly DataFreshnessStatus[]
): DataFreshnessStatus {
  if (statuses.length === 0) return Status.Normal;
  return statuses.reduce((worst, current) =>
    STATUS_SEVERITY[current] > STATUS_SEVERITY[worst] ? current : worst
  );
}

export function getCardDataProvenance(
  cardId: DataProvenanceCardId,
  snapshot: DataProvenanceDailySnapshot
): CardDataProvenanceSummary {
  return snapshot.cards[cardId];
}

import type { AlphaPoolEntry, TokenTransmissionJudgement } from "@/data/types";
import {
  TokenTransmissionStrength,
  TokenTransmissionType
} from "@/data/types";

const TYPE_LABEL: Record<TokenTransmissionType, string> = {
  [TokenTransmissionType.CashFlow]: "\u73b0\u91d1\u6d41\u578b",
  [TokenTransmissionType.Buyback]: "\u56de\u8d2d\u578b",
  [TokenTransmissionType.Usage]: "\u4f7f\u7528\u578b",
  [TokenTransmissionType.GovernanceExpectation]: "\u6cbb\u7406\u9884\u671f\u578b",
  [TokenTransmissionType.None]: "\u65e0\u4f20\u5bfc"
};

const STRENGTH_LABEL: Record<TokenTransmissionStrength, string> = {
  [TokenTransmissionStrength.Strong]: "\u5f3a",
  [TokenTransmissionStrength.Medium]: "\u4e2d",
  [TokenTransmissionStrength.Weak]: "\u5f31",
  [TokenTransmissionStrength.None]: "\u65e0",
  [TokenTransmissionStrength.Uncertain]: "\u4e0d\u786e\u5b9a"
};

export function formatTokenTransmissionType(type: TokenTransmissionType): string {
  return TYPE_LABEL[type] ?? type;
}

export function formatTokenTransmissionStrength(
  strength: TokenTransmissionStrength
): string {
  return STRENGTH_LABEL[strength] ?? strength;
}

export function tokenTransmissionTypeTone(type: TokenTransmissionType): string {
  switch (type) {
    case TokenTransmissionType.CashFlow:
      return "border-emerald-200 bg-emerald-50 text-emerald-900";
    case TokenTransmissionType.Buyback:
      return "border-violet-200 bg-violet-50 text-violet-900";
    case TokenTransmissionType.Usage:
      return "border-sky-200 bg-sky-50 text-sky-900";
    case TokenTransmissionType.GovernanceExpectation:
      return "border-amber-200 bg-amber-50 text-amber-900";
    default:
      return "border-zinc-200 bg-zinc-50 text-zinc-700";
  }
}

export function tokenTransmissionStrengthTone(
  strength: TokenTransmissionStrength
): string {
  switch (strength) {
    case TokenTransmissionStrength.Strong:
      return "text-emerald-700";
    case TokenTransmissionStrength.Medium:
      return "text-sky-700";
    case TokenTransmissionStrength.Weak:
      return "text-amber-700";
    case TokenTransmissionStrength.Uncertain:
      return "text-rose-700";
    default:
      return "text-zinc-500";
  }
}

function assertTransmission(judgement: TokenTransmissionJudgement, token: string): void {
  if (!judgement.basis.length) {
    throw new Error(`[token-transmission] ${token}: basis must be non-empty`);
  }
  if (
    judgement.type === TokenTransmissionType.None &&
    judgement.strength !== TokenTransmissionStrength.None &&
    judgement.strength !== TokenTransmissionStrength.Uncertain
  ) {
    throw new Error(`[token-transmission] ${token}: None type requires None/Uncertain strength`);
  }
}

/** 开发期校验 Alpha 传导字段完整性 */
export function assertAlphaTokenTransmission(
  entries: readonly AlphaPoolEntry[] = []
): void {
  if (process.env.NODE_ENV === "production") return;
  for (const entry of entries) {
    assertTransmission(entry.tokenTransmission, entry.token);
  }
}

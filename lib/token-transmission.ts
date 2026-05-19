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

export function formatTokenTransmissionType(
  type: TokenTransmissionJudgement["type"]
): string {
  return TYPE_LABEL[type] ?? type;
}

export function formatTokenTransmissionStrength(
  strength: TokenTransmissionJudgement["strength"]
): string {
  return STRENGTH_LABEL[strength] ?? strength;
}

export function tokenTransmissionTypeTone(
  type: TokenTransmissionJudgement["type"]
): string {
  switch (type) {
    case TokenTransmissionType.CashFlow:
    case TokenTransmissionType.Buyback:
    case TokenTransmissionType.Usage:
      return "border-emerald-200 bg-emerald-50 text-emerald-900";
    case TokenTransmissionType.GovernanceExpectation:
      return "border-amber-200 bg-amber-50 text-amber-900";
    default:
      return "border-zinc-200 bg-zinc-100 text-zinc-700";
  }
}

export function tokenTransmissionStrengthTone(
  strength: TokenTransmissionJudgement["strength"]
): string {
  switch (strength) {
    case TokenTransmissionStrength.Strong:
      return "border-emerald-300 bg-emerald-50 text-emerald-950";
    case TokenTransmissionStrength.Medium:
      return "border-sky-200 bg-sky-50 text-sky-900";
    case TokenTransmissionStrength.Weak:
    case TokenTransmissionStrength.Uncertain:
      return "border-amber-200 bg-amber-50 text-amber-950";
    default:
      return "border-zinc-300 bg-zinc-100 text-zinc-700";
  }
}

/** 开发期校验：A 级不得弱/无传导（PRD 9.2.1） */
export function assertAlphaTokenTransmission(
  entries: readonly AlphaPoolEntry[]
): void {
  if (process.env.NODE_ENV === "production") return;

  for (const entry of entries) {
    const { strength } = entry.tokenTransmission;
    if (
      entry.grade === "A" &&
      (strength === TokenTransmissionStrength.Weak ||
        strength === TokenTransmissionStrength.None)
    ) {
      throw new Error(
        `[token-transmission] ${entry.token} grade A must not have weak/none transmission`
      );
    }
  }
}

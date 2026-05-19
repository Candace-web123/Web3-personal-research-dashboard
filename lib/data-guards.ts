import { ALPHA_POOL } from "@/data/alpha-pool";
import { BTC_CYCLE_SNAPSHOT } from "@/data/btc-cycle";
import { MARKET_ENVIRONMENT_SNAPSHOT } from "@/data/market-environment";
import { MOVERS_TOP5 } from "@/data/movers-top5";
import { POSITION_ADVICE_SNAPSHOT } from "@/data/position-advice";
import type { AlphaPoolEntry, OffchainDueDiligence, WatchlistUniverseEntry } from "@/data/types";
import { OffchainDueDiligenceRiskLevel } from "@/data/types";
import { DAILY_REVIEW_SNAPSHOT } from "@/data/daily-review";
import { DATA_PROVENANCE_DAILY_SNAPSHOT } from "@/data/data-provenance";
import { STRONG_SIGNALS_DAILY_SNAPSHOT } from "@/data/strong-signals";
import type {
  DailyReviewSnapshot,
  DataProvenanceDailySnapshot,
  StrongChainEntry,
  StrongProtocolEntry,
  StrongSectorEntry
} from "@/data/types";
import { DataProvenanceCardId } from "@/data/types";
import { WATCHLIST_UNIVERSE } from "@/data/watchlist-universe";
import { assertAlphaTokenTransmission } from "@/lib/token-transmission";

const STRONG_CHAIN_TOP = 3;
const STRONG_SECTOR_TOP = 3;
const STRONG_PROTOCOL_TOP = 5;

const WATCHLIST_UNIVERSE_MIN_LENGTH = 25;
const WATCHLIST_UNIVERSE_MAX_LENGTH = 32;
const MOVERS_TOP5_LENGTH = 5;
const ALPHA_POOL_MIN_LENGTH = 8;
const ALPHA_POOL_DISPLAY_MAX = 10;

/** 开发 / 测试期校验；生产构建下为 no-op，避免运行时抛错 */
function isDevAssertionEnabled(): boolean {
  return process.env.NODE_ENV !== "production";
}

function assertInvariant(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[v12-data-guard] ${message}`);
  }
}

/** 校验观察宇宙规模与 symbol / id 唯一性 */
export function assertWatchlistUniverse(
  universe: readonly WatchlistUniverseEntry[] = WATCHLIST_UNIVERSE
): void {
  if (!isDevAssertionEnabled()) return;

  assertInvariant(
    universe.length >= WATCHLIST_UNIVERSE_MIN_LENGTH &&
      universe.length <= WATCHLIST_UNIVERSE_MAX_LENGTH,
    `WATCHLIST_UNIVERSE length must be ${WATCHLIST_UNIVERSE_MIN_LENGTH}–${WATCHLIST_UNIVERSE_MAX_LENGTH}, got ${universe.length}`
  );

  const symbols = universe.map((entry) => entry.symbol);
  const ids = universe.map((entry) => entry.id);
  assertInvariant(
    new Set(symbols).size === symbols.length,
    "WATCHLIST_UNIVERSE symbols must be unique"
  );
  assertInvariant(
    new Set(ids).size === ids.length,
    "WATCHLIST_UNIVERSE ids must be unique"
  );
}

/** 校验异动 Top 5 条数，且 assetId 均存在于观察宇宙 */
export function assertMoversTop5(
  movers: readonly { assetId: string }[] = MOVERS_TOP5
): void {
  if (!isDevAssertionEnabled()) return;

  assertInvariant(
    movers.length === MOVERS_TOP5_LENGTH,
    `MOVERS_TOP5 must have exactly ${MOVERS_TOP5_LENGTH} entries, got ${movers.length}`
  );

  const universeIds = new Set(WATCHLIST_UNIVERSE.map((entry) => entry.id));
  for (const mover of movers) {
    assertInvariant(
      universeIds.has(mover.assetId),
      `Mover assetId "${mover.assetId}" not found in WATCHLIST_UNIVERSE`
    );
  }
}

/** 校验 Alpha 链下尽调 mock（TASK-021） */
export function assertAlphaOffchainDueDiligence(
  pool: readonly AlphaPoolEntry[] = ALPHA_POOL
): void {
  if (!isDevAssertionEnabled()) return;

  const validRiskLevels = new Set(Object.values(OffchainDueDiligenceRiskLevel));

  for (const entry of pool) {
    const label = `${entry.id} (${entry.token})`;
    const dd: OffchainDueDiligence | undefined = entry.offchainDueDiligence;

    assertInvariant(Boolean(dd), `${label}: offchainDueDiligence is required`);

    if (!dd) continue;

    assertInvariant(
      dd.keyFindings.length >= 1,
      `${label}: keyFindings must have at least 1 item`
    );
    assertInvariant(
      dd.unresolvedQuestions.length >= 1,
      `${label}: unresolvedQuestions must have at least 1 item`
    );
    assertInvariant(
      validRiskLevels.has(dd.riskLevel),
      `${label}: riskLevel must be a valid OffchainDueDiligenceRiskLevel`
    );
    assertInvariant(
      dd.lastReviewedAt.trim().length > 0,
      `${label}: lastReviewedAt must be non-empty`
    );

    for (const finding of dd.keyFindings) {
      assertInvariant(
        finding.trim().length > 0,
        `${label}: keyFindings must not contain empty strings`
      );
    }
    for (const question of dd.unresolvedQuestions) {
      assertInvariant(
        question.trim().length > 0,
        `${label}: unresolvedQuestions must not contain empty strings`
      );
    }
  }
}

/** 校验 Alpha 池条数下限与首页展示上限 */
export function assertAlphaPool(
  pool: readonly AlphaPoolEntry[] = ALPHA_POOL
): void {
  if (!isDevAssertionEnabled()) return;

  assertInvariant(
    pool.length >= ALPHA_POOL_MIN_LENGTH,
    `ALPHA_POOL should have at least ${ALPHA_POOL_MIN_LENGTH} entries, got ${pool.length}`
  );
  assertInvariant(
    pool.length <= ALPHA_POOL_DISPLAY_MAX,
    `ALPHA_POOL length must be ≤ ${ALPHA_POOL_DISPLAY_MAX} for homepage Top 10 cap, got ${pool.length}`
  );

  const ids = pool.map((entry) => entry.id);
  assertInvariant(
    new Set(ids).size === ids.length,
    "ALPHA_POOL ids must be unique"
  );

  assertAlphaOffchainDueDiligence(pool);
  assertAlphaTokenTransmission(pool);
}

/** 校验 V1.2 各快照 asOf 日期一致 */
export function assertV12SnapshotsAsOfAligned(): void {
  if (!isDevAssertionEnabled()) return;

  const asOfValues = new Set([
    BTC_CYCLE_SNAPSHOT.asOf,
    MARKET_ENVIRONMENT_SNAPSHOT.asOf,
    POSITION_ADVICE_SNAPSHOT.asOf,
    STRONG_SIGNALS_DAILY_SNAPSHOT.asOf,
    DATA_PROVENANCE_DAILY_SNAPSHOT.asOf,
    DAILY_REVIEW_SNAPSHOT.asOf
  ]);
  assertInvariant(
    asOfValues.size === 1,
    `V1.2 snapshot asOf must align; got: ${[...asOfValues].join(", ")}`
  );
}

function assertStrongSignalRanks<T extends { id: string; rank: number }>(
  label: string,
  entries: readonly T[],
  expectedLength: number
): void {
  assertInvariant(
    entries.length === expectedLength,
    `${label} must have exactly ${expectedLength} entries, got ${entries.length}`
  );
  const ids = entries.map((entry) => entry.id);
  assertInvariant(new Set(ids).size === ids.length, `${label} ids must be unique`);
  const ranks = entries.map((entry) => entry.rank).sort((a, b) => a - b);
  const expectedRanks = Array.from({ length: expectedLength }, (_, index) => index + 1);
  assertInvariant(
    ranks.every((rank, index) => rank === expectedRanks[index]),
    `${label} ranks must be 1..${expectedLength}`
  );
}

/** 校验强链 / 强赛道 / 强协议 Top 条数与 rank */
export function assertStrongSignals(
  snapshot = STRONG_SIGNALS_DAILY_SNAPSHOT
): void {
  if (!isDevAssertionEnabled()) return;

  assertStrongSignalRanks<StrongChainEntry>(
    "strong chains",
    snapshot.chains,
    STRONG_CHAIN_TOP
  );
  assertStrongSignalRanks<StrongSectorEntry>(
    "strong sectors",
    snapshot.sectors,
    STRONG_SECTOR_TOP
  );
  assertStrongSignalRanks<StrongProtocolEntry>(
    "strong protocols",
    snapshot.protocols,
    STRONG_PROTOCOL_TOP
  );

  assertInvariant(
    snapshot.strongestDirection.trim().length > 0,
    "strongestDirection must be non-empty"
  );
  assertInvariant(
    snapshot.sectionHeadline.trim().length > 0,
    "sectionHeadline must be non-empty"
  );
}

/** 校验数据可信度 mock：三卡齐全、指标非空、asOf 对齐 */
export function assertDataProvenance(
  snapshot: DataProvenanceDailySnapshot = DATA_PROVENANCE_DAILY_SNAPSHOT
): void {
  if (!isDevAssertionEnabled()) return;

  const cardIds = Object.values(DataProvenanceCardId);
  for (const cardId of cardIds) {
    const summary = snapshot.cards[cardId];
    assertInvariant(Boolean(summary), `data provenance card missing: ${cardId}`);
    assertInvariant(
      summary.metrics.length > 0,
      `data provenance metrics must be non-empty for ${cardId}`
    );
    assertInvariant(
      summary.displayUpdatedAtUtc.trim().length > 0,
      `displayUpdatedAtUtc must be set for ${cardId}`
    );
    assertInvariant(
      summary.primarySourcesSummary.trim().length > 0,
      `primarySourcesSummary must be set for ${cardId}`
    );
  }

  assertInvariant(
    snapshot.asOf === BTC_CYCLE_SNAPSHOT.asOf,
    `DATA_PROVENANCE asOf must match BTC_CYCLE_SNAPSHOT.asOf (${BTC_CYCLE_SNAPSHOT.asOf})`
  );
}

/** 校验每日复盘 mock（TASK-023） */
export function assertDailyReviewSnapshot(
  snapshot: DailyReviewSnapshot = DAILY_REVIEW_SNAPSHOT
): void {
  if (!isDevAssertionEnabled()) return;

  assertInvariant(
    snapshot.asOf.trim().length > 0,
    "DAILY_REVIEW_SNAPSHOT.asOf must be non-empty"
  );
  assertInvariant(
    snapshot.decisionSummary.trim().length > 0,
    "DAILY_REVIEW_SNAPSHOT.decisionSummary must be non-empty"
  );

  const nonEmptyList = (
    items: readonly string[],
    field: string
  ): void => {
    assertInvariant(items.length >= 1, `DAILY_REVIEW_SNAPSHOT.${field} must have at least 1 item`);
    for (const item of items) {
      assertInvariant(
        item.trim().length > 0,
        `DAILY_REVIEW_SNAPSHOT.${field} must not contain empty strings`
      );
    }
  };

  nonEmptyList(snapshot.whatWasRight, "whatWasRight");
  nonEmptyList(snapshot.whatWasWrong, "whatWasWrong");
  nonEmptyList(snapshot.signalsToTrackTomorrow, "signalsToTrackTomorrow");
  nonEmptyList(snapshot.riskFollowUps, "riskFollowUps");

  assertInvariant(
    snapshot.asOf === BTC_CYCLE_SNAPSHOT.asOf,
    `DAILY_REVIEW asOf must match BTC_CYCLE_SNAPSHOT.asOf (${BTC_CYCLE_SNAPSHOT.asOf})`
  );
}

/** 一次性运行全部 V1.2 mock 轻量校验（dev / test 用） */
export function assertV12MockData(): void {
  assertWatchlistUniverse();
  assertMoversTop5();
  assertAlphaPool();
  assertStrongSignals();
  assertDataProvenance();
  assertDailyReviewSnapshot();
  assertV12SnapshotsAsOfAligned();
}

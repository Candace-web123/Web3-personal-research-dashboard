import { STRONG_SIGNALS_DAILY_SNAPSHOT } from "@/data/strong-signals";
import type {
  StrongChainEntry,
  StrongProtocolEntry,
  StrongSectorEntry,
  StrongSignalsDailySnapshot
} from "@/data/types";

const CHAIN_TOP_CAP = 3;
const SECTOR_TOP_CAP = 3;
const PROTOCOL_TOP_CAP = 5;

/**
 * 返回强信号每日快照（MVP：静态 mock；未来可替换为 API）。
 */
export function getStrongSignalsDailySnapshot(): StrongSignalsDailySnapshot {
  return STRONG_SIGNALS_DAILY_SNAPSHOT;
}

/** 强链 Top 3：保持 mock 顺序，仅截断条数 */
export function getStrongChainTop3(
  chains: readonly StrongChainEntry[] = STRONG_SIGNALS_DAILY_SNAPSHOT.chains
): readonly StrongChainEntry[] {
  return chains.slice(0, CHAIN_TOP_CAP);
}

/** 强赛道 Top 3 */
export function getStrongSectorTop3(
  sectors: readonly StrongSectorEntry[] = STRONG_SIGNALS_DAILY_SNAPSHOT.sectors
): readonly StrongSectorEntry[] {
  return sectors.slice(0, SECTOR_TOP_CAP);
}

/** 强协议 Top 5 */
export function getStrongProtocolTop5(
  protocols: readonly StrongProtocolEntry[] = STRONG_SIGNALS_DAILY_SNAPSHOT.protocols
): readonly StrongProtocolEntry[] {
  return protocols.slice(0, PROTOCOL_TOP_CAP);
}

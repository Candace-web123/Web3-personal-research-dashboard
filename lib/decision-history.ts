// P4-1 Decision History — JSONL-based persistence for AI decision records.
// appendDecisionRecord() writes one line per decision to logs/decision-history/<date>.jsonl
// loadDecisionHistory() streams them back for backtesting / auditing.
//
// Guards:
//   - NEXT_PHASE check skips writes during build (page-data collection)
//   - DECISION_HISTORY_ENABLED=false disables entirely
//   - All I/O is async (fs.promises) — never blocks the event loop
//   - fs/readline imports will fail at bundle time if imported from client/edge
//     (no server-only needed — the Node built-ins are the guard)

import { existsSync, createReadStream } from "fs";
import { mkdir, appendFile, readdir } from "fs/promises";
import { join } from "path";
import { createInterface } from "readline";
import type { AiDecisionSnapshot } from "./ai-decision-orchestrator";
import type { LiveMarketData } from "./real-market-data";
import type { PortfolioSnapshot } from "./portfolio";
import type { PipelineResult } from "./pipeline";

export type DecisionHistoryRecord = {
  /** Schema version for forward-compatible parsing */
  version: 1;
  /** Unique ID: date-prefixed (e.g., "2026-05-26-a1b2c3d4") */
  requestId: string;
  /** ISO 8601 wall-clock timestamp of persistence */
  recordedAt: string;
  /** Business date this decision pertains to */
  asOf: string;
  /** Full AI decision output (engine result) */
  snapshot: AiDecisionSnapshot;
  /** Raw live data overrides (null = demo-only run) */
  liveInput: LiveMarketData | null;
  /** Portfolio snapshot used (post auto-price-fill) */
  portfolioInput: PortfolioSnapshot;
  /** Pipeline result: market state input + provenance + assessment */
  pipelineResult: PipelineResult;
};

const LOGS_DIR = join(process.cwd(), "logs", "decision-history");

// Only allow strict YYYY-MM-DD — prevents path traversal via malformed asOf
function safeDate(input: string): string | null {
  if (/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(input)) return input;
  return null;
}

async function ensureLogDir(): Promise<boolean> {
  try {
    await mkdir(LOGS_DIR, { recursive: true });
    return true;
  } catch {
    return false;
  }
}

/** True when persistence should run: not build, not explicitly disabled. */
export function isDecisionHistoryEnabled(): boolean {
  if (process.env.NEXT_PHASE === "phase-production-build") return false;
  if (process.env.DECISION_HISTORY_ENABLED === "false") return false;
  return true;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Append a single decision record to today's JSONL file. Never throws. */
export async function appendDecisionRecord(record: DecisionHistoryRecord): Promise<void> {
  if (!isDecisionHistoryEnabled()) return;
  try {
    if (!(await ensureLogDir())) return;
    const dateStr = safeDate(record.asOf.slice(0, 10));
    if (!dateStr) {
      console.error("[decision-history] invalid asOf:", record.asOf);
      return;
    }
    const filePath = join(LOGS_DIR, `${dateStr}.jsonl`);
    const line = JSON.stringify(record);
    await appendFile(filePath, line + "\n", "utf-8");
  } catch (err) {
    console.error("[decision-history] append failed:", err);
  }
}

/** Load decision history from JSONL files. When limit is set, returns the latest N records. */
export async function loadDecisionHistory(options?: {
  from?: string;   // "YYYY-MM-DD" inclusive
  to?: string;     // "YYYY-MM-DD" inclusive
  limit?: number;  // latest N records
}): Promise<DecisionHistoryRecord[]> {
  const results: DecisionHistoryRecord[] = [];
  try {
    if (!existsSync(LOGS_DIR)) return results;

    // Descending order: latest files first (for limit to return newest N)
    const files = (await readdir(LOGS_DIR))
      .filter((f) => f.endsWith(".jsonl"))
      .sort()
      .reverse();

    for (const file of files) {
      const dateStr = file.replace(".jsonl", "");
      if (options?.from && dateStr < options.from) continue;
      if (options?.to && dateStr > options.to) continue;

      // Buffer lines then parse in reverse (newest-first within file)
      const lines: string[] = [];
      const stream = createReadStream(join(LOGS_DIR, file), "utf-8");
      const rl = createInterface({ input: stream, crlfDelay: Infinity });

      for await (const line of rl) {
        if (line.trim()) lines.push(line);
      }

      for (let i = lines.length - 1; i >= 0; i--) {
        try {
          results.push(JSON.parse(lines[i]));
        } catch {
          // skip malformed lines
        }
        if (options?.limit && results.length >= options.limit) break;
      }

      if (options?.limit && results.length >= options.limit) break;
    }
  } catch (err) {
    console.error("[decision-history] load failed:", err);
  }
  return results;
}

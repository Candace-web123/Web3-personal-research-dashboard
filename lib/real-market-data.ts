// 真实市场数据获取层
// Async fetchers → Partial<RawMarketData>。API 超时/失败全部 fallback 为 null。
// 仅此文件做 fetch；其余 lib/ 保持纯函数。

import type { RawMarketData } from "./pipeline";

export type LiveMarketData = Pick<
  RawMarketData,
  "btcPriceUsd" | "ethPriceUsd" | "fearGreed" | "stablecoinTrend" | "avgFundingRate" | "oiChangeRate"
>;

async function fetchWithTimeout(
  url: string,
  opts: RequestInit = {},
  timeoutMs = 12000,
): Promise<Response | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// CoinGecko: BTC/ETH 价格
// ---------------------------------------------------------------------------

async function fetchCoinGeckoPrices(): Promise<{
  btcPriceUsd: number | null;
  ethPriceUsd: number | null;
}> {
  try {
    const url =
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd";
    const res = await fetchWithTimeout(url, { headers: { Accept: "application/json" } });
    if (!res?.ok) return { btcPriceUsd: null, ethPriceUsd: null };
    const json = await res.json();
    return {
      btcPriceUsd: json?.bitcoin?.usd ?? null,
      ethPriceUsd: json?.ethereum?.usd ?? null,
    };
  } catch {
    return { btcPriceUsd: null, ethPriceUsd: null };
  }
}

// ---------------------------------------------------------------------------
// Alternative.me: 恐惧贪婪指数
// ---------------------------------------------------------------------------

async function fetchFearGreed(): Promise<number | null> {
  try {
    const url = "https://api.alternative.me/fng/?limit=1";
    const res = await fetchWithTimeout(url, {}, 8000);
    if (!res?.ok) return null;
    const json = await res.json();
    const value = json?.data?.[0]?.value;
    return value != null ? Number(value) : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// DeFiLlama: 稳定币总市值趋势
// ---------------------------------------------------------------------------

export async function fetchStablecoinTrend(): Promise<"up" | "flat" | "down" | null> {
  try {
    const url = "https://stablecoins.llama.fi/stablecoins?includePrices=true";
    const res = await fetchWithTimeout(url, {}, 10000);
    if (!res?.ok) return null;
    const json = await res.json();
    const assets: unknown[] = json?.peggedAssets ?? [];
    if (!Array.isArray(assets) || assets.length === 0) return null;

    let totalNow = 0;
    let totalPrevWeek = 0;
    for (const a of assets) {
      if (typeof a !== "object" || a === null) continue;
      const rec = a as Record<string, unknown>;
      const circ = rec.circulating as Record<string, number> | undefined;
      const prev = rec.circulatingPrevWeek as Record<string, number> | undefined;
      if (circ?.peggedUSD != null) totalNow += circ.peggedUSD;
      if (prev?.peggedUSD != null) totalPrevWeek += prev.peggedUSD;
    }

    if (totalNow <= 0 || totalPrevWeek <= 0) return null;
    const changePct = ((totalNow - totalPrevWeek) / totalPrevWeek) * 100;

    if (changePct > 2) return "up";
    if (changePct < -2) return "down";
    return "flat";
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// CoinGlass: 资金费率 + 未平仓合约变化率
// Open API v2 — 需要 COINGLASS_API_KEY 环境变量
// Docs: coinglassSecret header 传 API key
// ---------------------------------------------------------------------------

export async function fetchCoinGlassData(): Promise<{
  avgFundingRate: number | null;
  oiChangeRate: number | null;
}> {
  const apiKey = process.env.COINGLASS_API_KEY;
  if (!apiKey) return { avgFundingRate: null, oiChangeRate: null };

  const headers = { coinglassSecret: apiKey, Accept: "application/json" };

  try {
    const [frRes, oiRes] = await Promise.all([
      fetchWithTimeout(
        "https://open-api.coinglass.com/public/v2/funding_usd",
        { headers },
        10000,
      ),
      fetchWithTimeout(
        "https://open-api.coinglass.com/public/v2/open_interest_agg?symbol=BTC&timeType=0",
        { headers },
        10000,
      ),
    ]);

    // Parse funding rate — average across exchanges
    let avgFundingRate: number | null = null;
    if (frRes?.ok) {
      const frJson = await frRes.json();
      const frData: unknown[] = frJson?.data ?? [];
      if (Array.isArray(frData) && frData.length > 0) {
        let sum = 0;
        let count = 0;
        for (const item of frData) {
          if (typeof item !== "object" || item === null) continue;
          const r = item as Record<string, unknown>;
          const rawRate = r.rate ?? r.fundingRate ?? r.uRate;
          const rate = typeof rawRate === "string" ? Number(rawRate) : typeof rawRate === "number" ? rawRate : null;
          if (rate != null && !Number.isNaN(rate)) {
            // CoinGlass returns rate as percentage; normalize to decimal (e.g. 0.01% → 0.0001)
            const normalized = rate > 1 ? rate / 100 : rate;
            sum += normalized;
            count += 1;
          }
        }
        if (count > 0) avgFundingRate = sum / count;
      }
    }

    // Parse OI change rate
    let oiChangeRate: number | null = null;
    if (oiRes?.ok) {
      const oiJson = await oiRes.json();
      const oiData = oiJson?.data;
      if (oiData != null && typeof oiData === "object") {
        const d = oiData as Record<string, unknown>;
        // Prefer pre-computed change rate from API (handle both string and number)
        const rawChange = d.changePercent ?? d.changeRate ?? d.h24Change;
        const changePct = typeof rawChange === "string" ? Number(rawChange) : typeof rawChange === "number" ? rawChange : null;
        if (changePct != null && !Number.isNaN(changePct)) {
          // Normalize: if >10 it's likely basis points or raw percentage
          oiChangeRate = Math.abs(changePct) > 10 ? changePct / 100 : changePct;
        }
        // Fallback: compute from current OI vs average (handle string/number)
        if (oiChangeRate == null) {
          const rawOI = d.openInterest ?? d.oi ?? d.value;
          const rawAvgOI = d.avgOpenInterest ?? d.avgOi ?? d.avgValue;
          const currentOI = typeof rawOI === "string" ? Number(rawOI) : typeof rawOI === "number" ? rawOI : null;
          const avgOI = typeof rawAvgOI === "string" ? Number(rawAvgOI) : typeof rawAvgOI === "number" ? rawAvgOI : null;
          if (currentOI != null && avgOI != null && avgOI > 0 && !Number.isNaN(currentOI) && !Number.isNaN(avgOI)) {
            oiChangeRate = (currentOI - avgOI) / avgOI;
          }
        }
      }
    }

    return { avgFundingRate, oiChangeRate };
  } catch {
    return { avgFundingRate: null, oiChangeRate: null };
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function fetchLiveMarketData(): Promise<LiveMarketData> {
  const [cg, fg, sc, glass] = await Promise.all([
    fetchCoinGeckoPrices(),
    fetchFearGreed(),
    fetchStablecoinTrend(),
    fetchCoinGlassData(),
  ]);

  return {
    btcPriceUsd: cg.btcPriceUsd,
    ethPriceUsd: cg.ethPriceUsd,
    fearGreed: fg,
    stablecoinTrend: sc,
    avgFundingRate: glass.avgFundingRate,
    oiChangeRate: glass.oiChangeRate,
  };
}

// ---------------------------------------------------------------------------
// Multi-coin price lookup — 用于持仓自动填价
// ---------------------------------------------------------------------------

/** 常见代币 symbol → CoinGecko API id 映射（按需扩展） */
const SYMBOL_TO_GECKO_ID: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  LINK: "chainlink",
  RNDR: "render-token",
  ARB: "arbitrum",
  ONDO: "ondo-finance",
  TAO: "bittensor",
  HYPE: "hyperliquid",
  PENDLE: "pendle",
  UNI: "uniswap",
  AAVE: "aave",
  OP: "optimism",
  MATIC: "polygon",
  DOT: "polkadot",
  AVAX: "avalanche-2",
  ATOM: "cosmos",
  NEAR: "near",
  INJ: "injective-protocol",
  TIA: "celestia",
  SUI: "sui",
  SEI: "sei-network",
  APT: "aptos",
  LDO: "lido-dao",
  ENA: "ethena",
  JTO: "jito-governance-token",
  EIGEN: "eigenlayer",
  WLD: "worldcoin-wld",
  STRK: "starknet",
};

export function getCoinGeckoId(symbol: string): string | undefined {
  return SYMBOL_TO_GECKO_ID[symbol.toUpperCase()];
}

export async function fetchAdditionalPrices(
  symbols: string[],
): Promise<Record<string, number>> {
  const result: Record<string, number> = {};
  const geckoIds: { symbol: string; id: string }[] = [];

  for (const sym of symbols) {
    const id = getCoinGeckoId(sym);
    if (id) geckoIds.push({ symbol: sym.toUpperCase(), id });
  }

  if (geckoIds.length === 0) return result;

  try {
    const idsParam = geckoIds.map((g) => g.id).join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${idsParam}&vs_currencies=usd`;
    const res = await fetchWithTimeout(url, { headers: { Accept: "application/json" } });
    if (!res?.ok) return result;
    const json = await res.json();

    for (const { symbol, id } of geckoIds) {
      const price = json?.[id]?.usd;
      if (typeof price === "number") result[symbol] = price;
    }
  } catch {
    // silent fallback
  }

  return result;
}

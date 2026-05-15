import { aiFramework } from "./ai-framework";
import { assets } from "./assets";
import { narratives } from "./narratives";
import type { AiFramework, Asset, Narrative } from "./types";

export function getAssets(): Asset[] {
  return assets;
}

export function getNarratives(): Narrative[] {
  return narratives;
}

export function getAiFramework(): AiFramework[] {
  return aiFramework;
}

export type { AiFramework, Asset, Narrative } from "./types";
export {
  AiFrameworkStatus,
  NarrativePriority,
  NarrativeStatus,
  ResearchStatus,
  RiskLevel
} from "./types";

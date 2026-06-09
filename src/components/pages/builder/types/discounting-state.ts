// ── Discounting Section State Types ───────────────────────────────────────────

import { AlgorithmThreshold } from "#/types/survey.ts";

/**
 * Immutable state shape for the Discounting section of the Link Builder.
 */
export interface DiscountingState {
  reinforcer: string;
  showFigures: boolean;
  showDebug: boolean;
  algorithm: AlgorithmThreshold;
  maxTrials: string;
  beta: string;
  compound: boolean;
  ssr: string;
  llr: string;
  delays: string;
  entropyThreshold: string;
}

/**
 * Action types for the Discounting section reducer.
 */
export type DiscountingAction =
  | { type: "SET_REINFORCER"; payload: string }
  | { type: "SET_SHOW_FIGURES"; payload: boolean }
  | { type: "SET_SHOW_DEBUG"; payload: boolean }
  | { type: "SET_ALGORITHM"; payload: AlgorithmThreshold }
  | { type: "SET_MAX_TRIALS"; payload: string }
  | { type: "SET_BETA"; payload: string }
  | { type: "SET_COMPOUND"; payload: boolean }
  | { type: "SET_SSR"; payload: string }
  | { type: "SET_LLR"; payload: string }
  | { type: "SET_DELAYS"; payload: string }
  | { type: "SET_ENTROPY_THRESHOLD"; payload: string };

/**
 * Initial state for the Discounting section.
 */
export const discountingInitialState: DiscountingState = {
  reinforcer: "Dollars",
  showFigures: false,
  showDebug: false,
  algorithm: AlgorithmThreshold.RegretMin,
  maxTrials: "20",
  beta: "0.25",
  compound: false,
  ssr: "50",
  llr: "100",
  delays: "",
  entropyThreshold: "0.25",
};

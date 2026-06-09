// ── Demand Section State Types ────────────────────────────────────────────────

import { AlgorithmThreshold } from "#/types/survey.ts";

/**
 * Immutable state shape for the Demand section of the Link Builder.
 */
export interface DemandState {
  reinforcer: string;
  showFigures: boolean;
  showDebug: boolean;
  algorithm: AlgorithmThreshold;
  maxTrials: string;
  beta: string;
  compound: boolean;
  prices: string;
  entropyThreshold: string;
  entropyWindowSize: string;
}

/**
 * Action types for the Demand section reducer.
 */
export type DemandAction =
  | { type: "SET_REINFORCER"; payload: string }
  | { type: "SET_SHOW_FIGURES"; payload: boolean }
  | { type: "SET_SHOW_DEBUG"; payload: boolean }
  | { type: "SET_ALGORITHM"; payload: AlgorithmThreshold }
  | { type: "SET_MAX_TRIALS"; payload: string }
  | { type: "SET_BETA"; payload: string }
  | { type: "SET_COMPOUND"; payload: boolean }
  | { type: "SET_PRICES"; payload: string }
  | { type: "SET_ENTROPY_THRESHOLD"; payload: string }
  | { type: "SET_ENTROPY_WINDOW_SIZE"; payload: string };

/**
 * Initial state for the Demand section.
 */
export const demandInitialState: DemandState = {
  reinforcer: "Coffee",
  showFigures: false,
  showDebug: false,
  algorithm: AlgorithmThreshold.RegretMin,
  maxTrials: "20",
  beta: "0.25",
  compound: false,
  prices: "",
  entropyThreshold: "0.25",
  entropyWindowSize: "3",
};

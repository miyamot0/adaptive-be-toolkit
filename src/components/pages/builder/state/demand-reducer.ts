// ── Demand Section Reducer ──────────────────────────────────────────────────────

import type { DemandState, DemandAction } from "../types/demand-state.js";

/**
 * Reducer function for the Demand section state.
 * Handles all state transitions for demand task configuration.
 */
export function demandReducer(
  state: DemandState,
  action: DemandAction,
): DemandState {
  switch (action.type) {
    case "SET_REINFORCER":
      return { ...state, reinforcer: action.payload };

    case "SET_SHOW_FIGURES":
      return { ...state, showFigures: action.payload };

    case "SET_SHOW_DEBUG":
      return { ...state, showDebug: action.payload };

    case "SET_ALGORITHM":
      return { ...state, algorithm: action.payload };

    case "SET_MAX_TRIALS":
      return { ...state, maxTrials: action.payload };

    case "SET_BETA":
      return { ...state, beta: action.payload };

    case "SET_COMPOUND":
      return { ...state, compound: action.payload };

    case "SET_PRICES":
      return { ...state, prices: action.payload };

    case "SET_ENTROPY_THRESHOLD":
      return { ...state, entropyThreshold: action.payload };

    // Default: return unchanged state for unknown actions
    default:
      return state;
  }
}

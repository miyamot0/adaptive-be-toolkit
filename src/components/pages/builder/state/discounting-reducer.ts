// ── Discounting Section Reducer ─────────────────────────────────────────────────

import type {
  DiscountingState,
  DiscountingAction,
} from "../types/discounting-state.js";

/**
 * Reducer function for the Discounting section state.
 * Handles all state transitions for discounting task configuration.
 */
export function discountingReducer(
  state: DiscountingState,
  action: DiscountingAction,
): DiscountingState {
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

    case "SET_SSR":
      return { ...state, ssr: action.payload };

    case "SET_LLR":
      return { ...state, llr: action.payload };

    case "SET_DELAYS":
      return { ...state, delays: action.payload };

    case "SET_ENTROPY_THRESHOLD":
      return { ...state, entropyThreshold: action.payload };

    // Default: return unchanged state for unknown actions
    default:
      return state;
  }
}

// ── Types Barrel Export ────────────────────────────────────────────────────────

/**
 * State interfaces for the Link Builder page.
 */
export type { DemandState } from "./demand-state.js";
export type { DiscountingState } from "./discounting-state.js";

/**
 * Action types for the Link Builder page reducers.
 */
export type { DemandAction } from "./demand-state.js";
export type { DiscountingAction } from "./discounting-state.js";

/**
 * Reducer function type definitions.
 */
export type {
  Reducer,
  DemandReducer,
  DiscountingReducer,
} from "./reducer-types.js";

/**
 * Initial state constants for the Link Builder page.
 */
export { demandInitialState } from "./demand-state.js";
export { discountingInitialState } from "./discounting-state.js";

// ── Reducer Type Definitions ───────────────────────────────────────────────────

import type { DemandState, DemandAction } from "./demand-state.js";
import type {
  DiscountingState,
  DiscountingAction,
} from "./discounting-state.js";

/**
 * Generic reducer function signature for state management.
 *
 * @template TState - The state type
 * @template TAction - The action type union
 */
export type Reducer<TState, TAction> = (
  state: TState,
  action: TAction,
) => TState;

/**
 * Demand section reducer function type.
 */
export type DemandReducer = Reducer<DemandState, DemandAction>;

/**
 * Discounting section reducer function type.
 */
export type DiscountingReducer = Reducer<DiscountingState, DiscountingAction>;

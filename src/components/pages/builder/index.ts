// ── Link Builder Module Barrel Export ───────────────────────────────────────────

/**
 * Main Link Builder page component.
 */
export { default as LinkBuilderPage } from "./link-builder-page.js";

/**
 * State management for the Link Builder page.
 */
export type { DemandState, DiscountingState } from "./types/index.js";
export type { DemandAction, DiscountingAction } from "./types/index.js";
export type {
  Reducer,
  DemandReducer,
  DiscountingReducer,
} from "./types/reducer-types.js";

/**
 * Initial state constants.
 */
export { demandInitialState } from "./types/demand-state.js";
export { discountingInitialState } from "./types/discounting-state.js";

/**
 * URL builder utilities.
 */
export {
  buildDemandUrl,
  buildDiscountingUrl,
  PLACEHOLDER_ID,
} from "#/lib/posm/builder/url-builders.js";

/**
 * State management functions.
 */
export { demandReducer } from "./state/demand-reducer.js";
export { discountingReducer } from "./state/discounting-reducer.js";

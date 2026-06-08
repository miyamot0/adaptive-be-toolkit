import { BeliefUpdating } from "../types/enums";
import type { DemandAgent } from "./demand-agent";

export type IncludeIndex = true;
export type ExcludeIndex = false;

export type IncludeIndexType = IncludeIndex | ExcludeIndex;

/** agent_update_improvement
 *
 * Update agent improvement
 *
 * @param {number} expend observed reinforcer value quantity
 * @param {DemandAgent} algo observed reinforcer value quantity
 */
export function agent_update_improvement(expend: number, algo: DemandAgent) {
  algo.max_expend_price = algo.prediction;
  algo.max_expend = expend;
  algo.max_q = expend / algo.prediction;
}

/** agent_auto_preserve_index
 *
 * Automatically detect if the current index_max should be preserved from suppression.
 * This ensures that when we find a new peak expenditure, we keep belief at that price point.
 *
 * @param {BeliefUpdating} observation the type of belief update being performed
 * @param {DemandAgent} algo algorithm state
 * @returns {boolean} true if current index should not be suppressed (auto-preserve)
 */
export function agent_auto_preserve_index(
  observation: BeliefUpdating,
  algo: DemandAgent,
): boolean {
  const lastSpend = algo.last_spend ?? algo.max_expend;

  // If we haven't observed any expenditure yet, no auto-preservation
  if (lastSpend === undefined) return false;

  // CRITICAL FIX: Zero spend means non-consumption - don't preserve in early exploration!
  // This prevents the algorithm from stopping when first response is zero/non-consuming
  // Only consider preservation after we've gathered enough responses AND observed actual consumption
  if (algo.responses.length < algo.min_responses) return false;

  // CRITICAL FIX: If current lastSpend is zero or undefined, don't auto-preserve - continue exploring!
  if (lastSpend <= 0 || lastSpend === undefined) return false;

  // Check recent performance history (last 3-5 responses)
  const minHistory = Math.max(2, algo.responses.length - 4);
  const recentMaxRevenue = Math.max(
    ...algo.responses.slice(minHistory).map((r) => r.Revenue),
  );

  const lastResponse = algo.responses[algo.responses.length - 1];

  // Auto-preserve if:
  // 1. Last response tied or exceeded the recent maximum
  // 2. AND we're observing consistent performance (not just a single outlier)
  if (
    lastResponse.Revenue >= recentMaxRevenue &&
    lastResponse.Revenue === algo.max_expend
  ) {
    return true;
  }

  // Additional check: if price increased and expenditure improved, preserve the index
  if (observation === BeliefUpdating.AboveIndex) {
    const lastP = algo.last_p ?? algo.prediction;
    // FIX: Handle zero spend - skip ratio calculation if no valid data
    if (lastSpend <= 0 || lastP <= 0) return false;

    const currentExpToPriceRatio = lastSpend / lastP;
    const historicalMaxRatio =
      algo.max_expend_price > 0 && algo.max_expend > 0
        ? algo.max_expend / algo.max_expend_price
        : 0;

    if (currentExpToPriceRatio >= historicalMaxRatio) {
      return true;
    }
  }

  // Additional check: if price decreased and expenditure improved, preserve the index
  if (observation === BeliefUpdating.BelowIndex) {
    const lastP = algo.last_p ?? algo.prediction;
    // FIX: Handle zero spend - skip ratio calculation if no valid data
    if (lastSpend <= 0 || lastP <= 0) return false;

    const currentExpToPriceRatio = lastSpend / lastP;
    const historicalMaxRatio =
      algo.max_expend_price > 0 && algo.max_expend > 0
        ? algo.max_expend / algo.max_expend_price
        : 0;

    if (currentExpToPriceRatio >= historicalMaxRatio) {
      return true;
    }
  }

  return false;
}

/** agent_update_beliefs_nonconsumption_current
 *
 * Update agent beliefs based on observed change direction
 * Automatically preserves current index when it represents an improvement/match
 *
 * @param {DemandAgent} algo observed reinforcer value quantity
 */
export function agent_update_beliefs_nonconsumption_current(algo: DemandAgent) {
  return algo.beliefs.slice().map((value: number, i: number) => {
    if (!algo.index_max) throw new Error("index_max is undefined!");

    return i >= algo.index_max ? value * algo.get_suppression_factor() : value;
  });
}

/** agent_update_beliefs_first_consumption
 *
 * Update agent beliefs based on observed change direction
 * Automatically preserves current index when it represents an improvement/match
 *
 * @param {DemandAgent} algo observed reinforcer value quantity
 */
export function agent_update_beliefs_first_consumption(algo: DemandAgent) {
  return algo.beliefs.slice().map((value: number, i: number) => {
    if (!algo.index_max) throw new Error("index_max is undefined!");

    // Note: Penalize all higher, but NOT the current index
    return i > algo.index_max ? value * algo.get_suppression_factor() : value;
  });
}

/** agent_update_beliefs
 *
 * Update agent beliefs based on observed change direction
 * Automatically preserves current index when it represents an improvement/match
 *
 * @param {BeliefUpdating} observation observed belief updating direction
 * @param {DemandAgent} algo observed reinforcer value quantity
 * @param {IncludeIndexType} includeIndex whether to explicitly protect the current index from suppression
 */
export function agent_update_beliefs(
  observation: BeliefUpdating,
  algo: DemandAgent,
  includeIndex: IncludeIndexType = false,
) {
  const indexPrediction = algo.prediction;
  const indexMax = algo.index_max;
  const valueAtIndexMax =
    indexMax !== undefined ? algo.levels[indexMax] : undefined;

  const suppressionFactor = algo.get_suppression_factor();

  // AUTO-PRESERVATION: Detect if current index should be preserved based on performance trends
  const autoPreserveCurrentIndex = agent_auto_preserve_index(observation, algo);

  console.log(`suppression factor: ${suppressionFactor}`);

  switch (observation) {
    case BeliefUpdating.BelowIndex:
      console.log("Deprioritize LOWER prices");
      return algo.beliefs.slice().map((value: number, i: number) => {
        if (!algo.index_max) throw new Error("index_max is undefined!");

        // When auto says DON'T protect (zero spend), allow suppression even if includeIndex=true
        const shouldProtect =
          //autoPreserveCurrentIndex === true || // Auto-protect wins
          !includeIndex; // If caller didn't request protection, don't suppress all

        console.log(`should protect: ${shouldProtect}`);

        return !shouldProtect ? value * suppressionFactor : value;
      });
    case BeliefUpdating.AboveIndex:
      console.log("Deprioritize HIGHER prices");
      return algo.beliefs.slice().map((value: number, i: number) => {
        if (!algo.index_max) throw new Error("index_max is undefined!");

        // CRITICAL FIX: When auto says DON'T protect (zero spend), ignore includeIndex!
        const shouldProtect =
          //autoPreserveCurrentIndex === true || // Auto-protect wins
          !includeIndex; // If caller didn't request protection, don't suppress all

        console.log(`should protect: ${shouldProtect}`);

        return !shouldProtect ? value * suppressionFactor : value;
      });

    default:
      throw new Error(
        "Invalid BeliefUpdating value provided to agent_update_beliefs",
      );
  }
}

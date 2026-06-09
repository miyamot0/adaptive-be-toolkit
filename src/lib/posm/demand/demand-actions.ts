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
  const suppressionFactor = algo.get_suppression_factor();

  switch (observation) {
    case BeliefUpdating.BelowIndex:
      return algo.beliefs.slice().map((value: number, i: number) => {
        if (!algo.index_max) throw new Error("index_max is undefined!");

        const shouldProtect = !includeIndex;

        return !shouldProtect ? value * suppressionFactor : value;
      });
    case BeliefUpdating.AboveIndex:
      return algo.beliefs.slice().map((value: number, i: number) => {
        if (!algo.index_max) throw new Error("index_max is undefined!");

        const shouldProtect = !includeIndex;

        return !shouldProtect ? value * suppressionFactor : value;
      });

    default:
      throw new Error(
        "Invalid BeliefUpdating value provided to agent_update_beliefs",
      );
  }
}

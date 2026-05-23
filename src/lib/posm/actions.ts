import { BeliefUpdating, } from "../enums";
import { POSM } from "./posm";

export type IncludeIndex = true;
export type ExcludeIndex = false;

export type IncludeIndexType = IncludeIndex | ExcludeIndex;

/** agent_update_improvement
 *
 * Update agent improvement
 *
 * @param {number} expend observed reinforcer value quantity
 * @param {POSM} algo observed reinforcer value quantity
 */
export function agent_update_improvement(expend: number, algo: POSM) {
  algo.max_expend_price = algo.prediction;
  algo.max_expend = expend;
  algo.max_q = expend / algo.prediction;
}

/** agent_update_beliefs
 *
 * Update agent beliefs
 *
 * @param {BeliefUpdating} observation observed belief updating
 * @param {POSM} algo observed reinforcer value quantity
 */
export function agent_update_beliefs(observation: BeliefUpdating, algo: POSM, includeIndex: IncludeIndexType = false) {

  switch (observation) {
    case BeliefUpdating.BelowIndex:
      // Note: Beliefs updated at/below index, higher prices more interesting
      return algo.beliefs.slice().map((value: number, i: number) => {
        if (!algo.index_max) throw new Error("index_max is undefined!");

        if (includeIndex) {
          return i >= algo.index_max ? value : value * algo.beta;
        }

        return (i > algo.index_max ? value : value * algo.beta);
      });
    case BeliefUpdating.AboveIndex:
      // Note: Beliefs updated at/above index, low prices more interesting
      return algo.beliefs.slice().map((value: number, i: number) => {
        if (!algo.index_max) throw new Error("index_max is undefined!");

        if (includeIndex) {
          return i <= algo.index_max ? value : value * algo.beta;
        }

        return (i < algo.index_max ? value : value * algo.beta);
      });

    default:
      throw new Error("Invalid BeliefUpdating value provided to agent_update_beliefs");
  }
}

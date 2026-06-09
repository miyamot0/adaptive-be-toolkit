import type { DemandAgent } from "./demand-agent";

/** agent_observed_improvement
 *
 * Determine if agent observed improvement
 *
 * @param {number} expend observed reinforcer value quantity
 * @param {DemandAgent} algo observed reinforcer value quantity
 * @returns {boolean}
 */
export function agent_observed_improvement(expend: number, algo: DemandAgent) {
  return expend > algo.max_expend;
}

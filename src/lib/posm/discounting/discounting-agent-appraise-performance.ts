import type { DiscountingAgent } from "./discounting-agent";

/** agent_observed_improvement
 *
 * Determine if agent observed improvement
 *
 * @param {boolean} waited whether the agent waited
 * @param {number} delay observed delay
 * @param {DiscountingAgent} algo observed reinforcer value quantity
 * @returns {boolean}
 */
export function agent_observed_improvement(waited: boolean, delay: number, algo: DiscountingAgent) {
    return waited && delay > algo.max_wait;
}

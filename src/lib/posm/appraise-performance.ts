import type { POSM } from "./posm";

/** agent_observed_improvement
 *
 * Determine if agent observed improvement
 *
 * @param {number} expend observed reinforcer value quantity
 * @param {POSM} algo observed reinforcer value quantity
 * @returns {boolean}
 */
export function agent_observed_improvement(expend: number, algo: POSM) {
    return expend > algo.max_expend;
}

/** agent_observed_identical
 * 
 * Determine if agent observed identical
 * 
 * @param {number} expend observed reinforcer value quantity
 * @param {POSM} algo observed reinforcer value quantity
 * @returns {boolean}
 */
export function agent_observed_identical(expend: number, algo: POSM) {
    return expend === algo.max_expend;
}
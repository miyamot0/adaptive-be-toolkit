import type { DiscountingResponseProvided } from "#/types/discounting/discounting-response-output.ts";
import type { DemandAgent } from "../posm/demand/demand-agent";
import type { DiscountingAgent } from "../posm/discounting/discounting-agent";

/** sum_array
 *
 * Sum all elements in an array
 *
 * @param {number[]} arr array to sum
 * @returns {number}
 */
function sum_array(arr: number[]): number {
  return arr.reduce((prev_value, belief) => prev_value + belief, 0);
}

/** select_by_index
 *
 * Select elements in array by index
 *
 * @param {number[]} arr Array to select from
 * @param {number} start_index start index
 * @param {number} end_index end index
 * @returns {number[]}
 */
function select_by_index(
  arr: number[],
  start_index: number,
  end_index: number,
) {
  const result = [];

  for (let i = start_index; i <= end_index; i++) {
    result.push(arr[i]);
  }

  return result;
}

/** argmin
 *
 *  Evaluate believes across policies given beliefs
 *
 * @param {number[]} beliefs
 * @returns
 */
export function argmin(beliefs: number[]): number[] {
  const A = Array(beliefs.length)
    .fill(0)
    .map((_, i) => sum_array(select_by_index(beliefs, 0, i)));

  const B = Array(beliefs.length)
    .fill(0)
    .map((_, i) => sum_array(select_by_index(beliefs, i, beliefs.length - 1)));

  return Array(beliefs.length)
    .fill(0)
    .map((_, i) => {
      return Math.min(A[i], B[i]);
    });
}

/** argmax
 *
 *  Find index of maximum value in array
 *
 * @param {number[]} arr array
 * @returns
 */
export function argmax(arr: number[]): number {
  if (arr.length === 0) {
    throw new Error("Array is empty");
  }

  let max = arr[0];
  let maxIndex = 0;

  arr.forEach((val, i) => {
    if (val > max) {
      maxIndex = i;
      max = val;
    }
  });

  return maxIndex;
}

/** pullNormalizationConstant
 *
 * Scan through array to get peak, thus normalizing beliefs
 *
 * @param {number[]} arr array
 * @returns {number}
 */
export function pullNormalizationConstant(arr: number[]) {
  return Math.max(...arr);
}

/** normalizeBeliefs
 *
 * Normalize beliefs
 *
 * @param {number[]} arr beliefs
 * @returns {number[]} normalized beliefs
 *
 * */
export function normalizeBeliefs(arr: number[]) {
  const max = pullNormalizationConstant(arr);

  return arr.map((val) => val / max);
}

/** appendDemandResponse
 *
 * Append response to demand algorithm, including entropy of the current belief
 * distribution at the time of the observation.
 *
 * @param {DemandAgent} algo algorithm
 * @param {number} expend observed reinforcer value quantity
 * @param {number} entropy Shannon entropy (nats) of beliefsCumulative after this trial
 *
 */
export function appendDemandResponse(
  algo: DemandAgent,
  expend: number,
  entropy: number,
) {
  algo.responses.push({
    Price: algo.prediction,
    Quantity: expend / algo.prediction,
    Revenue: expend,
    Entropy: entropy,
  });
}

/** computeEntropy
 *
 * Compute Shannon entropy (nats) of a normalized belief distribution.
 * Returns H = -∑ p·ln(p), treating p=0 as contributing 0 (per convention).
 * Maximum entropy for N beliefs is ln(N); entropy decreases as beliefs
 * concentrate around the ED50 estimate.
 *
 * @param {number[]} beliefs normalized probability distribution (must sum to 1)
 * @returns {number} entropy in nats
 */
export function computeEntropy(beliefs: number[]): number {
  return -beliefs.reduce((acc, p) => acc + (p > 0 ? p * Math.log(p) : 0), 0);
}

/** appendDiscountingResponse
 *
 * Append response to algorithm
 *
 * @param {DiscountingAgent} algo algorithm instance
 * @param {boolean} waited whether the participant chose to wait for the LLR
 * @param {number} entropy belief entropy (nats) at the time of this response
 *
 */
export function appendDiscountingResponse(
  algo: DiscountingAgent,
  waited: boolean,
  entropy: number,
) {
  algo.responses.push({
    Delay: algo.prediction,
    SSR: algo.ssr,
    LLR: algo.llr,
    Waited: waited,
    Entropy: entropy,
  } satisfies DiscountingResponseProvided);
}

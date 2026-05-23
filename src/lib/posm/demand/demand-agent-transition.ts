import { EvaluateChange } from "../../enums";
import type { DemandAgent } from "./demand-agent";

/** agent_pathway
 *
 * Determine agent pathway
 *
 * @param {DemandAgent} algo agent internal state
 * @returns {EvaluateChange}
 */
export function agent_pathway(algo: DemandAgent) {
    // Note: Predicted price is greater than previous empirical pmax
    if (algo.prediction > algo.max_expend_price)
        return EvaluateChange.PriceIncreased;

    // Note: Predicted price is equal to previous empirical pmax
    //if (algo.prediction === algo.max_expend_price)
    //  return EvaluateChange.PriceIdentical;

    // Note: Default is to explore lower prices
    return EvaluateChange.PriceDecreased;
}

import { AlgorithmAction } from "../types/enums";
import { is_undefined } from "../../helpers/type-check";
import type { DemandAgent } from "./demand-agent";

/** agent_decision
 *
 * Assist agent in acting next
 *
 * @param {number} expend expenditure observed
 * @param {DemandAgent} algo agent internal state
 * @returns
 */
export function agent_decision(expend: number, algo: DemandAgent) {
    // Note: Action in zero -- pretty much always consistent (include index as zero)
    if (expend <= 0) return AlgorithmAction.NonconsumptionFound;

    // Note: Pretty much the standard after consumption recorded
    if (!is_undefined(algo.last_q))
        return AlgorithmAction.ConsumptionFoundNonInitial;

    // Note: The default if a 'first' measure of consumption
    return AlgorithmAction.ConsumptionFoundInitial;
}
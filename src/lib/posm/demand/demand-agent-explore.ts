import { BeliefUpdating } from "../types/enums";
import { appendDemandResponse, normalizeBeliefs } from "../../helpers/arrays";
import {
  agent_update_beliefs,
  agent_update_improvement,
} from "./demand-actions";
import { agent_observed_improvement } from "./demand-agent-appraise-performance";
import type { DemandAgent } from "./demand-agent";

/** explore_zero
 *
 * In the face of non-consumption, explore space in direction of consumption
 *
 * @param {number} expend observed reinforcer value quantity
 * @param {DemandAgent} algo observed reinforcer value quantity
 */
export function explore_zero(expend: number, algo: DemandAgent) {
  if (!algo.index_max)
    throw new Error("index_max is undefined, algorithm needs initialization!");

  // Note: by logic, if at zero, later prices are very silly
  const new_beliefs = agent_update_beliefs(
    BeliefUpdating.AboveIndex,
    algo,
    true,
  );
  const improved_estimate = agent_observed_improvement(expend, algo);

  if (improved_estimate) agent_update_improvement(expend, algo);

  algo.beliefs = normalizeBeliefs(new_beliefs);

  const totalBeliefs = algo.beliefs.reduce((acc, curr) => acc + curr, 0);
  algo.beliefsCumulative = algo.beliefs.map((value) => {
    return value / totalBeliefs;
  });

  const entropy = algo.compute_entropy();

  appendDemandResponse(algo, expend, entropy);

  algo.notes = "Zero Consumption Observed";
  algo.get_prediction();
  algo.increment_turn();
}

/** explore_non_zero
 *
 * Non-zero consumption levels observed initially, explore space to evaluate relative change afterward
 *
 * @param {number} expend observed reinforcer value quantity
 * @param {DemandAgent} algo observed reinforcer value quantity
 */
export function explore_non_zero(expend: number, algo: DemandAgent) {
  if (!algo.index_max)
    throw new Error("index_max is undefined, algorithm needs initialization!");

  const new_beliefs = agent_update_beliefs(
    BeliefUpdating.AboveIndex,
    algo,
    true,
  );

  const improved_estimate = agent_observed_improvement(expend, algo);

  algo.last_regret = algo.max_expend - expend;
  algo.last_p = algo.prediction;
  algo.last_spend = expend;
  algo.last_q = expend / algo.prediction;

  if (improved_estimate) {
    agent_update_improvement(expend, algo);
  }

  algo.beliefs = normalizeBeliefs(new_beliefs);

  const totalBeliefs = algo.beliefs.reduce((acc, curr) => acc + curr, 0);
  algo.beliefsCumulative = algo.beliefs.map((value) => {
    return value / totalBeliefs;
  });

  const entropy = algo.compute_entropy();

  appendDemandResponse(algo, expend, entropy);

  algo.notes = "First move";
  algo.get_prediction();
  algo.increment_turn();
}

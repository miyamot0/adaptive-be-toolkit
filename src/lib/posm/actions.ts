import { AlgorithmAction, BeliefUpdating, EvaluateChange } from "../enums";
import { appendResponse, normalizeBeliefs } from "../helpers/arrays";
import { is_undefined } from "../helpers/type-check";
import { POSM } from "./posm";

export type IncludeIndex = true;
export type ExcludeIndex = false;

export type IncludeIndexType = IncludeIndex | ExcludeIndex;

/** agent_decision
 *
 * Assist agent in acting next
 *
 * @param {number} expend expenditure observed
 * @param {POSM} algo agent internal state
 * @returns
 */
export function agent_decision(expend: number, algo: POSM) {
  // Note: Action in zero -- pretty much always consistent (include index as zero)
  if (expend <= 0) return AlgorithmAction.NonconsumptionFound;

  // Note: Pretty much the standard after consumption recorded
  if (!is_undefined(algo.last_q))
    return AlgorithmAction.ConsumptionFoundNonInitial;

  // Note: The default if a 'first' measure of consumption
  return AlgorithmAction.ConsumptionFoundInitial;
}

/** agent_pathway
 *
 * Determine agent pathway
 *
 * @param {POSM} algo agent internal state
 * @returns {EvaluateChange}
 */
export function agent_pathway(algo: POSM) {
  // Note: Predicted price is greater than previous empirical pmax
  if (algo.prediction > algo.max_expend_price)
    return EvaluateChange.PriceIncreased;

  // Note: Predicted price is equal to previous empirical pmax
  //if (algo.prediction == algo.max_expend_price)
  //  return EvaluateChange.PriceIdentical;

  // Note: Default is to explore lower prices
  return EvaluateChange.PriceDecreased;
}

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

export function agent_observed_identical(expend: number, algo: POSM) {
  return expend === algo.max_expend;
}

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
    case BeliefUpdating.AtIndex:
      if (includeIndex === false) {
        return algo.beliefs.slice().map((value: number, i: number) => {
          if (!algo.index_max) throw new Error("index_max is undefined!");

          return i === algo.index_max ? value : value * algo.beta;
        });
      }

      // Note: Beliefs not updated because PMAX revisited and no change
      return algo.beliefs;
  }
}

/** explore_zero
 *
 * In the face of non-consumption, explore space in direction of consumption
 *
 * @param {number} expend observed reinforcer value quantity
 * @param {POSM} algo observed reinforcer value quantity
 */
export function explore_zero(expend: number, algo: POSM) {
  if (!algo.index_max)
    throw new Error("index_max is undefined, algorithm needs initialization!");

  // Note: by logic, if at zero, later prices are very silly
  const new_beliefs = agent_update_beliefs(BeliefUpdating.AboveIndex, algo, true);
  const improved_estimate = agent_observed_improvement(expend, algo);

  if (improved_estimate) agent_update_improvement(expend, algo);

  algo.beliefs = normalizeBeliefs(new_beliefs);

  const totalBeliefs = algo.beliefs.reduce((acc, curr) => acc + curr, 0);
  algo.beliefsCumulative = algo.beliefs.map((value) => {
    return value / totalBeliefs;
  });

  appendResponse(algo, expend);

  algo.notes = "Zero Consumption Observed";
  algo.get_prediction();
  algo.increment_turn();
}

/** explore_non_zero
 *
 * Non-zero consumption levels observed initially, explore space to evaluate relative change afterward
 *
 * @param {number} expend observed reinforcer value quantity
 * @param {POSM} algo observed reinforcer value quantity
 */
export function explore_non_zero(expend: number, algo: POSM) {
  if (!algo.index_max)
    throw new Error("index_max is undefined, algorithm needs initialization!");

  const new_beliefs = agent_update_beliefs(BeliefUpdating.AboveIndex, algo, true);

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

  appendResponse(algo, expend);

  algo.notes = "First move";
  algo.get_prediction();
  algo.increment_turn();
}

/** exploit
 *
 * Explore parameter space by exploiting available information
 *
 * @param {number} expend observed reinforcer value quantity
 * @param {POSM} algo observed reinforcer value quantity
 */
export function exploit(expend: number, algo: POSM) {
  if (!algo.index_max)
    throw new Error("index_max is undefined, algorithm needs initialization!");

  let new_beliefs = algo.beliefs.slice();

  const price_direction = agent_pathway(algo);
  const improved_estimate = agent_observed_improvement(expend, algo);
  const identical_estimate = agent_observed_identical(expend, algo);

  const n_nonzero = algo.responses.filter(
    (response: { Revenue: number }) => response.Revenue > 0
  );

  if (price_direction === EvaluateChange.PriceIncreased) {
    // Update beliefs in the context of price increase
    if (improved_estimate) {
      new_beliefs = agent_update_beliefs(BeliefUpdating.BelowIndex, algo, true);
      algo.notes = "Inelastic Revenue Function";
    } else {
      new_beliefs = agent_update_beliefs(BeliefUpdating.AboveIndex, algo, true);
      algo.notes = "Elastic Revenue Function";
    }
  } else if (price_direction === EvaluateChange.PriceDecreased) {
    // Update beliefs in the context of price decrease
    if (
      improved_estimate ||
      n_nonzero.length < algo.min_nonzero_consumption_points
    ) {
      // Note: if improved estimate or not enough non-zero consumption points
      new_beliefs = agent_update_beliefs(BeliefUpdating.AboveIndex, algo, false);
      algo.notes = "Elastic Revenue Function (A)";
    } else {
      new_beliefs = agent_update_beliefs(BeliefUpdating.BelowIndex, algo, true);
      algo.notes = "Inelastic Revenue Function (B)";
    }
  } else if (price_direction === EvaluateChange.PriceIdentical) {
    if (identical_estimate) {
      new_beliefs = agent_update_beliefs(BeliefUpdating.AtIndex, algo, false);

      algo.notes = "Retread PMAX: but expend was underestimate";
    } else if (improved_estimate) {
      // Update beliefs in the context of price identical
      new_beliefs = agent_update_beliefs(BeliefUpdating.AboveIndex, algo, false);
      algo.notes = "Retread PMAX: but expend was underestimate";
    } else {
      new_beliefs = agent_update_beliefs(BeliefUpdating.BelowIndex, algo, true);
      algo.notes = "Repeat PMAX: different expend";
    }
  }

  algo.last_regret = algo.max_expend - expend;
  algo.last_p = algo.prediction;
  algo.last_spend = expend;
  algo.last_q = expend / algo.prediction;

  if (improved_estimate) agent_update_improvement(expend, algo);

  algo.beliefs = normalizeBeliefs(new_beliefs);

  const totalBeliefs = algo.beliefs.reduce((acc, curr) => acc + curr, 0);
  algo.beliefsCumulative = algo.beliefs.map((value) => {
    return value / totalBeliefs;
  });

  appendResponse(algo, expend);

  algo.get_prediction();
  algo.increment_turn();
}

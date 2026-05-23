import { AlgorithmThreshold } from "@/types/survey";
import { DemandAgent } from "../posm/demand/demand-agent";
import type { DiscountingAgent } from "../posm/discounting/discounting-agent";

const CONCENTRATION_THRESHOLD_SINGLE = 0.68; // Note: 68% of the probability mass is concentrated in a single belief

export function evaluate_threshold(posm: DemandAgent) {
  switch (posm.threshhold) {
    case AlgorithmThreshold.None:
      return false;

    case AlgorithmThreshold.MaximumIteration:
      if (posm.turn > posm.max_turns) return true;

      return false;

    case AlgorithmThreshold.RegretMin:
      throw new Error("Not implemented");

    case AlgorithmThreshold.BeliefConcentration:
      if (posm.responses.length < 5) return false;

      const sortedBeliefsCumulative = [...posm.beliefsCumulative].sort((a, b) => b - a);
      const highestBelief = Math.max(...sortedBeliefsCumulative);
      const nAtHighestBelief = sortedBeliefsCumulative.filter(b => b === highestBelief).length;

      if (highestBelief > CONCENTRATION_THRESHOLD_SINGLE) {
        // Note: Highest belief is greater than the concentration threshold and only one belief has that value
        // Note: Single optimal price scenario
        return true
      };

      const twoHighestBeliefs = sortedBeliefsCumulative.slice(0, 2);
      const totalAtTwoHighest = twoHighestBeliefs.reduce((acc, val) => acc + val, 0);

      if (totalAtTwoHighest > CONCENTRATION_THRESHOLD_SINGLE && nAtHighestBelief === 2) {
        // Note: Total of the two highest beliefs is greater than the concentration threshold and only two beliefs have that value
        // Note: Unobserved single optimal price scenario (two equally likely options on each side)
        return true
      }

      const threeHighestBeliefs = sortedBeliefsCumulative.slice(0, 3);
      const totalAtThreeHighest = threeHighestBeliefs.reduce((acc, val) => acc + val, 0);

      if (totalAtThreeHighest > CONCENTRATION_THRESHOLD_SINGLE && nAtHighestBelief === 1) {
        // Note: Total of the three highest beliefs is greater than the concentration threshold, with two possible options on each side
        // Note: Uncertain singular optimal price scenario (one likely option, two potential options on each side)
        return true
      }

      return false;

    default:
      throw new Error(`Unknown threshold type: ${posm.threshhold}`);
  }
}

export function evaluate_discounting_threshold(posm: DiscountingAgent) {
  switch (posm.threshhold) {
    case AlgorithmThreshold.None:
      return false;

    case AlgorithmThreshold.MaximumIteration:
      if (posm.turn > posm.max_turns) return true;

      return false;

    case AlgorithmThreshold.RegretMin:
      throw new Error("Not implemented");

    case AlgorithmThreshold.BeliefConcentration:
      if (posm.responses.length < 5) return false;

      const sortedBeliefsCumulative = [...posm.beliefsCumulative].sort((a, b) => b - a);
      const highestBelief = Math.max(...sortedBeliefsCumulative);
      const nAtHighestBelief = sortedBeliefsCumulative.filter(b => b === highestBelief).length;

      if (highestBelief > CONCENTRATION_THRESHOLD_SINGLE) {
        // Note: Highest belief is greater than the concentration threshold and only one belief has that value
        // Note: Single optimal price scenario
        return true
      };

      const twoHighestBeliefs = sortedBeliefsCumulative.slice(0, 2);
      const totalAtTwoHighest = twoHighestBeliefs.reduce((acc, val) => acc + val, 0);

      if (totalAtTwoHighest > CONCENTRATION_THRESHOLD_SINGLE && nAtHighestBelief === 2) {
        // Note: Total of the two highest beliefs is greater than the concentration threshold and only two beliefs have that value
        // Note: Unobserved single optimal price scenario (two equally likely options on each side)
        return true
      }

      const threeHighestBeliefs = sortedBeliefsCumulative.slice(0, 3);
      const totalAtThreeHighest = threeHighestBeliefs.reduce((acc, val) => acc + val, 0);

      if (totalAtThreeHighest > CONCENTRATION_THRESHOLD_SINGLE && nAtHighestBelief === 1) {
        // Note: Total of the three highest beliefs is greater than the concentration threshold, with two possible options on each side
        // Note: Uncertain singular optimal price scenario (one likely option, two potential options on each side)
        return true
      }

      return false;

    default:
      throw new Error(`Unknown threshold type: ${posm.threshhold}`);
  }
}

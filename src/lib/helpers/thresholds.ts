import { AlgorithmThreshold } from "@/types/survey";
import { POSM } from "../posm/posm";

export function evaluate_threshold(posm: POSM) {
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

      if (highestBelief > 0.9 && nAtHighestBelief === 1) {
        // Note: Highest belief is greater than 0.9 and only one belief has that value
        return true
      };

      const twoHighestBeliefs = sortedBeliefsCumulative.slice(0, 2);
      const totalAtTwoHighest = twoHighestBeliefs.reduce((acc, val) => acc + val, 0);

      if (totalAtTwoHighest > .80 && nAtHighestBelief === 2) {
        // Note: Total of the two highest beliefs is greater than 0.8 and only two beliefs have that value
        return true
      }

      const threeHighestBeliefs = sortedBeliefsCumulative.slice(0, 3);
      const totalAtThreeHighest = threeHighestBeliefs.reduce((acc, val) => acc + val, 0);

      if (totalAtThreeHighest > .80) {
        // Note: Total of the three highest beliefs is greater than 0.8
        return true
      }

      return false;

    default:
      throw new Error(`Unknown threshold type: ${posm.threshhold}`);
  }
}

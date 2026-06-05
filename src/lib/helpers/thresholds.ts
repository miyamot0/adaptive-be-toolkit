import { AlgorithmThreshold } from "@/types/survey";
import type { DemandAgent } from "../posm/demand/demand-agent";
import type { DiscountingAgent } from "../posm/discounting/discounting-agent";

const ENTROPY_PLATEAU_THRESHOLD = 0.01; // Minimum average per-trial entropy drop (nats) to consider beliefs still concentrating
const ENTROPY_WINDOW = 3; // Number of recent trials used to compute the rolling ∆H average

export function evaluate_threshold(posm: DemandAgent) {
  switch (posm.threshhold) {
    case AlgorithmThreshold.MaximumIteration:
      if (posm.turn > posm.max_turns) return true;

      return false;

    case AlgorithmThreshold.RegretMin: {
      // Plateau detection: returns true when the average per-trial entropy drop
      // over the last ENTROPY_WINDOW trials falls below ENTROPY_PLATEAU_THRESHOLD,
      // indicating beliefs have stopped concentrating and no new information is
      // being gained from additional trials.
      if (posm.responses.length < posm.min_responses) return false;

      const window = posm.responses.slice(-ENTROPY_WINDOW - 1);

      if (window.length < 2) return false;

      let totalDrop = 0;
      for (let i = 1; i < window.length; i++) {
        totalDrop += window[i - 1].Entropy - window[i].Entropy;
      }
      const avgDrop = totalDrop / (window.length - 1);

      return avgDrop < ENTROPY_PLATEAU_THRESHOLD;
    }

    default:
      throw new Error(`Unknown threshold type: ${posm.threshhold}`);
  }
}

export function evaluate_discounting_threshold(posm: DiscountingAgent) {
  switch (posm.threshhold) {
    case AlgorithmThreshold.MaximumIteration:
      if (posm.turn > posm.max_turns) return true;

      return false;

    case AlgorithmThreshold.RegretMin: {
      // Plateau detection: returns true when the average per-trial entropy drop
      // over the last ENTROPY_WINDOW trials falls below ENTROPY_PLATEAU_THRESHOLD,
      // indicating beliefs have stopped concentrating and no new information is
      // being gained from additional trials.
      if (posm.responses.length < posm.min_responses) return false;

      const window = posm.responses.slice(-ENTROPY_WINDOW - 1);

      if (window.length < 2) return false;

      let totalDrop = 0;
      for (let i = 1; i < window.length; i++) {
        totalDrop += window[i - 1].Entropy - window[i].Entropy;
      }
      const avgDrop = totalDrop / (window.length - 1);

      return avgDrop < ENTROPY_PLATEAU_THRESHOLD;
    }

    default:
      throw new Error(`Unknown threshold type: ${posm.threshhold}`);
  }
}

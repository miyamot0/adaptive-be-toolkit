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
  }
}

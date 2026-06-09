import { AlgorithmThreshold } from "@/types/survey";
import { argmax, argmin } from "../../helpers/arrays";
import { Algorithm } from "../common/algorithm";
import { exploit } from "./discounting-agent-exploit";
import type { DiscountingResponseProvided } from "#/types/discounting/discounting-response-output.ts";

const ENTROPY_WINDOW = 3; // Number of recent trials used to compute the rolling ∆H average

export class DiscountingAgent extends Algorithm {
  id: string | undefined = undefined;

  // Last quantity
  last_choice: boolean | undefined = undefined;
  // Last price
  last_delay: number | undefined = undefined;

  // Max expenditure
  max_wait = 0;
  // Max price assoc. w/ expenditure

  // Responses across task
  responses: DiscountingResponseProvided[] = [];

  // Decision-making for termination
  threshhold = AlgorithmThreshold.MaximumIteration;

  ssr = 50;
  llr = 100;

  /** reset
   *
   * reset core algo object
   *
   */
  public reset() {
    this.beta = 0.5;
    this.turn = 1;

    this.n_levels = 0;
    this.beliefs = [];
    this.beliefsCumulative = [];
    this.levels = [];

    this.prediction = -1;
    this.index_max = undefined;
    this.notes = "";

    this.last_choice = undefined;
    this.last_delay = undefined;

    this.last_regret = undefined;

    this.max_wait = 0;
    this.min_responses = 5;
    this.compoundSuppression = false;

    this.responses = [];
  }

  /** _init
   *
   * Initialize algorithm w/ levels (base beliefs)
   *
   * @param {number[]} levels levels assigned
   */
  public init(levels: number[], id?: string, dynamicBeta?: number): void {
    this.id = id;
    this.levels = levels;
    this.beta = dynamicBeta ?? this.beta;
    this.n_levels = this.levels.length;
    this.beliefs = Array(this.n_levels).fill(1);
    this.beliefsCumulative = Array(this.n_levels).fill(1);

    this.index_max = argmax(argmin(this.beliefs));
    this.max_wait = this.prediction = this.levels[this.index_max];
  }

  /**
   * setValues
   *
   * @param {number} ssr smaller-sooner reinforcer value
   * @param {number} llr larger-later reinforcer value
   * @returns {void}
   */
  public setValues(ssr: number, llr: number) {
    this.ssr = ssr;
    this.llr = llr;
  }

  /** iterate
   *
   * Learning step for algorithm
   *
   * @param {number} value reinforcer value/expenditure quantity
   */
  public iterate(value: number) {
    const waited = value === 1 ? true : false;

    exploit(waited, this);
  }

  /** get_prediction
   *
   * Evaluate responding according to competing policies
   *
   */
  public get_prediction() {
    this.index_max = argmax(argmin(this.beliefs));
    this.prediction = this.levels[this.index_max];
  }

  /** increment_turn
   *
   * Increment turn
   *
   */
  public increment_turn() {
    this.turn += 1;
  }

  /**
   * set_algorithm
   *
   * Set the algorithm threshold for termination
   *
   * @param {AlgorithmThreshold} threshhold
   * @returns {void}
   */
  public set_algorithm(threshhold: AlgorithmThreshold) {
    this.threshhold = threshhold;
  }

  public evaluate_threshold() {
    switch (this.threshhold) {
      case AlgorithmThreshold.MaximumIteration:
        if (this.turn > this.max_turns) return true;

        return false;

      case AlgorithmThreshold.RegretMin: {
        // Plateau detection: returns true when the average per-trial entropy drop
        // over the last ENTROPY_WINDOW trials falls below ENTROPY_PLATEAU_THRESHOLD,
        // indicating beliefs have stopped concentrating and no new information is
        // being gained from additional trials.
        if (this.responses.length < this.min_responses) return false;

        const window = this.responses.slice(-ENTROPY_WINDOW - 1);

        if (window.length < 2) return false;

        let totalDrop = 0;
        for (let i = 1; i < window.length; i++) {
          totalDrop += window[i - 1].Entropy - window[i].Entropy;
        }
        const avgDrop = totalDrop / (window.length - 1);

        return avgDrop < this.entropy_threshold;
      }

      default:
        throw new Error(`Unknown threshold type: ${this.threshhold}`);
    }
  }
}

import { AlgorithmThreshold } from "@/types/survey";
import { argmax, argmin } from "../../helpers/arrays";
import { Algorithm } from "../common/algorithm";
import type { DiscountingResponseProvided } from "#/types/discounting.ts";
import { exploit } from "./discounting-agent-exploit";

export class DiscountingAgent extends Algorithm {
  id: string | undefined = undefined;

  // Last quantity
  last_choice: boolean | undefined = undefined;
  // Last price
  last_delay: number | undefined = undefined;

  // Max expenditure
  max_wait: number = 0;
  // Max price assoc. w/ expenditure

  // Responses across task
  responses: DiscountingResponseProvided[] = [];

  // Decision-making for termination
  threshhold = AlgorithmThreshold.MaximumIteration;

  // Minimum number of responses required before threshold evaluation begins
  min_responses: number = 5;

  ssr: number = 50;
  llr: number = 100;

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

  /**
   * set_min_responses
   *
   * Set the minimum number of responses required before any threshold
   * evaluation begins. Acts as a warm-up period to ensure sufficient
   * data is collected before convergence checking starts.
   *
   * @param {number} n minimum response count (must be >= 1)
   * @returns {void}
   */
  public set_min_responses(n: number) {
    this.min_responses = Math.max(1, n);
  }
}

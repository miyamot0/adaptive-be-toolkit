import { AlgorithmThreshold, type ResponseProvided } from "@/types/survey";
import {
  agent_decision,
  exploit,
  explore_non_zero,
  explore_zero,
} from "./actions";
import { Algorithm } from "./algorithm";
import { argmax, argmin } from "../helpers/arrays";
import { AlgorithmAction } from "../enums";

const BETA = 0.25;

export class POSM extends Algorithm {
  // Last spend
  last_spend: number | undefined = undefined;
  // Last quantity
  last_q: number | undefined = undefined;
  // Last price
  last_p: number | undefined = undefined;

  // Max expenditure
  max_expend: number = 0;
  // Max price assoc. w/ expenditure
  max_expend_price: number = 0;
  // Max quantity assoc. w/ expenditure
  max_q: number = 0;

  // Responses across task
  responses: ResponseProvided[] = [];

  // Callback after threshold hit
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  callback?: Function;

  // Decision-making for termination
  threshhold = AlgorithmThreshold.MaximumIteration;

  // Iteration count ceiling
  max_turns = 10;

  // Question holder
  question_block_reference: string | undefined = undefined;

  // Minimum non-zero consumptions before exploit
  min_nonzero_consumption_points = 3;

  /** reset
   *
   * reset core algo object
   *
   */
  public reset() {
    this.beta = BETA;
    this.turn = 1;

    this.n_levels = 0;
    this.beliefs = [];
    this.beliefsCumulative = [];
    this.levels = [];

    this.prediction = -1;
    this.index_max = undefined;
    this.notes = "";

    this.last_spend = undefined;
    this.last_q = undefined;
    this.last_p = undefined;
    this.last_regret = undefined;

    this.max_expend = 0;
    this.max_expend_price = 0;
    this.max_q = 0;

    this.responses = [];
  }

  /** set_question_block_reference
   *
   * Set the question block reference
   *
   * @param {String} ref id for question block
   */
  public set_question_block_reference(ref: string) {
    this.question_block_reference = ref;
  }

  /** set_callback
   *
   * Assign how to report back after algorithm terminates
   *
   * @param {Function} cb
   */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  public set_callback(cb: Function) {
    this.callback = cb;
  }

  /** set_max_turns
   *
   * Set the maximum number of turns
   *
   * @param {number} turns
   */
  public set_max_turns(turns: number) {
    this.max_turns = turns;
  }

  /** set min_nonzero_consumption_points
   *
   * Set the minimum number of non-zero consumption points
   *
   * @param {number} points
   */
  public set_min_nonzero_consumption_points(points: number) {
    this.min_nonzero_consumption_points = points;
  }

  /** _init
   *
   * Initialize algorithm w/ levels (base beliefs)
   *
   * @param {number[]} levels levels assigned
   */
  public init(levels: number[], dynamicBeta?: number): void {
    this.levels = levels;
    this.beta = dynamicBeta ?? BETA;
    this.n_levels = this.levels.length;
    this.beliefs = Array(this.n_levels).fill(1);
    this.beliefsCumulative = Array(this.n_levels).fill(1);

    this.index_max = argmax(argmin(this.beliefs));
    this.max_expend_price = this.prediction = this.levels[this.index_max];
  }

  /** iterate
   *
   * Learning step for algorithm
   *
   * @param {number} value reinforcer value/expenditure quantity
   */
  public iterate(value: number) {
    const action: AlgorithmAction = agent_decision(value, this);

    console.log(action)

    switch (action) {
      case AlgorithmAction.NonconsumptionFound:
        explore_zero(value, this);
        break;
      case AlgorithmAction.ConsumptionFoundInitial:
        explore_non_zero(value, this);
        break;
      case AlgorithmAction.ConsumptionFoundNonInitial:
        exploit(value, this);
        break;
    }
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
}

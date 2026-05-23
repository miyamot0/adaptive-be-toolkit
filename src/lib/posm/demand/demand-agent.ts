import { AlgorithmThreshold, type ResponseProvided } from "@/types/survey";
import { Algorithm } from "../algorithm";
import { argmax, argmin } from "../../helpers/arrays";
import { AlgorithmAction } from "../../enums";
import { agent_decision } from "./demand-agent-decision";
import { explore_non_zero, explore_zero } from "./demand-agent-explore";
import { exploit } from "./demand-agent-exploit";

export class DemandAgent extends Algorithm {
  id: string | undefined = undefined;

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
    this.beta = 0.5;
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

  /** set_max_turns
   *
   * Set the maximum number of turns
   *
   * @param {number} turns
   */


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
  public init(levels: number[], id?: string, dynamicBeta?: number): void {
    this.id = id;
    this.levels = levels;
    this.beta = dynamicBeta ?? this.beta;
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
}

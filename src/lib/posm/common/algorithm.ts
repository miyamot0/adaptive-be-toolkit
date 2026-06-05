export abstract class Algorithm {
  // Adaptation rate
  beta: number = 0.5;
  // Current iteration
  turn: number = 1;

  // Number of levels
  n_levels: number = 0;
  // Beliefs for levels
  beliefs: number[] = [];
  // Beliefs for levels cumulative
  beliefsCumulative: number[] = [];
  // Levels
  levels: number[] = [];
  // Last regret
  last_regret: number | undefined = undefined;

  // Predicted level to explore next
  prediction: number = -1;
  // Index of the predicted level to explore next
  index_max: number | undefined = undefined;
  // Notes
  notes: string = "";

  // Iteration count ceiling
  max_turns = 20;

  // Whether to use compounding suppression: applies beta^turn instead of beta each trial
  compoundSuppression: boolean = false;

  // Minimum number of responses required before threshold evaluation begins
  min_responses: number = 5;

  public abstract init(levels: number[]): void;

  public abstract iterate(value: number): void;

  public abstract get_prediction(): void;

  public set_max_turns(turns: number) {
    this.max_turns = turns;
  }

  /** set_compound_suppression
   *
   * Enable or disable compounding suppression (beta^turn instead of beta per trial)
   *
   * @param {boolean} enabled
   */
  public set_compound_suppression(enabled: boolean) {
    this.compoundSuppression = enabled;
  }

  /**
   * set_min_responses
   *
   * Set the minimum number of responses required before any threshold
   * evaluation begins. Acts as a warm-up period to ensure sufficient
   * data is collected before convergence checking starts.
   *
   * @param {number} n minimum response count (must be >= 1)
   */
  public set_min_responses(n: number) {
    this.min_responses = Math.max(1, n);
  }

  /** get_suppression_factor
   *
   * Returns the suppression factor for belief updating:
   * - Compound mode: beta^turn (accelerating suppression over trials)
   * - Fixed mode: beta (constant suppression each trial)
   *
   * @returns {number} suppression factor to apply to belief updates
   */
  public get_suppression_factor(): number {
    return this.compoundSuppression ? this.beta ** this.turn : this.beta;
  }

  /** compute_entropy
   *
   * Compute Shannon entropy (nats) of the current cumulative belief distribution.
   * H = -∑ p·ln(p), treating p=0 as contributing 0.
   *
   * @returns {number} entropy in nats
   */
  public compute_entropy(): number {
    return -this.beliefsCumulative.reduce(
      (acc, p) => acc + (p > 0 ? p * Math.log(p) : 0),
      0,
    );
  }
}

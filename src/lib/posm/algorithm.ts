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

  public abstract init(levels: number[]): void;

  public abstract iterate(value: number): void;

  public abstract get_prediction(): void;

  public set_max_turns(turns: number) {
    this.max_turns = turns;
  }
}

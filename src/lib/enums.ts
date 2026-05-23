export enum AlgorithmAction {
  NonconsumptionFound,
  ConsumptionFoundNonInitial,
  ConsumptionFoundInitial,
}

export enum EvaluateChange {
  PriceIncreased,
  //PriceIdentical,
  PriceDecreased,
}

export enum BeliefUpdating {
  BelowIndex,
  AboveIndex,
  AtIndex,
}

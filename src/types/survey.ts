export type ResponseProvided = {
    Price: number;
    Quantity: number;
    Revenue: number;
};

export type PastQuestionType = ResponseProvided & { index: number };

export enum AlgorithmThreshold {
    None = "None",
    MaximumIteration = "MaximumIteration",
    RegretMin = "RegretMin",
    BeliefConcentration = "BeliefConcentration",
}
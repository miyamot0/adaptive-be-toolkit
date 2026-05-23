export type DemandResponseProvided = {
    Price: number;
    Quantity: number;
    Revenue: number;
};

export type PastDemandQuestionType = DemandResponseProvided & { index: number };
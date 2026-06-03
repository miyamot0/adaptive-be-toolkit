/**
 * Responses logged on each iteration
 */
export type DemandResponseProvided = {
    Price: number;
    Quantity: number;
    Revenue: number;
};

/**
 * Type for past demand question, which includes the original response plus an index for ordering
 */
export type PastDemandQuestionType = DemandResponseProvided & { index: number };
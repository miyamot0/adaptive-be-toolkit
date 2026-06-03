
/**
 * Responses logged on each iteration of the discounting task.
 */
export type DiscountingResponseProvided = {
    Delay: number;
    SSR: number;
    LLR: number;
    Waited: boolean;
    /** Belief entropy (nats) at the time of this response.
     *  H = -∑ p·ln(p) over the normalized belief distribution.
     *  Higher values indicate more uncertainty about the ED50 estimate;
     *  lower values indicate beliefs have concentrated around a specific delay.
     *  Maximum entropy for N levels is ln(N); minimum is 0 (complete certainty).
     */
    Entropy: number;
};

/**
 * Type for past discounting question, which includes the original response plus an index for ordering  
 */
export type PastDiscountingQuestionType = DiscountingResponseProvided & { index: number };
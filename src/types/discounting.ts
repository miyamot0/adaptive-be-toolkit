export type DiscountingResponseProvided = {
    Delay: number;
    SSR: number;
    LLR: number;
    Waited: boolean;
};

export type PastDiscountingQuestionType = DiscountingResponseProvided & { index: number };
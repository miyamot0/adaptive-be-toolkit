// Methods

export const DiscountingMethodologyTypes = ['adjusting-amount-ascending', 'adjusting-amount-descending'] as const;

export type DiscountingMethodology = typeof DiscountingMethodologyTypes[number];

// Responses 

export type DiscountingResponseProvided = {
    Delay: number;
    SSR: number;
    LLR: number;
    Waited: boolean;
};

export type PastDiscountingQuestionType = DiscountingResponseProvided & { index: number };
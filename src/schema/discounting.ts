import { DiscountingMethodologyTypes } from '#/types/discounting.ts';
import { z } from 'zod';
import { idSchema } from './common';

export const discountingSearchFlagSchema = z.object({
    figures: z.string().optional(),
    debug: z.string().optional(),
    reinforcer: z.string().optional(),
    ssr: z.string().optional(),
    llr: z.string().optional(),
})

export type DiscountingSearchFlags = z.infer<typeof discountingSearchFlagSchema>;

const discountingMethodSchema = z.enum(DiscountingMethodologyTypes);

export const mergedDiscountingParamsSchema = z.object({
    id: idSchema,
    method: discountingMethodSchema,
});

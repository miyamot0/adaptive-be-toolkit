import { z } from "zod";

// Settings flag (search params)

export const discountingSearchFlagSchema = z.object({
  // Flag: show figures or not ('true' or 'false')
  figures: z.string().optional(),

  // Flag: show debug output or not ('true' or 'false')
  debug: z.string().optional(),

  // String: type of reinforcer (e.g., 'Dollar', "Euro", etc.)
  reinforcer: z.string().optional(),

  // String: SSR value (e.g., 50 by default)
  ssr: z.string().optional(),

  // String: LLR value (e.g., 100 by default)
  llr: z.string().optional(),

  // String: Algorithm type (e.g., 'MaximumEntropy')
  algo: z.string().optional(),

  // Flag: whether to use compound suppression or not ('true' or 'false')
  compound: z.boolean().optional(),

  // String: Beta value for the algorithm (e.g., 0.25 by default)
  beta: z.string().optional(),

  // String: Delays, expected as a comma-separated list of numbers (e.g., "1,7,30,90,...")
  delays: z.string().optional(),
});

export type DiscountingSearchFlags = z.infer<
  typeof discountingSearchFlagSchema
>;

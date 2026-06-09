import { z } from "zod";

// Settings flag (search params)

export const discountingSearchFlagSchema = z.object({
  // Flag: show figures or not ('true' or 'false')
  figures: z.coerce.string().optional(),

  // Flag: show debug output or not ('true' or 'false')
  debug: z.coerce.string().optional(),

  // String: type of reinforcer (e.g., 'Dollar', "Euro", etc.)
  reinforcer: z.coerce.string().optional(),

  // String: SSR value (e.g., 50 by default)
  ssr: z.coerce.string().optional(),

  // String: LLR value (e.g., 100 by default)
  llr: z.coerce.string().optional(),

  // String: Algorithm type (e.g., 'MaximumEntropy')
  algo: z.coerce.string().optional(),

  // Flag: whether to use compound suppression or not (coerced from string 'true'/'false')
  compound: z.coerce.boolean().optional(),

  // String: Beta value for the algorithm (e.g., 0.25 by default)
  beta: z.coerce.string().optional(),

  // String: Delays, expected as a comma-separated list of numbers (e.g., "1,7,30,90,...")
  delays: z.coerce.string().optional(),

  // String: Maximum number of trials when using MaximumIteration stopping rule
  maxTrials: z.coerce.string().optional(),

  // String: Entropy threshold for stopping (0.00-0.5 range)
  entropyThreshold: z.coerce.string().optional(),
});

export type DiscountingSearchFlags = z.infer<
  typeof discountingSearchFlagSchema
>;

import { z } from "zod";

// Settings flag (search params)

export const demandSearchFlagSchema = z.object({
  // Flag: show figures or not ('true' or 'false')
  figures: z.string().optional(),

  // Flag: show debug output or not ('true' or 'false')
  debug: z.string().optional(),

  // String: type of reinforcer (e.g., 'Coffee', 'Cigarettes', etc.)
  reinforcer: z.string().optional(),

  // String: Algorithm type ('MaximumIteration' or 'RegretMin')
  algo: z.string().optional(),

  // Flag: whether to use compound suppression or not (coerced from string 'true'/'false')
  compound: z.coerce.boolean().optional(),

  // String: Beta value for the algorithm (e.g., '0.5' by default)
  beta: z.coerce.string().optional(),

  // String: Prices, expected as a comma-separated list of numbers (e.g., "0.1,0.25,0.5,...")
  prices: z.string().optional(),

  // String: Maximum number of trials when using MaximumIteration stopping rule
  maxTrials: z.coerce.string().optional(),

  // String: Entropy threshold for stopping (0.00-0.5 range)
  entropyThreshold: z.coerce.string().optional(),
});

export type DemandSearchFlags = z.infer<typeof demandSearchFlagSchema>;

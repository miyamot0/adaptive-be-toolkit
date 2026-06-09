import { z } from "zod";

/**
 * Common schema definitions used across multiple routes and components.
 * The ID is generally an identifier passed in the URL to link the task instance to a specific participant or session.
 */
export const idSchema = z
  .string()
  .min(6, { message: "id parameter is required" });

/**
 * Method schema for validating the method parameter in the URL. Currently, only "posm" is supported.
 */
export const methodSchema = z.enum(["posm"] as const);

/**
 * Error schema for handling error states in routes or components. This can be used to display error messages when something goes wrong, such as invalid parameters or server issues.
 */
export const errorSearchSchema = z.object({
  error: z.string().optional(),
});

export const commonSearchSchema = z.object({
  // Flag: show figures or not ('true' or 'false')
  figures: z.coerce.string().optional(),

  // Flag: show debug output or not ('true' or 'false')
  debug: z.coerce.string().optional(),

  // String: type of reinforcer (e.g., 'Coffee', 'Cigarettes', etc.)
  reinforcer: z.coerce.string().optional(),

  // String: Algorithm type ('MaximumIteration' or 'RegretMin')
  algo: z.coerce.string().optional(),

  // Flag: whether to use compound suppression or not (coerced from string 'true'/'false')
  compound: z.coerce.boolean().optional(),

  // String: Beta value for the algorithm (e.g., '0.5' by default)
  beta: z.coerce.string().optional(),

  // String: Maximum number of trials when using MaximumIteration stopping rule
  maxTrials: z.coerce.string().optional(),

  // String: Entropy threshold for stopping (0.00-0.5 range)
  entropyThreshold: z.coerce.string().optional(),

  // String: Entropy window size for stopping (e.g., '3' by default)
  entropyWindowSize: z.coerce.string().optional(),
});

import { z } from "zod";
import { commonSearchSchema } from "../common";

const demandSpecificSearchSchema = z.object({
  // String: SSR value (e.g., 50 by default)
  ssr: z.coerce.string().optional(),

  // String: LLR value (e.g., 100 by default)
  llr: z.coerce.string().optional(),

  // String: Delays, expected as a comma-separated list of numbers (e.g., "1,7,30,90,...")
  delays: z.coerce.string().optional(),
});

export const discountingSearchFlagSchema = commonSearchSchema.extend(
  demandSpecificSearchSchema.shape,
);

export type DiscountingSearchFlags = z.infer<
  typeof discountingSearchFlagSchema
>;

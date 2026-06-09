import { z } from "zod";
import { commonSearchSchema } from "../common";

const demandSpecificSearchSchema = z.object({
  // String: Prices, expected as a comma-separated list of numbers (e.g., "0.1,0.25,0.5,...")
  prices: z.coerce.string().optional(),
});

export const demandSearchFlagSchema = commonSearchSchema.extend(
  demandSpecificSearchSchema.shape,
);

export type DemandSearchFlags = z.infer<typeof demandSearchFlagSchema>;

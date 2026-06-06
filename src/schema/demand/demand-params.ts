import { z } from "zod";
import { idSchema } from "../common";
import { DemandMethodologyTypes } from "#/types/demand/demand-methodology.ts";

// Route params schema

const demandMethodSchema = z.enum(DemandMethodologyTypes);

export const mergedDemandParamsSchema = z.object({
  // ID parameter from URL, used to link task instance to participant/session
  id: idSchema,

  // Method parameter from URL, specifying the methodology to use
  method: demandMethodSchema,
});

import { z } from "zod";
import { idSchema, methodSchema } from "../common";

export const mergedDemandParamsSchema = z.object({
  // ID parameter from URL, used to link task instance to participant/session
  id: idSchema,

  // Method parameter from URL, specifying the methodology to use
  method: methodSchema,
});

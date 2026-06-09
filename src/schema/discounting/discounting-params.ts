import { z } from "zod";
import { idSchema, methodSchema } from "../common";

export const mergedDiscountingParamsSchema = z.object({
  // ID parameter from URL, used to link task instance to participant/session
  id: idSchema,

  // Method parameter from URL, specifying the discounting methodology to use
  method: methodSchema,
});

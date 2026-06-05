import { z } from "zod";
import { idSchema } from "../common";

// Route params schema

export const mergedDemandParamsSchema = z.object({
    // ID parameter from URL, used to link task instance to participant/session
    id: idSchema,
});

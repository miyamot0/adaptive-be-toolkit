import { DiscountingMethodologyTypes } from "#/types/discounting/discounting-methodology.ts";
import { z } from "zod";
import { idSchema } from "../common";

// Route params schema

const discountingMethodSchema = z.enum(DiscountingMethodologyTypes);

export const mergedDiscountingParamsSchema = z.object({
    // ID parameter from URL, used to link task instance to participant/session
    id: idSchema,

    // Method parameter from URL, specifying the discounting methodology to use
    method: discountingMethodSchema,
});

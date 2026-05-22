import { z } from "zod";

export const DEFAULT_FIXED_PRICES = [0.1, 0.5, 1, 2, 3, 5, 7.5, 10, 15, 20];
export const DEFAULT_FIXED_PRICES_KEYS = DEFAULT_FIXED_PRICES.map((price) => {
    return price.toFixed(2).replace(".", "_");
});

export const hptFormSchema = z.object({
    "0_10": z.coerce
        .number({ message: "Please enter a valid number" })
        .min(0, { message: "Please enter a valid number (0 or greater)" }),
    "0_50": z.coerce
        .number({ message: "Please enter a valid number" })
        .min(0, { message: "Please enter a valid number (0 or greater)" }),
    "1_00": z.coerce
        .number({ message: "Please enter a valid number" })
        .min(0, { message: "Please enter a valid number (0 or greater)" }),
    "2_00": z.coerce
        .number({ message: "Please enter a valid number" })
        .min(0, { message: "Please enter a valid number (0 or greater)" }),
    "3_00": z.coerce
        .number({ message: "Please enter a valid number" })
        .min(0, { message: "Please enter a valid number (0 or greater)" }),
    "5_00": z.coerce
        .number({ message: "Please enter a valid number" })
        .min(0, { message: "Please enter a valid number (0 or greater)" }),
    "7_50": z.coerce
        .number({ message: "Please enter a valid number" })
        .min(0, { message: "Please enter a valid number (0 or greater)" }),
    "10_00": z.coerce
        .number({ message: "Please enter a valid number" })
        .min(0, { message: "Please enter a valid number (0 or greater)" }),
    "15_00": z.coerce
        .number({ message: "Please enter a valid number" })
        .min(0, { message: "Please enter a valid number (0 or greater)" }),
    "20_00": z.coerce
        .number({ message: "Please enter a valid number" })
        .min(0, { message: "Please enter a valid number (0 or greater)" }),
});
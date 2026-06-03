import { z } from 'zod';

export const idSchema = z.string().min(6, { message: 'id parameter is required' });

// Error

export const errorSearchSchema = z.object({
    error: z.string().optional(),
})
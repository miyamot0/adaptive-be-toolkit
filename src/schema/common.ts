import { z } from 'zod';

/**
 * Common schema definitions used across multiple routes and components.
 * The ID is generally an identifier passed in the URL to link the task instance to a specific participant or session.
 */
export const idSchema = z.string().min(6, { message: 'id parameter is required' });

/**
 * Error schema for handling error states in routes or components. This can be used to display error messages when something goes wrong, such as invalid parameters or server issues.
 */
export const errorSearchSchema = z.object({
    error: z.string().optional(),
})
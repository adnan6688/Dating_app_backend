import { z } from "zod";

export const categoryZodSchema = z.object({
    name: z.string()
        .min(3, { message: "Name must be at least 3 characters long." })
        .max(25, { message: "Name cannot exceed 25 characters." })
});

export const updateCetegoryzodSchema = z.object({
    name: z.string()
        .min(3, { message: "Name must be at least 3 characters long." })
        .max(25, { message: "Name cannot exceed 25 characters." }).optional(),
    isDelete: z.boolean().optional()
})
import z from "zod";



export const createInterestZod = z.object({
  name: z
    .string()
    .min(3, "Minimum 3 characters required")
    .max(15, "Maximum 15 characters allowed"),
});




export const updateInterestzod = z.object({
  name: z
    .string()
    .min(3, "Minimum 3 characters required")
    .max(15, "Maximum 15 characters allowed").optional()
})
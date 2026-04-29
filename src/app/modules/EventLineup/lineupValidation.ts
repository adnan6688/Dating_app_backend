import z from "zod";




export const EventLineUpZod = z.object({
    eventId: z.string(),

    lineups: z.array(
        z.object({
            name: z
                .string()
                .min(2, { message: "Name must be at least 2 characters long." })
                .max(30, { message: "Name cannot exceed 30 characters." })
        })
    )
});

export const updateLineupZod = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(30, { message: "Name cannot exceed 30 characters." })
        .optional()
});
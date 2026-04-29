import { z } from "zod";

export const bookingZod = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  ticketCount: z.number().min(1, "At least 1 ticket must be booked"),
});

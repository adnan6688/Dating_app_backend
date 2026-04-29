import { z } from "zod";
import { Types } from "mongoose";
import { EventTags } from "./event.interface";

const objectIdValidation = z.string().refine((id) => Types.ObjectId.isValid(id), {
  message: "Invalid ObjectId"
});

// const time12HourRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;

export const createEventZod = z.object({
  title: z
    .string()
    .min(8, "Title must be at least 8 characters")
    .max(50, "Title cannot exceed 50 characters")
    .trim(),

  fee: z.coerce
    .number({
      message: "Event fee is required"
    })
    .min(0, "Fee must be a positive number"),

  category: objectIdValidation,

  lat: z.coerce.number({
    message: "Latitude is required"
  }),

  tags: z
    .array(z.nativeEnum(EventTags)) // array of enum values
    .nonempty("At least one tag is required") // at least 1 tag
    .refine((arr) => new Set(arr).size === arr.length, {
      message: "Duplicate tags are not allowed", // prevent duplicates
    }),


  long: z.coerce.number({
    message: "Longitude is required"
  }),

  start_date_time: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Start Date time must be a valid ISO date string (e.g. 2026-03-07T15:20:00.000Z)",
    }),

  end_date_time: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "End date time must be a valid ISO date string (e.g. 2026-03-07T15:20:00.000Z)",
    }),


  openDoor: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Open door time must be a valid ISO date string (e.g. 2026-03-07T15:20:00.000Z)",
    }),


  venue: z.string(),

  image: z.string().optional(),

  descripton: z
    .string()
    .max(500, "Description cannot exceed 500 characters")

});




export const updateEventZod = z.object({
  title: z
    .string()
    .min(8, "Title must be at least 8 characters")
    .max(50, "Title cannot exceed 50 characters")
    .trim()
    .optional(),

  fee: z
    .coerce.number({ message: "Event fee must be a number" })
    .min(0, "Fee must be a positive number")
    .optional(),

  category: objectIdValidation.optional(),

  lat: z
    .coerce.number({ message: "Latitude must be a number" })
    .optional(),

  long: z
    .coerce.number({ message: "Longitude must be a number" })
    .optional(),

  tags: z
    .array(z.nativeEnum(EventTags), { message: "Tags must be an array of valid values" })
    .nonempty("At least one tag is required")
    .refine((arr) => new Set(arr).size === arr.length, {
      message: "Duplicate tags are not allowed",
    })
    .optional(),

  // status : z.string(),

  start_date_time: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Start Date time must be a valid ISO date string (e.g. 2026-03-07T15:20:00.000Z)",
    }).optional(),

  end_date_time: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "end date time must be a valid ISO date string (e.g. 2026-03-07T15:20:00.000Z)",
    }).optional(),

  openDoor: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Open door time must be a valid ISO date string (e.g. 2026-03-07T15:20:00.000Z)",
    }).optional(),



  image: z.string().optional(),

  descripton: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});
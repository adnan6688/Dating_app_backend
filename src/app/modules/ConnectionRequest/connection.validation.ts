import z from "zod";

import { Types } from "mongoose";
import { ConnectTypes } from "./connection.interface";




export const connectionSendZod = z.object({
    recivedReq: z
        .string()
        .refine((id) => Types.ObjectId.isValid(id), {
            message: "Invalid ObjectId",
        }),
    type: z.nativeEnum(ConnectTypes),
});



export const connectionRequestBodyZod = z.object({
    status: z.enum(["ACCEPTED", "DECLINE"]) 
});
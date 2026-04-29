import { model, Schema, Types } from "mongoose";
import { IEventLineup } from "./lineup.interface";



const EventLineUpShcema = new Schema<IEventLineup>({
    name: { type: String, required: true, trim: true },
    eventId: { type: Types.ObjectId }
}, {
    versionKey: false
})



export const EventLineUp = model<IEventLineup>("EventLineUp", EventLineUpShcema)


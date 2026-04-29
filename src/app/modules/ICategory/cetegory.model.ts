import { model, Schema } from "mongoose";
import { ICetegory } from "./cetegory.interface";





const cetegorySchema = new Schema<ICetegory>({

    name: { type: String, required: true, unique: true, trim: true },
    isDelete: { type: Boolean, default: false }
}, {
    versionKey : false
})


export const Cetegory = model<ICetegory>("Cetegory", cetegorySchema)
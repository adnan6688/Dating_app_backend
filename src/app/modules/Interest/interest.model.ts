import { model, Schema } from "mongoose";
import { IInterest } from "./interest.interface";




const interestSchema = new Schema<IInterest>({
    name : {type : String , unique : true , trim : true}
}, {
    versionKey : false
})


export const Interest = model<IInterest>("Interest", interestSchema)
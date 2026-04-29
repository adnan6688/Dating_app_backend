import { model, Schema } from "mongoose";
import { ConnectTypes, IConnection, StatusConnect } from "./connection.interface";





const connectionSchema = new Schema<IConnection>({

    sendReq: { type: Schema.Types.ObjectId , required : true , ref : "User" },
    recivedReq: { type: Schema.Types.ObjectId, required: true , ref : "User" },
    status: {
        type: String,
        enum: Object.values(StatusConnect),
        default: StatusConnect.PENDING
    },
    type: {
        type: String,
        enum: Object.values(ConnectTypes),
        required: true
    }

}, {
    versionKey: false
})


export const ConnectionReq = model<IConnection>("ConnectionReq", connectionSchema)

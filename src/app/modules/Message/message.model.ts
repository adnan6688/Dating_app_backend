import { model, Schema, Types } from "mongoose";
import { IMessage, IRoom } from "./message.interface";


const roomSchema = new Schema<IRoom>(
  {
    user1: { type: Types.ObjectId, ref: "User", required: true },
    user2: { type: Types.ObjectId, ref: "User", required: true },
    lastMessage: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: true } , versionKey : false }
);

export const  Room = model<IRoom>("Room",roomSchema)





const messageSchema = new Schema<IMessage>(
  {
    senderId: { type: Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Types.ObjectId, ref: 'User', required: [true , "ReceiverId must be included"] },
    roomId: { type: Types.ObjectId, ref: 'Room', required: [true, "RoomId must be included"] },
    messageText: { type: String, required: [true, "message must be included"] , trim : true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps:  true, versionKey : false } // only createdAt
);


export const Message= model<IMessage>("Message",messageSchema)
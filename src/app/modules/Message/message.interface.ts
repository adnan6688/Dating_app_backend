import { Types } from "mongoose";


export interface IRoom {

    user1 : Types.ObjectId ;
    user2 : Types.ObjectId;
    lastMessage? : string;

}


export interface IMessage {
    senderId : Types.ObjectId;
    receiverId : Types.ObjectId;
    roomId : Types.ObjectId;
    isRead: boolean;
    messageText : string;

}
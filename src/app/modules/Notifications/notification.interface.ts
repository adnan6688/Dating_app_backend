import { Types } from "mongoose";




export enum NotificationTypes {
    MESSAGE = "MESSAGE",
    EVENT = "EVENT",
    POST_LIKE = "POST_LIKE",
    FRIEND_REQUEST = "FRIEND_REQUEST",
    REPLY="REPLY"
}


export interface NotificationInterFace {


    receiverId: Types.ObjectId;
    senderId?: Types.ObjectId;

    type: NotificationTypes;

    title?: string;
    body?: string;

    eventId?: Types.ObjectId;
    postId?: Types.ObjectId;
    replyId? : Types.ObjectId;
    requestId? : Types.ObjectId;

    isRead?: boolean;
    createdAt?: Date;
    updatedAt?: Date;

}







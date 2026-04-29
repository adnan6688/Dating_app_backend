import { Schema, model } from "mongoose";
import { NotificationInterFace, NotificationTypes } from "./notification.interface";

const notificationSchema = new Schema<NotificationInterFace>(
    {
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },


        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required : true
        },

        
        type: {
            type: String,
            enum: Object.values(NotificationTypes),
            required: true,
        },

        title: {
            type: String,
            trim: true,
            required: true
        },

        body: {
            type: String,
            trim: true,
            required: true
        },
        eventId: {
            type: Schema.Types.ObjectId,
            ref: "Event",
        },
        requestId: {
            type: Schema.Types.ObjectId,
            ref: "ConnectionReq",
        },
        replyId: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
        postId: {
            type: Schema.Types.ObjectId,
            ref: "Post",
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey : false
    }
);

export const Notification = model<NotificationInterFace>("Notification", notificationSchema);


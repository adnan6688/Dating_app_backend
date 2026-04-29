import { model, Schema, Types } from "mongoose";
import { likeInterface } from "./like.interface";

const likeSchema = new Schema<likeInterface>({
    userId: {
        type: Types.ObjectId,
        required: [true, "User ID must be provided"] 
    },
    postId: {
        type: Types.ObjectId,
        required: [true, "Post ID must be provided"] 
    }
}, {
    versionKey : false
});

export const Like = model<likeInterface>("Like", likeSchema);
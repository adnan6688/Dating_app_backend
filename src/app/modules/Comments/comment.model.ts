import { model, Schema, Types } from "mongoose";
import { Icomment } from "./comments.interface";

const CommentSchema = new Schema<Icomment>({
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"]
    },

    postId: {
        type: Types.ObjectId,
        ref: "Post",
        required: [true, "Post ID is required"]
    },

    comment: {
        type: String,
        trim: true,
        required: [true, "Comment text is required"]
    },

    parentId: {
        type: Types.ObjectId,
        ref : "Comment",
        default: null
    }, 
    isDelete : {
        type : Boolean,
        default : false
    }

}, {
    timestamps: true,
    versionKey: false
});

export const Comment = model<Icomment>("Comment", CommentSchema);
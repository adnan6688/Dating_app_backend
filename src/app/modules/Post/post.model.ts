import { model, Schema } from "mongoose";
import { PostImageVideoType, postInterface } from "./post.interface";





const postSchema = new Schema<postInterface>({
    imageOrVideo: {
        type: String,
        required: [true, "Image or Video is required"],
    },
    caption: {
        type: String,
        required: [true, "Caption is required"],
        trim: true,

    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isDelete: { type: Boolean, default: false },
    location: {
        type: String,
        required: true,
        default: "",
    },
    like: {
        type: Number,
        default: 0,
        min: 0
    },
    comment: {
        type: Number,
        default: 0,
        min: 0
    },
    postType: { type: String, default: null, enum: Object.values(PostImageVideoType), }
}, { timestamps: true, versionKey: false });

export const Post = model<postInterface>("Post", postSchema)
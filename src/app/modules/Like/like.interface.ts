import { Types } from "mongoose";




export interface likeInterface {
 
    userId : Types.ObjectId;
    postId : Types.ObjectId;
}
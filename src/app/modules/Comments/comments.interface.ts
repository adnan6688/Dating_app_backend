import { Types } from "mongoose";



export interface Icomment {

    userId : Types.ObjectId;
    postId : Types.ObjectId;
    comment : string;
    parentId : Types.ObjectId | null;
    isDelete? : boolean
}
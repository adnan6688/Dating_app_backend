import { Types } from "mongoose";



export enum reportType {
    POST = "POST",
    USER = "USER",
    POST_AND_USER_BLOCK="POST_AND_USER_BLOCK" // post report and block user
}




export interface IReport {
    _id?: Types.ObjectId,
    type: reportType,
    text : string,
    reporter: Types.ObjectId,
    userId?: Types.ObjectId,
    postId?: Types.ObjectId
}
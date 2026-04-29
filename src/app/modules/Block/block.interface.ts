import { Types } from "mongoose";

export interface IBlockUser {
  _id: Types.ObjectId;

  blockedUserId: Types.ObjectId; 
  blockerUserId: Types.ObjectId; 

  createdAt?: Date;
}
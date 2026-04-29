import { model, Schema } from "mongoose";
import { IBlockUser } from './block.interface';


const blockSchema = new Schema<IBlockUser>(
  {
    blockedUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "blocked user id must be included!"],
    },

    blockerUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "blocker user id must be included!"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Block = model<IBlockUser>('Block', blockSchema)
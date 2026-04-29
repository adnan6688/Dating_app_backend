import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { Types } from "mongoose";
import { likeService } from "./like.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const likeCreateOrDelete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const userId = req?.user?.id as Types.ObjectId

    const payload = { userId, postId: req?.body?.postId as Types.ObjectId }


    const data = await likeService.likeCreateOrDelete(payload)


    sendResponse(res, {
        success: true,
        message: "Like hoise or dlete oise",
        data: data,
        statusCode: httpStatus.OK
    })

})


export const likeController = {
    likeCreateOrDelete
}
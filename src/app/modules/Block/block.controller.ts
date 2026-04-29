import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { blockService } from "./block.service";
import { sendResponse } from "../../utils/sendResponse";
import httpSTatus from 'http-status-codes'




// eslint-disable-next-line @typescript-eslint/no-unused-vars
const blockingUer = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const myId = req?.user?.id
    const { userId } = req?.body // jare ami block kortesi

    const result = await blockService.blockingUser(userId as string, myId as string)

    sendResponse(res, {
        data: result,
        success: true,
        message: "The user has been blocked successfully!",
        statusCode: httpSTatus.OK
    })
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const myBlockList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const query = req?.query

    const myId = req?.user?.id
    const data = await blockService.myBlockList(myId as string, query as Record<string, string>)


    sendResponse(res, {
        data: data,
        success: true,
        statusCode: httpSTatus.OK,
        message: 'My Block List!'
    })
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const unblockUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {



    const myId = req?.user?.id
    const { unblockUserId } = req?.body

    const result = await blockService.unblockUser(myId as string, unblockUserId as string)

    sendResponse(res, {
        data: result,
        success: true,
        statusCode: httpSTatus.OK,
        message: "The user has been unblocked successfully!"
    })
})


export const blockController = {
    blockingUer,
    myBlockList,
    unblockUser
}
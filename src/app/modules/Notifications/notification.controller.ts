import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { NotificationSerivce } from "./notificatin.service";
import { sendResponse } from "../../utils/sendResponse";

import httpStatus from 'http-status-codes'



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const notifications = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const myId = req?.user?.id

    const query = req?.query
    const data = await NotificationSerivce.allNotification(myId as string,  query as Record<string, string>)

    sendResponse(res, {
        message: 'Get All Notifications',
        data: data,
        success: true,
        statusCode: httpStatus.OK
    })
})


export const NotificationController = {
    notifications
}
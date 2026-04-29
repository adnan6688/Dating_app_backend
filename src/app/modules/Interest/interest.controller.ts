import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { interestService } from "./interest.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'




// create interest
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const interestcreate = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const interestResult = await interestService.interestCreate(req?.body)

    sendResponse(res, {
        success: true,
        message: "Interest created successfully!",
        data: interestResult,
        statusCode: httpStatus.CREATED
    })
})


// get all interest 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getInterest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const query = req?.query

    const interests = await interestService.interests(query as Record<string, string>)


    sendResponse(res, {
        data: interests,
        success: true,
        message: "All interest Retrived successfully!",
        statusCode: httpStatus.OK
    })

})


// update interest
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateInterest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const id = req?.params?.id as string
    const data = await interestService.updateinterests(id, req?.body)


    sendResponse(res, {
        message: "update interest successfully!!",
        data:data,
        success: true,
        statusCode: httpStatus.OK
    })
})



export const interestController = {
    interestcreate,
    getInterest,
    updateInterest
}
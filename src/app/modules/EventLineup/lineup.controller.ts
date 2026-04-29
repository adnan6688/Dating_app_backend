import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { lineupService } from "./lineup.service";



// create controller
const lineupcreated = catchAsync(async (req: Request, res: Response) => {

    const result = await lineupService.lineupCreate(req.body)

    sendResponse(res, {
        message: "Event Lineup created successfully!",
        statusCode: httpStatus.CREATED,
        data: result,
        success: true
    })

})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getLineup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const query = req?.query
    const lineupData = await lineupService.getLineup(query as Record<string, string>)

    lineupData.meta.total = lineupData.data.length

    sendResponse(res, {
        success: true,
        message: "All Event Lineup Retrived Successfully",
        statusCode: httpStatus.OK,
        data: lineupData
    })
})

// update lineup data
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateLineUp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const id = req?.params?.id as string

    const data = await lineupService.updateLineup(id, req?.body)


    sendResponse(res, {
        message: "Update line up data successfully!",
        success: true,
        data: data,
        statusCode: httpStatus.OK
    })


})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteLineup = catchAsync(async(req : Request , res :Response , next : NextFunction)=>{

    const id  = req?.params?.lineupId as string

    const data = await lineupService.deleteLineup(id)

   sendResponse(res, {
        message: "Delete line up  successfully!",
        success: true,
        data: data,
        statusCode: httpStatus.OK
    })
})


export const lineupController = {

    lineupcreated,
    getLineup,
    updateLineUp,
    deleteLineup

}
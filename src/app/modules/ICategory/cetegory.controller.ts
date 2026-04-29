import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { CetegoryService } from "./cetegory.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'



// cetegory controller
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createCetegory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const data = await CetegoryService.createCetegory(req?.body)

    sendResponse(res, {
        message: "Create Cetegory Successfully!",
        statusCode: httpStatus.CREATED,
        success: true,
        data
    })

})



// cetegory get
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCetegory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    let query = req?.query

    if (query?.isDelete && typeof query.isDelete === 'string') {
        (query as any).isDelete = query.isDelete === 'true';
    }

    const cetegoryDatas = await CetegoryService.getCetegory(query as Record<string, string>)


    sendResponse(res, {
        data: cetegoryDatas,
        success: true,
        message: "All Cetegories Retrived Successfully",
        statusCode: httpStatus.OK
    })
})



// update cetegory
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateCetegory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const id = req?.params?.id as string

    const data = await CetegoryService.updateCetegory(id, req?.body)

    sendResponse(res, {
        success: true,
        data,
        message: "Cetegory update Successfully!",
        statusCode: httpStatus.OK
    })
})


// get cetegory controller 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCategoryAdmin = catchAsync(async(req : Request , res : Response , next : NextFunction)=>{

    const data = await CetegoryService.getCetegoryAdmin()

    sendResponse(res , {
        success : true, 
        data : data , 
        message : 'Get All Categories for admin',
        statusCode : httpStatus.OK
    })



})



export const cetegoryController = {
    createCetegory,
    getCetegory,
    updateCetegory,
    getCategoryAdmin
}
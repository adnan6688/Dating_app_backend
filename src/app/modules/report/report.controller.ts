import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reportService } from "./report.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'
import AppError from "../../errorHerlpers/AppError";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createReport = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const types = req?.params?.type
    if (!types) {
        throw new AppError(httpStatus.NOT_FOUND, "Please give me type of report")
    }
    req.body.type = types
    req.body.reporter = req?.user?.id


    const data = await reportService.createReport(req?.body)


    sendResponse(res, {
        data: data,
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Report create successfully!'
    })


})



// get all report post 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllPostReport = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const query = req?.query

    const data = await reportService.getAllPostreport(query as Record<string, string>)


    sendResponse(res, {
        data: data,
        success: true,
        message: 'All report post',
        statusCode: httpStatus.OK
    })
})


// get all user report 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllUserReport = catchAsync( async (req: Request, res: Response, next: NextFunction) => {

        const query = req.query as Record<string, string>;

        const userList = await reportService.getAllUserreport(query);

        return sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "All reported users fetched successfully",
            data: userList
        });
    }
);


// count of report 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const countOfReport = catchAsync(async (req : Request , res : Response, next : NextFunction)=>{


    const data = await reportService.countOfReport()


    sendResponse(res, {
        success : true,
        message : 'Count of Reports',
        data : data,
        statusCode : httpStatus.OK
    })
})

//all post reports get by post id
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getReportsByPostId = catchAsync(async(req : Request , res : Response , next : NextFunction)=>{


    const postId = req?.params?.postId 
    const query = req?.query


    const data = await reportService.getReportsByPostId(postId as string , query as Record<string,string>)

    sendResponse(res , {
        success : true,
        message : 'Get all post reports',
        data : data,
        statusCode : httpStatus.OK
    })
})


export const reportController = {
    createReport,
    getAllPostReport,
    getAllUserReport,
    countOfReport,
    getReportsByPostId
}
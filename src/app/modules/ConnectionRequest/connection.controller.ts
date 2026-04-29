import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { connectionSerivce } from "./connection.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'
import { Types } from "mongoose";
import { TconnectionRequest } from "./connection.interface";





// connection send controller
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const connectionSend = catchAsync(async (req: Request, res: Response, next: NextFunction) => {



    const { ...payload } = req?.body


    // you sender
    const sendId = req?.user?.id

    // store sender id in payload
    payload.sendReq = sendId


    const result = await connectionSerivce.connectionSend(payload)

    sendResponse(res, {
        success: true,
        message: "send request successfully!",
        statusCode: httpStatus.CREATED,
        data: result
    })


})



// connection accept Request controller
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const connectionRequestAccept = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const id = req.params.id as string;
    const myId = req.user?.id; // ata hocce amr id ..ami ki asole ai connection tar jonno reciver kina

    if (!id || !myId) {
        throw new Error("Id missing");
    }

    const payload: TconnectionRequest = {
        _id: new Types.ObjectId(id),
        status: req.body.status,
        myId: new Types.ObjectId(myId)
    };



    const data = await connectionSerivce.connectionRequestAccept(payload)

    const message =
        req?.body?.status === "ACCEPTED"
            ? "Connection request accepted successfully"
            : "Connection request declined successfully";

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        data: data,
        message: message
    })


})



// get connect data
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getConnect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const query = req?.query
    const myId = req?.user?.id

    // query.sendReq = req?.user?.id // ami kare kare send korsi oi gula just amk dekhaw tar joono sender id te amr id bosai disi

    const connectData = await connectionSerivce.getConection(myId as string, query as Record<string, string>)


    connectData.meta.total = connectData.data.length

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Connects Data Retreived Successfully",
        data: connectData
    })
})


// send request 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sendRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const myId = req?.user?.id
    const query = req?.query
    const data = await connectionSerivce.mySendRequest(myId, query as Record<string, string>)
    data.meta.total = data.data.length

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Connects Data Retreived Successfully",
        data: data
    })
})



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const showAllRequestothersusersendMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {



    const myId = req?.user?.id


    const query = req?.query
    const data = await connectionSerivce.showAllRequestothersusersendMe(myId, query as Record<string, string>)
    data.meta.total = data.data.length

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Connects Data Retreived Successfully",
        data: data
    })

})



export const connectionController = {
    connectionSend,
    connectionRequestAccept,
    getConnect,
    sendRequest,
    showAllRequestothersusersendMe
}
import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes';
import sharp from "sharp";
import { uploadToCloudinary } from "../../config/multer.config";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { User } from "../User/user.model";
import { eventService } from "./event.service";
import { getCoordinates } from "../../utils/GeocodingAddress";




// event create contoller
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createEvent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    req.body.user = req?.user?.id
    req.body.fee = Number(req?.body?.fee)
    req.body.lat = Number(req?.body?.lat)
    req.body.long = Number(req?.body?.long)


    // jdi request ar modde file thake tayle amra buffer kore link create kortesi
    if (req.file) {
        // compress image
        const compressedImage = await sharp(req.file.buffer)
            .resize({ width: 1200 })
            .jpeg({ quality: 70 })
            .toBuffer()

        // upload cloudinary
        const result: any = await uploadToCloudinary(compressedImage)
        req.body.image = result.secure_url
    }


    // req.body.image = req?.file ? req?.file?.path : ""


    // const MAX_SIZE = 50 * 1024 * 1024; // 50MB in bytes


    if (req?.body?.lat && req?.body?.long) {
        req.body.location = {
            type: "Point",
            coordinates: [req?.body.long, req?.body?.lat] // always [long, lat]
        }



        const location = await getCoordinates(req, res)

        req.body.addRess = location
    }


    const myId = req?.user?.id
    const data = await eventService.createEvent(myId as string, req?.body)

    sendResponse(res, {
        message: "Event Create Successfully!",
        success: true,
        statusCode: httpStatus.CREATED,
        data: data
    })
})


// event details
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const eventDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const data = await eventService.getEventDetails(req?.params?.id as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Event Retrived successfully!",
        data
    })
})


// get all events 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getEvents = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const query = req?.query
    const user = await User.findOne({ email: req?.user?.email })
    let lat = user?.lat
    let long = user?.long



    const events = await eventService.getEvents(lat as Number, long as Number, query as Record<string, string>)


    events.meta.total = events.data.length
    sendResponse(res, {
        success: true,
        message: "Get All Events",
        data: events,
        statusCode: httpStatus.OK
    })
})


// get evetns for admin 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getEventsForAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const query = req?.query

    const data = await eventService.getEventsForAdmin(query as Record<string, string>)

    sendResponse(res, {
        success: true,
        message: "Get All Events",
        data: data,
        statusCode: httpStatus.OK
    })
})


// update events
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateEvents = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const eventId = req?.params?.id as string

    req?.body?.fee ? req.body.fee = Number(req?.body?.fee) : ''
    req?.body?.lat ? req.body.lat = Number(req?.body?.lat) : ''
    req?.body?.long ? req.body.long = Number(req?.body?.long) : ''



    if (req.file) {
        // compress image
        const compressedImage = await sharp(req.file.buffer)
            .resize({ width: 1200 })
            .jpeg({ quality: 70 })
            .toBuffer()

        // upload cloudinary
        const result: any = await uploadToCloudinary(compressedImage)
        req.body.image = result.secure_url
    }

    req?.body?.isDelete ? req.body.isDelete = Boolean(req.body.isDelete) : ""



    if (req?.body?.lat && req?.body?.long) {
        req.body.location = {
            type: "Point",
            coordinates: [req?.body.long, req?.body?.lat] // always [long, lat]
        }
    }



    const updatedata = await eventService.updateEvents(eventId, req?.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Event Update Successfully!",
        data: updatedata,
        success: true
    })
})





// eslint-disable-next-line @typescript-eslint/no-unused-vars
const eventStatusCountContrller = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const data = await eventService.eventServiceStatus()

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Event Update Successfully!",
        data: data,
        success: true
    })

})


// top events
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const topFiveEvents = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const query = req?.query
    const data = await eventService.topFiveEvents(query as Record<string, string>)

    sendResponse(res, {
        success: true,
        message: 'Top Five Events Show',
        data: data,
        statusCode: httpStatus.OK
    })
})


export const eventController = {
    createEvent,
    getEvents,
    eventDetails,
    updateEvents,
    getEventsForAdmin,
    eventStatusCountContrller,
    topFiveEvents
}
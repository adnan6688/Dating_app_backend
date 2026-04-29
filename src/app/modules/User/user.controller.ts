import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { JwtPayload } from "jsonwebtoken";
import sharp from "sharp";
import { uploadToCloudinary } from "../../config/multer.config";
import AppError from "../../errorHerlpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { getCoordinates } from "../../utils/GeocodingAddress";
import { sendResponse } from "../../utils/sendResponse";
import { IUser, Role } from "./user.interface";
import { userService } from "./user.service";





// create a user
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { fullName } = req?.body

    const displayName = fullName.split(' ')[0]

    req.body.displayName = displayName


    await userService.usercreate(req?.body)


    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "✅ Registration Successfully.",
    })
})


// update use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {



    if (req?.body?.password) {
        throw new AppError(httpStatus.BAD_REQUEST, "This is not permitted!")
    }
    if (req?.user?.role === Role?.USER && req?.body?.role) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Users are not allowed to change their role."
        );
    }
    


    if (req?.user?.role === Role?.ADMIN && (req?.body?.role === Role?.ADMIN || req?.body?.role == Role?.USER)) {
        throw new AppError(httpStatus.BAD_REQUEST, "Admins cannot modify their own role.");
    }

    if (req?.user?.role === Role?.USER && req?.body?.status) {
        throw new AppError(httpStatus.BAD_REQUEST, "Users are not allowed to change their status.");
    }
    if ((req?.user?.role === Role.USER) && req?.body?.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "User can not modify their varification")
    }


    // form-data diye pathanor karone segula string hoye jacce ty ai khane abr boolen kore nilam
    const booleanFields = [
        "availableForDate",
        "availableForDance",
        "availableForFriend",
        "newMatchesNotification",
        "messageAlertsNotification",
        "eventRemindersNotification"
    ];

    booleanFields.forEach(field => {
        if (req.body[field] !== undefined) {
            req.body[field] = req.body[field] === "true";
        }
    });


    req?.body?.lat ? req.body.lat = Number(req?.body?.lat) : ''
    req?.body?.long ? req.body.long = Number(req?.body?.long) : ''
    req?.body?.age ? req.body.age = Number(req?.body?.age) : ''




    if (req?.body?.age <= 18) {
        throw new AppError(httpStatus.BAD_REQUEST, "You must be at least 18 years old to use this platform.")
    }


    // upload image 
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


    const payload: IUser = {
        ...req.body
    }


    // payload ar modde lat and long set kore dilam
    if (payload.lat && payload.long) {

        payload.location = {
            type: "Point",
            coordinates: [payload.long, payload.lat] // always [long, lat]
        }

        const location = await getCoordinates(req, res)
        payload.userLocation = location

    }


    const userId = req?.params?.id as string
    const updatedUserInfo = await userService.updateUser(userId, payload)


    sendResponse(res, {
        success: true,
        message: "✅ updated successfully!",
        statusCode: httpStatus.OK,
        data: updatedUserInfo
    })
})


// get all users with out admin
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const query = req?.query
    const userId = req?.user?.id


    const users = await userService.getAllUsers(userId as string, query as Record<string, string>)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Get All Users",
        data: users
    })
})


// get me
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const decodedToken = req?.user as JwtPayload
    const user = await userService.getMe(decodedToken?.id)



    sendResponse(res, {
        success: true,
        message: "Your profile Retrieved Successfully",
        data: user,
        statusCode: httpStatus.OK
    })
})


// get singleUser
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const singleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req?.params?.id as string
    const myId = req?.user?.id
    const user = await userService.singleUser(id, myId)
    sendResponse(res, {
        success: true,
        message: "User Details Retrived Successfully",
        data: user,
        statusCode: httpStatus.OK
    })
})



export const userController = {
    createUser,
    updateUser,
    getAllUsers,
    getMe,
    singleUser
}
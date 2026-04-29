import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { postService } from "./post.service";
import { uploadToCloudinary } from "../../config/multer.config";
import sharp from "sharp"
import AppError from "../../errorHerlpers/AppError";
import { PostImageVideoType } from "./post.interface";



// create post
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {



    const payload = req?.body
    payload.userId = req?.user?.id

    // payload.imageOrVideo = req?.file?.path

    if (req.file) {
        if (req.file.mimetype.startsWith("image")) {
            // image → sharp compress
            const compressedBuffer = await sharp(req.file.buffer)
                .rotate() // fixes orientation automatically
                .resize({ width: 1200 })
                .jpeg({ quality: 70 })
                .toBuffer();


            const result: any = await uploadToCloudinary(compressedBuffer)
            payload.imageOrVideo = result.secure_url

            payload.postType = PostImageVideoType.IMAGE

        } else if (req.file.mimetype.startsWith("video")) {
            // video → direct upload (no sharp)
            const result: any = await uploadToCloudinary(req.file.buffer)
            payload.imageOrVideo = result.secure_url
            payload.postType = PostImageVideoType.VIDEO
        } else {
            throw new AppError(400, "Only images or videos are allowed")
        }
    }


    const post = await postService.postCreate(payload)

    sendResponse(res, {
        success: true,
        message: 'post create successfully!',
        data: post,
        statusCode: httpStatus.CREATED
    })
})




// get post
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getpost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const query = req?.query
    const currentUserId = req?.user?.id
    const postdata = await postService.getPosts(query as Record<string, string>, currentUserId)



    sendResponse(res, {
        success: true,
        message: 'Post Retrived successfully!',
        data: postdata,
        statusCode: httpStatus.OK
    })
})


// get my post
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getMyPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user = req?.user as JwtPayload
    const query = req?.query
    const data = await postService.getMyPost(user, query as Record<string, string>)

    data.meta.total = data?.data?.length


    sendResponse(res, {
        success: true,
        message: "Get All My post",
        data: data?.data,
        meta: data?.meta,
        statusCode: httpStatus.OK
    })
})

// update post controller
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updatepost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const postId = req?.params.id as string



    if (req.file) {
        if (req.file.mimetype.startsWith("image")) {
            // image → sharp compress
            const compressedBuffer = await sharp(req.file.buffer)
                .resize({ width: 1200 })
                .jpeg({ quality: 70 })
                .toBuffer()

            const result: any = await uploadToCloudinary(compressedBuffer)
            req.body.imageOrVideo = result.secure_url
        } else if (req.file.mimetype.startsWith("video")) {
            // video → direct upload (no sharp)
            const result: any = await uploadToCloudinary(req.file.buffer)
            req.body.imageOrVideo = result.secure_url
        } else {
            throw new AppError(400, "Only images or videos are allowed")
        }
    }


    const user = req?.user?.id as string
    const updatedata = await postService.updatePost(postId, req?.body, user)


    sendResponse(res, {
        success: true,
        data: updatedata,
        message: "Update successfully",
        statusCode: httpStatus.OK
    })


})


export const postController = {
    createPost,
    getpost,
    updatepost,
    getMyPost
}
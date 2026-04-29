import httpStatus from 'http-status-codes';
import { Types } from "mongoose";
import AppError from "../../errorHerlpers/AppError";
import { io } from "../../socket/socket.server";
import { createNotification } from "../../utils/Notifications";
import { NotificationTypes } from "../Notifications/notification.interface";
import { Post } from "../Post/post.model";
import { likeInterface } from "./like.interface";
import { Like } from "./like.model";



const likeCreateOrDelete = async (payload: Partial<likeInterface>) => {

    const { userId, postId } = payload;

    if (!userId || !postId) {
        throw new Error("UserId and PostId are required");
    }

    const existingLike = await Like.findOne({
        userId: userId as Types.ObjectId,
        postId: postId as Types.ObjectId
    });

    const ckPost = await Post.findById(postId)

    if (!ckPost) {
        throw new AppError(httpStatus.NOT_FOUND, "Post Not found!")
    }

    // If already liked → remove like
    if (existingLike) {
        await Like.deleteOne({
            userId: userId as Types.ObjectId,
            postId: postId as Types.ObjectId
        });

        await Post.findOneAndUpdate(
            { _id: postId },
            { $inc: { like: -1 } },
            { new: true }
        );

        return {
            liked: false,
            message: "Like removed successfully"
        };
    }

    // If not liked → create like
    const postAuther = ckPost.userId
    const like = await Like.create(payload);
    await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { like: 1 } },
        { returnDocument: "after", runValidators: true }
    );



    // if (postAuther && userId && postAuther.toString() !== userId.toString()) {

    //     const notification = await createNotification({
    //         receiverId: postAuther,
    //         senderId: userId,
    //         type: NotificationTypes.POST_LIKE,
    //         title: "New Like!",
    //         body: ckPost?.caption as string,
    //     });

    //     const receiverIdStr = postAuther.toString();

    //     const socketId = onlineUsers[receiverIdStr];

    //     console.log("receiver", receiverIdStr, "socket", socketId);

    //     if (socketId) {
    //         console.log("yes")
    //         io.to(socketId).emit('new_notification_by_socket', notification);
    //     }
    // }
    if (postAuther && userId && postAuther.toString() !== userId.toString()) {

        const notification = await createNotification({
            receiverId: postAuther,
            senderId: userId,
            type: NotificationTypes.POST_LIKE,
            title: "New Like!",
            body: ckPost?.caption as string,
        });

        const receiverIdStr = postAuther.toString();


        io.to(receiverIdStr).emit('new_notification_by_socket', notification);
    }



    return {
        liked: true,
        message: "Post liked successfully",
        data: like
    };
};



export const likeService = {
    likeCreateOrDelete
}
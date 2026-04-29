import httpStatus from 'http-status-codes';
import mongoose, { Types } from "mongoose";
import admin from "../../config/firebaseConfiq";
import AppError from "../../errorHerlpers/AppError";
import { io } from '../../socket/socket.server';
import { createNotification } from '../../utils/Notifications';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { NotificationTypes } from '../Notifications/notification.interface';
import { User } from '../User/user.model';
import { IMessage } from "./message.interface";
import { Message, Room } from "./message.model";

// send message service
const sendMessage = async (payload: Partial<IMessage>) => {

    const { senderId, receiverId } = payload

    if (!senderId || !receiverId) {
        throw new AppError(httpStatus.NOT_FOUND, !senderId ? "senderId not found!" : "receiverId not found!")
    }
    const ids = [senderId, receiverId].sort()

    const smallerId = ids[0]
    const largerId = ids[1]

    let roomCk = await Room.findOne({
        user1: smallerId as Types.ObjectId,
        user2: largerId as Types.ObjectId
    })

    if (!roomCk) {

        roomCk = await Room.create({
            user1: smallerId as Types.ObjectId,
            user2: largerId as Types.ObjectId
        })
    }


    // message create kora holo
    const message = await Message.create({
        senderId: senderId as Types.ObjectId,
        receiverId: receiverId as Types.ObjectId,
        roomId: roomCk._id,
        messageText: payload.messageText as string
    })



    // receiver ar objectid k string a convert korlam
    let receiver = receiverId.toString()
    let sender = senderId.toString()



    if (senderId && receiverId) {


        const notification = await createNotification({
            receiverId: receiver,
            senderId: sender,
            type: NotificationTypes.MESSAGE,
            title: "New Message",
            body: payload.messageText,
        });



        io.to(receiver).emit('direct_message', message);
        io.to(receiver).emit('new_notification_by_socket', notification);

    } else {


        const notification = await createNotification({
            receiverId: receiver,
            senderId: sender,
            type: NotificationTypes.MESSAGE,
            title: "New Message",
            body: payload.messageText,
        });



        // user offline -> FCM push
        const user = await User.findById(receiverId); // receiverId from message

        if (user?.fcmToken) {
            const fcmMessage: admin.messaging.Message = {
                token: user.fcmToken,
                notification: { title: notification?.title, body: notification?.body },
                data: {
                    notificationId: notification._id.toString(),
                    type: notification.type,
                },
            };
            // eslint-disable-next-line no-console
            console.log("fcmmessage", fcmMessage)
            try {
                await admin.messaging().send(fcmMessage);
                // eslint-disable-next-line no-console
                console.log("Notification sent");
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error("FCM error:", err);
            }



        }
    }



    await Room.findOneAndUpdate(
        { _id: roomCk._id as mongoose.Types.ObjectId },
        {
            lastMessage: payload?.messageText as string
        },
        {
            returnDocument: "after",
            runValidators: true
        }
    )

    return message
}



// get-all-message
const getAllMessages = async (myId: string, otherUserId: string, query: Record<string, string>) => {




    if (!otherUserId) {
        throw new AppError(400, "roomId required")
    }

    const othersUser = await User.findById(otherUserId)

    if (!othersUser) {
        throw new AppError(httpStatus.NOT_FOUND, "Others user not found!")
    }



    const sortUser = [myId, otherUserId].sort()
    const roomck = await Room.findOne({ user1: sortUser[0] as string, user2: sortUser[1] as string })


    if (!roomck) {
        return {
            data: [],
            meta: {
                total: 0,
                page: 1,
                limit: query.limit ? Number(query.limit) : 10,
                totalPages: 0,
            },
        };
    }



    const queryBuilder = new QueryBuilder(Message.find(), query, { roomId: roomck?._id })

    const messagesDat = queryBuilder.filter().sort().fields().paginate().populate([{ path: "senderId", select: 'displayName image' }, { path: "receiverId", select: 'displayName image' }])

    const [data, meta] = await Promise.all([
        messagesDat.build(),
        queryBuilder.getMeta()
    ])
    return {
        data,
        meta
    }
}



export const messageService = {
    sendMessage,
    getAllMessages
}
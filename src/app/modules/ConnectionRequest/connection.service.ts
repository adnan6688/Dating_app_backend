import httpStatus from 'http-status-codes';
import AppError from "../../errorHerlpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { User } from "../User/user.model";
import { ConnectTypes, IConnection, StatusConnect, TconnectionRequest } from "./connection.interface";
import { ConnectionReq } from "./connection.model";





// send connection request
const connectionSend = async (payload: Partial<IConnection>) => {


    const { sendReq, recivedReq, type } = payload

    const senderIsExits = await User.findById(sendReq)
    const receivedReqExits = await User.findById(recivedReq)

    // ck user 
    if (!senderIsExits) {
        throw new AppError(httpStatus.NOT_FOUND, "Sender Not found!")
    }
    if (!receivedReqExits) {
        throw new AppError(httpStatus.NOT_FOUND, "Receiveder not found!")
    }

    const requestExists = await ConnectionReq.findOne({
        $or: [
            { sendReq, recivedReq },
            { sendReq: recivedReq, recivedReq: sendReq }
        ],

    } as any);



    if (requestExists) {
        const status = requestExists?.status
        const message =
            status === StatusConnect.PENDING
                ? "Connection request is already pending."
                : status === StatusConnect.ACCEPTED
                    ? "You are already connected with this user."
                    : "This connection request was declined.";

        throw new AppError(httpStatus.BAD_REQUEST, message)
    }




    // cheack available connection
    if (type === ConnectTypes.DATE && receivedReqExits?.availableForDate === false) {
        throw new AppError(httpStatus.BAD_REQUEST, "This user is not available for a date");
    } else if (type === ConnectTypes.DANCE && receivedReqExits?.availableForDance === false) {
        throw new AppError(httpStatus.BAD_REQUEST, "This user is not available for dancing");
    } else if (type === ConnectTypes.FRIEND && receivedReqExits?.availableForFriend === false) {
        throw new AppError(httpStatus.BAD_REQUEST, "This user is not available for friendship");
    }


    const createConnection = await ConnectionReq.create(payload)

    return createConnection
}

// accepte connection request
const connectionRequestAccept = async (payload: TconnectionRequest) => {


    const { _id: connectionId, status, myId } = payload


    const findConnection = await ConnectionReq.findById(connectionId)


    if (!findConnection) {
        throw new AppError(httpStatus.NOT_FOUND, "Connection Request Not found!")
    }





    if (findConnection?.recivedReq.toString() !== myId.toString()) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "You are not authorized to respond to this connection request because you are not the receiver."
        );
    }



    const update = await ConnectionReq.findOneAndUpdate(
        { _id: findConnection?._id },
        { $set: { _id: connectionId, status } },
        { returnDocument: "after", runValidators: true }
    )

    return update
}


// get connection 
const getConection = async (myId: string, query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(ConnectionReq.find({
        $or: [
            { sendReq: myId },
            { recivedReq: myId }
        ]
    }), query)

    const connectData = queryBuilder.filter().sort().fields().paginate().populate([{ path: "sendReq" }, { path: "recivedReq" }])


    const [data, meta] = await Promise.all([connectData.build(), queryBuilder.getMeta()])



    return {
        data,
        meta
    }

}


// request by me
const mySendRequest = async (myId: string, query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(ConnectionReq.find({
        sendReq: myId
    }), query)

    const connectData = queryBuilder.filter().sort().fields().paginate().populate([{ path: "sendReq", select: 'displayName image' }, { path: "recivedReq", select: 'displayName image' }])


    const [data, meta] = await Promise.all([connectData.build(), queryBuilder.getMeta()])


    return {
        data,
        meta
    }

}



const showAllRequestothersusersendMe = async (myId: string, query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(ConnectionReq.find({
        recivedReq: myId
    }), query)


     const connectData = queryBuilder.filter().sort().fields().paginate().populate([{ path: "sendReq", select: 'displayName image' }, { path: "recivedReq", select: 'displayName image' }])


    const [data, meta] = await Promise.all([connectData.build(), queryBuilder.getMeta()])


    return {
        data,
        meta
    }
}



export const connectionSerivce = {
    connectionSend,
    connectionRequestAccept,
    getConection,
    mySendRequest,
    showAllRequestothersusersendMe
}
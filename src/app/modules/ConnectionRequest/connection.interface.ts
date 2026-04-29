import { Types } from "mongoose";


export enum StatusConnect {
    PENDING = "PENDING",
    DECLINE = "DECLINE",
    ACCEPTED = "ACCEPTED"
}


export enum ConnectTypes {
    DANCE = "DANCE",
    DATE = "DATE",
    FRIEND = "FRIEND"
}

export interface IConnection {

    _id: Types.ObjectId;
    sendReq?: Types.ObjectId;
    recivedReq: Types.ObjectId;
    status: StatusConnect,
    type: ConnectTypes

}


export interface TconnectionRequest {
    _id: Types.ObjectId,
    status: StatusConnect,
    myId: Types.ObjectId
}

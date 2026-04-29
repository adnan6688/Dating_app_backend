import { Types } from "mongoose";
import { PaymentStatusEnum } from "./booking.model";


export interface IBooking {
    userId: Types.ObjectId;
    eventId: Types.ObjectId;
    ticketCount: number;
    fee: number;
    paymentStatus: PaymentStatusEnum.UNPAID | PaymentStatusEnum.PAID | PaymentStatusEnum.FAILED;
    txId?: string;
    useCount : number;
}
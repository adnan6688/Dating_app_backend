import { model, Schema } from "mongoose";
import { IBooking } from "./booking.interface";

export enum PaymentStatusEnum {
    UNPAID = "UNPAID",
    PAID = "PAID",
    FAILED = "FAILED"
}

const BookingSchema = new Schema<IBooking>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User id must be included"],
        },

        eventId: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: [true, "Event id must be included"],
        },

        ticketCount: {
            type: Number,
            required: true,
            min: 1,
        },

        fee: {
            type: Number,
            required: true,
        },

        paymentStatus: {
            type: String,
            enum: Object.values(PaymentStatusEnum),
            default: PaymentStatusEnum.UNPAID,
        },
        txId: {
            type: String
        },
        useCount: {
            default: 0,
            type: Number
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Booking = model<IBooking>("Booking", BookingSchema);
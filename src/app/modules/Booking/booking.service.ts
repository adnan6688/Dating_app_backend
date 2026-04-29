
import httpStatus from 'http-status-codes';
import Stripe from "stripe";
import { envVars } from "../../config/env";
import AppError from "../../errorHerlpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { generateTxId } from "../../utils/transectionId";
import { EStatus } from "../Events/event.interface";
import { Event } from "../Events/event.model";
import { User } from "../User/user.model";
import { IBooking } from "./booking.interface";
import { Booking, PaymentStatusEnum } from "./booking.model";

// Initialize Stripe
export const stripe = new Stripe(envVars.STRIPE_SECRET_KEY);



// Booking Service
const createBooking = async (payload: Partial<IBooking>) => {

  const findEvent = await Event.findById(payload.eventId)
  const findUser = await User.findById(payload.userId)

  if (!findEvent) {
    throw new AppError(httpStatus.NOT_FOUND, "This event not found!")
  }
  if (!findUser) {
    throw new AppError(httpStatus.NOT_FOUND, "This user not found!")
  }

  if ([EStatus.GOING, EStatus.END, EStatus.CANCELLED].includes(findEvent.status)) {

    throw new AppError(httpStatus.BAD_REQUEST, "sfsdfdsf")
  }


  const ticketCount = Number(payload.ticketCount);
  const feePerTicket = Number(findEvent.fee);



  if (isNaN(ticketCount) || ticketCount < 1) {
    throw new Error("Invalid ticket count");
  }

  if (isNaN(feePerTicket) || feePerTicket < 0) {
    throw new Error("Invalid fee");
  }

  // Calculate total fee
  const totalFee = feePerTicket * ticketCount;

  const txid = generateTxId()



  const bookId = await Booking.create({
    userId: findUser._id,
    eventId: findEvent._id,
    ticketCount: payload.ticketCount as number,
    fee: totalFee,
    paymentStatus: PaymentStatusEnum.UNPAID,
    txId: txid
  })

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",

    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: findEvent.title,
            images: [findEvent.image],

          },
          unit_amount: Number(findEvent.fee) * 100,
        },
        quantity: payload.ticketCount ?? 1,
      },
    ],

    customer_email: findUser.email,  // <-- your user email here


    success_url: "http://localhost:3000/payment-success",
    cancel_url: "http://localhost:3000/payment-cancel",

    metadata: {
      userId: findUser._id.toString(),
      eventId: findEvent._id.toString(),
      ticketCount: (payload.ticketCount ?? 1).toString(),
      bookId: bookId?._id.toString()
    },



    // 🔥 THIS IS THE REAL FIX
    payment_intent_data: {
      metadata: {
        userId: findUser._id.toString(),
        eventId: findEvent._id.toString(),
        ticketCount: (payload.ticketCount ?? 1).toString(),
        bookId: bookId._id.toString(),
      },
    },
  });



  return session.url;

};



// when payment will be success this webhook will be call
const handleEvent = async (stripeEvent: Stripe.Event) => {

  switch (stripeEvent.type) {

    // PAYMENT SUCCESS
    case "checkout.session.completed": {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;

      // const userId = session.metadata?.userId;
      const eventId = session.metadata?.eventId;
      const bookId = session.metadata?.bookId;



      if (!bookId) return;



      await Booking.findByIdAndUpdate(bookId, {
        paymentStatus: PaymentStatusEnum.PAID,
      });


      await Event.findByIdAndUpdate(eventId, {
        $inc: { attendanceTotal: Number(session.metadata?.ticketCount) },
      });

      break;
    }

    // PAYMENT FAILED
    case "payment_intent.payment_failed": {
      const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;

      const bookId = paymentIntent.metadata?.bookId;

      if (!bookId) return;

      // eslint-disable-next-line no-console
      console.log("payment_intent.payment_failed")
      await Booking.findByIdAndUpdate(bookId, {
        paymentStatus: PaymentStatusEnum.FAILED,
      });

      // eslint-disable-next-line no-console
      console.log("Payment Failed");
      break;
    }

    // SESSION EXPIRED
    case "checkout.session.expired": {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;

      const bookId = session.metadata?.bookId;

      if (!bookId) return;

      await Booking.findByIdAndUpdate(bookId, {
        paymentStatus: PaymentStatusEnum.FAILED,
      });

      // eslint-disable-next-line no-console
      console.log("⏳ Payment Expired");
      break;
    }

    // PAYMENT CANCELLED
    case "payment_intent.canceled": {
      const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;

      const bookId = paymentIntent.metadata?.bookId;

      if (!bookId) return;

      await Booking.findByIdAndUpdate(bookId, {
        paymentStatus: PaymentStatusEnum.FAILED,
      });

      // eslint-disable-next-line no-console
      console.log("Payment Cancelled");
      break;
    }

    default:
      // eslint-disable-next-line no-console
      console.log(`Unhandled event type ${stripeEvent.type}`);
  }
};

// get all my bookings
const getAllMyBookings = async (myId: string, query: Record<string, string>) => {

  const userFind = await User.findById(myId)

  if (!userFind) {
    throw new AppError(httpStatus.NOT_FOUND, "this user not found")
  }

  // , paymentStatus: PaymentStatusEnum.PAID
  const queribuilder = new QueryBuilder(Booking.find({ userId: myId, paymentStatus: PaymentStatusEnum.PAID }), query)


  const userdata = queribuilder
    .filter()
    .sort()
    .fields()
    .paginate()
    .populate([{ path: "userId", select: "image displayName" }, { path: "eventId", select: "title image" }])


  // jdi multiple populate korte hoi  tah hole populate([ {path : "interests"}, {path : "interests"} ])



  const [data, meta] = await Promise.all([
    userdata.build(),
    queribuilder.getMeta()
  ])


  return {
    data,
    meta
  }


}



// get all attendance member of event
const getJoinedMembers = async (eventId: string, query: Record<string, string>) => {
  const eventCk = await Event.findById(eventId)
  if (!eventCk) {
    throw new AppError(httpStatus.NOT_FOUND, "Event Not found!")
  }
  const querybuilder = new QueryBuilder(Booking.find(), query, { eventId: eventId, paymentStatus: PaymentStatusEnum.PAID })
  const userdata = querybuilder
    .filter()
    .sort()
    .fields()
    .paginate()
    .populate([{ path: "userId", select: "image displayName" }])
  const [data, meta] = await Promise.all([
    userdata.build(),
    querybuilder.getMeta()
  ])
  return {
    data,
    meta
  }
}


// get all booking for admin
const allBookingList = async (query: Record<string, string>) => {

  const queryBuilder = new QueryBuilder(Booking.find(), query)
  const bookingData = queryBuilder.filter().sort().fields().paginate().populate([{ path: "userId", select: "image displayName" }, { path: 'eventId', select: 'title image _id' }])
  const [data, meta] = await Promise.all([
    bookingData.build(),
    queryBuilder.getMeta()
  ])
  return {
    data,
    meta
  }
}


// update bookiing 
const updateBooking = async (id: string, useTicket: number) => {

  const ckBooking = await Booking.findById(id);

  if (!ckBooking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking Not found!");
  }

  const result = await Booking.findByIdAndUpdate(
    id,
    { $set: { useCount: useTicket } },
    { new: true }
  );



  return result;
};



// count documents of booking
const countBookingService = async () => {
  const total = await Booking.countDocuments();

  const paid = await Booking.countDocuments({ paymentStatus: PaymentStatusEnum.PAID });

  const failed = await Booking.countDocuments({ paymentStatus: PaymentStatusEnum.FAILED });

  const unpaid = await Booking.countDocuments({ paymentStatus: PaymentStatusEnum.UNPAID });

  return {
    total,
    paid,
    failed,
    unpaid,
  };
};








export const getBookingStats = async () => {
  const stats = await Booking.aggregate([
    {
      $group: {
        _id: "$paymentStatus",
        count: { $sum: 1 },
      },
    },
  ]);

  // default structure
  const result = {
    PAID: 0,
    UNPAID: 0,
    FAILED: 0,
  };

  stats.forEach((item) => {
    result[item._id as keyof typeof result] = item.count;
  });

  return result;
};




export const bookingService = {
  createBooking,
  handleEvent,
  getAllMyBookings,
  getJoinedMembers,
  allBookingList,
  updateBooking,
  countBookingService,
  getBookingStats
}
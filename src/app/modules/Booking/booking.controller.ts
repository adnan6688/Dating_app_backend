import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { bookingService, stripe } from "./booking.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'
import Stripe from "stripe";
import { envVars } from "../../config/env";
import AppError from "../../errorHerlpers/AppError";


// booking event
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const eventBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


  const userId = req?.user?.id
  req.body.userId = userId
  if (req?.body?.ticketCount > 10) {
    throw new AppError(httpStatus.BAD_REQUEST, "Maximum ticket count is 10");
  }

  const bookingRes = await bookingService.createBooking(req?.body)

  sendResponse(res, {
    message: 'payment successfully!',
    data: { url: bookingRes },
    statusCode: httpStatus.OK,
    success: true
  })

})



// when payment will be successfull
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const webHookController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const sig = req.headers["stripe-signature"]!;


  // eslint-disable-next-line no-console
  console.log("web hook controller start")
  const endpointSecret = envVars.WEB_HOOK_SECRET;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    // Object method call
    await bookingService.handleEvent(event);

    // eslint-disable-next-line no-console
    console.log("web hook controller middle")

    res.status(200).send({ received: true });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.log("Webhook error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});





// my bookings 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllMyBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


  const myId = req?.user?.id
  const query = req?.query
  const data = await bookingService.getAllMyBookings(myId as string, query as Record<string, string>)

  sendResponse(res, {
    message: 'All my bookings',
    data: data,
    statusCode: httpStatus.OK,
    success: true
  })


})


// joined members of event
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getJoinedMembers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


  const eventId = req?.params?.eventId as string

  const query = req?.query

  const data = await bookingService.getJoinedMembers(eventId, query as Record<string, string>)

  // data.meta.total = data.data.length


  sendResponse(res, {
    message: 'Get All joined members!',
    data: data,
    statusCode: httpStatus.OK,
    success: true
  })
})



// get all bookings for admin
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const allBookingList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const query = req?.query
  const data = await bookingService.allBookingList(query as Record<string, string>)


  sendResponse(res, {
    success: true,
    message: 'All-Booking List',
    data: data,
    statusCode: httpStatus.OK
  })

})


// use ticket update 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {



  const bookingId = req?.params?.id as string


  const { useCount } = req?.body


  const ans = await bookingService.updateBooking(bookingId, useCount)

  sendResponse(res, {
    success: true,
    message: 'Update Successfully!',
    data: ans,
    statusCode: httpStatus.OK
  })


})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const countBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {




  const data = await bookingService.countBookingService()

  sendResponse(res, {
    success: true,
    data: data,
    message: 'Count all Documents of booking',
    statusCode: httpStatus.OK
  })
})




const getBookingStatsController = async (req: Request, res: Response) => {


  const data = await bookingService.getBookingStats();

  res.status(200).json({
    success: true,
    message: "Booking stats fetched successfully",
    data,
  });
};


export const bookingController = {
  eventBooking,
  webHookController,
  getAllMyBookings,
  getJoinedMembers,
  allBookingList,
  updateBooking,
  countBooking,
  getBookingStatsController
}
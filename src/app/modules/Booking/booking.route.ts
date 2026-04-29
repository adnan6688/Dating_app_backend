import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { bookingController } from "./booking.controller";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { bookingZod } from "./booking.validation";



const route = Router()


route.post('/create-booking', validateRequest(bookingZod), checkAuth(...Object.values(Role)), bookingController.eventBooking)


route.get('/get-all-my-bookings' , checkAuth(...Object.values(Role)), bookingController.getAllMyBookings )


// get all attandance member of event
route.get('/get-all-joined-member/:eventId' , checkAuth(...Object.values(Role)) , bookingController.getJoinedMembers)


// get all booking for admin
route.get('/get-all-bookingList', checkAuth(Role.ADMIN) , bookingController.allBookingList)


// 
route.patch('/update-book-useCount/:id' , checkAuth(Role.ADMIN) , bookingController.updateBooking)



// count booking for admin 
route.get('/countBooking' , checkAuth(Role.ADMIN), bookingController.countBooking)



route.get("/stats", checkAuth(Role.ADMIN) , bookingController.getBookingStatsController);


export const BookingRouter = route
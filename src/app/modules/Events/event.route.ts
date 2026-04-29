import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { eventController } from "./event.controller";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { createEventZod, updateEventZod } from "./event.validation";
import { upload } from "../../config/multer.config";
// import { multerUpload } from "../../config/multer.config";





const route = Router()


// event created
route.post('/create-event', upload.single("file"), validateRequest(createEventZod), checkAuth(Role.ADMIN), eventController.createEvent)


// event details
route.get('/get-event-details/:id', checkAuth(...Object.values(Role)), eventController.eventDetails)


// get-all events
route.get('/events', checkAuth(...Object.values(Role)), eventController.getEvents)



// update route 
route.patch('/update-event/:id', upload.single('file'), validateRequest(updateEventZod), checkAuth(Role.ADMIN), eventController.updateEvents)


// get events for admin
route.get('/getEventsForAdmin', checkAuth(Role.ADMIN), eventController.getEventsForAdmin)



// admin status count

route.get('/admin-events-status-count' , checkAuth(Role.ADMIN), eventController.eventStatusCountContrller)



// top 5 event 
route.get('/top-five-events' , checkAuth(Role.ADMIN) , eventController.topFiveEvents)



export const EventRoute = route
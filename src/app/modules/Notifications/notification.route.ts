import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { NotificationController } from "./notification.controller";





const route = Router()



route.get('/notifications', checkAuth(...Object.values(Role)), NotificationController.notifications)



export const NotificationRoute = route
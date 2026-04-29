import { Router } from "express";
import { connectionController } from "./connection.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { connectionRequestBodyZod, connectionSendZod } from "./connection.validation";





const route = Router()


// send connection requst
route.post('/connection-request', validateRequest(connectionSendZod), checkAuth(...Object.values(Role)), connectionController.connectionSend)


// accept connection request
route.patch('/connection-request/:id/status', validateRequest(connectionRequestBodyZod), checkAuth(...Object.values(Role)), connectionController.connectionRequestAccept)


// my  connect data
route.get('/get-connect', checkAuth(...Object.values(Role)), connectionController.getConnect)



// ami kare kare send korsi 
route.get('/get-my-request', checkAuth(...Object.values(Role)), connectionController.sendRequest)


route.get('/others-user-sendMe', checkAuth(...Object.values(Role)) , connectionController.showAllRequestothersusersendMe)


export const ConnectionRouter = route
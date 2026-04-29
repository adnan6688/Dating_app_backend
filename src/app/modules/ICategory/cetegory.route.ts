import { Router } from "express";
import { cetegoryController } from "./cetegory.controller";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { categoryZodSchema, updateCetegoryzodSchema } from "./cetegory.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";



const route = Router()


// create cetegory
route.post('/create-cetegory', validateRequest(categoryZodSchema), checkAuth(Role.ADMIN), cetegoryController.createCetegory)


// get cetegories all
route.get('/cetegories', checkAuth(...Object.values(Role)), cetegoryController.getCetegory)

// update cetegory route
route.patch('/update-cetegory/:id', validateRequest(updateCetegoryzodSchema), checkAuth(Role.ADMIN), cetegoryController.updateCetegory)


// get cetegory for admin 
route.get('/get-cetegory-for-admin' , checkAuth(Role.ADMIN) , cetegoryController.getCategoryAdmin)


export const CetegoryRoute = route
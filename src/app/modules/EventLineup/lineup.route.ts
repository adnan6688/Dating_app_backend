import { Router } from "express";
import { lineupController } from "./lineup.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { EventLineUpZod, updateLineupZod } from "./lineupValidation";




const route = Router()


route.get('/lineup-data', checkAuth(...Object.values(Role)), lineupController.getLineup)



//only admin can access those route 
route.post('/lineup-create', validateRequest(EventLineUpZod), checkAuth(Role.ADMIN), lineupController.lineupcreated)
route.patch('/update-line/:id', checkAuth(Role.ADMIN), validateRequest(updateLineupZod), lineupController.updateLineUp)
route.delete('/delete-lineup/:lineupId', checkAuth(Role.ADMIN), lineupController.deleteLineup)






export const LineupRoute = route
import { Router } from "express";
import { interestController } from "./interest.controller";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { createInterestZod, updateInterestzod } from "./interest.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";




const router = Router()


// create interest
router.post('/create-interest', checkAuth(Role.ADMIN), validateRequest(createInterestZod), interestController.interestcreate)

// get all interest
router.get('/get-all-interest', checkAuth(...Object.values(Role)), interestController.getInterest)


// update interest
router.patch('/update-interest/:id', checkAuth(Role.ADMIN),  validateRequest(updateInterestzod), interestController. updateInterest)




export const InterestRouter = router
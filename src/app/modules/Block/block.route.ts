import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { blockController } from "./block.controller";




const route = Router()



route.post('/block-user', checkAuth(...Object.values(Role)) , blockController.blockingUer)
route.get('/myBlockList' , checkAuth(...Object.values(Role)) , blockController.myBlockList )
route.delete('/unblock-user' , checkAuth(...Object.values(Role)) , blockController.unblockUser)

export const BlockRoute = route
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { likeController } from "./like.controller";


const route = Router()


route.post('/likeOrDislike', checkAuth(...Object.values(Role)) , likeController.likeCreateOrDelete )


export const LikeRoute = route
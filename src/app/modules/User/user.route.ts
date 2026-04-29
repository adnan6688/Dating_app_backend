import { Router } from "express";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { userController } from "./user.controller";
import { createUserZodSchema, updatedUserSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { upload } from "../../config/multer.config";
// import { multerUpload } from "../../config/multer.config";








const router = Router()


// user registration route
router.post('/register', validateRequest(createUserZodSchema), userController.createUser)


// update user route
router.patch('/updateuser/:id',

    upload.single("file"),

    checkAuth(...Object.values(Role)),

    validateRequest(updatedUserSchema),

    userController.updateUser
)


//get all users
router.get('/users', checkAuth(...Object.values(Role)), userController.getAllUsers)

// get me
router.get('/getMe', checkAuth(...Object.values(Role)), userController.getMe)


// get single user
router.get('/singleUser/:id', checkAuth(...Object.values(Role)), userController.singleUser)







export const UserRoutes = router
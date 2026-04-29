import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { authController } from "./auth.controller";



const router = Router()

router.post('/login', authController.loginUser)


// when user authenticated
router.patch('/changePassword', checkAuth(...Object.values(Role)), authController.changePassword)

router.post('/logout', checkAuth(...Object.values(Role)), authController.logout)



router.post('/send-email-forget-password/:email', authController.sendOtpUseingEmail)


router.post('/verify-otp/:otp', checkAuth(...Object.values(Role)), authController.verifyController)


router.post('/chnage-pass', checkAuth(...Object.values(Role)), authController.changePassNewAndConfirm)


// router.post("/google-login", googleLoginController);


export const authRoutes = router
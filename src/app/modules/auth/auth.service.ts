import bcrypt from 'bcrypt';
import http_status_code from 'http-status-codes';
import { envVars } from "../../config/env";
import AppError from "../../errorHerlpers/AppError";
import { createUserTokens } from "../../utils/createUserTokens";
import { generateTokenFn } from "../../utils/jwt";
import { sendEmail } from "../../utils/sendOTP";
import { verifyGoogleToken } from "../../utils/VerifyIdTokenForGoogleLogin";
import { IUser, Status } from "../User/user.interface";
import { User } from "../User/user.model";
import { IChangePassword } from "./auth.interface";


// login service
const loginUser = async (payload: Partial<IUser>) => {

    const { email, password } = payload


    const isUserExits = await User.findOne({ email: email as string })


    if (!isUserExits) {
        throw new AppError(http_status_code.NOT_FOUND, "user not found")
    }

    if (isUserExits.status === Status.INACTIVE) {
        throw new AppError(http_status_code.BAD_REQUEST, "User is Restricted");
    }




    const matchPassword = await bcrypt.compare(password as string, isUserExits.password as string)
    if (!matchPassword) {
        throw new AppError(http_status_code.BAD_REQUEST, "Password doesn't match!")
    }

    const userTokens = await createUserTokens(isUserExits)


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExits.toObject()


    return {
        accessToken: (userTokens).accessToken,
        refreshToken: (userTokens).refreshToken,
        user: rest
    }

}




// change password when user is login
const changePasswordService = async (payload: IChangePassword) => {

    const { currentPassword, newPassword, confirmPassword, email } = payload

    if (newPassword !== confirmPassword) {
        throw new AppError(http_status_code.BAD_REQUEST, "password doesn't match!")
    }

    const user = await User.findOne({ email: email as string })
    if (!user) {
        throw new AppError(http_status_code.NOT_FOUND, "user not found!")
    }

    const isMatchPass = await bcrypt.compare(currentPassword, user?.password as string)
    if (!isMatchPass) {
        throw new AppError(http_status_code.BAD_REQUEST, "password deosn't match!")
    }

    const hassPass = await bcrypt.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))


    user.password = hassPass
    await user.save()

    return true


}


// forget password send otp when is forgot his password ..give me email send otp and token send 
const sendOtpUseingEmail = async (email: string) => {


    const user = await User.findOne({ email })

    if (!user) {
        throw new AppError(http_status_code.NOT_FOUND, "This user not found!")
    }

    const otp = await sendEmail(email)

    const userPayLoad = {
        email: user.email,
        id: user._id,
        role: user.role,
        otp
    }

    const accessToken = await generateTokenFn(userPayLoad, envVars.JWT_ACCESS_SECRET, "10m")



    return accessToken


}


// change password new password
const changePasswordNewAndConfirmed = async (email: string, password: string) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError(http_status_code.NOT_FOUND, "User not found!");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(
        password,
        Number(envVars.BCRYPT_SALT_ROUND)
    );

    // Update the user's password
    user.password = hashedPassword;

    await user.save();

    return true
};










export const googleLoginService = async (idToken: string) => {
    const payload = await verifyGoogleToken(idToken);


    // eslint-disable-next-line no-console
    console.log(payload, "google auth login")

    // const { email,  name,   picture,  sub,  email_verified  } = payload;


    // if (!email || !sub) {
    //     throw new Error("Invalid Google payload");
    // }

    // if (!email_verified) {
    //     throw new Error("Email not verified by Google");
    // }


    // let user = await User.findOne({ googleId: sub });

    // if (!user) {
    //     user = await User.findOne({ email });

    //     if (user) {
    //         // Link existing account
    //         user.googleId = sub;
    //         user.provider = "google";
    //         await user.save();
    //     } else {
    //         // Create new user
    //         user = await User.create({
    //             name,
    //             email,
    //             image: picture,
    //             googleId: sub,
    //             provider: "google",
    //         });
    //     }
    // }


    // const accessToken = jwt.sign(
    //     { id: user._id },
    //     process.env.JWT_SECRET as string,
    //     { expiresIn: "7d" }
    // );

    // return {
    //     user,
    //     accessToken,
    // };
};


export const loginService = {
    loginUser,
    changePasswordService,
    sendOtpUseingEmail,
    changePasswordNewAndConfirmed
}




// Google Login  using app

// Android App  ┐
//              ├── Google OAuth
// iOS App      ┘
//                 ↓
//            Google returns ID Token
//                 ↓
//            Node.js Backend
//                 ↓
//         Verify with Web Client ID
//                 ↓
//              Login
import { envVars } from "../config/env";
import { IUser } from "../modules/User/user.interface";

import { generateTokenFn } from "./jwt";




export const createUserTokens = async (payload: Partial<IUser>) => {


    const userPayLoad = {
        email: payload.email,
        id: payload._id,
        role: payload.role
    }


    // create accesstoken 
    const accessToken = await generateTokenFn(userPayLoad, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)



    // create refreshtoken
    const refreshToken = await generateTokenFn(userPayLoad, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)


    return {
        accessToken,
        refreshToken
    }
}
import { NextFunction, Request, Response } from "express";
import AppError from "../errorHerlpers/AppError";
import httpStatusCode from 'http-status-codes'
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { VerifiedTokenFn } from "../utils/jwt";
import { User } from './../modules/User/user.model';
import { Status } from "../modules/User/user.interface";


export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {

    try {



        const accessToken = req?.headers.authorization?.split(' ')[1] || req?.cookies?.accessToken || req?.headers?.authorization;


        if (!accessToken) {
            throw new AppError(httpStatusCode.BAD_REQUEST, "No Token Recived")
        }

        const varifiedToken = await VerifiedTokenFn(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload



        const isUserExits = await User.findOne({ email: varifiedToken.email })

        if (!isUserExits) {
            throw new AppError(httpStatusCode.BAD_REQUEST, "user doesn't exits")
        }

        // if (!isUserExits.isVerified) {
        //     throw new AppError(httpStatusCode.BAD_REQUEST, "user not verified!")
        // }


        if (!authRoles.includes(varifiedToken.role)) {
            throw new AppError(403, "You are not permitted to view this route!! ")
        }

        if (isUserExits.status === Status.INACTIVE) {
            throw new AppError(httpStatusCode.BAD_REQUEST, `User is Restricted!`)
        }



        req.user = varifiedToken

        next()

    }
    catch (error) {
        next(error)
    }

}


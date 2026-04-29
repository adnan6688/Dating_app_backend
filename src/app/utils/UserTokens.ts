import { Response } from "express";

interface ITokens {
    accessToken?: string;
    refreshToken?: string
}


// set tokens when user login
export const setTokens = async (res: Response, tokenInfo: ITokens) => {

    if (tokenInfo.accessToken) {
        res.cookie('accessToken', tokenInfo.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        })
    }

    if (tokenInfo?.refreshToken) {
        res.cookie('refreshToken', tokenInfo.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        })
    }

}


// clear tokens when user click on  logout ai
export const clearTokens = async (res: Response) => {


    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    })

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    })
}
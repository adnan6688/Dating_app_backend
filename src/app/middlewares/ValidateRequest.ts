import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";





export const validateRequest = (zodSchema: ZodTypeAny) => async (req: Request, res: Response, next: NextFunction) => {

    try {


        if (req.body.eventlineup && typeof req.body.eventlineup === "string") {
            req.body.eventlineup = JSON.parse(req.body.eventlineup)
        }

        if (req.body.tags && typeof req.body.tags === "string") {
            req.body.tags = JSON.parse(req.body.tags)
        }

        req.body = await zodSchema.parseAsync(req?.body)
        next()
    }
    catch (error) {
        next(error)
    }
}
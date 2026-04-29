import { IErrorsources } from "../middlewares/global.error.handler"


export interface IErrorSource {
    expected: string,
    code: string,
    path: string[],
    message: string
}



export const handleZodError = (err: any) => {

    const errorSource: IErrorsources[] = []


    err?.issues?.forEach((element: IErrorSource) => {

        errorSource.push({
            path: element?.path[element?.path?.length - 1] as string,
            message: element?.message
        })
    });




    return {
        statusCode : 400, 
        message :  "Zod Error", 
        errorSource
    }

}
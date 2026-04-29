class AppError extends Error{

    public statusCode : number;


    constructor(statusCode : number, message :string, stack? : ""){

        // Js ar Error class k call kore messsage ta pathai dilam
        super(message)


        // statusCode variable ar modde amader pathano statusCode  store korlam
        this.statusCode = statusCode


        if(stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}


export default AppError
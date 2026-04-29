
import cors from 'cors';
import express, { Request, Response } from 'express';
import http from 'http';
import { globalErrorHandler } from './app/middlewares/global.error.handler';
import { bookingController } from './app/modules/Booking/booking.controller';
import { router } from './app/routes';
import { initSocket } from './app/socket/socket.server';
const app = express()
const server = http.createServer(app)




// web hoook route
app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    (req, res, next) => {
        req.body = Buffer.from(req.body);
        next();
    },
    bookingController.webHookController
);

initSocket(server) //socket ta initialize korlam




app.use(express.json())// body theke data accepte korar jonno



app.use(cors()); // frontend theke jno api gula access korte pare
app.use(express.urlencoded({ extended: true }))


app.use("/api/v1", router) //main router 






app.get('/', (req: Request, res: Response) => {
    res.send('Welcome To our Dating App!!..');
});



// global error
app.use(globalErrorHandler)


// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((req, res, next) => { // ths middleware-> not found route when user click on unknown route this will be work
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Route not found'
    });
});


export default server
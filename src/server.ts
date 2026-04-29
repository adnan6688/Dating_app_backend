import dotenv from 'dotenv';
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { seedAdmin } from './app/utils/seedAdmin';
import { startEventScheduler } from './app/utils/startEventShedular';
import { envVars } from './app/config/env';
dotenv.config()



let server: Server



const startServer = async () => {

    console.log(envVars.MONGO_URI)
    try {
        await mongoose.connect(envVars.MONGO_URI as string)
        server = app.listen(envVars.PORT, () => {
            // eslint-disable-next-line no-console
            console.log(`server is listening on port ${process.env.PORT}`)
            console.log(envVars.MONGO_URI)
        })

        server.on("error", (err: any) => {
            if (err.code === "EADDRINUSE") {
                // eslint-disable-next-line no-console
                console.log("Port already in use");
            }
        });
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
    }
}


// server start
(
    async () => {
        await startServer()
        await seedAdmin()
        startEventScheduler()
    }
)()




process.on("SIGTERM", () => {
    // eslint-disable-next-line no-console
    console.log("SIGTERM signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }
    process.exit(1)
})

process.on("SIGINT", () => {
    // eslint-disable-next-line no-console
    console.log("SIGINT signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})


process.on("unhandledRejection", (err) => {
    // eslint-disable-next-line no-console
    console.log("Unhandled Rejecttion detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("uncaughtException", (err) => {
    // eslint-disable-next-line no-console
    console.log("Uncaught Exception detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

// Unhandler rejection error
// Promise.reject(new Error("I forgot to catch this promise"))

// Uncaught Exception Error
// throw new Error("I forgot to handle this local erro")


/**
 * unhandled rejection error
 * uncaught rejection error
 * signal termination sigterm
 */


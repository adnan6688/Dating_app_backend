import { Server } from "socket.io";

export let io: Server

export const onlineUsers: Record<string, string> = {

}
// { userId : socketId }

export const initSocket = async (httpServer: any) => {

    io = new Server(httpServer, {
        cors: {
            origin: "*"
        }
    })

    io.on("connection", (socket) => {

        let userId: string | null = null
        // user join 

        // Event: join-user
        socket.on('join-user', (_userId: string) => {

            userId = _userId;

            socket.join(userId);
            // eslint-disable-next-line no-console
            console.log("joinuser",userId)

            onlineUsers[userId] = socket.id;

            io.emit('get_online_users', Object.keys(onlineUsers));

            // eslint-disable-next-line no-console
            console.log("Online users",onlineUsers)
        });


        socket.on("disconnect", () => {
            if (userId) {
                delete onlineUsers[userId] // remove kore dilam from online user object theke
                io.emit('get_online_users', Object.keys(onlineUsers));
            }
        })


    })

}



import { Server as SocketIOServer } from "socket.io";
import http from "http";

export const intialSocketServer = (server: http.Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("notification", (data) => {
      io.emit("newNotification", data);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};











// import {Server as SocketIOServer} from "socket.io";
// import http from 'http';


// export const intialSocketServer = (server: http.Server) => {
//     const io = new SocketIOServer(server);

//     io.on("connection", (socket) => {
//         console.log('A user connected');


//         // listen  for notification event from the frontend

//         socket.on("notification", (data) => {

//             // broadcast the notification data to all connected clients

//             io.emit("newNotification", data);

//         });

//         socket.on("disconnect", () => {
//               console.log('A user disconnected');
//         });
//     });

    
// };



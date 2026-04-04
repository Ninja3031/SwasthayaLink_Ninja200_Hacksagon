import { Server } from "socket.io";
import { app } from "./app.js";
import http from "http";

const server = http.createServer(app);

// Configure Socket CORS bounds precisely
const io = new Server(server, {
   cors: {
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST", "PATCH"]
   }
});

// Map active user IDs to real-time socket traces
const userSocketMap = {};

io.on("connection", (socket) => {
   console.log("Real-time Gateway executed: ", socket.id);

   // Extract user trace from query
   const userId = socket.handshake.query.userId;
   if (userId && userId !== "undefined") {
       userSocketMap[userId] = socket.id;
   }

   socket.on("send_message", (messageData) => {
       const { receiverId, content, senderId, appointmentId } = messageData;
       const recipientSocket = userSocketMap[receiverId];

       // Overarchingly ping the recipient if they're actively connected!
       if (recipientSocket) {
           io.to(recipientSocket).emit("receive_message", {
               sender: { _id: senderId }, // Mock populate format for UI mapping natively
               receiver: receiverId,
               content,
               appointmentId,
               createdAt: new Date().toISOString()
           });
       }
   });

   socket.on("disconnect", () => {
       if (userId) delete userSocketMap[userId];
       console.log("Real-time Gateway closed: ", socket.id);
   });
});

export { app, io, server };

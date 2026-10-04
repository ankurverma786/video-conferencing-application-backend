import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDB from "./config/db.js";
import jwt from "jsonwebtoken";
import ChatMessage from "./models/ChatMessages.js";


const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const httpServer = http.createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      socket.userId = decoded.userId;

      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);


    socket.on("send-message", async ({ meetingId, message }) => {
  try {
    const chatMessage = await ChatMessage.create({
      meetingId,
      senderId: socket.userId,
      message,
    });

    socket.to(meetingId).emit("receive-message", {
      sender: socket.userId,
      message: chatMessage.message,
      createdAt: chatMessage.createdAt,
    });
  } catch (error) {
    console.error("Chat message error:", error.message);
  }
});

    // Offer
    socket.on("offer", ({ target, offer }) => {
      io.to(target).emit("offer", {
        sender: socket.id,
        offer,
      });
    });

    // Answer
    socket.on("answer", ({ target, answer }) => {
      io.to(target).emit("answer", {
        sender: socket.id,
        answer,
      });
    });

    // ICE Candidate
    socket.on("ice-candidate", ({ target, candidate }) => {
      io.to(target).emit("ice-candidate", {
        sender: socket.id,
        candidate,
      });
    });

    // Join Room
    socket.on("join-room", (meetingId) => {
      const room = io.sockets.adapter.rooms.get(meetingId);
      const existingUsers = room ? [...room] : [];

      socket.join(meetingId);

      // New user ko existing users bhejo
      socket.emit("existing-users", existingUsers);

      // Existing users ko new user ke baare mein batao
      socket.to(meetingId).emit("user-joined", {
        socketId: socket.id,
        userId: socket.userId,
      });
    });

    // Disconnect
    socket.on("disconnecting", () => {
      console.log(`User disconnected: ${socket.userId}`);

      socket.rooms.forEach((roomId) => {
        socket.to(roomId).emit("user-left", {
          socketId: socket.id,
        });
      });
    });
  });

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
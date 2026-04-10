import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { CONFIG } from "@config/config";
import { socketAuthMiddleware } from "interfaceAdapters/middleware/socketAuthMiddleware";
import { SocketRooms } from "./socketRooms";
import { userModel } from "@infrastructure/db/models/userModel";
import { investorModel } from "@infrastructure/db/models/investorModel";

export let io: Server;

const onlineUsers = new Set<string>();

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: CONFIG.FRONTEND_URL,
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    const { userId, role } = socket.data.user;

    onlineUsers.add(userId);

    io.emit("users:online-list", Array.from(onlineUsers));

    io.emit("user:online", { userId });

    socket.join(SocketRooms.user(userId));

    socket.join(SocketRooms.feed());

    console.log(" Socket connected:", {
      socketId: socket.id,
      userId,
      role,
    });

    socket.on("get:online-users", () => {
      socket.emit("users:online-list", Array.from(onlineUsers));
    });

    socket.on("post:join", (postId: string) => {
      socket.join(SocketRooms.post(postId));
      console.log(` Joined post room: ${postId}`);
    });

    socket.on("post:leave", (postId: string) => {
      socket.leave(SocketRooms.post(postId));
      console.log(` Left post room: ${postId}`);
    });

    socket.on("conversation:join", (conversationId: string) => {
      socket.join(SocketRooms.conversation(conversationId));
      console.log(` Joined conversation room: ${conversationId}`);
    });

    socket.on("conversation:leave", (conversationId: string) => {
      socket.leave(SocketRooms.conversation(conversationId));
      console.log(` Left conversation room: ${conversationId}`);
    });

    socket.on("chat:typing", ({ conversationId }) => {
      if (!conversationId) return;

      socket.to(SocketRooms.conversation(conversationId)).emit("chat:user-typing", {
        userId: socket.data.user.userId,
        conversationId,
      });
    });

    socket.on("chat:stop-typing", ({ conversationId }) => {
      if (!conversationId) return;

      socket.to(SocketRooms.conversation(conversationId)).emit("chat:user-stop-typing", {
        userId: socket.data.user.userId,
        conversationId,
      });
    });

    socket.onAny((event, ...args) => {
      console.log(" Event received:", event, args);
    });

    socket.on("disconnect", async () => {
      onlineUsers.delete(userId);

      const now = new Date();

      await Promise.all([
        userModel.findByIdAndUpdate(userId, { lastSeen: now }),
        investorModel.findByIdAndUpdate(userId, { lastSeen: now }),
      ]);

      io.emit("user:offline", { userId });
    });

    /* ------------------ VIDEO CALL ------------------ */

    // Join session room
    socket.on("session:join", (sessionId: string) => {
      socket.join(SocketRooms.session(sessionId));

      socket.to(SocketRooms.session(sessionId)).emit("video:user-joined", {
        userId: socket.data.user.userId,
      });

      console.log(` Joined session room: ${sessionId}`);
    });

    // Offer
    socket.on("video:offer", ({ sessionId, offer }) => {
      socket.to(SocketRooms.session(sessionId)).emit("video:offer", {
        offer,
        from: socket.data.user.userId,
      });
    });

    socket.on("video:ready", ({ sessionId }) => {
      socket.to(SocketRooms.session(sessionId)).emit("video:ready", {
        userId: socket.data.user.userId,
      });
    });

    // Answer
    socket.on("video:answer", ({ sessionId, answer }) => {
      socket.to(SocketRooms.session(sessionId)).emit("video:answer", {
        answer,
        from: socket.data.user.userId,
      });
    });

    // ICE Candidate
    socket.on("video:ice-candidate", ({ sessionId, candidate }) => {
      socket.to(SocketRooms.session(sessionId)).emit("video:ice-candidate", {
        candidate,
        from: socket.data.user.userId,
      });
    });

    socket.on("session:leave", ({ sessionId }) => {
      socket.leave(SocketRooms.session(sessionId));

      socket.to(SocketRooms.session(sessionId)).emit("video:user-left", {
        userId: socket.data.user.userId,
      });
    });

    socket.on("disconnecting", () => {
      socket.rooms.forEach((room) => {
        socket.to(room).emit("video:user-left", {
          userId: socket.data.user.userId,
        });
      });
    });
  });

  console.log(" Socket.IO initialized");
}

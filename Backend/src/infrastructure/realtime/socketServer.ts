import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { CONFIG } from "@config/config";
import { socketAuthMiddleware } from "interfaceAdapters/middleware/socketAuthMiddleware";
import { SocketRooms } from "./socketRooms";

export let io: Server;

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

    socket.join(SocketRooms.user(userId));

    socket.join(SocketRooms.feed());

    console.log(" Socket connected:", {
      socketId: socket.id,
      userId,
      role,
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
      socket.to(SocketRooms.conversation(conversationId)).emit("chat:user-typing", {
        userId: socket.data.user.userId,
        conversationId,
      });
    });

    socket.on("chat:stop-typing", ({ conversationId }) => {
      socket.to(SocketRooms.conversation(conversationId)).emit("chat:user-stop-typing", {
        userId: socket.data.user.userId,
        conversationId,
      });
    });

    socket.onAny((event, ...args) => {
      console.log(" Event received:", event, args);
    });

    socket.on("disconnect", () => {
      console.log(" Socket disconnected:", socket.id);
    });
  });

  console.log(" Socket.IO initialized");
}

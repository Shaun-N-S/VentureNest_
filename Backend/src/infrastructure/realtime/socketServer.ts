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
    transports: ["websocket"],
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    const { userId, role } = socket.data.user;

    socket.join(SocketRooms.feed());

    socket.on("post:join", (postId: string) => {
      socket.join(SocketRooms.post(postId));
    });

    socket.on("post:leave", (postId: string) => {
      socket.leave(SocketRooms.post(postId));
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected", socket.id);
    });
  });

  console.log("✅ Socket.IO initialized");
}

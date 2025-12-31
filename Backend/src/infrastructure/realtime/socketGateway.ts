import { Server } from "socket.io";
import { type Server as HttpServer } from "http";
import { CONFIG } from "@config/config";
import { socketAuthMiddleware } from "interfaceAdapters/middleware/socketAuthMiddleware";

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

    socket.join("feed:all-posts");

    console.log("Socket connected:", {
      socketId: socket.id,
      userId,
      role,
      rooms: Array.from(socket.rooms),
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", {
        socketId: socket.id,
        userId,
        reason,
      });
    });

    // ✅ Handle errors
    socket.on("error", (error) => {
      console.error("❌ Socket error:", {
        socketId: socket.id,
        userId,
        error: error.message,
      });
    });
  });

  console.log("✅ Socket.IO server initialized");
}

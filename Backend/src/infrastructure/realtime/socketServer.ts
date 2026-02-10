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

    // 🔑 Join personal room (MANDATORY)
    socket.join(SocketRooms.user(userId));

    // 📰 Join feed room
    socket.join(SocketRooms.feed());

    console.log("🟢 Socket connected:", {
      socketId: socket.id,
      userId,
      role,
    });

    // 🔗 Post-specific rooms
    socket.on("post:join", (postId: string) => {
      socket.join(SocketRooms.post(postId));
      console.log(`📌 Joined post room: ${postId}`);
    });

    socket.on("post:leave", (postId: string) => {
      socket.leave(SocketRooms.post(postId));
      console.log(`📤 Left post room: ${postId}`);
    });

    // 🧪 Debug helper
    socket.onAny((event, ...args) => {
      console.log("📨 Event received:", event, args);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });

  console.log("✅ Socket.IO initialized");
}

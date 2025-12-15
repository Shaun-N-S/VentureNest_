import { Server } from "socket.io";
import { type Server as HttpServer } from "http";
import { CONFIG } from "@config/config";

export let io: Server;

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: CONFIG.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected :", socket.id);
    socket.join("feed:all-posts");
  });
}

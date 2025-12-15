import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (token: string) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_BASE_URL, {
      auth: { token },
      transports: ["websocket"],
    });
  } else if (socket.disconnected) {
    socket.auth = { token };
    socket.connect();
  }
  return socket;
};

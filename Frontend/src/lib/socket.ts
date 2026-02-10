import { store } from "../store/store";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = () => {
  if (!socket) {
    const token = store.getState().token.token;

    if (!token) {
      console.warn("⛔ Socket init skipped: no token");
      return null;
    }

    socket = io(import.meta.env.VITE_API_BASE_URL, {
      auth: { token },
      transports: ["websocket"],
    });
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};

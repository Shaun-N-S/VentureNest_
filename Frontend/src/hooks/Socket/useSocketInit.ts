import { useEffect } from "react";
import { useSelector } from "react-redux";
import { initSocket, disconnectSocket } from "../../lib/socket";
import { registerFeedSocket } from "../../sockets/feed.socket";
import type { Rootstate } from "../../store/store";

export const useSocketInit = () => {
  const token = useSelector((state: Rootstate) => state.token.token);

  useEffect(() => {
    if (!token) return;

    const socket = initSocket();
    if (!socket) return;

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
    });

    registerFeedSocket(socket);

    return () => {
      socket.removeAllListeners();
      disconnectSocket();
    };
  }, [token]);
};

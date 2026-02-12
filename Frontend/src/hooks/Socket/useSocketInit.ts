import { useEffect } from "react";
import { useSelector } from "react-redux";
import { initSocket, disconnectSocket } from "../../lib/socket";
import { registerFeedSocket } from "../../sockets/feed.socket";
import { registerNotificationSocket } from "../../sockets/notification.socket";
import type { Rootstate } from "../../store/store";
import { registerChatSocket } from "../../sockets/chat.socket";

export const useSocketInit = () => {
  const token = useSelector((state: Rootstate) => state.token.token);

  useEffect(() => {
    if (!token) return;

    console.log("Initializing socket listeners");

    const socket = initSocket();
    if (!socket) return;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("notification:new", (data) => {
      console.log(" Realtime notification received", data);
    });

    registerFeedSocket(socket);

    registerNotificationSocket(socket);

    registerChatSocket(socket);

    return () => {
      console.log("Cleaning up socket");
      socket.removeAllListeners();
      // disconnectSocket();
    };
  }, [token]);
};

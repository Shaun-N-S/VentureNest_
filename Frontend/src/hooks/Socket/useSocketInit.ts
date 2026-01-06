import { useEffect } from "react";
import { initSocket, disconnectSocket, getSocket } from "../../lib/socket";
import { registerFeedSocket } from "../../sockets/feed.socket";

export const useSocketInit = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) return;

    initSocket();
    const socket = getSocket();

    socket?.onAny((event, payload) => {
      console.log("🟣 FRONTEND SOCKET EVENT:", event, payload);
    });

    registerFeedSocket();

    return () => {
      socket?.offAny(); 
      disconnectSocket();
    };
  }, [enabled]);
};

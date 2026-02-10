import { Socket } from "socket.io";
import * as cookie from "cookie";
import { JWTService } from "@infrastructure/services/jwtService";

const jwtService = new JWTService();

export const socketAuthMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  try {
    let token: string | undefined;

    // 1️⃣ From socket auth (PRIMARY)
    token = socket.handshake.auth?.token;

    // 2️⃣ Optional cookie fallback (future-safe)
    if (!token && socket.request.headers.cookie) {
      const cookies = cookie.parse(socket.request.headers.cookie);
      token = cookies.access_token;
    }

    if (!token) {
      console.error("❌ Socket auth failed: No token");
      return next(new Error("Unauthorized"));
    }

    const decoded = jwtService.verifyAccessToken(token);

    if (!decoded) {
      console.error("❌ Socket auth failed: Invalid token");
      return next(new Error("Unauthorized"));
    }

    socket.data.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    console.log("🟢 Socket auth success:", decoded.userId);
    next();
  } catch (err) {
    console.error("❌ Socket auth exception:", err);
    next(new Error("Unauthorized"));
  }
};

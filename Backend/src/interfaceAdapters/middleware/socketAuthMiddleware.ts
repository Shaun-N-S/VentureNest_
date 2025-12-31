import { Socket } from "socket.io";
import cookie from "cookie";
import { TokenExpiredException } from "application/constants/exceptions";
import { JWTService } from "@infrastructure/services/jwtService";
import { JWTPayloadType } from "domain/types/JWTPayloadTypes";

const jwtService = new JWTService();

export const socketAuthMiddleware = async (socket: Socket, next: (err?: Error) => void) => {
  try {
    const cookies = cookie.parse(socket.request.headers.cookie || "");
    const token = cookies.access_token;

    console.log("🔐 Socket auth middleware:", {
      socketId: socket.id,
      hasCookie: !!token,
    });

    if (!token) {
      console.error("❌ Socket auth failed: No token");
      return next(new TokenExpiredException("Unauthorized: Token missing"));
    }

    const decoded = jwtService.verifyAccessToken(token) as JWTPayloadType;

    if (!decoded) {
      console.error("❌ Socket auth failed: Invalid token");
      return next(new Error("Unauthorized"));
    }

    socket.data.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    console.log("✅ Socket authenticated:", {
      socketId: socket.id,
      userId: decoded.userId,
      role: decoded.role,
    });

    next();
  } catch (err) {
    console.error("❌ Socket auth error:", err);
    next(new Error("Unauthorized"));
  }
};

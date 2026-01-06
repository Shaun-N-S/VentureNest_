import { Socket } from "socket.io";
import cookie from "cookie";
import { JWTService } from "@infrastructure/services/jwtService";

const jwtService = new JWTService();

export const socketAuthMiddleware = async (socket: Socket, next: (err?: Error) => void) => {
  try {
    const cookies = cookie.parse(socket.request.headers.cookie || "");
    const token = cookies.access_token;

    if (!token) return next(new Error("Unauthorized"));

    const decoded = jwtService.verifyAccessToken(token);
    if (!decoded) return next(new Error("Unauthorized"));

    socket.data.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch {
    next(new Error("Unauthorized"));
  }
};

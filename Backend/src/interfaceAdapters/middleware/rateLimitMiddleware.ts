import rateLimit from "express-rate-limit";
import { Request } from "express";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: HTTPSTATUS.TOO_MANY_REQUESTS,
  skip: (req: Request) => req.path === "/health" || req.path === "/metrics",
  message: {
    success: false,
    message: MESSAGES.RATE_LIMIT.TOO_MANY_REQUESTS,
  },
});

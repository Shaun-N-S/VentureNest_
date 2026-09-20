import { Request, Response } from "express";
import mongoose from "mongoose";
import { HTTPSTATUS } from "@shared/constants/httpStatus";

export class HealthController {
  getHealth(req: Request, res: Response): void {
    const isMongoConnected = mongoose.connection.readyState === 1;

    res.status(isMongoConnected ? HTTPSTATUS.OK : HTTPSTATUS.SERVICE_UNAVAILABLE).json({
      status: isMongoConnected ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      mongo: isMongoConnected ? "connected" : "disconnected",
    });
  }
}

export const healthController = new HealthController();

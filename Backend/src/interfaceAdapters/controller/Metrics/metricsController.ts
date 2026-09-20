import { Request, Response } from "express";
import { register } from "@infrastructure/metrics/prometheusRegistry";

export class MetricsController {
  async getMetrics(req: Request, res: Response): Promise<void> {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  }
}

export const metricsController = new MetricsController();

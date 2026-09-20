import { Request, Response, NextFunction } from "express";
import {
  httpRequestsTotal,
  httpRequestDurationSeconds,
  httpRequestsInProgress,
  httpErrorsTotal,
} from "@infrastructure/metrics/httpMetrics";

function getRouteLabel(req: Request): string {
  const routePath = req.route?.path as string | undefined;
  if (!routePath) {
    return "unmatched";
  }
  if (routePath === "/") {
    return req.baseUrl || "/";
  }
  return `${req.baseUrl}${routePath}`;
}

export function httpMetricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const { method } = req;
  const startTime = process.hrtime.bigint();
  let recorded = false;

  httpRequestsInProgress.inc({ method });

  const recordMetrics = () => {
    if (recorded) return;
    recorded = true;

    const route = getRouteLabel(req);
    const statusCode = String(res.statusCode);
    const durationSeconds = Number(process.hrtime.bigint() - startTime) / 1e9;

    httpRequestsInProgress.dec({ method });
    httpRequestsTotal.inc({ method, route, status_code: statusCode });
    httpRequestDurationSeconds.observe({ method, route }, durationSeconds);

    if (res.statusCode >= 400) {
      httpErrorsTotal.inc({ method, route, status_code: statusCode });
    }
  };

  res.on("finish", recordMetrics);
  res.on("close", recordMetrics);

  next();
}

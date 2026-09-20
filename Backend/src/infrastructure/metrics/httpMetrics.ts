import client from "prom-client";
import { register } from "./prometheusRegistry";

export const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"] as const,
  registers: [register],
});

export const httpRequestDurationSeconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route"] as const,
  registers: [register],
});

export const httpRequestsInProgress = new client.Gauge({
  name: "http_requests_in_progress",
  help: "Number of HTTP requests currently in progress",
  labelNames: ["method"] as const,
  registers: [register],
});

export const httpErrorsTotal = new client.Counter({
  name: "http_errors_total",
  help: "Total number of HTTP responses with a 4xx or 5xx status code",
  labelNames: ["method", "route", "status_code"] as const,
  registers: [register],
});

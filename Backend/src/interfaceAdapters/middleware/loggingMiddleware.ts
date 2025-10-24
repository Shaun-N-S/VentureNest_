import morgan from "morgan";
import { Express, Request, Response } from "express";
import { CONFIG } from "@config/config";
import { createRotatingFileStream } from "@shared/utils/rfs";
import path from "path";

export function loggingMiddleware(app: Express) {
  if (CONFIG.NODE_ENV === "DEVELOPMENT") {
    app.use(morgan("combined"));
  } else {
    const accessLogsStream = createRotatingFileStream(
      "1d",
      7,
      path.join(__dirname, "..", "logs", "accesslogs")
    );

    const errorLogsStream = createRotatingFileStream(
      "1d",
      7,
      path.join(__dirname, "..", "logs", "errorLogs")
    );

    app.use(morgan("combined", { stream: accessLogsStream }));
    app.use(
      morgan("combined", {
        stream: errorLogsStream,
        skip: (req: Request, res: Response) => res.statusCode < 400,
      })
    );
  }
}

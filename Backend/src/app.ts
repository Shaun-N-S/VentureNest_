import { CONFIG } from "@config/config";
import { mongoConnect } from "@infrastructure/db/connectDB/mongoConnect";
import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";

import cookieParser from "cookie-parser";
import { User_Router } from "interfaceAdapters/routes/userRoutes";
import { DateTimeUtil } from "@shared/utils/DateTimeUtil";
import { createStream } from "rotating-file-stream";
import path from "path";
import { Investor_Router } from "interfaceAdapters/routes/investorRoutes";
import { Admin_Routes } from "interfaceAdapters/routes/adminRoutes";

class Express_app {
  private _app: Express;
  constructor() {
    this._app = express();
    mongoConnect.connect();
    this._setLoggingMiddleware();
    this._setMiddleware();
    this._setRoutes();
  }

  private _setMiddleware() {
    this._app.use(
      cors({
        origin: CONFIG.FRONTEND_URL,
        credentials: true,
      })
    );
    this._app.use(express.json());
    this._app.use(cookieParser());
  }

  private _setLoggingMiddleware() {
    if (CONFIG.NODE_ENV === "development") {
      this._app.use(morgan("dev"));
    } else if (CONFIG.NODE_ENV === "production") {
      const accessLogs = createStream(
        (time, index) => {
          if (!time) return path.join(__dirname, "logs", "accessLogs", "buffer.txt");
          return path.join(
            __dirname,
            "logs",
            "accessLogs",
            DateTimeUtil.getFormatedDateTime(new Date()) + index + ".txt"
          );
        },
        {
          interval: "1d",
          size: "100M",
        }
      );

      const errorLogs = createStream(
        (time, index) => {
          if (!time) return path.join(__dirname, "logs", "errorLogs", "buffer.txt");
          return path.join(
            __dirname,
            "logs",
            "errorLogs",
            DateTimeUtil.getFormatedDateTime(new Date()) + index + ".txt"
          );
        },
        {
          interval: "1d",
          size: "100M",
        }
      );

      // accesslogs middleware
      this._app.use(morgan("dev", { stream: accessLogs }));

      // error logs (skips if statuscode is less than 400)
      this._app.use(morgan("dev", { stream: errorLogs, skip: (req, res) => res.statusCode < 400 }));
    }
  }

  private _setRoutes() {
    // Auth routes
    this._app.use("/auth", new User_Router().get_router());
    this._app.use("/auth", new Investor_Router().get_router());
    this._app.use("/auth", new Admin_Routes().get_router());

    // Admin routes
    this._app.use("/admin", new Admin_Routes().get_router());
  }

  listen() {
    this._app.listen(CONFIG.PORT, (err) => {
      if (err) {
        console.log("Error while starting server");
        throw err;
      }
      console.log(`Server is running on PORT : ${CONFIG.PORT}`);
    });
  }
}

const _app = new Express_app();
_app.listen();

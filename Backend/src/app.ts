import { CONFIG } from "@config/config";
import { mongoConnect } from "@infrastructure/db/connectDB/mongoConnect";
import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { User_Router } from "interfaceAdapters/routes/userRoutes";

class Express_app {
  private _app: Express;
  constructor() {
    this._app = express();
    mongoConnect.connect();
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

  private _setRoutes() {
    this._app.use("/auth/", new User_Router().get_router());
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

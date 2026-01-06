import { CONFIG } from "@config/config";
import { mongoConnect } from "@infrastructure/db/connectDB/mongoConnect";
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { User_Router } from "interfaceAdapters/routes/userRoutes";
import { Investor_Router } from "interfaceAdapters/routes/investorRoutes";
import { Admin_Routes } from "interfaceAdapters/routes/adminRoutes";
import { errorHandlingMiddleware } from "interfaceAdapters/middleware/errorHandlingMiddleware";
import { loggingMiddleware } from "interfaceAdapters/middleware/loggingMiddleware";
import { Post_Router } from "interfaceAdapters/routes/postRoute";
import { Relationship_Router } from "interfaceAdapters/routes/relationshipRoutes";
import { Comment_Router } from "interfaceAdapters/routes/commentRoutes";
import { Reply_Router } from "interfaceAdapters/routes/replyRoutes";
import { Project_Router } from "interfaceAdapters/routes/projectRoutes";
import http from "http";
import { initSocket } from "@infrastructure/realtime/socketServer";

class Express_app {
  private _app: Express;
  constructor() {
    this._app = express();
    mongoConnect.connect();
    this._setLoggingMiddleware();
    this._setMiddleware();
    this._setRoutes();
    this._setErrorHandlingMiddleware();
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
    loggingMiddleware(this._app);
  }

  private _setRoutes() {
    // Auth routes
    this._app.use("/auth", new User_Router().get_router());
    this._app.use("/auth", new Investor_Router().get_router());
    this._app.use("/auth", new Admin_Routes().get_router());

    this._app.use("/investor", new Investor_Router().get_router());
    this._app.use("/user", new User_Router().get_router());

    this._app.use("/admin", new Admin_Routes().get_router());

    this._app.use("/posts", new Post_Router().get_router());

    this._app.use("/projects", new Project_Router().get_router());

    this._app.use("/relations", new Relationship_Router().get_router());

    this._app.use("/comment", new Comment_Router().get_router());

    this._app.use("/replies", new Reply_Router().get_router());
  }

  private _setErrorHandlingMiddleware() {
    this._app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      errorHandlingMiddleware(err, req, res, next);
    });
  }

  listen() {
    const server = http.createServer(this._app);
    initSocket(server);

    server.listen(CONFIG.PORT, (err?: any) => {
      console.log(`Server is running on PORT : ${CONFIG.PORT}`);
    });
  }
}

const _app = new Express_app();
_app.listen();

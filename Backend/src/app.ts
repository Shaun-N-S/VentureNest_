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
import { Report_Router } from "interfaceAdapters/routes/reportRoutes";
import { Plan_Routes } from "interfaceAdapters/routes/planRoutes";
import { Webhook_Routes } from "interfaceAdapters/routes/webhookRoutes";
import { Subscription_Routes } from "interfaceAdapters/routes/subscriptionRoutes";
import { Ticket_Router } from "interfaceAdapters/routes/ticketRoutes";
import { Session_Router } from "interfaceAdapters/routes/sessionRoute";
import { Pitch_Router } from "interfaceAdapters/routes/pitchRoutes";
import { InvestmentOffer_Router } from "interfaceAdapters/routes/investmentOfferRoutes";
import { Wallet_Router } from "interfaceAdapters/routes/walletRoutes";
import { Transaction_Routes } from "interfaceAdapters/routes/transactionRoutes";
import { Notification_Router } from "interfaceAdapters/routes/notificationRoutes";
import { Chat_Router } from "interfaceAdapters/routes/chatRoutes";

class Express_app {
  private _app: Express;
  constructor() {
    this._app = express();
    mongoConnect.connect();
    this._app.use("/api/webhook", new Webhook_Routes().get_router());
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

    this._app.use("/reports", new Report_Router().get_router());

    this._app.use("/plans", new Plan_Routes().get_router());

    this._app.use("/subscriptions", new Subscription_Routes().get_router());

    this._app.use("/tickets", new Ticket_Router().get_router());

    this._app.use("/sessions", new Session_Router().get_router());

    this._app.use("/pitches", new Pitch_Router().get_router());

    this._app.use("/offers", new InvestmentOffer_Router().get_router());

    this._app.use("/wallet", new Wallet_Router().get_router());

    this._app.use("/transactions", new Transaction_Routes().get_router());

    this._app.use("/notifications", new Notification_Router().get_router());

    this._app.use("/chat", new Chat_Router().get_router());
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

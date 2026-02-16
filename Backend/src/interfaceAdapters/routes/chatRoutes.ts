import { chatController } from "@infrastructure/DI/Chat/chatContainer";
import { Router, Request, Response, NextFunction } from "express";
import { userOrInvestorGuard } from "interfaceAdapters/middleware/guards";
import { ROUTES } from "@shared/constants/routes";

export class Chat_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoutes();
  }

  private _setRoutes() {
    this._route.post(
      ROUTES.CHAT.CREATE_CONVERSATION,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) =>
        chatController.createConversation(req, res, next)
    );

    this._route.get(
      ROUTES.CHAT.GET_CONVERSATIONS,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) =>
        chatController.getUserConversations(req, res, next)
    );

    this._route.get(
      ROUTES.CHAT.GET_MESSAGES,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) =>
        chatController.getMessages(req, res, next)
    );

    this._route.post(
      ROUTES.CHAT.SEND_MESSAGE,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) =>
        chatController.sendMessage(req, res, next)
    );

    this._route.patch(
      ROUTES.CHAT.MARK_READ,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) =>
        chatController.markConversationRead(req, res, next)
    );

    this._route.get(
      ROUTES.CHAT.UNREAD_COUNT,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) =>
        chatController.getUnreadCount(req, res, next)
    );
  }

  public get_router(): Router {
    return this._route;
  }
}

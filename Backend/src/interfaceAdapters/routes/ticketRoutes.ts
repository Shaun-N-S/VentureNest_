import { ticketController } from "@infrastructure/DI/Ticket/ticketContainer";
import { ROUTES } from "@shared/constants/routes";
import { NextFunction, Request, Response, Router } from "express";
import { investorGuard, userGuard } from "interfaceAdapters/middleware/guards";

export class Ticket_Router {
  private _route: Router;
  constructor() {
    this._route = Router();
    this._setRoute();
  }

  private _setRoute() {
    this._route.post(
      ROUTES.TICKET.CREATE,
      ...investorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        ticketController.createTicket(req, res, next);
      }
    );

    this._route.get(
      ROUTES.TICKET.INVESTOR_TICKETS,
      ...investorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        ticketController.getTicketsByInvestor(req, res, next);
      }
    );

    this._route.get(
      ROUTES.TICKET.FOUNDER_TICKETS,
      ...userGuard,
      (req: Request, res: Response, next: NextFunction) => {
        ticketController.getFounderTickets(req, res, next);
      }
    );

    this._route.get(
      ROUTES.TICKET.TICKET_BY_ID,
      ...investorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        ticketController.getTicketById(req, res, next);
      }
    );
  }

  public get_router(): Router {
    return this._route;
  }
}

import { Request, Response, NextFunction } from "express";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { CreateTicketWithSessionDTO } from "application/dto/ticket/CreateTicketWithSessionDTO";
import { ICreateTicketWithSessionUseCase } from "@domain/interfaces/useCases/ticket/ICreateTicketWithSessionUseCase ";
import { createTicketWithSessionSchema } from "@shared/validations/ticketValidation";
import { IGetTicketsByInvestorUseCase } from "@domain/interfaces/useCases/ticket/IGetTicketsByInvestorUseCase";

export class TicketController {
  constructor(
    private _createTicketSession: ICreateTicketWithSessionUseCase,
    private _getTicketsByInvestor: IGetTicketsByInvestorUseCase
  ) {}

  async createTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const investorId = res.locals.user.userId;

      const parsed = createTicketWithSessionSchema.parse(req.body);

      const data: CreateTicketWithSessionDTO = {
        ...parsed,
        investorId,
      };

      const result = await this._createTicketSession.execute(data);

      ResponseHelper.success(
        res,
        MESSAGES.TICKET.TICKET_SESSION_CREATED_SUCCESSFULLY,
        result,
        HTTPSTATUS.CREATED
      );
    } catch (error) {
      next(error);
    }
  }

  async getTicketsByInvestor(req: Request, res: Response, next: NextFunction) {
    try {
      const investorId = res.locals.user.userId;

      const tickets = await this._getTicketsByInvestor.execute(investorId);

      ResponseHelper.success(
        res,
        MESSAGES.TICKET.TICKET_FETCHED_SUCCESSFULLY,
        tickets,
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }
}

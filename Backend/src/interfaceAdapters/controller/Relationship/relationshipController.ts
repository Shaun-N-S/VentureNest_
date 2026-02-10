import { IGetConnectionReqUseCase } from "@domain/interfaces/useCases/relationship/IGetConnectionReqUseCase";
import { IGetConnectionsPeopleListUseCase } from "@domain/interfaces/useCases/relationship/IGetConnectionsPeopleListUseCase ";
import { IGetNetworkUsersUseCase } from "@domain/interfaces/useCases/relationship/IGetNetworkUsersUseCase";
import { IGetRelationshipStatusUseCase } from "@domain/interfaces/useCases/relationship/IGetRelationshipStatusUseCase";
import { IRemoveConnectionUseCase } from "@domain/interfaces/useCases/relationship/IRemoveConnectionUseCase";
import { ISendConnectionReqUseCase } from "@domain/interfaces/useCases/relationship/ISendConnectionReqUseCase";
import { IUpdateConnectionReqStatusUseCase } from "@domain/interfaces/useCases/relationship/IUpdateConnectionReqStatusUseCase";
import { Errors } from "@shared/constants/error";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { InvalidDataException } from "application/constants/exceptions";
import { NextFunction, Request, Response } from "express";

export class RelationshipController {
  constructor(
    private _sendConnectionReqUseCase: ISendConnectionReqUseCase,
    private _getNetwrokUsersUseCase: IGetNetworkUsersUseCase,
    private _getConnectionReqUseCase: IGetConnectionReqUseCase,
    private _udpateConnectionReqStatusUseCase: IUpdateConnectionReqStatusUseCase,
    private _getConnectionsPeopleListUseCase: IGetConnectionsPeopleListUseCase,
    private _removeConnectionUseCase: IRemoveConnectionUseCase,
    private _getRelationshipStatusUseCase: IGetRelationshipStatusUseCase
  ) {}

  async getNetworkUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;
      const currentUserId = res.locals?.user?.userId;

      if (page < 1 || limit < 1 || limit > 100) {
        throw new InvalidDataException(Errors.INVALID_PAGINATION_PARAMETERS);
      }

      const results = await this._getNetwrokUsersUseCase.execute(
        page,
        limit,
        search,
        currentUserId
      );

      ResponseHelper.success(
        res,
        MESSAGES.RELATIONSHIP.FETCHED_USERS_SUCCESSFULLY,
        {
          data: results,
        },
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async sendConnection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const fromUserId = res.locals?.user?.userId;
      const toUserId = req.params.toUserId;
      console.log(fromUserId, toUserId);
      if (!toUserId || !fromUserId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      await this._sendConnectionReqUseCase.execute(fromUserId, toUserId);

      ResponseHelper.success(
        res,
        MESSAGES.RELATIONSHIP.CONNECTION_SEND_SUCCESSFULLY,
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async getConnectionReq(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = res.locals?.user?.userId;
      const page = parseInt(req.params.page as string) || 1;
      const limit = parseInt(req.params.limit as string) || 10;

      const results = await this._getConnectionReqUseCase.execute(userId, page, limit);
      ResponseHelper.success(
        res,
        MESSAGES.RELATIONSHIP.FETCHED_PERSONAL_REQ_SUCCESSFULLY,
        results,
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async updateConnectionReqStaus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const toUserId = res.locals?.user?.userId;
      const fromUserId = req.params.fromUserId;
      const status = req.params.status?.toLowerCase();

      if (!toUserId || !fromUserId || !status) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const result = await this._udpateConnectionReqStatusUseCase.execute(
        fromUserId,
        toUserId,
        status
      );

      ResponseHelper.success(
        res,
        MESSAGES.RELATIONSHIP.STATUS_UPDATTED_SUCCESSFULLY,
        { updated: result },
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async getConnectionsPeopleList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = res.locals.user.userId;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search?.toString();

      const result = await this._getConnectionsPeopleListUseCase.execute(
        userId,
        page,
        limit,
        search
      );

      ResponseHelper.success(
        res,
        MESSAGES.RELATIONSHIP.CONNECTIONS_FETCHED_SUCCESSFULLY,
        result,
        HTTPSTATUS.OK
      );
    } catch (err) {
      next(err);
    }
  }

  async removeConnection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUserId = res.locals.user.userId;
      const targetUserId = req.params.userId;

      if (!currentUserId || !targetUserId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const removed = await this._removeConnectionUseCase.execute(currentUserId, targetUserId);

      ResponseHelper.success(
        res,
        MESSAGES.RELATIONSHIP.CONNECTION_REMOVED_SUCCESSFULLY,
        { removed },
        HTTPSTATUS.OK
      );
    } catch (err) {
      next(err);
    }
  }

  async getRelationshipStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUserId = res.locals.user.userId;
      const targetUserId = req.params.userId;

      if (!currentUserId || !targetUserId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const result = await this._getRelationshipStatusUseCase.execute(currentUserId, targetUserId);

      ResponseHelper.success(
        res,
        MESSAGES.RELATIONSHIP.RELATIONSHIP_STATUS_FETCHED,
        result,
        HTTPSTATUS.OK
      );
    } catch (err) {
      next(err);
    }
  }

  async getUserConnectionsPeopleList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const targetUserId = req.params.userId;

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search?.toString();

      if (!targetUserId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const result = await this._getConnectionsPeopleListUseCase.execute(
        targetUserId,
        page,
        limit,
        search
      );

      ResponseHelper.success(
        res,
        MESSAGES.RELATIONSHIP.CONNECTIONS_FETCHED_SUCCESSFULLY,
        result,
        HTTPSTATUS.OK
      );
    } catch (err) {
      next(err);
    }
  }
}

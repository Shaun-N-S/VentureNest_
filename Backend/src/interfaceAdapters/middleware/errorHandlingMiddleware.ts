import { Errors } from "@shared/constants/error";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { ResponseHelper } from "@shared/utils/responseHelper";
import {
  AlreadyExisitingExecption,
  ApplicationException,
  DataMissingExecption,
  ForbiddenException,
  InvalidDataException,
  InvalidOTPExecption,
  IsBlockedExecption,
  NotFoundExecption,
  OTPExpiredException,
  PasswordNotMatchingException,
  TokenExpiredException,
  TokenMissingException,
} from "application/constants/exceptions";
import { NextFunction, Request, Response } from "express";

export const errorHandlingMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  void next;
  try {
    let statusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR;

    if (err instanceof ApplicationException) {
      if (err instanceof NotFoundExecption) {
        statusCode = HTTPSTATUS.NOT_FOUND;
      } else if (err instanceof AlreadyExisitingExecption) {
        statusCode = HTTPSTATUS.CONFLICT;
      } else if (err instanceof IsBlockedExecption || err instanceof ForbiddenException) {
        statusCode = HTTPSTATUS.FORBIDDEN;
      } else if (
        err instanceof InvalidOTPExecption ||
        err instanceof OTPExpiredException ||
        err instanceof DataMissingExecption ||
        err instanceof PasswordNotMatchingException ||
        err instanceof TokenMissingException ||
        err instanceof InvalidDataException
      ) {
        statusCode = HTTPSTATUS.BAD_REQUEST;
      } else if (err instanceof TokenExpiredException) {
        statusCode = HTTPSTATUS.UNAUTHORIZED;
      }
    }

    ResponseHelper.error(
      res,
      err instanceof Error ? err.message : Errors.INTERNAL_SERVER_ERROR,
      statusCode
    );
    console.log(err instanceof Error ? err.message : err);
  } catch (error) {
    console.log(error);
  }
};

import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { Response } from "express";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export class ResponseHelper {
  static success<T>(
    res: Response,
    message: string,
    data: T,
    status: number = HTTPSTATUS.OK
  ): Response<ApiResponse<T>> {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  }

  static error(
    res: Response,
    message: string,
    status: number = HTTPSTATUS.BAD_REQUEST
  ): Response<ApiResponse<null>> {
    return res.status(status).json({
      success: false,
      message,
      data: null,
    });
  }
}

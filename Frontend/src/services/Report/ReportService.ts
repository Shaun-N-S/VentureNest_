import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type { CreateReportPayload } from "../../types/ReportPayload";

export const createReport = async (payload: CreateReportPayload) => {
  const response = await AxiosInstance.post(API_ROUTES.REPORT.CREATE, payload, {
    withCredentials: true,
  });

  return response.data;
};

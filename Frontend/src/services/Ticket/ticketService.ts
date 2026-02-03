import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type { CreateTicketWithSessionPayload } from "../../types/ticket";

export const createTicketWithSession = async (
  payload: CreateTicketWithSessionPayload,
) => {
  const res = await AxiosInstance.post(API_ROUTES.TICKET.CREATE, payload, {
    withCredentials: true,
  });

  return res.data;
};

export const fetchInvestorTickets = async () => {
  const res = await AxiosInstance.get(API_ROUTES.TICKET.GET_BY_INVESTOR, {
    withCredentials: true,
  });

  return res.data.data;
};

import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type {
  AddSessionFeedbackDTO,
  CancelledSessionResponseDTO,
  CancelSessionDTO,
  JoinSessionResponseDTO,
  SessionFeedbackResponseDTO,
} from "../../types/session";

export const sessionService = {
  cancelSession: async (
    sessionId: string,
    payload: CancelSessionDTO,
  ): Promise<CancelledSessionResponseDTO> => {
    const { data } = await AxiosInstance.patch(
      API_ROUTES.SESSION.CANCEL_SESSION.replace(":sessionId", sessionId),
      payload,
    );

    return data.data;
  },

  addSessionFeedback: async (
    sessionId: string,
    payload: AddSessionFeedbackDTO,
  ): Promise<SessionFeedbackResponseDTO> => {
    const { data } = await AxiosInstance.post(
      API_ROUTES.SESSION.ADD_FEEDBACK.replace(":sessionId", sessionId),
      payload,
    );

    return data.data;
  },

  joinSession: async (sessionId: string): Promise<JoinSessionResponseDTO> => {
    const { data } = await AxiosInstance.post(
      API_ROUTES.SESSION.JOIN_REQUEST.replace(":sessionId", sessionId),
    );

    return data.data;
  },

  approveUser: async (sessionId: string, userId: string) => {
    const { data } = await AxiosInstance.post(
      API_ROUTES.SESSION.APPROVE_USER.replace(":sessionId", sessionId),
      { userId },
    );

    return data.data;
  },

  getSessionStatus: async (sessionId: string) => {
    const { data } = await AxiosInstance.get(
      API_ROUTES.SESSION.GET_STATUS.replace(":sessionId", sessionId),
    );

    return data.data;
  },
};

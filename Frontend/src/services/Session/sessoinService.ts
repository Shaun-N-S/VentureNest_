import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type {
  AddSessionFeedbackDTO,
  CancelledSessionResponseDTO,
  CancelSessionDTO,
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
  }
};

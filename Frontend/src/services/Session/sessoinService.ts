import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type {
  CancelledSessionResponseDTO,
  CancelSessionDTO,
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
};

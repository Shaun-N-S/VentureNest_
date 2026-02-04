import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type { CreatePitchPayload, PitchResponse } from "../../types/pitchType";

export const createPitch = async (
  payload: CreatePitchPayload,
): Promise<PitchResponse> => {
  const response = await AxiosInstance.post(API_ROUTES.PITCH.CREATE, payload, {
    withCredentials: true,
  });

  return response.data.data;
};

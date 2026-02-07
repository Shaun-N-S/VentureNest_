import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type { PaginatedResponses } from "../../types/pagination";
import type {
  CreatePitchPayload,
  PitchDetailsResponse,
  PitchResponse,
  ReceivedPitchListItem,
  RespondPitchPayload,
  SentPitchListItem,
} from "../../types/pitchType";

export const createPitch = async (
  payload: CreatePitchPayload,
): Promise<PitchResponse> => {
  const response = await AxiosInstance.post(API_ROUTES.PITCH.CREATE, payload, {
    withCredentials: true,
  });

  return response.data.data;
};

export const fetchReceivedPitches = async (
  page = 1,
  limit = 10,
  status?: string,
  search?: string,
): Promise<PaginatedResponses<ReceivedPitchListItem>> => {
  const response = await AxiosInstance.get(API_ROUTES.PITCH.RECEIVED, {
    params: { page, limit, status, search },
    withCredentials: true,
  });

  return response.data.data;
};

export const fetchSentPitches = async (
  page = 1,
  limit = 10,
  status?: string,
  search?: string,
): Promise<PaginatedResponses<SentPitchListItem>> => {
  const response = await AxiosInstance.get(API_ROUTES.PITCH.SENT, {
    params: { page, limit, status, search },
    withCredentials: true,
  });

  return response.data.data;
};

export const respondToPitch = async (
  payload: RespondPitchPayload,
): Promise<PitchDetailsResponse> => {
  const response = await AxiosInstance.patch(
    API_ROUTES.PITCH.RESPOND.replace(":pitchId", payload.pitchId),
    { message: payload.message },
    { withCredentials: true },
  );

  return response.data.data;
};

export const fetchPitchById = async (
  pitchId: string,
): Promise<PitchDetailsResponse> => {
  const res = await AxiosInstance.get(
    API_ROUTES.PITCH.GET_BY_ID.replace(":pitchId", pitchId),
    { withCredentials: true },
  );
  return res.data.data;
};

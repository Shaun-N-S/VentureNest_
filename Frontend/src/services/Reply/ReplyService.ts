import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type { ReplyFeedDTO } from "../../types/replyFeedType";

export const addReply = async (commentId: string, replyText: string) => {
  const response = await AxiosInstance.post(
    `${API_ROUTES.REPLY.ADD_REPLY}/${commentId}`,
    { replyText },
    { withCredentials: true }
  );
  return response.data;
};

export interface GetRepliesResponse {
  replies: ReplyFeedDTO[];
  total: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
}

export const getAllReplies = async (
  commentId: string,
  page: number,
  limit: number
): Promise<GetRepliesResponse> => {
  const response = await AxiosInstance.get(
    API_ROUTES.REPLY.FETCH_REPLY.replace(":commentId", commentId),
    { params: { page, limit }, withCredentials: true }
  );
  return response.data.data;
};

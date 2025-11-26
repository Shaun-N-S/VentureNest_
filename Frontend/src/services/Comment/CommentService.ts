import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";

export const addComment = async (postId: string, commentText: string) => {
  const response = await AxiosInstance.post(
    `${API_ROUTES.COMMENT.ADD_COMMENT}/${postId}`,
    { commentText }
  );
  return response.data;
};

export const getAllComments = async (
  postId: string,
  page: number,
  limit: number
) => {
  const response = await AxiosInstance.get(
    API_ROUTES.COMMENT.FETCH_COMMENT.replace(":postId", postId),
    {
      params: { page, limit },
      withCredentials: true,
    }
  );
  return response.data;
};

export const likeComment = async (commentId: string) => {
  const response = await AxiosInstance.post(
    API_ROUTES.COMMENT.LIKE_COMMENT.replace(":commentId", commentId)
  );
  return response.data;
};

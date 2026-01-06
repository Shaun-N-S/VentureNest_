import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";

export const addPost = async (formData: FormData) => {
  const response = await AxiosInstance.post(API_ROUTES.POST.ADD, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const fetchPersonalPosts = async (page: number, limit: number) => {
  const response = await AxiosInstance.get(
    API_ROUTES.POST.FETCH_PERSONAL_POST,
    {
      params: { page, limit },
      withCredentials: true,
    }
  );
  return response.data;
};

export const fetchAllPosts = async (page: number, limit: number) => {
  const response = await AxiosInstance.get(API_ROUTES.POST.FEED, {
    params: { page, limit },
    withCredentials: true,
  });
  return response.data.data.data;
};

export const removePost = async (postId: string) => {
  console.log("in service : : :  ", postId);
  const response = await AxiosInstance.patch(
    API_ROUTES.POST.REMOVE.replace(":id", postId)
  );
  return response.data;
};

export const likePost = async (postId: string) => {
  const response = await AxiosInstance.post(
    API_ROUTES.POST.LIKES.replace(":postId", postId)
  );
  return response.data;
};

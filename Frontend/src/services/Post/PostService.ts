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

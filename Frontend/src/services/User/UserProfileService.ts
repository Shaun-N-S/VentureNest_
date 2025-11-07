import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";

export const getUserProfile = async (id: string) => {
  const response = await AxiosInstance.get(
    API_ROUTES.USER.PROFILE.GET_PROFILE.replace(":id", id)
  );
  return response.data;
};

export const updateUserProfile = async (formData: FormData) => {
  const response = await AxiosInstance.patch(
    API_ROUTES.USER.PROFILE.UPDATE,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

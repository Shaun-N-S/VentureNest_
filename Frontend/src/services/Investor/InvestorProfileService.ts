import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";

export const profileCompletion = async (formData: FormData) => {
  const response = await AxiosInstance.post(
    API_ROUTES.AUTH.INVESTOR_PROFILE_COMPLETION,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const getInvestorProfile = async (id: string) => {
  const response = await AxiosInstance.get(
    API_ROUTES.INVESTOR.PROFILE.GET_PROFILE.replace(":id", id)
  );
  return response.data;
};

export const investorProfileUpdate = async (formData: FormData) => {
  const response = await AxiosInstance.patch(
    API_ROUTES.INVESTOR.PROFILE.UPDATE,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export const investorKYCUpdate = async (formData: FormData) => {
  const response = await AxiosInstance.patch(
    API_ROUTES.INVESTOR.KYC.UPDATE,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

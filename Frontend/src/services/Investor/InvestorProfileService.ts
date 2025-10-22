import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";



export const profileCompletion = async ({
  formData,
  investorId,
}: {
  formData: unknown;
  investorId: string;
}) => {
  const response = await AxiosInstance.post(
    API_ROUTES.AUTH.INVESTOR_PROFILE_COMPLETION,
    {
      formData,
      investorId,
    }
  );
  return response.data;
};

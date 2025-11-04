import AxiosInstance from "../../axios/axios"
import { API_ROUTES } from "../../constants/apiRoutes"

export const profileCompletion = async (formData: FormData) => {
  const response = await AxiosInstance.post(
    API_ROUTES.AUTH.INVESTOR_PROFILE_COMPLETION,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )
  return response.data
}
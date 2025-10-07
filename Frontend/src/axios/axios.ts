import axios from "axios";
import { store } from "../store/store";
import { API_ROUTES } from "../constants/apiRoutes";
import { clearData } from "../store/Slice/authDataSlice";
import { deleteToken, setToken } from "../store/Slice/tokenSlice";

const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

AxiosInstance.interceptors.request.use((config) => {
  const accessToken = store.getState().token.token;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

AxiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const orignialRequest = err.config;

    if (
      err.response.status === 401 &&
      err.response.data.error === "Invalid Token" &&
      !orignialRequest.retry
    ) {
      try {
        orignialRequest.retry = true;
        const response = await AxiosInstance.post(API_ROUTES.AUTH.REFRESH);
        store.dispatch(setToken(response.data.accessToken));
        orignialRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return AxiosInstance(orignialRequest);
      } catch (error) {
        console.log(error);
        const userRole = store.getState().authData.role;
        store.dispatch(clearData());
        store.dispatch(deleteToken());
        if (userRole === "INVESTOR") {
          window.location.href = `/${userRole}/login`;
        } else if (userRole === "ADMIN") {
          window.location.href = `/${userRole}/login`;
        } else {
          window.location.href = `/login`;
        }
      }
    }
    Promise.reject(err)
  }
);

export default AxiosInstance;

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
    const originalRequest = err.config;

    const status = err.response?.status;
    const message = err.response?.data?.message;

    /* ---------------- BLOCKED USER ---------------- */
    if (status === 403 && message?.toLowerCase().includes("blocked")) {
      const role = store.getState().authData.role;

      store.dispatch(clearData());
      store.dispatch(deleteToken());

      if (role === "INVESTOR") {
        window.location.href = "/investor/login";
      } else if (role === "ADMIN") {
        window.location.href = "/admin/login";
      } else {
        window.location.href = "/login";
      }

      return Promise.reject(err);
    }

    /* ---------------- TOKEN EXPIRED ---------------- */
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await AxiosInstance.post(API_ROUTES.AUTH.REFRESH);

        store.dispatch(setToken(response.data.data));
        originalRequest.headers.Authorization = `Bearer ${response.data.data}`;

        return AxiosInstance(originalRequest);
      } catch {
        const role = store.getState().authData.role;

        store.dispatch(clearData());
        store.dispatch(deleteToken());

        if (role === "INVESTOR") {
          window.location.href = "/investor/login";
        } else if (role === "ADMIN") {
          window.location.href = "/admin/login";
        } else {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(err);
  },
);

export default AxiosInstance;

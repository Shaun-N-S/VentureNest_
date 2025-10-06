import axios from "axios";
import { store } from "../store/store";

const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

AxiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().token.token;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// let isBlockedToastActive = false;

AxiosInstance.interceptors.response.use(
  // (response) => response,
  // async (error) => {
  //   const originalRequest = error.config;

  //   if (
  //     error.response &&
  //     error.response.status === 400 &&
  //     error.response.data.message === "User is blocked."
  //   ) {
  //     if (!isBlockedToastActive) {
  //     toast.error(error.response.data.message,{
  //       autoClose:1000,
  //       onClose:()=>{
          
  //       }
  //     })
  //     }
  //   }
  // }
);

export default AxiosInstance;

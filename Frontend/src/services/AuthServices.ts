import AxiosInstance from "../axios/axios";
import type { LoginPayload, SignupPayload } from "../types/AuthPayloads";

export const signupUser = async (data: SignupPayload) => {
  const response = await AxiosInstance.post("/auth/users", data);
  return response.data;
};

export const userVerifyOtp = async ({
  otp,
  values,
}: {
  otp: string;
  values: SignupPayload;
}) => {
  console.log(values, "values")
  const response = await AxiosInstance.post("/auth/users/verify-otp", {
    otp,
    ...values,
  });
  return response.data;
};

export const userResendOtp = async (email: string) => {
  const response = await AxiosInstance.post("/auth/users/resend-otp", {
    email,
  });
  return response.data;
};

export const loginUser = async (data: LoginPayload) => {
  const response = await AxiosInstance.post("/auth/users/login", data);
  return response.data;
};

import AxiosInstance from "../axios/axios";
import type { LoginPayload, SignupPayload } from "../types/AuthPayloads";

//users
export const signupUser = async (data: SignupPayload) => {
  const response = await AxiosInstance.post("/auth/users", data);
  return response.data;
};

export const userVerifyOtp = async ({
  otp,
  email,
}: {
  otp: string;
  email: string;
}) => {
  console.log(email, "values");
  const response = await AxiosInstance.post("/auth/users/verify-otp", {
    otp,
    email,
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

//investors
export const SignupInvestor = async (data: SignupPayload) => {
  const response = await AxiosInstance.post("/auth/investors", data);
  return response.data;
};

export const investorVerifyOtp = async ({
  otp,
  values,
}: {
  otp: string;
  values: SignupPayload;
}) => {
  const response = await AxiosInstance.post("/auth/investors/verify-otp", {
    otp,
    ...values,
  });
  return response.data;
};

export const investorResendOtp = async (email: string) => {
  const response = await AxiosInstance.post("/auth/investors/resend-otp", {
    email,
  });
  return response.data;
};

export const loginInvestor = async (data: LoginPayload) => {
  const response = await AxiosInstance.post("/auth/investors/login", data);
  return response.data;
};

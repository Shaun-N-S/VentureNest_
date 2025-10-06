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

export const userForgetPassword = async (email: string) => {
  const response = await AxiosInstance.post("/auth/users/forget-password", {
    email,
  });
  return response.data;
};

export const userForgetPasswordVerifyOtp = async ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) => {
  const response = await AxiosInstance.post(
    "/auth/users/forget-password/verify-otp",
    { email, otp }
  );
  return response.data;
};

export const userResetPassword = async ({
  email,
  newPassword,
  token,
}: {
  email: string;
  newPassword: string;
  token: string;
}) => {
  const response = await AxiosInstance.post(
    "/auth/users/forget-password/reset-password",
    { email, newPassword, token }
  );
  return response;
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

export const getAllUsers = async (
  page = 1,
  limit = 10,
  status?: string,
  search?: string
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) params.append("status", status);
  if (search) params.append("search", search);

  const response = await AxiosInstance.get(`/admin/users?${params.toString()}`);
  return response.data;
};

export const getAllInvestors = async (
  page = 1,
  limit = 10,
  status?: string,
  search?: string
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) params.append("status", status);
  if (search) params.append("search", search);

  const response = await AxiosInstance.get(
    `/admin/investors?${params.toString()}`
  );
  return response.data;
};

export const updateUserStatus = async ({
  userId,
  currentStatus,
}: {
  userId: string;
  currentStatus: string;
}) => {
  const response = await AxiosInstance.post("/admin/users/update-status", {
    userId,
    currentStatus,
  });
  return response;
};

export const updateInvestorStatus = async ({
  investorId,
  currentStatus,
}: {
  investorId: string;
  currentStatus: string;
}) => {
  const response = await AxiosInstance.post("/admin/investors/update-status", {
    investorId,
    currentStatus,
  });

  return response;
};

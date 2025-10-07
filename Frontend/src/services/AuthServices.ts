import { AxiosError } from "axios";
import AxiosInstance from "../axios/axios";
import { API_ROUTES } from "../constants/apiRoutes";
import type { LoginPayload, SignupPayload } from "../types/AuthPayloads";

// 🧍 Users
export const signupUser = async (data: SignupPayload) => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.USER_SIGNUP, data);
  return response.data;
};

export const userVerifyOtp = async ({
  otp,
  email,
}: {
  otp: string;
  email: string;
}) => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.USER_VERIFY_OTP, {
    otp,
    email,
  });
  return response.data;
};

export const userResendOtp = async (email: string) => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.USER_RESEND_OTP, {
    email,
  });
  return response.data;
};

export const userForgetPassword = async (email: string) => {
  const response = await AxiosInstance.post(
    API_ROUTES.AUTH.USER_FORGET_PASSWORD,
    { email }
  );
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
    API_ROUTES.AUTH.USER_FORGET_VERIFY_OTP,
    {
      email,
      otp,
    }
  );
  return response.data;
};

export const userResetPassword = async ({
  email,
  password,
  token,
}: {
  email: string;
  password: string;
  token: string;
}) => {
  const response = await AxiosInstance.post(
    API_ROUTES.AUTH.USER_RESET_PASSWORD,
    {
      email,
      password,
      token,
    }
  );
  return response.data;
};

export const investorResetPassword = async ({
  email,
  password,
  token,
}: {
  email: string;
  password: string;
  token: string;
}) => {
  const respones = await AxiosInstance.post(
    API_ROUTES.AUTH.INVESTOR_RESET_PASSWORD,
    { email, password, token }
  );
  return respones;
};

export const loginUser = async (data: LoginPayload) => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.USER_LOGIN, data);
  return response.data;
};

// Investors
export const signupInvestor = async (data: SignupPayload) => {
  const response = await AxiosInstance.post(
    API_ROUTES.AUTH.INVESTOR_SIGNUP,
    data
  );
  return response.data;
};

export const investorVerifyOtp = async ({
  otp,
  values,
}: {
  otp: string;
  values: SignupPayload;
}) => {
  const response = await AxiosInstance.post(
    API_ROUTES.AUTH.INVESTOR_VERIFY_OTP,
    {
      otp,
      ...values,
    }
  );
  return response.data;
};

export const investorResendOtp = async (email: string) => {
  const response = await AxiosInstance.post(
    API_ROUTES.AUTH.INVESTOR_RESEND_OTP,
    { email }
  );
  return response.data;
};

export const loginInvestor = async (data: LoginPayload) => {
  try {
    const response = await AxiosInstance.post(
      API_ROUTES.AUTH.INVESTOR_LOGIN,
      data
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.log("invester login error")
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error);
    }
    console.log("error");
  }
};

// Admin — Users
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

  const response = await AxiosInstance.get(
    `${API_ROUTES.ADMIN.USERS}?${params.toString()}`
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
  const response = await AxiosInstance.post(
    API_ROUTES.ADMIN.USERS_UPDATE_STATUS,
    {
      userId,
      currentStatus,
    }
  );
  return response.data;
};

//Admin — Investors
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
    `${API_ROUTES.ADMIN.INVESTORS}?${params.toString()}`
  );
  return response.data;
};

export const updateInvestorStatus = async ({
  investorId,
  currentStatus,
}: {
  investorId: string;
  currentStatus: string;
}) => {
  const response = await AxiosInstance.post(
    API_ROUTES.ADMIN.INVESTORS_UPDATE_STATUS,
    {
      investorId,
      currentStatus,
    }
  );
  return response.data;
};

export const logoutUser = async () => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.USERS_LOGOUT);
  return response.data;
};

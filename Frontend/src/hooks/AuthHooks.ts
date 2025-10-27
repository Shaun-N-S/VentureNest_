import { useMutation, useQuery } from "@tanstack/react-query";
import type { LoginPayload, SignupPayload } from "../types/AuthPayloads";
import {
  getAllInvestors,
  getAllUsers,
  investorResendOtp,
  investorVerifyOtp,
  loginInvestor,
  loginUser,
  signupInvestor,
  signupUser,
  updateUserStatus,
  userForgetPassword,
  userForgetPasswordVerifyOtp,
  userResendOtp,
  userResetPassword,
  userVerifyOtp,
  updateInvestorStatus,
  logoutUser,
  investorResetPassword,
  userGoogleLogin,
  investorGoogleLogin,
} from "../services/AuthServices";
import { profileCompletion } from "../services/Investor/InvestorProfileService";

//users
export const useUserSignUp = () => {
  return useMutation({
    mutationFn: (data: SignupPayload) => signupUser(data),
  });
};

export const useUserVerifyOtp = () => {
  return useMutation({
    mutationFn: ({ otp, email }: { otp: string; email: string }) =>
      userVerifyOtp({ otp, email }),
  });
};

export const useUserResendOtp = () => {
  return useMutation({
    mutationFn: (email: string) => userResendOtp(email),
  });
};

export const useUserForgetPassword = () => {
  return useMutation({
    mutationFn: (email: string) => userForgetPassword(email),
  });
};

export const useForgetPasswordVerifyOtp = () => {
  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      userForgetPasswordVerifyOtp({ email, otp }),
  });
};

export const useForgetPasswordResetPassword = () => {
  return useMutation({
    mutationFn: ({
      email,
      token,
      password,
    }: {
      email: string;
      token: string;
      password: string;
    }) => userResetPassword({ email, token, password }),
  });
};

export const useForgetPasswordInvestorResetPassword = () => {
  return useMutation({
    mutationFn: ({
      email,
      token,
      password,
    }: {
      email: string;
      token: string;
      password: string;
    }) => investorResetPassword({ email, token, password }),
  });
};

export const useUserLogin = () => {
  return useMutation({
    mutationFn: (data: LoginPayload) => loginUser(data),
  });
};

//investor
export const useInvestorSignUp = () => {
  return useMutation({
    mutationFn: (data: SignupPayload) => signupInvestor(data),
  });
};

export const useInvestorVerifyOtp = () => {
  return useMutation({
    mutationFn: ({ otp, values }: { otp: string; values: SignupPayload }) =>
      investorVerifyOtp({ otp, values }),
  });
};

export const useInvestorResendOtp = () => {
  return useMutation({
    mutationFn: (otp: string) => investorResendOtp(otp),
  });
};

export const useInvestorLogin = () => {
  return useMutation({
    mutationFn: (data: LoginPayload) => loginInvestor(data),
  });
};

export const useGetAllUsers = (
  page: number,
  limit: number,
  status?: string,
  search?: string
) => {
  return useQuery({
    queryKey: ["users", page, limit, status, search],
    queryFn: () => getAllUsers(page, limit, status, search),
  });
};

export const useGetAllInvestors = (
  page: number,
  limit: number,
  status?: string,
  search?: string
) => {
  return useQuery({
    queryKey: ["investors", page, limit, status, search],
    queryFn: () => getAllInvestors(page, limit, status, search),
  });
};

export const useUpdateUserStatus = () => {
  return useMutation({
    mutationFn: ({
      userId,
      currentStatus,
    }: {
      userId: string;
      currentStatus: string;
    }) => updateUserStatus({ userId, currentStatus }),
  });
};

export const useUpdateInvestorStatus = () => {
  return useMutation({
    mutationFn: ({
      investorId,
      currentStatus,
    }: {
      investorId: string;
      currentStatus: string;
    }) => updateInvestorStatus({ investorId, currentStatus }),
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: logoutUser,
  });
};

export const useGoogleLoginMutation = () => {
  return useMutation({
    mutationFn: userGoogleLogin,
  });
};

export const useInvestorGoogleLoginMutation = () => {
  return useMutation({
    mutationFn: investorGoogleLogin,
  });
};

export const useInvestorProfileCompletion = () => {
  return useMutation({
    mutationFn: ({
      formData,
      investorId,
    }: {
      formData: unknown;
      investorId: string;
    }) => profileCompletion({ formData, investorId }),
  });
};

import { useMutation, useQuery } from "@tanstack/react-query";
import type { LoginPayload, SignupPayload } from "../types/AuthPayloads";
import {
  getAllInvestors,
  getAllUsers,
  investorResendOtp,
  investorVerifyOtp,
  loginInvestor,
  loginUser,
  SignupInvestor,
  signupUser,
  updateUserStatus,
  userForgetPassword,
  userForgetPasswordVerifyOtp,
  userResendOtp,
  userResetPassword,
  userVerifyOtp,
  updateInvestorStatus,
} from "../services/AuthServices";

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
      newPassword,
    }: {
      email: string;
      token: string;
      newPassword: string;
    }) => userResetPassword({ email, token, newPassword }),
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
    mutationFn: (data: SignupPayload) => SignupInvestor(data),
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

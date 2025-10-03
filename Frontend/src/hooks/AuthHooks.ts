import { useMutation } from "@tanstack/react-query";
import type { LoginPayload, SignupPayload } from "../types/AuthPayloads";
import {
  investorResendOtp,
  investorVerifyOtp,
  loginInvestor,
  loginUser,
  SignupInvestor,
  signupUser,
  userResendOtp,
  userVerifyOtp,
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
    mutationFn: (otp: string) => userResendOtp(otp),
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

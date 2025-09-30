import { useMutation } from "@tanstack/react-query";
import type { LoginPayload, SignupPayload } from "../types/AuthPayloads";
import {
  loginUser,
  signupUser,
  userResendOtp,
  userVerifyOtp,
} from "../services/AuthServices";

export const useUserSignUp = () => {
  return useMutation({
    mutationFn: (data: SignupPayload) => signupUser(data),
  });
};

export const useUserVerifyOtp = () => {
  return useMutation({
    mutationFn: ({ otp, values }: { otp: string; values: SignupPayload }) =>
      userVerifyOtp({ otp, values }),
  });
};

export const useUserResendOpt = () => {
  return useMutation({
    mutationFn: (otp: string) => userResendOtp(otp),
  });
};

export const useUserLogin = () => {
  return useMutation({
    mutationFn: (data: LoginPayload) => loginUser(data),
  });
};

import { useMutation, useQuery } from "@tanstack/react-query";
import type { LoginPayload, SignupPayload } from "../../types/AuthPayloads";
import {
  investorResendOtp,
  investorVerifyOtp,
  loginInvestor,
  loginUser,
  signupInvestor,
  signupUser,
  userForgetPassword,
  userForgetPasswordVerifyOtp,
  userResendOtp,
  userResetPassword,
  userVerifyOtp,
  logoutUser,
  investorResetPassword,
  userGoogleLogin,
  investorGoogleLogin,
  setInterestedTopics,
} from "../../services/Auth/AuthServices";
import { profileCompletion } from "../../services/Investor/InvestorProfileService";
import { getProfileImg } from "../../services/Auth/AuthServices";

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
    mutationFn: (formData: FormData) => profileCompletion(formData),
  });
};

export const useGetProfileImg = (id: string) => {
  return useQuery({
    queryKey: ["profileImg"],
    queryFn: () => getProfileImg(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useIntrestedTopics = () => {
  return useMutation({
    mutationFn: ({
      id,
      interestedTopics,
    }: {
      id: string;
      interestedTopics: string[];
    }) => setInterestedTopics({ id, interestedTopics }),
  });
};

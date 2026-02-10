import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type { LoginPayload, SignupPayload } from "../../types/AuthPayloads";
import type { UserRole } from "../../types/UserRole";

// Users
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
    { email },
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
    },
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
    },
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
    { email, password, token },
  );
  return respones;
};

export const loginUser = async (data: LoginPayload) => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.USER_LOGIN, data);
  console.log("response", response);
  return response.data;
};

// Investors
export const signupInvestor = async (data: SignupPayload) => {
  const response = await AxiosInstance.post(
    API_ROUTES.AUTH.INVESTOR_SIGNUP,
    data,
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
    },
  );
  return response.data;
};

export const investorResendOtp = async (email: string) => {
  const response = await AxiosInstance.post(
    API_ROUTES.AUTH.INVESTOR_RESEND_OTP,
    { email },
  );
  return response.data;
};

export const loginInvestor = async (data: LoginPayload) => {
  const response = await AxiosInstance.post(
    API_ROUTES.AUTH.INVESTOR_LOGIN,
    data,
  );
  console.log(response);
  return response.data;
};

export const logoutUser = async () => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.USERS_LOGOUT);
  return response.data;
};

export const userGoogleLogin = async (data: {
  authorizationCode: string;
  role: string;
}) => {
  const response = await AxiosInstance.post(
    API_ROUTES.AUTH.USER_GOOGLE_LOGIN,
    data,
  );
  return response.data;
};

export const investorGoogleLogin = async (data: {
  authorizationCode: string;
  role: string;
}) => {
  const response = await AxiosInstance.post(
    API_ROUTES.AUTH.INVESTOR_GOOGLE_LOGIN,
    data,
  );
  return response.data;
};

export const getProfileImg = async (id: string) => {
  const response = await AxiosInstance.get(
    API_ROUTES.AUTH.GET_PROFILEIMG.replace(":id", id),
  );
  return response.data;
};

//interested topics
export const setInterestedTopics = async ({
  id,
  interestedTopics,
}: {
  id: string;
  interestedTopics: string[];
}) => {
  const response = await AxiosInstance.post("/auth/users/interested-topics", {
    id,
    interestedTopics,
  });
  return response;
};

export const requestChangePasswordOtp = async (role: UserRole) => {
  const url =
    role === "INVESTOR"
      ? API_ROUTES.AUTH.CHANGE_PASSWORD.INVESTOR.REQUEST_OTP
      : API_ROUTES.AUTH.CHANGE_PASSWORD.USER.REQUEST_OTP;

  const res = await AxiosInstance.post(url);
  return res.data;
};

export const verifyChangePasswordOtp = async (role: UserRole, otp: string) => {
  const url =
    role === "INVESTOR"
      ? API_ROUTES.AUTH.CHANGE_PASSWORD.INVESTOR.VERIFY_OTP
      : API_ROUTES.AUTH.CHANGE_PASSWORD.USER.VERIFY_OTP;

  const res = await AxiosInstance.post(url, { otp });
  return res.data;
};

export const changePassword = async (
  role: UserRole,
  { password, token }: { password: string; token: string },
) => {
  const url =
    role === "INVESTOR"
      ? API_ROUTES.AUTH.CHANGE_PASSWORD.INVESTOR.RESET
      : API_ROUTES.AUTH.CHANGE_PASSWORD.USER.RESET;

  const res = await AxiosInstance.post(url, { password, token });
  return res.data;
};

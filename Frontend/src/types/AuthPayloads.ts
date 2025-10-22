export type SignupPayload = {
  userName: string;
  email: string;
  password: string;
};

export type OtpPayload = {
  email: string;
  otp: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

// export type InvestorProfileCompletion = {};

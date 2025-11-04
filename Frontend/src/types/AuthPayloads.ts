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

export interface Investor {
  _id: string;
  userName: string;
  email: string;
  status: "ACTIVE" | "BLOCKED";
  companyName?: string;
  industry?: string;
}

export interface User {
  _id: string;
  userName: string;
  email: string;
  status: "ACTIVE" | "BLOCKED";
}

export interface IUserPagination {
  users: User[];
  totalUsers: number;
  totalPages: number;
  currentPage: number;
}
export interface IInvestorPagination {
  investors: Investor[];
  totalUsers: number;
  totalPages: number;
  currentPage: number;
}

export interface IUserDataWrapper {
  data: IUserPagination;
}
export interface IInvestorDataWrapper {
  data: IInvestorPagination;
}

export interface IGetAllUsersResponse {
  success: boolean;
  message: string;
  data: IUserDataWrapper;
}
export interface IGetAllInvestorsResponse {
  success: boolean;
  message: string;
  data: IInvestorDataWrapper;
}

// export type InvestorProfileCompletion = {};

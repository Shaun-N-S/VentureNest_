import type { KYCStatus } from "./KycStatusType";

export interface UserKyc {
  _id: string;
  userName: string;
  email: string;
  status: KYCStatus;
}

export interface InvestorKyc {
  _id: string;
  userName: string;
  email: string;
  status: KYCStatus;
}

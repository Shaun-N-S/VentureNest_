import { IBaseEmailTemplate } from "./IBaseEmailTemplate";

export interface IOtpEmailTemplate extends IBaseEmailTemplate {
  otp: string;
}

import { IBaseEmailTemplate } from "./IBaseEmailTemplate";

export interface IEmailService {
  sendEmail(email: Required<IBaseEmailTemplate>): Promise<void>;
}

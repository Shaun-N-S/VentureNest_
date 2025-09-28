export interface IBaseEmailTemplate {
  receiverEmail: string | string[];
  subject: string;
  content?: string;
}

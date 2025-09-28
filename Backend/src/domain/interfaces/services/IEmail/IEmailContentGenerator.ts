export interface IEmailContentGenerator {
  generateTemplate(otp: string): string;
}

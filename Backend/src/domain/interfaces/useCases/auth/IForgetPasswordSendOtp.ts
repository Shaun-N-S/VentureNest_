export interface IForgetPasswordSendOtpUseCaes {
  sendOtp(email: string): Promise<void>;
}

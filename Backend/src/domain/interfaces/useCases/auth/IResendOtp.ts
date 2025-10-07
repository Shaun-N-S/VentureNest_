export interface IResendOtpUseCase {
  resendOtp(email: string): Promise<void>;
}

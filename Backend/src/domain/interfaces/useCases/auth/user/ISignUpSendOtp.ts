export interface ISignUpSendOtpUseCase {
  signUpSendOtp(email: string): Promise<void>;
}

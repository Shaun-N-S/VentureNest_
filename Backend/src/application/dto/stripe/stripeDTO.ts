export interface CreateStripeAccountResponseDTO {
  accountId: string;
}

export interface StripeOnboardingLinkResponseDTO {
  url: string;
}

export interface WithdrawToBankDTO {
  amount: number;
}

export interface WithdrawToBankResponseDTO {
  success: boolean;
}

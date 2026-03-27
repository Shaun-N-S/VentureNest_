import { StripeOnboardingLinkResponseDTO } from "application/dto/stripe/stripeDTO";

export interface IGetStripeOnboardingLinkUseCase {
  execute(userId: string): Promise<StripeOnboardingLinkResponseDTO>;
}

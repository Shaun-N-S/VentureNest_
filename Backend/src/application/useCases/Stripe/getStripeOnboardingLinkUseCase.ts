import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IStripeConnectService } from "@domain/interfaces/services/IStripeConnectService";
import { IGetStripeOnboardingLinkUseCase } from "@domain/interfaces/useCases/stripe/IGetStripeOnboardingLinkUseCase";
import { STRIPE_ERRORS } from "@shared/constants/error";

export class GetStripeOnboardingLinkUseCase implements IGetStripeOnboardingLinkUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _stripeService: IStripeConnectService
  ) {}

  async execute(userId: string) {
    const user = await this._userRepo.findById(userId);

    if (!user?.stripeAccountId) {
      throw new Error(STRIPE_ERRORS.ACCOUNT_NOT_FOUND);
    }

    return this._stripeService.createOnboardingLink(user.stripeAccountId);
  }
}

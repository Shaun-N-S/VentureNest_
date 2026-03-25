import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IStripeConnectService } from "@domain/interfaces/services/IStripeConnectService";
import { ICreateStripeAccountUseCase } from "@domain/interfaces/useCases/stripe/ICreateStripeAccountUseCase";
import { USER_ERRORS } from "@shared/constants/error";
import { NotFoundExecption } from "application/constants/exceptions";

export class CreateStripeAccountUseCase implements ICreateStripeAccountUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _stripeService: IStripeConnectService
  ) {}

  async execute(userId: string) {
    const user = await this._userRepo.findById(userId);

    if (!user) throw new NotFoundExecption(USER_ERRORS.USER_NOT_FOUND);

    if (user.stripeAccountId) {
      return { accountId: user.stripeAccountId };
    }

    const { accountId } = await this._stripeService.createAccount(user.email);

    await this._userRepo.update(userId, {
      stripeAccountId: accountId,
    });

    return { accountId };
  }
}

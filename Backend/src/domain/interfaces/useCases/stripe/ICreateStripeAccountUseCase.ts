import { CreateStripeAccountResponseDTO } from "application/dto/stripe/stripeDTO";

export interface ICreateStripeAccountUseCase {
  execute(userId: string): Promise<CreateStripeAccountResponseDTO>;
}

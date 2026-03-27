import { WithdrawToBankDTO, WithdrawToBankResponseDTO } from "application/dto/stripe/stripeDTO";

export interface IWithdrawToBankUseCase {
  execute(userId: string, dto: WithdrawToBankDTO): Promise<WithdrawToBankResponseDTO>;
}

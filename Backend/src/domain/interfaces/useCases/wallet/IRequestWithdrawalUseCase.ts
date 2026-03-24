import { WithdrawalResponseDTO } from "application/dto/wallet/withdrawalDTO";

export interface IRequestWithdrawalUseCase {
  execute(
    userId: string,
    projectId: string,
    amount: number,
    reason: string
  ): Promise<WithdrawalResponseDTO>;
}

import { RequestWithdrawalDTO, WithdrawalResponseDTO } from "application/dto/wallet/withdrawalDTO";

export interface IRequestWithdrawalUseCase {
  execute(userId: string, dto: RequestWithdrawalDTO): Promise<WithdrawalResponseDTO>;
}

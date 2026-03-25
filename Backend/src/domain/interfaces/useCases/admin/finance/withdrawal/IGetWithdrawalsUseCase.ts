import {
  GetWithdrawalsRequestDTO,
  GetWithdrawalsResponseDTO,
} from "application/dto/wallet/getWithdrawalsDTO";

export interface IGetWithdrawalsUseCase {
  execute(dto: GetWithdrawalsRequestDTO): Promise<GetWithdrawalsResponseDTO>;
}

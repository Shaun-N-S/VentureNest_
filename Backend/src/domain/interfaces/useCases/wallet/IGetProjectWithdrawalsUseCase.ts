import {
  GetProjectWithdrawalsRequestDTO,
  GetProjectWithdrawalsResponseDTO,
} from "application/dto/wallet/getProjectWithdrawalsDTO";

export interface IGetProjectWithdrawalsUseCase {
  execute(
    userId: string,
    dto: GetProjectWithdrawalsRequestDTO
  ): Promise<GetProjectWithdrawalsResponseDTO>;
}

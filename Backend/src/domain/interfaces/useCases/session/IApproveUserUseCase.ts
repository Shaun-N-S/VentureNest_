import { ApproveUserDTO, ApproveUserResponseDTO } from "application/dto/session/ApproveUserDTO";

export interface IApproveUserUseCase {
  execute(data: ApproveUserDTO): Promise<ApproveUserResponseDTO>;
}

import { ReleaseDealInstallmentDTO } from "application/dto/deal/releaseInstallmentDTO";

export interface IReleaseDealInstallmentUseCase {
  execute(investorId: string, dto: ReleaseDealInstallmentDTO): Promise<void>;
}

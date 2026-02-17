import { DealSummaryDTO } from "application/dto/deal/dealResponseDTO";
import { UserRole } from "@domain/enum/userRole";

export interface IGetMyDealsUseCase {
  execute(userId: string, role: UserRole): Promise<DealSummaryDTO[]>;
}

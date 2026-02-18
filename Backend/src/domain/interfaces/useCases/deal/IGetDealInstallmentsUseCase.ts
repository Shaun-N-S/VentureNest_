import { UserRole } from "@domain/enum/userRole";
import { DealInstallmentDTO } from "application/dto/deal/dealDetailsResponseDTO";

export interface IGetDealInstallmentsUseCase {
  execute(userId: string, role: UserRole, dealId: string): Promise<DealInstallmentDTO[]>;
}

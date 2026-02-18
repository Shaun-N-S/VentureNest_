import { DealDetailsResponseDTO } from "application/dto/deal/dealDetailsResponseDTO";
import { UserRole } from "@domain/enum/userRole";

export interface IGetDealDetailsUseCase {
  execute(userId: string, role: UserRole, dealId: string): Promise<DealDetailsResponseDTO>;
}

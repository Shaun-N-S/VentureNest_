import { HandleDealInstallmentStripeCompletedDTO } from "application/dto/deal/dealInstallmentResponseDTO";

export interface IHandleDealInstallmentStripeCompletedUseCase {
  execute(dto: HandleDealInstallmentStripeCompletedDTO): Promise<void>;
}
